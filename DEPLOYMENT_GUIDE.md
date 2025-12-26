# AFDEI Website Deployment Guide

## Architecture
- **Frontend**: Vercel (React/Vite)
- **Backend**: Render.com (Node.js/Express + SQLite)

---

## Step 1: Push to GitHub

First, push your project to GitHub:

```bash
# In the project root folder
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/afdei-website.git
git push -u origin main
```

---

## Step 2: Deploy Backend to Render.com

1. Go to [render.com](https://render.com) and sign up/login
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `afdei-backend`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npx prisma generate && npx prisma db push`
   - **Start Command**: `npm start`
5. Add Environment Variables:
   - `JWT_SECRET` = (click "Generate" for a random value)
   - `NODE_ENV` = `production`
6. Click **"Create Web Service"**
7. Wait for deployment (~5 minutes)
8. **Copy your backend URL** (e.g., `https://afdei-backend.onrender.com`)

---

## Step 3: Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) and sign up/login with GitHub
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `.` (leave empty/root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add Environment Variable:
   - `VITE_API_URL` = `https://your-backend-url.onrender.com` (from Step 2)
6. Click **"Deploy"**

---

## Step 4: Update Backend CORS (Optional)

After frontend is deployed, update Render environment variables:
- `FRONTEND_URL` = `https://your-app.vercel.app`

---

## Your Live URLs

After deployment:
- **Website**: `https://your-app.vercel.app`
- **CMS Admin**: `https://your-app.vercel.app/admin/login`
- **Backend API**: `https://afdei-backend.onrender.com`

### Login Credentials
- **Email**: `admin@afdei.org`
- **Password**: `admin123`

---

## Notes

- Render free tier may sleep after 15 minutes of inactivity (first request takes ~30 seconds to wake up)
- Vercel free tier has generous limits for personal projects
- Both services auto-deploy when you push to GitHub


