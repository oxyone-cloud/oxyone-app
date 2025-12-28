import { ColdRoomSimulation } from '@/components/ColdRoomSimulation';

export default function Home() {
  return (
    <div className="min-h-screen w-full metal-bg flex flex-col items-center py-10 px-4">
      
      <header className="w-full max-w-[1000px] mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#00ff41] led-display">SSCI COLD ROOM SIMULATOR</h1>
          <p className="text-sm text-[#7f8c8d] mt-1 font-mono">Dimensions internes exactes appliquées</p>
        </div>
        <div className="px-3 py-1.5 rounded border-2 border-[#00ff41] text-[#00ff41] text-xs font-mono font-medium shadow-sm led-display">
          PRÉCISION MÉTRIQUE
        </div>
      </header>

      <main className="w-full flex justify-center">
        <ColdRoomSimulation />
      </main>

      <footer className="w-full max-w-[1000px] mt-8 flex justify-between text-xs text-[#7f8c8d] border-t border-[#404040] pt-4 font-mono">
        <div>SSCI · CHAMBRE FROIDE POSITIVE</div>
        <div className="font-bold text-[#00ff41]">VOLUME RÉEL: 10 M³</div>
      </footer>
    </div>
  );
}
