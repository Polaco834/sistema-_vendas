import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  IconButton,
  Tooltip,
  InputAdornment,
  Typography,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import InputMask from 'react-input-mask';
import { ClientModalProps } from '@/types/client';
import { Vendedor, vendedorService } from '@/services/vendedorService';
import { MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { Client } from '@/geocoding/reverseGeocode';

const schema = yup.object().shape({
  nome: yup.string().required('Nome é obrigatório'),
  cpf: yup.string().required('CPF é obrigatório'),
  telefone: yup.string(),
  rua: yup.string(),
  numero: yup.string(),
  bairro: yup.string(),
  cidade: yup.string(),
  estado: yup.string(),
  cep: yup.string(),
  status: yup.string().oneOf(['ativo', 'inadimplente']).default('ativo'),
  vendedor_id: yup.number().nullable(),
  latitude: yup.string(),
  longitude: yup.string(),
});

export const NewClientModal = ({ open, onClose, onSubmit }: ClientModalProps) => {
  const [vendedores, setVendedores] = useState<Vendedor[]>([]);
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
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
      estado: '',
      cep: '',
      status: 'ativo',
      vendedor_id: null,
      latitude: '',
      longitude: '',
    },
  });

  useEffect(() => {
    const loadVendedores = async () => {
      setLoading(true);
      try {
        const data = await vendedorService.getAll();
        setVendedores(data);
      } catch (error) {
        console.error('Erro ao carregar vendedores:', error);
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      loadVendedores();
    }
  }, [open]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = async (data: any) => {
    try {
      // Remove campos de latitude e longitude após criar a localização
      const { latitude, longitude, estado, ...clientData } = data;

      // Formata o telefone com o código do país
      const telefoneFormatado = clientData.telefone ? 
        `+55${clientData.telefone.replace(/\D/g, '')}` : 
        undefined;

      // Converte apenas o nome para maiúsculas
      const dadosFormatados = {
        ...clientData,
        nome: clientData.nome.toUpperCase(),
        cpf: clientData.cpf.replace(/\D/g, ''),
        telefone: telefoneFormatado,
        uf: estado,
        status: data.status || 'ativo'
      };

      await onSubmit(dadosFormatados);
      handleClose();
      toast.success('Cliente salvo com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
      toast.error('Erro ao salvar cliente');
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocalização não é suportada neste navegador', {
        description: 'Verifique se seu navegador suporta geolocalização',
        duration: 5000
      });
      return;
    }

    const toastId = toast.loading('Obtendo localização...', {
      description: 'Aguarde enquanto buscamos sua localização'
    });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setValue('latitude', latitude.toString());
        setValue('longitude', longitude.toString());

        // Usando o Nominatim OpenStreetMap (gratuito, sem necessidade de API key)
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`)
          .then(response => response.json())
          .then(data => {
            const address = data.address;
            
            // Resetando os campos para evitar dados antigos
            setValue('rua', '');
            setValue('numero', '');
            setValue('bairro', '');
            setValue('cidade', '');
            setValue('estado', '');
            setValue('cep', '');

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

            // Preenchendo com os dados do OpenStreetMap
            setValue('rua', address.road || '');
            setValue('numero', address.house_number || '');
            setValue('bairro', address.suburb || address.neighbourhood || '');
            setValue('cidade', address.city || address.town || address.village || '');
            
            // Convertendo nome do estado para sigla
            const estadoNome = address.state?.toLowerCase() || '';
            const estadoSigla = estadosSiglas[estadoNome] || '';
            setValue('estado', estadoSigla);
            
            setValue('cep', address.postcode || '');

            toast.dismiss(toastId);
            toast.success('Localização obtida com sucesso!', {
              description: 'Endereço preenchido automaticamente',
              duration: 5000
            });
          })
          .catch(error => {
            console.error('Erro ao obter endereço:', error);
            toast.dismiss(toastId);
            toast.error('Erro ao obter endereço', {
              description: 'Não foi possível obter o endereço da sua localização',
              duration: 5000
            });
          });
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

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Novo Cliente</DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="nome"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Nome"
                    fullWidth
                    error={!!errors.nome}
                    helperText={errors.nome?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="cpf"
                control={control}
                render={({ field }) => (
                  <InputMask
                    mask="999.999.999-99"
                    value={field.value}
                    onChange={field.onChange}
                  >
                    {(inputProps: any) => (
                      <TextField
                        {...inputProps}
                        label="CPF"
                        fullWidth
                        error={!!errors.cpf}
                        helperText={errors.cpf?.message}
                      />
                    )}
                  </InputMask>
                )}
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
                        fullWidth
                        error={!!errors.telefone}
                        helperText={errors.telefone?.message}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start" sx={{ color: 'text.secondary', userSelect: 'none' }}>
                              +55
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  </InputMask>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select {...field} label="Status">
                      <MenuItem value="ativo">Ativo</MenuItem>
                      <MenuItem value="inadimplente">Inadimplente</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="vendedor_id"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Vendedor</InputLabel>
                    <Select {...field} label="Vendedor">
                      <MenuItem value={null}>
                        <em>Nenhum</em>
                      </MenuItem>
                      {vendedores.map((vendedor) => (
                        <MenuItem key={vendedor.id} value={vendedor.id}>
                          {vendedor.nome}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <div className="flex gap-2 items-center">
                <Typography variant="subtitle1" component="div">
                  Endereço
                </Typography>
                <Tooltip title="Usar localização atual">
                  <IconButton onClick={handleGetLocation} size="small">
                    <MapPin className="h-5 w-5" />
                  </IconButton>
                </Tooltip>
              </div>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="rua"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Rua"
                    fullWidth
                    error={!!errors.rua}
                    helperText={errors.rua?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="numero"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Número"
                    fullWidth
                    error={!!errors.numero}
                    helperText={errors.numero?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="bairro"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Bairro"
                    fullWidth
                    error={!!errors.bairro}
                    helperText={errors.bairro?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="cidade"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Cidade"
                    fullWidth
                    error={!!errors.cidade}
                    helperText={errors.cidade?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="estado"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Estado</InputLabel>
                    <Select {...field} label="Estado">
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
                  </FormControl>
                )}
              />
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
                        fullWidth
                        error={!!errors.cep}
                        helperText={errors.cep?.message}
                      />
                    )}
                  </InputMask>
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button type="submit" variant="contained" color="primary">
            Salvar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
