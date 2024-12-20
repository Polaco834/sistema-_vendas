import { useQuery } from '@tanstack/react-query';
import { clientsService } from '@/services/clientsService';
import type { Cliente } from '@/types/cliente';

export function useClientDetails(clienteId: number | undefined) {
  return useQuery<Cliente>({
    queryKey: ['client', clienteId],
    queryFn: () => clienteId ? clientsService.getClientFromClienteId(clienteId) : null,
    enabled: !!clienteId,
  });
}
