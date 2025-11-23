import { z } from "zod";

// User Schema
export const userSchema = z.object({
  id: z.string(),
  username: z.string().min(3).max(50),
  fullName: z.string().min(1).max(100),
  email: z.string().email(),
  avatar: z.string().url().optional(),
  bio: z.string().max(500).optional(),
  website: z.string().url().optional(),
  followers: z.number().default(0),
  following: z.number().default(0),
  createdAt: z.string(),
});

export const insertUserSchema = userSchema.omit({ id: true, createdAt: true });

export type User = z.infer<typeof userSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;

// Post Schema
export const postSchema = z.object({
  id: z.string(),
  userId: z.string(),
  imageUrl: z.string().url(),
  caption: z.string().max(2200).optional(),
  location: z.string().optional(),
  likes: z.number().default(0),
  comments: z.number().default(0),
  timestamp: z.string(),
  isLiked: z.boolean().default(false),
  isSaved: z.boolean().default(false),
});

export const insertPostSchema = postSchema.omit({ 
  id: true, 
  timestamp: true, 
  likes: true, 
  comments: true, 
  isLiked: true, 
  isSaved: true 
});

export type Post = z.infer<typeof postSchema>;
export type InsertPost = z.infer<typeof insertPostSchema>;

// Follow Schema
export const followSchema = z.object({
  id: z.string(),
  followerId: z.string(),
  followingId: z.string(),
  createdAt: z.string(),
});

export const insertFollowSchema = followSchema.omit({ id: true, createdAt: true });

export type Follow = z.infer<typeof followSchema>;
export type InsertFollow = z.infer<typeof insertFollowSchema>;

// Like Schema
export const likeSchema = z.object({
  id: z.string(),
  userId: z.string(),
  postId: z.string(),
  createdAt: z.string(),
});

export const insertLikeSchema = likeSchema.omit({ id: true, createdAt: true });

export type Like = z.infer<typeof likeSchema>;
export type InsertLike = z.infer<typeof insertLikeSchema>;

// Save Schema
export const saveSchema = z.object({
  id: z.string(),
  userId: z.string(),
  postId: z.string(),
  createdAt: z.string(),
});

export const insertSaveSchema = saveSchema.omit({ id: true, createdAt: true });

export type Save = z.infer<typeof saveSchema>;
export type InsertSave = z.infer<typeof insertSaveSchema>;

// Notification Schema
export const notificationSchema = z.object({
  id: z.string(),
  userId: z.string(),
  type: z.enum(['like', 'comment', 'follow']),
  fromUserId: z.string(),
  postId: z.string().optional(),
  read: z.boolean().default(false),
  createdAt: z.string(),
});

export const insertNotificationSchema = notificationSchema.omit({ id: true, createdAt: true });

export type Notification = z.infer<typeof notificationSchema>;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
