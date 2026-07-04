import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

export default function Profile() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    income: '0',
    assets: '0',
    liabilities: '0',
    savings: '0'
  });
  
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('itqan_token');
        const res = await fetch(`${API_URL}/api/profile/${user.uid}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success && data.data) {
          setFormData({
            income: data.data.income || '0',
            assets: data.data.assets || '0',
            liabilities: data.data.liabilities || '0',
            savings: data.data.savings || '0',
          });
        }
      } catch (err) {
        console.error("Fetch profile failed:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.uid) fetchProfile();
  }, [user]);

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(t('profile.saving'));
    
    try {
      const token = localStorage.getItem('itqan_token');
      const res = await fetch(`${API_URL}/api/profile`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...formData, userId: user.uid })
      });
      const data = await res.json();
      if (data.success) {
        setStatus(t('profile.saved'));
      } else {
        setStatus(t('profile.error') + ': ' + data.message);
      }
    } catch (err) {
      console.error("Save profile failed:", err);
      setStatus(t('profile.error'));
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>{t('profile.title')}</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>{t('profile.subtitle')}</p>
      
      <div className="glass-panel">
        <form onSubmit={handleSubmit}>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '14px', fontWeight: '500' }}>{t('profile.income')}</label>
            <input type="number" name="income" value={formData.income} onChange={handleChange} className="input-field" placeholder="0.00" required />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '14px', fontWeight: '500' }}>{t('profile.assets')}</label>
            <input type="number" name="assets" value={formData.assets} onChange={handleChange} className="input-field" placeholder="0.00" required />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '14px', fontWeight: '500' }}>{t('profile.liabilities')}</label>
            <input type="number" name="liabilities" value={formData.liabilities} onChange={handleChange} className="input-field" placeholder="0.00" required />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ fontSize: '14px', fontWeight: '500' }}>{t('profile.savings')}</label>
            <input type="number" name="savings" value={formData.savings} onChange={handleChange} className="input-field" placeholder="0.00" required />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            {t('profile.save')}
          </button>

          {status && (
            <div style={{ marginTop: '16px', padding: '12px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', textAlign: 'center' }}>
              {status}
            </div>
          )}

        </form>
      </div>
    </div>
  );
}
