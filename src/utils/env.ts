import dotenv from "dotenv";
dotenv.config();
export const DATABASE_URL: string = process.env.DATABASE_URL || "";
export const SECRET: string = process.env.SECRET || "";

export const CLIENT_HOST:string = process.env.CLIENT_HOST || "http://localhost:3001";