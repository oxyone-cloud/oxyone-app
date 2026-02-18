import { useState } from "react";
import { useToast } from "@/hooks/use-toast"; // Pour les notifications
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wifi, WifiOff, Box, Move, Activity } from "lucide-react";

export default function Home() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();

  const handleWifiToggle = () => {
    if (!isConnected) {
      setIsConnecting(true);
      // Simulation d'une connexion au module SSCI
      setTimeout(() => {
        setIsConnecting(false);
        setIsConnected(true);
        toast({
          title: "Connexion établie",
          description: "Module IoT WiFi détecté avec succès.",
        });
      }, 1500);
    } else {
      setIsConnected(false);
      toast({
        variant: "destructive",
        title: "Déconnexion",
        description: "Liaison avec l'unité interrompue.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 p-4 md:p-8">
      {/* Header Statut */}
      <header className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">OxyONE | Pilotage Industriel</h1>
          <p className="text-slate-400 text-sm">Système de Chambre Froide Amovible (SSCI)</p>
        </div>

        <div className="flex items-center gap-3 bg-slate-900/50 p-2 rounded-lg border border-slate-800">
          <div className={`flex items-center gap-2 px-3 py-1 rounded-md text-xs font-mono ${isConnected ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
            {isConnected ? <Wifi size={14} /> : <WifiOff size={14} />}
            {isConnected ? "UNITÉ CONNECTÉE" : "HORS LIGNE"}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* Vue 3D Principale */}
        <Card className="lg:col-span-3 bg-black border-slate-800 overflow-hidden shadow-2xl min-h-[500px] flex flex-col">
          <CardContent className="flex-1 flex flex-col items-center justify-center relative p-0">
            {/* Overlay d'information technique */}
            <div className="absolute top-4 left-4 z-10 flex gap-2">
              <span className="bg-slate-900/80 backdrop-blur px-2 py-1 rounded text-[10px] font-mono border border-slate-700 flex items-center gap-1">
                <Move size={10} /> PRÉCISION MÉTRIQUE : 1:1
              </span>
              <span className="bg-slate-900/80 backdrop-blur px-2 py-1 rounded text-[10px] font-mono border border-slate-700 flex items-center gap-1">
                <Box size={10} /> MODE : MONTAGE SSCI
              </span>
            </div>

            {/* Placeholder pour le moteur Three.js */}
            <div className="text-center group cursor-pointer">
              <div className="w-24 h-24 mb-4 mx-auto text-blue-500/20 group-hover:text-blue-500/40 transition-colors">
                <Box size={96} strokeWidth={0.5} />
              </div>
              <p className="text-slate-500 font-mono text-xs uppercase tracking-widest">
                Initialisation du moteur de rendu...
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Panneau de Contrôle Latéral */}
        <div className="space-y-6">
          <Card className="bg-slate-900 border-slate-800 shadow-lg">
            <CardContent className="pt-6">
              <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider text-slate-400">Connectivité IoT</h3>
              <Button 
                onClick={handleWifiToggle}
                disabled={isConnecting}
                className={`w-full h-12 font-bold transition-all ${isConnected ? "bg-slate-800 hover:bg-red-900/20 text-red-400 border border-red-900/50" : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20"}`}
              >
                {isConnecting ? "Scan en cours..." : isConnected ? "Interrompre Liaison" : "Lancer Scan WiFi"}
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800 shadow-lg">
            <CardContent className="pt-6">
              <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider text-slate-400">Télémétrie</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-500">Signal WiFi</span>
                  <span className={isConnected ? "text-green-400" : "text-slate-600"}>{isConnected ? "-42 dBm" : "N/A"}</span>
                </div>
                <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                  <div className={`h-full transition-all duration-1000 ${isConnected ? "w-4/5 bg-blue-500" : "w-0"}`}></div>
                </div>
                <div className="flex justify-between text-xs font-mono pt-2">
                  <span className="text-slate-500 flex items-center gap-1"><Activity size={12} /> Fréquence</span>
                  <span className="text-slate-400">2.4 GHz</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}