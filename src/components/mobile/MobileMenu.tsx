import { useNavigate } from "react-router-dom";
import {
  ArrowLeftRight,
  Calendar,
  CreditCard,
  Users,
  ShoppingCart,
  Truck,
  LayoutGrid,
  UserPlus
} from "lucide-react";

interface MenuOption {
  icon: React.ReactNode;
  label: string;
  path: string;
}

export const MobileMenu = () => {
  const navigate = useNavigate();

  const menuOptions: MenuOption[] = [
    {
      icon: <ArrowLeftRight className="w-5 h-5 text-blue-600" />,
      label: "Trocas",
      path: "/trocas"
    },
    {
      icon: <Calendar className="w-5 h-5 text-blue-600" />,
      label: "Cx. Diário",
      path: "/caixa-diario"
    },
    {
      icon: <CreditCard className="w-5 h-5 text-blue-600" />,
      label: "Parcelas",
      path: "/parcelas"
    },
    {
      icon: <UserPlus className="w-5 h-5 text-blue-600" />,
      label: "Novo Cliente",
      path: "/novo-cliente"
    },
    {
      icon: <Users className="w-5 h-5 text-blue-600" />,
      label: "Clientes",
      path: "/clientes"
    },
    {
      icon: <ShoppingCart className="w-5 h-5 text-blue-600" />,
      label: "Nova venda",
      path: "/nova-venda"
    },
    {
      icon: <Truck className="w-5 h-5 text-blue-600" />,
      label: "Minha Carga",
      path: "/minha-carga"
    },
    {
      icon: <LayoutGrid className="w-5 h-5 text-blue-600" />,
      label: "Mais",
      path: "/mais"
    }
  ];

  return (
    <div className="grid grid-cols-4 gap-3 p-3 bg-gray-50">
      {menuOptions.map((option, index) => (
        <button
          key={index}
          onClick={() => navigate(option.path)}
          className="flex flex-col items-center justify-center transition-colors hover:bg-blue-50 rounded-lg p-2"
        >
          <div className="w-12 h-12 rounded-full bg-blue-100/50 flex items-center justify-center mb-1 transition-colors group-hover:bg-blue-200">
            {option.icon}
          </div>
          <span className="text-[10px] text-gray-600 group-hover:text-blue-600">
            {option.label}
          </span>
        </button>
      ))}
    </div>
  );
};
