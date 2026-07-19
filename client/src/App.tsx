import React, { useState, useEffect } from "react";

function MetricBox({ label, value, color, active }: { label: string; value: string | number; color?: string; active?: boolean }) {
  return (
    <div style={{ borderLeft: `3px solid ${active ? color : '#1e293b'}`, paddingLeft: '15px', opacity: active ? 1 : 0.3, transition: 'all 0.5s' }}>
      <div style={{ fontSize: '0.6rem', color: '#64748b', marginBottom: '4px' }}>{label}</div>
      <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: active ? '#f8fafc' : '#475569' }}>{active ? value : "--.-"}</div>
    </div>
  );
}

export default function App() {
  const [wifiStatus, setWifiStatus] = useState("DISCONNECTED");
  interface DetectedNode {
  id: string;
  sig: string;
  st: string;
}

const [detectedNodes, setDetectedNodes] = useState<DetectedNode[]>([]);
  const [metrics, setMetrics] = useState({ temp: -18.5, humidity: 85, power: 1.2 });

  // Effet de variation des données en mode connecté
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
    setDetectedNodes([]);

    // Simulation de balayage live des modules OxyONE
    setTimeout(() => setDetectedNodes(prev => [...prev, { id: "CAPTEUR-ZONE-A", sig: "92%", st: "OK" }]), 700);
    setTimeout(() => setDetectedNodes(prev => [...prev, { id: "MOTEUR-COMP-02", sig: "45%", st: "WARN" }]), 1500);
    setTimeout(() => {
      setDetectedNodes(prev => [...prev, { id: "DIGITALSENSE-V1", sig: "98%", st: "OK" }]);
      setWifiStatus("CONNECTED");
    }, 2500);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#020617', color: '#f8fafc', fontFamily: 'monospace', padding: '20px' }}>

      {/* STYLE ANIMATION RADAR */}
      <style>{`
        @keyframes scan { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .radar-line { animation: scan 2s linear infinite; }
      `}</style>

      <header style={{ borderBottom: '1px solid #1e293b', paddingBottom: '15px', marginBottom: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.2rem', color: '#38bdf8' }}>OxyONE | TERMINAL SSCI</h1>
          <span style={{ fontSize: '0.65rem', color: '#64748b' }}>USINE DU FUTUR - SECTEUR FROID</span>
        </div>
        <div style={{ color: wifiStatus === "CONNECTED" ? '#22c55e' : (wifiStatus === "SCANNING" ? '#f59e0b' : '#ef4444') }}>
          ● {wifiStatus}
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px' }}>

        {/* BLOC A : VISUALISATION 3D */}
        <div style={{ backgroundColor: '#000', borderRadius: '8px', border: '1px solid #1e293b', height: '450px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
           <div style={{ textAlign: 'center', color: wifiStatus === "CONNECTED" ? '#38bdf8' : '#1e293b' }}>
             <svg width="60" height="60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="1" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
             <p style={{ fontSize: '0.6rem', marginTop: '10px', letterSpacing: '2px' }}>SIMULATION 3D ACTIVE</p>
           </div>
        </div>

        {/* BLOC B : CONTRÔLES & RADAR */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          <div style={{ backgroundColor: '#0f172a', padding: '20px', borderRadius: '8px', border: '1px solid #1e293b' }}>
            <button 
              onClick={wifiStatus === "CONNECTED" ? () => {setWifiStatus("DISCONNECTED"); setDetectedNodes([]);} : handleScan}
              disabled={wifiStatus === "SCANNING"}
              style={{ width: '100%', padding: '15px', background: wifiStatus === "CONNECTED" ? '#7f1d1d' : '#0369a1', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              {wifiStatus === "SCANNING" ? "BALAYAGE LIVE..." : (wifiStatus === "CONNECTED" ? "STOPPER LIAISON" : "LANCER SCAN WIFI")}
            </button>

            {/* LE WIDGET RADAR */}
            {wifiStatus !== "DISCONNECTED" && (
              <div style={{ marginTop: '20px', padding: '15px', background: '#020617', borderRadius: '8px', border: '1px solid #1e293b' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                  <div style={{ width: '24px', height: '24px', border: '1px solid #38bdf8', borderRadius: '50%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {wifiStatus === "SCANNING" && (
                      <div className="radar-line" style={{ position: 'absolute', width: '50%', height: '1px', background: '#38bdf8', left: '50%', transformOrigin: 'left center' }}></div>
                    )}
                    <div style={{ width: '2px', height: '2px', background: '#38bdf8', borderRadius: '50%' }}></div>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: '#38bdf8', fontWeight: 'bold' }}>DÉTECTION MODULES IOT</span>
                </div>
                {detectedNodes.map((n, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: '#94a3b8', marginBottom: '8px', borderBottom: '1px solid #1e293b', paddingBottom: '4px' }}>
                    <span>{n.id}</span>
                    <span style={{ color: n.st === "OK" ? '#22c55e' : '#f59e0b' }}>{n.sig}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* KPI (Indicateurs) */}
          <div style={{ backgroundColor: '#0f172a', padding: '20px', borderRadius: '8px', border: '1px solid #1e293b', flexGrow: 1 }}>
             <h3 style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '20px' }}>MÉTRIQUES RÉELLES</h3>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <MetricBox label="TEMPÉRATURE" value={`${metrics.temp}°C`} active={wifiStatus === "CONNECTED"} color="#3b82f6" />
                <MetricBox label="HUMIDITÉ" value={`${metrics.humidity}%`} active={wifiStatus === "CONNECTED"} color="#10b981" />
                <MetricBox label="CHARGE RÉSEAU" value={`${metrics.power} kW`} active={wifiStatus === "CONNECTED"} color="#f59e0b" />
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
