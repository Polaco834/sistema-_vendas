export const formatDocument = (value: string) => {
  const numbers = value.replace(/\D/g, "");
  const limitedNumbers = numbers.slice(0, 14);
  
  if (limitedNumbers.length <= 11) {
    return limitedNumbers.replace(
      /^(\d{0,3})(\d{0,3})(\d{0,3})(\d{0,2})/,
      (_, p1, p2, p3, p4) => {
        if (p4) return `${p1}.${p2}.${p3}-${p4}`;
        if (p3) return `${p1}.${p2}.${p3}`;
        if (p2) return `${p1}.${p2}`;
        return p1;
      }
    );
  } else {
    return limitedNumbers.replace(
      /^(\d{0,2})(\d{0,3})(\d{0,3})(\d{0,4})(\d{0,2})/,
      (_, p1, p2, p3, p4, p5) => {
        if (p5) return `${p1}.${p2}.${p3}/${p4}-${p5}`;
        if (p4) return `${p1}.${p2}.${p3}/${p4}`;
        if (p3) return `${p1}.${p2}.${p3}`;
        if (p2) return `${p1}.${p2}`;
        return p1;
      }
    );
  }
};

export const formatPhone = (value: string) => {
  // Remove o prefixo +55 se existir
  const cleanValue = value.replace(/^\+55\s?/, '');
  
  // Remove tudo que não for número
  const numbers = cleanValue.replace(/\D/g, "");
  
  // Limita para 11 dígitos (DDD + número)
  const limitedNumbers = numbers.slice(0, 11);
  
  // Formata o número
  const formatted = limitedNumbers.replace(
    /^(\d{0,2})(\d{0,5})(\d{0,4})/,
    (_, ddd, prefix, suffix) => {
      if (suffix) return `(${ddd}) ${prefix}-${suffix}`;
      if (prefix) return `(${ddd}) ${prefix}`;
      if (ddd) return `(${ddd}`;
      return "";
    }
  );

  // Adiciona o prefixo +55 apenas se houver algum número
  return limitedNumbers.length > 0 ? `+55 ${formatted}` : "";
};

// Função para remover a formatação e manter apenas os números com o código do país
export const normalizePhone = (phone: string) => {
  if (!phone) return null;
  
  // Remove todos os caracteres não numéricos
  const numbers = phone.replace(/\D/g, "");
  
  // Se já começa com 55, não adiciona novamente
  if (numbers.startsWith('55')) {
    return `+${numbers}`;
  }
  
  // Adiciona o +55 no início
  return `+55${numbers}`;
};

export const validateCpfCnpj = (value: string) => {
  // Remove todos os caracteres não numéricos
  const numbers = value.replace(/\D/g, '');
  
  // Verifica se é CPF (11 dígitos)
  if (numbers.length < 11) {
    return { isValid: false, message: "CPF não é válido" };
  }
  
  // Se tem 11 dígitos, valida como CPF
  if (numbers.length === 11) {
    return { isValid: true, message: "" };
  }
  
  // Se tem mais que 11 mas menos que 14, é um CNPJ inválido
  if (numbers.length < 14) {
    return { isValid: false, message: "CNPJ não é válido" };
  }
  
  // Se tem 14 dígitos, é um CNPJ válido
  if (numbers.length === 14) {
    return { isValid: true, message: "" };
  }
  
  // Se tem mais que 14 dígitos, é inválido
  return { isValid: false, message: "CNPJ não é válido" };
};