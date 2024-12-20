import { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { BellDot, LogOut, User, Building2, Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import UserProfileForm from "./UserProfileForm";
import { useAuthContext } from "@/contexts/AuthContext";

const bgColors = [
  "bg-purple-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-red-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-cyan-500",
];

interface HeaderProps {
  onShowCompanyForm: () => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

export const Header = ({ 
  onShowCompanyForm, 
  isSidebarOpen, 
  setIsSidebarOpen 
}: HeaderProps) => {
  const { userData, accessTypeData, loading } = useAuthContext();
  const navigate = useNavigate();
  const [showProfileForm, setShowProfileForm] = useState(false);
  
  const randomColor = bgColors[Math.floor(Math.random() * bgColors.length)];
  const imageUrl = userData?.foto_perfil || null;

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast.success("Logout realizado com sucesso!", {
        style: {
          background: "#22c55e",
          color: "#ffffff",
          border: "none",
        },
      });
      
      navigate("/auth");
    } catch (error: any) {
      toast.error("Erro ao fazer logout", {
        style: {
          background: "#ef4444",
          color: "#ffffff",
          border: "none",
        },
      });
      console.error("Erro no logout:", error);
    }
  };

  return (
    <>
      <header className="h-16 bg-white border-b flex items-center justify-between px-4 lg:px-6 sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label={isSidebarOpen ? "Fechar menu" : "Abrir menu"}
          >
            <Menu className="h-5 w-5 text-gray-600" />
          </button>
          <div className="flex flex-col">
            <h2 className="font-semibold text-gray-800">
              {loading ? "Carregando..." : userData?.nome_usuario}
            </h2>
            <span className="text-sm text-gray-500">
              {loading ? "Carregando..." : accessTypeData?.permissoes_acesso}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
            <BellDot className="h-5 w-5 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar className="cursor-pointer border-2 border-black">
                {imageUrl && (
                  <AvatarImage 
                    src={imageUrl} 
                    alt="Foto de perfil"
                    className="object-cover w-full h-full"
                  />
                )}
                <AvatarFallback className={`${randomColor} text-white`}>
                  {userData?.nome_usuario ? userData.nome_usuario[0].toUpperCase() : '?'}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-white">
              <DropdownMenuItem 
                className="cursor-pointer"
                onClick={() => setShowProfileForm(true)}
              >
                <User className="mr-2 h-4 w-4" />
                Minha Conta
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="cursor-pointer"
                onClick={onShowCompanyForm}
              >
                <Building2 className="mr-2 h-4 w-4" />
                Minha Empresa
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="cursor-pointer text-red-600"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {showProfileForm && (
        <UserProfileForm onClose={() => setShowProfileForm(false)} />
      )}
    </>
  );
};