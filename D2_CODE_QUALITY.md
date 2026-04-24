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
