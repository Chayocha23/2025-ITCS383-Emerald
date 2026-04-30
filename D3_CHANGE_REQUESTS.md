# D3_CHANGE_REQUESTS.md
 
This document analyzes the features implemented during Phase 2 Part 2 and breaks them down into specific Change Requests (CR). The 8 change requests below are categorized into four types: Corrective, Adaptive, Perfective, and Preventive — covering all three required features.
 
---
 
## Feature Overview
 
| Feature | Description |
| :--- | :--- |
| Feature 1 | Mobile Client App — Native Android application replicating all web functionalities of SpaceHub |
| Feature 2 | Customer Support System — Support form, inbox view, and live chat widget |
| Feature 3 | Notification System — Reminders and alerts for bookings and payments |
 
---
 
## 1. Corrective Maintenance
*Focuses on fixing errors or bugs identified in the existing system.*
 
### CR-01: Fix Duplicate Payment Entries in Payment History
| Attribute | Description |
| :--- | :--- |
| **Associated Feature** | Feature 1 – Mobile Client App |
| **Description** | The Payment History on the Dashboard displays multiple identical "Payment" entries on the same date (4/15/2026) with the same amount (฿15 appearing 5 times consecutively). This indicates the payment creation endpoint lacks idempotency protection, allowing duplicate records to be inserted from repeated submissions or retry logic. This must be fixed before the payment flow is exposed on the Android app to prevent the same bug from propagating to a new platform. |
| **Maintenance Type** | Corrective |
| **Priority** | High |
| **Severity** | Major |
| **Time to Implement** | 0.5 person-day |
| **Verification Method** | Unit and integration tests verifying idempotency of the payment creation endpoint; manual verification of Payment History showing no duplicates after repeated form submissions on both web and Android. |
 
### CR-02: Fix Booking Status Inconsistency for Same Time Slot
| Attribute | Description |
| :--- | :--- |
| **Associated Feature** | Feature 1 – Mobile Client App |
| **Description** | In the My Bookings page, two bookings (BK-13 and BK-8) exist for the same time slot (Thu, Apr 16, 2026, 16:00–18:00) with conflicting statuses PENDING and EXPIRED respectively. The system does not enforce clear status transition rules, resulting in ambiguous states visible to users. The booking status lifecycle (PENDING → CONFIRMED / EXPIRED / CANCELLED) must be explicitly defined and enforced at the backend before the My Bookings screen is replicated on Android. |
| **Maintenance Type** | Corrective |
| **Priority** | High |
| **Severity** | Major |
| **Time to Implement** | 0.5 person-day |
| **Verification Method** | Unit tests for booking status transition rules; integration tests ensuring the correct status is applied based on time and admin confirmation logic; manual verification on My Bookings page showing no conflicting statuses for the same slot. |
 
---
 
## 2. Adaptive Maintenance
*Focuses on adjusting the system to work in a new or changed environment.*
 
### CR-03: Adapt Backend Authentication for Mobile Clients
| Attribute | Description |
| :--- | :--- |
| **Associated Feature** | Feature 1 – Mobile Client App |
| **Description** | The existing backend uses session-based (cookie) authentication designed for browser clients. A native Android app cannot use browser cookies reliably. The backend must be extended to support JWT (JSON Web Token) based authentication so the Android app can authenticate and maintain sessions securely. All existing SpaceHub flows — membership (Per Day/Month/Year), desk booking, payment (Credit Card / Bank Transfer / TrueWallet), My Bookings, Support, and Dashboard — must remain fully functional on the web without disruption. |
| **Maintenance Type** | Adaptive |
| **Priority** | High |
| **Severity** | Critical |
| **Time to Implement** | 1.0 person-day |
| **Verification Method** | Integration tests verifying JWT issuance, usage, and refresh on the Android client; regression tests confirming existing web session-based auth remains unbroken across all pages. |
 
### CR-04: Build Native Android Application
| Attribute | Description |
| :--- | :--- |
| **Associated Feature** | Feature 1 – Mobile Client App |
| **Description** | A new native Android application must be built to replicate all user-facing functionalities of SpaceHub: membership application and renewal (Per Day ฿15 / Per Month ฿299 / Per Year ฿2,999), desk booking with date and time slot selection (e.g., 08:00–10:00, Full Day), payment via Credit Card / Bank Transfer / TrueWallet, My Bookings view with statuses (PENDING, CONFIRMED, EXPIRED) and Cancel Booking, Dashboard with Reminder banner and Membership Status, Customer Support form and Inbox with Admin Response, and Live Chat widget. The app must connect to the adapted backend and be hosted in a separate repository linked from the main README.md. |
| **Maintenance Type** | Adaptive |
| **Priority** | High |
| **Severity** | Critical |
| **Time to Implement** | 3.0 person-days |
| **Verification Method** | Manual functional testing on Android emulator covering all feature flows; SonarQube analysis on the new Android repository; new code test coverage > 90%. |
 
---
 
## 3. Perfective Maintenance
*Focuses on improving performance, maintainability, or user experience.*
 
