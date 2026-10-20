import { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import AdminLogin from './components/AdminLogin';
import DashboardOverview from './components/DashboardOverview';
import DepositLogs from './components/DepositLogs';
import WiFiSessions from './components/WiFiSessionLogs';
import BinManagement from './components/BinManagement';
import SystemSettings from './components/SystemSettings';
import logo from './assets/RECon-Logo.png';
import MobileDashboard from './mobile/MobileDashboard';
import MobileDeposit from './mobile/MobileDeposit';
import MobileSession from './mobile/MobileSession';

function LoginPage({ onLoginSuccess, logoSrc }) {
  const navigate = useNavigate();

  function handleLoginSuccess(result, remember) {
    onLoginSuccess(result, remember);
    navigate('/dashboard', { replace: true });
  }

  return <AdminLogin onLoginSuccess={handleLoginSuccess} logoSrc={logoSrc} />;
}

function DashboardPage({ adminName, adminRole, logoSrc, avatarSrc, onSignOut }) {
  const navigate = useNavigate();

  function handleSignOut() {
    onSignOut();
    navigate('/login', { replace: true });
  }

  function handleNavigate(id) {
    if (id === 'logs') navigate('/deposit-logs');
    if (id === 'wifi') navigate('/wifi-sessions');
    if (id === 'bins') navigate('/bin-management');
    if (id === 'settings') navigate('/settings');
  }

  return (
    <DashboardOverview
      adminName={adminName}
      adminRole={adminRole}
      logoSrc={logoSrc}
      avatarSrc={avatarSrc}
      onSignOut={handleSignOut}
      onNavigate={handleNavigate}
    />
  );
}

function DepositLogsPage({ adminName, adminRole, logoSrc, avatarSrc, onSignOut }) {
  const navigate = useNavigate();

  function handleSignOut() {
    onSignOut();
    navigate('/login', { replace: true });
  }

  function handleNavigate(id) {
    if (id === 'dashboard') navigate('/dashboard');
    if (id === 'wifi') navigate('/wifi-sessions');
    if (id === 'bins') navigate('/bin-management');
    if (id === 'settings') navigate('/settings');
  }

  return (
    <DepositLogs
      adminName={adminName}
      adminRole={adminRole}
      logoSrc={logoSrc}
      avatarSrc={avatarSrc}
      onSignOut={handleSignOut}
      onNavigate={handleNavigate}
    />
  );
}

function WiFiSessionsPage({ adminName, adminRole, logoSrc, avatarSrc, onSignOut }) {
  const navigate = useNavigate();

  function handleSignOut() {
    onSignOut();
    navigate('/login', { replace: true });
  }

  function handleNavigate(id) {
    if (id === 'dashboard') navigate('/dashboard');
    if (id === 'logs') navigate('/deposit-logs');
    if (id === 'bins') navigate('/bin-management');
    if (id === 'settings') navigate('/settings');
  }

  return (
    <WiFiSessions
      adminName={adminName}
      adminRole={adminRole}
      logoSrc={logoSrc}
      avatarSrc={avatarSrc}
      onSignOut={handleSignOut}
      onNavigate={handleNavigate}
    />
  );
}

function BinManagementPage({ adminName, adminRole, logoSrc, avatarSrc, onSignOut }) {
  const navigate = useNavigate();

  function handleSignOut() {
    onSignOut();
    navigate('/login', { replace: true });
  }

  function handleNavigate(id) {
    if (id === 'dashboard') navigate('/dashboard');
    if (id === 'logs') navigate('/deposit-logs');
    if (id === 'wifi') navigate('/wifi-sessions');
    if (id === 'settings') navigate('/settings');
  }

  return (
    <BinManagement
      adminName={adminName}
      adminRole={adminRole}
      logoSrc={logoSrc}
      avatarSrc={avatarSrc}
      onSignOut={handleSignOut}
      onNavigate={handleNavigate}
    />
  );
}

function SystemSettingsPage({ adminName, adminRole, logoSrc, avatarSrc, onSignOut }) {
  const navigate = useNavigate();

  function handleSignOut() {
    onSignOut();
    navigate('/login', { replace: true });
  }

  function handleNavigate(id) {
    if (id === 'dashboard') navigate('/dashboard');
    if (id === 'logs') navigate('/deposit-logs');
    if (id === 'wifi') navigate('/wifi-sessions');
    if (id === 'bins') navigate('/bin-management');
  }

  return (
    <SystemSettings
      adminName={adminName}
      adminRole={adminRole}
      logoSrc={logoSrc}
      avatarSrc={avatarSrc}
      onSignOut={handleSignOut}
      onNavigate={handleNavigate}
    />
  );
}

function ProtectedRoute({ isAuthenticated, children }) {
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () =>
      localStorage.getItem('isAdmin') === 'true' ||
      sessionStorage.getItem('isAdmin') === 'true'
  );
  const [adminName, setAdminName] = useState('Admin User');
  const [adminRole, setAdminRole] = useState('Administrator');

  function handleLoginSuccess(result, remember) {
    setIsAuthenticated(true);
    setAdminName(result.username);
    setAdminRole(result.role ?? 'Administrator');
    (remember ? localStorage : sessionStorage).setItem('isAdmin', 'true');
  }

  function handleSignOut() {
    setIsAuthenticated(false);
    localStorage.removeItem('isAdmin');
    sessionStorage.removeItem('isAdmin');
  }

  return (
    <Routes>
      {/* ---------- mobile / student side: public, no login ---------- */}
      <Route path="/m" element={<MobileDashboard />} />
      <Route path="/m/bin/:binId" element={<MobileDashboard />} />
      <Route path="/m/deposit" element={<MobileDeposit />} />
      <Route path="/m/session" element={<MobileSession />} />

      {/* ---------- admin side ---------- */}
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <LoginPage onLoginSuccess={handleLoginSuccess} logoSrc={logo} />
          )
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <DashboardPage
              adminName={adminName}
              adminRole={adminRole}
              logoSrc={logo}
              onSignOut={handleSignOut}
            />
          </ProtectedRoute>
        }
      />

      <Route
        path="/deposit-logs"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <DepositLogsPage
              adminName={adminName}
              adminRole={adminRole}
              logoSrc={logo}
              onSignOut={handleSignOut}
            />
          </ProtectedRoute>
        }
      />

      <Route
        path="/wifi-sessions"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <WiFiSessionsPage
              adminName={adminName}
              adminRole={adminRole}
              logoSrc={logo}
              onSignOut={handleSignOut}
            />
          </ProtectedRoute>
        }
      />

      <Route
        path="/bin-management"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <BinManagementPage
              adminName={adminName}
              adminRole={adminRole}
              logoSrc={logo}
              onSignOut={handleSignOut}
            />
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <SystemSettingsPage
              adminName={adminName}
              adminRole={adminRole}
              logoSrc={logo}
              onSignOut={handleSignOut}
            />
          </ProtectedRoute>
        }
      />

      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />}
      />
    </Routes>
  );
}