import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/contexts/AuthContext";
import { useProducts } from "@/hooks/useProducts";
import { Plus, Trash } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface NewKitModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  kit?: {
    id: string;
    nome: string;
    preco_venda: number;
    items: {
      product: {
        id: string;
        nome: string;
        preco_venda: number;
      };
      quantidade: number;
    }[];
  };
}

interface KitItem {
  produto_id: string;
  quantidade: number;
  nome?: string;
  preco_venda?: number;
}

export default function NewKitModal({ open, onOpenChange, onSuccess, kit }: NewKitModalProps) {
  const [nome, setNome] = useState("");
  const [precoVenda, setPrecoVenda] = useState("");
  const [items, setItems] = useState<KitItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { userData } = useAuthContext();
  const { products } = useProducts();

  useEffect(() => {
    if (kit) {
      setNome(kit.nome);
      setPrecoVenda(kit.preco_venda.toString());
      setItems(kit.items.map(item => ({
        produto_id: item.product.id,
        quantidade: item.quantidade,
        nome: item.product.nome,
        preco_venda: item.product.preco_venda
      })));
    } else {
      setNome("");
      setPrecoVenda("");
      setItems([]);
    }
  }, [kit]);

  const handleAddItem = () => {
    setItems([...items, { produto_id: "", quantidade: 1 }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof KitItem, value: string | number) => {
    const newItems = [...items];
    if (field === 'produto_id') {
      const product = products.find(p => p.id.toString() === value);
      newItems[index] = {
        ...newItems[index],
        [field]: value,
        nome: product?.nome,
        preco_venda: product?.preco_venda
      };
    } else {
      newItems[index] = { ...newItems[index], [field]: value };
    }
    setItems(newItems);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Validações
      if (!nome || !precoVenda || items.length === 0) {
        throw new Error("Preencha todos os campos obrigatórios");
      }

      if (!userData?.empresa_id) {
        throw new Error("Empresa não encontrada");
      }

      // Se for edição, atualizar o produto existente
      if (kit) {
        const { error: updateError } = await supabase
          .from('produtos')
          .update({
            nome,
            preco_venda: Number(precoVenda),
            updated_at: new Date().toISOString()
          })
          .eq('id', kit.id);

        if (updateError) throw updateError;

        // Deletar itens antigos
        const { error: deleteError } = await supabase
          .from('produtos_kit')
          .delete()
          .eq('kit_id', kit.id);

        if (deleteError) throw deleteError;
      } else {
        // Se for criação, inserir novo produto
        const { data: newKit, error: insertError } = await supabase
          .from('produtos')
          .insert({
            nome,
            preco_venda: Number(precoVenda),
            empresa_id: userData.empresa_id,
            is_kit: true
          })
          .select()
          .single();

        if (insertError) throw insertError;
        if (!newKit) throw new Error("Erro ao criar kit");

        // Atualizar o ID do kit para os itens
        const kitId = newKit.id;
        
        // Inserir os itens do kit
        const { error: itemsError } = await supabase
          .from('produtos_kit')
          .insert(
            items.map(item => ({
              kit_id: kit ? kit.id : kitId,
              produto_id: item.produto_id,
              quantidade: item.quantidade
            }))
          );

        if (itemsError) throw itemsError;
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving kit:', error);
      // Aqui você pode adicionar uma notificação de erro
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{kit ? "Editar Kit" : "Novo Kit"}</DialogTitle>
          <DialogDescription>
            {kit ? "Edite os detalhes do kit" : "Crie um novo kit de produtos"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome do Kit</Label>
            <Input
              id="nome"
              placeholder="Digite o nome do kit"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="preco">Preço de Venda</Label>
            <Input
              id="preco"
              type="number"
              placeholder="0,00"
              value={precoVenda}
              onChange={(e) => setPrecoVenda(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Produtos do Kit</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddItem}
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Produto
              </Button>
            </div>

            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="flex gap-4 items-end">
                  <div className="flex-1">
                    <Label>Produto</Label>
                    <Select
                      value={item.produto_id}
                      onValueChange={(value) =>
                        handleItemChange(index, "produto_id", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um produto" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((product) => (
                          <SelectItem
                            key={product.id}
                            value={product.id.toString()}
                          >
                            {product.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="w-24">
                    <Label>Quantidade</Label>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantidade}
                      onChange={(e) =>
                        handleItemChange(index, "quantidade", parseInt(e.target.value))
                      }
                    />
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveItem(index)}
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Salvando..." : kit ? "Salvar Alterações" : "Criar Kit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
