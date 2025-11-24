import { db } from "../shared/db";
import { users, posts, stories, messages, comments, notifications } from "../shared/schema";
import { eq, like, and, desc, sql, inArray } from "drizzle-orm";
import type { InsertUser, InsertPost, InsertStory, User, Post, Story } from "../shared/schema";
import { leftJoin } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User>;
  
  // Posts
  getPosts(): Promise<Post[]>;
  getPostsByUser(userId: string): Promise<Post[]>;
  getPostsFromFollowing(userId: string): Promise<Post[]>;
  createPost(post: InsertPost): Promise<Post>;
  updatePost(id: string, updates: Partial<Post>): Promise<Post>;
  
  // Stories
  getStories(): Promise<Story[]>;
  getStoriesByUser(userId: string): Promise<Story[]>;
  getStoriesFromFollowing(userId: string): Promise<Story[]>;
  createStory(story: InsertStory): Promise<Story>;
  
  // Search
  searchPosts(query: string): Promise<Post[]>;
  searchUsers(query: string): Promise<User[]>;
  
  // Messages
  getMessages(senderId: string, recipientId: string): Promise<any[]>;
  createMessage(senderId: string, recipientId: string, content: string): Promise<any>;

  // Notifications
  getNotifications(userId: string): Promise<any[]>;
  createNotification(userId: string, fromUserId: string, type: string, postId?: string): Promise<void>;
}

export class PostgresStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const result = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return result[0];
  }

  async getPosts(): Promise<any[]> {
    const result = await db.select({
      id: posts.id,
      userId: posts.userId,
      caption: posts.caption,
      imageUrl: posts.imageUrl,
      videoUrl: posts.videoUrl,
      mediaType: posts.mediaType,
      location: posts.location,
      likes: posts.likes,
      commentCount: posts.commentCount,
      createdAt: posts.createdAt,
      updatedAt: posts.updatedAt,
      username: users.username,
      userAvatar: users.avatar,
    })
    .from(posts)
    .leftJoin(users, eq(posts.userId, users.id))
    .orderBy(desc(posts.createdAt));
    return result;
  }

  async getPostsByUser(userId: string): Promise<any[]> {
    const result = await db.select({
      id: posts.id,
      userId: posts.userId,
      caption: posts.caption,
      imageUrl: posts.imageUrl,
      videoUrl: posts.videoUrl,
      mediaType: posts.mediaType,
      location: posts.location,
      likes: posts.likes,
      commentCount: posts.commentCount,
      createdAt: posts.createdAt,
      updatedAt: posts.updatedAt,
      username: users.username,
      userAvatar: users.avatar,
    })
    .from(posts)
    .leftJoin(users, eq(posts.userId, users.id))
    .where(eq(posts.userId, userId))
    .orderBy(desc(posts.createdAt));
    return result;
  }

  async createPost(post: InsertPost): Promise<Post> {
    const result = await db.insert(posts).values(post).returning();
    return result[0];
  }

  async updatePost(id: string, updates: Partial<Post>): Promise<Post> {
    const result = await db.update(posts).set(updates).where(eq(posts.id, id)).returning();
    return result[0];
  }

  async getStories(): Promise<Story[]> {
    const oneDay = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return db.select().from(stories)
      .where(sql`${stories.createdAt} > ${oneDay}`)
      .orderBy(desc(stories.createdAt));
  }

  async getStoriesByUser(userId: string): Promise<Story[]> {
    const oneDay = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return db.select().from(stories)
      .where(and(eq(stories.userId, userId), sql`${stories.createdAt} > ${oneDay}`))
      .orderBy(desc(stories.createdAt));
  }

  async createStory(story: InsertStory): Promise<Story> {
    const result = await db.insert(stories).values({
      ...story,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    }).returning();
    return result[0];
  }

  async searchPosts(query: string): Promise<Post[]> {
    return db.select().from(posts)
      .where(like(posts.caption, `%${query}%`))
      .orderBy(desc(posts.createdAt));
  }

  async searchUsers(query: string): Promise<User[]> {
    const searchPattern = `%${query.toLowerCase()}%`;
    return db.select().from(users)
      .where(sql`LOWER(${users.username}) LIKE ${searchPattern} OR LOWER(${users.fullName}) LIKE ${searchPattern}`)
      .limit(10);
  }

  async getPostsFromFollowing(userId: string): Promise<any[]> {
    const result = await db.select({
      id: posts.id,
      userId: posts.userId,
      caption: posts.caption,
      imageUrl: posts.imageUrl,
      videoUrl: posts.videoUrl,
      mediaType: posts.mediaType,
      location: posts.location,
      likes: posts.likes,
      commentCount: posts.commentCount,
      createdAt: posts.createdAt,
      updatedAt: posts.updatedAt,
      username: users.username,
      userAvatar: users.avatar,
    })
    .from(posts)
    .leftJoin(users, eq(posts.userId, users.id))
    .orderBy(desc(posts.createdAt));
    return result;
  }

  async getStoriesFromFollowing(userId: string): Promise<Story[]> {
    const oneDay = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return db.select().from(stories)
      .where(sql`${stories.createdAt} > ${oneDay}`)
      .orderBy(desc(stories.createdAt));
  }

  async getMessages(senderId: string, recipientId: string): Promise<any[]> {
    return db.select().from(messages)
      .where(sql`(${messages.senderId} = ${senderId} AND ${messages.recipientId} = ${recipientId}) 
                 OR (${messages.senderId} = ${recipientId} AND ${messages.recipientId} = ${senderId})`)
      .orderBy(desc(messages.createdAt));
  }

  async createMessage(senderId: string, recipientId: string, content: string): Promise<any> {
    const result = await db.insert(messages).values({
      id: crypto.randomUUID(),
      senderId,
      recipientId,
      content,
    }).returning();
    return result[0];
  }

  async getNotifications(userId: string): Promise<any[]> {
    const userNotifs = await db.select().from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt))
      .limit(50);
    
    const withUser = await Promise.all(userNotifs.map(async (notif) => {
      const fromUser = await this.getUser(notif.fromUserId);
      return {
        ...notif,
        fromUserUsername: fromUser?.username,
        fromUserAvatar: fromUser?.avatar
      };
    }));
    
    return withUser;
  }

  async createNotification(userId: string, fromUserId: string, type: string, postId?: string): Promise<void> {
    await db.insert(notifications).values({
      id: crypto.randomUUID(),
      userId,
      fromUserId,
      type,
      postId: postId || null
    });
  }
}

export const storage = new PostgresStorage();
