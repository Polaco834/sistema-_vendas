import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AuthFormProps {
  isSignUp: boolean;
  nome: string;
  email: string;
  senha: string;
  confirmSenha: string;
  onNomeChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onSenhaChange: (value: string) => void;
  onConfirmSenhaChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onToggleMode: () => void;
}

export const AuthForm = ({
  isSignUp,
  nome,
  email,
  senha,
  confirmSenha,
  onNomeChange,
  onEmailChange,
  onSenhaChange,
  onConfirmSenhaChange,
  onSubmit,
  onToggleMode,
}: AuthFormProps) => {
  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
      <form onSubmit={onSubmit} className="space-y-5">
        {isSignUp && (
          <div className="space-y-2">
            <label htmlFor="nome" className="text-sm font-medium text-gray-700">
              Nome
            </label>
            <Input
              id="nome"
              type="text"
              value={nome}
              onChange={(e) => onNomeChange(e.target.value)}
              placeholder="Seu nome"
              className="border-[1.5px] border-gray-200 focus:border-primary focus:ring-primary/20 transition-all duration-200"
              required
            />
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="seu@email.com"
            className="border-[1.5px] border-gray-200 focus:border-primary focus:ring-primary/20 transition-all duration-200"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="senha" className="text-sm font-medium text-gray-700">
            Senha
          </label>
          <Input
            id="senha"
            type="password"
            value={senha}
            onChange={(e) => onSenhaChange(e.target.value)}
            placeholder="Sua senha"
            className="border-[1.5px] border-gray-200 focus:border-primary focus:ring-primary/20 transition-all duration-200"
            required
          />
        </div>

        {isSignUp && (
          <div className="space-y-2">
            <label htmlFor="confirmSenha" className="text-sm font-medium text-gray-700">
              Confirmar Senha
            </label>
            <Input
              id="confirmSenha"
              type="password"
              value={confirmSenha}
              onChange={(e) => onConfirmSenhaChange(e.target.value)}
              placeholder="Confirme sua senha"
              className="border-[1.5px] border-gray-200 focus:border-primary focus:ring-primary/20 transition-all duration-200"
              required
            />
          </div>
        )}

        <Button 
          type="submit" 
          className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2.5 border-[1.5px] border-primary"
        >
          {isSignUp ? "Criar conta" : "Entrar"}
        </Button>

        <p className="text-center text-sm text-gray-600">
          {isSignUp ? "Já tem uma conta? " : "Ainda não tem uma conta? "}
          <button
            type="button"
            onClick={onToggleMode}
            className="text-primary hover:text-primary/80 font-medium transition-colors"
          >
            {isSignUp ? "Entre" : "Cadastre-se"}
          </button>
        </p>
      </form>
    </div>
  );
};