import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";

console.log("=== Initialisation du script principal ===");

// Capturer immédiatement toutes les erreurs globales non gérées
window.addEventListener("error", (event) => {
  console.log("!!! ERREUR CRITIQUE CAPTURÉE !!!");
  const display = document.createElement("div");
  display.style.position = "fixed";
  display.style.top = "0";
  display.style.left = "0";
  display.style.width = "100%";
  display.style.height = "100%";
  display.style.backgroundColor = "#1a1a1a";
  display.style.color = "#ff4d4d";
  display.style.padding = "20px";
  display.style.fontFamily = "monospace";
  display.style.zIndex = "999999";
  display.style.whiteSpace = "pre-wrap";
  display.innerHTML = `<h1>Erreur d'exécution JavaScript détectée :</h1><p>${event.message}</p><p>Fichier : ${event.filename}</p><p>Ligne : ${event.lineno}:${event.colno}</p><p>Détails : ${event.error?.stack || 'Pas de stack trace disponible.'}</p>`;
  document.body.appendChild(display);
});

let rootElement = document.getElementById("root");
if (!rootElement) {
  rootElement = document.createElement("div");
  rootElement.id = "root";
  document.body.appendChild(rootElement);
}

try {
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log("=== Rendu initial envoyé au DOM ===");
} catch (error: any) {
  document.body.innerHTML = `<div style="color:red;padding:20px;font-family:monospace;">Erreur lors du montage initial : ${error.message}</div>`;
}
