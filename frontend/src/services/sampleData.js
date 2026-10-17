/**
 * Realistic demo data for two colleges, created the first time the app opens
 * (and again whenever "Reset demo data" is used).
 */
import { createCertificatePdf } from './certificatePdf';
import { savePdf } from './storage';
import { generateCertificateId } from '../utils/certificateId';
import { sha256Hex } from '../utils/fileHelpers';
import { PROTOTYPE_STATUS, getInstitution } from '../utils/constants';

const SAMPLE_STUDENTS = [
  // Government Engineering College, Thrissur
  {
    institutionId: 'gect',
    studentName: 'Ananya Menon',
    studentId: 'TCR22CS008',
    course: 'B.Tech Computer Science & Engineering',
    graduationYear: 2026,
    issuedAt: '2026-07-14T10:30:00+05:30',
  },
  {
    institutionId: 'gect',
    studentName: 'Rahul Krishnan',
    studentId: 'TCR22EC045',
    course: 'B.Tech Electronics & Communication Engineering',
    graduationYear: 2026,
    issuedAt: '2026-07-14T11:05:00+05:30',
  },
  {
    institutionId: 'gect',
    studentName: 'Fathima Nasrin',
    studentId: 'TCR19ME019',
    course: 'B.Tech Mechanical Engineering',
    graduationYear: 2023,
    issuedAt: '2023-08-02T09:45:00+05:30',
  },
  {
    institutionId: 'gect',
    studentName: 'Fathima Nasrin',
    studentId: 'TCR19ME019',
    course: 'M.Tech Computer Science & Engineering',
    graduationYear: 2025,
    issuedAt: '2025-08-21T16:10:00+05:30',
  },
  // Government Engineering College, Kozhikode
  {
    institutionId: 'geck',
    studentName: 'Nikhil Varghese',
    studentId: 'KKE22CS017',
    course: 'B.Tech Computer Science & Engineering',
    graduationYear: 2026,
    issuedAt: '2026-07-16T10:00:00+05:30',
  },
  {
    institutionId: 'geck',
    studentName: 'Sneha Raj',
    studentId: 'KKE21EE009',
    course: 'B.Tech Electrical & Electronics Engineering',
    graduationYear: 2025,
    issuedAt: '2025-07-30T12:15:00+05:30',
  },
];

export async function createSampleData() {
  const usedIds = new Set();
  const records = [];

  for (const student of SAMPLE_STUDENTS) {
    const certificateId = generateCertificateId(student.graduationYear, usedIds);
    usedIds.add(certificateId);

    const pdfBlob = createCertificatePdf(student);
    await savePdf(certificateId, pdfBlob);

    records.push({
      certificateId,
      institutionId: student.institutionId,
      institutionName: getInstitution(student.institutionId).name,
      studentName: student.studentName,
      studentId: student.studentId,
      course: student.course,
      graduationYear: student.graduationYear,
      fileName: `${student.studentId}_degree_certificate.pdf`,
      fileSize: pdfBlob.size,
      fileHash: await sha256Hex(pdfBlob),
      issuedAt: new Date(student.issuedAt).toISOString(),
      status: PROTOTYPE_STATUS,
      isSample: true,
    });
  }

  // Newest first
  return records.sort((a, b) => b.issuedAt.localeCompare(a.issuedAt));
}
