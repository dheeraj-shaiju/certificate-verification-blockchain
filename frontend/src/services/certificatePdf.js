/**
 * Creates a simple, realistic-looking degree certificate PDF with jsPDF.
 * Used for the sample data and for the "Generate sample PDF" button,
 * so the demo never depends on having a PDF file at hand.
 * Every generated PDF is clearly marked as a SAMPLE.
 */
import { jsPDF } from 'jspdf';
import { getInstitution } from '../utils/constants';

export function createCertificatePdf({
  studentName,
  studentId,
  course,
  graduationYear,
  institutionId,
}) {
  const institution = getInstitution(institutionId);
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const centerX = 148.5; // A4 landscape is 297 mm wide

  // Paper and borders
  doc.setFillColor(250, 251, 255);
  doc.rect(0, 0, 297, 210, 'F');
  doc.setDrawColor(14, 116, 144);
  doc.setLineWidth(1.6);
  doc.rect(10, 10, 277, 190);
  doc.setLineWidth(0.4);
  doc.rect(14, 14, 269, 182);

  // Institution
  doc.setTextColor(15, 23, 42);
  doc.setFont('times', 'bold');
  doc.setFontSize(17);
  doc.text(institution.name.toUpperCase(), centerX, 34, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  doc.text(`Affiliated to ${institution.university}`, centerX, 41, { align: 'center' });

  // Title
  doc.setFont('times', 'bolditalic');
  doc.setFontSize(32);
  doc.setTextColor(14, 116, 144);
  doc.text('Degree Certificate', centerX, 64, { align: 'center' });

  // Body
  doc.setTextColor(30, 41, 59);
  doc.setFont('times', 'normal');
  doc.setFontSize(14);
  doc.text('This is to certify that', centerX, 84, { align: 'center' });

  doc.setFont('times', 'bold');
  doc.setFontSize(28);
  doc.setTextColor(15, 23, 42);
  doc.text(studentName, centerX, 100, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(71, 85, 105);
  doc.text(`Register No. ${studentId}`, centerX, 109, { align: 'center' });

  doc.setFont('times', 'normal');
  doc.setFontSize(14);
  doc.setTextColor(30, 41, 59);
  doc.text('has been admitted to the degree of', centerX, 124, { align: 'center' });

  doc.setFont('times', 'bold');
  doc.setFontSize(19);
  doc.text(course, centerX, 137, { align: 'center' });

  doc.setFont('times', 'normal');
  doc.setFontSize(14);
  doc.text(
    `having fulfilled all the requirements prescribed, in the year ${graduationYear}.`,
    centerX,
    150,
    { align: 'center' },
  );

  // Signatures
  doc.setDrawColor(100, 116, 139);
  doc.setLineWidth(0.3);
  doc.line(36, 176, 96, 176);
  doc.line(201, 176, 261, 176);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  doc.text('Controller of Examinations', 66, 182, { align: 'center' });
  doc.text('Principal', 231, 182, { align: 'center' });

  // Sample notice
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('SAMPLE CERTIFICATE - generated for prototype demonstration only', centerX, 193, {
    align: 'center',
  });

  return doc.output('blob');
}
