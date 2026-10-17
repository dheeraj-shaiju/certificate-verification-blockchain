/**
 * Wraps a page so only certain roles can open it.
 *
 *   <ProtectedRoute allow={['admin']}><AdminDashboard /></ProtectedRoute>
 *
 * - Signed out      -> sent to /login, then brought back here after logging in
 * - Wrong role      -> shown an "access denied" message
 * - Allowed role    -> sees the page
 */
import { Navigate, useLocation, Link } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { useAuth, homePathFor } from '../context/AuthContext';
import EmptyState from './EmptyState';

export default function ProtectedRoute({ allow, children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname + location.search;

  if (!user) {
    return <Navigate to="/login" replace state={{ from: currentPath }} />;
  }

  if (!allow.includes(user.role)) {
    return (
      <EmptyState
        icon={Lock}
        title="This page is for college admins only"
        message={`You are logged in as ${user.name} (student). Log in with an admin account to issue certificates.`}
      >
        <div className="button-row">
          <Link to={homePathFor(user)} className="btn btn-primary">
            Go to my certificates
          </Link>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              logout(currentPath); // log in again, then come back to this page
            }}
          >
            Log out and use an admin account
          </button>
        </div>
      </EmptyState>
    );
  }

  return children;
}
