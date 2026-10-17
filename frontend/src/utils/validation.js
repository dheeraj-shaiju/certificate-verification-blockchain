// All form validation rules live here, so they are easy to find and change.
import { COURSES, MAX_PDF_SIZE_BYTES, MIN_GRADUATION_YEAR, MAX_GRADUATION_YEAR } from './constants';
import { formatBytes } from './formatters';
import { hasPdfSignature } from './fileHelpers';

const NAME_PATTERN = /^[A-Za-z][A-Za-z .'-]*$/;
const STUDENT_ID_PATTERN = /^[A-Z0-9]{6,15}$/;

// Removes extra spaces and normalises the values before validating or saving.
export function cleanFormValues(values) {
  return {
    studentName: values.studentName.trim().replace(/\s+/g, ' '),
    studentId: values.studentId.trim().toUpperCase(),
    course: values.course,
    graduationYear: values.graduationYear.toString().trim(),
  };
}

/**
 * Checks the text fields of the admin form.
 * @param values  - form values (already cleaned)
 * @param records - existing certificate records, used for duplicate checks
 * @returns an object like { studentName: 'error message' } (empty object = no errors)
 */
export function validateCertificateFields(values, records = []) {
  const errors = {};
  const { studentName, studentId, course, graduationYear } = values;

  // Student name
  if (!studentName) {
    errors.studentName = 'Enter the student’s full name.';
  } else if (studentName.length < 3 || studentName.length > 60) {
    errors.studentName = 'Name must be between 3 and 60 characters.';
  } else if (!NAME_PATTERN.test(studentName)) {
    errors.studentName = 'Use letters, spaces, dots, hyphens or apostrophes only.';
  }

  // Student ID
  if (!studentId) {
    errors.studentId = 'Enter the student ID (e.g. TCR22CS008).';
  } else if (!STUDENT_ID_PATTERN.test(studentId)) {
    errors.studentId = 'Student ID must be 6–15 letters or digits, with no spaces.';
  } else {
    const sameIdRecord = records.find((r) => r.studentId === studentId);
    if (
      sameIdRecord &&
      studentName &&
      sameIdRecord.studentName.toLowerCase() !== studentName.toLowerCase()
    ) {
      errors.studentId = `This ID already belongs to ${sameIdRecord.studentName}. Check the ID or the name.`;
    }
  }

  // Course
  if (!course) {
    errors.course = 'Select a course.';
  } else if (!COURSES.includes(course)) {
    errors.course = 'Select a course from the list.';
  } else if (studentId && !errors.studentId) {
    const duplicate = records.find((r) => r.studentId === studentId && r.course === course);
    if (duplicate) {
      errors.course = `A certificate for this course was already issued (${duplicate.certificateId}).`;
    }
  }

  // Graduation year
  const year = Number(graduationYear);
  if (!graduationYear) {
    errors.graduationYear = 'Enter the graduation year.';
  } else if (!Number.isInteger(year)) {
    errors.graduationYear = 'Year must be a whole number, like 2026.';
  } else if (year < MIN_GRADUATION_YEAR || year > MAX_GRADUATION_YEAR) {
    errors.graduationYear = `Year must be between ${MIN_GRADUATION_YEAR} and ${MAX_GRADUATION_YEAR}.`;
  }

  return errors;
}

/**
 * Checks the uploaded certificate file.
 * @returns an error message, or null if the file is fine.
 */
export async function validatePdfFile(file) {
  if (!file) return 'Choose the PDF certificate to upload.';

  const hasPdfExtension = file.name.toLowerCase().endsWith('.pdf');
  // Some systems report an empty type for PDFs, so we allow '' and check the content below.
  const hasPdfType = file.type === 'application/pdf' || file.type === '';
  if (!hasPdfExtension || !hasPdfType) {
    return `“${file.name}” is not a PDF. Only .pdf files are accepted.`;
  }
  if (file.size === 0) return 'This file is empty. Choose another PDF.';
  if (file.size > MAX_PDF_SIZE_BYTES) {
    return `This file is ${formatBytes(file.size)}. The maximum size is ${formatBytes(MAX_PDF_SIZE_BYTES)}.`;
  }
  if (!(await hasPdfSignature(file))) {
    return 'This file is named .pdf but its contents are not a valid PDF.';
  }
  return null;
}
