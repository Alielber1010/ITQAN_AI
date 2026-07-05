# ITQAN_AI

**ITQAN (إتقان)** is a modern, comprehensive financial planning application designed to help users manage their wealth in accordance with Islamic (Shariah) principles. The platform offers financial tracking, Zakat calculation, and an AI-powered financial advisor grounded in authentic Islamic jurisprudence.

## ✨ Features

* **Bilingual Support (EN/AR)**: Full RTL (Right-to-Left) support for Arabic alongside English.
* **AI Shariah Advisor**: An intelligent chatbot powered by **Groq** and **RAG (Retrieval-Augmented Generation)** using **pgvector** (PostgreSQL). It searches uploaded Shariah law PDFs to provide accurate, context-aware answers to Islamic finance questions.
* **Zakat Calculator**: Automatically calculates Zakat obligations based on your assets, savings, and liabilities following Nisab thresholds.
* **Financial Goal Tracking**: Set, monitor, and achieve personal financial goals (e.g., Hajj savings, emergency funds).
* **Robust Security**: Includes JWT-based authentication and Multi-Factor Authentication (MFA/OTP).
* **Admin Dashboard**: For moderators and super-admins to manage users and system logs.

## 🛠️ Tech Stack

### Frontend
* **React 19** & **Vite**
* **Material-UI (MUI)**
* **Chart.js** & **react-chartjs-2**
* **react-i18next**

### Backend
* **Node.js** & **Express**
* **PostgreSQL** (via `pg`) with **pgvector** for vector storage (RAG)
* **Groq API** for LLM inference
* **pdf-parse**

## 🚀 Getting Started

1. Clone the repository
2. See the folders `code/backend` and `code/frontend` for respective `package.json` files.
3. Add `.env` to `code/backend` with your PostgreSQL and Groq API keys.
4. Run `node run_init_sql.js`, `node run_chat_migration.js`, and `node run_pgvector_migration.js` to set up the schema (requires the `vector` extension, enabled by default on Supabase).
5. Run `node src/ingest.js` once to embed the Shariah PDF into `shariah_chunks`.
6. Run `npm install` and `npm run dev` (or `node server.js`) in respective folders.
