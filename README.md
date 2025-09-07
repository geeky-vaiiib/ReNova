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

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
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
   DB_HOST=localhost
   DB_USERNAME=postgres
   DB_PASSWORD=your_password
   DB_NAME=renova_dev
   JWT_SECRET=your_jwt_secret
   JWT_REFRESH_SECRET=your_refresh_secret
   CORS_ORIGIN=http://localhost:3000
   ```

5. **Set up the database**
   ```bash
   # Create database
   createdb renova_dev
   
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

## 🌍 Environment Variables

### Frontend (.env.local)
- `NEXT_PUBLIC_API_URL` - Backend API URL

### Backend (server/.env)
- `PORT` - Server port (default: 5001)
- `NODE_ENV` - Environment (development/production)
- `DB_HOST` - Database host
- `DB_USERNAME` - Database username
- `DB_PASSWORD` - Database password
- `DB_NAME` - Database name
- `JWT_SECRET` - JWT signing secret
- `JWT_REFRESH_SECRET` - Refresh token secret
- `CORS_ORIGIN` - Allowed CORS origins

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
