import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface CpfCnpjInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const CpfCnpjInput = ({ value, onChange, error }: CpfCnpjInputProps) => {
  const [focused, setFocused] = useState(false);

  const formatCpfCnpj = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    
    if (numbers.length <= 11) {
      // Formata como CPF: 000.000.000-00
      return numbers
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    } else {
      // Formata como CNPJ: 00.000.000/0000-00
      return numbers
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    const formattedValue = formatCpfCnpj(rawValue);
    onChange(formattedValue);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="cnpj_cpf">CNPJ/CPF</Label>
      <Input
        type="text"
        id="cnpj_cpf"
        name="cnpj_cpf"
        placeholder={focused ? "000.000.000-00 ou 00.000.000/0000-00" : "Digite o CNPJ ou CPF"}
        value={value}
        onChange={handleChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={error ? "border-red-500" : ""}
        maxLength={18}
      />
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
};
