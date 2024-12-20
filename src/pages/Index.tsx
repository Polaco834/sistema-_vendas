import { BarChart3, DollarSign, CreditCard, PiggyBank } from "lucide-react";
import StatCard from "../components/StatCard";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MobileMenu } from "@/components/mobile/MobileMenu";
import { MonthNavigator } from "@/components/dashboard/MonthNavigator";
import { useState } from "react";

const Index = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const salesData = [
    { month: 'Jun', vendas: 44900, recebimentos: 42500 },
    { month: 'Jul', vendas: 50700, recebimentos: 48900 },
    { month: 'Ago', vendas: 45830, recebimentos: 44200 },
    { month: 'Set', vendas: 45560, recebimentos: 43800 },
    { month: 'Out', vendas: 52700, recebimentos: 50100 },
    { month: 'Nov', vendas: 46300, recebimentos: 44800 },
  ];

  const handleMonthChange = (date: Date) => {
    setSelectedDate(date);
    // Aqui você pode adicionar a lógica para buscar dados do mês selecionado
  };

  return (
    <div className="space-y-6">
      {/* Menu móvel no topo em telas pequenas */}
      <div className="md:hidden">
        <MobileMenu />
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-800">Bem-vindo de volta!</h1>
        <p className="text-gray-600">Aqui está um resumo das suas vendas hoje</p>
      </div>

      {/* Navegador de meses */}
      <MonthNavigator onMonthChange={handleMonthChange} />

      {/* Cards de estatísticas - escondidos em mobile */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Recebimento do Dia"
          value="R$ 3.450"
          icon={<PiggyBank className="h-5 w-5 text-success" />}
          trend="8% desde ontem"
          trendUp={true}
        />
        <StatCard
          label="Vendas do Dia"
          value="R$ 4.890"
          icon={<DollarSign className="h-5 w-5 text-success" />}
          trend="5% desde ontem"
          trendUp={true}
        />
        <StatCard
          label="Total de Vendas"
          value="R$ 45.680"
          icon={<BarChart3 className="h-5 w-5 text-primary" />}
          trend="12% desde ontem"
          trendUp={true}
        />
        <StatCard
          label="A Receber"
          value="R$ 12.580"
          icon={<CreditCard className="h-5 w-5 text-warning" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-6">Meta de Vendas</h2>
          <div className="space-y-6">
            <Progress 
              value={75} 
              className="h-4 bg-gray-200" 
              indicatorClassName="bg-primary transition-all"
            />
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Meta mensal</p>
                <p className="text-2xl font-semibold text-primary">R$ 100.000</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Alcançado</p>
                <p className="text-2xl font-semibold text-primary">75%</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">Alcançado: R$ 75.000</p>
          </div>
        </Card>
        
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-6">Meta de Recebimento</h2>
          <div className="space-y-6">
            <Progress 
              value={60} 
              className="h-4 bg-gray-200" 
              indicatorClassName="bg-success transition-all"
            />
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Meta mensal</p>
                <p className="text-2xl font-semibold text-success">R$ 80.000</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Alcançado</p>
                <p className="text-2xl font-semibold text-success">60%</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">Alcançado: R$ 48.000</p>
          </div>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <h2 className="text-lg font-semibold">Vendas e Recebimentos - Últimos 6 Meses</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <span className="text-sm text-gray-600">Vendas</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-success"></div>
                <span className="text-sm text-gray-600">Recebimentos</span>
              </div>
            </div>
          </div>
          
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={salesData} 
                margin={{ 
                  top: 10,
                  right: 10,
                  left: 0,
                  bottom: 0
                }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                <XAxis 
                  dataKey="month" 
                  className="text-xs font-medium"
                  tick={{ fill: '#6B7280' }}
                />
                <YAxis 
                  className="text-xs font-medium"
                  tick={{ fill: '#6B7280' }}
                  tickFormatter={(value) => `R$ ${(value / 1000)}k`}
                />
                <Tooltip 
                  formatter={(value) => `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Bar 
                  dataKey="vendas" 
                  name="Vendas" 
                  fill="#6366f1" 
                  radius={[4, 4, 0, 0]}
                  maxBarSize={50}
                />
                <Bar 
                  dataKey="recebimentos" 
                  name="Recebimentos" 
                  fill="#22c55e" 
                  radius={[4, 4, 0, 0]}
                  maxBarSize={50}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-6">Últimas Transações</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Venda #00{i}</p>
                    <p className="text-sm text-gray-500">Há {i} hora{i > 1 ? 's' : ''}</p>
                  </div>
                </div>
                <span className="font-medium">R$ {(1500 * i).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Index;