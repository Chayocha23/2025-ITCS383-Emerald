# D3_CHANGE_REQUESTS.md

This document analyzes the features implemented during Phase 2 Part 2 and breaks them down into specific Change Requests (CR). As per the requirements, 8 change requests are categorized into four types: Corrective, Adaptive, Perfective, and Preventive.

---

## 1. Corrective Maintenance
*Focuses on fixing errors or bugs identified in the new features.*

### CR-01: Toast Notification Duplication Fix
| Attribute | Description |
| :--- | :--- |
| **Associated Feature** | Notification System |
| **Description** | Fix an issue where toast notifications repeat unnecessarily during data polling intervals even if the booking status remains unchanged. |
| **Maintenance Type** | Corrective |
| **Priority** | High |
| **Severity** | Major |
| **Time to Implement** | 0.5 person-day |
| **Verification Method** | Monitor the Dashboard UI to ensure a notification appears only once per status change. |

### CR-02: Support Chat Text Overflow Fix
| Attribute | Description |
| :--- | :--- |
| **Associated Feature** | Customer Support System |
| **Description** | Resolve a UI bug in the Chat Window where long, continuous strings of text (e.g., long URLs or unspaced words) overflow the message bubble. |
| **Maintenance Type** | Corrective |
| **Priority** | Medium |
| **Severity** | Minor |
| **Time to Implement** | 0.5 person-day |
| **Verification Method** | Test sending long strings in the chat and verify that text wraps correctly within the bubble. |

---

## 2. Adaptive Maintenance
*Focuses on adjusting the system to work in a new or changed environment.*

### CR-03: Mobile App API Compatibility
| Attribute | Description |
| :--- | :--- |
| **Associated Feature** | Support & Notification Backend |
| **Description** | Modify API endpoints and JSON response structures to ensure full data compatibility with the new Native Android platform. |
| **Maintenance Type** | Adaptive |
| **Priority** | High |
| **Severity** | Critical |
| **Time to Implement** | 1.0 person-day |
| **Verification Method** | Perform integration testing to confirm successful data retrieval on the Android Client. |

### CR-04: Tablet-Responsive UI Adjustment
| Attribute | Description |
| :--- | :--- |
| **Associated Feature** | Web Interface |
| **Description** | Update CSS for the Alert Banner and Chat Interface to be fully responsive for tablet-sized viewports and orientations. |
| **Maintenance Type** | Adaptive |
| **Priority** | Medium |
| **Severity** | Minor |
| **Time to Implement** | 0.5 person-day |
| **Verification Method** | Inspect the layout using Browser Developer Tools across various tablet resolutions. |

---

## 3. Perfective Maintenance
*Focuses on improving performance, maintainability, or user experience.*

### CR-05: Alert Banner Visual Enhancement
| Attribute | Description |
| :--- | :--- |
| **Associated Feature** | Notification System |
| **Description** | Enhance the Alert Banner with a scrolling Marquee effect and a shaking bell icon to better catch the user's attention for upcoming bookings. |
| **Maintenance Type** | Perfective |
| **Priority** | Low |
| **Severity** | Cosmetic |
| **Time to Implement** | 0.5 person-day |
| **Verification Method** | Visual inspection of the Dashboard to verify animation smoothness. |

### CR-06: Quick Reply Support Buttons
| Attribute | Description |
| :--- | :--- |
| **Associated Feature** | Customer Support System |
| **Description** | Implement "Quick Reply" or "Common Inquiry" buttons in the chat UI to allow users to send standard questions with a single click. |
| **Maintenance Type** | Perfective |
| **Priority** | Medium |
| **Severity** | Minor |
| **Time to Implement** | 1.0 person-day |
| **Verification Method** | Verify that clicking a quick-reply button correctly populates and sends the message. |

---

## 4. Preventive Maintenance
*Focuses on improving software to prevent future problems or make it easier to maintain.*

### CR-07: Notification Logic Refactoring
| Attribute | Description |
| :--- | :--- |
| **Associated Feature** | Backend Shared Logic |
| **Description** | Refactor the notification counting and filtering logic in `server.js` into a dedicated utility module to improve code maintainability. |
| **Maintenance Type** | Preventive |
| **Priority** | Medium |
| **Severity** | Minor |
| **Time to Implement** | 1.0 person-day |
| **Verification Method** | Run existing unit tests to ensure no regressions in notification functionality. |

