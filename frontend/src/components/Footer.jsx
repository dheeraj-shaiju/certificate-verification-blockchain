import { Link } from 'react-router-dom';

// compact = the smaller footer used inside the dashboards.
export default function Footer({ compact = false }) {
  return (
    <footer className={compact ? 'footer footer-compact' : 'footer'}>
      <p>
        © {new Date().getFullYear()} CertVerify · <Link to="/about">About</Link>
      </p>
    </footer>
  );
}
