# HANDOVER.md — SpaceHub Co-Working Space Management System

**Received from:** Group Emerald  
**Received by:** Group Bughair  
**Date:** 25 March 2026  
**Repository:** https://github.com/ICT-Mahidol/2025-ITCS383-Emerald

---

## D2.1: Features of the Received Project

SpaceHub is a full-featured co-working space management system with three distinct user roles: Customer, Employee, and Manager.

### Customer Features

| Feature | Description |
|---|---|
| Account Registration & Login | Secure sign-up with encrypted PII (name, phone, address stored with AES-256-GCM) |
| Membership Plans | Subscribe to Day (฿15), Month (฿299), or Year (฿2,999) plans |
| Desk Booking | 3-step flow: select date → choose time slot → payment |
| Time Slot Availability | View real-time desk availability across 6 time slots (08:00–18:00) |
| Payment Methods | Credit Card, Bank Transfer (via Banking API), TrueWallet (simulated) |
| My Bookings | View, track status, and cancel existing reservations |
| Booking Expiry | Unpaid bookings auto-expire after 30 minutes with live countdown |
| Cancellation Policy | Confirmed bookings require at least 1 day notice before booking date |
| Profile Management | View and update personal information |

### Employee Features

| Feature | Description |
|---|---|
| Reservation Management | View all reservations filtered by date |
| Customer Check-In | Verify and check in confirmed bookings |
| Equipment Inventory | Track and update stock levels (desks, chairs, extension cords, peripherals) |
| Expense Recording | Log daily operational expenses |
| CCTV Monitoring | Simulated security camera feed dashboard |

### Manager Features

| Feature | Description |
|---|---|
| Revenue Dashboard | Daily and monthly revenue overview with payment method breakdown |
| Income Reports | Monthly revenue vs. expenses with net profit calculation |
| Employee Management | Add, view, update, and remove employee accounts |
| Daily Summary | Real-time stats: reservations, income, expenses, net income, member count |
| Banking API | Simulated bank transfer endpoint |

---

## 2. Design Verification

### C4 Diagram vs. Actual Implementation

#### Level 1: Context Diagram — ✅ Consistent

The design shows 3 actors (Customer, Employee, Manager) and 2 external systems (Payment System, CCTV). The implementation confirms all 3 roles exist with separate dashboards (`dashboard.html`, `employee-dashboard.html`, `manager-dashboard.html`). The Banking API (`POST /api/bank/transfer`) and CCTV endpoint (`GET /api/employee/cctv`) are both implemented as described.

#### Level 2: Container Diagram — ✅ Consistent

The design specifies 3 containers: Web Application (HTML/CSS/JS), API (Node.js/Express), and Database (PostgreSQL via Neon). The implementation matches exactly — static files served from `public/`, all business logic in `server.js`, and Neon PostgreSQL connected via `DATABASE_URL` environment variable.

One minor discrepancy: the design document states **AES-256-CBC** encryption for PII, but the actual implementation uses **AES-256-GCM** (in `lib/crypto.js`). GCM is a more secure authenticated encryption mode, so this is an improvement over the design, not a regression.

#### Level 3: Component Diagram — ✅ Mostly Consistent

| Component | Design | Implementation | Status |
|---|---|---|---|
| Create Account | Register with PII encryption | `POST /api/register` with AES-256-GCM | ✅ |
| Authentication | bcrypt login + role redirect | `POST /api/login` | ✅ |
| Membership Subscription | Day/Month/Year plans | `POST /api/membership` | ✅ |
| Booking System | Availability + 30-min expiry + 1-day cancel | `POST /api/bookings` + expiry job in `lib/expiry.js` | ✅ |
| Payment Service | Credit, Bank Transfer, TrueWallet | `POST /api/bookings/:id/pay` | ✅ |
| Inventory Management | Equipment stock tracking | `GET/PUT /api/employee/equipment` | ✅ |
| Generate Report | Revenue + expense aggregation | `GET /api/manager/revenue`, `GET /api/manager/report` | ✅ |
| Security System (CCTV) | Camera feed monitoring | `GET /api/employee/cctv` (stub/simulated) | ✅ |

#### Use Case Diagram — ✅ Consistent

All use cases shown in the diagram are implemented. The `requireRole` middleware in `lib/auth.js` enforces role-based access control server-side, consistent with the design showing role separation.

### Updated C4 Note

The Level 3 Component Diagram should be updated to reflect:
- Encryption algorithm is **AES-256-GCM** (not AES-256-CBC as stated in the Container Diagram rationale)
- `lib/expiry.js` is a background job component not shown in the original diagram — it handles the 30-minute booking expiry rule

---

## D3: Reflections on Receiving the Handover

### a. Technologies Used

