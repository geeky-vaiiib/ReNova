# 🆓 ReNova Deployment Guide - Render Free Plan

Since you're using Render's free plan (which doesn't have shell access), here's how to deploy ReNova successfully:

## 🔧 **Backend Deployment (Render)**

### **1. Environment Variables Setup**
In your Render Web Service dashboard, add these environment variables:

```bash
NODE_ENV=production
PORT=5001
DATABASE_URL=<your-render-postgresql-connection-string>
JWT_SECRET=7639b28abdeae1cceb277886c51cd323dd7ec7e89e2e0f82a122db479a92f0f0
REFRESH_TOKEN_SECRET=a75a3135621fc27e1dc40edc971c0fcde7f3a041c011ef4762538c7ea185abae
FRONTEND_URL=https://renova.vercel.app
```

### **2. Automatic Database Setup**
The backend now automatically runs migrations and seeds on startup in production mode. This happens when:
- `NODE_ENV=production` is set
- The server starts for the first time
- Database tables will be created automatically

### **3. Build Configuration**
- **Build Command**: `cd server && npm install`
- **Start Command**: `cd server && npm start`
- **Auto-Deploy**: Enable "Auto-Deploy" from GitHub

## 🌐 **Frontend Deployment (Vercel)**

### **1. Environment Variables**
In Vercel dashboard, add:
```bash
NEXT_PUBLIC_API_URL=https://renova-api-h8k2.onrender.com/api
```

### **2. Deployment**
- Connect your GitHub repository to Vercel
- Vercel will automatically detect it's a Next.js project
- Deploy will happen automatically

## 🔍 **Verification Steps**

### **1. Check Backend Health**
```bash
curl https://renova-api-h8k2.onrender.com/health
```
Should return:
```json
{"status":"OK","message":"ReNova API is running","timestamp":"...","environment":"production","port":"5001"}
```

### **2. Test Database Setup**
```bash
curl -X POST https://renova-api-h8k2.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@renova.com","password":"demo1234"}'
```

### **3. Test Registration**
```bash
curl -X POST https://renova-api-h8k2.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"testpass123"}'
```

## 🚨 **Troubleshooting**

### **If Backend Shows 500 Errors:**
1. Check Render logs for database connection errors
2. Verify `DATABASE_URL` is correctly set
3. Wait for automatic migrations to complete (may take 1-2 minutes on first deploy)

### **If Migrations Fail:**
1. Check Render logs for specific error messages
2. The server will still start even if migrations fail
3. Database tables might already exist from previous deployments

### **If CORS Errors Occur:**
1. Update `FRONTEND_URL` to match your actual Vercel domain
2. Redeploy the Render service after updating environment variables

## 📋 **Demo Credentials**
After successful deployment, you can test with:
- **Email**: `demo@renova.com`
- **Password**: `demo1234`

## 🎯 **Success Indicators**
- ✅ Backend health endpoint returns 200 OK
- ✅ Frontend loads without console errors
- ✅ Login/registration works
- ✅ Cross-domain cookies are set properly

## 💡 **Free Plan Limitations Workarounds**
- **No Shell Access**: Database setup runs automatically on server start
- **Sleep Mode**: Free services sleep after 15 minutes of inactivity
- **Build Time**: Limited build minutes per month
- **Database**: PostgreSQL free tier has connection limits

Your ReNova marketplace should now be fully functional in production! 🚀