### CR-08: Global API Error Handling
| Attribute | Description |
| :--- | :--- |
| **Associated Feature** | Overall Frontend |
| **Description** | Implement standardized Try-Catch blocks and user-friendly error messages for all Support API fetch calls to prevent UI crashes during downtime. |
| **Maintenance Type** | Preventive |
| **Priority** | High |
| **Severity** | Major |
| **Time to Implement** | 1.0 person-day |
| **Verification Method** | Simulate server failures and confirm that the UI remains stable and displays error alerts. |

# D3: Change Request Analysis
 
**Project:** SpaceHub — Co-Working Space Management System (Inherited from Emerald)  
**Maintained by:** Bughair  
**Product Owner:** Emerald  

---
 
## Overview
 
This document analyzes the three features requested for Phase 2 Part 2 and breaks them into formal Change Requests (CRs). 
### System Context (SpaceHub)
 
SpaceHub is a co-working space management platform. The existing web application supports:
 
- **Membership management** — Per Day / Per Month / Per Year plans with Apply/Renew flow
- **Desk booking** — Date selection, number of desks, time slot selection with real-time availability (e.g., 49/50 desks free)
- **Payment processing** — Credit Card, Bank Transfer, TrueWallet
- **My Bookings** — View booking history with statuses: PENDING, CONFIRMED, EXPIRED; Cancel booking
- **Dashboard** — Membership status summary, Payment History, upcoming reservation reminder banner
- **Customer Support** — Submit support requests by issue category (e.g., Booking Confirmation Error)
- **Inbox** — View support conversations and admin responses
- **Live Chat widget** — Real-time contextual chat (booking ID lookup)
- **Notification** — In-app reminder banner ("You have a reservation scheduled for tomorrow!")
### Features Under Maintenance
 
| Feature | Description |
|---------|-------------|
| Feature 1 | Mobile Client App — Native Android app replicating all web functionalities |
| Feature 2 | Customer Support System — Support form, inbox, and live chat |
| Feature 3 | Notification System — Reminders and alerts for bookings and payments |

## Change Requests
 
---
 
### CR-01 — Adapt Backend Authentication for Mobile Clients
 
| Attribute | Description |
|-----------|-------------|
| **Associated Feature** | Feature 1 – Mobile Client App |
| **Description** | The existing backend uses session-based (cookie) authentication designed for browser clients. A native Android app cannot use browser cookies reliably. The backend must be extended to support JWT (JSON Web Token) based authentication so that the Android app can authenticate and maintain sessions securely. The existing web login flow must continue to work without disruption. |
| **Maintenance Type** | Adaptive |
| **Priority** | High |
| **Severity** | Critical |
| **Time to Implement** | 1.5 person-weeks |
| **Verification Method** | Integration tests verifying JWT issuance and refresh on mobile; regression tests confirming existing web session auth is unbroken |
 
---
 
### CR-02 — Build Native Android Application
 
| Attribute | Description |
|-----------|-------------|
| **Associated Feature** | Feature 1 – Mobile Client App |
| **Description** | A new native Android application must be built to replicate all user-facing functionalities of SpaceHub: membership application and renewal (Per Day/Month/Year), desk booking with date and time slot selection, payment (Credit Card / Bank Transfer / TrueWallet), My Bookings view with status and cancel, Dashboard with membership status and payment history, Customer Support form and Inbox, and notification reminders. The app must connect to the existing adapted backend and be hosted in a separate repository linked from the main README.md. |
| **Maintenance Type** | Perfective |
| **Priority** | High |
| **Severity** | Critical |
| **Time to Implement** | 3 person-weeks |
| **Verification Method** | Manual functional testing on Android emulator covering all feature flows; SonarQube analysis on the new repository; new code test coverage > 90% |
 
---
 
### CR-03 — Implement Customer Support Request Form on Android
 
