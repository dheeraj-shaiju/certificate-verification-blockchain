/**
 * Builds the text stored inside a certificate's QR code.
 *
 * It is plain readable text, so any phone camera or QR app shows the details
 * during the demo. In Phase II this will become a verification link that the
 * employer page checks against the blockchain.
 */
export function buildQrPayload(record) {
  return [
    'CertVerify certificate',
    `Certificate ID: ${record.certificateId}`,
    `Name: ${record.studentName}`,
    `Student ID: ${record.studentId}`,
    `Course: ${record.course}`,
    `Graduation year: ${record.graduationYear}`,
    `Issuer: ${record.institutionName}`,
    `PDF SHA-256: ${record.fileHash || 'not available'}`,
    `IPFS CID: ${record.ipfsCID || 'not uploaded'}`,
  ].join('\n');
}
