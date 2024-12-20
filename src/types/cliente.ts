export interface Cliente {
  id: number;
  nome: string;
  cpf: string;
  localizacao?: string;
  telefone?: string;
  status: 'ativo' | 'inadimplente';
  selecionado_para_conferencia: boolean;
  rua?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  cep?: string;
  vendedor_id?: number;
  empresa_id?: number;
  uf?: string;
  limite_compra: number;
  proxima_visita?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ClienteDetalhes extends Cliente {
  total_compras: number;
  total_vendas: number;
  ultima_compra: string;
  ultima_venda: string;
  media_compras: number;
  media_vendas: number;
}

export interface VendaMensal {
  mes: string;
  valor_total: number;
}
