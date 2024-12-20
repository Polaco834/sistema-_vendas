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
import { useCompanyData } from "@/hooks/useCompanyData"
import { Product, KitItem } from "@/types/produto"

interface AddProductToKitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: Omit<KitItem, 'id'>) => void;
  currentItems: KitItem[];
}

export default function AddProductToKitModal({ isOpen, onClose, onAdd, currentItems }: AddProductToKitModalProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(false);
  const { empresa_id, isLoading: isLoadingCompany } = useCompanyData();

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedProduct(null);
      setQuantity(1);
    }
  }, [isOpen]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!isOpen || isLoadingCompany || !empresa_id) {
        return;
      }

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("produtos")
          .select<"*", Product>("*")
          .eq("empresa_id", empresa_id)
          .eq("is_kit", false);

        if (error) throw error;

        setProducts(data ?? []);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProduct || !quantity) {
      showToast({
        title: 'Por favor, preencha todos os campos',
        description: 'Selecione um produto e informe a quantidade',
        variant: 'destructive'
      });
      return;
    }

    const quantityNumber = Number(quantity);
    if (isNaN(quantityNumber) || quantityNumber <= 0) {
      showToast({
        title: 'Quantidade inválida',
        description: 'A quantidade deve ser um número maior que zero',
        variant: 'destructive'
      });
      return;
    }

    // Verifica se o produto já existe no kit
    const existingProduct = currentItems.find(item => item.product.id === selectedProduct);
    if (existingProduct) {
      showToast({
        title: 'Este produto já existe no kit',
        description: 'Para alterar a quantidade, use o botão de editar no produto.',
        variant: 'destructive'
      });
      return;
    }

    try {
      const selectedProductData = products.find(p => p.id === selectedProduct);
      if (!selectedProductData) {
        throw new Error('Produto não encontrado');
      }

      onAdd({
        product: {
          id: selectedProductData.id,
          name: selectedProductData.nome
        },
        quantity: quantityNumber
      });
      
      setSelectedProduct(null);
      setQuantity(1);
      onClose();
    } catch (error) {
      console.error("Erro ao adicionar produto:", error);
      showToast({
        title: "Erro ao adicionar produto",
        description: "Não foi possível adicionar o produto ao kit",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Incluir Produto no Kit</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label>Produto</label>
            <Select
              value={selectedProduct || ""}
              onValueChange={setSelectedProduct}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder={
                  isLoading 
                    ? "Carregando produtos..." 
                    : products.length === 0 
                      ? "Nenhum produto disponível"
                      : "Selecione um produto"
                } />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-950 border shadow-md">
                {products.map((product) => (
                  <SelectItem 
                    key={product.id} 
                    value={product.id}
                    className="hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    {product.nome} {product.preco_venda ? `- R$ ${product.preco_venda.toFixed(2)}` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label>Quantidade</label>
            <Input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              placeholder="Informe a quantidade"
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            Incluir
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
