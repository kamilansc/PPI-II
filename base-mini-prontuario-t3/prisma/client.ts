import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";
import "dotenv/config";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL não foi definida");
}
const adapter = new PrismaBetterSqlite3({
  url: databaseUrl,
});

export const prisma = new PrismaClient({ adapter });