# USR.md

| Field | Value |
|---|---|
| **Document Name** | Use Case / User Story Requirements – ITQAN AI Islamic Finance Advisor |
| **Version** | Based on SRS Version No. 1; SDS Version No. 2; STD Version No. 1 |
| **Date** | SRS: 1-11-2025; SDS: 14-1-2026; STD: 11-1-2026 |
| **Status** | Partially Complete (project not yet fully implemented as of FYP1 submission) |
| **Source Reference** | FYP Report + SRS (SECJ 3032, Semester 01, 2025/2026) + SDS (Version No. 2) + STD (Version No. 1) — Universiti Teknologi Malaysia, Faculty of Computing |
| **Description** | This document defines all actors, functional requirements, non-functional requirements, and detailed use case specifications for the ITQAN AI Islamic Finance Advisor system, derived strictly from the source documentation. Every use case found in the source is included with full flow details and original description tables reproduced verbatim. |

---

# 1. System Overview

## 1.1 System Purpose

ITQAN is an AI-powered Islamic financial assistant website that provides clear Shariah-compliant financial guidance, addressing the Muslim community's need for reliable and easily accessible financial help. The system fuses AI-powered analysis with structured financial guidance to enable secure, Shariah-compliant, and transparent decision-making. Users can draw up their personal financial profiles with the help of the system, while the AI engine assesses financial data, produces Shariah-compliant recommendations, and coordinates explanatory insights to empower users in making knowledgeable financial decisions.

## 1.2 System Boundary

### External Entities

| Entity | Role |
|---|---|
| End User | Muslim individual who registers, creates a financial profile, uses AI chatbot, checks Shariah compliance, calculates Zakat, views savings/investment suggestions, and views the financial dashboard |
| System Admin | Oversees system operations; manages user accounts; monitors system performance; manages Shariah rules |
| Intelligent Shariah Advisor Agent | Provides real-time answers to user questions related to Shariah rules, Islamic finance principles, and Shariah compliance screening explanations |
| AI Module | Analyzes financial data, generates personalized Shariah-compliant insights, and delivers outputs to the user interface for real-time decision support |
| TradingView API | External market data provider for stock data (company classification/sector and financial indicators) |
| Firebase (Google Cloud) | External cloud platform providing real-time database, authentication, cloud storage, cloud functions, and hosting |

### Internal Subsystems

| Subsystem | Responsibility |
|---|---|
| User Module | User registration, authentication, profile management |
| AI Advisor Module | Financial data analysis, Shariah-compliant recommendation generation |
| Shariah Rules Engine | Deterministic filtering of financial instruments against configurable Shariah rules; rule versioning and auditability |
| Transaction Monitoring Module | Monitors user financial activities for compliance and analysis |
| Admin Module | User account management, system performance monitoring, Shariah rules management |
| Financial Dashboard | Displays financial trends, progress, and insights |
| AI Chatbot Interface | Real-time natural language interaction for financial guidance |
| Zakat Calculator | Computes Zakat obligations based on user financial data and Nisab thresholds |
| Compliance Checker | Verifies financial activities against Shariah rules |
| Data Storage (Firestore) | Persistent storage of user profiles, financial data, goals, advice, Shariah rules, admin records, and system logs |

## 1.3 High-Level Interaction Diagram

```
+-------------------+        HTTPS REST API         +----------------------------+
|    End User       |  <-------------------------->  |  React SPA (Frontend)      |
+-------------------+                                |  - Dashboard               |
                                                     |  - AI Chatbot Interface    |
+-------------------+        HTTPS REST API         |  - Compliance Checker      |
|  System Admin     |  <-------------------------->  |  - Zakat Calculator        |
+-------------------+                                |  - Financial Goals         |
                                                     |  - Admin Dashboard         |
+-------------------+        Internal API           +----------------------------+
|  Shariah Advisor  |  <-------------------------->             |
|  Agent (AI)       |                                           | HTTPS
+-------------------+                                           v
                                                     +----------------------------+
+-------------------+        Internal API           |  Backend API               |
|  AI Module        |  <-------------------------->  |  Spring MVC + Jakarta      |
+-------------------+                                |  Servlet / Node.js +       |
                                                     |  Express.js                |
                                                     |  - User Module             |
                                                     |  - AI Advisor Module       |
                                                     |  - Shariah Rules Engine    |
                                                     |  - Admin Module            |
                                                     |  - Transaction Monitoring  |
                                                     +----------------------------+
                                                                |
                                              +----------------+----------------+
                                              |                                 |
                                              v                                 v
                                    +------------------+          +------------------+
                                    |  Firebase        |          |  TradingView API |
                                    |  Firestore DB    |          |  (Market Data)   |
                                    |  Firebase Auth   |          +------------------+
                                    |  Cloud Storage   |
                                    +------------------+
```

---

# 2. Actor Definitions

## 2.1 Primary Actor — End User

| Attribute | Description |
|---|---|
| **Name** | End User |
| **Type** | Human (Muslim individual) |
| **Role** | Primary consumer of financial advisory, compliance checking, Zakat calculation, and educational features |
| **Access** | Web browser (desktop/mobile) via React SPA |
| **Authentication** | Email/password login; Google Sign-In supported |

**Capabilities:**
- Register and log in securely
- Create, view, and update personal financial profile (income, expenses, savings, investments)
- Use AI chatbot for instant Shariah-compliant financial guidance
- Check Shariah compliance of financial activities
- Generate Zakat calculations
- View AI-generated savings and investment suggestions
- View financial dashboard with goals, progress charts, and AI recommendations
- Ask Shariah-related questions in natural language

## 2.2 Secondary Actor — System Admin

| Attribute | Description |
|---|---|
| **Name** | System Admin (System Overseer) |
| **Type** | Human |
| **Role** | Manages user accounts, monitors system performance, maintains Shariah rules, ensures operational integrity |
| **Access** | Admin dashboard via web interface |
| **Authentication** | Secure login with MFA; role-based access control |

**Capabilities:**
- Monitor system performance (CPU, memory, AI module metrics)
- Manage user accounts (add, edit, remove users; control access and permissions)
- Manage Shariah rules (review, update, approve, reject rules)
- Generate reports
- View user activity logs

## 2.3 Supporting Actors

### Intelligent Shariah Advisor Agent

