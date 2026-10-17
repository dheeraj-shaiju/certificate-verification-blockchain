/**
 * DEMO LOGIN – NOT REAL SECURITY.
 *
 * Passwords are checked here in the browser, so anyone could read or bypass them.
 * This only exists so the prototype can show separate Admin and Student access.
 *
 * Phase II: replace checkDemoLogin() with a call to the backend, e.g.
 *   POST /api/auth/login  { role, username, password }  ->  { token, user }
 * and keep the token instead of the plain user object.
 */

import { getInstitution } from '../utils/constants';

// One admin account per college. Each admin only sees their own college's certificates.
export const DEMO_ADMINS = [
  { username: 'gect.admin', password: 'admin123', institutionId: 'gect' },
  { username: 'geck.admin', password: 'admin123', institutionId: 'geck' },
];
export const DEMO_STUDENT_PASSWORD = 'student123';

const SESSION_KEY = 'cvs.session.v1';

/**
 * @param {{ role: 'admin' | 'student', username: string, password: string }} credentials
 * @param {Array} records - certificate records (a student must have at least one)
 * @returns {{ user: object } | { error: string }}
 */
export function checkDemoLogin({ role, username, password }, records) {
  if (role === 'admin') {
    const account = DEMO_ADMINS.find(
      (a) => a.username === username.trim().toLowerCase() && a.password === password,
    );
    if (!account) return { error: 'Incorrect username or password.' };
    const institution = getInstitution(account.institutionId);
    return {
      user: {
        role: 'admin',
        name: `${institution.shortName} admin`,
        username: account.username,
        institutionId: institution.id,
        institutionName: institution.name,
        institutionShortName: institution.shortName,
      },
    };
  }

  const studentId = username.trim().toUpperCase();
  const record = records.find((r) => r.studentId === studentId);
  // Same message for both mistakes, so the form does not reveal which IDs exist.
  if (!record || password !== DEMO_STUDENT_PASSWORD) {
    return { error: 'Incorrect student ID or password.' };
  }
  return { user: { role: 'student', name: record.studentName, studentId } };
}

// ---------- Keep the user signed in across page refreshes ----------

export function loadSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    const user = raw ? JSON.parse(raw) : null;
    // Admin sessions from older versions had no college: ask them to log in again.
    if (user?.role === 'admin' && !user.institutionId) return null;
    return user;
  } catch {
    return null;
  }
}

export function saveSession(user) {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } catch {
    // If storage is blocked the user stays signed in until the page is closed.
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    // Nothing to clear.
  }
}
