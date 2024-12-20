import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Button,
  IconButton,
  InputAdornment,
  Select,
  MenuItem,
  Box,
  Tooltip,
  Typography,
  FormControl,
  InputLabel,
  DialogContentText,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'sonner';
import { MapPin } from 'lucide-react';
import InputMask from 'react-input-mask';
import type { Cliente, ClienteDetalhes } from '@/types/cliente';
import { Vendedor, vendedorService } from '@/services/vendedorService';
import { useClientDetails } from '@/hooks/useClientDetails';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import { useQueryClient } from "@tanstack/react-query";

const schema = yup.object().shape({
  nome: yup.string().required('Nome é obrigatório'),
  cpf: yup.string().required('CPF é obrigatório'),
  telefone: yup.string(),
  rua: yup.string(),
  numero: yup.string(),
  bairro: yup.string(),
  cidade: yup.string(),
  uf: yup.string(),
  cep: yup.string(),
  status: yup.string().oneOf(['ativo', 'inadimplente']).default('ativo'),
  vendedor_id: yup.number().nullable(),
  localizacao: yup.string(),
});

interface EditClientModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (clienteId: number, data: Partial<Cliente>) => void;
  onDelete?: (clienteId: number) => void;
  client: ClienteDetalhes;
}

export const EditClientModal: React.FC<EditClientModalProps> = ({
  open,
  onClose,
  onSubmit,
  onDelete,
  client,
}) => {
  const [vendedores, setVendedores] = useState<Vendedor[]>([]);
  const [loading, setLoading] = useState(false);
  const [tempLocation, setTempLocation] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  // Busca os dados do cliente da tabela clientes
  const { data: clientData, isLoading: isLoadingClient } = useClientDetails(client.cliente_id);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      nome: '',
      cpf: '',
      telefone: '',
      rua: '',
      numero: '',
      bairro: '',
      cidade: '',
      uf: '',
      cep: '',
      status: 'ativo',
      vendedor_id: null,
      localizacao: '',
    },
  });

  // Carrega a lista de vendedores
  useEffect(() => {
    const loadVendedores = async () => {
      try {
        const response = await fetch(
          'https://hbqoafwfjbosmsukeznn.supabase.co/rest/v1/vendedor?select=id,nome&order=nome',
          {
            headers: {
              'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhicW9hZndmamJvc21zdWtlem5uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjYxOTE5MzEsImV4cCI6MjA0MTc2NzkzMX0.d_kQm_SqosA7rxNrWVGi9VBAfq3Hpka4iwzcgmnwAUs',
              'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhicW9hZndmamJvc21zdWtlem5uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjYxOTE5MzEsImV4cCI6MjA0MTc2NzkzMX0.d_kQm_SqosA7rxNrWVGi9VBAfq3Hpka4iwzcgmnwAUs'
            }
          }
        );

        if (!response.ok) {
          throw new Error('Erro ao buscar vendedores');
        }

        const data = await response.json();
        console.log('Vendedores carregados:', data);
        setVendedores(data);
      } catch (error) {
        console.error('Erro ao carregar vendedores:', error);
        toast.error('Erro ao carregar lista de vendedores', {
          description: 'Verifique a conexão com a API'
        });
      }
    };

    loadVendedores();
  }, []);

  // Quando os dados do cliente chegarem, preenche o formulário
  useEffect(() => {
    if (clientData) {
      console.log('Dados do cliente carregados:', clientData);
      reset({
        nome: clientData.nome || '',
        cpf: clientData.cpf || '',
        telefone: clientData.telefone?.replace('+55', '') || '',
        rua: clientData.rua || '',
        numero: clientData.numero || '',
        bairro: clientData.bairro || '',
        cidade: clientData.cidade || '',
        uf: clientData.uf || '',
        cep: clientData.cep || '',
        status: clientData.status || 'ativo',
        vendedor_id: clientData.vendedor_id || '',
        localizacao: clientData.localizacao || '',
      });
    }
  }, [clientData, reset]);

  // Função para forçar atualização da lista
  const refreshList = () => {
    queryClient.invalidateQueries(["clientes"]);
  };

  const handleClose = () => {
    setTempLocation(null);
    reset();
    onClose();
    // Força atualização da lista ao fechar
    refreshList();
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocalização não é suportada neste navegador.', {
        description: 'Verifique se o navegador permite a geolocalização',
        duration: 5000
      });
      return;
    }

    const toastId = toast.loading('Obtendo localização...', {
      description: 'Aguarde enquanto buscamos sua localização'
    });

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setTempLocation(`POINT(${longitude} ${latitude})`);

        try {
          // Usando o Nominatim OpenStreetMap
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
          );
          const data = await response.json();
          const address = data.address;

          // Mapeamento de estados para siglas
          const estadosSiglas: { [key: string]: string } = {
            'acre': 'AC',
            'alagoas': 'AL',
            'amapá': 'AP',
            'amazonas': 'AM',
            'bahia': 'BA',
            'ceará': 'CE',
            'distrito federal': 'DF',
            'espírito santo': 'ES',
            'goiás': 'GO',
            'maranhão': 'MA',
            'mato grosso': 'MT',
            'mato grosso do sul': 'MS',
            'minas gerais': 'MG',
            'pará': 'PA',
            'paraíba': 'PB',
            'paraná': 'PR',
            'pernambuco': 'PE',
            'piauí': 'PI',
            'rio de janeiro': 'RJ',
            'rio grande do norte': 'RN',
            'rio grande do sul': 'RS',
            'rondônia': 'RO',
            'roraima': 'RR',
            'santa catarina': 'SC',
            'são paulo': 'SP',
            'sergipe': 'SE',
            'tocantins': 'TO'
          };

          setValue('rua', address.road || '');
          setValue('numero', address.house_number || '');
          setValue('bairro', address.suburb || address.neighbourhood || '');
          setValue('cidade', address.city || address.town || address.village || '');
          
          const estadoNome = address.state?.toLowerCase() || '';
          const estadoSigla = estadosSiglas[estadoNome] || '';
          setValue('uf', estadoSigla);
          
          setValue('cep', address.postcode || '');

          toast.dismiss(toastId);
          toast.success('Localização obtida com sucesso!', {
            description: 'Endereço atualizado com sucesso',
            duration: 5000
          });
        } catch (error) {
          console.error('Erro ao obter endereço:', error);
          toast.dismiss(toastId);
          toast.error('Erro ao obter endereço', {
            description: 'Verifique a conexão com a API',
            duration: 5000
          });
        }
      },
      (error) => {
        console.error('Erro ao obter localização:', error);
        toast.dismiss(toastId);
        toast.error('Erro ao obter localização', {
          description: 'Verifique se o navegador permite a geolocalização',
          duration: 5000
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  };

  const handleFormSubmit = async (data: any) => {
    setLoading(true);
    try {
      const dadosFormatados = {
        nome: data.nome,
        cpf: data.cpf?.replace(/\D/g, '') || null,
        telefone: data.telefone?.replace(/\D/g, '') || null,
        rua: data.rua || null,
        numero: data.numero || null,
        bairro: data.bairro || null,
        cidade: data.cidade || null,
        uf: data.uf || null,
        cep: data.cep?.replace(/\D/g, '') || null,
        status: data.status || 'ativo',
        vendedor_id: data.vendedor_id || null,
        localizacao: tempLocation || data.localizacao || null
      };

      console.log('Dados formatados para atualização:', dadosFormatados);

      const response = await fetch(
        `https://hbqoafwfjbosmsukeznn.supabase.co/rest/v1/clientes?id=eq.${client.cliente_id}`,
        {
          method: 'PATCH',
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhicW9hZndmamJvc21zdWtlem5uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjYxOTE5MzEsImV4cCI6MjA0MTc2NzkzMX0.d_kQm_SqosA7rxNrWVGi9VBAfq3Hpka4iwzcgmnwAUs',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhicW9hZndmamJvc21zdWtlem5uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjYxOTE5MzEsImV4cCI6MjA0MTc2NzkzMX0.d_kQm_SqosA7rxNrWVGi9VBAfq3Hpka4iwzcgmnwAUs',
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          },
          body: JSON.stringify(dadosFormatados)
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Erro na resposta do servidor:', errorData);
        throw new Error('Falha ao atualizar cliente');
      }

      const updatedData = await response.json();
      const isNewClient = !client.cliente_id;

      handleClose();
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      toast.error('Erro ao salvar cliente', {
        description: 'Verifique os dados e tente novamente',
        duration: 5000
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (onDelete && client.cliente_id) {
      onDelete(client.cliente_id);
    }
    handleDeleteDialogClose();
    onClose();
  };

  if (isLoadingClient) {
    return (
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <Typography>Carregando dados do cliente...</Typography>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Editar Cliente</DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Nome"
                {...register('nome')}
                error={!!errors.nome}
                helperText={errors.nome?.message}
                fullWidth
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="CPF"
                {...register('cpf')}
                error={!!errors.cpf}
                helperText={errors.cpf?.message}
                fullWidth
                size="small"
                disabled
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="telefone"
                control={control}
                render={({ field }) => (
                  <InputMask
                    mask="(99) 99999-9999"
                    value={field.value}
                    onChange={field.onChange}
                  >
                    {(inputProps: any) => (
                      <TextField
                        {...inputProps}
                        label="Telefone"
                        error={!!errors.telefone}
                        helperText={errors.telefone?.message}
                        fullWidth
                        size="small"
                      />
                    )}
                  </InputMask>
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      label="Status"
                      error={!!errors.status}
                    >
                      <MenuItem value="ativo">Ativo</MenuItem>
                      <MenuItem value="inadimplente">Inadimplente</MenuItem>
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel id="vendedor-label">Vendedor</InputLabel>
                <Controller
                  name="vendedor_id"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      labelId="vendedor-label"
                      label="Vendedor"
                      error={!!errors.vendedor_id}
                      disabled={loading}
                    >
                      <MenuItem value="">
                        <em>Selecione um vendedor</em>
                      </MenuItem>
                      {vendedores.map((vendedor) => (
                        <MenuItem key={vendedor.id} value={vendedor.id}>
                          {vendedor.nome}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.vendedor_id && (
                  <Typography variant="caption" color="error">
                    {errors.vendedor_id.message}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Localização
                </Typography>
                <Tooltip title="Obter localização atual">
                  <IconButton 
                    onClick={handleGetLocation}
                    disabled={loading}
                    size="small"
                    color={tempLocation ? "success" : "default"}
                  >
                    <MapPin />
                  </IconButton>
                </Tooltip>
              </Box>
            </Grid>

            <Grid item xs={12} sm={9}>
              <TextField
                label="Rua"
                {...register('rua')}
                error={!!errors.rua}
                helperText={errors.rua?.message}
                fullWidth
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                label="Número"
                {...register('numero')}
                error={!!errors.numero}
                helperText={errors.numero?.message}
                fullWidth
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Bairro"
                {...register('bairro')}
                error={!!errors.bairro}
                helperText={errors.bairro?.message}
                fullWidth
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Cidade"
                {...register('cidade')}
                error={!!errors.cidade}
                helperText={errors.cidade?.message}
                fullWidth
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Estado</InputLabel>
                <Controller
                  name="uf"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      label="Estado"
                      error={!!errors.uf}
                    >
                      <MenuItem value="AC">Acre</MenuItem>
                      <MenuItem value="AL">Alagoas</MenuItem>
                      <MenuItem value="AP">Amapá</MenuItem>
                      <MenuItem value="AM">Amazonas</MenuItem>
                      <MenuItem value="BA">Bahia</MenuItem>
                      <MenuItem value="CE">Ceará</MenuItem>
                      <MenuItem value="DF">Distrito Federal</MenuItem>
                      <MenuItem value="ES">Espírito Santo</MenuItem>
                      <MenuItem value="GO">Goiás</MenuItem>
                      <MenuItem value="MA">Maranhão</MenuItem>
                      <MenuItem value="MT">Mato Grosso</MenuItem>
                      <MenuItem value="MS">Mato Grosso do Sul</MenuItem>
                      <MenuItem value="MG">Minas Gerais</MenuItem>
                      <MenuItem value="PA">Pará</MenuItem>
                      <MenuItem value="PB">Paraíba</MenuItem>
                      <MenuItem value="PR">Paraná</MenuItem>
                      <MenuItem value="PE">Pernambuco</MenuItem>
                      <MenuItem value="PI">Piauí</MenuItem>
                      <MenuItem value="RJ">Rio de Janeiro</MenuItem>
                      <MenuItem value="RN">Rio Grande do Norte</MenuItem>
                      <MenuItem value="RS">Rio Grande do Sul</MenuItem>
                      <MenuItem value="RO">Rondônia</MenuItem>
                      <MenuItem value="RR">Roraima</MenuItem>
                      <MenuItem value="SC">Santa Catarina</MenuItem>
                      <MenuItem value="SP">São Paulo</MenuItem>
                      <MenuItem value="SE">Sergipe</MenuItem>
                      <MenuItem value="TO">Tocantins</MenuItem>
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="cep"
                control={control}
                render={({ field }) => (
                  <InputMask
                    mask="99999-999"
                    value={field.value}
                    onChange={field.onChange}
                  >
                    {(inputProps: any) => (
                      <TextField
                        {...inputProps}
                        label="CEP"
                        error={!!errors.cep}
                        helperText={errors.cep?.message}
                        fullWidth
                        size="small"
                      />
                    )}
                  </InputMask>
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          {onDelete && (
            <Button
              onClick={handleDeleteClick}
              color="error"
              disabled={loading}
              startIcon={<DeleteIcon />}
            >
              Excluir
            </Button>
          )}
          <Button onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogActions>
      </form>

      {/* Dialog de confirmação de exclusão */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
        onConfirm={handleDeleteConfirm}
        clientId={client.cliente_id}
        clientName={client.nome}
      />
    </Dialog>
  );
};
