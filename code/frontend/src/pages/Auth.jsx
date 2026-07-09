import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

export default function Auth() {
  const navigate = useNavigate();
  const { login, signup } = useAuth();
  const { t } = useTranslation();

  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  function clearForm() {
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    // Validation
    if (isRegister) {
      if (!name.trim()) {
        setError(t('auth.nameRequired'));
        return;
      }
      if (password.length < 6) {
        setError(t('auth.passwordMinLength'));
        return;
      }
      if (password !== confirmPassword) {
        setError(t('auth.passwordsNoMatch'));
        return;
      }
    }

    setLoading(true);
    try {
      if (isRegister) {
        await signup(name.trim(), email, password);
      } else {
        await login(email, password);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || t('auth.connectionError'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container glass-panel">
        {/* Header */}
        <div className="auth-header">
          <div className="auth-logo">
            <img src="/logo-itqan.png" alt="ITQAN AI" />
          </div>
          <p className="auth-subtitle">{t('auth.subtitle')}</p>
        </div>

        {/* Login / Register Toggle */}
        <div className="auth-toggle">
          <button
            className={`auth-toggle-btn ${!isRegister ? 'active' : ''}`}
            onClick={() => { setIsRegister(false); clearForm(); }}
            type="button"
          >
            {t('auth.login')}
          </button>
          <button
            className={`auth-toggle-btn ${isRegister ? 'active' : ''}`}
            onClick={() => { setIsRegister(true); clearForm(); }}
            type="button"
          >
            {t('auth.register')}
          </button>
        </div>

        {/* Error Message */}
        {error && <div className="auth-alert auth-alert-error">{error}</div>}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {isRegister && (
            <div className="auth-field">
              <label htmlFor="auth-name">{t('auth.fullName')}</label>
              <input
                id="auth-name"
                type="text"
                className="input-field"
                required
                placeholder={t('auth.fullNamePlaceholder')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
              />
            </div>
          )}

          <div className="auth-field">
            <label htmlFor="auth-email">{t('auth.emailLabel')}</label>
            <input
              id="auth-email"
              type="email"
              className="input-field"
              required
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="auth-field">
            <label htmlFor="auth-password">{t('auth.password')}</label>
            <input
              id="auth-password"
              type="password"
              className="input-field"
              required
              placeholder="••••••••"
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          {isRegister && (
            <div className="auth-field">
              <label htmlFor="auth-confirm-password">{t('auth.confirmPassword')}</label>
              <input
                id="auth-confirm-password"
                type="password"
                className="input-field"
                required
                placeholder="••••••••"
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
              />
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary auth-submit"
            disabled={loading}
          >
            {loading ? (
              <span className="auth-spinner" />
            ) : isRegister ? (
              t('auth.createAccount')
            ) : (
              t('auth.signIn')
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="auth-footer" style={{ marginTop: '20px' }}>
          <p>
            {isRegister ? t('auth.alreadyHaveAccount') : t('auth.noAccount')}{' '}
            <span
              className="auth-link"
              onClick={() => { setIsRegister(!isRegister); clearForm(); }}
            >
              {isRegister ? t('auth.loginHere') : t('auth.registerHere')}
            </span>
          </p>
          <p className="auth-business-link">
            <Link to="/contact" className="auth-link">{t('contact.heroTitle')}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
