import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';

export interface Kit {
  id: number;
  kit_id: number;
  nome_kit: string;
  preco_venda_kit: number;
  preco_total_kit: number;
  margem_lucro_kit: number;
  quantidade_itens_kit: number;
  empresa_id: number;
}

export function useKits() {
  const [kits, setKits] = useState<Kit[]>([]);
  const [loading, setLoading] = useState(false);
  const { user, userData, refreshUserData } = useAuthContext();

  const fetchKits = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);

      // Se não tiver userData, tentar recarregar
      if (!userData?.empresa_id) {
        await refreshUserData();
        return; // O useEffect vai chamar fetchKits novamente quando userData for atualizado
      }

      // Buscar os kits da view vw_kit_completo
      const { data: kitsData, error: kitsError } = await supabase
        .from('vw_kit_completo')
        .select('*')
        .eq('empresa_id', userData.empresa_id);

      if (kitsError) throw kitsError;

      setKits(kitsData || []);
    } catch (error) {
      console.error('Error fetching kits:', error);
      setKits([]);
    } finally {
      setLoading(false);
    }
  }, [user, userData, refreshUserData]);

  // Recarregar kits quando userData mudar
  useEffect(() => {
    if (userData?.empresa_id) {
      fetchKits();
    }
  }, [userData, fetchKits]);

  return {
    kits,
    loading,
    fetchKits
  };
}
