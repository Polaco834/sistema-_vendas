import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthForm } from "@/components/auth/AuthForm";
import { CompleteProfileModal } from "@/components/user/CompleteProfileModal";
import { useAuth } from "@/hooks/useAuth";

const AuthPage = () => {
  const navigate = useNavigate();
  const {
    isSignUp,
    nome,
    email,
    senha,
    confirmSenha,
    showCompleteProfile,
    newUserId,
    setNome,
    setEmail,
    setSenha,
    setConfirmSenha,
    handleSignUp,
    handleSignIn,
    toggleMode,
    handleCompleteProfile,
  } = useAuth();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        navigate("/");
      }
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <AuthLayout>
      <AuthForm
        isSignUp={isSignUp}
        nome={nome}
        email={email}
        senha={senha}
        confirmSenha={confirmSenha}
        onNomeChange={setNome}
        onEmailChange={setEmail}
        onSenhaChange={setSenha}
        onConfirmSenhaChange={setConfirmSenha}
        onSubmit={isSignUp ? handleSignUp : handleSignIn}
        onToggleMode={toggleMode}
      />

      {showCompleteProfile && newUserId && (
        <CompleteProfileModal
          name={nome}
          email={email}
          userId={newUserId}
          onComplete={handleCompleteProfile}
        />
      )}
    </AuthLayout>
  );
};

export default AuthPage;