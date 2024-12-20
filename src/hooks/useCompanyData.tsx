import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { saveCompany } from "./company/useCompanySave";

interface CompanyData {
  nome: string;
  cnpj_cpf: string;
  logo: string | null;
  endereco_rua?: string;
  endereco_cidade?: string;
  endereco_num?: number;
  endereco_bairro?: string;
}

export const useCompanyData = (isInitialSetup: boolean) => {
  const [nome, setNome] = useState("");
  const [cnpj_cpf, setCnpj_cpf] = useState("");
  const [logo, setLogo] = useState<string | null>(null);
  const [endereco_rua, setEndereco_rua] = useState("");
  const [endereco_cidade, setEndereco_cidade] = useState("");
  const [endereco_num, setEndereco_num] = useState<number | undefined>(undefined);
  const [endereco_bairro, setEndereco_bairro] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchCompanyData = useCallback(async () => {
    if (isInitialSetup) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: userData, error: userError } = await supabase
        .from('usuarios')
        .select('empresa_id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (userError) throw userError;
      if (!userData?.empresa_id) return;

      const { data: companyData, error: companyError } = await supabase
        .from('empresas')
        .select('nome, cnpj_cpf, logo, endereco_rua, endereco_cidade, endereco_num, endereco_bairro')
        .eq('id', userData.empresa_id)
        .single();

      if (companyError) throw companyError;

      setNome(companyData.nome);
      setCnpj_cpf(companyData.cnpj_cpf);
      setLogo(companyData.logo);
      setEndereco_rua(companyData.endereco_rua || "");
      setEndereco_cidade(companyData.endereco_cidade || "");
      setEndereco_num(companyData.endereco_num);
      setEndereco_bairro(companyData.endereco_bairro || "");
    } catch (error) {
      console.error('Error fetching company data:', error);
      toast.error("Erro ao carregar dados da empresa");
    }
  }, [isInitialSetup]);

  useEffect(() => {
    fetchCompanyData();
  }, [fetchCompanyData]);

  const handleSave = async (addressData: {
    endereco_rua?: string;
    endereco_cidade?: string;
    endereco_num?: number;
    endereco_bairro?: string;
  }) => {
    setIsLoading(true);
    try {
      return await saveCompany({
        nome,
        cnpj_cpf,
        logo,
        ...addressData
      }, isInitialSetup);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    nome,
    setNome,
    cnpj_cpf,
    setCnpj_cpf,
    logo,
    setLogo,
    endereco_rua,
    setEndereco_rua,
    endereco_cidade,
    setEndereco_cidade,
    endereco_num,
    setEndereco_num,
    endereco_bairro,
    setEndereco_bairro,
    isLoading,
    handleSave,
    fetchCompanyData
  };
};