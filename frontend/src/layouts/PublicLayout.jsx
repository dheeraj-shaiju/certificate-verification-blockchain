/**
 * Layout for pages anyone can open: the landing/login page, About, and "not found".
 * A simple top bar, the page, and the footer.
 */
import { Link, NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard } from 'lucide-react';
import { useAuth, homePathFor } from '../context/AuthContext';
import Logo from '../components/Logo';
import Footer from '../components/Footer';

export default function PublicLayout() {
  const { user } = useAuth();

  return (
    <div className="public-shell">
      <header className="public-header">
        <div className="public-header-inner">
          <Link to="/" className="brand">
            <Logo />
            <span className="brand-text">
              <strong>CertVerify</strong>
              <small>Academic certificate verification</small>
            </span>
          </Link>
          <nav className="public-nav" aria-label="Main navigation">
            <NavLink
              to="/about"
              className={({ isActive }) => (isActive ? 'top-link active' : 'top-link')}
            >
              About the project
            </NavLink>
            {user && (
              <Link to={homePathFor(user)} className="btn btn-small btn-primary">
                <LayoutDashboard size={15} aria-hidden="true" />
                Open dashboard
              </Link>
            )}
          </nav>
        </div>
      </header>
      <main className="public-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
