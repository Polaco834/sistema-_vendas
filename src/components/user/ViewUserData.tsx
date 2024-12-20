import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserAvatar } from "./UserAvatar";
import { formatPhone } from "@/components/company/CompanyFormUtils";

interface ViewUserDataProps {
  name: string;
  email: string;
  phone: string;
  photo?: string;
  company: string;
  accessType: string;
  onEdit: () => void;
}

export const ViewUserData = ({
  name,
  email,
  phone,
  photo,
  company,
  accessType,
  onEdit
}: ViewUserDataProps) => {
  return (
    <div className="space-y-4">
      <UserAvatar 
        photo={photo} 
        isEditing={false}
      />
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nome
        </label>
        <Input
          value={name}
          readOnly
          className="bg-gray-100"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <Input
          value={email}
          readOnly
          className="bg-gray-100"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Telefone
        </label>
        <Input
          value={phone ? formatPhone(phone) : ''}
          readOnly
          className="bg-gray-100"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Empresa
        </label>
        <Input
          value={company}
          readOnly
          className="bg-gray-100"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tipo de Acesso
        </label>
        <Input
          value={accessType}
          readOnly
          className="bg-gray-100"
        />
      </div>
      
      <div className="flex justify-end">
        <Button 
          type="button" 
          onClick={onEdit}
          className="bg-blue-500 hover:bg-blue-600"
        >
          Editar
        </Button>
      </div>
    </div>
  );
};