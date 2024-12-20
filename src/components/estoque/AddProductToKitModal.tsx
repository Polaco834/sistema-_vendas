import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { showToast } from "@/components/ui/custom-toast"
import { supabase } from "@/integrations/supabase/client"
import { useProducts } from "@/hooks/useProducts"
import { Product, KitItem } from "@/types/produto"

interface AddProductToKitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: Omit<KitItem, 'id'>) => void;
  currentItems: KitItem[];
}

export default function AddProductToKitModal({ isOpen, onClose, onAdd, currentItems }: AddProductToKitModalProps) {
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [isSaving, setIsSaving] = useState(false);
  const { products, loading: isLoading } = useProducts();

  // Filtrar produtos que não são kits
  const availableProducts = products.filter(p => !p.is_kit);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedProduct('');
      setQuantity(1);
    }
  }, [isOpen]);

  const handleAdd = async () => {
    try {
      if (!selectedProduct) {
        showToast({
          title: "Erro ao adicionar",
          description: "Selecione um produto",
          variant: "destructive"
        });
        return;
      }

      // Verificar se o produto já existe no kit
      const produtoExistente = currentItems.some(item => {
        console.log('Comparando:', item.product?.id, selectedProduct);
        return item.product?.id === selectedProduct;
      });

      if (produtoExistente) {
        showToast({
          title: "Produto já existe",
          description: "Este produto já está no kit. Use a opção de editar para modificar a quantidade.",
          variant: "destructive"
        });
        return;
      }

      setIsSaving(true);

      const selectedProductData = products.find(p => p.id === selectedProduct);
      if (!selectedProductData) {
        throw new Error('Produto não encontrado');
      }

      onAdd({
        product: selectedProductData,
        quantidade: quantity
      });

      // Resetar o formulário mas manter o modal aberto
      setSelectedProduct('');
      setQuantity(1);

      showToast({
        title: "Sucesso",
        description: "Produto adicionado ao kit",
      });
    } catch (error) {
      console.error("Erro ao adicionar produto:", error);
      showToast({
        title: "Erro ao adicionar",
        description: error instanceof Error ? error.message : "Não foi possível adicionar o produto",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Produto ao Kit</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Select
              value={selectedProduct}
              onValueChange={setSelectedProduct}
              disabled={isLoading || isSaving}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={
                  isLoading 
                    ? "Carregando produtos..." 
                    : "Selecione um produto"
                } />
              </SelectTrigger>
              <SelectContent>
                {availableProducts.map((prod) => {
                  const isExistente = currentItems.some(item => item.product?.id === prod.id);
                  return (
                    <SelectItem 
                      key={prod.id} 
                      value={prod.id}
                      disabled={isExistente}
                    >
                      {prod.nome} {isExistente ? '(Já adicionado)' : ''}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              disabled={isLoading || isSaving}
              placeholder="Quantidade"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSaving}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleAdd}
            disabled={!selectedProduct || quantity < 1 || isSaving}
          >
            {isSaving ? "Adicionando..." : "Adicionar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
