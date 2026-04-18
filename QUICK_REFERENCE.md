# Backend Development Quick Reference

## 🚀 Quick Commands

### Setup First Time
```bash
cd backend
npm install
cp .env.example .env  # Then fill in your credentials
npm run dev
```

### Start Development Server
```bash
npm run dev
```
Server runs on `http://localhost:5000`

### Start Production Server
```bash
npm start
```

### Install New Package
```bash
npm install package-name
npm install --save-dev package-name  # For dev only
```

---

## 📁 Project Structure

```
backend/
├── config/
│   ├── database.js          # MongoDB connection
│   ├── cloudinary.js        # Image upload service
│   └── rajorpay.js          # Payment gateway
├── controllers/
│   ├── auth.js              # Authentication logic
│   ├── course.js            # Course management
│   ├── payments.js          # Payment processing
│   ├── profile.js           # User profiles
│   └── ...
├── models/
│   ├── user.js              # User schema
│   ├── course.js            # Course schema
│   ├── category.js          # Category schema
│   └── ...
├── routes/
│   ├── user.js              # Auth routes
│   ├── course.js            # Course routes
│   ├── payments.js          # Payment routes
│   └── profile.js           # Profile routes
├── middleware/
│   └── auth.js              # Authentication middleware
├── utils/
│   ├── mailSender.js        # Email service
│   ├── imageUploader.js     # Image upload
│   └── ...
├── mail/
│   └── templates/           # Email templates
├── server.js                # Main app file
├── .env                     # Environment variables
└── package.json             # Dependencies
```

---

## 🔌 API Structure

All routes use versioned API:
```
/api/v1/{resource}/{action}
```

### Response Format
```json
{
  "success": true/false,
  "message": "Description",
  "data": {}
}
```

---

## 🛡️ Middleware

### Available Middleware:
- `auth` - Verify JWT token (required for protected routes)
- `isStudent` - Check if user is a student
- `isInstructor` - Check if user is an instructor
- `isAdmin` - Check if user is an admin

### Usage:
```javascript
router.post('/route', auth, isStudent, controllerFunction);
```

---

## 📤 File Upload

### Using Cloudinary

```javascript
const { uploadImageToCloudinary } = require('../utils/imageUploader');

// Upload image
const result = await uploadImageToCloudinary(
  req.files.image,
  'folder-name',  // Optional: Cloudinary folder
  400,            // Optional: height
  100             // Optional: quality
);

console.log(result.secure_url); // Get image URL
```

### Delete Image:
```javascript
const { deleteResourceFromCloudinary } = require('../utils/imageUploader');

await deleteResourceFromCloudinary(publicId);
```

---

## 💳 Payment Processing

### Using Razorpay

```javascript
const razorpay = require('../config/rajorpay');

// Create order
const options = {
  amount: totalAmount * 100,  // Amount in paise
  currency: 'INR',
  receipt: uniqueReceiptId,
};

const order = await razorpay.orders.create(options);
```

---

## 📧 Email Service

### Send Email

```javascript
const mailSender = require('../utils/mailSender');

await mailSender(
  recipientEmail,
  'Email Subject',
  htmlTemplate
);
```

### Email Templates:
- `emailVerificationTemplate.js` - OTP verification
- `courseEnrollmentEmail.js` - Course enrollment
- `passwordUpdate.js` - Password reset

---

## 🔐 Authentication

### JWT Token
```javascript
const jwt = require('jsonwebtoken');

// Create token
const token = jwt.sign(
  { email, id, accountType },
  process.env.JWT_SECRET,
  { expiresIn: process.env.JWT_EXPIRE }
);

// Verify token (done in auth middleware)
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```

### Extract Token in Request:
1. From body: `req.body.token`
2. From cookies: `req.cookies.token`
3. From headers: `Authorization: Bearer {token}`

---

## 🗄️ Database Models

### User Model
```javascript
{
  firstName, lastName, email, password,
  accountType: 'Student' | 'Instructor' | 'Admin',
  additionalDetails: ObjectId (ref: Profile),
  courses: [ObjectId],
  image, token, resetPasswordTokenExpires,
  courseProgress: [ObjectId],
  timestamps
}
```

### Course Model
```javascript
{
  courseName, courseDescription,
  instructor: ObjectId (ref: User),
  courseContent: [ObjectId (ref: Section)],
  price, category: ObjectId (ref: Category),
  ratingAndReviews: [ObjectId],
  studentsEnrolled: [ObjectId],
  thumbnail, timestamps
}
```

---

## 🧪 Testing API Endpoints

### Using Postman:
1. Open Postman
2. Create new request
3. Set method (GET, POST, etc.)
4. Enter URL: `http://localhost:5000/api/v1/{endpoint}`
5. Add headers: `Content-Type: application/json`
6. Add body (JSON) or params
7. Click Send

### Example Request:
```bash
curl -X POST http://localhost:5000/api/v1/auth/sendotp \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com"}'
```

---

## 🐛 Debugging Tips

### Enable More Logging:
```javascript
// In server.js or any controller
console.log('Debug info:', variableName);
```

### Check MongoDB:
```bash
mongosh
use study-notion
db.users.find()
db.courses.find()
```

### Check Environment Variables:
```javascript
console.log(process.env.MONGO_URI);
console.log(process.env.JWT_SECRET);
```

### Enable Request Logging:
```javascript
const morgan = require('morgan');
app.use(morgan('dev'));
```

---

## ⚠️ Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| Cannot connect to MongoDB | Server not running | Start MongoDB: `net start MongoDB` |
| Port 5000 in use | Another process | Change PORT in .env or kill process |
| `undefined` dotenv variables | .env not loaded | Ensure `require('dotenv').config()` at top |
| "Token is Missing" | No auth provided | Include token in headers or body |
| Cloudinary upload fails | Credentials invalid | Check CLOUD_NAME, API_KEY, API_SECRET |
| Email not sending | SMTP credentials wrong | Verify MAIL_HOST, MAIL_USER, MAIL_PASS |

---

## 📚 Useful Links

- [Express.js Docs](https://expressjs.com/)
- [Mongoose Docs](https://mongoosejs.com/)
- [Cloudinary Docs](https://cloudinary.com/documentation)
- [Razorpay Docs](https://razorpay.com/docs/)
- [JWT.io](https://jwt.io/)
- [Nodemailer](https://nodemailer.com/)

---

## 📝 Code Standards

### File Naming:
- Controllers: `controllerName.js`
- Models: `ModelName.js` (capitalized)
- Routes: `routeName.js`
- Middleware: `middleware.js`

### Function Naming:
- Controllers: `camelCase` (e.g., `getUserProfile`)
- Middleware: `camelCase` (e.g., `isAuthenticated`)

### Error Handling:
```javascript
try {
  // Code
} catch (error) {
  console.error('Error message:', error);
  res.status(500).json({
    success: false,
    message: 'Error message'
  });
}
```

---

## 🚀 Deployment Checklist

- [ ] All .env variables set with production values
- [ ] Database backup taken
- [ ] CORS configured for production domain
- [ ] Error logs configured
- [ ] Security headers added
- [ ] Rate limiting implemented
- [ ] API documentation updated
- [ ] Test all endpoints
- [ ] Monitor server performance

---

**Happy Coding!** 🎉
