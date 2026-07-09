import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import { PlusIcon, ChatIcon } from '../components/Icons';

export default function Chatbot() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const endRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Fetch all sessions on mount
  useEffect(() => {
    fetchSessions();
  }, []);

  // Fetch messages when session changes
  useEffect(() => {
    if (currentSessionId) {
      fetchMessages(currentSessionId);
    } else {
      setMessages([{ sender: 'ai', text: t('chatbot.welcome') || 'Assalamu alaikum! How can I help you with Islamic Finance today?' }]);
    }
  }, [currentSessionId]);

  const fetchSessions = async () => {
    try {
      const token = localStorage.getItem('itqan_token');
      const res = await fetch(`${API_URL}/api/ai/sessions`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setSessions(data.sessions);
      }
    } catch (err) {
      console.error("Failed to fetch sessions", err);
    }
  };

  const fetchMessages = async (sessionId) => {
    try {
      const token = localStorage.getItem('itqan_token');
      const res = await fetch(`${API_URL}/api/ai/sessions/${sessionId}/messages`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && data.messages.length > 0) {
        setMessages(data.messages);
      } else {
        setMessages([{ sender: 'ai', text: t('chatbot.welcome') || 'Assalamu alaikum! How can I help you with Islamic Finance today?' }]);
      }
    } catch (err) {
      console.error("Failed to fetch messages", err);
    }
  };

  const createNewSession = async () => {
    try {
      const token = localStorage.getItem('itqan_token');
      const res = await fetch(`${API_URL}/api/ai/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ title: 'New Chat' })
      });
      const data = await res.json();
      if (data.success) {
        setSessions([data.session, ...sessions]);
        setCurrentSessionId(data.session.session_id);
      }
    } catch (err) {
      console.error("Failed to create session", err);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    setIsLoading(true);

    // If no session exists yet, create one automatically
    let activeSessionId = currentSessionId;
    if (!activeSessionId) {
      try {
        const token = localStorage.getItem('itqan_token');
        const res = await fetch(`${API_URL}/api/ai/sessions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ title: 'New Chat' })
        });
        const data = await res.json();
        if (data.success) {
          activeSessionId = data.session.session_id;
          setSessions([data.session, ...sessions]);
          setCurrentSessionId(activeSessionId);
        }
      } catch (err) {
        console.error("Failed to create auto session", err);
        setIsLoading(false);
        return;
      }
    }

    setMessages(prev => [...prev, { sender: 'user', text: input }]);
    setInput('');

    try {
      const token = localStorage.getItem('itqan_token');
      const res = await fetch(`${API_URL}/api/ai/chat`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: input, history: messages, userId: user.uid, sessionId: activeSessionId })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { sender: 'ai', text: data.reply || data.message }]);
      
      // Refresh sessions to get updated title/timestamp
      fetchSessions();
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'ai', text: t('chatbot.error') || 'Error fetching response' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, gap: '0' }}>
      <div className="page-header" style={{ marginBottom: '24px' }}>
        <h1 className="page-header-title" style={{ fontSize: '28px' }}>{t('chatbot.title')}</h1>
        <p className="page-header-subtitle">{t('chatbot.subtitle')}</p>
      </div>

      <div className="chat-layout">
        {/* Sidebar for Sessions */}
        <div className="glass-panel chat-sidebar">
          <button
            onClick={createNewSession}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '16px' }}
          >
            <PlusIcon size={18} /> {t('chatbot.newChat') || 'New Chat'}
          </button>

          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {sessions.map(session => (
              <div
                key={session.session_id}
                onClick={() => setCurrentSessionId(session.session_id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  background: currentSessionId === session.session_id ? 'var(--primary-color)' : 'transparent',
                  color: currentSessionId === session.session_id ? 'white' : 'var(--text-main)',
                  transition: 'background 0.2s',
                }}
                className={currentSessionId !== session.session_id ? "hover-surface" : ""}
              >
                <ChatIcon size={18} />
                <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '14px' }}>
                  {session.title}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="glass-panel chat-main">
          {/* Chat History View */}
          <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                <div className="chat-bubble" style={{
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
                  {t('chatbot.typing') || 'Typing...'}
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
                placeholder={t('chatbot.placeholder') || 'Type a message...'}
                value={input}
                onChange={e => setInput(e.target.value)}
              />
              <button className="btn btn-primary" type="submit" disabled={isLoading}>{t('chatbot.send') || 'Send'}</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
