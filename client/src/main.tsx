import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { useState, useEffect } from "react";

export default function App() {
  const [wifiConnected, setWifiConnected] = useState(false);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
      {/* Header Technique */}
      <header className="p-4 border-b border-slate-700 flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-tight">
          OxyONE | Interface SSCI
        </h1>
        <div className="flex items-center gap-2">
          <span
            className={`w-3 h-3 rounded-full ${wifiConnected ? "bg-green-500" : "bg-red-500 animate-pulse"}`}
          ></span>
          <span className="text-sm font-mono">
            {wifiConnected ? "IoT CONNECTÉ" : "RECHERCHE WIFI..."}
          </span>
        </div>
      </header>

      <main className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Zone Simulation 3D - Précision Métrique */}
        <div className="md:col-span-2 bg-black rounded-xl aspect-video flex flex-col items-center justify-center border border-slate-700 shadow-2xl">
          <div className="text-blue-500 mb-2">
            <svg
              width="48"
              height="48"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1"
                d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"
              ></path>
            </svg>
          </div>
          <p className="font-mono text-sm text-slate-400">
            MOTEUR 3D : CHAMBRE FROIDE AMOVIBLE
          </p>
          <span className="text-xs text-slate-500 mt-2">
            Échelle 1:1 - Précision Métrique Active
          </span>
        </div>

        {/* Panneau de Contrôle IoT */}
        <div className="space-y-4">
          <div className="bg-slate-800 p-5 rounded-xl border border-slate-700">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">
              Paramètres Connexion
            </h2>
            <button
              onClick={() => setWifiConnected(!wifiConnected)}
              className={`w-full py-3 rounded-lg font-bold transition-all ${wifiConnected ? "bg-red-900/50 text-red-200 border border-red-700" : "bg-blue-600 text-white shadow-lg shadow-blue-900/20"}`}
            >
              {wifiConnected
                ? "Interrompre la liaison"
                : "Lancer Scan WiFi IoT"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
