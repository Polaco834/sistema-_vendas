import { useState } from 'react';
import { usePainelEstoque } from '../../hooks/usePainelEstoque';
import { useAuth } from '../../hooks/useAuth';
import {
  Card,
  CardContent,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PainelEstoque() {
  const { empresa_id } = useAuth();
  const { produtos, movimentos, isLoading, error } = usePainelEstoque();
  const [modalOpen, setModalOpen] = useState(false);

  if (!empresa_id) {
    return (
      <div style={{ padding: '20px' }}>
        <Card>
          <CardContent>
            <Typography variant="h6" color="error" gutterBottom>
              Acesso Negado
            </Typography>
            <Typography variant="body1">
              Você precisa estar logado em uma empresa para acessar o painel de estoque.
            </Typography>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px' }}>
        <Card>
          <CardContent>
            <Typography variant="h6" color="error" gutterBottom>
              Erro
            </Typography>
            <Typography variant="body1" color="error">
              {error}
            </Typography>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div style={{ padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
        <CircularProgress />
      </div>
    );
  }

  if (!produtos.length && !movimentos.length) {
    return (
      <div style={{ padding: '20px' }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Nenhum dado disponível
            </Typography>
            <Typography variant="body1">
              Não há produtos ou movimentos de estoque registrados.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setModalOpen(true)}
              style={{ marginTop: '16px' }}
            >
              Novo Lançamento
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const chartData = {
    labels: produtos.map(p => p.nome),
    datasets: [
      {
        data: produtos.map(p => p.quantidade_total),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
        ],
      },
    ],
  };

  return (
    <div style={{ padding: '20px' }}>
      <Grid container spacing={3}>
        {/* Cabeçalho */}
        <Grid item xs={12} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4">Painel de Estoque</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setModalOpen(true)}
          >
            Novo Lançamento
          </Button>
        </Grid>

        {/* Gráfico */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Distribuição do Estoque
              </Typography>
              <div style={{ height: '300px', position: 'relative' }}>
                <Doughnut data={chartData} options={{ maintainAspectRatio: false }} />
              </div>
            </CardContent>
          </Card>
        </Grid>

        {/* Tabela de Resumo */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Resumo do Estoque
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Produto</TableCell>
                      <TableCell>Quantidade</TableCell>
                      <TableCell>Tipo</TableCell>
                      <TableCell>%</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {produtos.map((produto) => (
                      <TableRow key={produto.id}>
                        <TableCell>{produto.nome}</TableCell>
                        <TableCell>{produto.quantidade_total}</TableCell>
                        <TableCell>{produto.tipo_produto}</TableCell>
                        <TableCell>{produto.percentual.toFixed(2)}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Últimos Lançamentos */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Últimos Lançamentos
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Data</TableCell>
                      <TableCell>Tipo</TableCell>
                      <TableCell>Produto</TableCell>
                      <TableCell>Quantidade</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {movimentos.map((movimento) => (
                      <TableRow key={movimento.id}>
                        <TableCell>
                          {new Date(movimento.data_movimento).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{movimento.tipo}</TableCell>
                        <TableCell>{movimento.produto_nome}</TableCell>
                        <TableCell>{movimento.quantidade}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Modal de Novo Lançamento */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
        <DialogTitle>Novo Lançamento</DialogTitle>
        <DialogContent>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '300px', padding: '10px' }}>
            <Button
              variant="contained"
              style={{ backgroundColor: '#4CAF50' }}
              fullWidth
            >
              Nova Entrada
            </Button>
            <Button
              variant="contained"
              style={{ backgroundColor: '#f44336' }}
              fullWidth
            >
              Nova Saída
            </Button>
            <Button
              variant="contained"
              style={{ backgroundColor: '#2196F3' }}
              fullWidth
            >
              Transferência
            </Button>
            <Button
              variant="contained"
              style={{ backgroundColor: '#9e9e9e' }}
              fullWidth
            >
              Carga Inicial
            </Button>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)}>Cancelar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
