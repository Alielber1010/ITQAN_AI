import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate, useNavigate, useLocation } from 'react-router-dom';
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

function LanguageSwitcher({ className = "btn nav-link lang-switch-btn" }) {
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
      className={className}
      style={{ width: '100%', textAlign: 'left', background: 'transparent', cursor: 'pointer' }}
      onClick={toggleLanguage}
      type="button"
    >
      🌐 {t('app.language')}
    </button>
  );
}

const PRIMARY_TABS = [
  { to: '/dashboard', icon: '🏠', labelKey: 'nav.dashboard' },
  { to: '/chatbot', icon: '💬', labelKey: 'nav.chatbot' },
  { to: '/goals', icon: '🎯', labelKey: 'nav.goals' },
  { to: '/zakat', icon: '🕌', labelKey: 'nav.zakat' },
];

const MORE_PATHS = ['/profile', '/education', '/admin'];

function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [moreOpen, setMoreOpen] = useState(false);

  async function handleLogout() {
    try {
      await logout();
      navigate('/auth');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  }

  // Close the "More" sheet whenever the route changes
  useEffect(() => {
    setMoreOpen(false);
  }, [location.pathname]);

  // Escape-to-close + lock body scroll while the sheet is open
  useEffect(() => {
    if (!moreOpen) return;
    const onKeyDown = (e) => { if (e.key === 'Escape') setMoreOpen(false); };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [moreOpen]);

  const isMoreActive = MORE_PATHS.some(p => location.pathname.startsWith(p));

  return (
    <div className="layout-container">
      <nav className="navbar" aria-label="Primary">
        <div className="navbar-brand">
          <img src="/logo-itqan.png" alt={t('app.title')} className="navbar-brand-logo" />
          <span className="navbar-brand-caption">{t('app.title')}</span>
        </div>
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

      {/* Mobile bottom tab bar */}
      <nav className="bottom-tabbar" aria-label="Primary mobile">
        {PRIMARY_TABS.map(tab => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) => isActive ? "bottom-tab active" : "bottom-tab"}
          >
            <span className="bottom-tab-icon" aria-hidden="true">{tab.icon}</span>
            <span>{t(tab.labelKey)}</span>
          </NavLink>
        ))}
        <button
          type="button"
          className={isMoreActive || moreOpen ? "bottom-tab bottom-tab-more active" : "bottom-tab bottom-tab-more"}
          onClick={() => setMoreOpen(o => !o)}
          aria-expanded={moreOpen}
        >
          <span className="bottom-tab-icon" aria-hidden="true">⋯</span>
          <span>{t('nav.more')}</span>
        </button>
      </nav>

      {moreOpen && (
        <>
          <div className="sheet-backdrop" onClick={() => setMoreOpen(false)} />
          <div className="more-sheet" role="dialog" aria-label={t('nav.more')}>
            <div className="more-sheet-handle" />
            <NavLink to="/profile" className={({isActive}) => isActive ? "more-sheet-item active" : "more-sheet-item"}>
              👤 {t('nav.profile')}
            </NavLink>
            <NavLink to="/education" className={({isActive}) => isActive ? "more-sheet-item active" : "more-sheet-item"}>
              📚 {t('nav.education')}
            </NavLink>
            {user && user.userType === 'Admin' && (
              <NavLink to="/admin" className={({isActive}) => isActive ? "more-sheet-item active" : "more-sheet-item"}>
                🛡️ {t('nav.admin')}
              </NavLink>
            )}
            <div className="more-sheet-divider" />
            <LanguageSwitcher className="more-sheet-item" />
            <button type="button" className="more-sheet-item" onClick={handleLogout}>
              🚪 {t('app.logout')}
            </button>
          </div>
        </>
      )}
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
