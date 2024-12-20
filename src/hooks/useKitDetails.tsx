import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface KitItem {
  product: {
    id: string;
    nome: string;
    preco_venda: number;
  };
  quantidade: number;
}

interface KitDetails {
  id: string;
  nome: string;
  preco_venda: number;
  items: KitItem[];
}

export function useKitDetails() {
  const [loading, setLoading] = useState(false);

  const getKitDetails = async (kitId: string): Promise<KitDetails | null> => {
    if (!kitId) return null;
    
    setLoading(true);
    try {
      // Buscar os dados do kit na tabela produtos
      const { data: kitData, error: kitError } = await supabase
        .from('produtos')
        .select('*')
        .eq('id', kitId)
        .single();

      if (kitError) throw kitError;
      if (!kitData) return null;

      // Buscar os produtos que compõem o kit
      const { data: kitItems, error: itemsError } = await supabase
        .from('produtos_kit')
        .select(`
          quantidade,
          produto:produto_id (
            id,
            nome,
            preco_venda
          )
        `)
        .eq('kit_id', kitData.id);

      if (itemsError) throw itemsError;

      return {
        id: kitData.id.toString(),
        nome: kitData.nome,
        preco_venda: kitData.preco_venda,
        items: kitItems?.map(item => ({
          product: {
            id: item.produto.id.toString(),
            nome: item.produto.nome,
            preco_venda: item.produto.preco_venda
          },
          quantidade: item.quantidade
        })) || []
      };
    } catch (error) {
      console.error('Error fetching kit details:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    getKitDetails
  };
}
