import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/label";
import { CameraBarcodeScanner } from "./CameraBarcodeScanner";
import { Plus, Camera, Barcode } from "lucide-react";

export function AddStockDialog() {
  const [open, setOpen] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    codeBarre: "",
    codeLot: "",
    nomProduit: "",
    emplacement: "",
    quantiteKg: "0",
    temperatureC: "0",
    statut: "Conforme",
  });

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await fetch("/api/stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Erreur serveur");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stock"] });
      setOpen(false);
      setShowScanner(false);
      setFormData({
        codeBarre: "",
        codeLot: "",
        nomProduit: "",
        emplacement: "",
        quantiteKg: "0",
        temperatureC: "0",
        statut: "Conforme",
      });
    },
  });

  const handleScanSuccess = (scannedCode: string) => {
    setFormData((prev) => ({
      ...prev,
      codeBarre: scannedCode,
      codeLot: prev.codeLot || `LOT-${scannedCode.slice(-4)}`,
    }));
    setShowScanner(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Entrée en Stock
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Ajouter un nouveau lot au stock</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Section Scanner Caméra */}
          {showScanner ? (
            <div className="space-y-2">
              <CameraBarcodeScanner onScanSuccess={handleScanSuccess} />
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => setShowScanner(false)}
              >
                Fermer la caméra
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <Label>Code-Barres (EAN-13 / Code 128)</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Barcode className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="pl-9 font-mono"
                    placeholder="Ex: 3700012345678"
                    value={formData.codeBarre}
                    onChange={(e) =>
                      setFormData({ ...formData, codeBarre: e.target.value })
                    }
                  />
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowScanner(true)}
                  className="flex items-center gap-1"
                >
                  <Camera className="h-4 w-4" /> Scanner
                </Button>
              </div>
            </div>
          )}

          {/* Formulaire classique */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Code Lot</Label>
              <Input
                placeholder="Ex: LOT-2026-01"
                value={formData.codeLot}
                onChange={(e) =>
                  setFormData({ ...formData, codeLot: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Produit</Label>
              <Input
                placeholder="Ex: Sardines congelées"
                value={formData.nomProduit}
                onChange={(e) =>
                  setFormData({ ...formData, nomProduit: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label>Emplacement</Label>
              <Input
                placeholder="Chambre A1"
                value={formData.emplacement}
                onChange={(e) =>
                  setFormData({ ...formData, emplacement: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Quantité (kg)</Label>
              <Input
                type="number"
                value={formData.quantiteKg}
                onChange={(e) =>
                  setFormData({ ...formData, quantiteKg: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Température (°C)</Label>
              <Input
                type="number"
                value={formData.temperatureC}
                onChange={(e) =>
                  setFormData({ ...formData, temperatureC: e.target.value })
                }
              />
            </div>
          </div>

          <Button
            className="w-full mt-4"
            disabled={mutation.isPending}
            onClick={() => mutation.mutate(formData)}
          >
            {mutation.isPending ? "Enregistrement..." : "Valider le Lot"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}