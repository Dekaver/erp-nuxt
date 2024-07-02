import * as dotenv from "dotenv";
dotenv.config();

const config = {
    port: process.env.PORT || 4000,
    DATABASE_URL: process.env.DATABASE_URL as string,
    JWT_SECRET: process.env.JWT_SECRET as string,
    CORS: process.env.CORS as string,
    PORT: process.env.PORT as string,
    SECURE: (process.env.SECURE as string) == "TRUE" ? true : false,
    CAPTCHA_KEY: process.env.CAPTCHA_KEY as string,
    CAPTCHA_SECRET: process.env.CAPTCHA_SECRET as string,
    DISABLE_CAPTCHA: (process.env.DISABLE_CAPTCHA as string) == "TRUE" ? false : true,
};

// Ensure required environment variables are present
if (!config.DATABASE_URL) {
    throw new Error("Missing required environment variables.");
}

export default config;
