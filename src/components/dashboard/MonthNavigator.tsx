import { useState } from 'react';
import { format, subMonths, addMonths, isSameMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Calendar, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MonthNavigatorProps {
  onMonthChange: (date: Date) => void;
}

export const MonthNavigator = ({ onMonthChange }: MonthNavigatorProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Gera array com o mês atual como segundo item
  const generateMonthRange = () => {
    const months = [];
    // Adiciona 1 mês anterior
    months.push(subMonths(currentDate, 1));
    // Adiciona o mês atual
    months.push(currentDate);
    // Adiciona os próximos 6 meses
    for (let i = 1; i <= 6; i++) {
      months.push(addMonths(currentDate, i));
    }
    return months;
  };

  const months = generateMonthRange();

  const handleMonthSelect = (date: Date) => {
    setSelectedDate(date);
    onMonthChange(date);
  };

  const isCurrentMonth = (date: Date) => isSameMonth(date, new Date());

  const formatMonthYear = (date: Date) => {
    const month = format(date, "MMMM", { locale: ptBR });
    const year = format(date, "yyyy");
    // Capitaliza a primeira letra do mês
    return `${month.charAt(0).toUpperCase() + month.slice(1)}, ${year}`;
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-gray-100 p-3">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-blue-600" />
          Navegação por Mês
        </h3>
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleMonthSelect(subMonths(selectedDate, 1))}
            className="p-1.5 rounded-md hover:bg-gray-100 text-gray-600"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleMonthSelect(addMonths(selectedDate, 1))}
            className="p-1.5 rounded-md hover:bg-gray-100 text-gray-600"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
        {months.map((date, index) => {
          const isSelected = isSameMonth(date, selectedDate);
          const isCurrent = isCurrentMonth(date);

          return (
            <button
              key={index}
              onClick={() => handleMonthSelect(date)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 rounded-md whitespace-nowrap transition-colors min-w-[140px] justify-center",
                isSelected
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "hover:bg-gray-50 text-gray-600"
              )}
            >
              <span className="text-sm">
                {formatMonthYear(date)}
              </span>
              {isCurrent && (
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
