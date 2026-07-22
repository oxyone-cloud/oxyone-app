import { pgTable, text, serial, numeric, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const stockChambres = pgTable("stock_chambres", {
  id: serial("id").primaryKey(),
  codeBarre: text("code_barre").notNull(),
  codeLot: text("code_lot").notNull(),
  nomProduit: text("nom_produit").notNull(),
  emplacement: text("emplacement").notNull(),
  quantiteKg: numeric("quantite_kg").notNull(),
  temperatureC: numeric("temperature_c").notNull(),
  dureeMaxJours: integer("duree_max_jours").notNull().default(30),
  statut: text("statut").notNull().default("Conforme"),
  misEnStockLe: timestamp("mis_en_stock_le").defaultNow().notNull(),
});

export const insertStockSchema = createInsertSchema(stockChambres).omit({
  id: true,
  misEnStockLe: true,
});

export type InsertStock = z.infer<typeof insertStockSchema>;
export type StockItem = typeof stockChambres.$inferSelect;