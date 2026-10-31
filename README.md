# Full-Stack Form App (Neon + Render + Cloudflare)

A clean, full-stack contact and user information collection website designed to test multi-cloud deployment:
- **Database:** PostgreSQL on [Neon.tech](https://neon.tech)
- **Backend:** Node.js / Express Web Service on [Render](https://render.com)
- **Frontend:** React + Vite on [Cloudflare Pages](https://pages.cloudflare.com)

---

## 🏗️ Architecture

```
[ User Browser ]
       │
       ▼
[ Cloudflare Pages (Frontend UI) ]
       │  (REST API calls: POST /api/submissions)
       ▼
[ Render Web Service (Express Backend) ]
       │  (PostgreSQL Pool / SSL)
       ▼
[ Neon Serverless PostgreSQL ]
```

---

## 🚀 Step-by-Step Deployment Guide

### 1. Database (Neon PostgreSQL)
1. Go to [console.neon.tech](https://console.neon.tech/) and create a project (or select an existing one).
2. Copy your **Connection string** (e.g. `postgresql://alex:AbCdEf123@ep-sample-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require`).
3. The backend will **automatically create the `submissions` table** on its first startup. No manual SQL needed!

---

### 2. Backend (Render)
1. Go to [dashboard.render.com](https://dashboard.render.com/).
2. Click **New +** > **Web Service**.
3. Connect your GitHub repository: `https://github.com/anandmanoj/simple-form-deploy`.
4. Configure service settings:
   - **Root Directory:** `backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Under **Environment Variables**, add:
   - `DATABASE_URL` = *(Paste your Neon connection string)*
   - `NODE_ENV` = `production`
6. Click **Deploy Web Service**.
7. Once deployed, copy your Render backend URL (e.g., `https://simple-form-backend.onrender.com`).

---

### 3. Frontend (Cloudflare Pages)
1. Go to [dash.cloudflare.com](https://dash.cloudflare.com/) > **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
2. Select your repository: `simple-form-deploy`.
3. Set Build Settings:
   - **Framework preset:** `Vite`
   - **Root directory:** `frontend`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. Under **Environment variables**, add:
   - `VITE_API_URL` = `https://your-render-service.onrender.com` (Your Render backend URL from Step 2)
5. Click **Save and Deploy**.

---

## 💻 Local Development

### Backend
```bash
cd backend
npm install
# Create .env with DATABASE_URL
npm start
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```
