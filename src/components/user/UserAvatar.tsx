import { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface UserAvatarProps {
  photo?: string | null;
  isEditing: boolean;
  onImageChange?: (url: string) => void;
}

export const UserAvatar = ({ photo, isEditing, onImageChange }: UserAvatarProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error("Por favor, selecione apenas arquivos de imagem");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("A imagem deve ter no máximo 5MB");
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `perfil_usuario/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('imagens')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('imagens')
        .getPublicUrl(filePath);

      if (onImageChange) {
        onImageChange(publicUrl);
      }

      toast.success("Foto atualizada com sucesso!");
    } catch (error: any) {
      console.error('Erro ao fazer upload:', error);
      toast.error("Erro ao fazer upload da imagem");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center mb-6">
      <div className="relative">
        <Avatar className="w-24 h-24">
          <AvatarImage 
            src={photo || undefined} 
            alt="Foto de perfil" 
          />
          <AvatarFallback className="bg-gray-100">
            <User className="w-12 h-12 text-gray-400" />
          </AvatarFallback>
        </Avatar>
        {isEditing && (
          <Label
            htmlFor="photo-upload"
            className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-primary/90 transition-colors"
          >
            {isUploading ? "..." : "+"}
          </Label>
        )}
      </div>
      {isEditing && (
        <input
          type="file"
          id="photo-upload"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          capture="environment"
        />
      )}
    </div>
  );
};