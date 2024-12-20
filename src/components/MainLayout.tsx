import { ReactNode, useState } from "react";
import { Header } from "./Header";
import Sidebar from "./Sidebar";
import { MobileTabBar } from "./mobile/MobileTabBar";

interface MainLayoutProps {
  children: ReactNode;
  onShowCompanyForm: () => void;
}

export const MainLayout = ({ children, onShowCompanyForm }: MainLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <div 
        className={`fixed lg:static inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <Sidebar 
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      </div>

      {/* Overlay escuro para mobile quando o menu está aberto */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header 
          onShowCompanyForm={onShowCompanyForm} 
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 pb-20 md:pb-6">
          {children}
        </main>

        {/* Tab Bar móvel */}
        <MobileTabBar />
      </div>
    </div>
  );
};