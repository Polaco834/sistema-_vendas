import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useCompanyData } from "@/hooks/useCompanyData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Building2, UserSquare2 } from 'lucide-react';

export function CompanyRegistrationModal() {
  const {
    showModal,
    setShowModal,
    nome,
    setNome,
    cnpj_cpf,
    setCnpj_cpf,
    handleSave,
    isLoading,
    needsUserData,
    nome_usuario,
    setNome_usuario
  } = useCompanyData();

  const [errors, setErrors] = useState({
    nome: "",
    cnpj_cpf: "",
    nome_usuario: ""
  });

  const validateForm = () => {
    const newErrors = {
      nome: "",
      cnpj_cpf: "",
      nome_usuario: ""
    };

    if (!nome.trim()) {
      newErrors.nome = "Nome da empresa é obrigatório";
    }

    if (!cnpj_cpf.trim()) {
      newErrors.cnpj_cpf = "CPF/CNPJ é obrigatório";
    }

    if (needsUserData && !nome_usuario.trim()) {
      newErrors.nome_usuario = "Nome do usuário é obrigatório";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        await handleSave();
      } catch (error) {
        console.error('Erro ao salvar:', error);
      }
    }
  };

  const getUnmaskedValue = (value: string) => value.replace(/\D/g, '');

  const formatDocument = (value: string) => {
    const digits = getUnmaskedValue(value);
    
    if (digits.length <= 11) {
      return digits
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    } else {
      return digits
        .replace(/^(\d{2})(\d)/, '$1.$2')
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2');
    }
  };

  const handleCpfCnpjChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const digits = getUnmaskedValue(value);
    
    if (digits.length <= 14) {
      setCnpj_cpf(formatDocument(digits));
    }
  };

  return (
    <Dialog 
      open={showModal} 
      onOpenChange={() => {}}
      modal="always"
    >
      <DialogContent 
        className="sm:max-w-[500px]"
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Building2 className="w-6 h-6 text-primary" />
            Cadastro da Empresa
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Precisamos de algumas informações sobre sua empresa para continuar.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {needsUserData && (
            <div className="space-y-4">
              <Label 
                htmlFor="nome_usuario" 
                className="text-sm font-medium flex items-center gap-2"
              >
                <UserSquare2 className="w-4 h-4" />
                Seu Nome
              </Label>
              <Input
                id="nome_usuario"
                value={nome_usuario}
                onChange={(e) => setNome_usuario(e.target.value)}
                className="w-full"
                placeholder="Digite seu nome"
              />
              {errors.nome_usuario && (
                <span className="text-destructive text-sm">
                  {errors.nome_usuario}
                </span>
              )}
            </div>
          )}

          <div className="space-y-4">
            <Label 
              htmlFor="nome" 
              className="text-sm font-medium flex items-center gap-2"
            >
              <Building2 className="w-4 h-4" />
              Nome da Empresa
            </Label>
            <Input
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full"
              placeholder="Digite o nome da sua empresa"
            />
            {errors.nome && (
              <span className="text-destructive text-sm">
                {errors.nome}
              </span>
            )}
          </div>

          <div className="space-y-4">
            <Label 
              htmlFor="cnpj_cpf" 
              className="text-sm font-medium flex items-center gap-2"
            >
              <UserSquare2 className="w-4 h-4" />
              CPF/CNPJ
            </Label>
            <Input
              id="cnpj_cpf"
              value={cnpj_cpf}
              onChange={handleCpfCnpjChange}
              className="w-full"
              placeholder="Digite o CPF ou CNPJ"
              maxLength={18}
            />
            {errors.cnpj_cpf && (
              <span className="text-destructive text-sm">
                {errors.cnpj_cpf}
              </span>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <Button 
            onClick={handleSubmit} 
            disabled={isLoading}
            className="w-32"
          >
            {isLoading ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
