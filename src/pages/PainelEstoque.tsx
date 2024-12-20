import { useState } from 'react';
import { usePainelEstoque } from '../hooks/usePainelEstoque';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PainelEstoque() {
  const { produtos, movimentos, isLoading, error } = usePainelEstoque();
  const [modalOpen, setModalOpen] = useState(false);

  if (error) {
    return (
      <div className="p-6">
        <Card className="p-4">
          <p className="text-red-500">Erro ao carregar dados: {error}</p>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <Card className="p-4">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
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
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
          '#FF9F40', '#2ecc71', '#3498db', '#e74c3c', '#f1c40f'
        ],
        hoverBackgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
          '#FF9F40', '#2ecc71', '#3498db', '#e74c3c', '#f1c40f'
        ],
      },
    ],
  };

  return (
    <div className="p-6 space-y-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Painel de Estoque</h1>
        </div>
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogTrigger asChild>
            <Button variant="default">Novo Lançamento</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Lançamento</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-3 py-4">
              <Button variant="default" className="bg-emerald-600 hover:bg-emerald-700">
                Nova Entrada
              </Button>
              <Button variant="default" className="bg-red-600 hover:bg-red-700">
                Nova Saída
              </Button>
              <Button variant="default" className="bg-blue-600 hover:bg-blue-700">
                Transferência
              </Button>
              <Button variant="default" className="bg-gray-600 hover:bg-gray-700">
                Carga Inicial
              </Button>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setModalOpen(false)}>
                Cancelar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Gráfico de Estoque por Produto */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Distribuição de Produtos no Estoque</h2>
          <div className="h-[300px] relative">
            <Doughnut 
              data={chartData} 
              options={{ 
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'right',
                    labels: {
                      boxWidth: 12,
                      padding: 15
                    }
                  }
                }
              }} 
            />
          </div>
        </Card>

        {/* Tabela de Resumo de Estoque */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Resumo do Estoque</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead className="text-right">Quantidade</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-right">%</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {produtos.map((produto) => (
                <TableRow key={produto.id}>
                  <TableCell>{produto.nome}</TableCell>
                  <TableCell className="text-right">{produto.quantidade_total}</TableCell>
                  <TableCell>{produto.tipo_produto}</TableCell>
                  <TableCell className="text-right">{produto.percentual.toFixed(1)}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>

      {/* Lista de Últimos Lançamentos */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Últimos Lançamentos</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Produto</TableHead>
              <TableHead className="text-right">Quantidade</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {movimentos.map((movimento) => (
              <TableRow key={movimento.id}>
                <TableCell>{new Date(movimento.data_movimento).toLocaleDateString()}</TableCell>
                <TableCell>
                  <span className={
                    movimento.tipo === 'Entrada' ? 'text-emerald-600' :
                    movimento.tipo === 'Saída' ? 'text-red-600' :
                    movimento.tipo === 'Transferência' ? 'text-blue-600' :
                    'text-gray-600'
                  }>
                    {movimento.tipo}
                  </span>
                </TableCell>
                <TableCell>{movimento.produto_nome}</TableCell>
                <TableCell className="text-right">{movimento.quantidade}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
