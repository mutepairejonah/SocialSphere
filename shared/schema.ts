import { z } from "zod";

// ========== USERS ==========
export const userSchema = z.object({
  id: z.string().uuid(),
  username: z.string().min(3).max(30).unique("Username already taken"),
  email: z.string().email().unique("Email already registered"),
  fullName: z.string().max(100),
  bio: z.string().max(500).optional(),
  avatarUrl: z.string().url().optional(),
  website: z.string().url().optional(),
  isPrivate: z.boolean().default(false),
  isVerified: z.boolean().default(false),
  isActive: z.boolean().default(true),
  accountType: z.enum(["personal", "creator", "business"]).default("personal"),
  createdAt: z.date(),
  updatedAt: z.date(),
  lastLoginAt: z.date().optional(),
});

export const insertUserSchema = userSchema.omit({ id: true, createdAt: true, updatedAt: true });
export type User = z.infer<typeof userSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;

// ========== POSTS ==========
export const postSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  caption: z.string().max(2200).optional(),
  postType: z.enum(["photo", "video", "text", "audio", "poll", "collaborative"]),
  mediaUrls: z.array(z.string().url()).optional(),
  thumbnailUrl: z.string().url().optional(),
  aspectRatio: z.string().optional(),
  durationSeconds: z.number().optional(),
  visibility: z.enum(["public", "friends", "private", "custom"]).default("public"),
  allowComments: z.boolean().default(true),
  allowReactions: z.boolean().default(true),
  locationName: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  reactionCount: z.number().default(0),
  commentCount: z.number().default(0),
  shareCount: z.number().default(0),
  viewCount: z.number().default(0),
  isArchived: z.boolean().default(false),
  isDeleted: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
  publishedAt: z.date(),
});

export const insertPostSchema = postSchema.omit({ 
  id: true, createdAt: true, updatedAt: true, 
  reactionCount: true, commentCount: true, shareCount: true, viewCount: true
});
export type Post = z.infer<typeof postSchema>;
export type InsertPost = z.infer<typeof insertPostSchema>;

// ========== REACTIONS (Mood-Based) ==========
export const reactionSchema = z.object({
  id: z.string().uuid(),
  postId: z.string().uuid(),
  userId: z.string().uuid(),
  reactionType: z.enum(["inspired", "grateful", "curious", "excited", "thoughtful"]),
  createdAt: z.date(),
});

export const insertReactionSchema = reactionSchema.omit({ id: true, createdAt: true });
export type Reaction = z.infer<typeof reactionSchema>;
export type InsertReaction = z.infer<typeof insertReactionSchema>;

