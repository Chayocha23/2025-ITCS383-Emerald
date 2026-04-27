# Emerald - D4 Quality Report

## Introduction
This document contains the Quality Report for the Emerald Co-working Space application.

## 1. Static Analysis / SonarCloud Results
The project's codebase has been continuously evaluated via **SonarCloud** in our GitHub Actions pipeline.

### SonarCloud Evaluation Metrics
- **Quality Gate:** ✅ **Passed**
- **Security Issues:** 0 (A Rating)
- **Reliability Issues:** 0 (A Rating)
- **Maintainability Issues:** 14 (A Rating)
- **Code Duplication:** 0.0%

![SonarCloud Dashboard Summary](assets/sonar_summary.png)

The 14 maintainability issues are entirely minor "Code Smells" (e.g., *Prefer `globalThis` over `window`* in frontend script files). These are low-priority stylistic suggestions for ES2020 portability and do not represent any functional flaws or architectural risks. 

![SonarCloud Maintainability Code Smells](assets/sonar_issues.png)

No major vulnerabilities, bugs, or stylistic roadblocks exist. The CI pipeline successfully blocks any pull requests that fail to meet these high maintainability ratings.

## 2. Test Coverage Report
Automated testing is implemented using **Jest** and **Supertest** to test the core API routes and components. 

The application currently has **77 passing tests**. Test coverage is continuously monitored via Jest's LCOV reports and uploaded to SonarCloud during our GitHub Actions CI pipeline.

### Coverage Summary (Backend)

| File | % Statements | % Branch | % Functions | % Lines |
|---|---|---|---|---|
| **All files combined** | **76.92%** | **82.41%** | **89.36%** | **76.51%** |
| `/implementations/server.js` | 74.56% | 81.11% | 88.09% | 74.08% |
| `/implementations/lib/auth.js` | 87.50% | 90.90% | 100.00% | 87.50% |
| `/implementations/lib/crypto.js` | 100.00% | 100.00% | 100.00% | 100.00% |

### Core Test Suites
We extensively test five main areas of the application to ensure business logic remains stable. Below is a detailed breakdown of all individual test cases demonstrating inputs, logic and expected outcomes.