| Attribute | Description |
|---|---|
| **Name** | Intelligent Shariah Advisor Agent |
| **Type** | System Actor (AI-based agent) |
| **Role** | Answers Shariah-related queries, explains compliance decisions, provides rule-based evidence from the Shariah knowledge base |

### AI Module

| Attribute | Description |
|---|---|
| **Name** | AI Module |
| **Type** | System Actor (automated) |
| **Role** | Analyzes user financial data, generates Shariah-compliant financial insights, delivers outputs to chatbot and dashboard |

---

# 3. Functional Requirements (FR)

## From FYP Report Chapter 4 (Table 4.2)

| FR ID | Description | Priority | Related UC |
|---|---|---|---|
| FR01 | The system shall allow users to create an account using valid credentials. | High | UC001 |
| FR02 | The system shall authenticate users securely before granting access. | High | UC001 |
| FR03 | The system shall allow users to create, view, and update their financial profile. | High | UC002 |
| FR04 | The system shall allow users to input income, expenses, savings, and financial goals. | High | UC002 |
| FR05 | The system shall generate personalized Shariah-compliant financial advice based on user data. | High | UC003, UC006 |
| FR06 | The system shall display AI-generated recommendations on the user dashboard. | High | UC006, UC007 |
| FR07 | The system shall monitor user financial activities for compliance and analysis. | High | UC004 |
| FR08 | The system shall allow administrators to manage user accounts. | High | UC009 |
| FR09 | The system shall store user and advisory data securely in the database. | High | UC002, UC003 |
| FR10 | The system shall allow users to log out securely from the system. | High | UC001 |

## From SRS Section (Functional Requirement IDs)

| FR ID | Functional Requirement | Related Use Case | Description |
|---|---|---|---|
| FR001 | Analyze financial data | US003 | The AI module retrieves and analyzes the user's financial profile (income, expenses, savings, investments) to give personalized insights. |
| FR002 | Validate Shariah Compliance | US003 | The system validates all generated insights and recommendations against Shariah rules stored in the database. |
| FR003 | Deliver Recommendations via Chatbot | US003 | The AI module sends validated insights to the AI chatbot, which displays real-time guidance to the user. |
| FR004 | Handle Invalid Inputs | US003 | System identifies incomplete or invalid queries and prompts the user for correction. |
| FR005 | Handle AI Errors | US003 | System handles exceptions if AI analysis fails or Shariah rules cannot be accessed. |

---

# 4. Non-Functional Requirements (NFR)

## Performance

| ID | Requirement |
|---|---|
| NFR01 | The system shall respond to user requests within an acceptable time frame. |
| NFR-P1 | The system should respond to user requests within 2 seconds for basic operations such as viewing dashboards and submitting profile data. |
| NFR-P2 | AI chatbot responses should be delivered within 3 seconds for standard queries. |
| NFR-P3 | The system must handle at least 500 concurrent user sessions without performance degradation. |
| NFR-P4 | AI modules must process at least 50 AI recommendation requests per second. |
| NFR-P5 | The system must support a minimum of 10,000 registered users initially, scalable to 100,000 users. |
| NFR-P6 | Support at least 1,000 concurrent users with response times under 5 seconds. |
| NFR-P7 | AI financial analysis must generate recommendations within 3 seconds per user request. |
| NFR-P8 | System uptime must be at least 99.5% per month. |

## Security

| ID | Requirement |
|---|---|
| NFR02 | The system shall protect user data using authentication, authorization, and encryption mechanisms. |
| NFR-S1 | User data must be encrypted in transit (TLS 1.2 or higher) and at rest. |
| NFR-S2 | Access control must ensure that only authorized users can access sensitive financial data. |
| NFR-S3 | The AI module must process user data without storing any unnecessary personal identifiers. |
| NFR-S4 | All user data must be encrypted using AES-256 encryption. |
| NFR-S5 | User authentication must be implemented using secure login with multi-factor authentication (MFA). |
| NFR-S6 | Role-based access control must be enforced for Admin and Shariah Advisor accounts. |
| NFR-S7 | Passwords are stored using salted hashes (bcrypt). |
| NFR-S8 | Users have the ability to export and delete their data to meet privacy requirements. |

## Usability

| ID | Requirement |
|---|---|
| NFR03 | The system shall provide a user-friendly and intuitive web interface. |
| NFR-U1 | The user interface must be intuitive, user-friendly, and suitable for users with basic financial knowledge. |
| NFR-U2 | End Users should be able to create a financial profile, check compliance, and receive AI guidance with minimal training. |
| NFR-U3 | The AI chatbot interface must support real-time interaction and provide clear guidance messages. |

## Reliability

| ID | Requirement |
|---|---|
| NFR05 | The system shall operate consistently with minimal downtime. |
| NFR-R1 | The system must correctly process financial data and AI-generated recommendations. |
| NFR-R2 | All financial calculations, including Zakat and investment suggestions, must be accurate. |
| NFR-R3 | The system must maintain consistent operation during peak usage periods. |

## Maintainability

| ID | Requirement |
|---|---|
| NFR06 | The system shall be modular and easy to update or enhance. |
| NFR-M1 | The system should allow developers to easily update Shariah rules, AI models, and system modules. |
| NFR-M2 | Documentation must support rapid bug fixes and functional enhancements. |

## Compatibility

| ID | Requirement |
|---|---|
| NFR07 | The system shall be accessible via modern web browsers across different devices. |
| NFR-C1 | The system should be deployable on major web browsers (Chrome, Firefox, Edge) and support mobile web access. |
| NFR-C2 | The system should integrate with external data sources (e.g., user bank APIs, financial datasets) and comply with standard formats such as JSON. |
| NFR-C3 | Mobile OS: Android 10+ and iOS 13+. |
| NFR-C4 | Backend services must be compatible with PostgreSQL or MySQL databases. |

## Availability

| ID | Requirement |
|---|---|
| NFR08 | The system shall be available to users on a 24/7 basis, excluding scheduled maintenance. |
| NFR-A1 | The system should be operational at least 99.5% of the time annually. |
| NFR-A2 | Scheduled maintenance must occur outside peak hours, with downtime notifications provided to users. |

## Data Integrity

| ID | Requirement |
|---|---|
| NFR09 | The system shall ensure accuracy and consistency of stored financial data. |

## Scalability

| ID | Requirement |
|---|---|
| NFR04 | The system shall support an increasing number of users without performance degradation. |

---

