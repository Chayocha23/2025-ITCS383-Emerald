## Traceability Graph

---

### Customer Core Features

#### R1: User Registration
- Web Application → API → Database  
- API (POST /api/register)  
- TC-001, TC-002, TC-003  

#### R2: User Authentication
- Web Application → API  
- API (POST /api/login)  
- TC-004, TC-005, TC-006, TC-007  

---

### Membership System

#### R3: Membership Subscription
- Web Application → API → Database  
- API (POST /api/membership)  
- TC-010, TC-011, TC-012, TC-013  
- ↳ triggers → R21 (Notification System – membership created)  

#### R4: Membership Payment
- Web Application → API → Database  
- API (POST /api/membership/:id/pay)  
- TC-016, TC-017, TC-018, TC-019, TC-020  
- ↳ triggers → R21 (Notification System – payment status)  
- ↳ uses → R19 (Bank Transfer Integration)  

---

### Booking System (Main Interaction Hub)

#### R5: Desk Booking
- Web Application → API → Database  
- API (POST /api/bookings)  
- TC-021, TC-022, TC-023, TC-024  
- ↳ triggers → R21 (Notification – booking confirmation)  
- ↳ may trigger → R20 (Customer Support – booking issues)  

#### R6: Booking Payment
- Web Application → API → Database  
- API (POST /api/bookings/:id/pay)  
- TC-025, TC-026, TC-027, TC-028, TC-029, TC-030  
- ↳ triggers → R21 (Notification – payment status)  
- ↳ uses → R19 (Bank Transfer Integration)  

#### R7: Booking Management (View / Cancel)
- Web Application → API → Database  
- API (GET /api/bookings, POST /api/bookings/:id/cancel)  
- TC-031, TC-032, TC-033, TC-034, TC-035, TC-036, TC-037, TC-038  
- ↳ triggers → R21 (Notification – cancellation confirmation)  

---

### Availability & Security

#### R8: Availability Checking
- Web Application → API → Database  
- API (GET /api/bookings/availability)  
- TC-039, TC-040  

#### R18: Role-Based Access Control
- API  
- auth.js  
- TC-067, TC-068  
- ↳ applies to → R5–R17, R20, R21  

---

### Employee Operations

#### R9: Reservation Management
- Web Application → API → Database  
- API (GET /api/employee/reservations)  
- TC-041, TC-042, TC-043  

#### R10: Customer Check-in
- Web Application → API → Database  
- API (POST /api/employee/checkin)  
- TC-044, TC-045, TC-046  
- ↳ triggers → R21 (Notification – check-in confirmation)  

#### R11: Inventory Management
- Web Application → API → Database  
- API (GET/PUT /api/employee/equipment)  
- TC-047, TC-052, TC-053  

#### R12: Expense Recording
- Web Application → API → Database  
- API (POST /api/employee/expenses)  
- TC-049, TC-050, TC-051  

#### R13: CCTV Monitoring
- Web Application → API  
- API (GET /api/employee/cctv)  
- TC-048  

---

### Manager Features

#### R14: Revenue Dashboard
- Web Application → API → Database  
- API (GET /api/manager/revenue)  
- TC-054, TC-055, TC-056  
- ↳ depends on → R6 (Booking Payment), R12 (Expense Recording)  

#### R15: Income Reports
- Web Application → API → Database  
- API (GET /api/manager/report)  
- TC-057, TC-058  
- ↳ depends on → R14 (Revenue Dashboard)  

#### R16: Employee Management
- Web Application → API → Database  
- API (POST/PUT/DELETE /api/manager/employees)  
- TC-060, TC-061, TC-062, TC-063, TC-064, TC-065  

#### R17: System Summary Dashboard
- Web Application → API → Database  
- API (GET /api/manager/summary)  
- TC-066  
- ↳ aggregates → R5, R6, R12, R14  

---

### External & Integration

#### R19: Bank Transfer Integration
- API → External Banking API  
- API (POST /api/bank/transfer)  
- TC-069  
- ↳ used by → R4 (Membership Payment), R6 (Booking Payment)  

---

### New Features

#### R20: Customer Support System
- Web Application → API → Database  
- API (POST /api/support, GET /api/support)  
- New Test Cases  
- ↳ triggered by → R5 (Booking), R6 (Payment), R7 (Cancellation)  

#### R21: Notification System
- API → Web Application  
- Notification Service (notifyUser)  
- New Test Cases  
- ↳ triggered by → R3, R4, R5, R6, R7, R10  

#### R22: Mobile Application Support
- Mobile App → API → Database  
- All `/api/*` endpoints  
- Integration Tests  
- ↳ reuses → R1–R21

---

## Group Requirements

### 1. Authentication & Account
- RG1 = {R1, R2}
- (User Registration + Login)

### 2. Membership System
- RG2 = {R3, R4}
- (Membership + Membership Payment)

### 3. Booking System
- RG3 = {R5, R6, R7, R8}
- (Booking, Payment, Management, Availability)

### 4. Employee Operations
- RG4 = {R9, R10, R11, R12, R13}
- (Employee features)
  
### 5. Manager / Analytics
- RG5 = {R14, R15, R16, R17}
- (Reports + dashboard + employee management)
  
### 6. System & Security
- RG6 = {R18, R19}
- (Security + Banking integration)
  
### 7. New Features
- RG7 = {R20, R21, R22}
- (Support + Notification + Mobile)

---

## Design

- D1 = Web Application
- D2 = API (Node.js / Express)
- D3 = Database (PostgreSQL)
- D4 = Banking API (External)
- D5 = Notification Service (NEW)
- D6 = Customer Support Module (NEW)
- D7 = Mobile Client (NEW)

---

## Code

- C1 = Authentication APIs (/login, /register)
- C2 = Membership APIs
- C3 = Booking APIs
- C4 = Payment APIs
- C5 = Employee APIs
- C6 = Manager APIs
- C7 = Middleware & Security (auth.js, crypto.js)
- C8 = Support & Notification (NEW)

---

## Test

- T1 = Auth Tests (TC-001–007)
- T2 = Membership Tests (TC-010–020)
- T3 = Booking Tests (TC-021–040)
- T4 = Employee Tests (TC-041–053)
- T5 = Manager Tests (TC-054–066)
- T6 = Security Tests (TC-067–068)
- T7 = Banking Test (TC-069)
- T8 = New Feature Tests (Support, Notification, Mobile)

## Full Version
<img width="1920" height="1080" alt="R1 (4)" src="https://github.com/user-attachments/assets/71d61142-0001-41e7-a74a-fda8541b2061" />

## Only the parts affected by the changes 
<img width="1920" height="1080" alt="traceability_effected" src="https://github.com/user-attachments/assets/3ff50a00-2421-48ec-a703-f573833c1b53" />


## SLOs

- SLO0  = Authentication Module (login/register)
- SLO1  = Membership Module
- SLO2  = Booking Module
- SLO3  = Payment Module
- SLO4  = Notification Service (NEW)
- SLO5  = Customer Support Module (NEW)
- SLO6  = Employee Module
- SLO7  = Manager / Reporting Module
- SLO8  = Security & Middleware (auth.js, crypto.js)
- SLO9 = External Integration (Bank API, CCTV)
- SLO10 = Mobile API Adapter (NEW)

<img width="1920" height="1080" alt="R1 (5)" src="https://github.com/user-attachments/assets/0df9059d-cdf7-49b7-8116-018733d83213" />

## Connectivity Matrix
<img width="1920" height="1080" alt="connectivity_matrix" src="https://github.com/user-attachments/assets/36f39f33-2a66-46fa-b697-3abcf0f9ec17" />

