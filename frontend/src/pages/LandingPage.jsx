/**
 * The front page (also used for /login): project title, illustration and the login box.
 * Signed-out visitors see a short introduction and the login box.
 * Signed-in users are sent straight to their dashboard.
 */
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth, homePathFor } from '../context/AuthContext';
import LoginCard from '../components/LoginCard';
import LandingIllustration from '../components/LandingIllustration';

export default function LandingPage() {
  const { user } = useAuth();
  const location = useLocation();

  if (user) {
    // Go back to the page they tried to open before logging in, if their role allows it.
    const from = location.state?.from;
    const canGoBack = from && (user.role === 'admin' || from.startsWith('/student'));
    return <Navigate to={canGoBack ? from : homePathFor(user)} replace />;
  }

  return (
    <div className="landing">
      <div className="landing-intro">
        <p className="landing-kicker">For colleges and students</p>
        <h1 className="landing-title">Certificate Verification System Using Blockchain</h1>
        <p className="landing-lede">
          One place where any college issues degree certificates with a unique ID and a digital
          fingerprint, and students download and share them, so they can be checked instead of
          trusted on paper.
        </p>

        <LandingIllustration />

        <Link to="/about" className="landing-link">
          Learn how CertVerify works
        </Link>
      </div>

      <LoginCard />
    </div>
  );
}
