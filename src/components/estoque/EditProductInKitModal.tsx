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
import { useCompanyData } from "@/hooks/useCompanyData"
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
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>(product.produto_id);
  const [quantity, setQuantity] = useState<number>(product.quantidade);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { empresa_id, isLoading: isLoadingCompany } = useCompanyData();

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedProduct(product.produto_id);
      setQuantity(product.quantidade);
      setProducts([]);
    }
  }, [isOpen, product]);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      if (!isOpen || isLoadingCompany || !empresa_id) return;

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('produtos')
          .select("*")
          .eq('empresa_id', empresa_id)
          .eq('is_kit', false);

        if (error) throw error;

        setProducts(data ?? []);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        showToast({
          title: "Erro ao carregar produtos",
          description: "Não foi possível carregar a lista de produtos",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [isOpen, empresa_id, isLoadingCompany]);

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

      setIsSaving(true);

      // Atualizar o registro na tabela produtos_kit
      const { error: updateError } = await supabase
        .from("produtos_kit")
        .update({
          produto_id: selectedProduct,
          quantidade: quantity,
          kit_id: kitId
        })
        .eq("id", product.id);

      if (updateError) throw updateError;

      // Buscar o produto atualizado
      const { data: updatedKitProduct, error: fetchError } = await supabase
        .from('produtos_kit')
        .select(`
          id,
          kit_id,
          produto_id,
          quantidade,
          produto:produtos (
            id,
            nome,
            preco_venda
          )
        `)
        .eq('id', product.id)
        .single();

      if (fetchError) throw fetchError;

      if (!updatedKitProduct) {
        throw new Error('Produto não encontrado após atualização');
      }

      showToast({
        title: "Sucesso",
        description: "Produto atualizado com sucesso",
      });

      onProductUpdated(updatedKitProduct);
      onUpdate();
      onClose();
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Produto no Kit</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Produto</Label>
            <Select
              value={selectedProduct}
              onValueChange={setSelectedProduct}
              disabled={isLoading || isSaving}
            >
              <SelectTrigger>
                <SelectValue placeholder={
                  isLoading 
                    ? "Carregando produtos..." 
                    : "Selecione um produto"
                } />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {products.map((product) => (
                    <SelectItem 
                      key={product.id} 
                      value={product.id}
                    >
                      {product.nome} {product.preco_venda ? `- R$ ${product.preco_venda.toFixed(2)}` : ''}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
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

        <DialogFooter>
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
