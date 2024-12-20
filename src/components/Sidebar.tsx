import { BarChart3, DollarSign, Users, CreditCard, PiggyBank, MessageSquare, Settings, ChevronLeft, UserCircle, Package2, ChevronDown, LayoutDashboard } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

interface SidebarProps {
  isSidebarOpen?: boolean;
  setIsSidebarOpen?: (open: boolean) => void;
}

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }: SidebarProps) => {
  const location = useLocation();
  const [isEstoqueOpen, setIsEstoqueOpen] = useState(false);

  const menuItems = [
    { icon: BarChart3, label: "Dashboard", path: "/" },
    { icon: DollarSign, label: "Vendas", path: "/vendas" },
    { icon: UserCircle, label: "Clientes", path: "/clientes" },
    {
      icon: Package2,
      label: "Estoque",
      path: "/estoque",
      submenu: [
        { icon: LayoutDashboard, label: "Painel Estoque", path: "/estoque/painel" },
        { icon: Package2, label: "Gerenciar Estoque", path: "/estoque" },
      ]
    },
    { icon: Users, label: "Equipes", path: "/equipes" },
    { icon: CreditCard, label: "Financeiro", path: "/financeiro" },
    { icon: PiggyBank, label: "Caixa", path: "/caixa" },
    { icon: MessageSquare, label: "Mensagens", path: "/mensagens" },
    { icon: Settings, label: "Configurações", path: "/configuracoes" },
  ];

  return (
    <div className="sidebar bg-sidebar w-56 h-screen overflow-y-auto p-4 transition-transform duration-300">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-white text-xl font-bold">Sales Control</h1>
        <ChevronLeft 
          className="text-white h-5 w-5 lg:hidden cursor-pointer" 
          onClick={() => setIsSidebarOpen?.(false)}
        />
      </div>
      <nav className="space-y-1">
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path || 
                          (item.path === "/" && location.pathname === "") ||
                          (item.submenu && item.submenu.some(subitem => location.pathname === subitem.path));
          
          const isSubmenuOpen = item.submenu && (isEstoqueOpen || isActive);

          return (
            <div key={index}>
              {item.submenu ? (
                <>
                  <button
                    onClick={() => setIsEstoqueOpen(!isEstoqueOpen)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 text-gray-300 rounded-lg group transition-colors ${
                      isActive ? "bg-sidebar-hover text-white" : "hover:bg-sidebar-hover"
                    }`}
                  >
                    <div className="flex items-center">
                      <item.icon className="sidebar-icon mr-3" />
                      <span>{item.label}</span>
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${isSubmenuOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {isSubmenuOpen && (
                    <div className="ml-6 mt-1 space-y-1">
                      {item.submenu.map((subitem, subindex) => (
                        <Link
                          key={subindex}
                          to={subitem.path}
                          className={`flex items-center px-3 py-2 text-sm text-gray-300 rounded-lg group transition-colors ${
                            location.pathname === subitem.path
                              ? "bg-sidebar-hover text-white"
                              : "hover:bg-sidebar-hover"
                          }`}
                        >
                          <subitem.icon className="sidebar-icon mr-2 h-4 w-4" />
                          <span>{subitem.label}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to={item.path}
                  className={`flex items-center px-3 py-2.5 text-gray-300 rounded-lg group transition-colors ${
                    isActive ? "bg-sidebar-hover text-white" : "hover:bg-sidebar-hover"
                  }`}
                >
                  <item.icon className="sidebar-icon mr-3" />
                  <span>{item.label}</span>
                </Link>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;