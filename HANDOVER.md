# HANDOVER.md — SpaceHub Co-Working Space Management System

**Received from:** Group Emerald  
**Received by:** Group Bughair  
**Date:** 25 March 2026  
**Repository:** https://github.com/ICT-Mahidol/2025-ITCS383-Emerald

---

## 1. Features of the Received Project

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

## 3. Reflections on Receiving the Handover

### a. Technologies Used

| Layer | Technology | Version |
|---|---|---|
| Runtime | Node.js | 20+ |
| Framework | Express | 4.21.2 |
| Database | PostgreSQL via Neon (serverless) | — |
| DB Driver | postgres (npm) | 3.4.8 |
| Password Hashing | bcryptjs | 2.4.3 |
| Encryption | AES-256-GCM (Node.js built-in `crypto`) | — |
| Testing | Jest + Supertest | 30.2.0 / 7.2.2 |
| Code Quality | SonarCloud | — |
| Container | Docker (Alpine multi-stage) | — |
| CI/CD | GitHub Actions | — |
| Hosting | Render | — |
| Frontend | HTML, CSS (BEM), Vanilla JavaScript | — |

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

### c. Code Quality (SonarQube/SonarCloud Results)

Based on the original team's D4 Quality Report and our own review:

| Metric | Result |
|---|---|
| Quality Gate | ✅ Passed |
| Security Issues | 0 (A Rating) |
| Reliability Issues | 0 (A Rating) |
| Maintainability Issues | 14 (A Rating) — minor code smells only |
| Code Duplication | 0.0% |
| Test Coverage (Lines) | 76.51% |
| Total Tests | 77 passing |
| npm audit vulnerabilities | 0 |

The 14 maintainability issues are low-severity code smells (e.g., prefer `globalThis` over `window` for ES2020 portability). No bugs, vulnerabilities, or blocking issues were found. The project has strong test coverage across authentication, booking, payment, employee, and manager routes (TC-001 through TC-069).

Overall the codebase is well-structured, readable, and maintainable. The separation of concerns between `server.js`, `lib/auth.js`, `lib/crypto.js`, and `lib/expiry.js` makes the code easy to understand and extend.
