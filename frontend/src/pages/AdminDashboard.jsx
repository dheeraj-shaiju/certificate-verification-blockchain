/**
 * Admin "Overview": numbers at a glance and every issued certificate.
 * Issuing a new certificate happens on its own page (IssueCertificatePage).
 */
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileCheck2, Users, BookOpen, CalendarCheck, RotateCcw, FilePlus2 } from 'lucide-react';
import { useCertificates } from '../context/CertificateContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import CertificateTable from '../components/CertificateTable';
import CertificateViewer from '../components/CertificateViewer';
import Modal from '../components/Modal';
import QRCodeBlock from '../components/QRCodeBlock';
import Spinner from '../components/Spinner';
import EmptyState from '../components/EmptyState';
import { buildQrPayload } from '../utils/qrPayload';

export default function AdminDashboard() {
  const { records, isLoading, loadError, deleteCertificate, resetDemoData } = useCertificates();
  const showToast = useToast();
  const { user } = useAuth();

  const [viewingRecord, setViewingRecord] = useState(null); // shown in the "View" pop-up
  const [qrRecord, setQrRecord] = useState(null); // shown in the QR pop-up

  // Only this admin's college, newest certificate first
  const collegeRecords = useMemo(
    () =>
      records
        .filter((r) => r.institutionId === user.institutionId)
        .sort((a, b) => b.issuedAt.localeCompare(a.issuedAt)),
    [records, user.institutionId],
  );

  const currentYear = new Date().getFullYear();
  const stats = {
    total: collegeRecords.length,
    students: new Set(collegeRecords.map((r) => r.studentId)).size,
    courses: new Set(collegeRecords.map((r) => r.course)).size,
    thisYear: collegeRecords.filter((r) => r.graduationYear === currentYear).length,
  };

  async function handleDelete(record) {
    const confirmed = window.confirm(
      `Delete certificate ${record.certificateId} for ${record.studentName}?\n\nThe record and its PDF will be removed from this browser.`,
    );
    if (!confirmed) return;
    try {
      await deleteCertificate(record.certificateId);
      showToast(`Certificate ${record.certificateId} deleted.`);
    } catch {
      showToast('The certificate could not be deleted. Try again.', 'error');
    }
  }

  async function handleReset() {
    const confirmed = window.confirm(
      'Reset demo data?\n\nAll certificates in this browser, for every college, will be replaced with the original sample records.',
    );
    if (!confirmed) return;
    await resetDemoData();
    showToast('Demo data reset to the sample records.');
  }

  if (isLoading) return <Spinner label="Loading certificate records…" />;
  if (loadError) return <EmptyState title="Storage unavailable" message={loadError} />;

  return (
    <div className="dashboard">
      <PageHeader
        title="Overview"
        description={`Every degree certificate issued by ${user.institutionName}.`}
        actions={
          <>
            <button type="button" className="btn btn-ghost" onClick={handleReset}>
              <RotateCcw size={16} aria-hidden="true" />
              Reset demo data
            </button>
            <Link to="/admin/issue" className="btn btn-primary">
              <FilePlus2 size={16} aria-hidden="true" />
              Issue certificate
            </Link>
          </>
        }
      />

      <div className="stats-grid">
        <StatCard label="Certificates issued" value={stats.total} icon={FileCheck2} tone="cyan" />
        <StatCard label="Students" value={stats.students} icon={Users} tone="violet" />
        <StatCard label="Courses" value={stats.courses} icon={BookOpen} tone="mint" />
        <StatCard
          label={`Graduating in ${currentYear}`}
          value={stats.thisYear}
          icon={CalendarCheck}
          tone="cyan"
        />
      </div>

      <section className="panel">
        <h2 className="panel-title">Certificates</h2>
        <CertificateTable
          records={collegeRecords}
          onView={setViewingRecord}
          onShowQr={setQrRecord}
          onDelete={handleDelete}
        />
      </section>

      {viewingRecord && (
        <CertificateViewer record={viewingRecord} onClose={() => setViewingRecord(null)} />
      )}

      {qrRecord && (
        <Modal title={`QR code · ${qrRecord.certificateId}`} onClose={() => setQrRecord(null)}>
          <div className="qr-modal">
            <QRCodeBlock record={qrRecord} size={240} />
            <div>
              <h3 className="qr-modal-heading">What the QR contains</h3>
              <pre className="qr-payload">{buildQrPayload(qrRecord)}</pre>
              <p className="field-hint">
                Scan it with any phone camera to read these details. In the next phase the QR will
                hold a verification link that is checked against the blockchain.
              </p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