# 5. Detailed Use Case Specifications

---

## UC001 – Register/Login

### Use Case Overview

| Field | Description |
|---|---|
| **ID** | UC001 |
| **Name** | register/login |
| **Actor** | End User |
| **Related FR** | FR01, FR02, FR10 |
| **Related US** | US001, US002 |

### Preconditions
1. The user has internet access.

### Normal Flow

| Step | Actor/System | Action |
|---|---|---|
| 1 | User | Navigates to the login/registration page. |
| 2 | User | Chooses "Register" or "Login." |
| 3 | User (Register) | Provides name, email, password, and confirms password. |
| 4 | System | Validates inputs (email format, password strength, uniqueness). |
| 5 | User (Login) | Enters email and password. |
| 6 | System | Validates credentials. |
| 7 | System | Successful login redirects user to dashboard; successful registration logs user in automatically. |

### Alternative Flows

**AF1: Forgotten password**
1. System sends reset link via email.

**AF2: Social login**
1. User logs in via Google/other service.
2. System retrieves or creates account.

### Exception Flows

**EF1: Invalid credentials**
1. System displays "Email or password incorrect."

**EF2: Duplicate registration email**
1. System notifies user to use a different email.

**EF3: Server error**
1. System displays "Unable to login/register. Try again later."

### Postconditions
1. User session is active and secure.
2. User can access dashboard and profile.

**Table 2.2: Use Case Description for Register/Login**

| Field | Description |
|---|---|
| User Story ID | US002 |
| User Story Name | Register/Login |
| User Story Description | As an End User, I want to register or log in so that I can securely access my account. |
| Preconditions | The user has internet access. |
| Postconditions | User session is active and secure. User can access dashboard and profile. |
| Normal Flow | 1. User navigates to the login/registration page. 2. User chooses "Register" or "Login." 3. For registration, user provides name, email, password, and confirms password. 4. System validates inputs (email format, password strength, uniqueness). 5. For login, user enters email and password. 6. System validates credentials. 7. Successful login redirects user to dashboard; successful registration logs user in automatically. |
| Alternative Flow AF1 | Forgotten password: System sends reset link via email. |
| Alternative Flow AF2 | Social login: User logs in via Google/other service, system retrieves or creates account. |
| Exception Flow EF1 | Invalid credentials: System displays "Email or password incorrect." |
| Exception Flow EF2 | Duplicate registration email: System notifies user to use a different email. |
| Exception Flow EF3 | Server error: System displays "Unable to login/register. Try again later." |

---

## UC002 – Manage Profile (Create Financial Profile)

### Use Case Overview

| Field | Description |
|---|---|
| **ID** | UC002 |
| **Name** | manage profile / Create financial profile |
| **Actor** | End User |
| **Related FR** | FR03, FR04, FR09 |
| **Related US** | US001 (SRS), US002 (FYP) |

### Preconditions
1. The user is logged in.
2. No existing financial profile exists for the user (or user is updating).

### Normal Flow

| Step | Actor/System | Action |
|---|---|---|
| 1 | User | Navigates to "Create Financial Profile." |
| 2 | System | Displays the profile form with fields: income, expenses, savings, investments, liabilities, and assets. |
| 3 | User | Fills in all required fields. |
| 4 | User | Submits the form. |
| 5 | System | Validates all inputs for correct data type, positive values, and completeness. |
| 6 | System | Saves the financial profile to the database. |
| 7 | System | Confirms successful creation and allows user to view/update profile. |

### Alternative Flows

**AF1: User cancels profile creation**
1. User clicks "Cancel."
2. System discards entered data and returns to dashboard.

**AF2: User updates existing profile**
1. System pre-fills existing data.
2. User edits fields.
3. System validates and updates profile.

### Exception Flows

**EF1: Invalid input**
1. User enters negative or non-numeric values.
2. System highlights errors and requests correction.

**EF2: Database error**
1. System fails to save profile.
2. User is notified and prompted to retry later.

### Postconditions
1. A financial profile is created and stored securely.
2. User can view and update the profile.
3. Data is ready for AI processing and dashboard display.

**Table 2.1: Use Case Description for Create Financial Profile**

| Field | Description |
|---|---|
| User Story ID | US001 |
| User Story Name | Create financial profile |
| User Story Description | As an End User, I want to create a personal financial profile so that my financial data is ready for AI analysis and Shariah-compliant advice. |
| Preconditions | The user is logged in. No existing financial profile exists for the user (or user is updating). |
| Postconditions | A financial profile is created and stored securely. User can view and update the profile. Data is ready for AI processing and dashboard display. |
| Normal Flow | 1. User navigates to "Create Financial Profile." 2. System displays the profile form with fields: income, expenses, savings, investments, liabilities, and assets. 3. User fills in all required fields. 4. User submits the form. 5. System validates all inputs for correct data type, positive values, and completeness. 6. System saves the financial profile to the database. 7. System confirms successful creation and allows user to view/update profile. |
| Alternative Flow AF1 | User cancels profile creation: User clicks "Cancel." System discards entered data and returns to dashboard. |
| Alternative Flow AF2 | User updates existing profile: System pre-fills existing data. User edits fields. System validates and updates profile. |
| Exception Flow EF1 | Invalid input: User enters negative or non-numeric values. System highlights errors and requests correction. |
| Exception Flow EF2 | Database error: System fails to save profile. User is notified and prompted to retry later. |

---

## UC003 – AI Chatbot Assistance (Use AI Chatbot)

### Use Case Overview

| Field | Description |
|---|---|
| **ID** | UC003 |
| **Name** | AI chatbot assistance / Use AI Chatbot |
| **Actor** | End User |
| **Related FR** | FR05, FR001, FR002, FR003, FR004, FR005 |
| **Related US** | US003 |

### Preconditions
1. User is logged in.
2. Financial profile exists.
3. Shariah rules are available.

### Normal Flow

| Step | Actor/System | Action |
|---|---|---|
| 1 | User | Clicks "AI Chatbot" on the dashboard. |
| 2 | System | Opens chatbot interface. |
| 3 | User | Submits a financial query. |
| 4 | System | Validates query for completeness and format. |
| 5 | AI Module | Retrieves user financial profile. |
| 6 | AI Module | Analyzes data (savings, expenses, goals). |
| 7 | AI Module | Generates recommendations. |
| 8 | System | Checks each recommendation for Shariah compliance. |
| 9 | System | Compliant recommendations are sent to chatbot. |
| 10 | Chatbot | Displays advice to the user. |

