# PRD_FINAL.md

| Field | Value |
|---|---|
| **Document Name** | Product Requirements Document (FINAL) – ITQAN AI Islamic Finance Advisor |
| **Version** | 2.0 (Finalized Implementation) |
| **Date** | June 2026 (System finalized and completed) |
| **Status** | Final / Fully Complete |
| **Source Reference** | FYP Report + SRS + SDS + STD — Universiti Teknologi Malaysia, Faculty of Computing |
| **Brief Explanation** | This PRD reflects the *completed* state of the ITQAN system. It defines product vision, scope, features, constraints, and technology stack, integrating all finalized architectural updates (PostgreSQL, Groq AI, ChromaDB RAG, Alpha Vantage API, Joi, and i18n). Unchanged elements remain identical to the original draft. |

---

# 1. Product Vision

ITQAN is an AI-powered Islamic financial assistant website that provides clear Shariah-compliant financial guidance, addressing the Muslim community's need for reliable and easily accessible financial help. The system fuses AI-powered analysis with structured financial guidance to enable secure, Shariah-compliant, and transparent decision-making. Key features include smart budget planning, halal investment suggestions, optimized savings, and automatic compliance checks based on Islamic concepts like Taqwa, Amanah, and avoiding riba-related situations.

Users can ask ITQAN financial questions in everyday language and receive culturally relevant recommendations rooted in Islamic principles, with evidence to ensure 100% trustworthiness (backed by a robust RAG vector database referencing authentic texts). ITQAN also offers a financial literacy module with educational resources on Islamic finance, halal economic practices, and wealth management based on Fiqh al-Muamalat.

By combining intelligent AI analysis, a user-friendly interface, and structured financial guidance, ITQAN simplifies the decision-making process, increases compliance with Shariah principles, and builds trust in personal financial planning through transparency.

---

# 2. Problem Statement

## 2.1 Core Problem

The financial decision-making process in Islamic finance is often really difficult due to the strictures of the religion and five requirements: compliance, precision, and personalized advice. Conventional financial advice is a lengthy process, it is not uniform, and it might not be Shariah-compliant completely, which makes it hard for participants to take responsible and well-informed choices.

Nowadays, the financial environment in Islamic finance information is limited. People often need to communicate with scholars or certified consultants to get an answer or advice to their financial questions. Many Muslims find it hard to make good financial decisions due to uncertainty about halal and non-halal investment sources, interest-based investments, and proper budgeting that lines with Islamic rules.

## 2.2 Identified Gap

The lack of Shariah controls on modern financial websites, which mainly focus on traditional banking, creates confusion and raises the risk of getting involved in prohibited or illegal activities because there aren't many Islamic banks in the world.

Current solutions analysis reveals the following gaps:
- No single site that could provide users with Shariah-compliant financial advice, budgeting, goal tracking, and education.
- Existing systems hardly offer interactive advice based on AI, income, and financial objectives and risk tolerance of the user.
- Multi-language accessibility support, especially English and Arabic, is not supported in existing tools.
- Individuals tend to use more than one platform (one for halal investments, another for budgeting, a third for financial education), resulting in ineffective and fragmented financial management.

---

# 3. Target Users

## 3.1 Primary Users

**End User (Muslim individuals seeking Shariah-compliant financial guidance)**

- User Need: Users need to create a personal financial profile and receive AI-generated Shariah-compliant financial advice, and monitor progress toward financial goals in order to make informed and ethical financial decisions.
- User Stories:
  - US001: As an End User, I want to register or login so that I can securely access my account.
  - US002: As an End User, I want to manage my profile so that my financial information is up to date.
  - US003: As an End User, I want to use the AI chatbot so that I can receive instant financial assistance.

  - US005: As an End User, I want to generate Zakat calculations so that I fulfill my obligations correctly.
  - US006: As an End User, I want to view my savings and investment suggestions.
  - US007: As an End User, I want to view my financial dashboard.

## 3.2 Secondary Users

**System Admin (System Overseer)**

- User Need: The Admin needs a way to manage user accounts and maintain AI compliance rules, and monitor system outputs to make sure that operations are efficient, data is integrated, and committed to Shariah principles.
- User Stories:
  - US008: As a System Admin, I want to monitor system performance so that I can ensure smooth operation.
  - US009: As a System Admin, I want to manage user accounts so that access and permissions are controlled.

