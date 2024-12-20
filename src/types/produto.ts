export interface Product {
  id: string;
  nome: string;
  preco_compra: number;
  preco_venda: number;
  empresa_id: string;
  created_at: string;
  is_kit: boolean;
  descricao?: string;
  codigo_barras?: string;
  estoque_minimo?: number;
  estoque_atual?: number;
}

export interface KitProduct extends Product {
  quantidade: number;
}

export interface KitItem {
  id?: string;
  product: {
    id: string;
    name: string;
  };
  quantity: number;
}

export interface Kit {
  id: string;
  name: string;
  sale_price: number;
  empresa_id: string;
  items: KitItem[];
}

export interface ProdutoKit {
  id: string;
  kit_id: string;
  produto_id: string;
  quantidade: number;
  produto?: {
    id: string;
    nome: string;
    preco_venda: number;
  };
}
