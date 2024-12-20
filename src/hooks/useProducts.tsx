import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useAuthContext } from '@/contexts/AuthContext';

export interface Product {
  id: string;
  nome: string;
  preco_compra?: number;
  preco_venda: number;
  bar_code?: string;
  image_produtos?: string;
  is_kit: boolean;
  empresa_id: string | null;
  created_at?: string;
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuthContext();

  const fetchProducts = async () => {
    setLoading(true);
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

      // 2. Agora buscamos os produtos dessa empresa
      const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .eq('empresa_id', userData.empresa_id);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      // Log da query completa para debug
      console.log('Products fetched:', data);
      
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Erro ao carregar produtos",
        description: "Não foi possível carregar a lista de produtos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (productData: Omit<Product, 'id' | 'created_at'>) => {
    try {
      if (!user) throw new Error('User not authenticated');

      // Get empresa_id from usuarios table
      const { data: userData, error: userError } = await supabase
        .from('usuarios')
        .select('empresa_id')
        .eq('user_id', user.id)
        .single();

      if (userError) throw userError;
      if (!userData?.empresa_id) throw new Error('No company assigned to user');

      const { data, error } = await supabase
        .from('produtos')
        .insert([{ ...productData, empresa_id: userData.empresa_id }])
        .select()
        .single();

      if (error) throw error;
      
      await fetchProducts();
      return data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  };

  const updateProduct = async (id: string, productData: Partial<Product>) => {
    try {
      // Remove campos undefined ou null para não sobrescrever dados existentes
      const cleanData = Object.fromEntries(
        Object.entries(productData).filter(([_, value]) => value !== undefined && value !== null)
      );

      const { error } = await supabase
        .from('produtos')
        .update(cleanData)
        .eq('id', id);

      if (error) throw error;
      
      await fetchProducts();
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('produtos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      await fetchProducts();
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  };

  const createKit = async (kitData: {
    nome: string;
    preco_venda: number;
    produtos: Array<{ id: string; quantidade: number; }>;
  }) => {
    try {
      if (!user) throw new Error('User not authenticated');

      // Get empresa_id from usuarios table
      const { data: userData, error: userError } = await supabase
        .from('usuarios')
        .select('empresa_id')
        .eq('user_id', user.id)
        .single();

      if (userError) throw userError;
      if (!userData?.empresa_id) throw new Error('No company assigned to user');

      // Criar o produto do tipo kit
      const { data: kit, error: kitError } = await supabase
        .from('produtos')
        .insert([{
          nome: kitData.nome,
          preco_venda: kitData.preco_venda,
          is_kit: true,
          empresa_id: userData.empresa_id
        }])
        .select()
        .single();

      if (kitError) throw kitError;
      if (!kit) throw new Error('Failed to create kit');

      // Criar as relações na tabela produtos_kit
      const kitProdutosRelations = kitData.produtos.map(produto => ({
        kit_id: kit.id,
        produto_id: produto.id,
        quantidade: produto.quantidade
      }));

      const { error: relationError } = await supabase
        .from('produtos_kit')
        .insert(kitProdutosRelations);

      if (relationError) {
        await supabase
          .from('produtos')
          .delete()
          .eq('id', kit.id);
        throw relationError;
      }

      await fetchProducts();
      return kit;
    } catch (error) {
      console.error('Error creating kit:', error);
      throw error;
    }
  };

  const uploadProductImage = async (file: File): Promise<string> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `produtos/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('imagens')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('imagens')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading product image:', error);
      throw error;
    }
  };

  const getProductById = async (productId: string): Promise<Product | null> => {
    try {
      const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .eq('id', productId)
        .single();

      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error fetching product:', error);
      toast({
        title: "Erro ao carregar produto",
        description: "Não foi possível carregar os dados do produto.",
        variant: "destructive",
      });
      return null;
    }
  };

  useEffect(() => {
    if (user) {
      fetchProducts();
    }
  }, [user?.id]);

  return {
    products,
    loading,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    createKit,
    uploadProductImage,
    getProductById,
  };
}
