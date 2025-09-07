# ReNova Setup Guide

## Prerequisites

1. **Node.js** (v18 or higher)
2. **MySQL** (v8.0 or higher)
3. **npm** or **pnpm**

## Quick Start

### 1. Database Setup

First, make sure MySQL is running and create the database:

```sql
CREATE DATABASE renova_db;
```

### 2. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create database and run migrations
npm run db:create
npm run migrate

# Seed demo data
npm run seed

# Start backend server
npm run dev
```

The backend will be running at `http://localhost:5000`

### 3. Frontend Setup

Open a new terminal:

```bash
# Navigate to project root (where package.json is)
cd ..

# Install dependencies
npm install

# Start frontend development server
npm run dev
```

The frontend will be running at `http://localhost:3000`

## Demo Credentials

- **Email**: demo@renova.com
- **Password**: demo1234

## API Endpoints

- Backend API: `http://localhost:5000/api`
- Health check: `http://localhost:5000/health`

## Troubleshooting

### Database Connection Issues

1. Make sure MySQL is running
2. Check database credentials in `server/.env`
3. Ensure the database `renova_db` exists

### Port Conflicts

- Backend uses port 5000
- Frontend uses port 3000
- Change ports in `.env` files if needed

### Missing Dependencies

```bash
# Backend
cd server && npm install

# Frontend
cd .. && npm install
```

## Features Available

✅ User Authentication (Register/Login)
✅ Product Browsing with Search & Filters
✅ Add Products to Cart
✅ Checkout Process
✅ Order History
✅ Product Management (Add/Edit/Delete)
✅ Dark/Light Mode Toggle
✅ Responsive Design

## Next Steps

1. Start both servers (backend and frontend)
2. Visit `http://localhost:3000`
3. Register a new account or use demo credentials
4. Explore the marketplace features!