### Alternative Flows

**AF1: User cancels check**
1. Chat session ends, system discards current request.

**AF2: User asks multiple queries**
1. Chatbot queues requests; AI processes sequentially.

### Exception Flows

**EF1: AI service unavailable**
1. System displays "Try again later."

**EF2: Invalid input**
1. System shows error message and prompts correction.

### Postconditions
1. AI analyzes user data.
2. Chatbot delivers advice.
3. Recommendations comply with Shariah principles.

**Table 2.3: Use Case Description for Use AI Chatbot**

| Field | Description |
|---|---|
| User Story ID | US003 |
| User Story Name | Use AI Chatbot |
| User Story Description | As an End User, I want to check Shariah compliance of my financial activities so that I avoid non-compliant investments. |
| Preconditions | 1. User is logged in. 2. Financial profile exists. 3. Shariah rules are available. |
| Postconditions | 1. AI analyzes user data. 2. Chatbot delivers advice. 3. Recommendations comply with Shariah principles. |
| Normal Flow | 1. User clicks "AI Chatbot" on the dashboard. 2. System opens chatbot interface. 3. User submits a financial query. 4. System validates query for completeness and format. 5. AI module retrieves user financial profile. 6. AI module analyzes data (savings, expenses, goals). 7. AI module generates recommendations. 8. System checks each recommendation for Shariah compliance. 9. Compliant recommendations are sent to chatbot. 10. Chatbot displays advice to the user. |
| Alternative Flow AF1 | User cancels check: Chat session ends, system discards current request. |
| Alternative Flow AF2 | User asks multiple queries: Chatbot queues requests; AI processes sequentially. |
| Exception Flow EF1 | AI service unavailable: System displays "Try again later." |
| Exception Flow EF2 | Invalid input: System shows error message and prompts correction. |

---

## UC004 – Check Shariah Compliance

### Use Case Overview

| Field | Description |
|---|---|
| **ID** | UC004 |
| **Name** | check Shariah compliance |
| **Actor** | End User |
| **Related FR** | FR07, FR002 |
| **Related US** | US004 |

### Preconditions
1. User financial profile exists.

### Normal Flow

| Step | Actor/System | Action |
|---|---|---|
| 1 | User | Selects "Check Compliance." |
| 2 | System | Retrieves user financial data. |
| 3 | System | Compares activities with Shariah rules. |
| 4 | System | Compliance report is displayed to user. |

### Alternative Flows

**AF1: User cancels check**
1. Return to dashboard.

**AF2: User selects specific transactions to check**
1. System validates only selected data.

### Exception Flows

**EF1: Missing financial data**
1. Prompt user to update profile.

**EF2: AI service unavailable**
1. System displays error.

### Postconditions
1. System reports compliance status for transactions, investments, and savings.

**Table 2.4: Use Case Description for Check Shariah Compliance**

| Field | Description |
|---|---|
| User Story ID | US004 |
| User Story Name | Check Shariah Compliance |
| User Story Description | As an End User, I want to check Shariah compliance of my financial activities so that I avoid non-compliant investments. |
| Preconditions | 1. User financial profile exists. |
| Postconditions | 1. System reports compliance status for transactions, investments, and savings. |
| Normal Flow | 1. User selects "Check Compliance." 2. System retrieves user financial data. 3. System compares activities with Shariah rules. 4. Compliance report is displayed to user. |
| Alternative Flow AF1 | User cancels check: Return to dashboard. |
| Alternative Flow AF2 | User selects specific transactions to check: System validates only selected data. |
| Exception Flow EF1 | Missing financial data: Prompt user to update profile. |
| Exception Flow EF2 | AI service unavailable: System displays error. |

---

## UC005 – Generate Zakat Calculation

### Use Case Overview

| Field | Description |
|---|---|
| **ID** | UC005 |
| **Name** | generate zakat calculation |
| **Actor** | End User |
| **Related FR** | FR05 |
| **Related US** | US005 |

### Preconditions
1. Financial profile exists.

### Normal Flow

| Step | Actor/System | Action |
|---|---|---|
| 1 | User | Selects "Calculate Zakat." |
| 2 | System | Retrieves financial profile. |
| 3 | System | Computes Zakat. |
| 4 | System | Result displayed to user. |
| 5 | System | Record saved for future reference. |

### Alternative Flows

**AF1: User cancels calculation**
1. Return to dashboard.

**AF2: User recalculates**
1. System updates Zakat record.

### Exception Flows

**EF1: Missing financial data**
1. Prompt user to update profile.

**EF2: Calculation error**
1. Display error and retry option.

### Postconditions
1. Zakat amount calculated and stored.
2. Record available for dashboard and history.

**Table 2.5: Use Case Description for Generate Zakat Calculation**

| Field | Description |
|---|---|
| User Story ID | US005 |
| User Story Name | Generate Zakat Calculation |
| User Story Description | As an End User, I want to calculate Zakat so that I can fulfill my religious obligations accurately. |
| Preconditions | 1. Financial profile exists. |
| Postconditions | 1. Zakat amount calculated and stored. 2. Record available for dashboard and history. |
| Normal Flow | 1. User selects "Calculate Zakat." 2. System retrieves financial profile. 3. System computes Zakat. 4. Result displayed to user. 5. Record saved for future reference. |
| Alternative Flow AF1 | User cancels calculation: Return to dashboard. |
| Alternative Flow AF2 | User recalculates: System updates Zakat record. |
| Exception Flow EF1 | Missing financial data: Prompt user to update profile. |
| Exception Flow EF2 | Calculation error: Display error and retry option. |

---

## UC006 – View Savings & Investment Suggestions

### Use Case Overview

| Field | Description |
|---|---|
| **ID** | UC006 |
| **Name** | view savings and investments suggestions |
| **Actor** | End User |
| **Related FR** | FR05, FR06 |
| **Related US** | US006 |

### Preconditions
1. User is logged in.
2. Financial profile exists.

### Normal Flow

| Step | Actor/System | Action |
|---|---|---|
| 1 | User | Selects "View Suggestions." |
| 2 | System | Retrieves user financial profile. |
| 3 | AI Module | Analyzes income, expenses, savings, and investments. |
| 4 | AI Module | Generates recommendations. |
| 5 | System | Validates compliance with Shariah rules. |
| 6 | System | Recommendations displayed to the user. |

