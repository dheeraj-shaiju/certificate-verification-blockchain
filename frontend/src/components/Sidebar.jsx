/**
 * Left-hand menu for signed-in users. On phones it becomes a bar across the top.
 * Admins and students see different menu items.
 */
import { Link, NavLink } from 'react-router-dom';
import { LayoutDashboard, FilePlus2, GraduationCap, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getInitials } from '../utils/formatters';
import Logo from './Logo';

const MENU = {
  admin: [
    { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
    { to: '/admin/issue', label: 'Issue certificate', icon: FilePlus2 },
    { to: '/student', label: 'Student view', icon: GraduationCap },
  ],
  student: [{ to: '/student', label: 'My certificates', icon: GraduationCap }],
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const showToast = useToast();

  function handleLogout() {
    logout(); // AppLayout then shows the login page
    showToast('Logged out.');
  }

  return (
    <aside className="sidebar">
      <Link to="/" className="brand">
        <Logo size={30} />
        <span className="brand-text">
          <strong>CertVerify</strong>
          <small>
            {user.role === 'admin' ? `${user.institutionShortName} · Admin` : 'Student portal'}
          </small>
        </span>
      </Link>

      <nav className="sidebar-nav" aria-label="Dashboard menu">
        {MENU[user.role].map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => (isActive ? 'side-link active' : 'side-link')}
          >
            <Icon size={18} aria-hidden="true" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-foot">
        <p className="sidebar-note">Prototype: records and login stay in this browser.</p>
        <div className="sidebar-user">
          <span className={`avatar-sm role-${user.role}`} aria-hidden="true">
            {getInitials(user.name)}
          </span>
          <span className="sidebar-user-text">
            <strong>{user.role === 'admin' ? 'College admin' : user.name}</strong>
            <small>{user.role === 'admin' ? user.username : user.studentId}</small>
          </span>
          <button
            type="button"
            className="icon-btn"
            onClick={handleLogout}
            aria-label="Log out"
            title="Log out"
          >
            <LogOut size={17} />
          </button>
        </div>
      </div>
    </aside>
  );
}
