import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import AddProductToKitModal from "./AddProductToKitModal"
import EditProductInKitModal from "./EditProductInKitModal"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Pencil, Trash2 } from "lucide-react"
import { showToast } from "../ui/custom-toast"
import { supabase } from "@/integrations/supabase/client"
import { Input } from "@/components/ui/input"
import { Kit, KitItem, ProdutoKit } from "@/types/produto"

interface KitDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  kit: Kit;
  onUpdate: () => void;
}

export default function KitDetailsModal({ isOpen, onClose, kit, onUpdate }: KitDetailsModalProps) {
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProdutoKit | null>(null);
  const [kitName, setKitName] = useState(kit.name);
  const [salePrice, setSalePrice] = useState(kit.sale_price.toString());
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [kitItems, setKitItems] = useState<KitItem[]>(kit.items);

  useEffect(() => {
    const loadKitDetails = async () => {
      if (!isOpen || !kit.id) return;

      try {
        // Primeiro, buscar os dados básicos do kit
        const { data: kitData, error: kitError } = await supabase
          .from('produtos')
          .select('id, nome, preco_venda, empresa_id')
          .eq('id', kit.id)
          .single();

        if (kitError) throw kitError;

        if (!kitData) {
          throw new Error('Kit não encontrado');
        }

        // Depois, buscar os produtos do kit
        const { data: kitProducts, error: productsError } = await supabase
          .from('produtos_kit')
          .select(`
            id,
            kit_id,
            produto_id,
            quantidade,
            produto:produtos (
              id,
              nome
            )
          `)
          .eq('kit_id', kit.id);

        if (productsError) throw productsError;

        // Formatar os dados
        const formattedItems = kitProducts.map(item => ({
          id: item.id,
          product: {
            id: item.produto.id,
            name: item.produto.nome
          },
          quantity: item.quantidade
        }));

        // Atualizar estados com os dados carregados
        setKitItems(formattedItems);
        setKitName(kitData.nome);
        setSalePrice(kitData.preco_venda.toString());

      } catch (error) {
        showToast({
          title: "Erro ao carregar detalhes",
          description: "Não foi possível carregar os detalhes do kit",
          variant: "destructive"
        });
      }
    };

    loadKitDetails();
  }, [isOpen, kit.id]);

  useEffect(() => {
    if (isOpen) {
      setIsEditing(false);
    }
  }, [isOpen]);

  const handleUpdate = () => {
    onUpdate();
  };

  const handleSaveKitDetails = async () => {
    try {
      setIsSaving(true);
      const salePriceNumber = Number(salePrice);
      const newName = kitName.trim();
      
      if (!newName) {
        showToast({
          title: "Nome inválido",
          description: "O nome do kit não pode estar vazio",
          variant: "destructive"
        });
        return;
      }

      if (isNaN(salePriceNumber) || salePriceNumber < 0) {
        showToast({
          title: "Preço inválido",
          description: "O preço de venda deve ser um número maior ou igual a zero",
          variant: "destructive"
        });
        return;
      }

      const { data: existingKit, error: searchError } = await supabase
        .from('produtos')
        .select('id, nome')
        .eq('is_kit', true)
        .eq('nome', newName)
        .neq('id', kit.id) 
        .single();

      if (searchError && searchError.code !== 'PGRST116') { 
        throw searchError;
      }

      if (existingKit) {
        showToast({
          title: "Nome já existe",
          description: "Já existe um kit com este nome. Por favor, escolha outro nome.",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from('produtos')
        .update({
          nome: newName,
          preco_venda: salePriceNumber
        })
        .eq('id', kit.id);

      if (error) throw error;

      showToast({
        title: "Kit atualizado",
        description: "Nome e preço atualizados com sucesso",
      });

      setIsEditing(false);
      handleUpdate();
    } catch (error) {
      showToast({
        title: "Erro ao atualizar kit",
        description: "Não foi possível atualizar o nome e preço do kit",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddProduct = async (product: Omit<KitItem, 'id'>) => {
    try {
      // Primeiro, inserir o produto no kit
      const { error: insertError } = await supabase
        .from('produtos_kit')
        .insert({
          kit_id: kit.id,
          produto_id: product.product.id,
          quantidade: product.quantity
        });

      if (insertError) throw insertError;

      // Depois, buscar os dados do produto inserido
      const { data: productData, error: productError } = await supabase
        .from('produtos')
        .select('id, nome')
        .eq('id', product.product.id)
        .single();

      if (productError) throw productError;

      // Atualizar a lista local
      const newItem: KitItem = {
        id: `${kit.id}_${product.product.id}`,
        product: {
          id: productData.id,
          name: productData.nome,
        },
        quantity: product.quantity
      };

      setKitItems(prevItems => [...prevItems, newItem]);

      showToast({
        title: 'Produto adicionado ao kit com sucesso',
      });
      handleUpdate();
    } catch (error) {
      showToast({
        title: 'Erro ao adicionar produto ao kit',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      const { error } = await supabase
        .from('produtos_kit')
        .delete()
        .eq('kit_id', kit.id)
        .eq('produto_id', productId);

      if (error) throw error;

      setKitItems(prevItems => prevItems.filter(item => item.product.id !== productId));

      showToast({
        title: 'Produto removido do kit com sucesso',
      });
      handleUpdate();
    } catch (error) {
      showToast({
        title: 'Erro ao remover produto do kit',
        variant: 'destructive'
      });
    }
  };

  const handleProductUpdate = (updatedProduct: ProdutoKit) => {
    setKitItems(prevItems => 
      prevItems.map(item => {
        if (item.id === updatedProduct.id) {
          return {
            id: updatedProduct.id,
            product: {
              id: updatedProduct.produto_id,
              name: updatedProduct.produto?.nome || ''
            },
            quantity: updatedProduct.quantidade
          };
        }
        return item;
      })
    );
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Kit</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Kit Details Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Informações do Kit</h3>
                <div className="space-x-2">
                  {isEditing ? (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsEditing(false);
                          setKitName(kit.name);
                          setSalePrice(kit.sale_price.toString());
                        }}
                        disabled={isSaving}
                      >
                        Cancelar
                      </Button>
                      <Button
                        onClick={handleSaveKitDetails}
                        disabled={isSaving}
                      >
                        {isSaving ? "Salvando..." : "Salvar"}
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(true)}
                    >
                      Editar Kit
                    </Button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nome do Kit</label>
                  <Input
                    value={kitName}
                    onChange={(e) => setKitName(e.target.value)}
                    disabled={!isEditing}
                    placeholder="Nome do kit"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Preço de Venda</label>
                  <Input
                    type="number"
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                    disabled={!isEditing}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Products Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Produtos no Kit</h3>
                <Button onClick={() => setIsAddProductModalOpen(true)}>
                  Adicionar Produto
                </Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead>Quantidade</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {kitItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.product.name}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={async () => {
                              try {
                                // Buscar dados completos do produto
                                const { data: productData, error } = await supabase
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
                                  .eq('id', item.id)
                                  .single();

                                if (error) throw error;
                                if (!productData) throw new Error('Produto não encontrado');

                                setEditingProduct(productData);
                              } catch (error) {
                                showToast({
                                  title: "Erro",
                                  description: "Não foi possível iniciar a edição",
                                  variant: "destructive"
                                });
                              }
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja remover este produto do kit?
                                  Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-red-600 hover:bg-red-700"
                                  onClick={() => handleDeleteProduct(item.product.id)}
                                >
                                  Excluir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AddProductToKitModal
        isOpen={isAddProductModalOpen}
        onClose={() => setIsAddProductModalOpen(false)}
        onAdd={handleAddProduct}
        currentItems={kitItems}
      />

      {editingProduct && (
        <EditProductInKitModal
          isOpen={true}
          onClose={() => setEditingProduct(null)}
          product={editingProduct}
          kitId={kit.id}
          onProductUpdated={handleProductUpdate}
          onUpdate={onUpdate}
        />
      )}
    </>
  );
}
