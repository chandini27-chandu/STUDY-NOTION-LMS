const Razorpay = require("razorpay");
require('dotenv').config();

// Initialize Razorpay with error handling
const initializeRazorpay = () => {
    try {
        // Validate required environment variables
        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            throw new Error('RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is not defined in environment variables');
        }

        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        console.log(`\n✓ Razorpay initialized successfully`);
        return instance;
    } catch (error) {
        console.error(`\n✗ Error initializing Razorpay:`);
        console.error(`  Message: ${error.message}`);
        process.exit(1);
    }
};

// Create and export the Razorpay instance
const razorpayInstance = initializeRazorpay();

module.exports = razorpayInstance;