### Alternative Flows

**AF1: User cancels**
1. Return to dashboard.

**AF2: User requests updated suggestions**
1. AI regenerates based on latest profile data.

### Exception Flows

**EF1: Missing or incomplete financial data**
1. Prompt user to update profile.

**EF2: AI analysis fails**
1. Display "Try again later."

### Postconditions
1. AI generates personalized recommendations.
2. Suggestions are Shariah-compliant and stored for history.

**Table 2.6: Use Case Description for View Savings & Investment Suggestions**

| Field | Description |
|---|---|
| User Story ID | US006 |
| User Story Name | View Savings & Investment Suggestions |
| User Story Description | As an End User, I want to view AI-generated savings and investment suggestions so that I can make Shariah-compliant financial decisions. |
| Preconditions | 1. User is logged in. 2. Financial profile exists. |
| Postconditions | 1. AI generates personalized recommendations. 2. Suggestions are Shariah-compliant and stored for history. |
| Normal Flow | 1. User selects "View Suggestions." 2. System retrieves user financial profile. 3. AI module analyzes income, expenses, savings, and investments. 4. AI generates recommendations. 5. System validates compliance with Shariah rules. 6. Recommendations displayed to the user. |
| Alternative Flow AF1 | User cancels: Return to dashboard. |
| Alternative Flow AF2 | User requests updated suggestions: AI regenerates based on latest profile data. |
| Exception Flow EF1 | Missing or incomplete financial data: Prompt user to update profile. |
| Exception Flow EF2 | AI analysis fails: Display "Try again later." |

---

## UC007 – View Financial Dashboard

### Use Case Overview

| Field | Description |
|---|---|
| **ID** | UC007 |
| **Name** | view financial dashboard |
| **Actor** | End User |
| **Related FR** | FR06 |
| **Related US** | US007 |

### Preconditions
1. User is logged in.
2. Financial profile exists.

### Normal Flow

| Step | Actor/System | Action |
|---|---|---|
| 1 | User | Selects "Dashboard." |
| 2 | System | Retrieves user financial data. |
| 3 | System | Generates visualizations and displays goal progress. |
| 4 | System | AI suggestions and compliance alerts displayed. |

### Alternative Flows

**AF1: User refreshes dashboard**
1. System updates metrics and charts.

**AF2: User selects specific financial goal**
1. System shows detailed progress.

### Exception Flows

**EF1: Dashboard fails to load**
1. Display error message.

**EF2: Data missing**
1. Prompt user to update profile.

### Postconditions
1. Dashboard displays metrics, goals, progress charts, and AI recommendations.

**Table 2.7: Use Case Description for View Financial Dashboard**

| Field | Description |
|---|---|
| User Story ID | US007 |
| User Story Name | View Financial Dashboard |
| User Story Description | As an End User, I want to view my financial dashboard so that I can monitor my financial goals, progress, and Shariah compliance at a glance. |
| Preconditions | 1. User is logged in. 2. Financial profile exists. |
| Postconditions | 1. Dashboard displays metrics, goals, progress charts, and AI recommendations. |
| Normal Flow | 1. User selects "Dashboard." 2. System retrieves user financial data. 3. System generates visualizations and displays goal progress. 4. AI suggestions and compliance alerts displayed. |
| Alternative Flow AF1 | User refreshes dashboard: System updates metrics and charts. |
| Alternative Flow AF2 | User selects specific financial goal: System shows detailed progress. |
| Exception Flow EF1 | Dashboard fails to load: Display error message. |
| Exception Flow EF2 | Data missing: Prompt user to update profile. |

---

## UC008 – Monitor System Performance

### Use Case Overview

| Field | Description |
|---|---|
| **ID** | UC008 |
| **Name** | Monitor System Performance |
| **Actor** | System Admin |
| **Related FR** | FR08 |
| **Related US** | US008 |

### Preconditions
1. Admin is logged in.

### Normal Flow

| Step | Actor/System | Action |
|---|---|---|
| 1 | Admin | Selects "Monitor System." |
| 2 | System | Retrieves logs and metrics. |
| 3 | System | Displays CPU, memory, and AI module performance. |
| 4 | Admin | Can filter and review historical trends. |

### Alternative Flows

**AF1: Admin selects specific module**
1. System displays targeted metrics.

**AF2: Admin schedules automatic performance reports**
1. System generates and emails reports.

### Exception Flows

**EF1: Data retrieval error**
1. Prompt admin to retry.
2. Display "System metrics unavailable."

### Postconditions
1. System performance metrics are displayed.
2. Alerts for errors or slowdowns are logged.

**Table 2.8: Use Case Description for Monitor System Performance**

| Field | Description |
|---|---|
| User Story ID | US008 |
| User Story Name | Monitor System Performance |
| User Story Description | As a System Admin, I want to monitor system performance so that operations run smoothly and AI outputs are reliable. |
| Preconditions | 1. Admin is logged in. |
| Postconditions | 1. System performance metrics are displayed. 2. Alerts for errors or slowdowns are logged. |
| Normal Flow | 1. Admin selects "Monitor System." 2. System retrieves logs and metrics. 3. System displays CPU, memory, and AI module performance. 4. Admin can filter and review historical trends. |
| Alternative Flow AF1 | Admin selects specific module: System displays targeted metrics. |
| Alternative Flow AF2 | Admin schedules automatic performance reports: System generates and emails reports. |
| Exception Flow EF1 | Data retrieval error: Prompt admin to retry. Display "System metrics unavailable." |

---

## UC009 – Manage User Accounts

### Use Case Overview

| Field | Description |
|---|---|
| **ID** | UC009 |
| **Name** | Manage User Accounts |
| **Actor** | System Admin |
| **Related FR** | FR08 |
| **Related US** | US009 |

### Preconditions
1. Admin is logged in.

### Normal Flow

| Step | Actor/System | Action |
|---|---|---|
| 1 | Admin | Selects "Manage Users." |
| 2 | Admin | Adds, edits, or removes users. |
| 3 | System | Validates input and updates the database. |
| 4 | System | Confirms changes to admin. |

### Alternative Flows

**AF1: Admin cancels action**
1. Return to admin panel.

**AF2: Admin searches for user**
1. System displays filtered results.

### Exception Flows

