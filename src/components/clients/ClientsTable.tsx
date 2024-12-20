import { useState } from 'react';
import { Box, Typography, Tooltip, IconButton } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Edit } from 'lucide-react';
import DeleteIcon from '@mui/icons-material/Delete';
import { Client } from '@/types/client';
import { DeleteConfirmationDialog } from './DeleteConfirmationDialog';

interface ClientsTableProps {
  clients: Client[];
  onDelete: (id: number) => Promise<void>;
  onEdit: (client: Client) => void;
  loading?: boolean;
}

export const ClientsTable: React.FC<ClientsTableProps> = ({
  clients,
  onDelete,
  onEdit,
  loading = false,
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<{ id: number; nome: string } | null>(null);

  const handleDeleteClick = (client: { id: number; nome: string }) => {
    setClientToDelete(client);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (clientToDelete) {
      onDelete(clientToDelete.id);
      setDeleteDialogOpen(false);
      setClientToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setClientToDelete(null);
  };

  const columns: GridColDef[] = [
    { 
      field: 'nome', 
      headerName: 'Nome',
      flex: 1,
      minWidth: 200,
    },
    { 
      field: 'cpf', 
      headerName: 'CPF',
      flex: 1,
      minWidth: 140,
    },
    { 
      field: 'telefone', 
      headerName: 'Telefone',
      flex: 1,
      minWidth: 140,
    },
    {
      field: 'endereco',
      headerName: 'Endereço',
      flex: 2,
      minWidth: 300,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params: GridRenderCellParams) => {
        const endereco = [
          params.row.rua,
          params.row.numero,
          params.row.bairro,
          params.row.cidade,
          params.row.uf,
        ]
          .filter(Boolean)
          .join(', ');
        return endereco || '-';
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      minWidth: 130,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params: GridRenderCellParams) => (
        <Box
          sx={{
            backgroundColor: params.row.status === 'ativo' ? 'success.lighter' : 'error.lighter',
            color: params.row.status === 'ativo' ? 'success.dark' : 'error.dark',
            py: 0.5,
            px: 1.5,
            borderRadius: 1,
            textTransform: 'capitalize',
            fontSize: '0.875rem',
          }}
        >
          {params.row.status}
        </Box>
      ),
    },
    {
      field: 'actions',
      headerName: 'Ações',
      flex: 1,
      minWidth: 120,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
          <Tooltip title="Editar cliente" arrow>
            <IconButton 
              onClick={() => onEdit(params.row)}
              size="small"
              sx={{ 
                color: 'primary.main',
                '&:hover': {
                  backgroundColor: 'primary.lighter',
                }
              }}
            >
              <Edit size={16} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Excluir cliente" arrow>
            <IconButton 
              size="small" 
              color="error"
              onClick={() => handleDeleteClick({ id: params.row.id, nome: params.row.nome })}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  if (!clients?.length) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 4,
          gap: 2,
          bgcolor: '#F8F9FA',
          borderRadius: 2,
          border: '1px dashed #E6E8EC',
          minHeight: 400
        }}
      >
        <Typography variant="h6" color="text.secondary">
          Nenhum cliente cadastrado
        </Typography>
        <Typography color="text.secondary" variant="body2">
          Cadastre seu primeiro cliente clicando no botão "Novo Cliente"
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <DataGrid
        rows={clients || []}
        columns={columns}
        loading={loading}
        autoHeight
        disableRowSelectionOnClick
        pageSizeOptions={[10, 25, 50]}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
      />
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        clientName={clientToDelete?.nome || ''}
      />
    </Box>
  );
};
