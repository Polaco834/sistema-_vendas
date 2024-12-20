import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
} from '@mui/material';
import { ClientModalProps } from '@/types/client';

export const ClientModal: React.FC<ClientModalProps> = ({
  open,
  onClose,
  onSave,
  editingClient
}) => {
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    status: 'ativo',
    telefone: '',
    saldo: 0
  });

  useEffect(() => {
    if (editingClient) {
      setFormData(editingClient);
    }
  }, [editingClient]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name as string]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{editingClient ? 'Editar Cliente' : 'Novo Cliente'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={2}>
            <TextField
              name="nome"
              label="Nome"
              value={formData.nome}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              name="cpf"
              label="CPF"
              value={formData.cpf}
              onChange={handleChange}
              fullWidth
              required
            />
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                label="Status"
                onChange={handleChange}
              >
                <MenuItem value="ativo">Ativo</MenuItem>
                <MenuItem value="inadimplente">Inadimplente</MenuItem>
              </Select>
            </FormControl>
            <TextField
              name="telefone"
              label="Telefone"
              value={formData.telefone}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              name="saldo"
              label="Saldo"
              type="number"
              value={formData.saldo}
              onChange={handleChange}
              fullWidth
              required
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained" color="primary">
            Salvar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
