import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserAvatar } from "./UserAvatar";
import { formatPhone } from "@/components/company/CompanyFormUtils";

interface EditUserDataProps {
  name: string;
  email: string;
  phone: string;
  photo?: string;
  company: string;
  accessType: string;
  onChangeName: (value: string) => void;
  onChangePhone: (value: string) => void;
  onChangePhoto: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

export const EditUserData = ({
  name,
  email,
  phone,
  photo,
  company,
  accessType,
  onChangeName,
  onChangePhone,
  onChangePhoto,
  onSave,
  onCancel,
  isLoading
}: EditUserDataProps) => {
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(); }} className="space-y-5">
      <UserAvatar 
        photo={photo} 
        isEditing={true}
        onImageChange={onChangePhoto}
      />
      
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Nome
        </label>
        <Input
          value={name}
          onChange={(e) => onChangeName(e.target.value)}
          placeholder="Digite seu nome"
          className="border-[1.5px] border-gray-200 focus:border-primary focus:ring-primary/20 transition-all duration-200"
          required
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Email
        </label>
        <Input
          value={email}
          readOnly
          className="border-[1.5px] bg-gray-50 border-gray-200 text-gray-500"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Telefone
        </label>
        <Input
          value={phone}
          onChange={(e) => onChangePhone(formatPhone(e.target.value))}
          placeholder="(00) 00000-0000"
          className="border-[1.5px] border-gray-200 focus:border-primary focus:ring-primary/20 transition-all duration-200"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Empresa
        </label>
        <Input
          value={company}
          readOnly
          className="border-[1.5px] bg-gray-50 border-gray-200 text-gray-500"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Tipo de Acesso
        </label>
        <Input
          value={accessType}
          readOnly
          className="border-[1.5px] bg-gray-50 border-gray-200 text-gray-500"
        />
      </div>
      
      <div className="flex gap-3 justify-end pt-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isLoading}
          className="border-[1.5px] border-gray-200 hover:bg-gray-50"
        >
          Cancelar
        </Button>
        <Button 
          type="submit" 
          disabled={isLoading}
          className="bg-primary hover:bg-primary/90 border-[1.5px] border-primary"
        >
          {isLoading ? "Salvando..." : "Salvar"}
        </Button>
      </div>
    </form>
  );
};