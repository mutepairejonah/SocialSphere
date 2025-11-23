import type { Express } from "express";
import { createServer, type Server } from "http";
import { Server as SocketIOServer } from "socket.io";
import { storage } from "./storage";
import { nanoid } from "nanoid";

const activeUsers = new Map<string, string>(); // userId -> socketId
const conversationMessages = new Map<string, any[]>(); // conversationId -> messages

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  const io = new SocketIOServer(httpServer, {
    cors: { origin: "*", methods: ["GET", "POST"] }
  });

  // API Routes
  app.get("/api/search/posts", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) return res.json({ results: [] });
      
      const results = await storage.searchPosts(query);
      res.json({ results });
    } catch (error) {
      console.error("Search error:", error);
      res.json({ results: [] });
    }
  });

  app.get("/api/posts", async (req, res) => {
    try {
      const posts = await storage.getPosts();
      res.json(posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.json([]);
    }
  });

  app.get("/api/posts/user/:userId", async (req, res) => {
    try {
      const posts = await storage.getPostsByUser(req.params.userId);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching user posts:", error);
      res.json([]);
    }
  });

  app.post("/api/posts", async (req, res) => {
    try {
      const { userId, caption, imageUrl, videoUrl, mediaType, location } = req.body;
      const post = await storage.createPost({
        id: nanoid(),
        userId,
        caption,
        imageUrl,
        videoUrl,
        mediaType,
        location,
      });
      res.json(post);
    } catch (error) {
      console.error("Error creating post:", error);
      res.status(500).json({ error: "Failed to create post" });
    }
  });

  app.get("/api/stories", async (req, res) => {
    try {
      const stories = await storage.getStories();
      res.json(stories);
    } catch (error) {
      console.error("Error fetching stories:", error);
      res.json([]);
    }
  });

  app.post("/api/stories", async (req, res) => {
    try {
      const { userId, imageUrl } = req.body;
      const story = await storage.createStory({
        id: nanoid(),
        userId,
        imageUrl,
      });
      res.json(story);
    } catch (error) {
      console.error("Error creating story:", error);
      res.status(500).json({ error: "Failed to create story" });
    }
  });

  app.post("/api/follow/:userId", async (req, res) => {
    try {
      const { followerId } = req.body;
      const isFollowing = await storage.toggleFollow(followerId, req.params.userId);
      res.json({ isFollowing });
    } catch (error) {
      console.error("Error toggling follow:", error);
      res.status(500).json({ error: "Failed to toggle follow" });
    }
  });

  // Socket.io connection handling
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // User joins (register their socket)
    socket.on("user:join", (userId: string) => {
      activeUsers.set(userId, socket.id);
      socket.data.userId = userId;
      console.log(`User ${userId} joined with socket ${socket.id}`);
    });

    // Send message in real-time
    socket.on("message:send", (data) => {
      const { senderId, recipientId, message, timestamp, conversationId } = data;
      
      // Store message
      const convId = conversationId || [senderId, recipientId].sort().join("_");
      if (!conversationMessages.has(convId)) {
        conversationMessages.set(convId, []);
      }
      conversationMessages.get(convId)!.push({
        id: Date.now().toString(),
        senderId,
        recipientId,
        message,
        timestamp,
        read: false
      });

      // Send to recipient if online
      const recipientSocketId = activeUsers.get(recipientId);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("message:receive", {
          id: Date.now().toString(),
          senderId,
          recipientId,
          message,
          timestamp,
          read: false
        });
        
        // Send notification
        io.to(recipientSocketId).emit("notification:new", {
          id: Date.now().toString(),
          type: "message",
          userId: senderId,
          fromUserId: senderId,
          messageText: message,
          timestamp: new Date().toLocaleTimeString(),
          read: false,
          userAvatar: ""
        });
      }

      // Acknowledge to sender
      socket.emit("message:sent", { messageId: Date.now().toString() });
    });

    // Load messages for conversation
    socket.on("messages:load", (data) => {
      const { senderId, recipientId } = data;
      const convId = [senderId, recipientId].sort().join("_");
      const messages = conversationMessages.get(convId) || [];
      socket.emit("messages:loaded", messages);
    });

    // User disconnects
    socket.on("disconnect", () => {
      if (socket.data.userId) {
        activeUsers.delete(socket.data.userId);
        console.log(`User ${socket.data.userId} disconnected`);
      }
    });
  });

  return httpServer;
}
