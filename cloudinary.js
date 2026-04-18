const cloudinary = require("cloudinary").v2;
require('dotenv').config();

// Configure Cloudinary with error handling
const cloudinaryConnect = () => {
    try {
        // Validate required environment variables
        const requiredEnvVars = ['CLOUD_NAME', 'API_KEY', 'API_SECRET'];
        const missingVars = requiredEnvVars.filter(key => !process.env[key]);
        
        if (missingVars.length > 0) {
            throw new Error(`Missing Cloudinary environment variables: ${missingVars.join(', ')}`);
        }

        cloudinary.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.API_KEY,
            api_secret: process.env.API_SECRET,
        });

        console.log(`\n✓ Cloudinary connected successfully`);
        console.log(`  Cloud: ${process.env.CLOUD_NAME}`);
        return cloudinary;
    } catch (error) {
        console.error(`\n✗ Error connecting to Cloudinary:`);
        console.error(`  Message: ${error.message}`);
        process.exit(1);
    }
};

// Export both function and cloudinary instance
module.exports = {
    cloudinaryConnect,
    cloudinary,
};


