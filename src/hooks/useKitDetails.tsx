import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface KitItem {
  product: {
    id: string;
    name: string;
  };
  quantity: number;
}

interface KitDetails {
  id: string;
  name: string;
  sale_price: number;
  items: KitItem[];
}

export function useKitDetails() {
  const [loading, setLoading] = useState(false);

  const getKitDetails = async (kitId: string): Promise<KitDetails> => {
    setLoading(true);
    try {
      // Primeiro, buscar os dados do produto que é o kit
      const { data: kitProduct, error: kitError } = await supabase
        .from('produtos')
        .select('*')
        .eq('id', kitId)
        .single();

      if (kitError) throw kitError;

      // Depois, buscar os produtos que compõem o kit
      const { data: kitItems, error: itemsError } = await supabase
        .from('produtos_kit')
        .select(`
          quantidade,
          produto:produto_id (
            id,
            nome
          )
        `)
        .eq('kit_id', kitId);

      if (itemsError) throw itemsError;

      return {
        id: kitProduct.id,
        name: kitProduct.nome,
        sale_price: kitProduct.preco_venda,
        items: kitItems.map((item: any) => ({
          product: {
            id: item.produto.id,
            name: item.produto.nome
          },
          quantity: item.quantidade
        }))
      };
    } catch (error) {
      console.error('Error fetching kit details:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    getKitDetails,
    loading
  };
}
