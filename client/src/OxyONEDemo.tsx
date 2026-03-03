import React, { useState } from 'react';
import { Thermometer, Clock, Lock, Zap, ChevronRight } from 'lucide-react';

// Définition de la structure d'un produit pour TypeScript
interface Produit {
  id: number;
  nom: string;
  cat: string;
  temp: number;
  stock: number;
  limite: number;
  dlc: string;
}

const OxyONEDemo: React.FC = () => {
  // État pour les 2 produits de démonstration
  const [demoProducts, setDemoProducts] = useState<Produit[]>([
    { id: 1, nom: "Entrecôte Bœuf (BIO)", cat: "Viande", temp: 1.2, stock: 15, limite: 2, dlc: "3 jours" },
    { id: 2, nom: "Camembert AOP", cat: "Fromage", temp: 4.5, stock: 40, limite: 4, dlc: "12 jours" }
  ]);

  const ajusterTemp = (id: number, delta: number) => {
    setDemoProducts(prev => prev.map(p => 
      p.id === id ? { ...p, temp: parseFloat((p.temp + delta).toFixed(1)) } : p
    ));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 font-sans">
      {/* Header OxyONE */}
      <header className="flex justify-between items-center mb-10 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-black text-blue-500 tracking-tighter">OxyONE <span className="text-white">v1.0</span></h1>
          <p className="text-xs text-slate-400 italic">Expertise : L'Usine du Futur | Scénario 62 Emplois</p>
        </div>
        <button className="bg-amber-500 hover:bg-amber-600 text-black px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-amber-500/20">
          <Zap size={14} fill="currentColor" /> ACTIVER ABONNEMENT PRIME
        </button>
      </header>

      {/* SECTION INTERACTIVE (2 PRODUITS) */}
      <section className="mb-10">
        <h2 className="text-sm font-bold text-blue-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
          </span>
          Mode Démo (Produits Manipulables)
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          {demoProducts.map(product => (
            <div key={product.id} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
              <div className="flex justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold">{product.nom}</h3>
                  <span className="text-[10px] bg-blue-900/30 text-blue-400 px-2 py-0.5 rounded uppercase">{product.cat}</span>
                </div>
                <div className={`text-right ${product.temp > product.limite ? 'text-red-500' : 'text-emerald-400'}`}>
                  <p className="text-2xl font-mono font-bold">{product.temp}°C</p>
                  <p className="text-[10px] uppercase opacity-60 text-white">Réel</p>
                </div>
              </div>

              <div className="flex gap-2 items-center justify-between mt-6 bg-black/30 p-3 rounded-xl">
                <div className="flex items-center gap-3">
                  <button onClick={() => ajusterTemp(product.id, -0.5)} className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-blue-600 font-bold">-</button>
                  <span className="text-xs font-semibold">Réglage Froid</span>
                  <button onClick={() => ajusterTemp(product.id, 0.5)} className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-red-600 font-bold">+</button>
                </div>
                <div className="text-right">
                   <div className="flex items-center gap-1 text-xs text-slate-400 justify-end"><Clock size={12}/> {product.dlc}</div>
                   <div className="text-[10px] text-slate-500 uppercase">Alerte Temps</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION PRIME (BLOQUÉE) */}
      <section className="relative h-64">
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-800">
           <div className="text-center p-6">
              <Lock className="mx-auto mb-3 text-slate-500" size={32} />
              <h3 className="text-lg font-bold mb-1 text-white">Gestion Stock Complète</h3>
              <p className="text-xs text-slate-500 mb-4 max-w-[250px]">
                Sélectionnez plus de produits (Légumes, Fromages, Viandes) avec l'abonnement Prime.
              </p>
              <button className="bg-slate-800 text-white px-6 py-2 rounded-lg text-xs font-bold hover:bg-slate-700 transition-all">
                SÉLECTIONNER PRODUITS PRIME <ChevronRight size={14} className="inline ml-1"/>
              </button>
           </div>
        </div>

        {/* Arrière-plan flouté */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 opacity-10 grayscale">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-slate-800 h-32 rounded-xl"></div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default OxyONEDemo;
