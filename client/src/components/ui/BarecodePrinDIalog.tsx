import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StockItem } from "@shared/schema";
import { Printer, Crown, Phone, Globe, Code2, Sparkles } from "lucide-react";

interface Props {
  item: StockItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BarcodePrintDialog({ item, open, onOpenChange }: Props) {
  const [showPremiumContact, setShowPremiumContact] = useState(false);

  if (!item) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Printer className="h-5 w-5 text-primary" />
            Impression Étiquette Code-Barres
          </DialogTitle>
        </DialogHeader>

        {!showPremiumContact ? (
          <div className="space-y-6 py-2">
            {/* Zone d'impression d'étiquette */}
            <div
              id="printable-barcode"
              className="p-6 border-2 border-dashed rounded-xl bg-slate-50 dark:bg-slate-900 text-center space-y-3"
            >
              <div className="font-bold text-lg">{item.nomProduit}</div>
              <div className="text-sm text-muted-foreground">
                Lot : <span className="font-mono font-semibold">{item.codeLot}</span> | Emplacement : {item.emplacement}
              </div>

              {/* Visuel du Code-Barres 1D */}
              <div className="bg-white p-4 rounded-lg border shadow-sm inline-block mx-auto">
                <div className="h-16 w-64 bg-[repeating-linear-gradient(90deg,#000,#000_2px,#fff_2px,#fff_5px,#000_5px,#000_9px,#fff_9px,#fff_11px)] mx-auto" />
                <div className="font-mono font-bold text-sm tracking-widest mt-2 text-slate-800">
                  {item.codeBarre || "3700012345678"}
                </div>
              </div>

              <div className="text-xs text-muted-foreground flex justify-center gap-4 pt-1">
                <span>Poids: <strong>{item.quantiteKg} kg</strong></span>
                <span>Temp: <strong>{item.temperatureC} °C</strong></span>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3">
              <Button onClick={handlePrint} variant="outline" className="w-full">
                <Printer className="mr-2 h-4 w-4" /> Imprimer (Standard)
              </Button>
              <Button
                onClick={() => setShowPremiumContact(true)}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
              >
                <Crown className="mr-2 h-4 w-4" /> Version Premium
              </Button>
            </div>
          </div>
        ) : (
          /* Card Contact Développeur Premium */
          <div className="space-y-5 py-2">
            <div className="bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-primary/10 p-5 rounded-2xl border border-amber-500/20 text-center space-y-3">
              <div className="inline-flex p-3 bg-amber-500/20 rounded-full text-amber-600 dark:text-amber-400">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg">Débloquer la Version Premium OxyONE</h3>
              <p className="text-xs text-muted-foreground">
                Impression directe sur imprimantes thermiques (Zebra/Xprinter), génération de rapports PDF automatisés et synchronisation multi-chambres en temps réel.
              </p>
            </div>

            {/* Coordonnées du Développeur */}
            <div className="p-4 bg-card rounded-xl border space-y-3 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-primary/10 rounded-lg text-primary">
                  <Code2 className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-bold text-base flex items-center gap-2">
                    Benhamamouch.O <Badge variant="secondary" className="text-[10px]">Auteur & Dev</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Développeur Flutter & Firebase | Expert Froid Industrialisé
                  </div>
                </div>
              </div>

              <hr />

              <div className="space-y-2 text-sm">
                <a
                  href="https://g.dev/oxy-one"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-muted-foreground hover:text-primary transition-colors"
                >
                  <Globe className="h-4 w-4 text-primary" />
                  <span className="font-mono text-xs">g.dev/oxy-one</span>
                </a>
                <a
                  href="tel:+213782090281"
                  className="flex items-center gap-2.5 text-muted-foreground hover:text-primary transition-colors"
                >
                  <Phone className="h-4 w-4 text-green-500" />
                  <span className="font-mono text-xs font-semibold text-foreground">+213 7 82 09 02 81</span>
                </a>
              </div>
            </div>

            <Button
              variant="ghost"
              className="w-full text-xs"
              onClick={() => setShowPremiumContact(false)}
            >
              ← Retour à l'impression
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}