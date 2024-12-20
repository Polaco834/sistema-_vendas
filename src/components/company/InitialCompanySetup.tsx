import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CompanyLogo } from "./CompanyLogo";
import { formatDocument } from "./CompanyFormUtils";
import { useEffect, useState } from "react";
import { useCompanyData } from "@/hooks/useCompanyData";
import { EditCompanyData } from "./EditCompanyData";
import { ViewCompanyData } from "./ViewCompanyData";

interface InitialCompanySetupProps {
  nome: string;
  cnpj_cpf: string;
  logo: string | null;
  endereco_rua?: string;
  endereco_cidade?: string;
  endereco_num?: number;
  endereco_bairro?: string;
  onChangeNome: (value: string) => void;
  onChangeCnpj_cpf: (value: string) => void;
  onChangeLogo: (value: string) => void;
  onChangeEndereco_rua: (value: string) => void;
  onChangeEndereco_cidade: (value: string) => void;
  onChangeEndereco_num: (value: number) => void;
  onChangeEndereco_bairro: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  onImageSelect: (file: File) => void;
}

export const InitialCompanySetup = () => {
  const { companyData, isLoading, fetchCompanyData, handleSave } = useCompanyData();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    cnpj_cpf: "",
    logo: null as string | null,
    endereco_rua: "",
    endereco_cidade: "",
    endereco_num: undefined as number | undefined,
    endereco_bairro: "",
  });

  // Guarda os dados originais para restaurar ao cancelar
  const [originalData, setOriginalData] = useState(formData);

  useEffect(() => {
    fetchCompanyData();
  }, [fetchCompanyData]);

  useEffect(() => {
    if (companyData) {
      const newData = {
        nome: companyData.nome,
        cnpj_cpf: companyData.cnpj_cpf,
        logo: companyData.logo || null,
        endereco_rua: companyData.endereco_rua || "",
        endereco_cidade: companyData.endereco_cidade || "",
        endereco_num: companyData.endereco_num,
        endereco_bairro: companyData.endereco_bairro || "",
      };
      setFormData(newData);
      setOriginalData(newData);
    }
  }, [companyData]);

  const handleSaveClick = async () => {
    const success = await handleSave(formData);
    if (success) {
      setIsEditing(false);
      setOriginalData(formData);
    }
  };

  const handleCancelClick = () => {
    setFormData(originalData);
    setIsEditing(false);
  };

  if (!companyData && !isEditing) {
    return <div>Carregando...</div>;
  }

  return isEditing ? (
    <EditCompanyData
      {...formData}
      onChangeNome={(nome) => setFormData({ ...formData, nome })}
      onChangeCnpj_cpf={(cnpj_cpf) => setFormData({ ...formData, cnpj_cpf })}
      onChangeLogo={(logo) => setFormData({ ...formData, logo })}
      onChangeEndereco_rua={(endereco_rua) => setFormData({ ...formData, endereco_rua })}
      onChangeEndereco_cidade={(endereco_cidade) => setFormData({ ...formData, endereco_cidade })}
      onChangeEndereco_num={(endereco_num) => setFormData({ ...formData, endereco_num })}
      onChangeEndereco_bairro={(endereco_bairro) => setFormData({ ...formData, endereco_bairro })}
      onSave={handleSaveClick}
      onCancel={handleCancelClick}
      isLoading={isLoading}
      onImageSelect={(file) => console.log(file)}
    />
  ) : (
    <ViewCompanyData
      {...formData}
      onEdit={() => setIsEditing(true)}
    />
  );
};