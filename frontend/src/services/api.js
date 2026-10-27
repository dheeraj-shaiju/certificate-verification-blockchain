/**
 * Talks to the Node.js backend in the backend/ folder.
 *
 *   GET  /api/status              -> { message }
 *   POST /api/certificates/issue  -> form-data: certificatePDF (the file), studentRegNo
 *                                    returns { message, sha256Fingerprint, ipfsCID }
 *
 * The backend address can be changed with VITE_API_URL in frontend/.env
 * (default: http://localhost:5000).
 */

export const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');

// Public Pinata gateway: opens a file on IPFS from its CID.
const IPFS_GATEWAY = 'https://gateway.pinata.cloud/ipfs/';

export function ipfsUrl(cid) {
  return `${IPFS_GATEWAY}${cid}`;
}

// fetch() that gives up after "ms" milliseconds instead of waiting forever.
async function fetchWithTimeout(url, options = {}, ms = 5000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

// true if the backend answers on /api/status
export async function isBackendOnline() {
  try {
    const response = await fetchWithTimeout(`${API_URL}/api/status`, {}, 2500);
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Sends the PDF to the backend, which hashes it and stores it on IPFS.
 * @returns {{ cid: string, hash: string }}
 * Throws an Error with a readable message if anything goes wrong.
 */
export async function uploadCertificateToIpfs(file, studentRegNo) {
  const formData = new FormData();
  formData.append('studentRegNo', studentRegNo);
  formData.append('certificatePDF', file, file.name);

  let response;
  try {
    // Uploading to IPFS can take a while, so allow up to 60 seconds.
    response = await fetchWithTimeout(
      `${API_URL}/api/certificates/issue`,
      { method: 'POST', body: formData },
      60000,
    );
  } catch {
    throw new Error('The backend is not reachable.');
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || `The backend returned error ${response.status}.`);
  if (!data.ipfsCID) throw new Error('The backend did not return an IPFS CID.');

  return { cid: data.ipfsCID, hash: data.sha256Fingerprint };
}
