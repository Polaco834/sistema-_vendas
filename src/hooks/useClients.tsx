import { useState } from 'react';
import { toast } from 'sonner';
import { ClienteDetalhes } from '@/types/cliente';
import { clientsService } from '@/services/clientsService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useClients() {
  const queryClient = useQueryClient();

  const { data: clients, isLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: () => clientsService.getAllWithDetails(),
  });

  const createMutation = useMutation({
    mutationFn: (client: Omit<ClienteDetalhes, 'cliente_id'>) => 
      clientsService.create(client),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success(`Cliente ${variables.nome} criado com sucesso!`, {
        description: 'Novo cliente adicionado ao sistema',
        duration: 5000
      });
    },
    onError: (error) => {
      console.error('Erro ao criar cliente:', error);
      toast.error('Erro ao criar cliente', {
        description: 'Verifique os dados e tente novamente',
        duration: 5000
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...client }: Partial<ClienteDetalhes> & { id: number }) =>
      clientsService.update(id, client),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success(`Cliente atualizado com sucesso!`, {
        description: 'Os dados do cliente foram atualizados',
        duration: 5000
      });
    },
    onError: (error) => {
      console.error('Erro ao atualizar cliente:', error);
      toast.error('Erro ao atualizar cliente', {
        description: 'Verifique os dados e tente novamente',
        duration: 5000
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => clientsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success('Cliente excluído com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao excluir cliente:', error);
      toast.error('Erro ao excluir cliente');
    }
  });

  return {
    clients,
    isLoading,
    createClient: createMutation.mutate,
    updateClient: updateMutation.mutate,
    deleteClient: deleteMutation.mutate
  };
}
