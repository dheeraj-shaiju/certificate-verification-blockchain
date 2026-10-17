/**
 * A paper-style summary of one certificate with its QR code.
 * Used on the Admin page (latest issued) and on the Student page.
 * "children" holds the buttons shown under the slip.
 * showQrDownload adds a "Download QR" button.
 */
import { useRef } from 'react';
import { Download } from 'lucide-react';
import QRCodeBlock from './QRCodeBlock';
import { downloadUrl } from '../utils/fileHelpers';
import { formatDate } from '../utils/formatters';

export default function CertificateSlip({
  record,
  highlight = false,
  showQrDownload = false,
  children,
}) {
  const qrCanvasRef = useRef(null);

  function handleDownloadQr() {
    const canvas = qrCanvasRef.current;
    if (canvas) downloadUrl(canvas.toDataURL('image/png'), `QR_${record.certificateId}.png`);
  }

  return (
    <article className={`slip ${highlight ? 'slip-highlight' : ''}`}>
      <div className="slip-paper">
        <div className="slip-text">
          <p className="slip-issuer">{record.institutionName}</p>
          <h3 className="slip-name">{record.studentName}</h3>
          <p className="slip-course">{record.course}</p>
          <dl className="slip-meta">
            <div>
              <dt>Graduated</dt>
              <dd>{record.graduationYear}</dd>
            </div>
            <div>
              <dt>Student ID</dt>
              <dd>{record.studentId}</dd>
            </div>
            <div>
              <dt>Issued</dt>
              <dd>{formatDate(record.issuedAt)}</dd>
            </div>
          </dl>
          <p className="slip-id">{record.certificateId}</p>
        </div>
        <QRCodeBlock record={record} size={124} showDownload={false} canvasRef={qrCanvasRef} />
      </div>
      {(children || showQrDownload) && (
        <div className="slip-actions">
          {children}
          {showQrDownload && (
            <button type="button" className="btn btn-secondary" onClick={handleDownloadQr}>
              <Download size={16} aria-hidden="true" />
              Download QR
            </button>
          )}
        </div>
      )}
    </article>
  );
}