// ========== COMMENTS ==========
export const commentSchema = z.object({
  id: z.string().uuid(),
  postId: z.string().uuid(),
  userId: z.string().uuid(),
  content: z.string().min(1).max(2000),
  parentCommentId: z.string().uuid().optional(),
  threadDepth: z.number().default(0),
  mediaUrl: z.string().url().optional(),
  mediaType: z.enum(["image", "gif", "sticker"]).optional(),
  likeCount: z.number().default(0),
  replyCount: z.number().default(0),
  isEdited: z.boolean().default(false),
  isDeleted: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const insertCommentSchema = commentSchema.omit({ 
  id: true, createdAt: true, updatedAt: true, likeCount: true, replyCount: true
});
export type Comment = z.infer<typeof commentSchema>;
export type InsertComment = z.infer<typeof insertCommentSchema>;

// ========== FOLLOWS ==========
export const followSchema = z.object({
  id: z.string().uuid(),
  followerId: z.string().uuid(),
  followingId: z.string().uuid(),
  connectionType: z.enum(["follow", "close_friend", "blocked"]).default("follow"),
  notifyOnPost: z.boolean().default(true),
  createdAt: z.date(),
});

export const insertFollowSchema = followSchema.omit({ id: true, createdAt: true });
export type Follow = z.infer<typeof followSchema>;
export type InsertFollow = z.infer<typeof insertFollowSchema>;

// ========== CONVERSATIONS ==========
export const conversationSchema = z.object({
  id: z.string().uuid(),
  conversationType: z.enum(["direct", "group"]).default("direct"),
  title: z.string().max(100).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const insertConversationSchema = conversationSchema.omit({ id: true, createdAt: true, updatedAt: true });
export type Conversation = z.infer<typeof conversationSchema>;
export type InsertConversation = z.infer<typeof insertConversationSchema>;

// ========== CONVERSATION PARTICIPANTS ==========
export const conversationParticipantSchema = z.object({
  id: z.string().uuid(),
  conversationId: z.string().uuid(),
  userId: z.string().uuid(),
  isAdmin: z.boolean().default(false),
  muted: z.boolean().default(false),
  lastReadAt: z.date().optional(),
  joinedAt: z.date(),
});

export const insertConversationParticipantSchema = conversationParticipantSchema.omit({ 
  id: true, joinedAt: true 
});
export type ConversationParticipant = z.infer<typeof conversationParticipantSchema>;
export type InsertConversationParticipant = z.infer<typeof insertConversationParticipantSchema>;

// ========== MESSAGES ==========
export const messageSchema = z.object({
  id: z.string().uuid(),
  conversationId: z.string().uuid(),
  senderId: z.string().uuid(),
  content: z.string().optional(),
  messageType: z.enum(["text", "image", "video", "audio", "voice_note", "post_share"]).default("text"),
  mediaUrl: z.string().url().optional(),
  mediaThumbnailUrl: z.string().url().optional(),
  isEphemeral: z.boolean().default(false),
  expiresAt: z.date().optional(),
  replyToMessageId: z.string().uuid().optional(),
  isDeleted: z.boolean().default(false),
  isEdited: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const insertMessageSchema = messageSchema.omit({ id: true, createdAt: true, updatedAt: true });
export type Message = z.infer<typeof messageSchema>;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

// ========== STORIES ==========
export const storySchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  mediaUrl: z.string().url(),
  mediaType: z.enum(["image", "video"]),
  thumbnailUrl: z.string().url().optional(),
  stickers: z.record(z.any()).optional(),
  viewCount: z.number().default(0),
  reactionCount: z.number().default(0),
  createdAt: z.date(),
  expiresAt: z.date(),
});

export const insertStorySchema = storySchema.omit({ 
  id: true, createdAt: true, expiresAt: true, viewCount: true, reactionCount: true 
});
export type Story = z.infer<typeof storySchema>;
export type InsertStory = z.infer<typeof insertStorySchema>;

// ========== TOPICS ==========
export const topicSchema = z.object({
  id: z.string().uuid(),
  topicName: z.string().max(100).unique("Topic name already exists"),
  displayName: z.string().max(100),
  description: z.string().optional(),
  colorHex: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
  iconUrl: z.string().url().optional(),
  postCount: z.number().default(0),
  followerCount: z.number().default(0),
  isTrending: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  createdAt: z.date(),
});

export const insertTopicSchema = topicSchema.omit({ 
  id: true, createdAt: true, postCount: true, followerCount: true 
});
export type Topic = z.infer<typeof topicSchema>;
export type InsertTopic = z.infer<typeof insertTopicSchema>;

// ========== POST TOPICS ==========
export const postTopicSchema = z.object({
  id: z.string().uuid(),
  postId: z.string().uuid(),
  topicId: z.string().uuid(),
  createdAt: z.date(),
});

export const insertPostTopicSchema = postTopicSchema.omit({ id: true, createdAt: true });
export type PostTopic = z.infer<typeof postTopicSchema>;
export type InsertPostTopic = z.infer<typeof insertPostTopicSchema>;

// ========== NOTIFICATIONS ==========
export const notificationSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  notificationType: z.enum(["reaction", "comment", "follow", "mention", "message", "milestone", "system"]),
  title: z.string().max(255),
  message: z.string().optional(),
  actorId: z.string().uuid().optional(),
  postId: z.string().uuid().optional(),
  commentId: z.string().uuid().optional(),
  actionUrl: z.string().url().optional(),
  isRead: z.boolean().default(false),
  readAt: z.date().optional(),
  createdAt: z.date(),
});

export const insertNotificationSchema = notificationSchema.omit({ id: true, createdAt: true });
export type Notification = z.infer<typeof notificationSchema>;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;

// ========== USER SETTINGS ==========
export const userSettingsSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid().unique("User settings already exist"),
  profileVisibility: z.enum(["public", "private", "followers"]).default("public"),
  showActivityStatus: z.boolean().default(true),
  allowMessagesFrom: z.enum(["everyone", "following", "no_one"]).default("everyone"),
  emailNotifications: z.boolean().default(true),
  pushNotifications: z.boolean().default(true),
  notificationFrequency: z.enum(["instant", "hourly", "daily"]).default("instant"),
  autoplayVideos: z.boolean().default(true),
  dataSaverMode: z.boolean().default(false),
  darkMode: z.enum(["auto", "light", "dark"]).default("auto"),
  calmMode: z.boolean().default(false),
  timeLimitMinutes: z.number().default(0),
  hideMetrics: z.boolean().default(false),
  updatedAt: z.date(),
});

export const insertUserSettingsSchema = userSettingsSchema.omit({ id: true, updatedAt: true });
export type UserSettings = z.infer<typeof userSettingsSchema>;
export type InsertUserSettings = z.infer<typeof insertUserSettingsSchema>;
