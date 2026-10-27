/**
 * Admin form for issuing a certificate.
 * Steps on "Issue certificate":
 *   1. clean and validate every field
 *   2. validate the PDF (type, size and real PDF content)
 *   3. save through the shared context, which creates the certificate ID
 */
import { useState } from 'react';
import { FilePlus2, Sparkles } from 'lucide-react';
import FormField from './FormField';
import FileDropzone from './FileDropzone';
import { useCertificates } from '../context/CertificateContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { COURSES, MAX_GRADUATION_YEAR, MIN_GRADUATION_YEAR } from '../utils/constants';
import { cleanFormValues, validateCertificateFields, validatePdfFile } from '../utils/validation';
import { createCertificatePdf } from '../services/certificatePdf';

const EMPTY_FORM = { studentName: '', studentId: '', course: '', graduationYear: '' };

export default function CertificateForm({ onIssued }) {
  const { records, addCertificate } = useCertificates();
  const showToast = useToast();
  const { user } = useAuth(); // the admin's college is used as the issuer

  const [values, setValues] = useState(EMPTY_FORM);
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    const nextValue = name === 'studentId' ? value.toUpperCase() : value;
    setValues((current) => ({ ...current, [name]: nextValue }));
    // Clear the error for this field as soon as the admin edits it.
    if (errors[name]) setErrors((current) => ({ ...current, [name]: undefined }));
  }

  // Validate the file as soon as it is chosen, so mistakes show up early.
  async function handleFileSelected(selectedFile) {
    const fileError = await validatePdfFile(selectedFile);
    if (fileError) {
      setFile(null);
      setErrors((current) => ({ ...current, file: fileError }));
    } else {
      setFile(selectedFile);
      setErrors((current) => ({ ...current, file: undefined }));
    }
  }

  // Creates a sample certificate PDF from the details typed in the form.
  function handleGenerateSample() {
    const cleaned = cleanFormValues(values);
    const fieldErrors = validateCertificateFields(cleaned, records);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors((current) => ({ ...current, ...fieldErrors }));
      showToast('Fill in the student details first, then generate the sample PDF.', 'error');
      return;
    }
    const blob = createCertificatePdf({ ...cleaned, institutionId: user.institutionId });
    const sampleFile = new File([blob], `Sample_${cleaned.studentId}_certificate.pdf`, {
      type: 'application/pdf',
    });
    setFile(sampleFile);
    setErrors((current) => ({ ...current, file: undefined }));
    showToast('Sample certificate PDF attached.');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const cleaned = cleanFormValues(values);
    const fieldErrors = validateCertificateFields(cleaned, records);
    const fileError = await validatePdfFile(file);
    if (fileError) fieldErrors.file = fileError;

    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) {
      showToast('Some details need fixing. Check the highlighted fields.', 'error');
      const firstInvalid = document.querySelector('.certificate-form [aria-invalid="true"]');
      firstInvalid?.focus();
      return;
    }

    setIsSubmitting(true);
    try {
      const { record, uploadedToIpfs, backendError } = await addCertificate(
        cleaned,
        file,
        user.institutionId,
      );
      if (uploadedToIpfs) {
        showToast(`Certificate ${record.certificateId} issued and stored on IPFS.`);
      } else {
        showToast(
          `Certificate ${record.certificateId} issued, but saved in this browser only. ${backendError}`,
          'warning',
        );
      }
      setValues(EMPTY_FORM);
      setFile(null);
      setErrors({});
      onIssued?.(record);
    } catch (error) {
      console.error(error);
      showToast('The certificate could not be saved in this browser. Try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleReset() {
    setValues(EMPTY_FORM);
    setFile(null);
    setErrors({});
  }

  return (
    <form className="certificate-form" onSubmit={handleSubmit} noValidate>
      <div className="form-grid">
        <FormField
          label="Student name"
          name="studentName"
          value={values.studentName}
          onChange={handleChange}
          error={errors.studentName}
          placeholder="Ananya Menon"
          autoComplete="off"
        />
        <FormField
          label="Student ID"
          name="studentId"
          value={values.studentId}
          onChange={handleChange}
          error={errors.studentId}
          hint="University register number, e.g. TCR22CS008"
          placeholder="TCR22CS008"
          autoComplete="off"
          maxLength={15}
        />
        <FormField
          label="Course"
          name="course"
          type="select"
          options={COURSES}
          placeholder="Select the course"
          value={values.course}
          onChange={handleChange}
          error={errors.course}
        />
        <FormField
          label="Graduation year"
          name="graduationYear"
          type="number"
          inputMode="numeric"
          min={MIN_GRADUATION_YEAR}
          max={MAX_GRADUATION_YEAR}
          value={values.graduationYear}
          onChange={handleChange}
          error={errors.graduationYear}
          placeholder="2026"
        />
      </div>

      <FileDropzone
        file={file}
        error={errors.file}
        onFileSelected={handleFileSelected}
        onClear={() => setFile(null)}
      />

      <button type="button" className="text-btn" onClick={handleGenerateSample}>
        <Sparkles size={15} aria-hidden="true" />
        No PDF at hand? Generate a sample certificate from these details
      </button>

      <div className="form-actions">
        <button
          type="button"
          className="btn btn-ghost"
          onClick={handleReset}
          disabled={isSubmitting}
        >
          Clear form
        </button>
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          <FilePlus2 size={18} aria-hidden="true" />
          {isSubmitting ? 'Issuing…' : 'Issue certificate'}
        </button>
      </div>
    </form>
  );
}