## 3.3 Supporting Actors

**Intelligent Shariah Advisor Agent (Powered by Groq + ChromaDB)**

- User Need: The Intelligent Shariah Advisor Agent provides real-time answers to user questions related to Shariah rules, Islamic finance principles (e.g., riba, gharar, maysir), and Shariah compliance screening explanations. The agent must retrieve relevant Shariah rules from the system knowledge base (PDF documents processed into a ChromaDB vector store), generate a clear response using an LLM (Groq), and provide the reason/evidence used to justify the answer.
- User Stories:
  - US010: As an End User, I want to ask Shariah-related questions in natural language so that I can get instant guidance.
  - US011: As an End User, I want the system to explain *why* something is compliant/non-compliant so that I can understand the rule behind the decision.
  - US012: As an End User, I want the agent to provide supporting evidence (rule reference/source) so that I can trust the answer.

**AI Module**

- User Need: In order to analyze data and produce specified Shariah-compliant financial insights and deliver outputs to the user interface for real-time decision support, the AI Module must have access to user financial data, Shariah rules, and system inputs.
- User Stories:
  - US013: As an AI Module, I want to analyze financial data and generate insights so that users receive personalized guidance.
  - US014: As an AI Module, I want to generate financial insights for the user.
  - US015: As an AI Module, I want to access AI chatbot to provide users with real-time, personalized financial guidance so that they can make informed and Shariah-compliant decisions.

---

# 4. Scope

## 4.1 In Scope

1. **Providing personalized Shariah-compliant financial advice** — The website customizes financial guidance based on the user's income, risk tolerance, and goals while ensuring all recommendations are aligned with Islamic principles.
2. **Offers interactive and user-friendly tools to simplify financial decision making** — Features like dashboards, charts, and visual summaries make complex financial information easy to understand.
3. **AI chatbot providing Shariah-compliant advice, educational tips, and actionable guidance** — Users can ask questions in natural language and receive instant responses based on Islamic financial principles via a Groq-powered RAG engine.
4. **Stock Shariah screening workflow** — Enabling users to verify whether a stock of their choice is Shariah-compliant, non-compliant, or doubtful, according to a specific set of Shariah screening rules.
5. **Alpha Vantage API integration** — Used to fetch live financial balance sheet data (Total Debt, Cash equivalents, etc.) required for accurate AAOIFI ratio computations.
6. **Shariah screening logic** — Encompassing business activity screening (permissible/non-permissible sectors/activities) and financial ratio screening (testing with the adopted Shariah parameters).
7. **Intelligent Shariah Advisor Agent** — To respond to queries by users concerning Shariah screening rules, interpret screening results, and give guidance based on a certified Shariah knowledge base (PDF).
8. **Administrative controls** — To screen the screening parameters/rules, Shariah knowledge store, and audit screening history (auditability).
9. **User Profile Management** — Users have the ability to create and change their own personal financial profiles for AI analysis.
10. **Goal Setting and Tracking** — Users can set financial goals and keep track of their progress over time.
11. **Zakat Calculation** — The system computes Zakat based on user financial data and Nisab thresholds.
12. **Educational resources** — Content to help users learn Islamic financial concepts and principles.
13. **Multi-language support** — English and Arabic interfaces with full Right-To-Left (RTL) styling logic via `react-i18next`.
14. **Strict Request Validation** — The system uses `Joi` schemas to enforce strict data constraints and validate incoming API requests.
15. **Multi-Factor Authentication (MFA)** — Enforces an OTP verification challenge during login for heightened security.

## 4.2 Out of Scope

The following are explicitly stated as out of scope:
- Personal budgeting (tracking income/expense)
- Integrating banking transactions
- Trade execution
- Portfolio management
- Pay processing
- Any payout/approval processes that are not related to stock Shariah screening

## 4.3 Language/Platform Scope

- Web-based platform accessible via modern browsers (Chrome, Firefox, Edge, Safari — latest two versions).
- Responsive design supporting desktop, laptop, tablet, and smartphone devices.
- Mobile OS: Android 10+ and iOS 13+.
- Language: English and Arabic (with right-to-left layout support for Arabic).