| Attribute | Description |
|-----------|-------------|
| **Associated Feature** | Feature 2 – Customer Support System |
| **Description** | The existing Customer Support page (support.html) allows users to select an Issue Category (e.g., Booking Confirmation Error) and submit a message, receiving a "Request sent successfully!" confirmation. This full submission flow must be implemented in the Android app with the same issue categories and confirmation feedback. The backend support ticket API (POST /api/support) must handle concurrent submissions without data loss. |
| **Maintenance Type** | Perfective |
| **Priority** | High |
| **Severity** | Major |
| **Time to Implement** | 1 person-week |
| **Verification Method** | Functional testing of form submission on web and Android; API tests confirming ticket is stored and returns correct success response |
 
---
 
### CR-04 — Implement Support Inbox with Admin Response View on Android
 
| Attribute | Description |
|-----------|-------------|
| **Associated Feature** | Feature 2 – Customer Support System |
| **Description** | The existing Inbox page (inbox.html) displays support conversations, issue category tags, timestamps, user questions, and admin replies (e.g., "Admin Response: Receive Test jaa"). This view must be replicated in the Android app. The "Waiting for admin response..." pending state and received admin responses must both render correctly. Users must also be able to delete support tickets from the inbox. |
| **Maintenance Type** | Perfective |
| **Priority** | Medium |
| **Severity** | Major |
| **Time to Implement** | 0.5 person-weeks |
| **Verification Method** | UI testing verifying inbox renders correctly with and without admin response; API integration tests for fetch (GET /api/support) and delete ticket endpoints |
 
---
 
### CR-05 — Implement Push Notification for Upcoming Reservation Reminder
 
| Attribute | Description |
|-----------|-------------|
| **Associated Feature** | Feature 3 – Notification System |
| **Description** | The existing web Dashboard displays a reminder banner ("Reminder: You have a reservation scheduled for tomorrow!") when the user has an upcoming confirmed booking. This must be extended to the Android app as a Firebase Cloud Messaging (FCM) push notification, alerting users even when the app is in the background or closed. The backend must store FCM device tokens per user and trigger push messages 24 hours before each confirmed reservation. |
| **Maintenance Type** | Adaptive |
| **Priority** | High |
| **Severity** | Major |
| **Time to Implement** | 1.5 person-weeks |
| **Verification Method** | Manual testing on Android emulator/device for foreground and background notification delivery; unit tests for FCM dispatch logic and reminder scheduling service |
 
---
 
### CR-06 — Add Payment Status Notification After Pay Now
 
| Attribute | Description |
|-----------|-------------|
| **Associated Feature** | Feature 3 – Notification System |
| **Description** | Users currently receive no automatic notification after completing a payment. After the Pay Now flow (Credit Card / Bank Transfer / TrueWallet) for either a booking or membership subscription, the system must trigger an in-app notification on web and a push notification on Android confirming the payment result (success or failure). This covers both "Payment" and "Subscription" entries visible in the Payment History section of the Dashboard. |
| **Maintenance Type** | Perfective |
| **Priority** | High |
| **Severity** | Major |
| **Time to Implement** | 1 person-week |
| **Verification Method** | Integration tests for payment success and failure scenarios; end-to-end test confirming notification is triggered and received on web and Android |
 
---
 
### CR-07 — Fix Duplicate Payment Entries in Payment History
 
| Attribute | Description |
|-----------|-------------|
| **Associated Feature** | Feature 1 – Mobile Client App / Feature 3 – Notification System |
| **Description** | The existing Payment History on the Dashboard shows multiple identical "Payment" entries on the same date (4/15/2026) with the same amount (฿15 appearing 5 times consecutively). This indicates that the payment creation endpoint lacks idempotency protection, allowing duplicate records to be created from repeated submissions or retry logic without a unique transaction key. This must be fixed before the payment flow is exposed on Android. |
| **Maintenance Type** | Corrective |
| **Priority** | High |
| **Severity** | Major |
| **Time to Implement** | 1 person-week |
| **Verification Method** | Unit and integration tests verifying idempotency of the payment creation endpoint; manual verification of Payment History showing no duplicates after repeated form submissions |
 
---
 
### CR-08 — Fix Booking Status Inconsistency for Same Time Slot
 
