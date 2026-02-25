# SpaceHub — Co-Working Space Web Application

A modern welcome page and account management system for a co-working space, built with **HTML, CSS, JavaScript**, **Node.js/Express**, and **Neon PostgreSQL**.

## Features

- 🎨 **Blue & White Theme** — clean, modern design with glassmorphism and gradient effects
- 📝 **Account Registration** — First Name, Last Name, Email, Phone Number, Address, Password
- 🔐 **Secure Login** — bcrypt password hashing
- 📊 **User Dashboard** — displays member information after login
- 🗄️ **Neon PostgreSQL** — serverless database for persistent user storage

## Tech Stack

| Layer    | Technology                    |
|----------|-------------------------------|
| Frontend | HTML, CSS, JavaScript         |
| Backend  | Node.js, Express              |
| Database | Neon (Serverless PostgreSQL)   |
| Security | bcryptjs                      |

## Project Structure

```
├── server.js            # Express server + API endpoints
├── package.json
├── .env                 # Database connection string
└── public/
    ├── index.html       # Welcome / landing page
    ├── login.html       # Sign in page
    ├── register.html    # Create account page
    ├── dashboard.html   # User dashboard (post-login)
    ├── style.css        # Blue & white design system
    └── app.js           # Shared frontend utilities
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- A free [Neon](https://neon.tech) database account

### Installation

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

   Create a `.env` file in the project root (or edit the existing one) and add your Neon connection string:
   ```
   DATABASE_URL=postgresql://user:password@ep-xxxx.region.aws.neon.tech/neondb?sslmode=require
   PORT=3000
   ```

4. **Start the server**
   ```bash
   npm start
   ```

5. **Open in browser**

   Visit [http://localhost:3000](http://localhost:3000)

> The `users` table is automatically created on first startup.

## API Endpoints

| Method | Endpoint         | Description              |
|--------|------------------|--------------------------|
| POST   | `/api/register`  | Create a new account     |
| POST   | `/api/login`     | Authenticate a user      |

## Team

**Emerald** — ITCS383, Mahidol University, 2025