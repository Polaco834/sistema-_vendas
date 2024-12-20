import { supabase } from '@/integrations/supabase/client';

export interface Vendedor {
  id: number;
  nome: string;
}

export const vendedorService = {
  getAll: async () => {
    try {
      const { data, error } = await supabase
        .from('vendedor')
        .select('id, nome')
        .order('nome');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar vendedores:', error);
      return [];
    }
  },

  getById: async (id: number) => {
    try {
      const { data, error } = await supabase
        .from('vendedor')
        .select('id, nome')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao buscar vendedor:', error);
      return null;
    }
  }
};
