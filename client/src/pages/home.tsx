import { ColdRoomSimulation } from '@/components/ColdRoomSimulation';

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-[#e9ecef] flex flex-col items-center py-10 px-4">
      
      <header className="w-full max-w-[1100px] mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#7f8c8d] border-b-2 border-[#3498db] pb-2">SIMULATION 3D – MONTAGE</h1>
          <p className="text-sm text-[#34495e] mt-2">Dimensions internes exactes appliquées</p>
        </div>
        <div className="px-4 py-2 rounded border border-[#3498db] text-[#34495e] text-xs font-mono font-medium shadow-sm" style={{boxShadow: '2px 2px 4px rgba(0,0,0,0.1)'}}>
          PRÉCISION MÉTRIQUE
        </div>
      </header>

      <main className="w-full flex justify-center">
        <ColdRoomSimulation />
      </main>

      <footer className="w-full max-w-[1100px] mt-8 flex justify-between text-xs text-[#7f8c8d] border-t border-[#d1d9e6] pt-4">
        <div>SSCI · CHAMBRE FROIDE POSITIVE</div>
        <div className="font-bold text-[#34495e]">VOLUME RÉEL: 10 M³</div>
      </footer>
    </div>
  );
}
