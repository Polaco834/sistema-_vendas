import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CompanyLogo } from "./CompanyLogo";
import { useCompanyData } from "@/hooks/useCompanyData";
import { toast } from "sonner";

interface CompanyFormContentProps {
  isInitialSetup: boolean;
  isEditing: boolean;
  nome: string;
  cnpj_cpf: string;
  logo: string | null;
  endereco_rua: string | null;
  endereco_cidade: string | null;
  endereco_num: number | null;
  endereco_bairro: string | null;
  onChangeNome: (value: string) => void;
  onChangeCnpj_cpf: (value: string) => void;
  onChangeLogo: (value: string | null) => void;
  onChangeEndereco_rua: (value: string) => void;
  onChangeEndereco_cidade: (value: string) => void;
  onChangeEndereco_num: (value: number) => void;
  onChangeEndereco_bairro: (value: string) => void;
  onSubmit: () => void;
  onEdit: () => void;
  onCancel: () => void;
  isLoading: boolean;
  onImageSelect: (file: File) => void;
}

export const CompanyFormContent = ({
  isInitialSetup,
  isEditing,
  nome,
  cnpj_cpf,
  logo,
  endereco_rua,
  endereco_cidade,
  endereco_num,
  endereco_bairro,
  onChangeNome,
  onChangeCnpj_cpf,
  onChangeLogo,
  onChangeEndereco_rua,
  onChangeEndereco_cidade,
  onChangeEndereco_num,
  onChangeEndereco_bairro,
  onSubmit,
  onEdit,
  onCancel,
  isLoading,
  onImageSelect
}: CompanyFormContentProps) => {
  return (
    <div className="h-[calc(100vh-8rem)] overflow-y-auto flex flex-col items-center justify-start w-full py-4">
      <div className="w-full max-w-md bg-white rounded-lg p-6 pt-4">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-900">
            {isInitialSetup ? 'Configure sua Empresa' : (isEditing ? 'Editar Empresa' : 'Dados da Empresa')}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {isInitialSetup 
              ? 'Preencha os dados da sua empresa para começar' 
              : (isEditing 
                  ? 'Atualize os dados da sua empresa' 
                  : 'Visualize os dados da sua empresa'
                )
            }
          </p>
        </div>

        <div className="flex justify-center mb-4">
          <CompanyLogo 
            logo={logo} 
            isEditing={isEditing} 
            onImageSelect={onImageSelect}
          />
        </div>

        <div className="space-y-3">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Nome da Empresa *
            </label>
            <Input
              placeholder="Digite o nome da empresa"
              value={nome}
              onChange={(e) => onChangeNome(e.target.value)}
              disabled={!isEditing}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              CNPJ/CPF *
            </label>
            <Input
              placeholder="Digite o CNPJ ou CPF"
              value={cnpj_cpf}
              onChange={(e) => onChangeCnpj_cpf(e.target.value)}
              disabled={!isEditing}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Rua
            </label>
            <Input
              placeholder="Digite o nome da rua"
              value={endereco_rua || ''}
              onChange={(e) => onChangeEndereco_rua(e.target.value)}
              disabled={!isEditing}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Número
            </label>
            <Input
              placeholder="Digite o número"
              type="number"
              value={endereco_num || ''}
              onChange={(e) => onChangeEndereco_num(Number(e.target.value))}
              disabled={!isEditing}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Bairro
            </label>
            <Input
              placeholder="Digite o bairro"
              value={endereco_bairro || ''}
              onChange={(e) => onChangeEndereco_bairro(e.target.value)}
              disabled={!isEditing}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Cidade
            </label>
            <Input
              placeholder="Digite a cidade"
              value={endereco_cidade || ''}
              onChange={(e) => onChangeEndereco_cidade(e.target.value)}
              disabled={!isEditing}
              className="w-full"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4 mt-6 border-t">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={onCancel}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button
                onClick={onSubmit}
                disabled={isLoading}
              >
                {isLoading ? 'Salvando...' : 'Salvar'}
              </Button>
            </>
          ) : !isInitialSetup && (
            <Button onClick={onEdit}>
              Editar
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};