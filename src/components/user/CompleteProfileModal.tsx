import { useState } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "./UserAvatar";
import { formatPhone } from "@/components/company/CompanyFormUtils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import CompanyForm from "../CompanyForm";

interface CompleteProfileModalProps {
  name: string;
  email: string;
  userId: string;
  onComplete: () => void;
}

export const CompleteProfileModal = ({
  name,
  email,
  userId,
  onComplete,
}: CompleteProfileModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [photo, setPhoto] = useState("");
  const [showCompanyForm, setShowCompanyForm] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('usuarios')
        .update({
          telefone: phone,
          foto_perfil: photo,
        })
        .eq('user_id', userId);

      if (error) throw error;

      // Check if user has a company
      const { data: companyData, error: companyError } = await supabase
        .from('empresas')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (companyError && companyError.code !== 'PGRST116') {
        throw companyError;
      }

      if (companyData) {
        // If has company, complete the flow
        onComplete();
      } else {
        // If no company, show company form
        setShowCompanyForm(true);
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error("Erro ao atualizar perfil");
    } finally {
      setIsLoading(false);
    }
  };

  if (showCompanyForm) {
    return <CompanyForm onClose={onComplete} isInitialSetup={true} />;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-8">
      <div className="bg-white rounded-xl w-full max-w-md relative flex flex-col h-[85vh]">
        <div className="p-6 border-b sticky top-0 bg-white rounded-t-xl z-10">
          <button
            onClick={onComplete}
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
          <div>
            <h2 className="text-xl font-semibold mb-1">Complete seu cadastro</h2>
            <p className="text-gray-600">
              Adicione mais algumas informações ao seu perfil
            </p>
          </div>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-5">
            <UserAvatar 
              photo={photo} 
              isEditing={true}
              onImageChange={setPhoto}
            />
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Nome
              </label>
              <Input
                value={name}
                readOnly
                className="border-[1.5px] bg-gray-50 border-gray-200 text-gray-500"
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
                onChange={(e) => setPhone(formatPhone(e.target.value))}
                placeholder="(00) 00000-0000"
                className="border-[1.5px] border-gray-200 focus:border-primary focus:ring-primary/20 transition-all duration-200"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Empresa
              </label>
              <Input
                value="Ainda não tem uma empresa"
                readOnly
                className="border-[1.5px] bg-gray-50 border-gray-200 text-gray-500"
              />
            </div>
            
            <div className="flex gap-3 justify-end pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onComplete}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
              >
                Salvar
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
