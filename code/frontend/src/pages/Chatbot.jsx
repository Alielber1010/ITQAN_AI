import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';

export default function Chatbot() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [messages, setMessages] = useState([
    { sender: 'ai', text: t('chatbot.welcome') }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const endRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if(!input.trim()) return;

    setMessages(prev => [...prev, { sender: 'user', text: input }]);
    setInput('');
    setIsLoading(true);

    try {
      const token = localStorage.getItem('itqan_token');
      const res = await fetch(`${API_URL}/api/ai/chat`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: input, history: messages, userId: user.uid })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { sender: 'ai', text: data.reply || data.message }]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'ai', text: t('chatbot.error') }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 80px)' }}>
      <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>{t('chatbot.title')}</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>{t('chatbot.subtitle')}</p>
      
      <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
        
        {/* Chat History View */}
        <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{
                maxWidth: '70%',
                padding: '16px',
                borderRadius: '16px',
                lineHeight: '1.5',
                whiteSpace: 'pre-wrap',
                background: msg.sender === 'user' ? 'var(--primary-color)' : 'var(--surface)',
                color: msg.sender === 'user' ? 'white' : 'var(--text-main)',
                boxShadow: msg.sender === 'ai' ? 'var(--glass-shadow)' : 'none',
                border: msg.sender === 'ai' ? '1px solid var(--glass-border)' : 'none',
                borderBottomRightRadius: msg.sender === 'user' ? '4px' : '16px',
                borderBottomLeftRadius: msg.sender === 'ai' ? '4px' : '16px',
              }}>
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>
            </div>
          ))}
          {isLoading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{ padding: '16px', borderRadius: '16px', background: 'var(--surface)', color: 'var(--text-muted)' }}>
                {t('chatbot.typing')}
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Input box */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--glass-border)', background: 'var(--surface)' }}>
          <form onSubmit={handleSend} style={{ display: 'flex', gap: '12px' }}>
            <input 
              type="text" 
              className="input-field" 
              style={{ margin: 0, flex: 1 }} 
              placeholder={t('chatbot.placeholder')}
              value={input} 
              onChange={e => setInput(e.target.value)}
            />
            <button className="btn btn-primary" type="submit" disabled={isLoading}>{t('chatbot.send')}</button>
          </form>
        </div>
      </div>
    </div>
  );
}