**EF1: Invalid data entered**
1. System displays error.

**EF2: Database error**
1. System prompts admin to retry.

### Postconditions
1. User accounts updated successfully.
2. Access permissions applied correctly.

**Table 2.9: Use Case Description for Manage User Accounts**

| Field | Description |
|---|---|
| User Story ID | US009 |
| User Story Name | Manage User Accounts |
| User Story Description | As a System Admin, I want to manage user accounts so that access and permissions are controlled and secure. |
| Preconditions | 1. Admin is logged in. |
| Postconditions | 1. User accounts updated successfully. 2. Access permissions applied correctly. |
| Normal Flow | 1. Admin selects "Manage Users." 2. Admin adds, edits, or removes users. 3. System validates input and updates the database. 4. System confirms changes to admin. |
| Alternative Flow AF1 | Admin cancels action: Return to admin panel. |
| Alternative Flow AF2 | Admin searches for user: System displays filtered results. |
| Exception Flow EF1 | Invalid data entered: System displays error. |
| Exception Flow EF2 | Database error: System prompts admin to retry. |

---

## UC010 – Manage Shariah Rules

### Use Case Overview

| Field | Description |
|---|---|
| **ID** | UC010 |
| **Name** | Manage Shariah Rules |
| **Actor** | System Admin |
| **Related FR** | FR002 |
| **Related US** | US010 |

### Preconditions
1. Advisor/Admin is logged in.

### Normal Flow

| Step | Actor/System | Action |
|---|---|---|
| 1 | Admin | Selects "Shariah Rules – Laws." |
| 2 | System | Displays the current Shariah rules. |
| 3 | Admin | Reviews the rules. |
| 4 | Admin | Updates, removes, or approves rules. |
| 5 | System | Validates and saves the changes. |
| 6 | System | Displays a success message. |

### Alternative Flows

**AF1: Admin cancels the operation**
1. Return to dashboard.

**AF2: Admin searches specific rule**
1. System highlights rule for editing.

### Exception Flows

**EF1: Database unavailable**
1. Display "Cannot access rules."

**EF2: Validation error**
1. System rejects invalid updates.

### Postconditions
1. Shariah rules are reviewed and updated if necessary.
2. The AI module uses the latest compliant Shariah rules.

**Table 2.10: Use Case Description for Manage Shariah Rules**

| Field | Description |
|---|---|
| User Story ID | US010 |
| User Story Name | Manage Shariah Rules |
| User Story Description | As a System Admin, I want to manage Shariah rules so that AI recommendations comply with Islamic finance principles. |
| Preconditions | 1. Advisor is logged in. |
| Postconditions | 1. Shariah rules are reviewed and updated if necessary. 2. The AI module uses the latest compliant Shariah rules. |
| Normal Flow | 1. Admin selects "Shariah Rules – Laws." 2. System displays the current Shariah rules. 3. Admin reviews the rules. 4. Admin updates, removes, or approves rules. 5. System validates and saves the changes. 6. System displays a success message. |
| Alternative Flow AF1 | Admin cancels the operation: Return to dashboard. |
| Alternative Flow AF2 | Admin searches specific rule: System highlights rule for editing. |
| Exception Flow EF1 | Database unavailable: Display "Cannot access rules." |
| Exception Flow EF2 | Validation error: System rejects invalid updates. |

---

## UC011 – Answer Shariah-related Queries

### Use Case Overview

| Field | Description |
|---|---|
| **ID** | UC011 |
| **Name** | Answer Shariah-related Queries |
| **Actor** | End User / Intelligent Shariah Advisor Agent |
| **Related FR** | FR001, FR002 |
| **Related US** | US010 (SRS), US011 |

### Preconditions
1. The End User is logged in.
2. Shariah rules are available in the system.

### Normal Flow

| Step | Actor/System | Action |
|---|---|---|
| 1 | End User | Enters a Shariah-related question through the chatbot interface. |
| 2 | System | Processes the natural language query. |
| 3 | AI Module | Retrieves relevant Shariah rules from the knowledge base. |
| 4 | AI Module | Generates an appropriate response. |
| 5 | System | Displays the answer to the End User. |

### Alternative Flows

**AF1: Question unclear**
1. The system asks the user to rephrase the question.

**AF2: User asks a follow-up question**
1. The system continues the conversation and provides additional clarification.

### Exception Flows

**EF1: Data missing**
1. Prompt user to update.

**EF2: Processing error**
1. The system logs the error and asks the user to try again later.

### Postconditions
1. A Shariah-related answer is generated and displayed to the user.
2. The system logs the query and response for future reference.

**Table 2.11: Use Case Description for Answer Shariah-related Queries**

| Field | Description |
|---|---|
| User Story ID | US011 |
| User Story Name | Answer Shariah-related Queries |
| User Story Description | As an End User, I want to ask Shariah-related questions in natural language so that I can receive instant guidance based on Islamic finance rules. |
| Preconditions | 1. The End User is logged in. 2. Shariah rules are available in the system. |
| Postconditions | 1. A Shariah-related answer is generated and displayed to the user. 2. The system logs the query and response for future reference. |
| Normal Flow | 1. The End User enters a Shariah-related question through the chatbot interface. 2. The system processes the natural language query. 3. The AI Module retrieves relevant Shariah rules from the knowledge base. 4. The AI Module generates an appropriate response. 5. The system displays the answer to the End User. |
| Alternative Flow AF1 | Question unclear: The system asks the user to rephrase the question. |
| Alternative Flow AF2 | User asks a follow-up question: The system continues the conversation and provides additional clarification. |
| Exception Flow EF1 | Data missing: Prompt user to update. |
| Exception Flow EF2 | Processing error: The system logs the error and asks the user to try again later. |

---

## UC012 – Generate Financial Recommendations

### Use Case Overview

| Field | Description |
|---|---|
| **ID** | UC012 |
| **Name** | Generate Financial Recommendations |
| **Actor** | AI Module |
| **Related FR** | FR001, FR002, FR003 |
| **Related US** | US012 |

### Preconditions
1. Financial analysis completed.

### Normal Flow

| Step | Actor/System | Action |
|---|---|---|
| 1 | AI Module | Generates savings, investment, and spending recommendations. |
| 2 | System | Validates recommendations that align with Shariah rules. |
| 3 | System | Compliant recommendations stored. |
| 4 | System | Recommendations sent to user interface. |

