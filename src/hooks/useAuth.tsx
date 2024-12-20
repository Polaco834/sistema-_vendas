import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const useAuth = () => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmSenha, setConfirmSenha] = useState("");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (senha !== confirmSenha) {
      toast.error("As senhas não coincidem");
      return;
    }

    try {
      // First create the auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password: senha,
      });

      if (authError) throw authError;

      if (authData.user) {
        // Then create the user record in the usuarios table
        const { error: userError } = await supabase
          .from('usuarios')
          .insert([
            {
              nome_usuario: nome,
              tipo_acesso: 1,
              user_id: authData.user.id,
              email_user: email
            }
          ]);

        if (userError) {
          console.error('Erro ao criar usuário:', userError);
          // If there was an error creating the user record, delete the auth user
          await supabase.auth.signOut();
          throw new Error("Erro ao criar usuário. Por favor, tente novamente.");
        }

        toast.success("Conta criada com sucesso! Agora vamos cadastrar sua empresa.");
      }
    } catch (error: any) {
      console.error('Erro ao criar conta:', error);
      toast.error(error.message);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: senha,
      });

      if (error) throw error;

      if (data.session) {
        toast.success("Login realizado com sucesso!");
        navigate("/");
      }
    } catch (error: any) {
      console.error('Erro ao fazer login:', error);
      toast.error("Email ou senha incorretos");
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setNome("");
    setEmail("");
    setSenha("");
    setConfirmSenha("");
  };

  return {
    isSignUp,
    nome,
    email,
    senha,
    confirmSenha,
    setNome,
    setEmail,
    setSenha,
    setConfirmSenha,
    handleSignUp,
    handleSignIn,
    toggleMode,
  };
};