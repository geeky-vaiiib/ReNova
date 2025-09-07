# ReNova Production Deployment Guide

## Prerequisites
- GitHub account with ReNova repository
- Vercel account
- Render account (or Railway)
- PostgreSQL database (Render/Railway/Supabase)

## Step 1: Database Setup (PostgreSQL)

### Option A: Render PostgreSQL
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New" → "PostgreSQL"
3. Configure:
   - Name: `renova-db`
   - Database: `renova`
   - User: `renova_user`
   - Plan: Free
4. Copy the connection string (External Database URL)

### Option B: Railway PostgreSQL
1. Go to [Railway Dashboard](https://railway.app)
2. Create new project → "PostgreSQL"
3. Copy the connection string from Variables tab

## Step 2: Backend Deployment (Render)

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - Name: `renova-api`
   - Environment: `Node`
   - Build Command: `cd server && npm install`
   - Start Command: `cd server && npm start`
   - Auto-Deploy: Yes

5. Add Environment Variables:
   ```
   NODE_ENV=production
   PORT=5001
   DATABASE_URL=<your-postgresql-connection-string>
   JWT_SECRET=<generate-random-secret>
   REFRESH_TOKEN_SECRET=<generate-random-secret>
   FRONTEND_URL=https://renova.vercel.app
   ```

6. Deploy and wait for completion
7. Note your API URL: `https://renova-api.onrender.com`

## Step 3: Run Database Migrations

1. In Render dashboard, go to your service
2. Open "Shell" tab
3. Run migrations:
   ```bash
   cd server
   npx sequelize-cli db:migrate
   npx sequelize-cli db:seed:all
   ```

## Step 4: Frontend Deployment (Vercel)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

5. Add Environment Variables:
   ```
   NEXT_PUBLIC_API_URL=https://renova-api.onrender.com/api
   ```

6. Deploy and wait for completion
7. Note your frontend URL: `https://renova.vercel.app`

## Step 5: Update CORS Configuration

1. Go back to Render dashboard
2. Update `FRONTEND_URL` environment variable with your actual Vercel URL
3. Redeploy the backend service

## Step 6: Testing

### Test API Endpoints:
- Health Check: `https://renova-api.onrender.com/health`
- Register: `POST https://renova-api.onrender.com/api/auth/register`
- Login: `POST https://renova-api.onrender.com/api/auth/login`

### Test Frontend:
- Visit: `https://renova.vercel.app`
- Try registration and login
- Test product creation and cart functionality

## Step 7: Demo Credentials

The seeded database includes:
- **Email**: demo@renova.com
- **Password**: demo1234

## Troubleshooting

### Common Issues:

1. **CORS Errors**: Ensure FRONTEND_URL is set correctly in backend
2. **Database Connection**: Verify DATABASE_URL format and credentials
3. **Build Failures**: Check Node.js version compatibility
4. **Authentication Issues**: Verify JWT secrets are set

### Logs:
- Render: Check "Logs" tab in service dashboard
- Vercel: Check "Functions" tab for serverless function logs

## Production URLs

- **Frontend**: https://renova.vercel.app
- **Backend API**: https://renova-api.onrender.com
- **API Health**: https://renova-api.onrender.com/health
