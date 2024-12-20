import { ClienteDetalhes } from "@/types/cliente";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { AlertTriangle, Edit, Calendar, Clock, DollarSign } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ClientCardProps {
  cliente: ClienteDetalhes;
  onClick: (cliente: ClienteDetalhes) => void;
}

export function ClientCard({ cliente, onClick }: ClientCardProps) {
  // Log para debug
  console.log('Dados do cliente no card:', cliente);

  // Dados fictícios para o gráfico por enquanto
  const chartData = [
    { name: 'Jul', value: 0 },
    { name: 'Ago', value: 0 },
    { name: 'Set', value: 210 },
    { name: 'Out', value: 150 },
    { name: 'Nov', value: 200 },
    { name: 'Dez', value: 0 }
  ];

  return (
    <Card 
      className="hover:shadow-lg transition-shadow cursor-pointer bg-white"
      onClick={() => onClick(cliente)}
    >
      <CardContent className="p-6">
        <div className="flex flex-col space-y-4">
          {/* Header com Nome e Próxima Visita */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-800">{cliente.nome}</h3>
              {cliente.proxima_visita && (
                <div className="flex items-center mt-1 text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  <span className="text-sm">
                    Próxima visita: {format(new Date(cliente.proxima_visita), 'dd/MM/yyyy', { locale: ptBR })}
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Edit className="h-5 w-5 text-gray-400" />
              <button className="text-gray-400 hover:text-gray-600">•••</button>
            </div>
          </div>

          {/* Grid de Valores */}
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div>
              <p className="text-sm text-gray-500">Total vendido</p>
              <p className="text-lg font-semibold">{formatCurrency(Number(cliente.total_vendido || 0))}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total aberto</p>
              <p className="text-lg font-semibold">{formatCurrency(Number(cliente.total_aberto || 0))}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total vencido</p>
              <div className="flex items-center">
                <p className="text-lg font-semibold">{formatCurrency(Number(cliente.total_vencido || 0))}</p>
                {Number(cliente.total_vencido || 0) > 0 && (
                  <AlertTriangle className="h-4 w-4 text-yellow-500 ml-1" />
                )}
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Limite crédito</p>
              <p className="text-lg font-semibold">{formatCurrency(Number(cliente.limite_compra || 0))}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Saldo lim.cred.</p>
              <p className="text-lg font-semibold">{formatCurrency(Number(cliente.saldo_limite_credito || 0))}</p>
            </div>
          </div>

          {/* Gráfico */}
          <div className="mt-4 w-full overflow-hidden">
            <div className="w-full" style={{ maxWidth: '100%' }}>
              <BarChart
                width={400}
                height={120}
                data={chartData}
                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  height={20}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  width={30}
                />
                <Bar 
                  dataKey="value" 
                  fill="#8884d8"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex justify-between mt-4 pt-4 border-t">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Edit className="h-5 w-5 text-gray-500" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Calendar className="h-5 w-5 text-gray-500" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <DollarSign className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
