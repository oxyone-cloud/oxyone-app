import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Barcode, CheckCircle2 } from "lucide-react";

interface Props {
  onScan: (barcode: string) => void;
}

export function BarcodeScannerInput({ onScan }: Props) {
  const [value, setValue] = useState("");
  const [lastScanned, setLastScanned] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Maintient le focus automatique sur la douchette
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && value.trim() !== "") {
      e.preventDefault();
      onScan(value.trim());
      setLastScanned(value.trim());
      setValue(""); // Réinitialise pour le prochain scan
    }
  };

  return (
    <div className="flex items-center gap-3 bg-muted/40 p-3 rounded-lg border">
      <Barcode className="w-6 h-6 text-primary animate-pulse" />
      <div className="flex-1">
        <Input
          ref={inputRef}
          type="text"
          placeholder="Scannez un code EAN-13 ou Code 128..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="font-mono bg-background"
        />
      </div>
      {lastScanned && (
        <span className="text-xs text-green-600 flex items-center gap-1 font-semibold">
          <CheckCircle2 className="w-4 h-4" />
          Dernier scanné : {lastScanned}
        </span>
      )}
    </div>
  );
}