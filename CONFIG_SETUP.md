# Backend Configuration Guide

This guide explains how to set up the backend server with all required external services.

## Overview

The backend is configured to integrate with:
- **MongoDB** - Database
- **Cloudinary** - Image storage and CDN
- **Razorpay** - Payment processing

## Setup Instructions

### 1. Environment Variables

Copy the `.env.example` file to `.env`:
```bash
cp .env.example .env
```

Fill in your credentials in the `.env` file:

#### Database
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
```
Get your MongoDB URI from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

#### Cloudinary
```
CLOUD_NAME=your_cloud_name
API_KEY=your_api_key
API_SECRET=your_api_secret
```
Get credentials from [Cloudinary Dashboard](https://cloudinary.com/console)

#### Razorpay
```
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```
Get credentials from [Razorpay Dashboard](https://dashboard.razorpay.com)

#### Other Configuration
```
PORT=5000
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### 2. Install Dependencies

```bash
npm install
```

Required packages:
- `mongoose` - MongoDB ORM
- `cloudinary` - Image management
- `razorpay` - Payment processing
- `dotenv` - Environment variable management
- `express` - Web framework
- `cors` - Cross-origin resource sharing
- `cookie-parser` - Cookie parsing
- `express-fileupload` - File upload handling

### 3. File Structure

```
backend/
├── config/
│   ├── database.js      # MongoDB connection
│   ├── cloudinary.js    # Cloudinary configuration
│   └── rajorpay.js      # Razorpay setup
├── routes/
├── controllers/
├── models/
├── middleware/
├── server.js            # Main server file
├── package.json
├── .env                 # (Create from .env.example)
└── .env.example         # Example environment variables
```

### 4. Configuration Files Explained

#### `config/database.js`
- Connects to MongoDB using Mongoose
- Exports `connectDB()` function for async connection
- Exports `mongoose` instance for reusability
- Includes error handling with detailed logging

**Usage:**
```javascript
const { connectDB } = require('./config/database');
await connectDB();
```

#### `config/cloudinary.js`
- Configures Cloudinary for image uploads
- Exports `cloudinaryConnect()` function
- Exports `cloudinary` instance
- Validates required environment variables

**Usage:**
```javascript
const { cloudinary } = require('./config/cloudinary');
// Use cloudinary instance for uploads
```

#### `config/rajorpay.js`
- Initializes Razorpay payment gateway
- Exports ready-to-use Razorpay instance
- Validates API credentials on initialization

**Usage:**
```javascript
const razorpay = require('./config/rajorpay');
// Use razorpay for payment operations
```

### 5. Server Startup

The main `server.js` file:
- Loads environment variables with `dotenv`
- Initializes all external service connections
- Sets up middleware (CORS, file upload, cookie parser)
- Mounts API routes
- Includes error handling and health check endpoint

**Start development server:**
```bash
npm run dev
```

**Start production server:**
```bash
npm start
```

### 6. API Endpoints

After server starts, the following are available:

- **Health Check:** `GET /api/v1/health`
- **User Routes:** `POST /api/v1/auth/*`
- **Profile Routes:** `GET/POST /api/v1/profile/*`
- **Course Routes:** `GET/POST /api/v1/courses/*`
- **Payment Routes:** `POST /api/v1/payments/*`

### 7. Error Handling

The server includes comprehensive error handling:

- **Connection Errors** - Displayed with context (database, Cloudinary, Razorpay)
- **Missing Environment Variables** - Validated on startup
- **Route Not Found** - 404 error handler
- **Global Error Handler** - Catches all uncaught errors
- **Unhandled Rejections** - Gracefully handled

### 8. Logging

The server provides clear console output:

```
✓ Database connected successfully
✓ Cloudinary connected successfully
✓ Razorpay initialized successfully
✓ All external services initialized successfully

🚀 Server started successfully on port 5000
📝 Environment: development
```

## Troubleshooting

### Database Connection Failed
- Check `MONGO_URI` format
- Verify IP whitelist in MongoDB Atlas
- Ensure MongoDB cluster is active

### Cloudinary Connection Failed
- Verify `CLOUD_NAME`, `API_KEY`, `API_SECRET`
- Check credentials in Cloudinary dashboard

### Razorpay Connection Failed
- Verify `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`
- Check key status in Razorpay dashboard
- Test keys in sandbox mode first

### Environment Variables Not Loading
- Ensure `.env` file exists in backend directory
- Restart server after modifying `.env`
- Check file permissions

## Development Tips

1. **Use `npm run dev`** for development (auto-restart on file changes)
2. **Monitor logs** for connection issues at startup
3. **Test connections** using the `/api/v1/health` endpoint
4. **Never commit `.env`** - it contains secrets
5. **Use `.env.example`** as template for team members

## Production Deployment

Before deploying to production:

1. Set `NODE_ENV=production`
2. Use strong, unique credentials
3. Enable IP whitelisting for database
4. Use environment-specific configuration
5. Set up proper monitoring and logging
6. Configure CORS with specific frontend URL
7. Ensure all environment variables are set in deployment platform
