import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const CONTACT_EMAIL = 'partners@itqan.ai';

export default function Contact() {
  const { t } = useTranslation();
  const [form, setForm] = useState({ company: '', name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const subject = encodeURIComponent(`ITQAN AI for Business — ${form.company || form.name}`);
    const body = encodeURIComponent(
      `Company: ${form.company}\nName: ${form.name}\nEmail: ${form.email}\n\n${form.message}`
    );
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    setSent(true);
  }

  return (
    <div className="contact-page">
      <div className="contact-hero glass-panel">
        <h1>{t('contact.heroTitle')}</h1>
        <p className="contact-hero-subtitle">{t('contact.heroSubtitle')}</p>
      </div>

      <div className="contact-grid">
        <div className="glass-panel contact-benefits">
          <h2>{t('contact.offerTitle')}</h2>
          <ul className="contact-benefits-list">
            <li>{t('contact.benefit1')}</li>
            <li>{t('contact.benefit2')}</li>
            <li>{t('contact.benefit3')}</li>
            <li>{t('contact.benefit4')}</li>
          </ul>
          <p className="contact-direct-email">
            {t('contact.directEmailLabel')}{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className="auth-link">{CONTACT_EMAIL}</a>
          </p>
        </div>

        <div className="glass-panel contact-form-panel">
          <h2>{t('contact.formTitle')}</h2>

          {sent && (
            <div className="auth-alert auth-alert-success">{t('contact.sentMessage')}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-row-2">
              <div className="auth-field">
                <label htmlFor="contact-company">{t('contact.company')}</label>
                <input
                  id="contact-company"
                  name="company"
                  type="text"
                  className="input-field"
                  required
                  value={form.company}
                  onChange={handleChange}
                />
              </div>
              <div className="auth-field">
                <label htmlFor="contact-name">{t('contact.name')}</label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  className="input-field"
                  required
                  value={form.name}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="contact-email">{t('auth.emailLabel')}</label>
              <input
                id="contact-email"
                name="email"
                type="email"
                className="input-field"
                required
                placeholder="you@company.com"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className="auth-field">
              <label htmlFor="contact-message">{t('contact.message')}</label>
              <textarea
                id="contact-message"
                name="message"
                className="input-field contact-textarea"
                required
                rows={5}
                placeholder={t('contact.messagePlaceholder')}
                value={form.message}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="btn btn-primary auth-submit">
              {t('contact.send')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
