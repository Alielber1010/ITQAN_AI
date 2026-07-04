-- Migration to add chat sessions and messages

CREATE TABLE IF NOT EXISTS chat_sessions (
    session_id   VARCHAR(128) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id      VARCHAR(128) NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    title        VARCHAR(255) DEFAULT 'New Chat',
    created_date TIMESTAMP DEFAULT NOW(),
    updated_date TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chat_messages (
    message_id   VARCHAR(128) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    session_id   VARCHAR(128) NOT NULL REFERENCES chat_sessions(session_id) ON DELETE CASCADE,
    sender       VARCHAR(50) NOT NULL CHECK (sender IN ('user', 'ai')),
    text         TEXT NOT NULL,
    created_date TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_sessions_user ON chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON chat_messages(session_id);
