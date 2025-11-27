import { pgTable, varchar, text, timestamp, integer, serial, boolean } from "drizzle-orm/pg-core";
import { z } from "zod";

// ========== USERS TABLE (Firebase auth sync only) ==========
export const users = pgTable("users", {
  id: varchar("id").primaryKey(),
  username: varchar("username", { length: 30 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  fullName: varchar("full_name", { length: 100 }),
  avatar: text("avatar"),
  bio: text("bio"),
  website: varchar("website", { length: 500 }),
  activeInstagramAccountId: integer("active_instagram_account_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type User = typeof users.$inferSelect;

export const insertUserSchema = z.object({
  id: z.string(),
  username: z.string().min(3).max(30),
  email: z.string().email(),
  fullName: z.string().max(100).optional(),
  avatar: z.string().optional(),
  bio: z.string().max(500).optional(),
  website: z.string().max(500).optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;

// ========== INSTAGRAM ACCOUNTS TABLE ==========
export const instagramAccounts = pgTable("instagram_accounts", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  token: text("token").notNull(),
  accountName: varchar("account_name", { length: 100 }),
  instagramUsername: varchar("instagram_username", { length: 100 }),
  instagramEmail: varchar("instagram_email", { length: 255 }),
  instagramPhone: varchar("instagram_phone", { length: 20 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export type InstagramAccount = typeof instagramAccounts.$inferSelect;

export const insertInstagramAccountSchema = z.object({
  userId: z.string(),
  token: z.string(),
  accountName: z.string().max(100).optional(),
  instagramUsername: z.string().max(100).optional(),
  instagramEmail: z.string().email().optional(),
  instagramPhone: z.string().max(20).optional(),
});

export type InsertInstagramAccount = z.infer<typeof insertInstagramAccountSchema>;
