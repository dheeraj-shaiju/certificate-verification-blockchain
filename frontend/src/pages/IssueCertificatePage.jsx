/**
 * Admin page for issuing a new certificate.
 * Before issuing: only the form.
 * After issuing: a "Certificate issued" confirmation beside the form, with the QR code.
 */
import { useState } from 'react';
import { CheckCircle2, Eye, FilePlus2 } from 'lucide-react';
import { useCertificates } from '../context/CertificateContext';
import { useAuth } from '../context/AuthContext';
import PageHeader from '../components/PageHeader';
import CertificateForm from '../components/CertificateForm';
import CertificateSlip from '../components/CertificateSlip';
import CertificateViewer from '../components/CertificateViewer';
import Spinner from '../components/Spinner';
import BackendStatus from '../components/BackendStatus';
import { useBackendStatus } from '../hooks/useBackendStatus';

export default function IssueCertificatePage() {
  const { records, isLoading } = useCertificates();
  const { user } = useAuth();
  const backend = useBackendStatus();
  const [justIssuedId, setJustIssuedId] = useState(null);
  const [viewingRecord, setViewingRecord] = useState(null);

  // The certificate issued a moment ago (null before issuing, or if it was deleted).
  const justIssued = records.find((r) => r.certificateId === justIssuedId) || null;

  if (isLoading) return <Spinner label="Loading…" />;

  return (
    <div className="dashboard">
      <PageHeader
        title="Issue a certificate"
        description={`Issued in the name of ${user.institutionName}. The certificate ID and QR code are created automatically.`}
      />

      <BackendStatus status={backend.status} onRetry={backend.check} />

      <div className={justIssued ? 'issue-grid' : 'issue-single'}>
        <section className="panel">
          <h2 className="panel-title">Student and certificate details</h2>
          <CertificateForm
            onIssued={(record) => {
              setJustIssuedId(record.certificateId);
              backend.check(); // show the warning if the server stopped
            }}
          />
        </section>

        {justIssued && (
          <section className="panel issued-panel" aria-live="polite">
            <h2 className="issued-title">
              <CheckCircle2 size={20} aria-hidden="true" />
              Certificate issued
            </h2>
            <p className="issued-note">
              {justIssued.ipfsCID
                ? 'Stored on IPFS. The student can now see it in their account.'
                : 'Saved on this device only, because the server could not be reached.'}
            </p>
            <CertificateSlip record={justIssued} showQrDownload>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setViewingRecord(justIssued)}
              >
                <Eye size={16} aria-hidden="true" />
                View certificate
              </button>
            </CertificateSlip>
            <button
              type="button"
              className="btn btn-ghost issue-another"
              onClick={() => setJustIssuedId(null)}
            >
              <FilePlus2 size={16} aria-hidden="true" />
              Issue another
            </button>
          </section>
        )}
      </div>

      {viewingRecord && (
        <CertificateViewer record={viewingRecord} onClose={() => setViewingRecord(null)} />
      )}
    </div>
  );
}
