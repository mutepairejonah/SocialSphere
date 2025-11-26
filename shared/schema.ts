import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey(),
  firebaseId: text("firebase_id").notNull().unique(),
  username: text("username").notNull().unique(),
  fullName: text("full_name"),
  email: text("email").notNull(),
  avatar: text("avatar"),
  bio: text("bio"),
  website: text("website"),
});

export const instagramAccounts = sqliteTable("instagram_accounts", {
  id: integer("id").primaryKey(),
  userId: integer("user_id").notNull(),
  accountId: text("account_id").notNull(),
  username: text("username").notNull(),
  displayName: text("display_name"),
  profilePicture: text("profile_picture"),
  accessToken: text("access_token").notNull(),
  followerCount: integer("follower_count").default(0),
  followingCount: integer("following_count").default(0),
  mediaCount: integer("media_count").default(0),
});

export const bookmarks = sqliteTable("bookmarks", {
  id: integer("id").primaryKey(),
  userId: integer("user_id").notNull(),
  postId: text("post_id").notNull(),
  postUrl: text("post_url"),
  caption: text("caption"),
  mediaUrl: text("media_url"),
  mediaType: text("media_type"), // IMAGE, VIDEO, CAROUSEL
  timestamp: integer("timestamp").notNull(),
});

export const cachedPosts = sqliteTable("cached_posts", {
  id: integer("id").primaryKey(),
  postId: text("post_id").notNull().unique(),
  instagramAccountId: integer("instagram_account_id").notNull(),
  caption: text("caption"),
  mediaUrl: text("media_url"),
  mediaType: text("media_type"),
  likeCount: integer("like_count").default(0),
  commentsCount: integer("comments_count").default(0),
  timestamp: integer("timestamp"),
  cachedAt: integer("cached_at").notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertInstagramAccountSchema = createInsertSchema(instagramAccounts).omit({ id: true });
export const insertBookmarkSchema = createInsertSchema(bookmarks).omit({ id: true });
export const insertCachedPostSchema = createInsertSchema(cachedPosts).omit({ id: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type InstagramAccount = typeof instagramAccounts.$inferSelect;
export type InsertInstagramAccount = z.infer<typeof insertInstagramAccountSchema>;

export type Bookmark = typeof bookmarks.$inferSelect;
export type InsertBookmark = z.infer<typeof insertBookmarkSchema>;

export type CachedPost = typeof cachedPosts.$inferSelect;
export type InsertCachedPost = z.infer<typeof insertCachedPostSchema>;
