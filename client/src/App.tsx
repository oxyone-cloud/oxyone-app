import React, { useState } from 'react';
import { Thermometer, Clock, Lock, Zap, ShieldAlert } from 'lucide-react';

interface Produit {
  id: number;
  nom: string;
  cat: string;
  temp: number;
  limite: number;
  dlc: string;
}

const OxyONE_Industrial: React.FC = () => {
  const [demoProducts, setDemoProducts] = useState<Produit[]>([
    { id: 1, nom: "VIANDE - BŒUF", cat: "PROTÉINES", temp: 1.2, limite: 2, dlc: "72h" },
    { id: 2, nom: "FROMAGE AOP", cat: "LAITIER", temp: 4.5, limite: 4, dlc: "15j" }
  ]);

  const ajusterTemp = (id: number, delta: number) => {
    setDemoProducts(prev => prev.map(p => 
      p.id === id ? { ...p, temp: parseFloat((p.temp + delta).toFixed(1)) } : p
    ));
  };

  return (
    <div className="min-h-screen metal-bg p-6 text-white font-sans">
      {/* HEADER INDUSTRIEL */}
      <header className="flex justify-between items-center mb-8 border-b-4 border-slate-700 pb-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter led-display">OxyONE SYSTEM v1.0</h1>
          <p className="text-xs font-bold text-slate-400">UNITÉ DE GESTION THERMIQUE | 62 OPÉRATEURS ACTIFS</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="block text-[10px] text-amber-500 font-bold uppercase">Statut Système</span>
            <span className="led on inline-block mr-2"></span>
            <span className="text-xs font-mono">OPÉRATIONNEL</span>
          </div>
          <button className="emergency-stop shadow-lg">STOP</button>
        </div>
      </header>

      {/* CONTRÔLEUR DE STOCK (DEMO) */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        {demoProducts.map(p => (
          <div key={p.id} className="screen-bg p-6 rounded-lg border-2 border-slate-600">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold led-display">{p.nom}</h2>
              <div className={`p-2 rounded border-2 ${p.temp > p.limite ? 'border-red-500 text-red-500 animate-pulse' : 'border-green-500 text-green-500'}`}>
                <span className="block text-[10px] uppercase font-bold text-center">Temp</span>
                <span className="text-3xl font-mono">{p.temp}°C</span>
              </div>
            </div>

            <div className="flex justify-between items-center bg-black/50 p-4 border border-slate-800 rounded">
              <div className="flex gap-3">
                <button onClick={() => ajusterTemp(p.id, -0.5)} className="industrial-btn text-black">- FRIGORIE</button>
                <button onClick={() => ajusterTemp(p.id, 0.5)} className="industrial-btn text-black">+ CALORIE</button>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-500 uppercase">Alerte DLC</p>
                <p className="font-mono text-blue-400 flex items-center gap-1"><Clock size={12}/> {p.dlc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ZONE VERROUILLÉE PRIME */}
      <section className="relative opacity-50 grayscale">
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm rounded-xl">
           <div className="bg-slate-800 border-4 border-amber-600 p-8 text-center max-w-md shadow-2xl">
              <Lock className="mx-auto mb-4 text-amber-500" size={48} />
              <h2 className="text-2xl font-bold mb-2">ABONNEMENT PRIME REQUIS</h2>
              <p className="text-sm mb-6">Accédez au catalogue complet (Légumes, Fruits) et à la gestion automatique OxyONE.</p>
              <button className="w-full bg-amber-600 hover:bg-amber-500 text-white font-black py-4 rounded uppercase tracking-widest transition-all">
                Activer Licence Industrielle
              </button>
           </div>
        </div>

        {/* GRILLE FLOUTÉE */}
        <div className="grid grid-cols-3 gap-4">
          {["LÉGUMES", "FRUITS", "POISSON"].map((cat, i) => (
            <div key={i} className="screen-bg h-32 flex items-center justify-center">
              <span className="text-slate-600 font-bold">{cat}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default OxyONE_Industrial;