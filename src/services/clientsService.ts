import { supabase } from '@/integrations/supabase/client';
import type { Cliente, ClienteDetalhes } from '@/types/cliente';

export const clientsService = {
  // Busca todos os clientes com detalhes (usando a view)
  async getAllWithDetails() {
    const { data, error } = await supabase
      .from('cliente_detalhes')
      .select('*');

    if (error) throw new Error('Erro ao buscar detalhes dos clientes');
    return data as ClienteDetalhes[];
  },

  // Busca um cliente usando o cliente_id
  async getClientFromClienteId(clienteId: number) {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('id', clienteId)
      .single();

    if (error) throw new Error('Erro ao buscar cliente');
    return data as Cliente;
  },

  // Cria um novo cliente
  async create(client: Omit<Cliente, 'id' | 'created_at' | 'updated_at' | 'selecionado_para_conferencia'>) {
    const { data, error } = await supabase
      .from('clientes')
      .insert([{
        ...client,
        selecionado_para_conferencia: false
      }])
      .select()
      .single();

    if (error) throw new Error('Erro ao criar cliente');
    return data as Cliente;
  },

  // Atualiza um cliente
  async update(clienteId: number, client: Partial<Omit<Cliente, 'id' | 'created_at' | 'updated_at'>>) {
    const { data, error } = await supabase
      .from('clientes')
      .update(client)
      .eq('id', clienteId)
      .select()
      .single();

    if (error) throw new Error('Erro ao atualizar cliente');
    return data as Cliente;
  },

  // Deleta um cliente
  async delete(clienteId: number) {
    const { error } = await supabase
      .from('clientes')
      .delete()
      .eq('id', clienteId);

    if (error) throw new Error('Erro ao deletar cliente');
  }
};
