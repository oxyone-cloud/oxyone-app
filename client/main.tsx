import React from "react";
import { createRoot } from "react-dom/client";

// On définit l'interface directement ici pour éviter les erreurs d'importation de fichiers manquants
function App() {
  return (
    <div style={{ backgroundColor: '#0f172a', color: '#00ff41', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', fontFamily: 'monospace' }}>
      <h1 style={{ border: '2px solid #00ff41', padding: '20px' }}>OxyONE : SYSTÈME OPÉRATIONNEL</h1>
      <p style={{ color: '#94a3b8' }}>Liaison avec la chambre froide établie...</p>
    </div>
  );
}

const rootElement = document.getElementById("root");

if (rootElement) {
  // Cette ligne va effacer le message [ DIAGNOSTIC SYSTÈME ] et afficher l'interface
  createRoot(rootElement).render(<App />);
} else {
  console.error("L'élément 'root' n'a pas été trouvé dans le HTML.");
}