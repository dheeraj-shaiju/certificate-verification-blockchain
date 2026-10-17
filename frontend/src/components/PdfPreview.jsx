/**
 * Shows the certificate PDF inside the page, with buttons to open or download it.
 * Some phone browsers cannot show PDFs inside a page; the buttons still work there.
 */
import { Download, ExternalLink, FileWarning } from 'lucide-react';
import { usePdfUrl } from '../hooks/usePdfUrl';
import { downloadBlob, certificateFileName } from '../utils/fileHelpers';
import Spinner from './Spinner';

export default function PdfPreview({ record }) {
  const { url, blob, isLoading, error } = usePdfUrl(record.certificateId);

  if (isLoading) {
    return (
      <div className="pdf-frame pdf-frame-state">
        <Spinner label="Loading certificate…" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="pdf-frame pdf-frame-state">
        <FileWarning size={28} aria-hidden="true" />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="pdf-preview">
      <iframe className="pdf-frame" src={url} title={`Certificate PDF for ${record.studentName}`} />
      <div className="pdf-actions">
        <a className="btn btn-secondary" href={url} target="_blank" rel="noopener noreferrer">
          <ExternalLink size={16} aria-hidden="true" />
          Open in new tab
        </a>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => downloadBlob(blob, certificateFileName(record))}
        >
          <Download size={16} aria-hidden="true" />
          Download PDF
        </button>
      </div>
    </div>
  );
}
