import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

export const CLOUDINARY_API_KEY: string = process.env.CLOUDINARY_API_KEY || "";
export const CLOUDINARY_API_SECRET: string =
  process.env.CLOUDINARY_API_SECRET || "";
export const CLOUDINARY_CLOUD_NAME: string =
  process.env.CLOUDINARY_CLOUD_NAME || "";
export const DATABASE_URL: string = process.env.DATABASE_URL || "";
export const SECRET: string = process.env.SECRET || "secret";
export const COMPANY_NAME: string = process.env.COMPANY_NAME || "Test";
export const CONTACT_EMAIL: string = process.env.CONTACT_EMAIL || "noreply@mail.com";
