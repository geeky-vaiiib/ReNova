# ReNova - Sustainable Marketplace

A modern, full-stack sustainable marketplace application built with Next.js 14 and Node.js, designed to promote eco-friendly shopping through second-hand goods.

## 🌱 About ReNova

ReNova is a second-hand marketplace built to encourage sustainability, reduce waste, and connect buyers with sellers for affordable, eco-friendly shopping. Every transaction on ReNova contributes to reducing waste, conserving resources, and building a more sustainable future for our planet.

## ✨ Features

- **User Authentication**: Secure JWT-based authentication with refresh tokens
- **Product Management**: Full CRUD operations for products with image uploads
- **Search & Filter**: Advanced search and filtering capabilities
- **Shopping Cart**: Complete cart functionality with persistent storage
- **Responsive Design**: Mobile-first design with dark/light theme support
- **Real-time Updates**: Live cart updates and notifications
- **Admin Dashboard**: Comprehensive admin panel for managing users and products

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - Modern UI components
- **Lucide React** - Beautiful icons

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **PostgreSQL** - Primary database
- **Sequelize** - ORM for database operations
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **Multer** - File upload handling

## 🚀 Live Demo

### Production URLs
- **Frontend**: https://renova.vercel.app
- **Backend API**: https://renova-api.onrender.com
- **API Health Check**: https://renova-api.onrender.com/health

## 🛠️ Local Development

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v12 or higher) or SQLite for development
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/geeky-vaiiib/ReNova.git
   cd ReNova
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

4. **Set up environment variables**

   Frontend (.env.local):
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5001/api
   ```

   Backend (server/.env):
   ```env
   PORT=5001
   NODE_ENV=development
   DATABASE_URL=./database.sqlite
   JWT_SECRET=your_jwt_secret
   REFRESH_TOKEN_SECRET=your_refresh_secret
   FRONTEND_URL=http://localhost:3000
   ```

5. **Set up the database**
   ```bash
   # Run migrations
   cd server
   npm run migrate

   # Seed demo data
   npm run seed
   ```

6. **Start the development servers**

   Backend:
   ```bash
   cd server
   npm start
   ```

   Frontend (in a new terminal):
   ```bash
   npm run dev
   ```

7. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5001/api
   - Health Check: http://localhost:5001/health

## 🔐 Demo Credentials

- **Email**: demo@renova.com
- **Password**: demo1234

## 📁 Project Structure

```
ReNova/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication pages
│   ├── home/              # Home page
│   ├── profile/           # User profile
│   └── layout.tsx         # Root layout
├── components/            # Reusable UI components
├── lib/                   # Utility functions and API client
├── server/                # Backend application
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Express middleware
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── migrations/       # Database migrations
│   └── seeders/          # Database seeders
└── public/               # Static assets
```

## 🚀 Production Deployment

### Quick Deploy
1. **Database**: Deploy PostgreSQL on Render/Railway/Supabase
2. **Backend**: Deploy to Render using the included `render.yaml`
3. **Frontend**: Deploy to Vercel with one-click GitHub integration

### Detailed Instructions
See [deploy.md](./deploy.md) for complete step-by-step deployment guide.

### Environment Variables

#### Frontend (.env.local)
- `NEXT_PUBLIC_API_URL` - Backend API URL

#### Backend (server/.env)
- `PORT` - Server port (default: 5001)
- `NODE_ENV` - Environment (development/production)
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - JWT signing secret
- `REFRESH_TOKEN_SECRET` - Refresh token secret
- `FRONTEND_URL` - Frontend URL for CORS

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with love for sustainability and the environment
- Inspired by the circular economy principles
- Thanks to all contributors and the open-source community

---

**ReNova** - Renewing the way we shop, one sustainable transaction at a time. 🌱
