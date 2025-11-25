import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schema";
import path from "path";

// Create data directory if it doesn't exist
const dataDir = process.env.SQLITE_DB_PATH ? path.dirname(process.env.SQLITE_DB_PATH) : "./data";
const dbPath = process.env.SQLITE_DB_PATH || path.join(dataDir, "sqlite.db");

// Ensure directory exists
import { mkdirSync } from "fs";
try {
  mkdirSync(dataDir, { recursive: true });
} catch (e) {
  // Directory already exists
}

const sqlite = new Database(dbPath);
sqlite.pragma("journal_mode = WAL");
export const db = drizzle(sqlite, { schema });
