import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  Wallet,
  Calendar,
  LayoutGrid,
  Mail
} from "lucide-react";

interface TabOption {
  icon: React.ReactNode;
  label: string;
  path: string;
}

export const MobileTabBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs: TabOption[] = [
    {
      icon: <Home className="w-5 h-5" />,
      label: "Início",
      path: "/"
    },
    {
      icon: <Wallet className="w-5 h-5" />,
      label: "Financeiro",
      path: "/financeiro"
    },
    {
      icon: <Calendar className="w-5 h-5" />,
      label: "Agenda",
      path: "/agenda"
    },
    {
      icon: <Mail className="w-5 h-5" />,
      label: "Mensagens",
      path: "/mensagens"
    },
    {
      icon: <LayoutGrid className="w-5 h-5" />,
      label: "Serviços",
      path: "/servicos"
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden">
      <div className="flex justify-around items-center h-16 px-4">
        {tabs.map((tab, index) => {
          const isActive = location.pathname === tab.path;
          return (
            <button
              key={index}
              onClick={() => navigate(tab.path)}
              className="flex flex-col items-center justify-center flex-1"
            >
              <div className={`p-1.5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                {tab.icon}
              </div>
              <span className={`text-[10px] mt-0.5 ${isActive ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
      {/* Adiciona padding na parte inferior para iOS */}
      <div className="h-safe-bottom bg-white" />
    </div>
  );
};
