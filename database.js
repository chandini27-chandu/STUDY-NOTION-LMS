const mongoose = require('mongoose');
require('dotenv').config();

// Database connection function with error handling
const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is not defined in environment variables');
        }

        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`\n✓ Database connected successfully`);
        console.log(`Connected to: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.error(`\n✗ Error connecting to database:`);
        console.error(`  Message: ${error.message}`);
        console.error(`  Stack: ${error.stack}`);
        process.exit(1);
    }
};

// Export both function and mongoose instance for reusability
module.exports = {
    connectDB,
    mongoose,
};

