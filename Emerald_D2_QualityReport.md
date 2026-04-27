# Emerald - D2 Quality Report
# D2: Code Quality: SonarQube Cloud

### Before Changes (Baseline)
<img width="1440" height="812" alt="Screenshot 2569-03-25 at 22 32 17" src="https://github.com/user-attachments/assets/1b71ab4a-baa5-4f9d-a530-49a16ac645bc" />
<img width="1440" height="812" alt="Screenshot 2569-03-25 at 22 32 25" src="https://github.com/user-attachments/assets/34206f44-5c72-4c97-a86e-0b08d7eb80a8" />


#### 1. Quality Gate

| Status |
|--------|
| **Passed** ✅ |

The project successfully passed the Quality Gate, meeting all required conditions set by the Sonar way quality profile.


#### 2. Security

| Metric | Value | Rating |
|--------|-------|--------|
| Open Issues | 0 | **A** |

No security vulnerabilities were detected. The project achieved the highest possible security rating (A).


#### 3. Reliability

| Metric | Value | Rating |
|--------|-------|--------|
| Open Issues | 0 | **A** |

No reliability issues (bugs) were found. The project achieved the highest possible reliability rating (A).


#### 4. Maintainability

| Metric | Value | Rating |
|--------|-------|--------|
| Open Issues | 14 | **A** |

Although 14 maintainability issues were identified, the project still achieved an A rating, indicating that the technical debt ratio remains within acceptable thresholds. All 14 issues are classified as **Code Smells** of **Minor** severity with an estimated remediation effort of **54 minutes** in total.

The issues are concentrated in `public/app.js` and are of the same type:

- **Prefer `globalThis` over `window`** — flagged across multiple lines (L10, L11, L19, L24, L32, and others)
  - Severity: Minor
  - Effort: 2 minutes each
  - Category: Consistency / Portability (ES2020)

These issues suggest that the codebase uses the browser-specific `window` global object in contexts where the more modern and environment-agnostic `globalThis` is preferred.


#### 5. Coverage

| Metric | Value |
|--------|-------|
| Coverage | 74.4% |
| Lines to Cover | 469 |
| Conditions Set | None |

Test coverage was successfully reported to SonarQube. The project covers 74.4% of the codebase, which meets the quality gate coverage threshold.


#### 6. Duplications

| Metric | Value |
|--------|-------|
| Duplication | 0.0% |
| Lines Analyzed | 6,900 |
| Conditions Set | None |

No code duplication was detected across the analyzed codebase.


#### 7. Security Hotspots

| Count |
|-------|
| 2 |

Two security hotspots were identified. These are not confirmed vulnerabilities but areas that require manual review to determine whether they pose an actual security risk.


#### 8. Summary

| Category | Result | Rating |
|----------|--------|--------|
| Quality Gate | Passed | ✅ |
| Security | 0 issues | **A** |
| Reliability | 0 issues | **A** |
| Maintainability | 14 issues (Minor) | **A** |
| Coverage | 74.4% | — |
| Duplications | 0.0% | — |
| Security Hotspots | 2 (review required) | — |

Overall, the handover codebase demonstrates a **good code quality**. It successfully passes the Quality Gate with 74.4% test coverage, zero security vulnerabilities, and zero reliability bugs. The only issues present are 14 minor maintainability code smells, all of which are low effort to resolve. The two security hotspots should be reviewed manually to confirm whether any action is required.

## Introduction
This document contains the Quality Report for the Emerald Co-working Space application for Deliverable 2 (Adaptive Maintenance & Mobile Support).

## 1. Static Analysis / SonarCloud Results
The project's codebase is evaluated via **SonarCloud**.

### SonarCloud Evaluation Metrics
- **Quality Gate:** ✅ **Passed**
- **Security Issues:** 0 (A Rating)
- **Reliability Issues:** 0 (A Rating)
- **Maintainability Issues:** 14 (A Rating)
- **Code Duplication:** 0.0%

The codebase has been updated to include CORS support and a health check endpoint to support mobile application integration.

## 2. Test Coverage Report
Automated testing is implemented using **Jest** and **Supertest**. 

The application currently has **78 passing tests** (increased from 77). 

### Coverage Summary (Backend)

| File | % Statements | % Branch | % Functions | % Lines |
|---|---|---|---|---|
| **All files combined** | **70.13%** | **78.3%** | **76.78%** | **69.43%** |
| `/implementations/server.js` | 67.29% | 76.53% | 72.09% | 66.45% |
| `/implementations/lib/auth.js` | 87.50% | 90.90% | 100.00% | 87.50% |
| `/implementations/lib/crypto.js` | 100.00% | 100.00% | 100.00% | 100.00% |

*Note: Coverage metrics are based on local runs. Some variations may exist compared to CI environments due to database mocking configurations.*

### New Test Cases for D2
| Test ID | Category / Route | Test Case Description | Input Payload / Condition | Expected Result |
| :--- | :--- | :--- | :--- | :--- |
| TC-070 | **Utility Endpoints** | `GET /api/health` | No payload required | `200 OK` Returns status: "ok" and timestamp |

## 3. Vulnerability & Security Analysis
- **Dependency Audit**: `npm audit` was executed and reported **0 vulnerabilities** after applying `npm audit fix`.
- **CORS Support**: Implemented `cors` middleware to allow secure cross-origin requests from the Native Android mobile application.
- **Data Privacy**: Passwords and sensitive user fields remain encrypted/hashed.

## 4. Mobile Support (Adaptive Maintenance)
The backend has been adapted to support mobile clients by:
1.  **Enabling CORS**: Allowing the mobile app to communicate with the API from different origins.
2.  **Standardizing JSON Responses**: Ensuring all API endpoints return consistent JSON payloads.
3.  **Health Check Endpoint**: Added `/api/health` for mobile app connectivity verification.

## 5. Preventive Maintenance (Refactoring)
- **Notification Logic**: Refactored the notification counting and filtering logic from `server.js` into a dedicated utility module (`/implementations/lib/notifications.js`). This improves code maintainability and separates business logic from route handling.

## Conclusion
The Emerald Co-working Space backend is now fully prepared for mobile integration and deployment. All tests pass, and the dependency tree is clean of known vulnerabilities.
