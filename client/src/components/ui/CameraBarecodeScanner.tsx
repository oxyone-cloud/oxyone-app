import React, { useEffect } from "react";
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from "html5-qrcode";

interface Props {
  onScanSuccess: (decodedText: string) => void;
  onClose?: () => void;
}

export function CameraBarcodeScanner({ onScanSuccess }: Props) {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 10,
        qrbox: { width: 280, height: 140 }, // Zone allongée idéale pour les codes 1D
        formatsToSupport: [
          Html5QrcodeSupportedFormats.EAN_13,
          Html5QrcodeSupportedFormats.CODE_128,
          Html5QrcodeSupportedFormats.EAN_8,
        ],
      },
      /* verbose= */ false
    );

    scanner.render(
      (decodedText) => {
        onScanSuccess(decodedText);
        scanner.clear().catch(console.error);
      },
      (_error) => {
        // Ignorer le flux continu d'erreurs de détection
      }
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, [onScanSuccess]);

  return (
    <div className="w-full space-y-2">
      <div id="reader" className="w-full rounded-lg overflow-hidden border bg-background" />
      <p className="text-xs text-center text-muted-foreground">
        Alignez le code-barres (EAN-13 / Code 128) au centre du cadre
      </p>
    </div>
  );
}