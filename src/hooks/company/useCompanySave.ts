import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { checkDocumentExists, handleCompanyError } from "./useCompanyValidation";

interface CompanyData {
  nome: string;
  cnpj_cpf: string;
  logo: string | null;
  endereco_rua?: string;
  endereco_cidade?: string;
  endereco_num?: number;
  endereco_bairro?: string;
}

export const saveCompany = async (
  data: CompanyData,
  isInitialSetup: boolean
) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Usuário não encontrado");

    if (isInitialSetup) {
      return await handleInitialSetup(user.id, data);
    } else {
      return await handleUpdate(user.id, data);
    }
  } catch (error: any) {
    console.error('Erro ao salvar empresa:', error);
    toast.error(isInitialSetup ? "Erro ao cadastrar empresa" : "Erro ao atualizar empresa");
    return { success: false, isInitialSetup };
  }
};

const handleInitialSetup = async (userId: string, data: CompanyData) => {
  const documentExists = await checkDocumentExists(data.cnpj_cpf);
  if (documentExists) {
    toast.error("Este CNPJ/CPF já está cadastrado no sistema");
    return { success: false, isInitialSetup: true };
  }

  const { data: companyData, error: companyError } = await supabase
    .from('empresas')
    .insert([{
      nome: data.nome,
      cnpj_cpf: data.cnpj_cpf,
      logo: data.logo,
      endereco_rua: data.endereco_rua,
      endereco_cidade: data.endereco_cidade,
      endereco_num: data.endereco_num,
      endereco_bairro: data.endereco_bairro
    }])
    .select()
    .single();

  if (companyError) return handleCompanyError(companyError, true);

  const { error: userError } = await supabase
    .from('usuarios')
    .update({ empresa_id: companyData.id })
    .eq('user_id', userId);

  if (userError) throw userError;

  toast.success("Empresa cadastrada com sucesso!");
  return { success: true, isInitialSetup: true, empresaId: companyData.id };
};

const handleUpdate = async (userId: string, data: CompanyData) => {
  const { data: userData } = await supabase
    .from('usuarios')
    .select('empresa_id')
    .eq('user_id', userId)
    .maybeSingle();

  if (!userData?.empresa_id) throw new Error("Empresa não encontrada");

  const { error } = await supabase
    .from('empresas')
    .update({
      nome: data.nome,
      cnpj_cpf: data.cnpj_cpf,
      logo: data.logo,
      endereco_rua: data.endereco_rua,
      endereco_cidade: data.endereco_cidade,
      endereco_num: data.endereco_num,
      endereco_bairro: data.endereco_bairro
    })
    .eq('id', userData.empresa_id);

  if (error) return handleCompanyError(error, false);

  toast.success("Empresa atualizada com sucesso!");
  return { success: true, isInitialSetup: false, empresaId: userData.empresa_id };
};