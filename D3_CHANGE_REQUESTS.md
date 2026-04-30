# D3: Change Request Analysis

This document analyzes the maintenance activities for Phase 2 Part 2. All 8 Change Requests (CR) are categorized and mapped to the **Software Lifecycle Objects (SLO)** and **Traceability Nodes** defined in the D4 Impact Analysis report to ensure architectural consistency.

---

## Feature Overview

| Feature | Description |
| :--- | :--- |
| **Feature 1** | Mobile Client App — Native Android application replicating all web functionalities of SpaceHub |
| **Feature 2** | Customer Support System — Support form, inbox view, and live chat widget |
| **Feature 3** | Notification System — Reminders and alerts for bookings and payments |

---

## 📊 Summary Table (Mapped to D4 SLOs)

| CR ID | Maintenance Type | Affected SLOs (from D4) | Priority | Severity | Current State | Time to Implement |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **CR-01** | Corrective | **SLO3, SLO9** | High | Critical | **Closed** | 0.5 person-day |
| **CR-02** | Corrective | **SLO2** | High | Major | **Closed** | 0.5 person-day |
| **CR-03** | Adaptive | **SLO0, SLO8, SLO10** | High | Critical | **Closed** | 1.0 person-day |
| **CR-04** | Adaptive | **SLO10, D7** | High | Critical | **Closed** | 3.0 person-days |
| **CR-05** | Perfective | **SLO4** | Low | Cosmetic | **Closed** | 0.5 person-day |
| **CR-06** | Perfective | **SLO5** | Medium | Minor | **Closed** | **1.5 person-days** |
| **CR-07** | Preventive | **SLO4** | Medium | Minor | **Closed** | 1.0 person-day |
| **CR-08** | Preventive | **SLO8, SLO5, SLO4** | High | Major | **Closed** | **1.5 person-days** |

---

## 📑 Detailed Change Request Tables

### 1. Corrective Maintenance
*Focuses on fixing errors or bugs identified in the existing system.*

#### [CR-01] Fix Duplicate Payment Entries
| Attribute | Description |
| :--- | :--- |
| **Associated Feature** | Feature 1 – Mobile Client App |
| **Description** | Fix the payment creation endpoint to prevent duplicate records (idempotency protection) as observed in the Payment History. |
| **Affected SLOs** | **SLO3** (Payment Module), **SLO9** (External Integration) |
| **Maintenance Type** | Corrective |
| **Priority** | High |
| **Severity** | Critical |
| **Current State** | **Closed** (Verified via D2 Quality Check) |
| **Time to Implement** | 0.5 person-day |
| **Verification Method** | Unit and integration tests verifying idempotency; database audit. |

#### [CR-02] Fix Booking Status Inconsistency
| Attribute | Description |
| :--- | :--- |
| **Associated Feature** | Feature 1 – Mobile Client App |
| **Description** | Explicitly define and enforce booking status lifecycle rules to resolve conflicting states (PENDING vs EXPIRED) in the same slot. |
| **Affected SLOs** | **SLO2** (Booking Module) |
| **Maintenance Type** | Corrective |
| **Priority** | High |
| **Severity** | Major |
| **Current State** | **Closed** |
| **Time to Implement** | 0.5 person-day |
| **Verification Method** | Integration tests for status transition logic. |

---

### 2. Adaptive Maintenance
*Focuses on adjusting the system to work in a new or changed environment.*

#### [CR-03] Adapt Backend Authentication for Mobile Clients
| Attribute | Description |
| :--- | :--- |
| **Associated Feature** | Feature 1 – Mobile Client App |
| **Description** | Extend the backend to support JWT-based authentication to accommodate native Android client requirements. |
| **Affected SLOs** | **SLO0** (Authentication), **SLO8** (Security Middleware), **SLO10** (Mobile API Adapter) |
| **Maintenance Type** | Adaptive |
| **Priority** | High |
| **Severity** | Critical |
| **Current State** | **Closed** |
| **Time to Implement** | 1.0 person-day |
| **Verification Method** | Regression tests confirming web session-based auth remains functional alongside JWT. |

