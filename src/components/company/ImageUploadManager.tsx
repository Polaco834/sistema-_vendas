import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Constante para evitar erros de digitação
const PASTA_PERFIL = 'perfil_empresa';
const BUCKET_IMAGEM = 'imagem';

export const useImageUpload = () => {
  const [tempFile, setTempFile] = useState<File | null>(null);
  const [tempPreviewUrl, setTempPreviewUrl] = useState<string | null>(null);

  const handleImageSelect = (file: File) => {
    // Limpar URL anterior se existir
    if (tempPreviewUrl) {
      URL.revokeObjectURL(tempPreviewUrl);
    }
    
    // Criar URL temporária para preview
    const previewUrl = URL.createObjectURL(file);
    setTempFile(file);
    setTempPreviewUrl(previewUrl);
  };

  const ensureBucketExists = async () => {
    try {
      // Verifica se o bucket existe
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.some(bucket => bucket.name === BUCKET_IMAGEM);

      if (!bucketExists) {
        console.log(`Bucket '${BUCKET_IMAGEM}' não existe, criando...`);
        const { error } = await supabase.storage.createBucket(BUCKET_IMAGEM, {
          public: true,
          fileSizeLimit: 2097152, // 2MB em bytes
          allowedMimeTypes: ['image/jpeg', 'image/png']
        });

        if (error) {
          console.error("Erro ao criar bucket:", error);
          throw error;
        }
        console.log(`Bucket '${BUCKET_IMAGEM}' criado com sucesso`);
      }
    } catch (error) {
      console.error("Erro ao verificar/criar bucket:", error);
      throw error;
    }
  };

  const handleImageUpload = async (empresaId: string) => {
    if (!tempFile) return null;

    try {
      console.log(`Iniciando upload da imagem para empresa ${empresaId}`);

      // Garante que o bucket existe
      await ensureBucketExists();

      // Gera um nome único para o arquivo
      const fileExt = tempFile.name.split('.').pop();
      const fileName = `${PASTA_PERFIL}/${empresaId}.${fileExt}`;

      console.log("Preparando upload:", {
        bucket: BUCKET_IMAGEM,
        pasta: PASTA_PERFIL,
        fileName,
        fileSize: tempFile.size,
        fileType: tempFile.type
      });

      // Faz o upload da nova imagem
      const { error: uploadError } = await supabase.storage
        .from(BUCKET_IMAGEM)
        .upload(fileName, tempFile, {
          cacheControl: '3600',
          contentType: tempFile.type,
          upsert: true
        });

      if (uploadError) {
        console.error(`Erro no upload da imagem para empresa ${empresaId}:`, uploadError);
        throw uploadError;
      }

      // Gera a URL pública
      const { data: { publicUrl } } = supabase.storage
        .from(BUCKET_IMAGEM)
        .getPublicUrl(fileName);

      console.log(`URL pública gerada para empresa ${empresaId}:`, publicUrl);
      return publicUrl;
    } catch (error: any) {
      console.error(`Erro ao fazer upload da imagem para empresa ${empresaId}:`, error);
      throw error;
    }
  };

  // Limpa recursos ao desmontar
  useEffect(() => {
    return () => cleanup();
  }, []);

  const cleanup = () => {
    if (tempPreviewUrl) {
      URL.revokeObjectURL(tempPreviewUrl);
    }
    setTempFile(null);
    setTempPreviewUrl(null);
  };

  return {
    tempFile,
    tempPreviewUrl,
    handleImageSelect,
    handleImageUpload,
    cleanup
  };
};