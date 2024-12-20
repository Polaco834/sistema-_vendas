import { useState } from "react";
import { X } from "lucide-react";
import { ViewUserData } from "./user/ViewUserData";
import { EditUserData } from "./user/EditUserData";
import { useUserProfileData } from "@/hooks/useUserProfileData";

interface UserProfileFormProps {
  onClose: () => void;
}

const UserProfileForm = ({ onClose }: UserProfileFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  
  const {
    name,
    setName,
    email,
    phone,
    setPhone,
    photo,
    setPhoto,
    company,
    accessType,
    isLoading,
    initialData,
    handleSave
  } = useUserProfileData();

  const handleSubmit = async () => {
    const success = await handleSave();
    if (success) {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setName(initialData.name);
    setPhone(initialData.phone);
    setPhoto(initialData.photo);
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-8">
      <div className="bg-white rounded-xl w-full max-w-md relative flex flex-col h-[85vh]">
        <div className="p-6 border-b sticky top-0 bg-white rounded-t-xl z-10">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
          
          <div>
            <h2 className="text-xl font-semibold mb-1">Minha Conta</h2>
            <p className="text-gray-600">
              {isEditing 
                ? "Edite suas informações pessoais"
                : "Suas informações pessoais"}
            </p>
          </div>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {isEditing ? (
            <EditUserData
              name={name}
              email={email}
              phone={phone}
              photo={photo}
              company={company}
              accessType={accessType}
              onChangeName={setName}
              onChangePhone={setPhone}
              onChangePhoto={setPhoto}
              onSave={handleSubmit}
              onCancel={handleCancel}
              isLoading={isLoading}
            />
          ) : (
            <ViewUserData
              name={name}
              email={email}
              phone={phone}
              photo={photo}
              company={company}
              accessType={accessType}
              onEdit={() => setIsEditing(true)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfileForm;