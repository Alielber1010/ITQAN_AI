# USR_FINAL.md

| Field | Value |
|---|---|
| **Document Name** | Use Case / User Story Requirements (FINAL) – ITQAN AI Islamic Finance Advisor |
| **Version** | 2.0 (Finalized Implementation) |
| **Date** | June 2026 (System finalized and completed) |
| **Status** | Final / Fully Complete |
| **Source Reference** | FYP Report + SRS + SDS + STD — Universiti Teknologi Malaysia, Faculty of Computing |
| **Description** | This document defines all actors, functional requirements, non-functional requirements, and detailed use case specifications for the ITQAN AI Islamic Finance Advisor system. It has been updated to reflect the final tech stack (PostgreSQL, Alpha Vantage, Groq LLM, ChromaDB) while preserving the exact layout and unchanged use cases of the original design. |

---

# 1. System Overview

## 1.1 System Purpose

ITQAN is an AI-powered Islamic financial assistant website that provides clear Shariah-compliant financial guidance, addressing the Muslim community's need for reliable and easily accessible financial help. The system fuses AI-powered analysis with structured financial guidance to enable secure, Shariah-compliant, and transparent decision-making. Users can draw up their personal financial profiles with the help of the system, while the AI engine assesses financial data, produces Shariah-compliant recommendations, and coordinates explanatory insights to empower users in making knowledgeable financial decisions.

## 1.2 System Boundary

### External Entities

| Entity | Role |
|---|---|
| End User | Muslim individual who registers, creates a financial profile, uses AI chatbot, calculates Zakat, views savings/investment suggestions, and views the financial dashboard |
| System Admin | Oversees system operations; manages user accounts; monitors system performance; manages Shariah rules |
| Intelligent Shariah Advisor Agent | Provides real-time answers to user questions related to Shariah rules via the Groq LLM and ChromaDB RAG vector store |
| AI Module | Analyzes financial data, generates personalized Shariah-compliant insights, and delivers outputs to the user interface for real-time decision support |
| Alpha Vantage API | External market data provider for stock data (company classification/sector and live balance sheet indicators) |

### Internal Subsystems

| Subsystem | Responsibility |
|---|---|
| User Module | User registration, authentication via JWT/bcrypt (MFA OTP enforced), profile management |
| AI Advisor Module | Financial data analysis, Shariah-compliant recommendation generation |
| Shariah Rules Engine | Deterministic filtering of financial instruments against configurable Shariah rules; rule versioning and auditability |
| Transaction Monitoring Module | Monitors user financial activities for compliance and analysis |
| Admin Module | User account management, system performance monitoring, Shariah rules management |
| Financial Dashboard | Displays financial trends, progress, and insights |
| AI Chatbot Interface | Real-time natural language interaction for financial guidance |
| Zakat Calculator | Computes Zakat obligations based on user financial data and Nisab thresholds |

| Data Storage (PostgreSQL) | Persistent storage of user profiles, financial data, goals, advice, Shariah rules, admin records, system logs, and MFA tokens |

## 1.3 High-Level Interaction Diagram

```
+-------------------+        HTTPS REST API         +----------------------------+
|    End User       |  <-------------------------->  |  React SPA (Frontend)      |
+-------------------+                                |  - Dashboard               |
                                                     |  - AI Chatbot Interface    |
+-------------------+        HTTPS REST API         |  - Zakat Calculator        |
|  System Admin     |  <-------------------------->  |  - Zakat Calculator        |
+-------------------+                                |  - Financial Goals         |
                                                     |  - Admin Dashboard         |
+-------------------+        Internal API           +----------------------------+
|  Shariah Advisor  |  <-------------------------->             |
|  Agent (AI)       |                                           | HTTPS
+-------------------+                                           v
                                                     +----------------------------+
+-------------------+        Internal API           |  Backend API               |
|  AI Module        |  <-------------------------->  |  Node.js + Express.js      |
+-------------------+                                |  + Joi Validation          |
                                                     |  - User Module             |
                                                     |  - AI Advisor Module       |
                                                     |  - Shariah Rules Engine    |
                                                     |  - Admin Module            |
                                                     |  - Transaction Monitoring  |
                                                     +----------------------------+
                                                                |
                                              +-----------------+-----------------+
                                              |                 |                 |
                                              v                 v                 v
                                    +------------------+ +------------------+ +------------------+
                                    | PostgreSQL DB    | | Alpha Vantage    | | Chroma DB (RAG)  |
                                    | (Auth, Logs,     | | API (Live Data)  | | + Groq LLM API   |
                                    | Financials)      | +------------------+ +------------------+
                                    +------------------+
```

