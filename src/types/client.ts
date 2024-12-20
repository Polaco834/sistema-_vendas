export interface Client {
  id: number;
  nome: string;
  cpf: string;
  telefone: string | null;
  status: 'ativo' | 'inadimplente';
  vendedor_id: number | null;
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
  empresa_id: number;
  localizacao: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ClientModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (client: Client) => Promise<void>;
}
