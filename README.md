# SpaceHub — Co-Working Space Web Application

![CI/CD Pipeline](https://github.com/ICT-Mahidol/2025-ITCS383-Emerald/actions/workflows/workflow.yml/badge.svg)

A modern welcome page and account management system for a co-working space, built with **HTML, CSS, JavaScript**, **Node.js/Express**, and **Neon PostgreSQL**.

## Features

- 🎨 **Blue & White Theme** — clean, modern design with glassmorphism and gradient effects
- 📝 **Account Registration** — First Name, Last Name, Email, Phone Number, Address, Password
- 🔐 **Secure Login** — bcrypt password hashing
- 📊 **User Dashboard** — displays member information after login
- 🗄️ **Neon PostgreSQL** — serverless database for persistent user storage
- 🐳 **Docker** — containerized for consistent deployments
- 🚀 **CI/CD** — GitHub Actions pipeline with Render auto-deploy

## Tech Stack

| Layer      | Technology                    |
|------------|-------------------------------|
| Frontend   | HTML, CSS, JavaScript         |
| Backend    | Node.js, Express              |
| Database   | Neon (Serverless PostgreSQL)   |
| Security   | bcryptjs                      |
| Container  | Docker (Alpine)               |
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
├── render.yaml          # Render deployment blueprint
├── package.json
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

   Create a `.env` file in the project root and add your Neon connection string:
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
docker build -t spacehub .

# Run the container
docker run -p 3000:3000 -e DATABASE_URL="your_neon_connection_string" spacehub
```

## API Endpoints

| Method | Endpoint         | Description              |
|--------|------------------|--------------------------|
| POST   | `/api/register`  | Create a new account     |
| POST   | `/api/login`     | Authenticate a user      |

## CI/CD Pipeline

The pipeline is defined in `.github/workflows/workflow.yml` and runs automatically:

| Trigger             | Jobs                                         |
|---------------------|----------------------------------------------|
| Push / PR to `main` | **CI** — Lint check + Docker image build      |
| Push to `main` only | **CD** — Push image to GHCR + deploy to Render |

### Setup Required

1. **GitHub Secrets** (Settings → Secrets → Actions):
   - `RENDER_DEPLOY_HOOK_URL` — from Render dashboard (Settings → Deploy Hook)

2. **Render Dashboard**:
   - Create a **Web Service** → select **Docker** runtime
   - Add `DATABASE_URL` environment variable with your Neon connection string

## Team

**Emerald** — ITCS383, Mahidol University, 2025