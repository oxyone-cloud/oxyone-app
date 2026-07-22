import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ 
      status: "ok", 
      service: "SSCI Cold Room Simulator",
      timestamp: new Date().toISOString() 
    });
  });

  // Vos autres routes API peuvent être ajoutées ici...

  const httpServer = createServer(app);
  return httpServer;
}