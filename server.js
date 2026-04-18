require("dotenv").config();

const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");

// Import configuration modules
const { connectDB } = require("./config/database");
const { cloudinaryConnect } = require("./config/cloudinary");
const razorpayInstance = require("./config/rajorpay");

// Import routes
const userRoutes = require("./routes/user");
const profileRoutes = require("./routes/profile");
const paymentRoutes = require("./routes/payments");
const courseRoutes = require("./routes/course");

// Initialize Express app
const app = express();

// ==================== CORS CONFIG ====================

const corsOptions = {
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
};

app.use(cors(corsOptions));

// ==================== Middleware ====================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ FIXED FILE UPLOAD (IMPORTANT CHANGE)
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
}));

// ==================== Routes ====================

app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/course", courseRoutes);

// ==================== Health Check ====================

app.get("/api/v1/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is running",
        timestamp: new Date().toISOString(),
    });
});

// ==================== Default Route ====================

app.get("/", (req, res) => {
    res.send(`
        <div>
            This is Default Route  
            <p>Everything is OK</p>
        </div>
    `);
});

// ==================== Error Handling ====================

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
    });
});

app.use((err, req, res, next) => {
    console.error("Error:", err.message);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
});

// ==================== DB + Server Start ====================

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();
        cloudinaryConnect();

        console.log("\n✓ All external services initialized successfully\n");

        app.listen(PORT, () => {
            console.log(`\n🚀 Server started successfully on port ${PORT}`);
            console.log(`📝 Environment: ${process.env.NODE_ENV || "development"}\n`);
        });
    } catch (error) {
        console.error("\n✗ Failed to start server:");
        console.error(error);
        process.exit(1);
    }
};

startServer();

// ==================== ERROR HANDLERS ====================

process.on("unhandledRejection", (reason, promise) => {
    console.error("\n✗ Unhandled Rejection:", reason);
    process.exit(1);
});

process.on("uncaughtException", (error) => {
    console.error("\n✗ Uncaught Exception:", error);
    process.exit(1);
});

module.exports = app;