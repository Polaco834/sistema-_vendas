import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, addMonths, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

interface MonthlyBalanceCardProps {
  data: {
    inicial: number;
    saldo: number;
    previsto: number;
    dailyData: Array<{
      dia: number;
      valor: number;
    }>;
  };
}

export function MonthlyBalanceCard({ data }: MonthlyBalanceCardProps) {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 11, 9)); // Dezembro 2024

  const handlePreviousMonth = () => {
    setCurrentDate(prev => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => addMonths(prev, 1));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <Card className="w-full bg-white overflow-hidden">
      {/* Cabeçalho com navegação */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4">
        <div className="flex items-center justify-between text-white">
          <button 
            onClick={handlePreviousMonth}
            className="p-1 hover:bg-white/10 rounded-full transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <h2 className="text-lg font-semibold">
            {format(currentDate, 'MMMM', { locale: ptBR })}
            <span className="ml-1 text-sm opacity-90">
              {format(currentDate, 'yyyy')}
            </span>
          </h2>
          
          <button 
            onClick={handleNextMonth}
            className="p-1 hover:bg-white/10 rounded-full transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Valores */}
      <div className="grid grid-cols-3 gap-4 p-4 border-b border-gray-100">
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-1">Inicial</p>
          <p className="text-lg font-semibold text-gray-900">
            {formatCurrency(data.inicial)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-1">Saldo</p>
          <p className="text-lg font-semibold text-blue-600">
            {formatCurrency(data.saldo)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-1">Previsto</p>
          <p className="text-lg font-semibold text-green-600">
            {formatCurrency(data.previsto)}
          </p>
        </div>
      </div>

      {/* Gráfico */}
      <div className="h-32 w-full p-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data.dailyData}
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="dia" 
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis hide />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: 'none',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
              }}
              formatter={(value: number) => [formatCurrency(value), 'Saldo']}
              labelFormatter={(label) => `Dia ${label}`}
            />
            <Area
              type="monotone"
              dataKey="valor"
              stroke="#3B82F6"
              strokeWidth={2}
              fill="url(#colorValue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
