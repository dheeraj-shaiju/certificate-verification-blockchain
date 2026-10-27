/**
 * Shared application state.
 *
 * Both dashboards read certificates from here, so a certificate issued on the
 * Admin page appears on the Student page straight away.
 *
 * Usage inside any component:
 *   const { records, addCertificate } = useCertificates();
 */
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import {
  loadRecords,
  saveRecords,
  savePdf,
  getPdf,
  deletePdf,
  clearAllData,
} from '../services/storage';
import { createSampleData } from '../services/sampleData';
import { generateCertificateId } from '../utils/certificateId';
import { sha256Hex } from '../utils/fileHelpers';
import {
  PROTOTYPE_STATUS,
  IPFS_STATUS,
  DEFAULT_INSTITUTION_ID,
  getInstitution,
} from '../utils/constants';
import { uploadCertificateToIpfs } from '../services/api';

const CertificateContext = createContext(null);

// Records saved by older versions of the prototype had no college; treat them as GEC Thrissur.
function addMissingInstitution(record) {
  if (record.institutionId) return record;
  const institution = getInstitution(DEFAULT_INSTITUTION_ID);
  return { ...record, institutionId: institution.id, institutionName: institution.name };
}

export function CertificateProvider({ children }) {
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const hasStarted = useRef(false); // stops React's dev mode from loading twice

  // 1. On first load: read saved records, or create sample data on the very first visit.
  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    async function initialise() {
      try {
        const saved = loadRecords();
        if (saved) {
          setRecords(saved.map(addMissingInstitution));
        } else {
          setRecords(await createSampleData());
        }
      } catch (error) {
        console.error(error);
        setLoadError('Browser storage is unavailable. Private/incognito mode can block it.');
      } finally {
        setIsLoading(false);
      }
    }
    initialise();
  }, []);

  // 2. Whenever records change, save them so they survive a page refresh.
  useEffect(() => {
    if (!isLoading) saveRecords(records);
  }, [records, isLoading]);

  /**
   * Issue a new certificate for the admin's college.
   * 1. create a certificate ID and a SHA-256 fingerprint of the PDF
   * 2. send the PDF to the backend, which stores it on IPFS and returns its CID
   *    (if the backend is not running, the certificate is still issued, browser-only)
   * 3. keep a copy of the PDF in the browser so it can be viewed quickly and offline
   * Returns { record, uploadedToIpfs, backendError }.
   */
  async function addCertificate(values, file, institutionId) {
    const institution = getInstitution(institutionId);
    const existingIds = new Set(records.map((r) => r.certificateId));
    const year = Number(values.graduationYear);
    const certificateId = generateCertificateId(year, existingIds);

    const pdfBlob = new Blob([file], { type: 'application/pdf' });
    const fileHash = await sha256Hex(pdfBlob);

    let ipfsCID = null;
    let backendError = '';
    try {
      const result = await uploadCertificateToIpfs(file, values.studentId);
      // Both sides hashed the same file, so the fingerprints must match.
      if (fileHash && result.hash && result.hash !== fileHash) {
        throw new Error('The fingerprint from the server does not match this PDF.');
      }
      ipfsCID = result.cid;
    } catch (error) {
      backendError = error.message;
    }

    await savePdf(certificateId, pdfBlob);

    const newRecord = {
      certificateId,
      institutionId: institution.id,
      institutionName: institution.name,
      studentName: values.studentName,
      studentId: values.studentId,
      course: values.course,
      graduationYear: year,
      fileName: file.name,
      fileSize: file.size,
      fileHash,
      ipfsCID, // null when the backend was not reachable
      issuedAt: new Date().toISOString(),
      status: ipfsCID ? IPFS_STATUS : PROTOTYPE_STATUS,
      isSample: false,
    };

    setRecords((current) => [newRecord, ...current]);
    return { record: newRecord, uploadedToIpfs: Boolean(ipfsCID), backendError };
  }

  async function deleteCertificate(certificateId) {
    await deletePdf(certificateId);
    setRecords((current) => current.filter((r) => r.certificateId !== certificateId));
  }

  async function resetDemoData() {
    setIsLoading(true);
    await clearAllData();
    setRecords(await createSampleData());
    setIsLoading(false);
  }

  function getCertificatesForStudent(studentId) {
    const id = studentId.trim().toUpperCase();
    return records.filter((r) => r.studentId === id);
  }

  const value = {
    records,
    isLoading,
    loadError,
    addCertificate,
    deleteCertificate,
    resetDemoData,
    getCertificatesForStudent,
    getPdf, // (certificateId) => Promise<Blob | undefined>
  };

  return <CertificateContext.Provider value={value}>{children}</CertificateContext.Provider>;
}

export function useCertificates() {
  const context = useContext(CertificateContext);
  if (!context) {
    throw new Error('useCertificates must be used inside <CertificateProvider>.');
  }
  return context;
}
