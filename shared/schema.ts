import { sqliteTable, text, integer, primaryKey } from "drizzle-orm/sqlite-core";
import { z } from "zod";

// ========== USERS TABLE (Firebase auth sync only) ==========
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  fullName: text("full_name"),
  avatar: text("avatar"),
  bio: text("bio"),
  website: text("website"),
  activeInstagramAccountId: integer("active_instagram_account_id"),
  createdAt: text("created_at").default(new Date().toISOString()),
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
export const instagramAccounts = sqliteTable("instagram_accounts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull(),
  token: text("token").notNull(),
  accountName: text("account_name"),
  instagramUsername: text("instagram_username"),
  instagramEmail: text("instagram_email"),
  instagramPhone: text("instagram_phone"),
  createdAt: text("created_at").default(new Date().toISOString()),
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
