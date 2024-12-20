import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from './useAuth.tsx';

interface ProdutoEstoque {
  id: string;
  nome: string;
  quantidade_total: number;
  tipo_produto: string;
  percentual: number;
}

interface MovimentoEstoque {
  id: string;
  data_movimento: string;
  tipo: string;
  produto_nome: string;
  quantidade: number;
}

export function usePainelEstoque() {
  const { empresa_id } = useAuth();
  const [produtos, setProdutos] = useState<ProdutoEstoque[]>([]);
  const [movimentos, setMovimentos] = useState<MovimentoEstoque[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!empresa_id) {
      setIsLoading(false);
      setError('Empresa não identificada. Por favor, faça login novamente.');
      return;
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Buscar produtos com quantidade total
        const { data: produtosData, error: produtosError } = await supabase
          .from('produtos')
          .select('id, nome, tipo_produto, quantidade_atual')
          .eq('empresa_id', empresa_id);

        if (produtosError) {
          console.error('Erro ao buscar produtos:', produtosError);
          throw new Error('Erro ao carregar produtos');
        }

        if (!produtosData) {
          setProdutos([]);
        } else {
          // Calcular o total geral para os percentuais
          const totalGeral = produtosData.reduce((acc, produto) => acc + (produto.quantidade_atual || 0), 0);

          // Formatar dados dos produtos
          const produtosFormatados = produtosData.map(produto => ({
            id: produto.id,
            nome: produto.nome,
            quantidade_total: produto.quantidade_atual || 0,
            tipo_produto: produto.tipo_produto || 'Não especificado',
            percentual: totalGeral > 0 
              ? ((produto.quantidade_atual || 0) / totalGeral) * 100 
              : 0
          }));

          setProdutos(produtosFormatados);
        }

        // Buscar últimos movimentos
        const { data: movimentosData, error: movimentosError } = await supabase
          .from('movimento_estoque')
          .select('id, data_movimento, tipo, quantidade, produtos (nome)')
          .eq('empresa_id', empresa_id)
          .order('data_movimento', { ascending: false })
          .limit(10);

        if (movimentosError) {
          console.error('Erro ao buscar movimentos:', movimentosError);
          throw new Error('Erro ao carregar movimentos');
        }

        if (!movimentosData) {
          setMovimentos([]);
        } else {
          // Formatar dados dos movimentos
          const movimentosFormatados = movimentosData.map(movimento => ({
            id: movimento.id,
            data_movimento: movimento.data_movimento,
            tipo: movimento.tipo,
            produto_nome: movimento.produtos?.nome || 'Produto não encontrado',
            quantidade: movimento.quantidade
          }));

          setMovimentos(movimentosFormatados);
        }
      } catch (err) {
        console.error('Erro ao carregar dados do painel:', err);
        setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [empresa_id]);

  return {
    produtos,
    movimentos,
    isLoading,
    error
  };
}
