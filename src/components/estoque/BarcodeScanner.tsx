import React from 'react';
import { useZxing } from 'react-zxing';
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface BarcodeScannerProps {
  open: boolean;
  onClose: () => void;
  onScan: (barcode: string) => void;
}

export function BarcodeScanner({ open, onClose, onScan }: BarcodeScannerProps) {
  const { ref } = useZxing({
    onDecodeResult(result) {
      const barcode = result.getText();
      onScan(barcode);
      onClose();
    },
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] p-0">
        <div className="relative">
          <video ref={ref} className="w-full h-full" />
          <div className="absolute inset-0 border-2 border-primary/50 m-8 rounded-lg" />
        </div>
      </DialogContent>
    </Dialog>
  );
}
