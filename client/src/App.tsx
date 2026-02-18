import { useState } from "react";

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
            className={`w-3 h-3 rounded-full ${wifiConnected ? "bg-green-500 shadow-[0_0_8px_#22c55e]" : "bg-red-500 animate-pulse"}`}
          ></span>
          <span className="text-sm font-mono text-slate-300">
            {wifiConnected ? "IoT CONNECTÉ" : "RECHERCHE WIFI..."}
          </span>
        </div>
      </header>

      <main className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Zone Simulation 3D */}
        <div className="md:col-span-2 bg-black rounded-xl aspect-video flex flex-col items-center justify-center border border-slate-700 shadow-2xl relative overflow-hidden">
          <div className={`${wifiConnected ? "text-blue-400" : "text-slate-700"} transition-colors duration-500 mb-2`}>
            <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"></path>
            </svg>
          </div>
          <p className="font-mono text-sm text-slate-400 uppercase tracking-widest">
            Moteur 3D : Chambre Froide Amovible
          </p>
          <span className="text-[10px] text-slate-500 mt-2 font-mono">
            Échelle 1:1 - Précision Métrique Active
          </span>
          {/* Scanline effect pour le look industriel */}
          <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>
        </div>

        {/* Panneau de Contrôle IoT */}
        <div className="space-y-4">
          <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700 backdrop-blur-sm">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-4">
              Paramètres Connexion
            </h2>
            <button
              onClick={() => setWifiConnected(!wifiConnected)}
              className={`w-full py-3 rounded-lg font-bold transition-all duration-300 text-xs uppercase tracking-wider ${wifiConnected ? "bg-red-950/30 text-red-400 border border-red-900/50 hover:bg-red-900/40" : "bg-blue-600 text-white shadow-lg shadow-blue-900/40 hover:bg-blue-500"}`}
            >
              {wifiConnected ? "Interrompre la liaison" : "Lancer Scan WiFi IoT"}
            </button>
            <div className="mt-4 pt-4 border-t border-slate-700/50">
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>SIGNAL</span>
                <span className={wifiConnected ? "text-green-500" : ""}>{wifiConnected ? "EXCELLENT" : "N/A"}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}