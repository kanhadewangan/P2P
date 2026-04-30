# Payment Transfer Application - Backend

A Node.js and Express.js based backend API for a peer-to-peer money transfer application. This is a full-featured payment system that allows users to sign up, authenticate, manage account balances, and transfer money between accounts.

## 🎯 Project Overview

This is a **Week-11 Assignment** focused on building a secure and scalable backend for a money transfer platform. The application provides RESTful APIs for user management, authentication, account operations, and financial transactions.

## 🚀 Features

- **User Authentication**: Secure signup and login with JWT tokens
- **User Management**: Create accounts, search users, update profiles
- **Account Management**: Check balance, view account information
- **Money Transfer**: Transfer funds between user accounts with balance validation
- **Transaction History**: View all incoming and outgoing transactions
- **CORS Support**: Cross-origin requests enabled for frontend integration

## 📋 Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js v5.2.1
- **Database**: MongoDB (Cloud Atlas)
- **Authentication**: JWT (jsonwebtoken v9.0.3)
- **Validation**: Zod v3.25.76
- **Environment Management**: dotenv v16.6.1
- **CORS**: Enabled for frontend communication

## 📁 Project Structure

```
back/
├── index.js              # Main server entry point
├── db.js                 # MongoDB schemas and models
├── middleware.js         # JWT authentication middleware
├── package.json          # Project dependencies
├── .env                  # Environment variables (not in version control)
├── Readme.md             # This file
└── routes/
    ├── index.js          # Router aggregator
    ├── user.js           # User authentication and management endpoints
    ├── account.js        # Account balance operations
    └── transaction.js    # Money transfer and transaction endpoints
```

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB instance)

### Setup Steps

1. **Clone or navigate to the project directory**
   ```bash
   cd /home/kanha/100x/ass/week-11/back
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the root directory with:
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=3000
   ```

4. **Start the server**
   ```bash
   node index.js
   ```

   The server will run on `http://localhost:3000`

## 🔌 API Endpoints

### Base URL
```
http://localhost:3000/api/v1
```

### User Routes (`/user`)

| Method | Endpoint | Authentication | Description |
|--------|----------|-----------------|-------------|
| POST | `/signup` | ❌ No | Register a new user (initial balance: 1000) |
| POST | `/login` | ❌ No | Authenticate user and receive JWT token |
| PUT | `/update?id=<userId>` | ✅ JWT | Update user profile |
| GET | `/bulk?filter=<filter>` | ✅ JWT | Search users by name filter |

### Account Routes (`/account`)
*All endpoints require JWT authentication*

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/balance` | Get authenticated user's account balance |
| POST | `/balance/:id` | Update account balance (admin operation) |

### Transaction Routes (`/transaction`)
*All endpoints require JWT authentication*

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/transaction` | Transfer money between users with validation |
| GET | `/transactions` | Get all incoming and outgoing transactions |

## 📊 Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  email: String (unique, required),
  firstname: String,
  lastname: String,
  password: String (stored as plaintext - ⚠️ security issue),
  balance: Number (default: 1000),
  createdAt: Date (auto)
}
```

### Transaction Collection
```javascript
{
  _id: ObjectId,
  fromUserId: ObjectId (reference to User),
  toUserId: ObjectId (reference to User),
  amount: Number,
  timestamp: Date (auto-generated),
  status: String (pending/completed)
}
```

## 🔐 Authentication

The application uses **JWT (JSON Web Tokens)** for authentication:

1. User logs in with email and password
2. Server returns a JWT token
3. Client includes token in the `Authorization` header: `Bearer <token>`
4. Middleware validates token for protected routes

## 🚨 Important Security Notes

⚠️ **Current Implementation Issues**:
- Passwords are stored in **plaintext** - should be hashed with bcrypt
- Zod validation is imported but not actively used for input validation
- No rate limiting implemented
- No HTTPS enforcement in production

**Recommendations for Production**:
- Implement password hashing (bcrypt)
- Add comprehensive input validation using Zod
- Add rate limiting to prevent abuse
- Implement transaction logging
- Add error handling middleware
- Enable HTTPS
- Add API key management for admin operations

## 🧪 Example Requests

### Signup
```bash
curl -X POST http://localhost:3000/api/v1/user/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "firstname": "John",
    "lastname": "Doe",
    "password": "securepassword123"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/v1/user/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword123"
  }'