| Layer        | Technology                          |
|--------------|-------------------------------------|
| Frontend     | HTML, CSS (BEM), Vanilla JavaScript <img width="2880" height="1864" alt="image" src="https://github.com/user-attachments/assets/23a817f7-75dc-4356-b659-297782ff63d5" />|
| Backend      | Node.js 20, Express                 <img width="1378" height="748" alt="image" src="https://github.com/user-attachments/assets/ecaab725-bd21-4995-9569-bed891bddd0a" />|
| Database     | Neon (Serverless PostgreSQL)        <img width="1356" height="498" alt="image" src="https://github.com/user-attachments/assets/852988b8-890e-4a1e-8b05-898b7c51ddde" />|
| Encryption   | AES-256-GCM (Node.js crypto)        <img width="2880" height="1864" alt="image" src="https://github.com/user-attachments/assets/bcca2c1b-05fb-45ee-9295-5ee999a2ad62" />|
| Auth         | bcryptjs (password hashing)         <img width="1342" height="282" alt="image" src="https://github.com/user-attachments/assets/b2c4a3bd-7691-48de-9553-aa446e588abc" />|
| Testing      | Jest, Supertest                     <img width="1062" height="242" alt="image" src="https://github.com/user-attachments/assets/d066b0fd-5375-4fb9-b541-0409009c0f27" />|
| Code Quality | SonarCloud                          <img width="2880" height="1864" alt="image" src="https://github.com/user-attachments/assets/c26549c5-94be-441e-b5fb-6a478541a9be" />|
| Container    | Docker (Alpine)                     <img width="2880" height="1864" alt="image" src="https://github.com/user-attachments/assets/7c0b4d9d-e09b-4286-af1e-c82f51931dd4" />|
| Registry     | GitHub Container Registry           <img width="2880" height="1864" alt="image" src="https://github.com/user-attachments/assets/ec91a98c-03fe-4fba-9c8c-e486a2469a12" />|
| CI/CD        | GitHub Actions                      |
| Hosting      | Render                              |


### b. Required Information to Successfully Hand Over the Project

The following information was necessary to set up and run the project:

**Environment Variables (must be provided by the original team)**

| Variable | Description | How to Obtain |
|---|---|---|
| `DATABASE_URL` | Neon PostgreSQL connection string | Create free account at neon.tech |
| `ENCRYPTION_KEY` | 64-character hex string for AES-256-GCM | Generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `PORT` | Server port (default: 3000) | Set to any available port |

**Default Credentials**

| Role | Email | Password |
|---|---|---|
| Manager | `admin@spacehub.co` | `admin123` |
| Employee | Must be created by Manager via dashboard | — |
| Customer | Register via `/register.html` | — |

**Setup Steps Required**
1. Create a Neon PostgreSQL database (free tier sufficient)
2. Copy connection string from Neon dashboard
3. Generate ENCRYPTION_KEY using Node.js crypto
4. Create `.env` file in `implementations/` with the above values
5. Run `npm install` then `npm start`
6. All tables and seed data are created automatically on first startup

---

### c. Code Quality: SonarQube Cloud

#### 1. Executive Summary
The current state of the project indicates a significant increase in technical debt and security risks compared to the legacy reports. While the previous team maintained a "Passed" Quality Gate with zero security vulnerabilities and the introduction of a **high-severity security issue**.

##### Original SonarQube result
<img width="1438" height="811" alt="sonar_summary" src="https://github.com/user-attachments/assets/acdf632f-0a2c-4740-b180-c346e2004405" />
<img width="1438" height="811" alt="sonar_issues" src="https://github.com/user-attachments/assets/6544abb9-280d-4ea9-bdbe-4c086c206d63" />

##### Handover SonarQube result (latest)
<img width="1440" height="812" alt="Screenshot 2569-03-25 at 20 58 53" src="https://github.com/user-attachments/assets/1ec85b0c-73bd-4fae-b51e-ba421a33ef37" />
<img width="1440" height="812" alt="Screenshot 2569-03-25 at 20 59 24" src="https://github.com/user-attachments/assets/9d3591e8-9990-429a-b022-ecdbb46ec49e" />




#### 2. Comparison of Metrics
The discrepancy in the **Lines of Code (LOC)** confirms that the handover version is much larger than the version captured in the legacy screenshots, suggesting the previous team documented the project in an incomplete or early state.

| Metric                  | Legacy Report (Old Team) | Current Handover (Latest Run) | Status             |
|-------------------------|-------------------------|-------------------------------|------------------|
| Lines of Code (LOC)      | 992                     | 6,200                         | Significant Increase |
| Security Issues          | 0 (Rating A)            | 1 (Rating D)                  | Regression        |
| Reliability Issues       | 0 (Rating A)            | 17 (Rating A)                 | Regression        |
| Maintainability          | 14 (Rating A)           | 73 (Rating A)                 | Regression        |
| Code Coverage            | 74.7%                   | 0.0%                          | Critical Drop     |
| Duplications             | 0.0%                    | 0.3%                          | Slight Increase   |


#### 3. Key Findings & Risks

- **Project Scale Discrepancy:**  
  The codebase has grown from ~1k LOC to 6.2k LOC. This indicates that the legacy screenshots represent an early development phase and do not reflect the full scope of the project being handed over.

- **Security Vulnerability:**  
  A new **High-Severity Security Issue** has been introduced (rated 'D'). Specifically, the "Issues" view highlights a vulnerability regarding the use of **insecure modes and padding schemes** in cryptographic implementations (`crypto.test.js`), which poses a risk to data integrity.

- **Increased Technical Debt:**  
  Maintainability issues have jumped from 14 to 73. While the rating remains an 'A', the sheer volume of **"Code Smells"** (e.g., preferring `node:crypto` over `crypto` or `globalThis` over `window`) will require significant cleanup effort.
  

#### 4. Conclusion
The code quality of the handover project is currently **sub-optimal** and carries **high risk**. The presence of a high-severity security vulnerability is the most critical item that need to be addressed before the project can be considered **production-ready or stable**.
