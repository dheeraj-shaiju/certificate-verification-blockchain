/**
 * The login box (Admin / Student switch + form + demo accounts).
 * Shown on the landing page, with demo accounts so both roles can be tried.
 */
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { LogIn, Eye, EyeOff, ShieldCheck, GraduationCap, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCertificates } from '../context/CertificateContext';
import { useToast } from '../context/ToastContext';
import { DEMO_ADMINS, DEMO_STUDENT_PASSWORD } from '../services/auth';
import { getInstitution } from '../utils/constants';
import FormField from './FormField';

const ROLES = [
  { value: 'admin', label: 'Admin', icon: ShieldCheck },
  { value: 'student', label: 'Student', icon: GraduationCap },
];

export default function LoginCard() {
  const { login } = useAuth();
  const { records, isLoading } = useCertificates();
  const showToast = useToast();
  const location = useLocation();
  const from = location.state?.from; // page the user tried to open before logging in

  const [role, setRole] = useState(from?.startsWith('/admin') ? 'admin' : 'student');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const demoStudent = records.find((r) => r.studentId === 'TCR22CS008') || records[0];
  const isAdmin = role === 'admin';

  function switchRole(nextRole) {
    setRole(nextRole);
    setUsername('');
    setPassword('');
    setErrors({});
  }

  // Fills the form with one of the demo accounts listed under the form.
  function fillDemo(nextRole, nextUsername, nextPassword) {
    setRole(nextRole);
    setErrors({});
    setUsername(nextUsername);
    setPassword(nextPassword);
  }

  function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = {};
    if (!username.trim()) {
      nextErrors.username = isAdmin ? 'Enter your username.' : 'Enter your student ID.';
    }
    if (!password) nextErrors.password = 'Enter your password.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const result = login({ role, username, password }, records);
    if (result.error) {
      setErrors({ form: result.error });
      setPassword('');
      return;
    }

    showToast(`Logged in as ${result.user.name}.`);
    // No navigate() here: LandingPage sees the new user and sends them to the right page.
  }

  return (
    <section className="login-card" aria-labelledby="login-title">
      <h2 id="login-title" className="login-title">
        Log in
      </h2>
      <p className="panel-intro">Choose your role, then enter your details.</p>

      <div className="role-switch" role="group" aria-label="Log in as">
        {ROLES.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            type="button"
            className={role === value ? 'role-option active' : 'role-option'}
            aria-pressed={role === value}
            onClick={() => switchRole(value)}
          >
            <Icon size={17} aria-hidden="true" />
            {label}
          </button>
        ))}
      </div>

      <form className="login-form" onSubmit={handleSubmit} noValidate>
        {errors.form && (
          <p className="form-alert" role="alert">
            {errors.form}
          </p>
        )}

        <FormField
          label={isAdmin ? 'Username' : 'Student ID'}
          name="username"
          value={username}
          onChange={(e) => {
            setUsername(isAdmin ? e.target.value : e.target.value.toUpperCase());
            setErrors({});
          }}
          error={errors.username}
          placeholder={isAdmin ? 'gect.admin' : 'TCR22CS008'}
          autoComplete="username"
        />

        <div className="form-field">
          <label htmlFor="password">Password</label>
          <div className="password-wrap">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              className={errors.password ? 'input has-error' : 'input'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors({});
              }}
              autoComplete="current-password"
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? 'password-error' : undefined}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((shown) => !shown)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p id="password-error" className="field-error">
              {errors.password}
            </p>
          )}
        </div>

        <button type="submit" className="btn btn-primary btn-large" disabled={isLoading}>
          <LogIn size={18} aria-hidden="true" />
          {isLoading ? 'Loading…' : `Log in as ${isAdmin ? 'admin' : 'student'}`}
        </button>
      </form>

      <div className="demo-accounts">
        <h3>
          <Info size={16} aria-hidden="true" />
          Demo accounts
        </h3>

        {DEMO_ADMINS.map((account) => (
          <div key={account.username} className="demo-account">
            <div>
              <strong>Admin · {getInstitution(account.institutionId).shortName}</strong>
              <span className="code">
                {account.username} / {account.password}
              </span>
            </div>
            <button
              type="button"
              className="btn btn-small btn-secondary"
              onClick={() => fillDemo('admin', account.username, account.password)}
            >
              Use
            </button>
          </div>
        ))}

        {demoStudent && (
          <div className="demo-account">
            <div>
              <strong>Student · {demoStudent.studentName}</strong>
              <span className="code">
                {demoStudent.studentId} / {DEMO_STUDENT_PASSWORD}
              </span>
            </div>
            <button
              type="button"
              className="btn btn-small btn-secondary"
              onClick={() => fillDemo('student', demoStudent.studentId, DEMO_STUDENT_PASSWORD)}
            >
              Use
            </button>
          </div>
        )}

        <p className="field-hint">
          Students log in with their student ID. Demo password:{' '}
          <span className="code">{DEMO_STUDENT_PASSWORD}</span>
        </p>
      </div>
    </section>
  );
}
