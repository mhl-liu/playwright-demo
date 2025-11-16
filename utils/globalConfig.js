import dotenv from 'dotenv';// Import the dotenv library, which loads environment variables from a .env file


// Load the .env file and attach its variables to process.env
// For example: BASE_URL=https://xxx.com will become available as process.env.BASE_URL
dotenv.config();

// Export a configuration object so other files can import and use it
export const config = {
    // Read BASE_URL from environment variables
    baseUrl: process.env.BASE_URL,
    // Read ENV from environment variables; default to 'test' if not provided
    // Useful for switching between different environments (dev/test/prod)
    env: process.env.ENV || 'test',

};