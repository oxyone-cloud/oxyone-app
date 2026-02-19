import React, { useState } from "react";
import { createRoot } from "react-dom/client";

function App() {
  const [wifiConnected, setWifiConnected] = useState(false);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#f8fafc', fontFamily: 'sans-serif', padding: '20px' }}>
      {/* Header avec LED de statut */}
      <header style={{ borderBottom: '1px solid #334155', paddingBottom: '20px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '1.4rem', letterSpacing: '1px' }}>OxyONE | Interface SSCI</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#1e293b', padding: '8px 15px', borderRadius: '20px', border: '1px solid #334155' }}>
          <div style={{ 
            width: '10px', height: '10px', borderRadius: '50%', 
            backgroundColor: wifiConnected ? '#22c55e' : '#ef4444',
            boxShadow: wifiConnected ? '0 0 10px #22c55e' : '0 0 10px #ef4444',
            transition: 'all 0.3s'
          }}></div>
          <span style={{ fontSize: '0.75rem', fontWeight: 'bold', fontFamily: 'monospace' }}>
            {wifiConnected ? "IoT CONNECTÉ" : "RECHERCHE SIGNAL..."}
          </span>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '25px' }}>

        {/* Zone de Simulation 3D */}
        <div style={{ 
          backgroundColor: '#000', borderRadius: '15px', height: '400px', 
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
          border: '1px solid #334155', position: 'relative', overflow: 'hidden',
          boxShadow: 'inset 0 0 50px rgba(0,0,0,1), 0 10px 30px rgba(0,0,0,0.5)'
        }}>
          <div style={{ color: wifiConnected ? '#3b82f6' : '#475569', marginBottom: '15px', transition: 'color 0.5s' }}>
            <svg width="60" height="60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"></path>
            </svg>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.8rem', letterSpacing: '3px', fontWeight: 'bold' }}>MOTEUR 3D : CHAMBRE FROIDE</p>
          <p style={{ color: '#475569', fontSize: '0.65rem', marginTop: '5px' }}>ÉCHELLE 1:1 - PRÉCISION MÉTRIQUE</p>

          {/* Effet de scanline industriel */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(rgba(18,16,16,0) 50%, rgba(0,0,0,0.1) 50%), linear-gradient(90deg, rgba(255,0,0,0.03), rgba(0,255,0,0.01), rgba(0,0,255,0.03))', backgroundSize: '100% 4px, 4px 100%' }}></div>
        </div>

        {/* Panneau de Contrôle IoT */}
        <div style={{ backgroundColor: '#1e293b', padding: '25px', borderRadius: '15px', border: '1px solid #334155', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h2 style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1.5px', margin: 0 }}>Unité de Commande</h2>

          <div style={{ background: '#0f172a', padding: '15px', borderRadius: '10px', border: '1px solid #334155' }}>
            <p style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '10px' }}>ÉTAT DE LA LIAISON SANS FIL</p>
            <button 
              onClick={() => setWifiConnected(!wifiConnected)}
              style={{ 
                width: '100%', padding: '12px', borderRadius: '6px', border: 'none', 
                backgroundColor: wifiConnected ? '#7f1d1d' : '#2563eb', 
                color: 'white', fontWeight: 'bold', cursor: 'pointer',
                transition: 'all 0.2s', fontSize: '0.8rem'
              }}
            >
              {wifiConnected ? "DÉCONNECTER L'UNITÉ" : "LANCER SCAN WIFI"}
            </button>
          </div>

          <div style={{ marginTop: 'auto', fontSize: '0.7rem', color: '#475569', fontFamily: 'monospace' }}>
             PROJET : OxyONE v1.0<br/>
             STATUS : SYSTÈME PRÊT
          </div>
        </div>

      </div>
    </div>
  );
}

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(<App />);
}