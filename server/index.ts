import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Middleware de journalisation (Logging)
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let line = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        line += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (line.length > 80) {
        line = line.slice(0, 79) + "…";
      }
      log(line);
    }
  });

  next();
});

(async () => {
  // Enregistrement des routes API et création de l'instance HTTP Server
  const server = await registerRoutes(app);

  // Configuration selon l'environnement (Vite dev server vs Static build)
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Middleware global de gestion d'erreurs (SANS 'throw err')
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    // Evite d'envoyer la réponse deux fois si déjà fermée
    if (!res.headersSent) {
      res.status(status).json({ message });
    }
    // Log propre de l'erreur côté serveur
    console.error("❌ Error handler intercept:", err);
  });

  // Écoute sur le port fourni par Replit/l'environnement ou 5000 par défaut
  const PORT = Number(process.env.PORT) || 5000;
  server.listen(PORT, "0.0.0.0", () => {
    log(`serving on port ${PORT}`);
  });
})();