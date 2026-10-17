/**
 * Table of all issued certificates with search and row actions.
 * On small screens each row turns into a stacked card (see index.css).
 */
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, QrCode, Trash2, Search, GraduationCap, Inbox } from 'lucide-react';
import EmptyState from './EmptyState';
import { formatDate } from '../utils/formatters';

export default function CertificateTable({ records, onView, onShowQr, onDelete }) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return records;
    return records.filter((r) =>
      [r.certificateId, r.studentName, r.studentId, r.course, String(r.graduationYear)]
        .join(' ')
        .toLowerCase()
        .includes(q),
    );
  }, [records, query]);

  if (records.length === 0) {
    return (
      <EmptyState
        icon={Inbox}
        title="No certificates issued yet"
        message="Issue the first certificate, or reset the demo data to bring back the samples."
      >
        <Link to="/admin/issue" className="btn btn-primary">
          Issue certificate
        </Link>
      </EmptyState>
    );
  }

  return (
    <div className="table-block">
      <div className="table-toolbar">
        <label className="search-box">
          <Search size={17} aria-hidden="true" />
          <input
            type="search"
            placeholder="Search by name, ID, course or year"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search certificates"
          />
        </label>
        <p className="table-count">
          {filtered.length} of {records.length} certificates
        </p>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Search}
          title={`Nothing matches “${query}”`}
          message="Try a student ID like TCR22CS008, part of a name, or a certificate ID."
        />
      ) : (
        <div className="table-scroll">
          <table className="cert-table">
            <thead>
              <tr>
                <th scope="col">Certificate ID</th>
                <th scope="col">Student</th>
                <th scope="col">Course</th>
                <th scope="col">Year</th>
                <th scope="col">Issued</th>
                <th scope="col">
                  <span className="visually-hidden">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((record) => (
                <tr key={record.certificateId}>
                  <td data-label="Certificate ID">
                    <span className="code">{record.certificateId}</span>
                  </td>
                  <td data-label="Student">
                    <strong>{record.studentName}</strong>
                    <span className="cell-sub code">{record.studentId}</span>
                  </td>
                  <td data-label="Course">{record.course}</td>
                  <td data-label="Year">{record.graduationYear}</td>
                  <td data-label="Issued">{formatDate(record.issuedAt)}</td>
                  <td className="actions-cell">
                    <div className="row-actions">
                      <button
                        type="button"
                        className="btn btn-small btn-secondary"
                        onClick={() => onView(record)}
                      >
                        <Eye size={15} aria-hidden="true" /> View
                      </button>
                      <button
                        type="button"
                        className="icon-btn"
                        onClick={() => onShowQr(record)}
                        aria-label={`Show QR code for ${record.certificateId}`}
                        title="Show QR code"
                      >
                        <QrCode size={18} />
                      </button>
                      <Link
                        className="icon-btn"
                        to={`/student?id=${encodeURIComponent(record.studentId)}`}
                        aria-label={`Open ${record.studentName} in the student dashboard`}
                        title="Open in student dashboard"
                      >
                        <GraduationCap size={18} />
                      </Link>
                      <button
                        type="button"
                        className="icon-btn icon-btn-danger"
                        onClick={() => onDelete(record)}
                        aria-label={`Delete certificate ${record.certificateId}`}
                        title="Delete certificate"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
