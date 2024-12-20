import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCompanyData } from "@/hooks/useCompanyData";
import { CompanyFormContent } from "./company/CompanyFormContent";
import { toast } from "sonner";
import { validateCpfCnpj } from "./company/CompanyFormUtils";

interface CompanyFormProps {
  onClose: () => void;
  isInitialSetup?: boolean;
}

const CompanyForm = ({ onClose, isInitialSetup = false }: CompanyFormProps) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const {
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
    saveCompanyData,
    uploadLogo,
    fetchCompanyData
  } = useCompanyData();

  // Carrega os dados da empresa quando o componente é montado
  useEffect(() => {
    if (!isInitialSetup) {
      fetchCompanyData();
    }
  }, [fetchCompanyData, isInitialSetup]);

  const handleImageSelect = async (file: File) => {
    try {
      const filePath = await uploadLogo(file);
      setLogo(filePath);
      toast.success('Imagem carregada com sucesso!');
    } catch (error) {
      console.error('Erro ao processar imagem:', error);
      toast.error('Erro ao carregar a imagem');
    }
  };

  const handleSubmit = async () => {
    if (isSaving) return; // Previne múltiplos cliques

    try {
      setIsSaving(true);

      // Validações básicas
      if (!nome.trim()) {
        toast.error("O nome da empresa é obrigatório");
        return;
      }
      if (!cnpj_cpf.trim()) {
        toast.error("O CNPJ/CPF é obrigatório");
        return;
      }

      // Validação de CPF/CNPJ
      const cpfCnpjValidation = validateCpfCnpj(cnpj_cpf);
      if (!cpfCnpjValidation.isValid) {
        toast.error(cpfCnpjValidation.message);
        return;
      }
      
      // Salva os dados usando o saveCompanyData do hook
      await saveCompanyData();

      // Fecha o modal se não for setup inicial
      if (!isInitialSetup) {
        onClose();
      } else {
        // Redireciona para a página inicial após o setup
        navigate("/");
      }
    } catch (error: any) {
      console.error("Erro ao salvar:", error);
      toast.error(error.message || "Erro ao salvar os dados");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (isInitialSetup) {
      // No setup inicial, cancelar significa sair do sistema
      navigate("/logout");
    } else {
      // Em edição normal, apenas fecha o modal
      setIsEditing(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
        {!isInitialSetup && (
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        
        <h2 className="text-lg font-semibold mb-4">
          {isInitialSetup ? "Configuração Inicial da Empresa" : "Dados da Empresa"}
        </h2>

        <CompanyFormContent
          isInitialSetup={isInitialSetup}
          isEditing={isInitialSetup || isEditing}
          nome={nome}
          cnpj_cpf={cnpj_cpf}
          logo={logo}
          endereco_rua={endereco_rua}
          endereco_cidade={endereco_cidade}
          endereco_num={endereco_num}
          endereco_bairro={endereco_bairro}
          onChangeNome={setNome}
          onChangeCnpj_cpf={setCnpj_cpf}
          onChangeLogo={setLogo}
          onChangeEndereco_rua={setEndereco_rua}
          onChangeEndereco_cidade={setEndereco_cidade}
          onChangeEndereco_num={setEndereco_num}
          onChangeEndereco_bairro={setEndereco_bairro}
          onSubmit={handleSubmit}
          onEdit={handleEdit}
          onCancel={handleCancel}
          isLoading={isLoading || isSaving}
          onImageSelect={handleImageSelect}
        />
      </div>
    </div>
  );
};

export default CompanyForm;