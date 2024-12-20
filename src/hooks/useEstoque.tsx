import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/contexts/AuthContext";

export interface EstoqueItem {
  id?: string;
  produto_id?: string;
  nome?: string;
  nome_produto?: string;
  preco_compra?: number;
  preco_venda?: number;
  quantidade_total?: number;
  valor_total_produto?: number;
  image_produtos?: string;
  imagem_url?: string;
  is_kit: boolean;
  empresa_id?: string;
}

export interface KitItem {
  kit_id: string;
  nome_kit: string;
  preco_compra_kit: number;
  preco_venda_kit: number;
  is_kit: boolean;
  empresa_id: string;
  quantidade_itens_kit: number;
  preco_total_kit: number;
  margem_lucro_kit: number;
}

export function useEstoque() {
  const [items, setItems] = useState<EstoqueItem[]>([]);
  const [kits, setKits] = useState<KitItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthContext();

  const fetchItems = useCallback(async (isKit: boolean = false) => {
    try {
      if (!user) throw new Error('User not authenticated');

      // 1. Primeiro pegamos o empresa_id do usuário
      const { data: userData, error: userError } = await supabase
        .from('usuarios')
        .select('empresa_id')
        .eq('user_id', user.id)
        .single();

      if (userError) throw userError;
      if (!userData?.empresa_id) throw new Error('No company assigned to user');

      if (isKit) {
        // Busca kits da view vw_kit_completo
        const { data: kitsData, error: kitsError } = await supabase
          .from('vw_kit_completo')
          .select('*')
          .eq('empresa_id', userData.empresa_id);

        if (kitsError) {
          console.error('Error fetching kits:', kitsError);
          return;
        }

        console.log('Kits data:', kitsData); // Debug
        setKits(kitsData || []);
      } else {
        // Busca produtos da view vw_estoque_completo_empresa
        const { data: productsData, error: productsError } = await supabase
          .from('vw_estoque_completo_empresa')
          .select('*')
          .eq('empresa_id', userData.empresa_id)
          .eq('is_kit', false);

        if (productsError) {
          console.error('Error fetching products:', productsError);
          return;
        }

        console.log('Products data:', productsData); // Debug
        setItems(productsData || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      // Busca produtos e kits separadamente
      fetchItems(false); // Busca produtos
      fetchItems(true);  // Busca kits
    }
  }, [user, fetchItems]);

  return { items, kits, loading, fetchItems };
}
