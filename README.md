# SpaceHub — Co-Working Space Web Application

![CI/CD Pipeline](https://github.com/ICT-Mahidol/2025-ITCS383-Emerald/actions/workflows/workflow.yml/badge.svg)

A modern welcome page and account management system for a co-working space, built with **HTML, CSS, JavaScript**, **Node.js/Express**, and **Neon PostgreSQL**. Deployed automatically via **GitHub Actions + Docker + Render**.

## Features

- 🎨 **Blue & White Theme** — modern design with glassmorphism and gradient effects
- 📝 **Account Registration** — First Name, Last Name, Email, Phone Number, Address, Password
- 🔐 **Secure Login** — bcrypt password hashing
- 📊 **User Dashboard** — displays member information after login
- 🗄️ **Neon PostgreSQL** — serverless database for persistent storage
- 🐳 **Docker** — containerized with multi-stage Alpine build
- 🚀 **CI/CD** — GitHub Actions → GHCR → Render auto-deploy

## Tech Stack

| Layer      | Technology                    |
|------------|-------------------------------|
| Frontend   | HTML, CSS, JavaScript         |
| Backend    | Node.js, Express              |
| Database   | Neon (Serverless PostgreSQL)   |
| Security   | bcryptjs                      |
| Container  | Docker (Alpine)               |
| Registry   | GitHub Container Registry     |
| CI/CD      | GitHub Actions                |
| Hosting    | Render                        |

## Project Structure

```
├── .github/workflows/
│   └── workflow.yml     # CI/CD pipeline
├── public/
│   ├── index.html       # Welcome / landing page
│   ├── login.html       # Sign in page
│   ├── register.html    # Create account page
│   ├── dashboard.html   # User dashboard (post-login)
│   ├── style.css        # Blue & white design system
│   └── app.js           # Shared frontend utilities
├── server.js            # Express server + API endpoints
├── Dockerfile           # Multi-stage Docker build
├── .dockerignore        # Docker build exclusions
├── package.json
├── AI_USAGE_LOG.md      # AI transparency log
└── .env                 # Database connection string (not committed)
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- A free [Neon](https://neon.tech) database account
- [Docker](https://www.docker.com/) (optional, for containerized runs)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/ICT-Mahidol/2025-ITCS383-Emerald.git
   cd 2025-ITCS383-Emerald
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure the database**

   Create a `.env` file in the project root:
   ```
   DATABASE_URL=postgresql://user:password@ep-xxxx.region.aws.neon.tech/neondb?sslmode=require
   PORT=3000
   ```

4. **Start the server**
   ```bash
   npm start
   ```

5. **Open in browser** → [http://localhost:3000](http://localhost:3000)

> The `users` table is automatically created on first startup.

### Run with Docker

```bash
# Build the image
docker build -t 2025-itcs383-emerald .

# Run the container
docker run -p 3000:3000 -e DATABASE_URL="your_neon_connection_string" 2025-itcs383-emerald
```

## API Endpoints

| Method | Endpoint         | Description              |
|--------|------------------|--------------------------|
| POST   | `/api/register`  | Create a new account     |
| POST   | `/api/login`     | Authenticate a user      |

## CI/CD Pipeline

The full pipeline is defined in `.github/workflows/workflow.yml`:

```
Push/PR to main → CI (lint + Docker build test)
Merge to main   → CI + CD (build → push to GHCR → deploy to Render)
```

| Trigger             | Jobs                                         |
|---------------------|----------------------------------------------|
| Push / PR to `main` | **CI** — Lint check + Docker image build test |
| Push to `main` only | **CD** — Push image to GHCR + deploy to Render |

### Required Secrets

| Secret                  | Where to get it                              |
|-------------------------|----------------------------------------------|
| `RENDER_DEPLOY_HOOK_URL`| Render dashboard → Settings → Deploy Hook    |

> **Note:** GHCR authentication uses the built-in `GITHUB_TOKEN` — no extra setup needed.

### Render Configuration

- **Runtime:** Docker
- **Auto-Deploy:** Off (controlled by GitHub Actions deploy hook)
- **Environment Variable:** `DATABASE_URL` = your Neon connection string

## Team

**Emerald** — ITCS383, Mahidol University, 2025