import { db } from "../shared/db";
import { users, posts, stories, follows, messages, comments } from "../shared/schema";
import { eq, like, and, desc, sql } from "drizzle-orm";
import type { InsertUser, InsertPost, InsertStory, User, Post, Story } from "../shared/schema";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User>;
  getFollowingIds(userId: string): Promise<string[]>;
  
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
  
  // Follows
  toggleFollow(followerId: string, followingId: string): Promise<boolean>;
  isFollowing(followerId: string, followingId: string): Promise<boolean>;
  
  // Messages
  getMessages(senderId: string, recipientId: string): Promise<any[]>;
  createMessage(senderId: string, recipientId: string, content: string): Promise<any>;
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

  async getPosts(): Promise<Post[]> {
    return db.select().from(posts).orderBy(desc(posts.createdAt));
  }

  async getPostsByUser(userId: string): Promise<Post[]> {
    return db.select().from(posts).where(eq(posts.userId, userId)).orderBy(desc(posts.createdAt));
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
    return db.select().from(users)
      .where(like(users.username, `%${query}%`))
      .limit(10);
  }

  async toggleFollow(followerId: string, followingId: string): Promise<boolean> {
    const existing = await db.select().from(follows)
      .where(and(eq(follows.followerId, followerId), eq(follows.followingId, followingId)));
    
    if (existing.length > 0) {
      await db.delete(follows).where(and(
        eq(follows.followerId, followerId),
        eq(follows.followingId, followingId)
      ));
      return false;
    } else {
      await db.insert(follows).values({ id: crypto.randomUUID(), followerId, followingId });
      return true;
    }
  }

  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    const result = await db.select().from(follows)
      .where(and(eq(follows.followerId, followerId), eq(follows.followingId, followingId)));
    return result.length > 0;
  }

  async getFollowingIds(userId: string): Promise<string[]> {
    const result = await db.select({ followingId: follows.followingId }).from(follows)
      .where(eq(follows.followerId, userId));
    return result.map(r => r.followingId);
  }

  async getPostsFromFollowing(userId: string): Promise<Post[]> {
    const followingIds = await this.getFollowingIds(userId);
    if (followingIds.length === 0) return [];
    
    return db.select().from(posts)
      .where(sql`${posts.userId} IN (${sql.raw(followingIds.map(id => `'${id}'`).join(','))})`)
      .orderBy(desc(posts.createdAt));
  }

  async getStoriesFromFollowing(userId: string): Promise<Story[]> {
    const followingIds = await this.getFollowingIds(userId);
    if (followingIds.length === 0) return [];
    
    const oneDay = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return db.select().from(stories)
      .where(and(
        sql`${stories.userId} IN (${sql.raw(followingIds.map(id => `'${id}'`).join(','))})`,
        sql`${stories.createdAt} > ${oneDay}`
      ))
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
}

export const storage = new PostgresStorage();