```

### Check Balance
```bash
curl -X GET http://localhost:3000/api/v1/account/balance \
  -H "Authorization: Bearer <your_jwt_token>"
```

### Transfer Money
```bash
curl -X POST http://localhost:3000/api/v1/transaction \
  -H "Authorization: Bearer <your_jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "recipient_user_id",
    "amount": 50
  }'
```

## 📝 Environment Variables

Required environment variables (in `.env` file):

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `JWT_SECRET` | Secret key for JWT signing | `your_secret_key_here` |
| `PORT` | Server port | `3000` |

## 🔄 Workflow Example

1. **User Registration**: User signs up with email and password → gets initial balance of 1000
2. **User Login**: User logs in → receives JWT token
3. **Find Recipient**: Search for other users using `/bulk?filter=<name>`
4. **Transfer Money**: Make a POST request to `/transaction` with recipient ID and amount
5. **Check Balance**: Verify account balance with GET `/account/balance`
6. **View History**: Check all transactions with GET `/transaction/transactions`

## � Deployment on Vercel

### Prerequisites
- Vercel account (free at https://vercel.com)
- GitHub repository with the project
- MongoDB Atlas account for the database

### Deployment Steps

#### 1. **Push Project to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/payment-transfer-app.git
git push -u origin main
```

#### 2. **Connect to Vercel**
- Go to [Vercel Dashboard](https://vercel.com/dashboard)
- Click "New Project"
- Select your GitHub repository
- Choose the `back` folder as the root directory
- Click "Deploy"

#### 3. **Configure Environment Variables**
In Vercel Project Settings → Environment Variables, add:

| Key | Value |
|-----|-------|
| `MONGO_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | Your JWT secret key (use a strong random string) |

#### 4. **Deployment Configuration**
The `vercel.json` file is pre-configured with:
- **Build Command**: `npm install`
- **Install Command**: `npm install`
- **Runtime**: Node.js
- **Routes**: All requests routed to `index.js`

#### 5. **Deploy**
```bash
vercel
```

Or redeploy automatically by pushing to GitHub:
```bash
git push origin main
```

### Vercel Deployment URL
After deployment, your API will be available at:
```
https://your-project-name.vercel.app/api/v1
```

### Update Frontend Configuration
Update your frontend's API base URL to:
```
https://your-project-name.vercel.app/api/v1
```

### Troubleshooting Deployment

| Issue | Solution |
|-------|----------|
| Build fails | Check `vercel.json` is in the `back` folder; ensure all dependencies in `package.json` |
| 500 errors | Check environment variables are set correctly in Vercel dashboard |
| MongoDB connection errors | Whitelist Vercel IP in MongoDB Atlas → Network Access (allow 0.0.0.0/0) |
| CORS errors | Ensure CORS is enabled in `index.js` with correct frontend URL |

### Production Checklist
- ✅ Environment variables configured
- ✅ MongoDB connection tested
- ✅ JWT secret is strong and secure
- ✅ Password hashing implemented (recommended)
- ✅ Rate limiting added (recommended)
- ✅ Error handling middleware in place

### Monitoring & Logs
- View deployment logs: Vercel Dashboard → Project → Deployments → Logs
- Monitor errors: Check console output in Vercel dashboard
- View analytics: Vercel Dashboard → Analytics tab

## �🛠️ Development

### Running in Development Mode
```bash
npm install -g nodemon
nodemon index.js
```

### Debugging
- Check console output for error messages
- MongoDB connection errors indicate database connectivity issues
- JWT errors indicate authentication problems

## 📄 License

This is a learning/assignment project.

## 👤 Author

Created as a Week-11 assignment for the 100x course.

---

**Last Updated**: April 2026
