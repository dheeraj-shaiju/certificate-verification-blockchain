// Generates IDs like CERT-2026-K7QM-4XPA.
// Characters that look alike (I, O, 0, 1) are left out so IDs are easy to read aloud.
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // 32 characters

function randomCode(length) {
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(bytes, (byte) => ALPHABET[byte % ALPHABET.length]).join('');
}

/**
 * @param {number} year - graduation year, used inside the ID
 * @param {Set<string>} existingIds - IDs already in use, so we never repeat one
 */
export function generateCertificateId(year, existingIds = new Set()) {
  let id;
  do {
    const code = randomCode(8);
    id = `CERT-${year}-${code.slice(0, 4)}-${code.slice(4)}`;
  } while (existingIds.has(id));
  return id;
}
