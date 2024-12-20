import { useState } from "react";
import { ClienteDetalhes } from "@/types/cliente";
import { ClientCard } from "./ClientCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface ClientListProps {
  onClientSelect: (cliente: ClienteDetalhes) => void;
  onNewClient: () => void;
}

export function ClientList({ onClientSelect, onNewClient }: ClientListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const supabase = useSupabaseClient();
  const queryClient = useQueryClient();

  const { data: clientes = [], isLoading, error: queryError, refetch } = useQuery({
    queryKey: ["clientes", searchTerm],
    queryFn: async () => {
      // Teste direto com fetch usando a mesma configuração do curl
      const response = await fetch('https://hbqoafwfjbosmsukeznn.supabase.co/rest/v1/cliente_detalhes?select=*', {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhicW9hZndmamJvc21zdWtlem5uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjYxOTE5MzEsImV4cCI6MjA0MTc2NzkzMX0.d_kQm_SqosA7rxNrWVGi9VBAfq3Hpka4iwzcgmnwAUs',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhicW9hZndmamJvc21zdWtlem5uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjYxOTE5MzEsImV4cCI6MjA0MTc2NzkzMX0.d_kQm_SqosA7rxNrWVGi9VBAfq3Hpka4iwzcgmnwAUs'
        }
      });

      const data = await response.json();
      console.log('Dados retornados da API:', data);

      if (searchTerm) {
        return data.filter((cliente: any) => 
          cliente.nome?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      return data;
    },
    staleTime: 0, // Considera os dados sempre desatualizados
    cacheTime: 1000 * 60 * 5, // Cache de 5 minutos
  });

  // Função para forçar atualização da lista
  const refreshList = () => {
    queryClient.invalidateQueries(["clientes"]);
    refetch();
  };

  // Função para adicionar novo cliente que inclui o refresh
  const handleNewClient = () => {
    onNewClient();
    // Agenda um refresh para quando o modal fechar
    setTimeout(refreshList, 500);
  };

  // Log de debug
  console.log('Estado atual:', { isLoading, queryError, clientes });

  const filteredClientes = clientes.sort((a: any, b: any) => {
    // Prioriza clientes com valores vencidos
    if (Number(a.total_vencido || 0) > 0 && Number(b.total_vencido || 0) === 0) return -1;
    if (Number(b.total_vencido || 0) > 0 && Number(a.total_vencido || 0) === 0) return 1;
    // Em seguida, ordena por nome
    return (a.nome || '').localeCompare(b.nome || '');
  });

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Clientes</h2>
          <p className="text-gray-500 mt-1">Gerencie seus clientes e acompanhe suas vendas</p>
        </div>
        <Button onClick={handleNewClient} size="lg" className="bg-primary hover:bg-primary/90">
          <Plus className="h-5 w-5 mr-2" />
          Novo Cliente
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
        <Input
          type="text"
          placeholder="Buscar clientes por nome..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-12 text-lg"
        />
      </div>

      {/* Debug Info */}
      {queryError && (
        <div className="text-red-500">
          Erro ao carregar clientes: {queryError.message}
        </div>
      )}

      {/* Client Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-pulse">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-[400px] bg-gray-100 rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClientes.map((cliente: any) => (
            <ClientCard
              key={cliente.id || cliente.cliente_id}
              cliente={cliente}
              onClick={onClientSelect}
            />
          ))}
          {filteredClientes.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500">
              <Search className="h-12 w-12 mb-4" />
              <p className="text-lg font-medium">Nenhum cliente encontrado</p>
              <p className="text-sm">Tente buscar com outros termos ou cadastre um novo cliente</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
