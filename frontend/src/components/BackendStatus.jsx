// Small badge on the Issue page showing whether PDFs will go to IPFS.
import { RefreshCw } from 'lucide-react';

const TEXT = {
  checking: 'Checking backend…',
  online: 'Backend connected: PDFs are stored on IPFS',
  offline: 'Backend offline: PDFs are saved in this browser',
};

export default function BackendStatus({ status, onRetry }) {
  return (
    <div className={`backend-status backend-${status}`} role="status">
      <span className="backend-dot" aria-hidden="true" />
      <span>{TEXT[status]}</span>
      {status === 'offline' && (
        <button
          type="button"
          className="icon-btn icon-btn-small"
          onClick={onRetry}
          aria-label="Check the backend again"
          title="Check again"
        >
          <RefreshCw size={14} />
        </button>
      )}
    </div>
  );
}
