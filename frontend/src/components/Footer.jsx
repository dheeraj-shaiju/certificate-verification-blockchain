import { Link } from 'react-router-dom';

// compact = the smaller footer used inside the dashboards.
export default function Footer({ compact = false }) {
  return (
    <footer className={compact ? 'footer footer-compact' : 'footer'}>
      <p>
        Prototype v0.6. Records, PDFs and login run only in this browser. The blockchain, IPFS
        storage and secure login are planned for the next phase.{' '}
        <Link to="/about">About the project</Link>
      </p>
      {!compact && (
        <p className="footer-meta">
          Built by CSD415 Project Group 6, Government Engineering College, Thrissur
        </p>
      )}
    </footer>
  );
}
