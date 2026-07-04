import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

export default function Auth() {
  const navigate = useNavigate();
  const { login, signup, verifyMfa, resetPassword } = useAuth();
  const { t } = useTranslation();

  const [isRegister, setIsRegister] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isMfaStep, setIsMfaStep] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // MFA fields
  const [tempToken, setTempToken] = useState('');
  const [otpCode, setOtpCode] = useState('');

  function clearForm() {
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setOtpCode('');
    setTempToken('');
    setError('');
    setSuccess('');
    setIsMfaStep(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

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
        navigate('/dashboard');
      } else {
        const result = await login(email, password);
        if (result.mfaRequired) {
          setTempToken(result.tempToken);
          setIsMfaStep(true);
          setSuccess(t('auth.otpSent'));
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      setError(err.message || t('auth.connectionError'));
    } finally {
      setLoading(false);
    }
  }

  async function handleMfaVerify(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (otpCode.length !== 6) {
      setError(t('auth.otpLength'));
      return;
    }

    setLoading(true);
    try {
      await verifyMfa(tempToken, otpCode);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || t('auth.otpInvalid'));
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email) {
      setError(t('auth.enterEmail'));
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email);
      setSuccess(t('auth.resetSubmitted'));
    } catch (err) {
      setError(err.message || t('auth.resetFailed'));
    } finally {
      setLoading(false);
    }
  }

  // ── MFA Verification View ──
  if (isMfaStep) {
    return (
      <div className="auth-page">
        <div className="auth-container glass-panel">
          <div className="auth-header">
            <div className="auth-logo">ITQAN AI</div>
            <p className="auth-subtitle">{t('auth.mfaTitle')}</p>
          </div>

          {error && <div className="auth-alert auth-alert-error">{error}</div>}
          {success && <div className="auth-alert auth-alert-success">{success}</div>}

          <div style={{ textAlign: 'center', marginBottom: '16px', color: 'var(--text-muted)' }}>
            <p>{t('auth.mfaDescription')}</p>
          </div>

          <form onSubmit={handleMfaVerify}>
            <div className="auth-field">
              <label htmlFor="mfa-otp">{t('auth.otpLabel')}</label>
              <input
                id="mfa-otp"
                type="text"
                className="input-field"
                required
                placeholder="000000"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                disabled={loading}
                style={{ textAlign: 'center', fontSize: '24px', letterSpacing: '8px', fontWeight: 'bold' }}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary auth-submit"
              disabled={loading || otpCode.length !== 6}
            >
              {loading ? <span className="auth-spinner" /> : t('auth.verifyCode')}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              <span
                className="auth-link"
                onClick={() => { clearForm(); }}
              >
                {t('auth.backToLogin')}
              </span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Forgot Password View ──
  if (isForgotPassword) {
    return (
      <div className="auth-page">
        <div className="auth-container glass-panel">
          <div className="auth-header">
            <div className="auth-logo">ITQAN AI</div>
            <p className="auth-subtitle">{t('auth.resetTitle')}</p>
          </div>

          {error && <div className="auth-alert auth-alert-error">{error}</div>}
          {success && <div className="auth-alert auth-alert-success">{success}</div>}

          <form onSubmit={handleForgotPassword}>
            <div className="auth-field">
              <label htmlFor="reset-email">{t('auth.emailLabel')}</label>
              <input
                id="reset-email"
                type="email"
                className="input-field"
                required
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary auth-submit"
              disabled={loading}
            >
              {loading ? <span className="auth-spinner" /> : t('auth.requestReset')}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              {t('auth.rememberPassword')}{' '}
              <span
                className="auth-link"
                onClick={() => { setIsForgotPassword(false); clearForm(); }}
              >
                {t('auth.backToLogin')}
              </span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Main Login / Register View ──
  return (
    <div className="auth-page">
      <div className="auth-container glass-panel">
        {/* Header */}
        <div className="auth-header">
          <div className="auth-logo">ITQAN AI</div>
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

        {/* Error / Success Messages */}
        {error && <div className="auth-alert auth-alert-error">{error}</div>}
        {success && <div className="auth-alert auth-alert-success">{success}</div>}

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

          {!isRegister && (
            <div className="auth-forgot">
              <span
                className="auth-link"
                onClick={() => { setIsForgotPassword(true); clearForm(); }}
              >
                {t('auth.forgotPassword')}
              </span>
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
        </div>
      </div>
    </div>
  );
}
