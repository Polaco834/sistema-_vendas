import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Building2, PlusCircle, MinusCircle, CreditCard, ArrowDownCircle, ArrowUpCircle, AlertTriangle } from "lucide-react";
import CircularProgress from "@/components/CircularProgress";
import ExpensesByCategory from "@/components/ExpensesByCategory";
import { FinanceiroMobileOverview } from "@/components/financeiro/FinanceiroMobileOverview";
import { MonthlyBalanceCard } from "@/components/financeiro/MonthlyBalanceCard";

const Financeiro = () => {
  const chartData = [
    { dia: '1', valor: 7870.80 },
    { dia: '7', valor: 6500.00 },
    { dia: '14', valor: 5200.00 },
    { dia: '21', valor: 4680.37 },
    { dia: '28', valor: 4680.37 },
  ];

  const monthlyBalanceData = {
    inicial: 9802.97,
    saldo: 13378.52,
    previsto: 35719.27,
    dailyData: [
      { dia: 1, valor: 9802.97 },
      { dia: 5, valor: 11500.00 },
      { dia: 9, valor: 12000.00 },
      { dia: 13, valor: 11800.00 },
      { dia: 17, valor: 12500.00 },
      { dia: 21, valor: 12800.00 },
      { dia: 25, valor: 13000.00 },
      { dia: 29, valor: 13378.52 },
    ]
  };

  const contas = [
    { nome: "Moeda", saldo: 3.00, previsto: 0.00 },
    { nome: "Casa", saldo: 0.00, previsto: 0.00 },
    { nome: "Mercado Pago", saldo: 0.25, previsto: 0.00 },
    { nome: "Caixa Empresa", saldo: 1952.00, previsto: 2316.66 },
    { nome: "Pagseguro", saldo: 2642.55, previsto: 18245.00 },
    { nome: "Bradesco", saldo: 0.00, previsto: 0.00 },
    { nome: "Santander", saldo: 46.18, previsto: -2263.05 },
    { nome: "Itaú", saldo: 24.41, previsto: 0.00 },
  ];

  const financialData = {
    receitas: {
      atual: 52694.66,
      previsto: 20561.66
    },
    despesas: {
      atual: -15325.80,
      previsto: -11639.25
    },
    cartoes: 0
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold mb-2">Financeiro</h1>
          <p className="text-gray-600">Controle financeiro e fluxo de caixa</p>
        </div>
        <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors inline-flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          Nova Transação
        </button>
      </div>

      {/* Card de Saldo Mensal */}
      <MonthlyBalanceCard data={monthlyBalanceData} />

      {/* Visão geral para Mobile */}
      <div className="block md:hidden">
        <FinanceiroMobileOverview
          receitas={financialData.receitas}
          despesas={financialData.despesas}
          cartoes={financialData.cartoes}
        />
      </div>

      {/* Cards originais para Desktop */}
      <div className="hidden md:grid md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500">Receitas</p>
              <h3 className="text-2xl font-bold text-success mt-1">R$ {financialData.receitas.atual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
              <p className="text-sm text-gray-500 mt-1">Previsto: R$ {financialData.receitas.previsto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </div>
            <div className="p-2 bg-success/10 rounded-full">
              <ArrowUpCircle className="h-6 w-6 text-success" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500">Despesas</p>
              <h3 className="text-2xl font-bold text-danger mt-1">R$ {financialData.despesas.atual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
              <p className="text-sm text-gray-500 mt-1">Previsto: R$ {financialData.despesas.previsto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </div>
            <div className="p-2 bg-danger/10 rounded-full">
              <ArrowDownCircle className="h-6 w-6 text-danger" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500">Saldo Atual</p>
              <h3 className="text-2xl font-bold mt-1">R$ 4680.37</h3>
              <p className="text-sm text-gray-500 mt-1">Inicial: R$ 7870.80</p>
            </div>
            <div className="p-2 bg-primary/10 rounded-full">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
          </div>
        </Card>
      </div>

      <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-warning">Atenção</p>
          <p className="text-sm text-gray-600">4 parcelas vencem hoje. R$ 750,00 a receber.</p>
        </div>
      </div>

      <ExpensesByCategory />

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Fluxo de Caixa - Novembro</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dia" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="valor" stroke="#6366f1" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Parcelas a Receber</h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-success"></div>
                <span className="text-sm">67% Efetuadas</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                <span className="text-sm">33% Pendentes</span>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <CircularProgress percentage={67} size={160} circleColor="#22c55e" />
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">Total a Receber</p>
            <p className="text-xl font-semibold">R$ 43.030,00</p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Parcelas a Pagar</h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-danger"></div>
                <span className="text-sm">95% Efetuadas</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                <span className="text-sm">5% Pendentes</span>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <CircularProgress percentage={95} size={160} circleColor="#ef4444" />
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">Total a Pagar</p>
            <p className="text-xl font-semibold">R$ 46.111,13</p>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Contas Bancárias</h3>
          <button className="text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Adicionar Conta
          </button>
        </div>
        <div className="grid gap-4">
          {contas.map((conta, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg">
                  <Building2 className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium">{conta.nome}</p>
                  <p className="text-sm text-gray-500">Previsto: R$ {conta.previsto.toFixed(2)}</p>
                </div>
              </div>
              <p className={`font-semibold ${conta.saldo < 0 ? 'text-danger' : 'text-gray-900'}`}>
                R$ {conta.saldo.toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Financeiro;