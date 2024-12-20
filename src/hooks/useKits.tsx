import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';

export interface Kit {
  id: number;
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
  const { user } = useAuthContext();

  const fetchKits = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);

      // Primeiro, buscar o empresa_id do usuário
      const { data: userData, error: userError } = await supabase
        .from('usuarios')
        .select('empresa_id')
        .eq('user_id', user.id)
        .single();

      if (userError) throw userError;
      if (!userData?.empresa_id) throw new Error('No company assigned to user');

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
  }, [user]);

  return {
    kits,
    loading,
    fetchKits
  };
}
