import { ColdRoomSimulation } from '@/components/ColdRoomSimulation';

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-[#f4f6fb] flex flex-col items-center py-10 px-4">
      
      <header className="w-full max-w-[1000px] mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#123063]">Simulation 3D – Montage (dimensions exactes)</h1>
          <p className="text-sm text-slate-500 mt-1">SSCI SOLUTION OF COLD · Dimensions internes exactes appliquées</p>
        </div>
        <div className="px-3 py-1.5 rounded-full bg-gradient-to-r from-[#2952b2] to-[#4b78e6] text-white text-xs font-medium shadow-sm">
          Précision métrique
        </div>
      </header>

      <main className="w-full flex justify-center">
        <ColdRoomSimulation />
      </main>

      <footer className="w-full max-w-[1000px] mt-8 flex justify-between text-xs text-slate-400 border-t border-slate-200 pt-4">
        <div>SSCI · Chambre froide positive</div>
        <div className="font-bold text-[#123063]">Volume réel: 10 m³</div>
      </footer>
    </div>
  );
}
