import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-900 border-slate-800 shadow-2xl">
        <CardContent className="pt-8 pb-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-red-500/10 rounded-full border border-red-500/20">
              <AlertCircle className="h-10 w-10 text-red-500" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-slate-50 mb-2 font-mono">
            404: ERREUR SYSTÈME
          </h1>

          <p className="text-slate-400 text-sm mb-8 leading-relaxed">
            La ressource demandée est introuvable ou a été déplacée. 
            Veuillez vérifier l'adresse ou retourner au terminal principal.
          </p>

          <Link href="/">
            <a className="inline-flex items-center justify-center gap-2 w-full bg-slate-800 hover:bg-slate-700 text-slate-100 py-3 rounded-lg font-medium transition-colors border border-slate-700">
              <ArrowLeft size={16} />
              Retour au Pilotage OxyONE
            </a>
          </Link>

          <div className="mt-8 pt-6 border-t border-slate-800/50">
            <span className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">
              Système SSCI v1.0.4 - Diagnostic Erreur
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}