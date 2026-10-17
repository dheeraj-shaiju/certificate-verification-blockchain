/**
 * Layout for signed-in pages (dashboards): sidebar on the left, page on the right.
 * Signed-out visitors are sent to the login page first.
 */
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

export default function AppLayout() {
  const { user, logoutInfo } = useAuth();
  const location = useLocation();

  if (!user) {
    // Opened a dashboard while signed out: come back here after login.
    // Just logged out: only come back if a page was asked for (e.g. "use an admin account").
    const from = logoutInfo ? logoutInfo.returnTo : location.pathname + location.search;
    return <Navigate to="/login" replace state={from ? { from } : undefined} />;
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="app-main">
        <main className="app-content">
          <Outlet />
        </main>
        <Footer compact />
      </div>
    </div>
  );
}