---

# 5. Feature Breakdown (Mapped to FR)

## 5.1 Core Features

| Feature | FR ID | Use Case |
|---|---|---|
| User Registration | FR01 | UC001 – register/login |
| User Authentication | FR02 | UC001 – register/login |
| User Profile Management | FR03 | UC002 – manage profile |
| Financial Data Input | FR04 | UC002 – manage profile |
| AI Financial Advisory | FR05 | UC003 – AI chatbot assistance |
| Recommendation Display | FR06 | UC006 – view savings and investment suggestions |

| Admin User Management | FR08 | UC009 – manage user accounts |
| System Data Storage | FR09 | UC002, UC003 |
| Secure Logout | FR10 | UC001 |
| Analyze Financial Data | FR001 (SRS) | UC003, UC011/UC013 – AI module |
| Validate Shariah Compliance | FR002 (SRS) | UC003 |
| Deliver Recommendations via Chatbot | FR003 (SRS) | UC003, UC015 |
| Handle Invalid Inputs | FR004 (SRS) | UC003 |
| Handle AI Errors | FR005 (SRS) | UC003 |

## 5.2 Dashboard & Visualization

- The user dashboard (UC007 – View Financial Dashboard) displays financial trends, progress, and insights for the End User.
- The system provides AI suggestions, Zakat calculations, and financial insights immediately after login.
- Charts and summaries are used to visualize the data, making it easy for users to get their financial standings quickly.
- The Admin Dashboard equips administrators with the capability to monitor system performance, manage user accounts, and track financial activity.
- Chart.js (v4.3.0) is used for data visualization.

---

# 6. System Constraints

## 6.1 Design Constraints

1. **Environmental Constraints** — The system will operate in a typical office or home environment where end users and administrators access it via web or mobile applications. The system must operate reliably in environments with internet connectivity speeds as low as 1 Mbps.
2. **Hardware Constraints** — The system depends on cloud servers and user devices with minimum specifications:
   - Server: Minimum 8 GB RAM, quad-core processor, and 100 GB storage.
   - End User Devices: Mobile (Android/iOS) or PC with at least 2 GB RAM and 1 GHz processor.
3. **Security Constraints** — As the system handles sensitive financial data, strict security measures are required:
   - All user data must be encrypted using AES-256 encryption.
   - User authentication must be implemented using secure login with multi-factor authentication (MFA).
   - Role-based access control must be enforced for Admin and Shariah Advisor accounts.
4. **Compatibility Constraints** — The system must be compatible with:
   - Web browsers: Chrome, Firefox, Edge, and Safari (latest two versions).
   - Mobile OS: Android 10+ and iOS 13+.
   - Backend services must be compatible with PostgreSQL databases.

## 6.2 Capacity Constraints

- Support at least 1,000 concurrent users with response times under 5 seconds.
- The system must handle at least 500 concurrent user sessions without performance degradation (SRS Performance).
- AI modules must process at least 50 AI recommendation requests per second.
- The system must support a minimum of 10,000 registered users initially, scalable to 100,000 users.
- The system database must store historical financial data, recommendations, and logs efficiently for all users.
- AI financial analysis must generate recommendations within 3 seconds per user request.
- System uptime must be at least 99.5% per month.

## 6.3 Security Expectations

- User data must be encrypted in transit (TLS 1.2 or higher) and at rest.
- Access control must ensure that only authorized users can access sensitive financial data.
- The AI module must process user data without storing any unnecessary personal identifiers.
- Passwords are stored using salted hashes (bcrypt).
- Role-based access control for admin endpoints.
- Users have the ability to export and delete their data to meet privacy requirements.
- The system must comply with applicable data protection laws, Islamic finance regulations, and financial advisory guidelines.
- The system should prevent incorrect financial advice that could mislead users, with clear disclaimers for AI-generated recommendations.

---

# 7. Technology Stack

