import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useCompanyData } from "@/hooks/useCompanyData";

interface CompanyFormProps {
  onClose: () => void;
  onCompanyCreated?: (empresaId: number) => void;
  isInitialSetup?: boolean;
}

export default function CompanyForm({ onClose, onCompanyCreated, isInitialSetup = false }: CompanyFormProps) {
  const {
    nome,
    setNome,
    cnpj_cpf,
    setCnpj_cpf,
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
  } = useCompanyData(isInitialSetup);

  useEffect(() => {
    fetchCompanyData();
  }, [fetchCompanyData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nome.trim()) {
      toast.error("Por favor, insira o nome da empresa");
      return;
    }

    const result = await handleSave({
      endereco_rua,
      endereco_cidade,
      endereco_num,
      endereco_bairro
    });
    
    if (result?.success) {
      if (onCompanyCreated && result.empresaId) {
        onCompanyCreated(result.empresaId);
      } else {
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-8">
      <div className="bg-white rounded-xl w-full max-w-md relative">
        <div className="p-6 border-b">
          {!isInitialSetup && (
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          )}
          <h2 className="text-xl font-semibold">
            {isInitialSetup ? "Configure sua empresa" : "Nova empresa"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Nome da empresa *
            </label>
            <Input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Nome da empresa"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              CNPJ/CPF
            </label>
            <Input
              value={cnpj_cpf}
              onChange={(e) => setCnpj_cpf(e.target.value)}
              placeholder="CNPJ ou CPF"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Rua
            </label>
            <Input
              value={endereco_rua || ""}
              onChange={(e) => setEndereco_rua(e.target.value)}
              placeholder="Digite o nome da rua"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Número
              </label>
              <Input
                type="number"
                value={endereco_num || ""}
                onChange={(e) => setEndereco_num(parseInt(e.target.value) || undefined)}
                placeholder="Nº"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Bairro
              </label>
              <Input
                value={endereco_bairro || ""}
                onChange={(e) => setEndereco_bairro(e.target.value)}
                placeholder="Digite o bairro"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Cidade
            </label>
            <Input
              value={endereco_cidade || ""}
              onChange={(e) => setEndereco_cidade(e.target.value)}
              placeholder="Digite a cidade"
            />
          </div>

          <div className="pt-4 flex justify-end space-x-2">
            {!isInitialSetup && (
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancelar
              </Button>
            )}
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
