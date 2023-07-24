const dotenv = require("dotenv");
dotenv.config({ path: `.env.development` });

const variables = {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    MONGODB_CONNECTION: process.env.MONGODB_CONNECTION,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY
};

module.exports = variables