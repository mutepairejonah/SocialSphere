import { pgTable, varchar, text, timestamp, integer } from "drizzle-orm/pg-core";
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
