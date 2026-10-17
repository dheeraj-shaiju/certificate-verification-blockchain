// Helpers for working with files (PDFs and images) in the browser.

/**
 * Creates a SHA-256 "fingerprint" of a file.
 * Any change to the PDF, even one character, produces a completely different hash.
 * In Phase II this hash is what would be stored on the blockchain.
 * Returns null if the browser does not allow hashing (non-HTTPS pages other than localhost).
 */
export async function sha256Hex(blob) {
  if (!window.crypto?.subtle) return null;
  const buffer = await blob.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

// Real PDF files always start with the characters "%PDF-".
export async function hasPdfSignature(file) {
  const header = await file.slice(0, 5).text();
  return header === '%PDF-';
}

// Triggers a browser download for a Blob (file data in memory).
export function downloadBlob(blob, fileName) {
  const url = URL.createObjectURL(blob);
  downloadUrl(url, fileName);
  // Give the browser a moment to start the download before freeing memory.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function downloadUrl(url, fileName) {
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export function certificateFileName(record) {
  return `Certificate_${record.studentId}_${record.certificateId}.pdf`;
}