#### [CR-04] Build Native Android Application
| Attribute | Description |
| :--- | :--- |
| **Associated Feature** | Feature 1 – Mobile Client App |
| **Description** | Implement a native Android application replicating all core SpaceHub user-facing functionalities. |
| **Affected SLOs** | **SLO10** (Mobile API Adapter), **D7** (Mobile Client) |
| **Maintenance Type** | Adaptive |
| **Priority** | High |
| **Severity** | Critical |
| **Current State** | **Closed** |
| **Time to Implement** | 3.0 person-days |
| **Verification Method** | SonarQube analysis on the new repository; manual functional testing. |

---

### 3. Perfective Maintenance
*Focuses on improving performance, maintainability, or user experience.*

#### [CR-05] Alert Banner Visual Enhancement
| Attribute | Description |
| :--- | :--- |
| **Associated Feature** | Feature 3 – Notification System |
| **Description** | Enhance the static Reminder banner with a Marquee effect and animated bell icon for better visibility. |
| **Affected SLOs** | **SLO4** (Notification Service) |
| **Maintenance Type** | Perfective |
| **Priority** | Low |
| **Severity** | Cosmetic |
| **Current State** | **Closed** |
| **Time to Implement** | 0.5 person-day |
| **Verification Method** | Visual inspection of Dashboard UI smoothness. |

#### [CR-06] Quick Reply Support Buttons in Chat
| Attribute | Description |
| :--- | :--- |
| **Associated Feature** | Feature 2 – Customer Support System |
| **Description** | Implement predefined inquiry shortcut buttons to reduce user friction in the support workflow. |
| **Affected SLOs** | **SLO5** (Customer Support Module) |
| **Maintenance Type** | Perfective |
| **Priority** | Medium |
| **Severity** | Minor |
| **Current State** | **Closed** |
| **Time to Implement** | **1.5 person-days** (Reflecting the high integration complexity identified in D4) |
| **Verification Method** | User Acceptance Testing (UAT) on both web and Android platforms. |

---

### 4. Preventive Maintenance
*Focuses on improving software to prevent future problems.*

#### [CR-07] Notification Logic Refactoring
| Attribute | Description |
| :--- | :--- |
| **Associated Feature** | Feature 3 – Notification System |
| **Description** | Refactor notification logic from server.js into a dedicated utility module to reduce tight coupling. |
| **Affected SLOs** | **SLO4** (Notification Service) |
| **Maintenance Type** | Preventive |
| **Priority** | Medium |
| **Severity** | Minor |
| **Current State** | **Closed** |
| **Time to Implement** | 1.0 person-day |
| **Verification Method** | Unit tests to confirm no regressions in existing notification triggers. |

#### [CR-08] Global API Error Handling
| Attribute | Description |
| :--- | :--- |
| **Associated Feature** | Feature 2 – Customer Support System |
| **Description** | Standardize the error response schema and implement unified Try-Catch blocks across all modules. |
| **Affected SLOs** | **SLO8** (Security/Middleware), **SLO5, SLO4, SLO10** |
| **Maintenance Type** | Preventive |
| **Priority** | High |
| **Severity** | Major |
| **Current State** | **Closed** |
| **Time to Implement** | **1.5 person-days** (Due to the cross-system impact across multiple modules) |
| **Verification Method** | Simulating server failures to confirm standardized JSON error responses. |

---

### CR Type Distribution

| Type | Required | Actual | CRs |
| :--- | :--- | :--- | :--- |
| Corrective | 2 | 2 ✅ | CR-01, CR-02 |
| Adaptive | 2 | 2 ✅ | CR-03, CR-04 |
| Perfective | 2 | 2 ✅ | CR-05, CR-06 |
| Preventive | 2 | 2 ✅ | CR-07, CR-08 |