### CR-05: Alert Banner Visual Enhancement
| Attribute | Description |
| :--- | :--- |
| **Associated Feature** | Feature 3 – Notification System |
| **Description** | The existing Dashboard Reminder banner ("Reminder: You have a reservation scheduled for tomorrow!") is static and easy to overlook. Enhance the Alert Banner with a scrolling Marquee effect and a shaking bell icon animation to better catch the user's attention for upcoming bookings. This improvement applies to the web Dashboard and should be reflected in the Android notification display as well. |
| **Maintenance Type** | Perfective |
| **Priority** | Low |
| **Severity** | Cosmetic |
| **Time to Implement** | 0.5 person-day |
| **Verification Method** | Visual inspection of the Dashboard to verify animation smoothness and that the banner displays correctly for users with confirmed upcoming bookings. |
 
### CR-06: Quick Reply Support Buttons in Chat
| Attribute | Description |
| :--- | :--- |
| **Associated Feature** | Feature 2 – Customer Support System |
| **Description** | The existing Customer Support form only allows freeform text input for the Message Detail field. Implement "Quick Reply" or "Common Inquiry" shortcut buttons in the support form and Live Chat widget (e.g., "Booking Confirmation Error", "Payment Issue", "Cannot Cancel Booking") to allow users to send standard questions with a single click. This reduces friction for users who are unsure how to describe their issue, improving the support experience on both web and Android. |
| **Maintenance Type** | Perfective |
| **Priority** | Medium |
| **Severity** | Minor |
| **Time to Implement** | 1.0 person-day |
| **Verification Method** | Verify that clicking a quick-reply button correctly populates and sends the message with the correct category; UI testing on both web and Android. |
 
---
 
## 4. Preventive Maintenance
*Focuses on improving software to prevent future problems or make it easier to maintain.*
 
### CR-07: Notification Logic Refactoring
| Attribute | Description |
| :--- | :--- |
| **Associated Feature** | Feature 3 – Notification System |
| **Description** | The notification counting, scheduling, and filtering logic (e.g., determining when to show the "reservation scheduled for tomorrow" reminder banner) is currently embedded directly in server.js alongside other backend logic. As the Notification System is expanded to cover payment status alerts and push notifications for Android, this tightly coupled logic risks becoming a source of bugs. Refactor all notification-related logic into a dedicated utility/service module to improve code maintainability and make it easier to extend notifications to new platforms. |
| **Maintenance Type** | Preventive |
| **Priority** | Medium |
| **Severity** | Minor |
| **Time to Implement** | 1.0 person-day |
| **Verification Method** | Run existing unit tests to confirm no regressions in notification functionality; code review verifying the refactored module is cleanly separated from other backend logic. |
 
### CR-08: Global API Error Handling
| Attribute | Description |
| :--- | :--- |
| **Associated Feature** | Feature 2 – Customer Support System |
| **Description** | The existing frontend makes multiple API calls (e.g., POST /api/support, GET /api/support for Inbox, booking fetch) without standardized error handling. If the backend is unavailable or returns an error, the UI may crash silently or show no feedback. As new API endpoints are added for the Customer Support System and the Android app must parse all errors programmatically, implement standardized Try-Catch blocks and a unified error response schema across all API endpoints. User-friendly error messages must be displayed on the frontend when a request fails. |
| **Maintenance Type** | Preventive |
| **Priority** | High |
| **Severity** | Major |
| **Time to Implement** | 1.0 person-day |
| **Verification Method** | Simulate server failures and confirm the UI remains stable and displays appropriate error alerts; API contract tests validating consistent error schema (e.g., `{ "error": { "code": "...", "message": "..." } }`) across all endpoints. |
 
---
 
## Summary Table
 
| CR ID | Associated Feature | Maintenance Type | Priority | Severity | Time to Implement |
| :--- | :--- | :--- | :--- | :--- | :--- |
| CR-01 | Feature 1 – Mobile App | Corrective | High | Major | 0.5 person-day |
| CR-02 | Feature 1 – Mobile App | Corrective | High | Major | 0.5 person-day |
| CR-03 | Feature 1 – Mobile App | Adaptive | High | Critical | 1.0 person-day |
| CR-04 | Feature 1 – Mobile App | Adaptive | High | Critical | 3.0 person-days |
| CR-05 | Feature 3 – Notification | Perfective | Low | Cosmetic | 0.5 person-day |
| CR-06 | Feature 2 – Customer Support | Perfective | Medium | Minor | 1.0 person-day |
| CR-07 | Feature 3 – Notification | Preventive | Medium | Minor | 1.0 person-day |
| CR-08 | Feature 2 – Customer Support | Preventive | High | Major | 1.0 person-day |
 
### CR Type Distribution
 
| Type | Required | Actual | CRs |
| :--- | :--- | :--- | :--- |
| Corrective | 2 | 2 ✅ | CR-01, CR-02 |
| Adaptive | 2 | 2 ✅ | CR-03, CR-04 |
| Perfective | 2 | 2 ✅ | CR-05, CR-06 |
| Preventive | 2 | 2 ✅ | CR-07, CR-08 |
