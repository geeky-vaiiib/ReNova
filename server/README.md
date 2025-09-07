# ReNova Backend API

A Node.js + Express + MySQL backend for the ReNova sustainable marketplace.

## Features

- **Authentication**: JWT-based auth with bcrypt password hashing
- **Products**: Full CRUD with search, filtering, and owner permissions
- **Cart**: Add, update, remove items with user-specific carts
- **Orders**: Checkout process that converts cart to orders
- **Database**: MySQL with Sequelize ORM, migrations, and seeders

## Tech Stack

- Node.js + Express.js
- MySQL + Sequelize ORM
- JWT Authentication
- bcrypt for password hashing
- Joi for input validation
- CORS enabled

## Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Setup environment**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. **Setup database**
   ```bash
   # Create database
   npm run db:create
   
   # Run migrations
   npm run migrate
   
   # Seed demo data
   npm run seed
   ```

4. **Start server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## Environment Variables

```env
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_USER=root
DB_PASS=your_password
DB_NAME=renova_db

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=24h

# CORS
FRONTEND_URL=http://localhost:3000
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh token

### Products
- `GET /api/products` - List products (with search/filter)
- `GET /api/products/my` - Get user's products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (auth)
- `PUT /api/products/:id` - Update product (owner only)
- `DELETE /api/products/:id` - Delete product (owner only)

### Cart
- `GET /api/cart` - Get cart items
- `GET /api/cart/count` - Get cart count
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update cart item
- `DELETE /api/cart/:id` - Remove cart item
- `DELETE /api/cart` - Clear cart

### Orders
- `GET /api/orders` - Get user's orders
- `GET /api/orders/stats` - Get order statistics
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders/checkout` - Checkout cart
- `PUT /api/orders/:id/status` - Update order status

## Database Schema

### Users
- id, username, email, passwordHash, createdAt, updatedAt

### Products
- id, title, description, category, price, imageUrl, ownerId, createdAt, updatedAt

### CartItems
- id, userId, productId, quantity, createdAt, updatedAt

### Orders
- id, userId, total, status, createdAt, updatedAt

### OrderItems
- id, orderId, productId, priceAtPurchase, quantity, createdAt, updatedAt

## Demo Data

The seeder creates:
- Demo user: `demo@renova.com` / `demo1234`
- 6 additional users with sample products
- 12 sample products across different categories

## Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run migrate` - Run database migrations
- `npm run migrate:undo` - Undo last migration
- `npm run seed` - Run all seeders
- `npm run seed:undo` - Undo all seeders
- `npm run db:create` - Create database
- `npm run db:drop` - Drop database
