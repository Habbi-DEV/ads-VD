import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProfileProvider } from './contexts/ProfileContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/dashboard/DashboardLayout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import CreateCreative from './pages/dashboard/CreateCreative';
import Library from './pages/dashboard/Library';
import CreditStore from './pages/dashboard/CreditStore';
import Settings from './pages/dashboard/Settings';
import { handleGoogleRedirect } from './lib/googleAuth';

// Handle the Google OAuth redirect fallback on app startup.
handleGoogleRedirect();

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <ProfileProvider>
                  <DashboardLayout />
                </ProfileProvider>
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard/create" replace />} />
            <Route path="create" element={<CreateCreative />} />
            <Route path="library" element={<Library />} />
            <Route path="credits" element={<CreditStore />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
