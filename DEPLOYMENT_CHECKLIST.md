# ReNova Production Deployment Checklist

## ✅ Pre-Deployment Checklist

### Repository Setup
- [x] Code pushed to GitHub: https://github.com/geeky-vaiiib/ReNova
- [x] Production configuration files added
- [x] Environment variable templates created
- [x] Database configuration updated for PostgreSQL
- [x] CORS configuration updated for production domains

### Configuration Files Added
- [x] `vercel.json` - Vercel deployment configuration
- [x] `render.yaml` - Render deployment configuration  
- [x] `server/Dockerfile` - Docker configuration for backend
- [x] `next.config.mjs` - Next.js production configuration
- [x] `.env.example` - Frontend environment template
- [x] `server/.env.example` - Backend environment template
- [x] `deploy.md` - Detailed deployment guide

## 🗄️ Database Deployment (Step 1)

### Option A: Render PostgreSQL (Recommended)
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New" → "PostgreSQL"
3. Configure:
   - Name: `renova-db`
   - Database: `renova`
   - User: `renova_user`
   - Plan: Free
4. Copy the External Database URL
5. Format: `postgresql://username:password@host:port/database`

### Option B: Railway PostgreSQL
1. Go to [Railway](https://railway.app)
2. Create new project → "PostgreSQL"
3. Copy connection string from Variables

### Option C: Supabase
1. Go to [Supabase](https://supabase.com)
2. Create new project
3. Go to Settings → Database
4. Copy connection string

## 🔧 Backend Deployment (Step 2)

### Render Web Service
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New" → "Web Service"
3. Connect GitHub repository: `geeky-vaiiib/ReNova`
4. Configure:
   - Name: `renova-api`
   - Environment: `Node`
   - Build Command: `cd server && npm install`
   - Start Command: `cd server && npm start`
   - Auto-Deploy: Yes

5. Environment Variables:
   ```
   NODE_ENV=production
   PORT=5001
   DATABASE_URL=<your-postgresql-connection-string>
   JWT_SECRET=<generate-32-char-random-string>
   REFRESH_TOKEN_SECRET=<generate-32-char-random-string>
   FRONTEND_URL=https://renova.vercel.app
   ```

6. Deploy and wait for completion
7. Expected URL: `https://renova-api.onrender.com`

### Generate Secrets
Use this command to generate secure secrets:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 🗃️ Database Migration (Step 3)

1. In Render dashboard, go to your `renova-api` service
2. Click "Shell" tab
3. Run commands:
   ```bash
   cd server
   npx sequelize-cli db:migrate
   npx sequelize-cli db:seed:all
   ```

4. Verify demo user created:
   - Email: demo@renova.com
   - Password: demo1234

## 🌐 Frontend Deployment (Step 4)

### Vercel Deployment
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import GitHub repository: `geeky-vaiiib/ReNova`
4. Configure:
   - Framework: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

5. Environment Variables:
   ```
   NEXT_PUBLIC_API_URL=https://renova-api.onrender.com/api
   ```

6. Deploy and wait for completion
7. Expected URL: `https://renova.vercel.app` or similar

## 🔄 Post-Deployment Configuration (Step 5)

### Update Backend CORS
1. Go to Render dashboard → `renova-api` service
2. Update environment variable:
   ```
   FRONTEND_URL=<your-actual-vercel-url>
   ```
3. Redeploy the service

### Custom Domain (Optional)
1. In Vercel, go to project settings
2. Add custom domain if desired
3. Update FRONTEND_URL in backend accordingly

## 🧪 Testing & Verification (Step 6)

### API Health Check
- [ ] Visit: `https://renova-api.onrender.com/health`
- [ ] Should return: `{"status":"OK","message":"ReNova API is running"}`

### API Endpoints Test
```bash
# Test registration
curl -X POST https://renova-api.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"testpass123"}'

# Test login
curl -X POST https://renova-api.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@renova.com","password":"demo1234"}'
```

### Frontend Testing
- [ ] Visit: `https://renova.vercel.app`
- [ ] Test user registration
- [ ] Test login with demo credentials
- [ ] Test product browsing
- [ ] Test cart functionality
- [ ] Test product creation (after login)

### Cross-Origin Testing
- [ ] Verify cookies work between domains
- [ ] Test authentication persistence
- [ ] Check browser console for CORS errors

## 📋 Final Deliverables

### Live URLs
- [ ] Frontend: `https://renova.vercel.app`
- [ ] Backend: `https://renova-api.onrender.com`
- [ ] Health Check: `https://renova-api.onrender.com/health`

### Demo Credentials
- [ ] Email: demo@renova.com
- [ ] Password: demo1234

### Documentation
- [ ] README.md updated with live URLs
- [ ] Deployment guide available
- [ ] Environment variables documented

## 🚨 Troubleshooting

### Common Issues
1. **CORS Errors**: Check FRONTEND_URL matches actual Vercel domain
2. **Database Connection**: Verify DATABASE_URL format and credentials
3. **Build Failures**: Check Node.js version (should be 18+)
4. **Authentication Issues**: Verify JWT secrets are properly set
5. **Cold Start Delays**: Render free tier has cold starts (~30s)

### Debug Commands
```bash
# Check database connection
cd server && node -e "const {sequelize} = require('./models'); sequelize.authenticate().then(() => console.log('DB OK')).catch(console.error)"

# Test API locally
curl -X GET http://localhost:5001/health
```

## 🎯 Success Criteria

- [ ] Frontend loads without errors
- [ ] Backend API responds to health checks
- [ ] Database migrations completed successfully
- [ ] Demo user can login successfully
- [ ] Products display correctly
- [ ] Cart functionality works
- [ ] Cross-origin authentication works
- [ ] No CORS errors in browser console