---

# 2. Actor Definitions

*(No changes to Actor Definitions from original USR. End User, System Admin, Intelligent Shariah Advisor Agent, and AI Module remain identical in capabilities.)*

---

# 3. Functional Requirements (FR)

*(No changes to Functional Requirements from original USR.)*

---

# 4. Non-Functional Requirements (NFR)

*(No changes to Non-Functional Requirements from original USR, except that database constraints specifically refer to PostgreSQL instead of Firebase, and MFA is strictly enforced via OTP.)*

---

# 5. Detailed Use Case Specifications

*(The majority of the Use Case details remain unchanged. Crucial integration updates are noted below.)*

## UC001 – Register/Login (Updated for MFA)

### Use Case Overview
- **Name:** register/login
- **Actor:** End User
- **Related FR:** FR01, FR02, FR10

### Normal Flow
1. User navigates to the login/registration page.
2. User chooses "Register" or "Login."
3. For registration, user provides name, email, password, and confirms password.
4. System strictly validates inputs via Joi (email format, password strength, uniqueness).
5. For login, user enters email and password.
6. System validates credentials via bcrypt in PostgreSQL.
7. **System issues a temporary MFA challenge and generates a 6-digit OTP stored in `mfa_tokens`.**
8. **User enters the OTP on the verification screen.**
9. **System validates the OTP and issues the final JWT.**
10. Successful login redirects user to dashboard.

## UC003 – AI Chatbot Assistance (Updated for RAG)

### Normal Flow
1. User clicks "AI Chatbot" on the dashboard.
2. System opens chatbot interface.
3. User submits a financial query.
4. System validates query for completeness and format.
5. **System retrieves semantic vector chunks from ChromaDB based on the query.**
6. **System forwards the chunks and query to the Groq LLM to generate hallucination-free advice.**
7. Compliant recommendations are sent to chatbot.
8. Chatbot displays advice to the user.


*(All other Use Cases UC002, UC005-UC015 remain functionally identical to the original USR, utilizing the new Node.js/PostgreSQL backend architecture.)*

---

# 6. Traceability Matrix

*(Traceability Matrix mapping remains identical to the original system specification).*

---

# 7. Constraints (Finalized)

- The system operates in environments with internet connectivity speeds as low as 1 Mbps.
- Server must have a minimum of 8 GB RAM, quad-core processor, and 100 GB storage.
- All user data must be encrypted using AES-256 encryption.
- User authentication must be implemented using secure login with multi-factor authentication (MFA via OTP).
- Backend services operate strictly on PostgreSQL databases (Firebase removed).
- AI chatbot responses must be delivered within 3 seconds for standard queries (achieved via Groq API).
- Live financial data integration enforces API rate-limiting protections (in-memory TTL cache).

---

# 8. Assumptions (Finalized)

- Users are assumed to have basic digital literacy and access to a modern web browser.
- The system assumes that users are Muslims or individuals interested in Shariah-compliant financial management.
- The Shariah knowledge base (ShariahRule entities) is pre-populated in PostgreSQL, and the RAG vector store is pre-populated via the `ingest.js` script.
- Alpha Vantage API availability is assumed for stock screening functionality.
- Multi-language support (English and Arabic) is handled seamlessly via `react-i18next` localized string files.
