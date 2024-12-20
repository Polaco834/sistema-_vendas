import { Card } from "@/components/ui/card";
import { ArrowUpCircle, ArrowDownCircle, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

interface FinanceiroMobileOverviewProps {
  receitas: {
    atual: number;
    previsto: number;
  };
  despesas: {
    atual: number;
    previsto: number;
  };
  cartoes: number;
}

export function FinanceiroMobileOverview({ receitas, despesas, cartoes }: FinanceiroMobileOverviewProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <Card className="p-4 bg-white">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Visão geral (Dezembro)</h2>
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Receitas */}
      <div className="flex items-center justify-between py-3 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-full">
            <ArrowUpCircle className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Receitas</p>
            <p className="text-xs text-gray-500">Previsto</p>
          </div>
        </div>
        <div className="text-right">
          <p className={cn(
            "text-base font-semibold",
            receitas.atual >= 0 ? "text-green-600" : "text-red-600"
          )}>
            {formatCurrency(receitas.atual)}
          </p>
          <p className="text-xs text-gray-500">{formatCurrency(receitas.previsto)}</p>
        </div>
      </div>

      {/* Despesas */}
      <div className="flex items-center justify-between py-3 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-100 rounded-full">
            <ArrowDownCircle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Despesas</p>
            <p className="text-xs text-gray-500">Previsto</p>
          </div>
        </div>
        <div className="text-right">
          <p className={cn(
            "text-base font-semibold",
            despesas.atual <= 0 ? "text-red-600" : "text-green-600"
          )}>
            {formatCurrency(despesas.atual)}
          </p>
          <p className="text-xs text-gray-500">{formatCurrency(despesas.previsto)}</p>
        </div>
      </div>

      {/* Cartões */}
      <div className="flex items-center justify-between py-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-full">
            <CreditCard className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Cartões</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-base font-semibold text-gray-900">
            {formatCurrency(cartoes)}
          </p>
        </div>
      </div>
    </Card>
  );
}
