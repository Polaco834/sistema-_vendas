import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { useProducts } from "@/hooks/useProducts";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const formSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  preco_venda: z.string().min(1, "Preço de venda é obrigatório"),
});

interface NewKitModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function NewKitModal({ open, onOpenChange, onSuccess }: NewKitModalProps) {
  const { products, loading, createKit } = useProducts();
  const [selectedProducts, setSelectedProducts] = React.useState<Set<string>>(new Set());
  const [quantities, setQuantities] = React.useState<Record<string, number>>({});
  const [profitMargin, setProfitMargin] = React.useState('30');
  const [showConfirmClose, setShowConfirmClose] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      preco_venda: "",
    },
  });

  // Calcula o custo total do kit (apenas para exibição)
  const calculateTotalCost = () => {
    return Array.from(selectedProducts).reduce((total, id) => {
      const product = products.find(p => p.id === id);
      if (product && product.preco_compra) {
        return total + (product.preco_compra * (quantities[id] || 1));
      }
      return total;
    }, 0);
  };

  // Calcula o preço sugerido baseado na margem de lucro
  const calculateSuggestedPrice = () => {
    const totalCost = calculateTotalCost();
    const margin = parseFloat(profitMargin) / 100;
    return totalCost * (1 + margin);
  };

  const handleProfitMarginChange = (value: string) => {
    setProfitMargin(value);
    const suggestedPrice = calculateSuggestedPrice();
    form.setValue("preco_venda", suggestedPrice.toFixed(2));
  };

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await createKit({
        nome: values.nome,
        preco_venda: Number(values.preco_venda),
        produtos: Array.from(selectedProducts).map(id => ({
          id,
          quantidade: quantities[id] || 1
        }))
      });

      onSuccess?.();
      form.reset();
      setSelectedProducts(new Set());
      setQuantities({});
    } catch (error) {
      console.error('Error creating kit:', error);
      toast({
        title: "Erro ao criar kit",
        description: "Não foi possível criar o kit. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleProductSelect = (productId: string, checked: boolean) => {
    const newSelected = new Set(selectedProducts);
    if (checked) {
      newSelected.add(productId);
      setQuantities(prev => ({ ...prev, [productId]: 1 }));
    } else {
      newSelected.delete(productId);
      setQuantities(prev => {
        const { [productId]: _, ...rest } = prev;
        return rest;
      });
    }
    setSelectedProducts(newSelected);
  };

  const handleQuantityChange = (productId: string, quantity: number) => {
    if (quantity < 1) quantity = 1;
    setQuantities(prev => ({ ...prev, [productId]: quantity }));
  };

  const handleCloseAttempt = () => {
    const isDirty = form.formState.isDirty || selectedProducts.size > 0;
    if (isDirty) {
      setShowConfirmClose(true);
    } else {
      handleConfirmClose();
    }
  };

  const handleConfirmClose = () => {
    setShowConfirmClose(false);
    form.reset();
    setSelectedProducts(new Set());
    setQuantities({});
    setProfitMargin('30');
    onOpenChange(false);
  };

  const handleCancelClose = () => {
    setShowConfirmClose(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleCloseAttempt}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-6 my-4">
        <DialogHeader>
          <DialogTitle>Criar Novo Kit</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-12 gap-6 items-end">
              <div className="col-span-5">
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Kit</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite o nome do kit" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-3">
                <FormField
                  control={form.control}
                  name="preco_venda"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preço de Venda (R$)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            placeholder="0,00" 
                            {...field} 
                            className="w-full pr-24"
                            onChange={(e) => {
                              const value = e.target.value.replace(',', '.');
                              field.onChange(value);
                              const cost = calculateTotalCost();
                              if (cost > 0 && parseFloat(value) > 0) {
                                const margin = ((parseFloat(value) - cost) / cost) * 100;
                                setProfitMargin(margin.toFixed(0));
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const suggestedPrice = calculateSuggestedPrice();
                              field.onChange(suggestedPrice.toFixed(2));
                            }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-primary"
                          >
                            Sugerir
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-2">
                <Label>Lucro (%)</Label>
                <div className="flex items-center">
                  <Input
                    type="number"
                    value={profitMargin}
                    onChange={(e) => handleProfitMarginChange(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="col-span-2 space-y-1">
                <div className="text-sm text-muted-foreground">
                  <div>Custo: R$ {calculateTotalCost().toFixed(2)}</div>
                  <div>Sugerido: R$ {calculateSuggestedPrice().toFixed(2)}</div>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead className="text-right">Preço de Compra</TableHead>
                    <TableHead className="text-right">Preço de Venda</TableHead>
                    <TableHead className="text-right w-32">Quantidade</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">
                        Carregando produtos...
                      </TableCell>
                    </TableRow>
                  ) : products.filter(p => !p.is_kit).length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">
                        Nenhum produto encontrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    products.filter(p => !p.is_kit).map((product) => {
                      const isSelected = selectedProducts.has(product.id);
                      const quantity = quantities[product.id] || 1;
                      const subtotal = isSelected ? product.preco_compra * quantity : 0;

                      return (
                        <TableRow key={product.id}>
                          <TableCell>
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={(checked) => 
                                handleProductSelect(product.id, checked as boolean)
                              }
                            />
                          </TableCell>
                          <TableCell>{product.nome}</TableCell>
                          <TableCell>R$ {product.preco_compra.toFixed(2)}</TableCell>
                          <TableCell>R$ {product.preco_venda.toFixed(2)}</TableCell>
                          <TableCell>
                            {isSelected && (
                              <Input
                                type="number"
                                min="1"
                                value={quantity}
                                onChange={(e) => 
                                  handleQuantityChange(product.id, parseInt(e.target.value) || 1)
                                }
                                className="w-20"
                              />
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={handleCloseAttempt}>
                Cancelar
              </Button>
              <Button type="submit">
                Criar Kit
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
      {showConfirmClose && (
        <AlertDialog open={showConfirmClose} onOpenChange={setShowConfirmClose}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Deseja fechar o formulário?</AlertDialogTitle>
              <AlertDialogDescription>
                Existem alterações não salvas. Se você fechar agora, todas as alterações serão perdidas.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleCancelClose}>
                Continuar Editando
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmClose}>
                Sim, Fechar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </Dialog>
  );
}
