import dotenv from "dotenv";
dotenv.config();

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT || 5000),
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:5173",
  JWT_SECRET: process.env.JWT_SECRET || "change_me",
  DATABASE_URL: process.env.DATABASE_URL || "",
  COMPANY_DEFAULT_COUNTRY: process.env.COMPANY_DEFAULT_COUNTRY || "IN",
  EXCHANGE_API_URL: process.env.EXCHANGE_API_URL || "https://api.exchangerate.host"
};