| Test ID | Category / Route | Test Case Description | Input Payload / Condition | Expected Result |
| :--- | :--- | :--- | :--- | :--- |
| TC-001 | **Authentication & Registration** | `POST /api/register` | Missing required fields (e.g., email) | `400 Bad Request` "All fields are required." |
| TC-002 | | | Valid registration details | `201 Created` "Account created successfully!" |
| TC-003 | | | Email already exists | `409 Conflict` "An account with this email already exists." |
| TC-004 | **User Login** | `POST /api/login` | Missing email or password | `400 Bad Request` "Email and password are required." |
| TC-005 | | | Unregistered email | `401 Unauthorized` "Invalid email or password." |
| TC-006 | | | Incorrect password | `401 Unauthorized` "Invalid email or password." |
| TC-007 | | | Correct credentials | `200 OK` "Login successful!" with session data |
| TC-008 | **Utility Endpoints** | `GET /api/pricing` | No payload required | `200 OK` Returns pricing object (day, month, year) |
| TC-009 | | `GET /api/timeslots` | No payload required | `200 OK` Returns array of available time slots |
| TC-010 | **Membership System** | `POST /api/membership` | Invalid duration boundaries (e.g., 'decade') | `400 Bad Request` "Type must be day, month, or year." |
| TC-011 | | | Missing userId, type, or duration | `400 Bad Request` "userId, type, and duration are required." |
| TC-012 | | | User already has active membership | `409 Conflict` "You already have an active membership..." |
| TC-013 | | | Valid membership request | `201 Created` "Membership created. Please complete payment." (status: pending) |
| TC-014 | **Get Membership** | `GET /api/membership/:userId`| User has no membership | `200 OK` membership: null |
| TC-015 | | | User has active membership | `200 OK` Returns membership object and payment history |
| TC-016 | **Membership Payment**| `POST /api/membership/:id/pay` | Missing userId or paymentMethod | `400 Bad Request` "userId and paymentMethod are required." |
| TC-017 | | | Invalid payment method (e.g., 'bitcoin') | `400 Bad Request` "Invalid payment method." |
| TC-018 | | | Membership ID not found | `404 Not Found` |
| TC-019 | | | Membership not in `pending_payment` status | `400 Bad Request` |
| TC-020 | | | Valid payment execution | `200 OK` "Membership payment successful!..." |
| TC-021 | **Desk Booking System** | `POST /api/bookings` | Missing required booking fields | `400 Bad Request` "All booking fields are required." |
| TC-022 | | | User without active membership | `400 Bad Request` "Active membership required to book." |
| TC-023 | | | Desks requested exceeds specific availability | `400 Bad Request` "Not enough desks available" |
| TC-024 | | | Valid booking request | `201 Created` Returns booking object with exact desk IDs |
| TC-025 | **Booking Payment** | `POST /api/bookings/:id/pay` | Missing userId or paymentMethod | `400 Bad Request` |
| TC-026 | | | Invalid payment method (e.g., 'paypal') | `400 Bad Request` |
| TC-027 | | | Booking ID not found | `404 Not Found` |
| TC-028 | | | Booking already processed (not `pending`) | `400 Bad Request` |
| TC-029 | | | Booking expired timeframe | `400 Bad Request` "Booking has expired..." |
| TC-030 | | | Valid payment execution | `200 OK` "Payment confirmed!..." |
| TC-031 | **Get Bookings** | `GET /api/bookings/user/:userId`| No associated bookings | `200 OK` bookings: [] |
| TC-032 | | | User has bookings | `200 OK` Returns array of bookings |
| TC-033 | | `GET /api/bookings/:bookingId` | Booking not found | `404 Not Found` |
| TC-034 | | | Booking found | `200 OK` Returns precise booking details |
| TC-035 | **Cancel Booking** | `POST /api/bookings/:id/cancel` | Booking not found | `404 Not Found` |
| TC-036 | | | Booking already cancelled | `400 Bad Request` "...already cancelled" |
| TC-037 | | | Cancellation < 1 day before booking date | `400 Bad Request` "Cannot cancel less than 1 day..." |
| TC-038 | | | Valid cancellation request | `200 OK` Returns success and refund processing info |
| TC-039 | **Booking Availability**| `GET /api/bookings/availability`| Missing date parameter | `400 Bad Request` |
| TC-040 | | | Valid date request | `200 OK` Returns slot availability metrics |
| TC-041 | **Employee Routes** | `GET /api/employee/reservations`| Missing userId (`requireRole` auth check) | `401 Unauthorized` "Authentication required." |
| TC-042 | | | Missing date query | `400 Bad Request` "Date is required." |
| TC-043 | | | Valid request | `200 OK` Returns reservations for date |
| TC-044 | | `POST /api/employee/checkin` | Booking not found | `404 Not Found` |
| TC-045 | | | Booking status not `confirmed` | `400 Bad Request` "Must be confirmed" |
| TC-046 | | | Valid check-in request | `200 OK` "Customer checked in successfully." |
| TC-047 | | `GET /api/employee/equipment` | Valid request | `200 OK` Returns equipment inventory array |
| TC-048 | | `GET /api/employee/cctv` | Valid request | `200 OK` Returns CCTV camera list |
| TC-049 | | `POST /api/employee/expenses` | Missing category or amount | `400 Bad Request` "Category and amount are required." |
| TC-050 | | | Valid expense entry | `201 Created` "Expense recorded." |
| TC-051 | | `GET /api/employee/expenses` | Valid request | `200 OK` Returns expense entries |
| TC-052 | | `PUT /api/employee/equipment/:id` | Equipment not found | `404 Not Found` |
| TC-053 | | | Valid equipment update | `200 OK` "Equipment updated." |
| TC-054 | **Manager Routes** | `GET /api/manager/revenue` | Missing period query | `400 Bad Request` |
| TC-055 | | | Valid daily revenue request | `200 OK` Returns aggregated daily totals |
| TC-056 | | | Valid monthly revenue request | `200 OK` Returns aggregated monthly totals |
| TC-057 | | `GET /api/manager/report` | Missing month query | `400 Bad Request` |
| TC-058 | | | Valid compilation request | `200 OK` Returns monthly income and expense metrics |
| TC-059 | | `GET /api/manager/employees` | Valid request | `200 OK` Returns active employee array |
| TC-060 | | `POST /api/manager/employees` | Missing employee construction fields | `400 Bad Request` |
| TC-061 | | | Valid employee creation | `201 Created` "Employee created." |
| TC-062 | | `PUT /api/manager/employees/:id` | Employee not found | `404 Not Found` |
| TC-063 | | | Valid employee detail update | `200 OK` "Employee updated." |
| TC-064 | | `DELETE /api/manager/employees/:id` | Employee not found | `404 Not Found` |
| TC-065 | | | Valid employee deletion command | `200 OK` "Employee removed." |
| TC-066 | | `GET /api/manager/summary` | Valid summary request | `200 OK` Returns KPI dashboards and statistics |
| TC-067 | **Auth Middleware** | `All protected /api/*` | Non-existent user lookup | `401 Unauthorized` "User not found." |
| TC-068 | | | Access attempt with insufficient role (e.g. customer -> employee) | `403 Forbidden` "Access denied. Insufficient permissions." |
| TC-069 | **Bank Transfer Simulation**| `POST /api/bank/transfer` | Any payload | `200 OK` Emulates processing delay and returns `{success: true}` with dummy TXN id |

*All Core Business Logic Testing has been verified to pass successfully.*

## 3. Vulnerability & Security Analysis
- **Dependency Audit**: `npm audit` was executed and reported **0 vulnerabilities** across all **406 audited packages**.
- **Data Privacy**: Passwords are securely hashed via `bcryptjs`. Sensitive user fields like First Name, Last Name, Phone, and Address are encrypted using a symmetric cipher via the custom `#crypto` module before being stored in PostgreSQL.
- **Access Control**: Role-based access control (RBAC) middleware (`requireRole`) restricts employee and manager routes properly, with failing tests confirming that customers or unauthenticated users receive 401 or 403 HTTP codes.


## Conclusion
The Emerald Co-working Space platform possesses strong intrinsic quality metrics. With robust cryptography procedures built-in, no found npm audit vulnerabilities, and a healthy test suite establishing ~76.5% line coverage across the main routes (and the majority of uncovered lines relegated to bootstrap/database setup logic), the code demonstrates a reliable readiness suitable for its intended environment. All 77 unit tests pass cleanly, and the CI/CD configuration successfully enforces safety checks around pull-request cycles.
