import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CompanyLogo } from "./CompanyLogo";
import { formatDocument } from "./CompanyFormUtils";

interface EditCompanyDataProps {
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
  onSave: () => void;
  onCancel: () => void;
  isLoading: boolean;
  onImageSelect: (file: File) => void;
}

export const EditCompanyData = ({
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
  onSave,
  onCancel,
  isLoading,
  onImageSelect
}: EditCompanyDataProps) => {
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(); }} className="space-y-5">
      <CompanyLogo
        logo={logo}
        isEditing={true}
        onImageSelect={onImageSelect}
      />

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Nome da Empresa
        </label>
        <Input
          value={nome}
          onChange={(e) => onChangeNome(e.target.value)}
          placeholder="Digite o nome da empresa"
          className="border-[1.5px] border-gray-200 focus:border-primary focus:ring-primary/20 transition-all duration-200"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          CNPJ/CPF
        </label>
        <Input
          value={cnpj_cpf}
          onChange={(e) => onChangeCnpj_cpf(formatDocument(e.target.value))}
          placeholder="Digite o CNPJ ou CPF"
          className="border-[1.5px] border-gray-200 focus:border-primary focus:ring-primary/20 transition-all duration-200"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Rua
        </label>
        <Input
          value={endereco_rua}
          onChange={(e) => onChangeEndereco_rua(e.target.value)}
          placeholder="Digite o nome da rua"
          className="border-[1.5px] border-gray-200 focus:border-primary focus:ring-primary/20 transition-all duration-200"
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
            onChange={(e) => onChangeEndereco_num(parseInt(e.target.value))}
            placeholder="Nº"
            className="border-[1.5px] border-gray-200 focus:border-primary focus:ring-primary/20 transition-all duration-200"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Bairro
          </label>
          <Input
            value={endereco_bairro}
            onChange={(e) => onChangeEndereco_bairro(e.target.value)}
            placeholder="Digite o bairro"
            className="border-[1.5px] border-gray-200 focus:border-primary focus:ring-primary/20 transition-all duration-200"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Cidade
        </label>
        <Input
          value={endereco_cidade}
          onChange={(e) => onChangeEndereco_cidade(e.target.value)}
          placeholder="Digite a cidade"
          className="border-[1.5px] border-gray-200 focus:border-primary focus:ring-primary/20 transition-all duration-200"
        />
      </div>

      <div className="flex gap-3 justify-end pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Salvando..." : "Salvar"}
        </Button>
      </div>
    </form>
  );
};