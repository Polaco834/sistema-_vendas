import { useState } from 'react';
import { ClientList } from '@/components/clients/ClientList';
import { NewClientModal } from '@/components/clients/NewClientModal';
import { EditClientModal } from '@/components/clients/EditClientModal';
import { useClients } from '@/hooks/useClients';
import type { ClienteDetalhes } from '@/types/cliente';

export default function ClientsPage() {
  const [isNewClientModalOpen, setIsNewClientModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<ClienteDetalhes | null>(null);
  const { clients, isLoading, createClient, updateClient, deleteClient } = useClients();

  return (
    <div className="min-h-screen bg-background">
      <ClientList
        onClientSelect={setEditingClient}
        onNewClient={() => setIsNewClientModalOpen(true)}
      />

      <NewClientModal
        open={isNewClientModalOpen}
        onClose={() => setIsNewClientModalOpen(false)}
        onSubmit={createClient}
      />

      {editingClient && (
        <EditClientModal
          client={editingClient}
          open={true}
          onClose={() => setEditingClient(null)}
          onSubmit={updateClient}
          onDelete={deleteClient}
        />
      )}
    </div>
  );
}
