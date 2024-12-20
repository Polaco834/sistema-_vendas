import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { showToast } from "../ui/custom-toast"
import { supabase } from "@/integrations/supabase/client"
import { useProducts } from "@/hooks/useProducts"
import { Product, ProdutoKit } from "@/types/produto"

interface EditProductInKitModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProdutoKit;
  kitId: string;
  onUpdate: () => void;
  onProductUpdated: (product: ProdutoKit) => void;
}

export default function EditProductInKitModal({
  isOpen,
  onClose,
  product,
  kitId,
  onUpdate,
  onProductUpdated,
}: EditProductInKitModalProps) {
  const [selectedProduct, setSelectedProduct] = useState<string>(product.product.id);
  const [quantity, setQuantity] = useState<number>(product.quantidade);
  const [isSaving, setIsSaving] = useState(false);
  const { products, loading: isLoading } = useProducts();

  // Filtrar apenas produtos que não são kits
  const availableProducts = products.filter(p => !p.is_kit);

  useEffect(() => {
    console.log('Product changed:', {
      productId: product?.product?.id,
      availableProducts: availableProducts.map(p => ({ id: p.id, nome: p.nome }))
    });

    if (product?.product?.id) {
      setSelectedProduct(product.product.id);
      setQuantity(product.quantidade);
    }
  }, [product, products]);

  const handleSave = async () => {
    try {
      if (!selectedProduct) {
        showToast({
          title: "Erro ao salvar",
          description: "Selecione um produto",
          variant: "destructive"
        });
        return;
      }

      // Se o produto selecionado é diferente do produto atual, verificar se já existe no kit
      if (selectedProduct !== product.product.id) {
        console.log('Verificando produto duplicado:', {
          kitId,
          selectedProduct,
          currentProductId: product.product.id
        });

        // Verificar se o produto já existe no kit
        const { data: existingProducts, error: checkError } = await supabase
          .from("produtos_kit")
          .select("*")
          .eq("kit_id", kitId);

        console.log('Produtos existentes no kit:', existingProducts);

        if (checkError) {
          console.error('Erro ao verificar produtos:', checkError);
          throw checkError;
        }

        const isDuplicate = existingProducts?.some(
          (p) => p.produto_id === selectedProduct && p.id !== product.id
        );

        console.log('Verificação de duplicidade:', {
          isDuplicate,
          existingProducts: existingProducts?.map(p => ({
            id: p.id,
            produto_id: p.produto_id,
            kit_id: p.kit_id
          }))
        });

        if (isDuplicate) {
          showToast({
            title: "Erro ao salvar",
            description: "Este produto já está incluído no kit",
            variant: "destructive"
          });
          return;
        }
      }

      setIsSaving(true);

      console.log('Atualizando produto:', {
        kitId,
        oldProductId: product.product.id,
        newProductId: selectedProduct,
        quantity,
        productId: product.id
      });

      // Atualizar o registro na tabela produtos_kit
      const { error: updateError } = await supabase
        .from("produtos_kit")
        .update({
          produto_id: selectedProduct,
          quantidade: quantity
        })
        .eq("id", product.id); // Usar o ID do registro ao invés de kit_id e produto_id

      if (updateError) {
        console.error('Erro ao atualizar:', updateError);
        throw updateError;
      }

      // Buscar o produto atualizado para retornar os dados completos
      const selectedProductData = products.find(p => p.id === selectedProduct);
      if (!selectedProductData) {
        throw new Error('Produto não encontrado');
      }

      const updatedProduct = {
        id: product.id,
        kit_id: kitId,
        produto_id: selectedProduct,
        quantidade: quantity,
        product: {
          id: selectedProductData.id,
          nome: selectedProductData.nome,
          preco_venda: selectedProductData.preco_venda
        }
      };

      showToast({
        title: "Sucesso",
        description: "Produto atualizado com sucesso",
      });

      // Atualizar o estado local e notificar o componente pai
      onProductUpdated(updatedProduct);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      showToast({
        title: "Erro ao salvar",
        description: error instanceof Error ? error.message : "Não foi possível salvar as alterações",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Log para debug
  console.log('Current state:', {
    selectedProduct,
    availableProducts: availableProducts.map(p => ({ id: p.id, nome: p.nome })),
    productId: product?.product?.id
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-6">
        <DialogHeader className="mb-6">
          <DialogTitle>Editar Produto no Kit</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <Label>Produto</Label>
            <Select
              value={selectedProduct}
              onValueChange={setSelectedProduct}
              disabled={isLoading || isSaving}
            >
              <SelectTrigger className="w-full">
                <SelectValue>
                  {isLoading 
                    ? "Carregando..." 
                    : availableProducts.find(p => p.id === selectedProduct)?.nome || "Selecione um produto"
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {availableProducts.map((prod) => (
                    <SelectItem 
                      key={prod.id} 
                      value={prod.id}
                    >
                      {prod.nome}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <Label>Quantidade</Label>
            <Input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              disabled={isLoading || isSaving}
            />
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isLoading || isSaving}>
            {isSaving ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
