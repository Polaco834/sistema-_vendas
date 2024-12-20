import { PostgrestError } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const checkDocumentExists = async (document: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('empresas')
      .select('id')
      .eq('cnpj_cpf', document)
      .maybeSingle();

    if (error) throw error;
    return !!data;
  } catch (error) {
    console.error('Erro ao verificar documento:', error);
    return false;
  }
};

export const handleCompanyError = (error: PostgrestError, isInitialSetup: boolean) => {
  console.error('Erro na operação da empresa:', error);
  
  if (error.code === '23505' && error.details?.includes('cnpj_cpf')) {
    toast.error("Este CNPJ/CPF já está cadastrado no sistema");
  } else {
    toast.error(isInitialSetup ? "Erro ao cadastrar empresa" : "Erro ao atualizar empresa");
  }
  
  return { success: false, isInitialSetup };
};