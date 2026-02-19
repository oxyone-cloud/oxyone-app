import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";

function App() {
  const [wifiStatus, setWifiStatus] = useState("DISCONNECTED"); // "DISCONNECTED", "SCANNING", "CONNECTED"
  const [metrics, setMetrics] = useState({ temp: -18.5, humidity: 85, power: 1.2 });

  // Simuler une petite variation des données quand on est connecté
  useEffect(() => {
    if (wifiStatus === "CONNECTED") {
      const interval = setInterval(() => {
        setMetrics(prev => ({
          temp: +(prev.temp + (Math.random() * 0.2 - 0.1)).toFixed(1),
          humidity: +(prev.humidity + (Math.random() * 0.4 - 0.2)).toFixed(1),
          power: +(prev.power + (Math.random() * 0.06 - 0.03)).toFixed(2)
        }));
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [wifiStatus]);

  const handleScan = () => {
    setWifiStatus("SCANNING");
    setTimeout(() => {
      setWifiStatus("CONNECTED");
    }, 2500); // Temps du scan réaliste
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#020617', color: '#f8fafc', fontFamily: 'monospace', padding: '20px' }}>

      {/* HEADER OXYONE */}
      <header style={{ borderBottom: '1px solid #1e293b', paddingBottom: '15px', marginBottom: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.2rem', color: '#38bdf8' }}>OxyONE | TERMINAL SSCI</h1>
          <span style={{ fontSize: '0.65rem', color: '#64748b' }}>USINE DU FUTUR - SECTEUR FROID</span>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.7rem', color: wifiStatus === "CONNECTED" ? '#22c55e' : '#ef4444' }}>
            ● {wifiStatus}
          </div>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px' }}>

        {/* BLOC A : VISUALISATION 3D */}
        <div style={{ backgroundColor: '#000', borderRadius: '8px', border: '1px solid #1e293b', height: '450px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ color: wifiStatus === "CONNECTED" ? '#38bdf8' : '#1e293b', textAlign: 'center' }}>
            <svg width="80" height="80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <p style={{ marginTop: '10px', fontSize: '0.7rem', letterSpacing: '2px' }}>VUE ISOMÉTRIQUE CHAMBRE FROIDE</p>
          </div>
        </div>

        {/* BLOC B & C : CONTRÔLES ET MÉTRIQUES */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* BOUTON DE SCAN */}
          <div style={{ backgroundColor: '#0f172a', padding: '20px', borderRadius: '8px', border: '1px solid #1e293b' }}>
            <button 
              onClick={wifiStatus === "CONNECTED" ? () => setWifiStatus("DISCONNECTED") : handleScan}
              disabled={wifiStatus === "SCANNING"}
              style={{ 
                width: '100%', padding: '15px', borderRadius: '4px', border: '1px solid #38bdf8',
                backgroundColor: wifiStatus === "SCANNING" ? 'transparent' : (wifiStatus === "CONNECTED" ? '#7f1d1d' : '#0369a1'),
                color: 'white', cursor: wifiStatus === "SCANNING" ? 'wait' : 'pointer', fontWeight: 'bold'
              }}
            >
              {wifiStatus === "SCANNING" ? "SCAN EN COURS..." : (wifiStatus === "CONNECTED" ? "STOPPER LIAISON" : "LANCER SCAN WIFI")}
            </button>
          </div>

          {/* INDICATEURS KPI (Les Jauges) */}
          <div style={{ backgroundColor: '#0f172a', padding: '20px', borderRadius: '8px', border: '1px solid #1e293b', flexGrow: 1 }}>
            <h3 style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '20px' }}>DONNÉES CAPTEURS</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Température */}
              <MetricBox label="TEMPÉRATURE" value={`${metrics.temp}°C`} color="#3b82f6" active={wifiStatus === "CONNECTED"} />
              {/* Humidité */}
              <MetricBox label="HUMIDITÉ" value={`${metrics.humidity}%`} color="#10b981" active={wifiStatus === "CONNECTED"} />
              {/* Puissance */}
              <MetricBox label="CONSO. COMPRESSEUR" value={`${metrics.power} kW`} color="#f59e0b" active={wifiStatus === "CONNECTED"} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// Composant réutilisable pour les petites jauges
function MetricBox({ label, value, color, active }) {
  return (
    <div style={{ borderLeft: `3px solid ${active ? color : '#1e293b'}`, paddingLeft: '15px', opacity: active ? 1 : 0.3, transition: 'all 0.5s' }}>
      <div style={{ fontSize: '0.6rem', color: '#64748b', marginBottom: '4px' }}>{label}</div>
      <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: active ? '#f8fafc' : '#475569' }}>{active ? value : "--.-"}</div>
    </div>
  );
}

const root = document.getElementById("root");
if (root) { createRoot(root).render(<App />); }