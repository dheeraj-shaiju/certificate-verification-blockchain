/**
 * Who is signed in (demo login).
 *
 * Usage inside any component:
 *   const { user, login, logout } = useAuth();
 *   user is null when signed out, or { role: 'admin' | 'student', name, studentId? }
 */
import { createContext, useContext, useState } from 'react';
import { checkDemoLogin, loadSession, saveSession, clearSession } from '../services/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Start with the saved session, so a refresh does not sign the user out.
  const [user, setUser] = useState(() => loadSession());
  // After a deliberate logout we remember it, so the login page does not send the next
  // person back to the previous user's page. returnTo is an optional page to come back to.
  const [logoutInfo, setLogoutInfo] = useState(null); // { returnTo } or null

  function login(credentials, records) {
    const result = checkDemoLogin(credentials, records);
    if (result.user) {
      saveSession(result.user);
      setUser(result.user);
      setLogoutInfo(null);
    }
    return result;
  }

  function logout(returnTo = null) {
    clearSession();
    setUser(null);
    setLogoutInfo({ returnTo });
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, logoutInfo }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside <AuthProvider>.');
  return context;
}

// Where each role lands after logging in.
export function homePathFor(user) {
  return user?.role === 'admin' ? '/admin' : '/student';
}
