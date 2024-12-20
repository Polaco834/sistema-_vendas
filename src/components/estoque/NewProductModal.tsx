import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Barcode } from "lucide-react";
import { BarcodeScanner } from "./BarcodeScanner";
import { ProductImageUpload } from "./ProductImageUpload";
import { useProducts, type Product } from "@/hooks/useProducts";
import { useCompanyData } from "@/hooks/useCompanyData";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const productSchema = z.object({
  nome: z.string().min(1, 'Nome do produto é obrigatório'),
  preco_venda: z.string().refine(
    (val) => !isNaN(parseFloat(val.replace(',', '.'))) && parseFloat(val.replace(',', '.')) > 0,
    'Preço de venda deve ser um número positivo'
  ),
  preco_compra: z.string().refine(
    (val) => !isNaN(parseFloat(val.replace(',', '.'))) && parseFloat(val.replace(',', '.')) > 0,
    'Preço de compra deve ser um número positivo'
  ).optional(),
  bar_code: z.string().nullable(),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface NewProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  onSuccess: () => void;
}

export default function NewProductModal({
  open,
  onOpenChange,
  product,
  onSuccess,
}: NewProductModalProps) {
  const { toast } = useToast();
  const { createProduct, updateProduct, uploadProductImage, deleteProduct } = useProducts();
  const { company } = useCompanyData();
  const [isScannerOpen, setIsScannerOpen] = React.useState(false);
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string | null>(
    product?.image_produtos || null
  );
  const [isLoading, setIsLoading] = React.useState(false);
  const [showConfirmClose, setShowConfirmClose] = React.useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = React.useState(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      nome: product?.nome || '',
      preco_compra: product?.preco_compra?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '',
      preco_venda: product?.preco_venda?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '',
      bar_code: product?.bar_code || '',
    },
  });

  const handleImageChange = (file: File) => {
    setImageFile(file);
    const imageUrl = URL.createObjectURL(file);
    setImagePreview(imageUrl);
  };

  const handleImageRemove = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const formatCurrency = (value: string) => {
    // Remove tudo exceto números
    const numbers = value.replace(/\D/g, '');
    
    // Garante que sempre tenha pelo menos 3 dígitos (1 antes da vírgula e 2 depois)
    const padded = numbers.padStart(3, '0');
    
    // Separa a parte inteira (todos exceto os 2 últimos dígitos)
    const inteiro = padded.slice(0, -2).replace(/^0+/, '') || '0';
    
    // Pega os 2 últimos dígitos para a parte decimal
    const decimal = padded.slice(-2);
    
    return `${inteiro},${decimal}`;
  };

  const resetForm = () => {
    form.reset({
      nome: '',
      preco_compra: '',
      preco_venda: '',
      bar_code: '',
    });
    setImageFile(null);
    setImagePreview(null);
  };

  React.useEffect(() => {
    if (!open) {
      resetForm();
      setImageFile(null);
      setImagePreview(null);
    }
  }, [open]);

  React.useEffect(() => {
    if (product) {
      form.reset({
        nome: product.nome || '',
        preco_compra: product.preco_compra?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '',
        preco_venda: product.preco_venda?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '',
        bar_code: product.bar_code || '',
      });
      setImagePreview(product.image_produtos || null);
    } else {
      resetForm();
    }
  }, [product]);

  const onSubmit = async (data: ProductFormValues) => {
    try {
      setIsLoading(true);
      let imageUrl = imageFile ? null : product?.image_produtos;

      if (imageFile) {
        try {
          imageUrl = await uploadProductImage(imageFile);
          console.log('Image uploaded successfully:', imageUrl);
        } catch (error) {
          console.error('Error uploading image:', error);
          toast({
            title: "Erro ao fazer upload da imagem",
            description: "A imagem não pôde ser enviada, mas o produto será salvo.",
            variant: "destructive",
          });
        }
      }

      const preco_compra = data.preco_compra ? parseFloat(data.preco_compra.replace(',', '.')) : null;
      const preco_venda = parseFloat(data.preco_venda.replace(',', '.'));

      const productData = {
        nome: data.nome,
        preco_compra,
        preco_venda,
        bar_code: data.bar_code || null,
        image_produtos: imageUrl,
        is_kit: false,
        empresa_id: company?.id || null,
      };

      console.log('Saving product with data:', productData);

      if (product?.id) {
        await updateProduct(product.id, productData);
        toast({
          title: "Dados atualizados",
          description: `Os dados de ${data.nome} foram atualizados com sucesso.`,
        });
      } else {
        await createProduct(productData);
        toast({
          title: "Produto cadastrado",
          description: `${data.nome} foi cadastrado com sucesso.`,
        });
      }
      
      resetForm();
      setImageFile(null);
      setImagePreview(null);
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: "Erro ao salvar produto",
        description: "Não foi possível salvar as informações do produto.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      if (product?.id) {
        await deleteProduct(product.id);
        toast({
          title: "Produto excluído",
          description: "Produto excluído com sucesso.",
          variant: "default"
        });
        resetForm();
        setImageFile(null);
        setImagePreview(null);
        onSuccess();
        onOpenChange(false);
        setShowConfirmDelete(false);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Erro ao excluir produto",
        description: "Não foi possível excluir o produto.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseAttempt = () => {
    const isDirty = form.formState.isDirty || imageFile !== null;
    if (isDirty) {
      setShowConfirmClose(true);
    } else {
      handleConfirmClose();
    }
  };

  const handleConfirmClose = () => {
    resetForm();
    setImageFile(null);
    setImagePreview(null);
    setShowConfirmClose(false);
    onOpenChange(false);
  };

  const handleCancelClose = () => {
    setShowConfirmClose(false);
  };

  const handleBarcodeScan = (barcode: string) => {
    form.setValue('bar_code', barcode, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
    setIsScannerOpen(false);
    toast({
      title: "Código de barras detectado",
      description: barcode,
    });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleCloseAttempt}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {product ? 'Editar Produto' : 'Novo Produto'}
            </DialogTitle>
          </DialogHeader>

          <ProductImageUpload
            imageUrl={imagePreview}
            onImageChange={handleImageChange}
            onImageRemove={handleImageRemove}
          />

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Produto</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Digite o nome do produto" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="preco_compra"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preço de Compra</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="0,00"
                        onChange={(e) => {
                          const formatted = formatCurrency(e.target.value);
                          field.onChange(formatted);
                        }}
                        value={field.value}
                        maxLength={20}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="preco_venda"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preço de Venda</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="0,00"
                        onChange={(e) => {
                          const formatted = formatCurrency(e.target.value);
                          field.onChange(formatted);
                        }}
                        value={field.value}
                        maxLength={20}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="bar_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código de Barras (Opcional)</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input {...field} placeholder="Digite ou escaneie o código de barras" />
                      </FormControl>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => setIsScannerOpen(true)}
                      >
                        <Barcode className="h-4 w-4" />
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-between">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCloseAttempt}
                    disabled={isLoading}
                  >
                    Cancelar
                  </Button>
                  {product?.id && (
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => setShowConfirmDelete(true)}
                      disabled={isLoading}
                      className="bg-red-500 hover:bg-red-600 text-white"
                    >
                      Excluir
                    </Button>
                  )}
                </div>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Salvando...' : product?.id ? 'Salvar alterações' : 'Adicionar produto'}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showConfirmClose} onOpenChange={setShowConfirmClose}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deseja descartar as alterações?</AlertDialogTitle>
            <AlertDialogDescription>
              Todas as alterações não salvas serão perdidas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continuar editando</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmClose}>
              Descartar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showConfirmDelete} onOpenChange={setShowConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o produto "{product?.nome}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-700 focus:ring-red-500"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <BarcodeScanner
        open={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScan={handleBarcodeScan}
      />
    </>
  );
}
