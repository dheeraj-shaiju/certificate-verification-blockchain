/**
 * "About the project" page: how the system works and the honest status of each part.
 * Useful during the review; not part of the everyday portal.
 */
import { GraduationCap, Building2, BadgeCheck } from 'lucide-react';
import HeroIllustration from '../components/HeroIllustration';

// The five steps from the review slides, with an honest status for this prototype.
const WORKFLOW = [
  {
    title: 'Admin upload',
    status: 'working',
    text: 'Each college’s admin issues certificates with validation, PDF upload and a unique ID.',
  },
  {
    title: 'IPFS storage',
    status: 'simulated',
    text: 'The PDF is kept in this browser (IndexedDB). Pinata IPFS comes next.',
  },
  {
    title: 'Smart contract mint',
    status: 'simulated',
    text: 'A SHA-256 fingerprint of the PDF is recorded. The ERC-721 mint on Sepolia comes next.',
  },
  {
    title: 'Student QR',
    status: 'working',
    text: 'Each student gets a QR code for their certificate after logging in.',
  },
  {
    title: 'Employer verify',
    status: 'planned',
    text: 'A public page that checks a scanned QR against the blockchain.',
  },
];

const STATUS_LABEL = {
  working: 'Working in this prototype',
  simulated: 'Simulated in the browser',
  planned: 'Planned for Phase II',
};

// The three sides of the system (from our research gap slide).
const AUDIENCE = [
  {
    icon: Building2,
    title: 'College admin',
    text: 'Each college has its own admin account. The admin issues certificates in the college’s name and sees only that college’s records.',
    status: 'working',
  },
  {
    icon: GraduationCap,
    title: 'Student',
    text: 'Logs in to see only their own certificates, download the PDF and share its QR code.',
    status: 'working',
  },
  {
    icon: BadgeCheck,
    title: 'Employer',
    text: 'Scans the QR to confirm the certificate is genuine, in seconds instead of weeks.',
    status: 'planned',
  },
];

export default function AboutPage() {
  return (
    <div className="about">
      <header className="about-header">
        <h1>About the project</h1>
        <p className="page-description">
          Certificate Verification System Using Blockchain: CSD415 Project Group 6, Phase I.
        </p>
      </header>

      <section className="about-figure">
        <HeroIllustration />
        <p className="section-intro">
          Each certificate PDF gets a SHA-256 fingerprint. In the next phase that fingerprint is
          stored on the Ethereum blockchain, so any change to the PDF can be detected.
        </p>
      </section>

      <section className="section" id="how-it-works">
        <h2 className="section-title">Where the prototype stands</h2>
        <p className="section-intro">
          The same five-step workflow as our design. Steps marked “simulated” keep the interface
          working until the blockchain and IPFS layers are connected.
        </p>
        <ol className="workflow">
          {WORKFLOW.map((step, index) => (
            <li key={step.title} className={`workflow-step status-${step.status}`}>
              <span className="workflow-number" aria-hidden="true">
                {index + 1}
              </span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
              <span className="workflow-status">{STATUS_LABEL[step.status]}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="section">
        <h2 className="section-title">Who uses it</h2>
        <div className="audience-grid">
          {AUDIENCE.map(({ icon: Icon, title, text, status }) => (
            <div key={title} className={`audience-card status-${status}`}>
              <Icon size={24} aria-hidden="true" />
              <h3>{title}</h3>
              <p>{text}</p>
              <span className="workflow-status">{STATUS_LABEL[status]}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
