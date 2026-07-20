import express, { Express } from "express";
import path from "path";
import { fileURLToPath } from "url";

export function serveStatic(app: Express) {
  // Gestion propre des chemins absolue que l'on soit en ESM ou CJS
  const distPath = path.resolve(__dirname, "public");
  const rootDistPath = path.resolve(process.cwd(), "dist", "public");

  // Test successif des deux emplacements probables de production
  const finalPath = require("fs").existsSync(distPath) ? distPath : rootDistPath;

  app.use(express.static(finalPath));

  // Redirection de toutes les routes de navigation vers le index.html (Single Page Application)
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) {
      return next();
    }
    res.sendFile(path.join(finalPath, "index.html"));
  });
}