import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

interface ExpenseCategory {
  name: string;
  value: number;
  color: string;
  percentage: number;
}

const ExpensesByCategory = () => {
  const expenses: ExpenseCategory[] = [
    { name: "Cartão Empresa", value: 37244.79, color: "#8B5CF6", percentage: 76 },
    { name: "Salário Funcionários", value: 2192.00, color: "#06B6D4", percentage: 4 },
    { name: "Boletos", value: 1406.40, color: "#10B981", percentage: 2 },
    { name: "Santander PF", value: 1344.74, color: "#F59E0B", percentage: 2 },
    { name: "Outras Saídas", value: 1337.07, color: "#EC4899", percentage: 2 },
    { name: "Atacado", value: 1272.85, color: "#6366F1", percentage: 2 },
    { name: "Combustível", value: 1271.00, color: "#EF4444", percentage: 2 },
    { name: "Itaú PJ", value: 1052.00, color: "#F97316", percentage: 2 },
    { name: "Almoço", value: 991.00, color: "#14B8A6", percentage: 2 },
    { name: "Manutenção Conta", value: 832.94, color: "#6B7280", percentage: 1 },
  ];

  const total = expenses.reduce((sum, expense) => sum + expense.value, 0);

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Despesas por Categoria</h3>
        <p className="text-sm text-gray-500">Total: R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-[300px] flex items-center justify-center relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={expenses}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {expenses.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <span className="text-sm font-medium text-gray-600">Categoria</span>
            </div>
          </div>
        </div>

        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
          {expenses.map((expense, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: expense.color }}
                />
                <div>
                  <p className="font-medium">{expense.name}</p>
                  <p className="text-sm text-gray-500">{expense.percentage}%</p>
                </div>
              </div>
              <p className="font-mono font-medium">
                R$ {expense.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default ExpensesByCategory;