# ITQAN – Changes: Firebase → PostgreSQL Migration

## Overview

This document details the migration from Firebase/Firestore to **PostgreSQL** for all data persistence. This aligns with the design constraint in PRD §6.1 and TDD §10.2:

> *"Backend services must be compatible with PostgreSQL or MySQL databases."*

**Firebase is removed entirely.** Both the data layer and the authentication system are now powered by **PostgreSQL**.

- **Authentication**: Custom implementation using `bcryptjs` (hashing) and `jsonwebtoken` (JWT sessions).
- **Data Persistence**: All entities stored in PostgreSQL tables.

---

## Scope Summary

| **Backend** | All data storage → PostgreSQL via `pg` driver | Express.js routes, server structure |
| **Backend** | Custom Auth (bcrypt + JWT) | Node.js / Express.js |
| **Frontend** | Custom Auth API calls | React context (AuthContext) |
| **Platform** | No Firebase dependencies | - |

---

## Database Schema (PostgreSQL DDL)

Based on TDD §5 Data Design — 7 entities:

```sql
-- ============================================
-- ITQAN PostgreSQL Schema Initialization
-- ============================================

-- 1. Users
CREATE TABLE users (
    user_id       VARCHAR(128) PRIMARY KEY,  -- Firebase Auth UID
    name          VARCHAR(255) NOT NULL,
    email         VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),              -- NULL for Google Sign-In users
    phone         VARCHAR(50),
    address_state VARCHAR(100),
    address_zip   VARCHAR(20),
    user_type     VARCHAR(20) DEFAULT 'User' CHECK (user_type IN ('User', 'Admin')),
    created_date  TIMESTAMP DEFAULT NOW()
);

-- 2. Financial Profiles
CREATE TABLE financial_profiles (
    profile_id   VARCHAR(128) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id      VARCHAR(128) NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    income       NUMERIC(15,2) DEFAULT 0,
    assets       NUMERIC(15,2) DEFAULT 0,
    liabilities  NUMERIC(15,2) DEFAULT 0,
    savings      NUMERIC(15,2) DEFAULT 0,
    created_date TIMESTAMP DEFAULT NOW(),
    updated_date TIMESTAMP DEFAULT NOW()
);

-- 3. Financial Goals
CREATE TABLE financial_goals (
    goal_id        VARCHAR(128) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id        VARCHAR(128) NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    goal_type      VARCHAR(50),
    target_amount  NUMERIC(15,2),
    current_amount NUMERIC(15,2) DEFAULT 0,
    status         VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active','completed','paused')),
    deadline       DATE,
    created_date   TIMESTAMP DEFAULT NOW(),
    updated_date   TIMESTAMP DEFAULT NOW()
);

-- 4. Advice
CREATE TABLE advice (
    advice_id    VARCHAR(128) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id      VARCHAR(128) NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    advice_type  VARCHAR(100),
    description  TEXT,
    created_date TIMESTAMP DEFAULT NOW(),
    rule_id      VARCHAR(128) REFERENCES shariah_rules(rule_id)
);

-- 5. Shariah Rules
CREATE TABLE shariah_rules (
    rule_id          VARCHAR(128) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    category         VARCHAR(100),
    description      TEXT,
    source_reference VARCHAR(255)
);

-- 6. Admin
CREATE TABLE admins (
    admin_id   VARCHAR(128) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name       VARCHAR(255) NOT NULL,
    email      VARCHAR(255) UNIQUE NOT NULL,
    role       VARCHAR(50) DEFAULT 'Moderator' CHECK (role IN ('Super Admin','Moderator')),
    last_login TIMESTAMP
);

-- 7. System Logs
CREATE TABLE system_logs (
    log_id      VARCHAR(128) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id     VARCHAR(128) REFERENCES users(user_id) ON DELETE SET NULL,
    action_type VARCHAR(100),
    timestamp   TIMESTAMP DEFAULT NOW(),
    details     TEXT
);

-- Indexes for performance
CREATE INDEX idx_financial_profiles_user ON financial_profiles(user_id);
CREATE INDEX idx_financial_goals_user    ON financial_goals(user_id);
CREATE INDEX idx_advice_user             ON advice(user_id);
CREATE INDEX idx_system_logs_user        ON system_logs(user_id);
CREATE INDEX idx_system_logs_timestamp   ON system_logs(timestamp);
```

---

## Backend File Changes

### New Files

| File | Purpose |
|------|---------|
| `backend/src/db.js` | PostgreSQL connection pool using `pg` |
| `backend/init.sql` | Schema initialization script (DDL above) |
| `backend/seed.sql` | Initial seed data (Shariah rules, test admin) |

### Modified Files

| File | Change |
|------|--------|
| `backend/package.json` | Add `pg` dependency |
| `backend/.env.example` | Add `DATABASE_URL` |
| `backend/src/routes/profile.routes.js` | Replace in-memory `profiles = {}` → SQL queries |
| `backend/src/routes/auth.routes.js` | Add user upsert to `users` table after token verification |
| `backend/src/routes/ai.routes.js` | Store advice records in `advice` table |
| `backend/src/routes/shariah.routes.js` | Read `shariah_rules` from DB; store compliance logs |
| `backend/src/middleware/auth.middleware.js` | No change (stays Firebase Admin) |
| `backend/src/firebaseAdmin.js` | No change (stays for auth only) |

---

## New File: `backend/src/db.js`

```javascript
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
```

---

## Environment Variables Update

Add to `backend/.env.example`:

```
DATABASE_URL=postgresql://username:password@localhost:5432/itqan
```

---

## Route Migration Details

### `profile.routes.js` — Replace in-memory mock → SQL

| Operation | Current (Mock) | New (PostgreSQL) |
|-----------|---------------|-----------------|
| GET `/:userId` | `profiles[userId]` | `SELECT * FROM financial_profiles WHERE user_id = $1` |
| POST `/` | `profiles[userId] = {...}` | `INSERT INTO financial_profiles ... ON CONFLICT (user_id) DO UPDATE` |

### `auth.routes.js` — Add user sync

After token verification, upsert user record:
```sql
INSERT INTO users (user_id, name, email)
VALUES ($1, $2, $3)
ON CONFLICT (user_id) DO UPDATE SET name = $2
```

### `shariah.routes.js` — Read rules from DB

| Operation | Current (Mock) | New (PostgreSQL) |
|-----------|---------------|-----------------|
| Compliance check | Hardcoded `nonCompliantSectors` array | `SELECT * FROM shariah_rules WHERE category = $1` |
| Zakat | Static Nisab | Could read from `shariah_rules` table |

### `ai.routes.js` — Store advice

After generating AI response, persist:
```sql
INSERT INTO advice (user_id, advice_type, description)
VALUES ($1, 'chatbot', $2)
```

---

## Initialization Steps

```bash
# 1. Install PostgreSQL (if not already installed)
# 2. Create database
psql -U postgres -c "CREATE DATABASE itqan;"

# 3. Run schema init
psql -U postgres -d itqan -f code/backend/init.sql

# 4. (Optional) Run seed data
psql -U postgres -d itqan -f code/backend/seed.sql

# 5. Install pg driver
cd code/backend
npm install pg

# 6. Update .env with your DATABASE_URL
# DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/itqan

# 7. Start backend
node server.js
```

---

## What Does NOT Change

- **Firebase Auth** (frontend) — Login, Register, Google Sign-In remain unchanged
- **Firebase Admin** (backend) — Token verification stays in `auth.routes.js` and `auth.middleware.js`
- **Frontend code** — No changes; it talks to the same Express API endpoints
- **API contract** — All route paths and JSON response shapes stay the same
