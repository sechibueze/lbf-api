import dotenv from 'dotenv';
dotenv.config();

export const appConfig = {
  APP_ID: 'Pamundo',
  DATABASE_URI: process.env.DATABASE_URI,
  COURIER_AUTH_TOKEN: process.env.COURIER_AUTH_TOKEN,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  COURIER_TEMPLATE_ID: process.env.COURIER_TEMPLATE_ID,
  FRONTEND_URL: process.env.FRONTEND_URL,
};
