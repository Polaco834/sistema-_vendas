import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
  Box,
} from '@mui/material';
import { Warning as WarningIcon, Close as CloseIcon } from '@mui/icons-material';
import { useQueryClient } from "@tanstack/react-query";
import { toast } from 'sonner';

interface DeleteConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  clientId: number;
  clientName: string;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  open,
  onClose,
  onConfirm,
  clientId,
  clientName,
}) => {
  const [loading, setLoading] = React.useState(false);
  const queryClient = useQueryClient();

  // Função para forçar atualização da lista
  const refreshList = () => {
    queryClient.invalidateQueries(["clientes"]);
  };

  const handleDelete = async () => {
    if (!clientId) {
      console.error('ID do cliente não encontrado');
      return;
    }

    console.log('Iniciando exclusão do cliente:', clientId);
    setLoading(true);

    try {
      // Deletar diretamente usando o id
      const deleteUrl = `https://hbqoafwfjbosmsukeznn.supabase.co/rest/v1/clientes?id=eq.${clientId}`;
      console.log('URL de delete:', deleteUrl);

      const deleteResponse = await fetch(deleteUrl, {
        method: 'DELETE',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhicW9hZndmamJvc21zdWtlem5uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjYxOTE5MzEsImV4cCI6MjA0MTc2NzkzMX0.d_kQm_SqosA7rxNrWVGi9VBAfq3Hpka4iwzcgmnwAUs',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhicW9hZndmamJvc21zdWtlem5uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjYxOTE5MzEsImV4cCI6MjA0MTc2NzkzMX0.d_kQm_SqosA7rxNrWVGi9VBAfq3Hpka4iwzcgmnwAUs',
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        }
      });

      if (!deleteResponse.ok) {
        const errorText = await deleteResponse.text();
        console.error('Erro ao excluir:', errorText);
        throw new Error('Falha ao excluir cliente');
      }

      console.log('Cliente excluído com sucesso!');
      toast.success(`Cliente ${clientName} excluído com sucesso!`, {
        description: 'O cliente foi removido permanentemente do sistema',
        duration: 5000
      });
      
      onConfirm();
      onClose();

      // Força atualização da lista após deletar
      refreshList();
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
      toast.error('Erro ao excluir cliente', {
        description: 'Não foi possível excluir o cliente. Tente novamente.',
        duration: 5000
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      PaperProps={{
        sx: {
          borderRadius: 2,
          position: 'relative',
        },
      }}
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
    >
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <WarningIcon
          sx={{
            fontSize: 64,
            color: 'warning.main',
            mb: 2,
          }}
        />

        <DialogTitle id="delete-dialog-title" sx={{ p: 0, mb: 2 }}>
          Confirmar Exclusão
        </DialogTitle>

        <DialogContent sx={{ p: 0, mb: 2 }}>
          <Typography id="delete-dialog-description">
            Tem certeza que deseja excluir o cliente <strong>{clientName}</strong>?<br />
            Esta ação não pode ser desfeita.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ p: 0, justifyContent: 'center', gap: 1 }}>
          <Button
            onClick={onClose}
            variant="outlined"
            color="primary"
            disabled={loading}
            tabIndex={0}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            disabled={loading}
            tabIndex={0}
            autoFocus
          >
            {loading ? 'Excluindo...' : 'Excluir'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;
