import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useUserSubscription } from "./useUserSubscription";
import { useCompanySubscription } from "./useCompanySubscription";

export const useUserData = () => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>();

  const fetchUserData = useCallback(async (userId: string) => {
    try {
      const { data, error: userError } = await supabase
        .from('usuarios')
        .select(`
          *,
          empresa:empresas (
            id,
            nome,
            cnpj_cpf,
            logo
          ),
          tipo:tipo_de_acesso (
            id,
            permissoes_acesso
          )
        `)
        .eq('user_id', userId)
        .single();

      if (userError) throw userError;

      setUserData(data);
      return data;
    } catch (err: any) {
      console.error('Erro ao buscar dados do usuário:', err);
      setError(err.message);
      toast.error("Erro ao carregar dados do usuário");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDataChange = useCallback(() => {
    if (userId) {
      fetchUserData(userId);
    }
  }, [userId, fetchUserData]);

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setLoading(false);
          setUserData(null);
          return;
        }

        setUserId(user.id);
        const data = await fetchUserData(user.id);
        if (!data) return;
      } catch (err: any) {
        console.error('Erro ao inicializar usuário:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    initializeUser();
  }, [fetchUserData]);

  useUserSubscription(userId, handleDataChange);
  useCompanySubscription(userData?.empresa?.id, handleDataChange);

  return { userData, loading, error };
};