### Alternative Flows

**AF1: User cancels view**
1. Recommendations not displayed.

**AF2: AI regenerates recommendations on-demand**
1. AI re-runs analysis with latest data.

### Exception Flows

**EF1: Compliance validation fails**
1. AI adjusts recommendations.

**EF2: Storage error**
1. Retry saving recommendations.

### Postconditions
1. Recommendations stored and ready for chatbot or dashboard display.

**Table 2.12: Use Case Description for Generate Financial Recommendations**

| Field | Description |
|---|---|
| User Story ID | US012 |
| User Story Name | Generate Financial Recommendations |
| User Story Description | As the AI Module, I want to generate recommendations so that users receive Shariah-compliant financial guidance. |
| Preconditions | 1. Financial analysis completed. |
| Postconditions | 1. Recommendations stored and ready for chatbot or dashboard display. |
| Normal Flow | 1. AI module generates savings, investment, and spending recommendations. 2. System validates recommendations that align with Shariah rules. 3. Compliant recommendations stored. 4. Recommendations sent to user interface. |
| Alternative Flow AF1 | User cancels view: Recommendations not displayed. |
| Alternative Flow AF2 | AI regenerates recommendations on-demand. |
| Exception Flow EF1 | Compliance validation fails: AI adjusts recommendations. |
| Exception Flow EF2 | Storage error: Retry saving recommendations. |

---

## UC013 – Analyze Financial Data

### Use Case Overview

| Field | Description |
|---|---|
| **ID** | UC013 |
| **Name** | Analyze Financial Data |
| **Actor** | AI Module |
| **Related FR** | FR001 |
| **Related US** | US013 |

### Preconditions
1. User data is available.
2. Shariah rules are loaded.

### Normal Flow

| Step | Actor/System | Action |
|---|---|---|
| 1 | AI Module | Retrieves user financial profile. |
| 2 | AI Module | Checks for completeness of data. |
| 3 | AI Module | Analyzes income, expenses, savings, and investments. |
| 4 | AI Module | Generates personalized insights. |
| 5 | System | Stores insights for recommendation engines. |
| 6 | System | Gives end user recommendations or suggestions based on analyzing. |

### Alternative Flows

**AF1: Partial data available**
1. AI generates limited insights and flags missing information.

**AF2: User requests updated insights**
1. AI reprocesses the latest data.

### Exception Flows

**EF1: Data missing**
1. Prompt user to update profile.

**EF2: Processing error**
1. Log error and retry.

**EF3: Compliance check fails**
1. System flags insights for review.

### Postconditions
1. Financial insights generated and ready for recommendations.

**Table 2.13: Use Case Description for Analyze Financial Data**

| Field | Description |
|---|---|
| User Story ID | US013 |
| User Story Name | Analyze Financial Data |
| User Story Description | As the AI Module, I want to analyze financial data so that I can generate personalized insights for users. |
| Preconditions | 1. User data is available. 2. Shariah rules are loaded. |
| Postconditions | 1. Financial insights generated and ready for recommendations. |
| Normal Flow | 1. AI module retrieves user financial profile. 2. AI checks for completeness of data. 3. AI analyzes income, expenses, savings, and investments. 4. AI generates personalized insights. 5. System stores insights for recommendation engines. 6. System gives end user recommendations or suggestions based on analyzing. |
| Alternative Flow AF1 | Partial data available: AI generates limited insights and flags missing information. |
| Alternative Flow AF2 | User requests updated insights: AI reprocesses the latest data. |
| Exception Flow EF1 | Data missing: Prompt user to update profile. |
| Exception Flow EF2 | Processing error: Log error and retry. |
| Exception Flow EF3 | Compliance check fails: System flags insights for review. |

---

## UC014 – Explain Shariah Compliance Decision

### Use Case Overview

| Field | Description |
|---|---|
| **ID** | UC014 |
| **Name** | Explain Shariah Compliance Decision |
| **Actor** | End User |
| **Related FR** | FR002 |
| **Related US** | US014 |

### Preconditions
1. A Shariah compliance check has been performed.
2. User logged in.

### Normal Flow

| Step | Actor/System | Action |
|---|---|---|
| 1 | End User | Requests an explanation for a compliance decision. |
| 2 | System | Retrieves the compliance result and related Shariah rules. |
| 3 | AI Module | Generates a justification based on the rules. |
| 4 | System | Displays the explanation and supporting evidence to the End User. |

### Alternative Flows

**AF1: User requests more details**
1. The system provides additional explanations or examples.

**AF2: User requests rule source**
1. User requests rule source.

### Exception Flows

**EF1: Rule reference unavailable**
1. The system displays "Supporting rule not available."

**EF2: AI processing error**
1. System logs the error and asks the user to try again later.

### Postconditions
1. Supporting Shariah rule references are provided.
2. The explanation is generated and displayed to the user.

**Table 2.14: Use Case Description for Explain Shariah Compliance Decision**

| Field | Description |
|---|---|
| User Story ID | US014 |
| User Story Name | Explain Shariah Compliance Decision |
| User Story Description | As an End User, I want the system to explain why a financial activity is compliant or non-compliant so that I can understand the Shariah reasoning behind the decision. |
| Preconditions | 1. A Shariah compliance check has been performed. 2. User logged in. |
| Postconditions | 1. Supporting Shariah rule references are provided. 2. The explanation is generated and displayed to the user. |
| Normal Flow | 1. The End User requests an explanation for a compliance decision. 2. The system retrieves the compliance result and related Shariah rules. 3. The AI Module generates a justification based on the rules. 4. The system displays the explanation and supporting evidence to the End User. |
| Alternative Flow AF1 | User requests more details: The system provides additional explanations or examples. |
| Alternative Flow AF2 | User requests rule source: User requests rule source. |
| Exception Flow EF1 | Rule reference unavailable: The system displays "Supporting rule not available." |
| Exception Flow EF2 | AI processing error: System logs the error and asks the user to try again later. |

---

## UC015 – Access AI Chatbot

### Use Case Overview

| Field | Description |
|---|---|
| **ID** | UC015 |
| **Name** | Access AI Chatbot |
| **Actor** | AI Module |
| **Related FR** | FR003 |
| **Related US** | US015 |

### Preconditions
1. Recommendations generated.
2. User logged in.

### Normal Flow

