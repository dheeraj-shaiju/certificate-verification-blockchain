/**
 * Shows a warning above the issue form only when the server can't be reached.
 * When the server is working (or still being checked), nothing is shown.
 */
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function BackendStatus({ status, onRetry }) {
  if (status !== 'offline') return null;

  return (
    <div className="server-warning" role="alert">
      <AlertTriangle size={18} aria-hidden="true" />
      <p>Can’t reach the server. Certificates will be saved on this device only until it’s back.</p>
      <button type="button" className="btn btn-small btn-secondary" onClick={onRetry}>
        <RefreshCw size={14} aria-hidden="true" />
        Try again
      </button>
    </div>
  );
}
