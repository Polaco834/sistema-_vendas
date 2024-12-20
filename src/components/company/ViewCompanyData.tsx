import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CompanyLogo } from "./CompanyLogo";

interface ViewCompanyDataProps {
  nome: string;
  cnpj_cpf: string;
  logo: string | null;
  endereco_rua?: string;
  endereco_cidade?: string;
  endereco_num?: number;
  endereco_bairro?: string;
  onEdit: () => void;
}

export const ViewCompanyData = ({
  nome,
  cnpj_cpf,
  logo,
  endereco_rua,
  endereco_cidade,
  endereco_num,
  endereco_bairro,
  onEdit
}: ViewCompanyDataProps) => {
  return (
    <div className="space-y-5">
      <CompanyLogo
        logo={logo}
        isEditing={false}
      />

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Nome da Empresa
        </label>
        <Input
          value={nome}
          readOnly
          className="border-[1.5px] bg-gray-50 border-gray-200 text-gray-500"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          CNPJ/CPF
        </label>
        <Input
          value={cnpj_cpf}
          readOnly
          className="border-[1.5px] bg-gray-50 border-gray-200 text-gray-500"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Rua
        </label>
        <Input
          value={endereco_rua || ""}
          readOnly
          className="border-[1.5px] bg-gray-50 border-gray-200 text-gray-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Número
          </label>
          <Input
            value={endereco_num || ""}
            readOnly
            className="border-[1.5px] bg-gray-50 border-gray-200 text-gray-500"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Bairro
          </label>
          <Input
            value={endereco_bairro || ""}
            readOnly
            className="border-[1.5px] bg-gray-50 border-gray-200 text-gray-500"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Cidade
        </label>
        <Input
          value={endereco_cidade || ""}
          readOnly
          className="border-[1.5px] bg-gray-50 border-gray-200 text-gray-500"
        />
      </div>

      <div className="flex justify-end pt-2">
        <Button
          type="button"
          onClick={onEdit}
        >
          Editar
        </Button>
      </div>
    </div>
  );
};