| Step | Actor/System | Action |
|---|---|---|
| 1 | User | Opens AI chatbot interface. |
| 2 | Chatbot | Queries AI module for recommendations. |
| 3 | AI Module | Sends personalized guidance. |
| 4 | Chatbot | Displays advice to user. |
| 5 | User | Can ask follow-up questions; AI module processes and responds. |

### Alternative Flows

**AF1: User ends session**
1. Chat session closes.

**AF2: User asks multiple queries**
1. AI processes sequentially.

### Exception Flows

**EF1: Chatbot fails**
1. Display "Service unavailable, try later."

**EF2: AI processing error**
1. Display "Cannot generate recommendation at the moment."

### Postconditions
1. Chatbot delivers advice.
2. Users can interact with chatbot for further queries.

**Table 2.15: Use Case Description for Access AI Chatbot**

| Field | Description |
|---|---|
| User Story ID | US015 |
| User Story Name | Access AI Chatbot |
| User Story Description | As the AI Module, I want to provide output to the AI chatbot so that users receive real-time, personalized financial guidance. |
| Preconditions | 1. Recommendations generated. 2. User logged in. |
| Postconditions | 1. Chatbot delivers advice. 2. Users can interact with chatbot for further queries. |
| Normal Flow | 1. User opens AI chatbot interface. 2. Chatbot queries AI module for recommendations. 3. AI module sends personalized guidance. 4. Chatbot displays advice to user. 5. User can ask follow-up questions; AI module processes and responds. |
| Alternative Flow AF1 | User ends session: Chat session closes. |
| Alternative Flow AF2 | User asks multiple queries: AI processes sequentially. |
| Exception Flow EF1 | Chatbot fails: Display "Service unavailable, try later." |
| Exception Flow EF2 | AI processing error: Display "Cannot generate recommendation at the moment." |

---

# 6. Traceability Matrix

## 6.1 FR → UC → TC Mapping (Exact as Documented)

| Test Case ID | Use Case ID | Sequence Diagram ID | Package ID | Test Cases |
|---|---|---|---|---|
| TC001 | UC001 | SD001 | P001 | TC001_01, TC001_02, TC001_03 |
| TC002 | UC002 | SD002 | P002 | TC002_01, TC002_02, TC002_03, TC002_04, TC002_05 |
| TC003 | UC003 | SD003 | P001 | TC003_01, TC003_02, TC003_03, TC003_04, TC003_05 |
| TC004 | UC004 | SD004 | P003 | TC004_01, TC004_02, TC004_03, TC004_04, TC004_05, TC004_06 |
| TC005 | UC005 | SD005 | P004 | TC005_01, TC005_02, TC005_03, TC005_04, TC005_05, TC005_05, TC005_05 |
| TC006 | UC006 | SD006 | P004 | TC006_01, TC006_02, TC006_03, TC006_04, TC006_05, TC006_06 |
| TC007 | UC007 | SD007 | P004 | TC007_01, TC007_02, TC007_03, TC007_06, TC007_05 |
| TC008 | UC008 | SD008 | P005 | TC008_01, TC008_02, TC008_03, TC008_04, TC008_05, TC008_06, TC008_07, TC008_08 |
| TC009 | UC009 | SD009 | P004 | TC009_01 through TC009_11 |
| TC010 | UC010 | SD010 | P006 | TC010_01 through TC010_10 |
| TC011 | UC011 | SD011 | P005 | TC011_01 through TC011_12 |
| TC012 | UC012 | SD012 | P003 | TC012_01 through TC012_13 |
| TC013 | UC013 | SD013 | P007 | TC013_01 through TC013_13 |

## 6.2 UC → Package Mapping (Exact as Documented)

| UC | Subsystem Package |
|---|---|
| UC001 | P001 |
| UC002 | P002 |
| UC003 | P001 |
| UC004 | P003 |
| UC005 | P004 |
| UC006 | P004 |
| UC007 | P004 |
| UC008 | P005 |
| UC009 | P004 |
| UC010 | P006 |
| UC011 | P005 |
| UC012 | P003 |
| UC013 | P007 |

---

# 7. Constraints

- The system must operate in environments with internet connectivity speeds as low as 1 Mbps.
- Server must have a minimum of 8 GB RAM, quad-core processor, and 100 GB storage.
- End User Devices must have at least 2 GB RAM and a 1 GHz processor; minimum screen resolution 1366×768.
- All user data must be encrypted using AES-256 encryption.
- User authentication must be implemented using secure login with multi-factor authentication (MFA).
- Role-based access control must be enforced for Admin and Shariah Advisor accounts.
- Web browsers supported: Chrome, Firefox, Edge, and Safari (latest two versions).
- Mobile OS: Android 10+ and iOS 13+.
- Backend services must be compatible with PostgreSQL or MySQL databases.
- The system must comply with applicable data protection laws, Islamic finance regulations, and financial advisory guidelines.
- The system does not cover personal budgeting, integrating banking transactions, trade execution, portfolio management, pay processing, or any payout/approval processes not related to stock Shariah screening.
- The system must be operational at least 99.5% of the time annually; scheduled maintenance must occur outside peak hours with downtime notifications.
- AI chatbot responses must be delivered within 3 seconds for standard queries.
- Basic operations (dashboard, profile) must respond within 2 seconds.
- The system must handle at least 500 concurrent user sessions without performance degradation.
- AI modules must process at least 50 AI recommendation requests per second.
- The system must support a minimum of 10,000 registered users initially, scalable to 100,000.

---

# 8. Assumptions

The source document does not include an explicit assumptions section. The following assumptions are clearly implied from context:

> *Inferred from context — not explicitly stated as a formal assumptions list.*

- Users are assumed to have basic digital literacy and access to a modern web browser.
- The system assumes that users are Muslims or individuals interested in Shariah-compliant financial management.
- The Shariah knowledge base (ShariahRule entities) is pre-populated with validated Islamic finance rules prior to system deployment.
- TradingView API availability is assumed for stock screening functionality.
- Firebase availability as a cloud service is assumed for all backend, authentication, and data storage operations.
- The system assumes that financial data entered by users is truthful and accurate; the system validates format and data type but not the factual accuracy of user-submitted values.
- The NLP and AI/ML services used by the AI Advisor Module are assumed to be available and performant enough to meet the 3-second response time requirement.
- Multi-language support (English and Arabic) is assumed to be handled via web localization libraries without requiring separate system instances.