| Attribute | Description |
|-----------|-------------|
| **Associated Feature** | Feature 1 – Mobile Client App |
| **Description** | In the My Bookings page, two bookings (BK-13 and BK-8) exist for the same time slot (Thu, Apr 16, 2026, 16:00–18:00) with statuses PENDING and EXPIRED respectively. The system does not enforce clear status transition rules, resulting in ambiguous states. The booking status lifecycle (PENDING → CONFIRMED / EXPIRED / CANCELLED) must be explicitly defined and enforced at the backend to prevent conflicting or unclear statuses from appearing for overlapping time slots. |
| **Maintenance Type** | Corrective |
| **Priority** | High |
| **Severity** | Major |
| **Time to Implement** | 1 person-week |
| **Verification Method** | Unit tests for booking status transition rules; integration tests ensuring correct status is applied based on time and admin confirmation logic |
 
---
 
### CR-09 — Refactor Payment Module into a Platform-Agnostic Service Layer
 
| Attribute | Description |
|-----------|-------------|
| **Associated Feature** | Feature 1 – Mobile Client App |
| **Description** | The payment logic (handling Credit Card, Bank Transfer, TrueWallet) is currently embedded in web-facing controllers, tightly coupling it to the frontend layer. As payments must now be supported on both web and Android, the logic must be extracted into a dedicated payment service layer with a clean API interface. This prevents duplicated payment logic across platforms and reduces the risk of diverging payment bugs being introduced independently on each client. |
| **Maintenance Type** | Preventive |
| **Priority** | Medium |
| **Severity** | Moderate |
| **Time to Implement** | 1 person-week |
| **Verification Method** | Code review confirming separation of concerns; SonarQube code smell and complexity metrics; unit tests for the extracted payment service |
 
---
 
### CR-10 — Standardize API Error Response Schema Across All Endpoints
 
| Attribute | Description |
|-----------|-------------|
| **Associated Feature** | Feature 2 – Customer Support System / Feature 3 – Notification System |
| **Description** | As new endpoints are added for support tickets (POST/GET /api/support), inbox management, FCM token registration, and notification dispatch, the backend API risks accumulating inconsistent error response formats. This is especially problematic for the Android app, which must parse all errors programmatically. A unified error response schema (e.g., `{ "error": { "code": "...", "message": "..." } }`) must be defined and enforced across all API endpoints before new features are deployed. |
| **Maintenance Type** | Preventive |
| **Priority** | Medium |
| **Severity** | Moderate |
| **Time to Implement** | 0.5 person-weeks |
| **Verification Method** | API contract tests validating consistent error schema across all endpoints; middleware or linting rule to enforce the schema on new routes |
 
---
 
## Summary Table
 
| CR ID | Associated Feature | Maintenance Type | Priority | Severity | Time to Implement 
|-------|--------------------|-----------------|----------|----------|-------------------|
| CR-01 | Feature 1 – Mobile App | Adaptive | High | Critical | 1.5 person-weeks |
| CR-02 | Feature 1 – Mobile App | Perfective | High | Critical | 3 person-weeks | 
| CR-03 | Feature 2 – Customer Support | Perfective | High | Major | 1 person-week | 
| CR-04 | Feature 2 – Customer Support | Perfective | Medium | Major | 0.5 person-weeks | 
| CR-05 | Feature 3 – Notification | Adaptive | High | Major | 1.5 person-weeks | 
| CR-06 | Feature 3 – Notification | Perfective | High | Major | 1 person-week | 
| CR-07 | Feature 1 / Feature 3 | Corrective | High | Major | 1 person-week | 
| CR-08 | Feature 1 – Mobile App | Corrective | High | Major | 1 person-week | 
| CR-09 | Feature 1 – Mobile App | Preventive | Medium | Moderate | 1 person-week | 
| CR-10 | Feature 2 & Feature 3 | Preventive | Medium | Moderate | 0.5 person-weeks | 
 
### CR Type Distribution
 
| Type | Required | Actual | CRs |
|------|----------|--------|-----|
| Corrective | 2 | 2 ✅ | CR-07, CR-08 |
| Adaptive | 2 | 2 ✅ | CR-01, CR-05 |
| Perfective | 2 | 4 ✅ | CR-02, CR-03, CR-04, CR-06 |
| Preventive | 2 | 2 ✅ | CR-09, CR-10 |
 
