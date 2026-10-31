# 🚀 Full-Stack Form App (Neon + Render + Cloudflare + GitHub)

A production-ready full-stack application built and deployed across multiple cloud providers to demonstrate seamless automated infrastructure provisioning, continuous deployment, and end-to-end integration.

---

## 🌐 Live Deployments

| Component | Platform | Live URL / Identifier | Status |
| :--- | :--- | :--- | :--- |
| **Frontend UI** | Cloudflare | [simple-form-frontend.anandmanoj2003.workers.dev](https://simple-form-frontend.anandmanoj2003.workers.dev) | 🟢 Live |
| **Backend API** | Render | [simple-form-backend-lxct.onrender.com](https://simple-form-backend-lxct.onrender.com) | 🟢 Live |
| **Database** | Neon PostgreSQL | Project: `shy-bread-69409757` (Branch: `production`) | 🟢 Connected |
| **Source Code** | GitHub | [github.com/anandmanoj/simple-form-deploy](https://github.com/anandmanoj/simple-form-deploy) | 🟢 Active |

---

## 🏗️ Architecture & Data Flow

```
[ User Browser ]
       │
       ▼  (HTTPS)
[ Cloudflare Workers / Pages Assets ]
  - React 19 + Vite Frontend
  - Single Page Application routing
       │
       ▼  (REST API: POST & GET /api/submissions)
[ Render Web Service ]
  - Node.js + Express REST API
  - Auto-scaling & CORS configured
       │
       ▼  (Postgres Connection Pooling with SSL)
[ Neon Serverless PostgreSQL ]
  - Project: shy-bread-69409757
  - Branch: production
  - Table: submissions
```

---

## 🛠️ What Was Done

### 1. Database Provisioning & Wiring (Neon)
* Installed the global Neon CLI (`neon@latest`) and linked the project using:
  ```bash
  neon init -y --org-id org-plain-band-71196274 --project-id shy-bread-69409757 --branch production --services postgres
  neon deploy
  ```
* Pulled connection strings (`DATABASE_URL` with connection pooler and `DATABASE_URL_UNPOOLED`) into `.env.local`.
* Configured the Node.js database layer (`backend/db.js`) using `node-postgres` (`pg`) following `neon-postgres` best practices.
* Implemented automatic schema migration on boot to self-create the `submissions` table:
  ```sql
  CREATE TABLE IF NOT EXISTS submissions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  ```

### 2. Backend API Development & Deployment (Render)
* Created a lightweight Node.js Express server (`backend/server.js`) with:
  * `GET /health` — Service health check.
  * `POST /api/submissions` — Validates email and required fields, inserts data into Neon.
  * `GET /api/submissions` — Retrieves the latest 50 submissions.
  * Universal CORS enabled for Cloudflare and local development.
* Automated service creation and deployment to Render using the Render REST API:
  * Linked to GitHub repository: `anandmanoj/simple-form-deploy`.
  * Injected `DATABASE_URL` and `NODE_ENV=production` environment variables.
  * Configured build and start commands (`npm install`, `npm start`).

### 3. Frontend Development & Deployment (Cloudflare)
* Built a modern, dark-themed responsive single-page application (`frontend/src/App.jsx` & `frontend/src/App.css`):
  * Input validation, real-time submission alerts, and error feedback.
  * Live feed displaying recent entries stored in Neon with a manual refresh button.
* Configured Vite production builds pointing to the live Render backend URL (`VITE_API_URL`).
* Deployed directly to Cloudflare using Wrangler:
  * Configured `wrangler.jsonc` with native SPA routing (`assets.not_found_handling = "single-page-application"`).
  * Resolved routing conflicts by eliminating legacy `_redirects` in favor of Cloudflare Workers assets.

---

## 📡 API Reference

### 1. Health Check
* **Endpoint:** `GET /health`
* **Response:**
  ```json
  {
    "status": "ok",
    "timestamp": "2026-10-31T20:19:43.577Z"
  }
  ```

### 2. Create Submission
* **Endpoint:** `POST /api/submissions`
* **Body:**
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "message": "Testing multi-cloud deployment!"
  }
  ```
* **Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "Submission successfully recorded!",
    "data": {
      "id": 1,
      "name": "Jane Doe",
      "email": "jane@example.com",
      "message": "Testing multi-cloud deployment!",
      "created_at": "2026-10-31T20:15:15.159Z"
    }
  }
  ```

### 3. Get Submissions
* **Endpoint:** `GET /api/submissions`
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "count": 1,
    "data": [
      {
        "id": 1,
        "name": "Jane Doe",
        "email": "jane@example.com",
        "message": "Testing multi-cloud deployment!",
        "created_at": "2026-10-31T20:15:15.159Z"
      }
    ]
  }
  ```

---

## 💻 Local Development Setup

### 1. Clone the Repository
```bash
git clone https://github.com/anandmanoj/simple-form-deploy.git
cd simple-form-deploy
```

### 2. Run Backend
```bash
cd backend
npm install
# Set your DATABASE_URL in backend/.env
npm start
```

### 3. Run Frontend
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.
