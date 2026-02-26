# AI Usage Log

**Project:** SpaceHub — Co-Working Space Web Application  
**Team:** Emerald — ITCS383, Mahidol University, 2025  
**AI Tool Used:** Gemini (via Antigravity coding assistant)

---

## 1. Welcome Page & Design System

**Prompt:**  
> "Create simple welcome page web for co-working space. The system user interface shall use a blue and white theme, with HTML CSS JavaScript and login and create account. Required information: First Name, Last Name, Address, Phone Number."

**What was generated:**
- `public/index.html` — Landing page with hero section, features grid, stats bar, footer
- `public/login.html` — Sign-in form (email + password)
- `public/register.html` — Registration form with all required fields
- `public/dashboard.html` — Post-login user dashboard
- `public/style.css` — Full CSS design system (blue `#1a73e8` / white theme, Inter font, glassmorphism, gradients)
- `public/app.js` — Shared toast notification utility

**Accepted:** All generated pages and styling were accepted as-is. The blue/white theme, responsive layout, and form structure matched requirements.

**Rejected:** Nothing rejected at this stage.

**Verification:**
- Opened each HTML file directly in the browser (`file://` protocol) and visually inspected the layout, colours, and responsiveness
- Confirmed all required registration fields (First Name, Last Name, Address, Phone Number) are present on `register.html`
- Verified navigation links between pages work correctly

---

## 2. Backend & Neon Database Integration

**Prompt:**  
> "Use Neon for database."

**What was generated:**
- `server.js` — Express server with `@neondatabase/serverless` driver, `POST /api/register` and `POST /api/login` endpoints, bcrypt password hashing, auto-creates `users` table on startup
- `package.json` — Dependencies: express, @neondatabase/serverless, bcryptjs, dotenv
- `.env` — Placeholder for `DATABASE_URL`

**Accepted:** Server architecture, API route design, bcrypt hashing, and auto-table creation were all accepted.

**Rejected:** Initially the plan used `localStorage` instead of a database. This was rejected by the team in favour of Neon PostgreSQL for persistent server-side storage.

**Verification:**
- Ran `npm install` — 84 packages installed, 0 vulnerabilities
- Updated `.env` with a real Neon connection string obtained from [neon.tech](https://neon.tech)
- Ran `npm start` — confirmed output:
  ```
  ✅ Database initialized — users table ready
  🚀 Server running at http://localhost:3000
  ```
- Tested registration via the form in the browser → verified new user row appeared in Neon dashboard
- Tested login with registered credentials → verified dashboard displayed correct user info
- Tested login with wrong password → verified `401 Invalid email or password` error

---

## 3. CI/CD Pipeline (GitHub Actions + Docker + Render)

**Prompt:**  
> "Make it Full CI/CD Pipeline using GitHub Actions + Docker + Render."  
> Follow-up: ".github/workflows folder. Then, add a file called workflow.yml"

**What was generated:**
- `.github/workflows/workflow.yml` — GitHub Actions CI/CD pipeline with two jobs:
  - **CI** (every push/PR): checkout → Node.js setup → `npm ci` → `npm run lint` → Docker build test
  - **CD** (push to `main` only): login to GHCR → build & push Docker image → trigger Render deploy hook
- `Dockerfile` — Multi-stage Alpine build with non-root user and health check
- `.dockerignore` — Excludes node_modules, .env, .git from build context

**Accepted:**
- `workflow.yml` — accepted as the single CI/CD pipeline file
- `Dockerfile` — accepted with multi-stage build, Alpine base, and non-root user
- `.dockerignore` — accepted
- Added `lint` and `test` scripts to `package.json`
- Updated `README.md` with CI/CD badge, Docker instructions, and pipeline documentation

**Rejected:**
- `render.yaml` was initially generated as a separate Render blueprint file. It was removed because the workflow already handles Render deployment via a deploy hook, making it redundant.

**Verification:**
- Ran `npm run lint` — passed with no syntax errors in `server.js`
- Reviewed `Dockerfile` manually — confirmed it copies only necessary files (`server.js`, `public/`, `package*.json`), uses non-root user, and has a health check
- Reviewed `workflow.yml` manually — confirmed correct trigger conditions (`push`/`pull_request` to `main`), proper `if` guard on deploy job, and GHCR login uses built-in `GITHUB_TOKEN`
- Verified `.dockerignore` excludes `.env` to prevent secrets from leaking into the image

---

## Summary Table

| Change                      | AI-Generated | Accepted | Rejected / Modified        | Verification Method                              |
|-----------------------------|:------------:|:--------:|----------------------------|--------------------------------------------------|
| Welcome page + CSS theme    | ✅           | ✅       | —                          | Browser visual inspection, field checklist        |
| Login & Register pages      | ✅           | ✅       | —                          | Browser testing, form submission                  |
| Express + Neon backend      | ✅           | ✅       | localStorage → Neon DB     | `npm start`, API testing, Neon dashboard check    |
| Dockerfile                  | ✅           | ✅       | —                          | Manual code review, verified non-root & healthcheck |
| GitHub Actions workflow.yml | ✅           | ✅       | —                          | `npm run lint`, manual YAML review                |
| render.yaml                 | ✅           | ❌       | Removed (redundant)        | N/A                                               |
| README.md                   | ✅           | ✅       | —                          | Manual review of content accuracy                 |
