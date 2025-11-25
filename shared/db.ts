import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schema";
import path from "path";
import { mkdirSync } from "fs";

// Create data directory if it doesn't exist
const dataDir = process.env.SQLITE_DB_PATH 
  ? path.dirname(process.env.SQLITE_DB_PATH) 
  : "./data";
const dbPath = process.env.SQLITE_DB_PATH || path.join(dataDir, "sqlite.db");

// Ensure directory exists
try {
  mkdirSync(dataDir, { recursive: true });
} catch (e) {
  // Directory already exists
}

const sqlite = new Database(dbPath);
sqlite.pragma("journal_mode = WAL");

export const db = drizzle(sqlite, { schema });

// Initialize tables on startup
export async function initializeDb() {
  try {
    // Create users table if it doesn't exist
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        full_name TEXT,
        avatar TEXT,
        bio TEXT,
        website TEXT,
        active_instagram_account_id INTEGER,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create instagram_accounts table if it doesn't exist
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS instagram_accounts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        token TEXT NOT NULL,
        account_name TEXT,
        instagram_username TEXT,
        instagram_email TEXT,
        instagram_phone TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("✅ Database tables initialized");
  } catch (error) {
    console.error("❌ Failed to initialize database:", error);
    throw error;
  }
}
