import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Chatbot from './pages/Chatbot';
import Auth from './pages/Auth';
import ZakatCalculator from './pages/ZakatCalculator';
import Goals from './pages/Goals';
import Education from './pages/Education';
import AdminDashboard from './pages/AdminDashboard';
import './i18n';
import './index.css';

function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
  };

  // Apply RTL direction to document when language changes
  useEffect(() => {
    const isArabic = i18n.language === 'ar';
    document.documentElement.setAttribute('dir', isArabic ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', i18n.language);
  }, [i18n.language]);

  return (
    <button
      className="btn nav-link lang-switch-btn"
      style={{ width: '100%', textAlign: 'left', background: 'transparent', cursor: 'pointer' }}
      onClick={toggleLanguage}
      type="button"
    >
      🌐 {t('app.language')}
    </button>
  );
}

function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  async function handleLogout() {
    try {
      await logout();
      navigate('/auth');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  }

  return (
    <div className="layout-container">
      <nav className="navbar">
        <div className="navbar-brand">{t('app.title')}</div>
        {user && (
          <div className="navbar-user">
            <span className="navbar-user-name">{user.displayName || user.name || user.email}</span>
          </div>
        )}
        <NavLink to="/dashboard" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>{t('nav.dashboard')}</NavLink>
        <NavLink to="/profile" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>{t('nav.profile')}</NavLink>
        <NavLink to="/goals" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>{t('nav.goals')}</NavLink>
        <NavLink to="/chatbot" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>{t('nav.chatbot')}</NavLink>
        <NavLink to="/zakat" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>{t('nav.zakat')}</NavLink>
        <NavLink to="/education" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>{t('nav.education')}</NavLink>
        {user && user.userType === 'Admin' && (
          <NavLink to="/admin" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>{t('nav.admin')}</NavLink>
        )}
        <div style={{ marginTop: 'auto' }}>
          <LanguageSwitcher />
          <button
            className="btn nav-link"
            style={{width: '100%', textAlign: 'left', background: 'transparent'}}
            onClick={handleLogout}
          >
            {t('app.logout')}
          </button>
        </div>
      </nav>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="auth-loading-screen">
        <div className="auth-spinner-large" />
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" />;
  return <Layout>{children}</Layout>;
}

function AuthRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="auth-loading-screen">
        <div className="auth-spinner-large" />
        <p>Loading...</p>
      </div>
    );
  }

  // If already logged in, redirect to dashboard
  if (user) return <Navigate to="/dashboard" />;
  return <Auth />;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/auth" element={<AuthRoute />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/chatbot" element={<ProtectedRoute><Chatbot /></ProtectedRoute>} />
          <Route path="/zakat" element={<ProtectedRoute><ZakatCalculator /></ProtectedRoute>} />
          <Route path="/goals" element={<ProtectedRoute><Goals /></ProtectedRoute>} />
          <Route path="/education" element={<ProtectedRoute><Education /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
