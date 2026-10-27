/**
 * Page routes.
 *
 * Public pages (top bar layout):
 *   /             -> LandingPage (introduction + login)
 *   /login        -> LandingPage (same page; protected pages send visitors here)
 *   /about        -> AboutPage (what CertVerify does)
 *
 * Signed-in pages (sidebar layout):
 *   /admin        -> AdminDashboard        (admin only)
 *   /admin/issue  -> IssueCertificatePage  (admin only)
 *   /student      -> StudentDashboard      (student: own certificates; admin: any student via ?id=)
 */
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CertificateProvider } from './context/CertificateContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import PublicLayout from './layouts/PublicLayout';
import AppLayout from './layouts/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import AdminDashboard from './pages/AdminDashboard';
import IssueCertificatePage from './pages/IssueCertificatePage';
import StudentDashboard from './pages/StudentDashboard';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <CertificateProvider>
          <AuthProvider>
            <Routes>
              <Route element={<PublicLayout />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LandingPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="*" element={<NotFound />} />
              </Route>

              <Route element={<AppLayout />}>
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute allow={['admin']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/issue"
                  element={
                    <ProtectedRoute allow={['admin']}>
                      <IssueCertificatePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student"
                  element={
                    <ProtectedRoute allow={['admin', 'student']}>
                      <StudentDashboard />
                    </ProtectedRoute>
                  }
                />
              </Route>
            </Routes>
          </AuthProvider>
        </CertificateProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
