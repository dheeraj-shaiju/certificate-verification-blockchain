// A labelled list of every field in a certificate record.
import CopyButton from './CopyButton';
import { formatBytes, formatDateTime } from '../utils/formatters';

export default function CertificateDetails({ record }) {
  return (
    <dl className="details-list">
      <div>
        <dt>Certificate ID</dt>
        <dd className="with-action">
          <span className="code">{record.certificateId}</span>
          <CopyButton text={record.certificateId} label="Copy certificate ID" />
        </dd>
      </div>
      <div>
        <dt>Student name</dt>
        <dd>{record.studentName}</dd>
      </div>
      <div>
        <dt>Student ID</dt>
        <dd className="code">{record.studentId}</dd>
      </div>
      <div>
        <dt>Course</dt>
        <dd>{record.course}</dd>
      </div>
      <div>
        <dt>Graduation year</dt>
        <dd>{record.graduationYear}</dd>
      </div>
      <div>
        <dt>Issued by</dt>
        <dd>{record.institutionName}</dd>
      </div>
      <div>
        <dt>Issued on</dt>
        <dd>{formatDateTime(record.issuedAt)}</dd>
      </div>
      <div>
        <dt>File</dt>
        <dd>
          {record.fileName} ({formatBytes(record.fileSize)})
        </dd>
      </div>
      <div className="details-wide">
        <dt>PDF fingerprint (SHA-256)</dt>
        <dd className="code hash">{record.fileHash || 'Not available in this browser'}</dd>
      </div>
      <div className="details-wide">
        <dt>Status</dt>
        <dd>
          <span className="status-pill">{record.status}</span>
        </dd>
      </div>
    </dl>
  );
}
