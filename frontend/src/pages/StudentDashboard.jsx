import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Eye, Download, UserX, GraduationCap, LogOut } from 'lucide-react';
import { useCertificates } from '../context/CertificateContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import PageHeader from '../components/PageHeader';
import CertificateSlip from '../components/CertificateSlip';
import CertificateDetails from '../components/CertificateDetails';
import Modal from '../components/Modal';
import PdfPreview from '../components/PdfPreview';
import Spinner from '../components/Spinner';
import EmptyState from '../components/EmptyState';
import { loadLastStudentId, saveLastStudentId } from '../services/storage';
import { downloadBlob, certificateFileName } from '../utils/fileHelpers';
import { getInitials } from '../utils/formatters';

export default function StudentDashboard() {
  const { records, isLoading, getCertificatesForStudent, getPdf } = useCertificates();
  const showToast = useToast();
  const { user } = useAuth();
  const isStudent = user?.role === 'student';

  // A logged-in student always sees only their own certificates.
  // An admin can preview any student; the chosen ID lives in the URL (?id=TCR22CS008).
  const [searchParams, setSearchParams] = useSearchParams();
  const activeId = isStudent ? user.studentId : (searchParams.get('id') || '').trim().toUpperCase();

  const [idInput, setIdInput] = useState(activeId);
  const [inputError, setInputError] = useState('');
  const [viewingRecord, setViewingRecord] = useState(null);

  // Reopen the last student viewed, if the URL does not name one.
  useEffect(() => {
    if (!isStudent && !activeId) {
      const lastId = loadLastStudentId();
      if (lastId) setSearchParams({ id: lastId }, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setIdInput(activeId);
  }, [activeId]);

  // Students see all their certificates; an admin only sees students of their own college.
  const certificates = activeId
    ? getCertificatesForStudent(activeId).filter(
        (r) => isStudent || r.institutionId === user.institutionId,
      )
    : [];
  const student = certificates[0];

  const foundStudentId = student?.studentId;
  useEffect(() => {
    if (foundStudentId && !isStudent) saveLastStudentId(foundStudentId);
  }, [foundStudentId, isStudent]);

  // One button per student in the data, for quick demos.
  const collegeRecords = records.filter((r) => r.institutionId === user?.institutionId);
  const demoStudents = [...new Map(collegeRecords.map((r) => [r.studentId, r])).values()].slice(
    0,
    6,
  );

  function handleLookup(event) {
    event.preventDefault();
    const id = idInput.trim().toUpperCase();
    if (!id) {
      setInputError('Enter your student ID.');
      return;
    }
    if (!/^[A-Z0-9]{6,15}$/.test(id)) {
      setInputError('A student ID has 6–15 letters or digits, like TCR22CS008.');
      return;
    }
    setInputError('');
    setSearchParams({ id });
  }

  function handleSignOut() {
    saveLastStudentId('');
    setSearchParams({});
    setIdInput('');
  }

  async function handleDownload(record) {
    try {
      const blob = await getPdf(record.certificateId);
      if (!blob) throw new Error('missing');
      downloadBlob(blob, certificateFileName(record));
    } catch {
      showToast('The PDF for this certificate is missing from this browser.', 'error');
    }
  }

  if (isLoading) return <Spinner label="Loading your certificates…" />;

  return (
    <div className="dashboard">
      <PageHeader
        title={isStudent ? 'My certificates' : 'Student view'}
        description={
          isStudent
            ? 'Your details and degree certificates. Share a certificate with its QR code.'
            : `Admin preview: look up a ${user.institutionShortName} student to see exactly what they see.`
        }
        actions={
          student &&
          !isStudent && (
            <button type="button" className="btn btn-ghost" onClick={handleSignOut}>
              <LogOut size={16} aria-hidden="true" />
              Switch student
            </button>
          )
        }
      />

      {isStudent && !student && (
        <EmptyState
          icon={UserX}
          title="No certificates have been issued to you yet"
          message="When the college issues your degree certificate, it will appear here."
        />
      )}

      {!isStudent && !student && (
        <section className="panel lookup-panel">
          <h2 className="panel-title">Find your certificates</h2>
          <p className="panel-intro">Enter a student ID to open their dashboard.</p>
          <form className="lookup-form" onSubmit={handleLookup} noValidate>
            <div className="form-field">
              <label htmlFor="lookup-id">Student ID</label>
              <input
                id="lookup-id"
                className={inputError ? 'input has-error' : 'input'}
                value={idInput}
                onChange={(e) => {
                  setIdInput(e.target.value.toUpperCase());
                  setInputError('');
                }}
                placeholder="TCR22CS008"
                maxLength={15}
                autoComplete="off"
                aria-invalid={Boolean(inputError)}
                aria-describedby={inputError ? 'lookup-error' : undefined}
              />
              {inputError && (
                <p id="lookup-error" className="field-error">
                  {inputError}
                </p>
              )}
            </div>
            <button type="submit" className="btn btn-primary">
              <Search size={17} aria-hidden="true" />
              Show certificates
            </button>
          </form>

          {demoStudents.length > 0 && (
            <div className="demo-students">
              <p className="field-hint">Sample students for the demo:</p>
              <div className="chip-row">
                {demoStudents.map((r) => (
                  <button
                    key={r.studentId}
                    type="button"
                    className="chip"
                    onClick={() => setSearchParams({ id: r.studentId })}
                  >
                    {r.studentName} <span className="code">{r.studentId}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeId && (
            <EmptyState
              icon={UserX}
              title={`No ${user.institutionShortName} certificates found for ${activeId}`}
              message="Check the ID for typos. Admins can only open students of their own college."
            >
              <Link to="/admin" className="btn btn-secondary">
                Back to overview
              </Link>
            </EmptyState>
          )}
        </section>
      )}

      {student && (
        <>
          <section className="panel profile">
            <div className="avatar-hex" aria-hidden="true">
              {getInitials(student.studentName)}
            </div>
            <div className="profile-main">
              <h2>{student.studentName}</h2>
              <p className="profile-sub">{student.institutionName}</p>
            </div>
            <dl className="profile-facts">
              <div>
                <dt>Student ID</dt>
                <dd className="code">{student.studentId}</dd>
              </div>
              <div>
                <dt>Latest course</dt>
                <dd>{student.course}</dd>
              </div>
              <div>
                <dt>Graduation year</dt>
                <dd>{student.graduationYear}</dd>
              </div>
              <div>
                <dt>Certificates</dt>
                <dd>{certificates.length}</dd>
              </div>
            </dl>
          </section>

          <h2 className="section-title">
            <GraduationCap size={22} aria-hidden="true" />
            {certificates.length === 1
              ? 'Your certificate'
              : `Your certificates (${certificates.length})`}
          </h2>

          <div className="student-certificates">
            {certificates.map((record) => (
              <section key={record.certificateId} className="panel student-cert">
                <CertificateSlip record={record} showQrDownload>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setViewingRecord(record)}
                  >
                    <Eye size={16} aria-hidden="true" />
                    View certificate
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => handleDownload(record)}
                  >
                    <Download size={16} aria-hidden="true" />
                    Download PDF
                  </button>
                </CertificateSlip>

                <details className="cert-more">
                  <summary>Full certificate details</summary>
                  <CertificateDetails record={record} />
                </details>
              </section>
            ))}
          </div>
        </>
      )}

      {viewingRecord && (
        <Modal
          title={`${viewingRecord.course} · ${viewingRecord.graduationYear}`}
          onClose={() => setViewingRecord(null)}
          size="large"
        >
          <PdfPreview record={viewingRecord} />
        </Modal>
      )}
    </div>
  );
}
