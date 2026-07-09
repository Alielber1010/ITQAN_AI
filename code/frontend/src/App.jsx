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
import Contact from './pages/Contact';
import { HomeIcon, UserIcon, TargetIcon, ChatIcon, CrescentIcon, BookIcon, MailIcon, ShieldIcon, LogOutIcon, GlobeIcon, MenuIcon } from './components/Icons';
import './i18n';
import './index.css';

function LanguageSwitcher({ className = "btn nav-link lang-switch-btn", compact = false }) {
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
      style={compact
        ? { background: 'transparent', cursor: 'pointer' }
        : { width: '100%', textAlign: 'left', background: 'transparent', cursor: 'pointer' }}
      onClick={toggleLanguage}
      type="button"
    >
      <GlobeIcon size={16} /> {t('app.language')}
    </button>
  );
}

const TOPBAR_LINKS = [
  { to: '/dashboard', icon: HomeIcon, labelKey: 'nav.dashboard' },
  { to: '/profile', icon: UserIcon, labelKey: 'nav.profile' },
  { to: '/goals', icon: TargetIcon, labelKey: 'nav.goals' },
  { to: '/chatbot', icon: ChatIcon, labelKey: 'nav.chatbot' },
  { to: '/zakat', icon: CrescentIcon, labelKey: 'nav.zakat' },
  { to: '/education', icon: BookIcon, labelKey: 'nav.education' },
  { to: '/contact', icon: MailIcon, labelKey: 'nav.contact' },
];

function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  async function handleLogout() {
    try {
      await logout();
      navigate('/auth');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  }

  // Close the mobile drawer whenever the route changes
  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  // Escape-to-close + lock body scroll while the drawer is open
  useEffect(() => {
    if (!drawerOpen) return;
    const onKeyDown = (e) => { if (e.key === 'Escape') setDrawerOpen(false); };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

  const navLinks = user && user.userType === 'Admin'
    ? [...TOPBAR_LINKS, { to: '/admin', icon: ShieldIcon, labelKey: 'nav.admin' }]
    : TOPBAR_LINKS;

  return (
    <div className="layout-container">
      <nav className="navbar" aria-label="Primary">
        <button
          type="button"
          className="navbar-menu-btn"
          onClick={() => setDrawerOpen(o => !o)}
          aria-expanded={drawerOpen}
          aria-label={t('nav.menu')}
        >
          <MenuIcon size={20} />
        </button>

        <div className="navbar-brand">
          <img src="/logo-itqan.png" alt={t('app.title')} className="navbar-brand-logo" />
          <span className="navbar-brand-caption">{t('app.title')}</span>
        </div>

        <div className="navbar-links">
          {navLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({isActive}) => isActive ? "nav-link active" : "nav-link"}
            >
              {t(link.labelKey)}
            </NavLink>
          ))}
        </div>

        <div className="navbar-actions">
          {user && (
            <span className="navbar-user-name">{user.displayName || user.name || user.email}</span>
          )}
          <LanguageSwitcher compact className="btn nav-link lang-switch-btn" />
          <button
            className="btn nav-link"
            style={{ background: 'transparent' }}
            onClick={handleLogout}
          >
            {t('app.logout')}
          </button>
        </div>
      </nav>

      <main className="main-content">
        {children}
      </main>

      {/* Mobile slide-out drawer */}
      {drawerOpen && (
        <>
          <div className="sheet-backdrop" onClick={() => setDrawerOpen(false)} />
          <div className="nav-drawer" role="dialog" aria-label={t('nav.menu')}>
            <div className="nav-drawer-brand">
              <img src="/logo-itqan.png" alt={t('app.title')} className="navbar-brand-logo" />
              <span className="navbar-brand-caption">{t('app.title')}</span>
            </div>

            {user && <div className="nav-drawer-user">{user.displayName || user.name || user.email}</div>}

            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({isActive}) => isActive ? "nav-drawer-item active" : "nav-drawer-item"}
              >
                <link.icon size={18} aria-hidden="true" /> {t(link.labelKey)}
              </NavLink>
            ))}

            <div className="nav-drawer-divider" />
            <LanguageSwitcher className="nav-drawer-item" />
            <button type="button" className="nav-drawer-item" onClick={handleLogout}>
              <LogOutIcon size={18} aria-hidden="true" /> {t('app.logout')}
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

function ContactRoute() {
  const { user, loading } = useAuth();
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="auth-loading-screen">
        <div className="auth-spinner-large" />
        <p>Loading...</p>
      </div>
    );
  }

  if (user) return <Layout><Contact /></Layout>;

  return (
    <div className="public-page">
      <div className="public-page-header">
        <NavLink to="/" className="public-page-brand">
          <img src="/logo-itqan.png" alt={t('app.title')} className="navbar-brand-logo" />
          <span className="navbar-brand-caption">{t('app.title')}</span>
        </NavLink>
        <NavLink to="/auth" className="btn btn-primary">{t('auth.login')}</NavLink>
      </div>
      <Contact />
    </div>
  );
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
          <Route path="/contact" element={<ContactRoute />} />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
