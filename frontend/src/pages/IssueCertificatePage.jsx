/**
 * Admin page for issuing a new certificate: the form, plus the most recent certificate
 * with its QR code so the admin can check the result straight away.
 */
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, GraduationCap } from 'lucide-react';
import { useCertificates } from '../context/CertificateContext';
import { useAuth } from '../context/AuthContext';
import PageHeader from '../components/PageHeader';
import CertificateForm from '../components/CertificateForm';
import CertificateSlip from '../components/CertificateSlip';
import CertificateViewer from '../components/CertificateViewer';
import Spinner from '../components/Spinner';
import EmptyState from '../components/EmptyState';
import BackendStatus from '../components/BackendStatus';
import { useBackendStatus } from '../hooks/useBackendStatus';

export default function IssueCertificatePage() {
  const { records, isLoading } = useCertificates();
  const { user } = useAuth();
  const backend = useBackendStatus();
  const [justIssuedId, setJustIssuedId] = useState(null);
  const [viewingRecord, setViewingRecord] = useState(null);

  const latest = useMemo(
    () =>
      records
        .filter((r) => r.institutionId === user.institutionId)
        .sort((a, b) => b.issuedAt.localeCompare(a.issuedAt))[0],
    [records, user.institutionId],
  );
  const isJustIssued = latest && latest.certificateId === justIssuedId;

  if (isLoading) return <Spinner label="Loading…" />;

  return (
    <div className="dashboard">
      <PageHeader
        title="Issue a certificate"
        description={`Issued in the name of ${user.institutionName}. The certificate ID and QR code are created automatically.`}
        actions={<BackendStatus status={backend.status} onRetry={backend.check} />}
      />

      <div className="issue-grid">
        <section className="panel">
          <h2 className="panel-title">Student and certificate details</h2>
          <CertificateForm
            onIssued={(record) => {
              setJustIssuedId(record.certificateId);
              backend.check(); // refresh the badge in case the backend stopped or started
            }}
          />
        </section>

        <section className="panel panel-quiet">
          <h2 className="panel-title">{isJustIssued ? 'Just issued' : 'Last issued'}</h2>
          {latest ? (
            <CertificateSlip record={latest} highlight={isJustIssued}>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setViewingRecord(latest)}
              >
                <Eye size={16} aria-hidden="true" />
                View certificate
              </button>
              <Link
                to={`/student?id=${encodeURIComponent(latest.studentId)}`}
                className="btn btn-secondary"
              >
                <GraduationCap size={16} aria-hidden="true" />
                Student view
              </Link>
            </CertificateSlip>
          ) : (
            <EmptyState
              title="Nothing issued yet"
              message="The certificate you issue appears here with its QR code."
            />
          )}
        </section>
      </div>

      {viewingRecord && (
        <CertificateViewer record={viewingRecord} onClose={() => setViewingRecord(null)} />
      )}
    </div>
  );
}
