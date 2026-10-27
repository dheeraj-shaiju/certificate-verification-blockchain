/**
 * "About" page: a short, plain description of what CertVerify does today.
 */
import { Link } from 'react-router-dom';

const STEPS = [
  {
    title: 'The college issues the certificate',
    text: 'A college admin enters the student’s details and uploads the signed degree certificate as a PDF.',
  },
  {
    title: 'It gets a unique ID and fingerprint',
    text: 'CertVerify gives the certificate a unique ID, calculates a SHA-256 fingerprint of the PDF and stores the file on IPFS.',
  },
  {
    title: 'The student downloads and shares it',
    text: 'The student logs in to view and download the certificate and share it with its QR code.',
  },
];

export default function AboutPage() {
  return (
    <div className="about">
      <header className="about-header">
        <h1>About CertVerify</h1>
        <p className="about-lede">
          CertVerify is a certificate platform for colleges. Each college issues degree certificates
          from its own admin account, and students get a secure copy they can download and share.
        </p>
      </header>

      <section className="about-section">
        <h2>How it works</h2>
        <ol className="about-steps">
          {STEPS.map((step, index) => (
            <li key={step.title}>
              <span className="about-step-number" aria-hidden="true">
                {index + 1}
              </span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="about-section">
        <h2>Who it’s for</h2>
        <div className="about-columns">
          <div>
            <h3>Colleges</h3>
            <p>
              Each college has its own admin account. Admins issue certificates in their college’s
              name and see only their own college’s records.
            </p>
          </div>
          <div>
            <h3>Students</h3>
            <p>
              Students log in with their student ID to see their certificates, download the PDF and
              share the QR code.
            </p>
          </div>
        </div>
      </section>

      <section className="about-section">
        <h2>Built with</h2>
        <p className="about-text">
          React for the website, Node.js and Express for the server, and IPFS (through Pinata) for
          storing certificate files.
        </p>
      </section>

      <p>
        <Link to="/" className="btn btn-primary">
          Go to log in
        </Link>
      </p>
    </div>
  );
}
