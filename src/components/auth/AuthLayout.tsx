import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gray-50 items-center justify-center p-12">
        <img
          src="https://img.freepik.com/free-vector/business-team-discussing-ideas-startup_74855-4380.jpg"
          alt="Administração Empresarial"
          className="max-w-full h-auto rounded-2xl shadow-lg"
        />
      </div>
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-4 lg:p-12">
        <div className="max-w-md w-full mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Bem-vindo ao Sales Control
          </h2>
          <p className="text-gray-600 mb-8">
            Gerencie sua empresa de forma eficiente e inteligente
          </p>
          {children}
        </div>
      </div>
    </div>
  );
};