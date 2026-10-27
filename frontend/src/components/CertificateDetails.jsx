// A labelled list of every field in a certificate record.
import { ExternalLink } from 'lucide-react';
import CopyButton from './CopyButton';
import { ipfsUrl } from '../services/api';
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
        <dt>IPFS CID</dt>
        <dd>
          {record.ipfsCID ? (
            <span className="ipfs-row">
              <span className="code hash">{record.ipfsCID}</span>
              <CopyButton text={record.ipfsCID} label="Copy IPFS CID" />
              <a
                href={ipfsUrl(record.ipfsCID)}
                target="_blank"
                rel="noopener noreferrer"
                className="ipfs-link"
              >
                <ExternalLink size={14} aria-hidden="true" />
                Open on IPFS
              </a>
            </span>
          ) : (
            <span className="field-hint">Not on IPFS (saved in this browser only)</span>
          )}
        </dd>
      </div>
      <div className="details-wide">
        <dt>Status</dt>
        <dd>
          <span className={record.ipfsCID ? 'status-pill status-ok' : 'status-pill'}>
            {record.ipfsCID ? 'Stored on IPFS' : 'Saved in this browser'}
          </span>
        </dd>
      </div>
    </dl>
  );
}