## 7.1 System Technologies (Finalized)

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React (v18.2.0) | Single-page application, dynamic component-based UI |
| Translations | react-i18next | Multi-language support (English / Arabic) with RTL CSS |
| Backend Runtime | Node.js (v20.1.0) | Backend runtime environment |
| Web Framework | Express.js (v4.18.2) | Main REST API layer, authentication, profile, advice orchestration |
| Database | PostgreSQL | Relational database containing all user and system data |
| Data Validation | Joi | Enforces strict validation on incoming API requests |
| AI Inference | Groq SDK (Llama 3.3) | Lightning fast LLM for the chatbot and AI analysis |
| AI Vector DB | ChromaDB | Local vector database used to store PDF embeddings for the RAG pipeline |
| UI Library | Material-UI (v5.15.6) & Custom Vanilla CSS | UI component library |
| Data Visualization | Chart.js (v4.3.0) | Financial charts and dashboards |
| IDE | VS Code (v1.91.0) | Development and debugging |
| Version Control | Git (v2.42) | Version control |
| Project Management | Jira | Agile methodology planning |

## 7.2 External Software Interfaces (Finalized)

| Name | Source |
|---|---|
| ReactJS (Framework) | https://reactjs.org/ |
| Node.js (Backend Runtime Environment) | https://nodejs.org/ |
| Express.js (Web Application Framework) | https://expressjs.com/ |
| PostgreSQL (Database) | https://postgresql.org/ |
| Groq (AI Inference) | https://console.groq.com/ |
| ChromaDB (Vector Store) | https://trychroma.com/ |
| Alpha Vantage (Live Financial Data) | https://www.alphavantage.co/ |
| Chart.js (Data Visualization) | https://www.chartjs.org/ |

---

# 8. Hardware Requirements

| Component | Specification |
|---|---|
| Server RAM | Minimum 8 GB |
| Server Processor | Quad-core (multi-core CPU) |
| Server Storage | Minimum 100 GB (expandable) |
| Server OS | Linux/Windows |
| Server Hosting | Cloud-based; virtualized for flexibility and load balancing |
| Client Device Types | Desktop computers, laptops, tablets, smartphones |
| Client RAM (minimum) | 2 GB RAM (End User); 4 GB RAM (recommended for dashboards and active elements) |
| Client Processor | Minimum 1 GHz |
| Client Screen Resolution | Minimum 1366×768 (for dashboards and forms) |
| Client Browser | Modern web browser (Chrome, Firefox, Edge, Safari) |
| Internet Connection | Minimum 1 Mbps; stable and consistent bandwidth for real-time synchronization and API calls |
| Developer Device | Laptop with at least 8–16 GB of RAM and 250–500 GB of storage |

---

# 9. Software Requirements

| Software | Purpose |
|---|---|
| PostgreSQL | Core relational database handling users, goals, rules, logs, and mfa_tokens |
| React | Frontend SPA framework, dynamic and reusable UI components |
| react-i18next | Multi-language translation engine for English/Arabic switching |
| Node.js | Backend runtime environment |
| Express.js | Web application framework |
| Joi | Strict object schema validation for backend APIs |
| Groq API | High-speed LLM processing for chatbot and recommendations |
| ChromaDB | Vector database engine for RAG knowledge retrieval |
| Chart.js | Data visualization for financial dashboards |

---

# 10. Risks

- Connecting the AI engine with the web application and ensuring real-time updates of recommendations. *(Mitigated via Groq's high-speed inference capability).*
- Hallucinations in the AI output. *(Mitigated via the implementation of ChromaDB RAG against a certified Shariah PDF).*
- Rate limiting on live market APIs. *(Mitigated by implementing a 1-hour in-memory cache for Alpha Vantage API queries).*
- The project's value depends on users' commitment to Islamic financial ethics; for users who do not care about these principles, the system may seem unnecessary.

---

# 11. Success Criteria

1. **Personalized Shariah-compliant financial guidance**: The AI system will utilize user databases, assess financial conditions, and determine risk levels in order to suggest Shariah-compliant financial products.
2. **Automated detection of non-compliant activities**: The Financial advisor will implement rule-based tests which will prevent clients from trading riba, gharar, and other forbidden transactions, now backed by real-time Alpha Vantage data and AAOIFI parameters.
3. **Educational resources and financial literacy**: The Muslim users will be provided with professional guides and the internet will make them able to access learning modules and tips to improve their Islamic finance knowledge and to make informed financial decisions.
4. **Complete Localization**: Full availability of the application in both English and Arabic.
