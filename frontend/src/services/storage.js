/**
 * Browser storage for the prototype.
 *
 * - Certificate records (small text data) -> localStorage
 * - PDF files (large binary data)          -> IndexedDB, via the tiny "idb-keyval" library
 *
 * localStorage only holds about 5 MB of text, which is too small for PDFs,
 * so the files go into IndexedDB instead. Both survive page refreshes.
 *
 * In Phase II this file is the one to replace with calls to the
 * Node.js / Express backend (MongoDB + IPFS via Pinata).
 */
import { get, set, del, clear, createStore } from 'idb-keyval';

const RECORDS_KEY = 'cvs.certificates.v2'; // v2: records include the issuing college
const OLD_RECORDS_KEYS = ['cvs.certificates.v1'];
const LAST_STUDENT_KEY = 'cvs.lastStudentId';
const pdfStore = createStore('cvs-certificate-files', 'pdfs');

// ---------- Certificate records ----------

// Returns the saved array, or null if nothing has been saved yet (first visit).
export function loadRecords() {
  try {
    // Older versions stored single-college records; drop them so the new sample data loads.
    OLD_RECORDS_KEYS.forEach((key) => localStorage.removeItem(key));
    const raw = localStorage.getItem(RECORDS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.error('Could not read saved certificates:', error);
    return null;
  }
}

export function saveRecords(records) {
  try {
    localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
  } catch (error) {
    console.error('Could not save certificates:', error);
  }
}

// ---------- PDF files ----------

export function savePdf(certificateId, blob) {
  return set(certificateId, blob, pdfStore);
}

export function getPdf(certificateId) {
  return get(certificateId, pdfStore);
}

export function deletePdf(certificateId) {
  return del(certificateId, pdfStore);
}

// ---------- Student dashboard: remember the last student ID ----------

export function loadLastStudentId() {
  try {
    return localStorage.getItem(LAST_STUDENT_KEY) || '';
  } catch {
    return '';
  }
}

export function saveLastStudentId(studentId) {
  try {
    localStorage.setItem(LAST_STUDENT_KEY, studentId);
  } catch {
    // Ignore: remembering the student is only a convenience.
  }
}

// ---------- Reset ----------

export async function clearAllData() {
  localStorage.removeItem(RECORDS_KEY);
  localStorage.removeItem(LAST_STUDENT_KEY);
  await clear(pdfStore);
}
