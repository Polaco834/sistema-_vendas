import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Vendas from "./pages/Vendas";
import ClientsPage from "./pages/Clients";
import Equipes from "./pages/Equipes";
import Financeiro from "./pages/Financeiro";
import Caixa from "./pages/Caixa";
import Mensagens from "./pages/Mensagens";
import Configuracoes from "./pages/Configuracoes";
import AuthPage from "./pages/Auth";
import CompanyForm from "./components/CompanyForm";
import { MainLayout } from "./components/MainLayout";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { Toaster as SonnerToaster } from 'sonner';
import { CompanyRegistrationModal } from "./components/company/CompanyRegistrationModal";
import Estoque from "./pages/Estoque";
import PainelEstoque from "./pages/PainelEstoque";

const queryClient = new QueryClient();

const App = () => {
  const [showCompanyForm, setShowCompanyForm] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <BrowserRouter>
            <div className="min-h-screen bg-background">
              <SonnerToaster position="top-right" />
              {/* CompanyRegistrationModal precisa estar aqui para estar disponível em todas as rotas protegidas */}
              <CompanyRegistrationModal />
              <Routes>
                <Route path="/auth" element={<AuthPage />} />
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <MainLayout onShowCompanyForm={() => setShowCompanyForm(true)}>
                        <Index />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/vendas"
                  element={
                    <ProtectedRoute>
                      <MainLayout onShowCompanyForm={() => setShowCompanyForm(true)}>
                        <Vendas />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/clientes"
                  element={
                    <ProtectedRoute>
                      <MainLayout onShowCompanyForm={() => setShowCompanyForm(true)}>
                        <ClientsPage />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/estoque"
                  element={
                    <ProtectedRoute>
                      <MainLayout onShowCompanyForm={() => setShowCompanyForm(true)}>
                        <Estoque />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/estoque/painel"
                  element={
                    <ProtectedRoute>
                      <MainLayout onShowCompanyForm={() => setShowCompanyForm(true)}>
                        <PainelEstoque />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/equipes"
                  element={
                    <ProtectedRoute>
                      <MainLayout onShowCompanyForm={() => setShowCompanyForm(true)}>
                        <Equipes />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/financeiro"
                  element={
                    <ProtectedRoute>
                      <MainLayout onShowCompanyForm={() => setShowCompanyForm(true)}>
                        <Financeiro />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/caixa"
                  element={
                    <ProtectedRoute>
                      <MainLayout onShowCompanyForm={() => setShowCompanyForm(true)}>
                        <Caixa />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/mensagens"
                  element={
                    <ProtectedRoute>
                      <MainLayout onShowCompanyForm={() => setShowCompanyForm(true)}>
                        <Mensagens />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/configuracoes"
                  element={
                    <ProtectedRoute>
                      <MainLayout onShowCompanyForm={() => setShowCompanyForm(true)}>
                        <Configuracoes />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
              </Routes>
              {showCompanyForm && (
                <CompanyForm
                  open={showCompanyForm}
                  onClose={() => setShowCompanyForm(false)}
                />
              )}
              <Toaster />
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;