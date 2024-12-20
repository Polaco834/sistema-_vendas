import React, { useRef } from 'react';
import { Camera, ImagePlus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface ProductImageUploadProps {
  imageUrl: string | null;
  onImageChange: (file: File) => void;
  onImageRemove: () => void;
}

export const ProductImageUpload = ({
  imageUrl,
  onImageChange,
  onImageRemove,
}: ProductImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageChange(file);
    }
  };

  const handleCameraCapture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 mb-6">
      <div className="relative group cursor-pointer" onClick={handleCameraCapture}>
        <Avatar className="h-24 w-24 border-2 border-primary/20">
          <AvatarImage src={imageUrl || undefined} className="object-cover" />
          <AvatarFallback className="bg-primary/5">
            <ImagePlus className="h-8 w-8 text-primary/30" />
          </AvatarFallback>
        </Avatar>

        {/* Overlay with plus icon */}
        <div className={cn(
          "absolute inset-0 flex items-center justify-center",
          "rounded-full transition-opacity duration-200",
          "bg-black/0 group-hover:bg-black/20"
        )}>
          <div className={cn(
            "absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4",
            "bg-primary rounded-full p-1.5",
            "opacity-100 group-hover:opacity-100 shadow-md",
            "transition-opacity duration-200"
          )}>
            <Plus className="h-4 w-4 text-white" />
          </div>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept={isMobile ? "image/*;capture=camera" : "image/*"}
          onChange={handleFileChange}
        />

        {imageUrl && (
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              onImageRemove();
            }}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  );
};
