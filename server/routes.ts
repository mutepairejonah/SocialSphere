import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // User sync endpoint
  app.post("/api/users", async (req, res) => {
    try {
      const { id, username, email, fullName, avatar } = req.body;
      if (!id || !username || !email) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const existingUser = await storage.getUser(id);
      let user;
      
      if (existingUser) {
        user = await storage.updateUser(id, {
          username: username.toLowerCase(),
          email,
          fullName: fullName || existingUser.fullName,
          avatar: avatar || existingUser.avatar,
        });
      } else {
        user = await storage.createUser({
          id,
          username: username.toLowerCase(),
          email,
          fullName: fullName || "",
          avatar: avatar || "",
        });
      }
      
      res.json(user);
    } catch (error) {
      console.error("Error syncing user:", error);
      res.status(500).json({ error: "Failed to sync user" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) return res.status(404).json({ error: "User not found" });
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  app.put("/api/users/:id", async (req, res) => {
    try {
      const { fullName, bio, website, avatar } = req.body;
      const user = await storage.updateUser(req.params.id, {
        fullName,
        bio,
        website,
        avatar,
      });
      res.json(user);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Failed to update user" });
    }
  });

  // Instagram accounts endpoints
  app.post("/api/instagram-accounts", async (req, res) => {
    try {
      const { userId, token, accountName, instagramUsername, instagramEmail, instagramPhone } = req.body;
      if (!userId || !token) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      res.json({ success: true, message: "Account added" });
    } catch (error) {
      console.error("Error adding Instagram account:", error);
      res.status(500).json({ error: "Failed to add account" });
    }
  });

  app.get("/api/instagram-accounts/recommendations", async (req, res) => {
    try {
      const { email, phone } = req.query;
      // This is a stub - real data is in Firestore
      res.json({ recommendations: [] });
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      res.status(500).json({ error: "Failed to fetch recommendations" });
    }
  });

  app.delete("/api/instagram-accounts/:id", async (req, res) => {
    try {
      res.json({ success: true });
    } catch (error) {
      console.error("Error removing Instagram account:", error);
      res.status(500).json({ error: "Failed to remove account" });
    }
  });

  return httpServer;
}
