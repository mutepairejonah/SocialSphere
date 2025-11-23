import { pgTable, varchar, text, timestamp, boolean, integer, decimal, json, uuid, unique } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { z } from "zod";

// ========== USERS TABLE ==========
export const users = pgTable("users", {
  id: varchar("id").primaryKey(),
  username: varchar("username", { length: 30 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  fullName: varchar("full_name", { length: 100 }),
  bio: text("bio"),
  avatar: text("avatar"),
  website: varchar("website", { length: 500 }),
  isPrivate: boolean("is_private").default(false),
  isVerified: boolean("is_verified").default(false),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ========== STORIES TABLE ==========
export const stories = pgTable("stories", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  imageUrl: text("image_url").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  expiresAt: timestamp("expires_at"),
  isViewed: boolean("is_viewed").default(false),
});

// ========== POSTS TABLE ==========
export const posts = pgTable("posts", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  caption: text("caption"),
  imageUrl: text("image_url"),
  videoUrl: text("video_url"),
  mediaType: varchar("media_type", { length: 20 }).default("IMAGE"),
  location: varchar("location", { length: 255 }),
  likes: integer("likes").default(0),
  commentCount: integer("comment_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ========== FOLLOWS TABLE ==========
export const follows = pgTable("follows", {
  id: varchar("id").primaryKey(),
  followerId: varchar("follower_id").notNull().references(() => users.id),
  followingId: varchar("following_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  unique("unique_follow").on(table.followerId, table.followingId)
]);

// ========== MESSAGES TABLE ==========
export const messages = pgTable("messages", {
  id: varchar("id").primaryKey(),
  senderId: varchar("sender_id").notNull().references(() => users.id),
  recipientId: varchar("recipient_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// ========== COMMENTS TABLE ==========
export const comments = pgTable("comments", {
  id: varchar("id").primaryKey(),
  postId: varchar("post_id").notNull().references(() => posts.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  text: text("text").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  stories: many(stories),
  messagesFrom: many(messages, { relationName: "sender" }),
  messagesTo: many(messages, { relationName: "recipient" }),
  followedBy: many(follows, { relationName: "follower" }),
  following: many(follows, { relationName: "following" }),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
  user: one(users, { fields: [posts.userId], references: [users.id] }),
  comments: many(comments),
}));

export const storiesRelations = relations(stories, ({ one }) => ({
  user: one(users, { fields: [stories.userId], references: [users.id] }),
}));

// Zod schemas for validation
export const insertUserSchema = z.object({
  id: z.string(),
  username: z.string().min(3).max(30),
  email: z.string().email(),
  fullName: z.string().max(100).optional(),
  bio: z.string().max(500).optional(),
  avatar: z.string().url().optional(),
  website: z.string().url().optional(),
});

export const insertPostSchema = z.object({
  id: z.string(),
  userId: z.string(),
  caption: z.string().max(2200).optional(),
  imageUrl: z.string().url().optional(),
  videoUrl: z.string().url().optional(),
  mediaType: z.string().optional(),
  location: z.string().optional(),
});

export const insertStorySchema = z.object({
  id: z.string(),
  userId: z.string(),
  imageUrl: z.string().url(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Post = typeof posts.$inferSelect;
export type InsertPost = z.infer<typeof insertPostSchema>;
export type Story = typeof stories.$inferSelect;
export type InsertStory = z.infer<typeof insertStorySchema>;
export type Follow = typeof follows.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type Comment = typeof comments.$inferSelect;
