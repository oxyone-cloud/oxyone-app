import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "./db";
import { stockChambres, insertStockSchema } from "@shared/schema";
import { eq } from "drizzle-orm";

// Données de secours en mémoire si PostgreSQL n'est pas encore actif
let mockStock: any[] = [
  {
    id: 1,
    codeBarre: "3700012345678",
    codeLot: "LOT-2026-01",
    nomProduit: "Poisson Congelé (Exemple)",
    emplacement: "Chambre A1",
    quantiteKg: "500",
    temperatureC: "-18",
    statut: "Conforme",
  }
];

export async function registerRoutes(app: Express): Promise<Server> {
  // GET /api/stock
  app.get("/api/stock", async (_req, res) => {
    try {
      if (db) {
        const items = await db.select().from(stockChambres);
        return res.json(items);
      }
      res.json(mockStock);
    } catch (err) {
      res.json(mockStock);
    }
  });

  // POST /api/stock
  app.post("/api/stock", async (req, res) => {
    try {
      const parse = insertStockSchema.safeParse(req.body);
      if (!parse.success) {
        return res.status(400).json({ error: parse.error });
      }

      if (db) {
        const [inserted] = await db.insert(stockChambres).values(parse.data).returning();
        return res.status(201).json(inserted);
      }

      const newItem = { id: Date.now(), ...parse.data };
      mockStock.push(newItem);
      res.status(201).json(newItem);
    } catch (err) {
      res.status(500).json({ error: "Erreur lors de l'enregistrement du lot" });
    }
  });

  // DELETE /api/stock/:id
  app.delete("/api/stock/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (db) {
        await db.delete(stockChambres).where(eq(stockChambres.id, id));
      } else {
        mockStock = mockStock.filter((item) => item.id !== id);
      }
      res.sendStatus(204);
    } catch (err) {
      res.status(500).json({ error: "Erreur lors de la suppression" });
    }
  });

  // Crée et retourne l'instance du serveur HTTP attendue par server/index.ts
  const httpServer = createServer(app);
  return httpServer;
}