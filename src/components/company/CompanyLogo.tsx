import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Building2, Camera } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";

interface CompanyLogoProps {
  logo: string | null;
  isEditing: boolean;
  onImageSelect: (file: File) => void;
}

export const CompanyLogo = ({
  logo,
  isEditing,
  onImageSelect
}: CompanyLogoProps) => {
  const [isSelecting, setIsSelecting] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validações
    if (!file.type.startsWith('image/')) {
      toast.error("Por favor, selecione apenas arquivos de imagem");
      return;
    }

    if (file.size > 2 * 1024 * 1024) { // 2MB
      toast.error("A imagem deve ter no máximo 2MB");
      return;
    }

    setIsSelecting(true);
    try {
      await onImageSelect(file);
    } catch (error: any) {
      console.error('Erro ao processar imagem:', error);
      toast.error("Erro ao processar a imagem");
    } finally {
      setIsSelecting(false);
    }
  };

  const handleImageError = () => {
    console.error('Erro ao carregar imagem:', logo);
    setImageError(true);
  };

  // Função para obter a URL pública da imagem do Storage
  const getImageUrl = (path: string | null) => {
    if (!path) return undefined;
    return `https://hbqoafwfjbosmsukeznn.supabase.co/storage/v1/object/public/imagens/${path}`;
  };

  return (
    <div className="flex flex-col items-center mb-6">
      <div className="relative">
        <Avatar className="w-24 h-24">
          {!imageError ? (
            <AvatarImage 
              src={getImageUrl(logo)} 
              alt="Logo da empresa" 
              onError={handleImageError}
            />
          ) : null}
          <AvatarFallback className="bg-gray-100">
            <Building2 className="w-12 h-12 text-gray-400" />
          </AvatarFallback>
        </Avatar>
        
        {isEditing && (
          <>
            <Label
              htmlFor="logo-upload"
              className="absolute bottom-0 right-0 bg-primary hover:bg-primary/90 text-white p-2 rounded-full cursor-pointer transition-colors"
            >
              {isSelecting ? (
                <span className="animate-pulse">...</span>
              ) : (
                <Camera className="w-4 h-4" />
              )}
            </Label>
            <input
              type="file"
              id="logo-upload"
              accept="image/*"
              className="hidden"
              onChange={handleImageSelect}
            />
          </>
        )}
      </div>
    </div>
  );
};