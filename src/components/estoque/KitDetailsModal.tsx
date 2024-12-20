import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";
import { useState, useEffect, useMemo } from "react"
import { supabase } from "@/integrations/supabase/client"
import { Input } from "@/components/ui/input"
import { Kit, KitItem, ProdutoKit } from "@/types/produto"
import { useToast } from "@/components/ui/use-toast"
import { Label } from "@/components/ui/label"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import AddProductToKitModal from "./AddProductToKitModal"
import EditProductInKitModal from "./EditProductInKitModal"
import { showToast } from "../ui/custom-toast"

interface KitDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  kit: {
    id: string;
    nome: string;
    preco_venda: number;
    items: {
      id: string;
      product: {
        id: string;
        nome: string;
        preco_venda: number;
      };
      quantidade: number;
    }[];
  };
  onUpdate?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function KitDetailsModal({ isOpen, onClose, kit, onUpdate, onEdit, onDelete }: KitDetailsModalProps) {
  if (!kit) return null;

  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(kit.nome);
  const [editedPrice, setEditedPrice] = useState(kit.preco_venda);
  const [isSaving, setIsSaving] = useState(false);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const totalValue = useMemo(() => {
    return kit.items.reduce((total, item) => total + (item.product.preco_venda * item.quantidade), 0);
  }, [kit.items]);

  const marginValue = useMemo(() => {
    const margin = ((kit.preco_venda - totalValue) / totalValue) * 100;
    return isFinite(margin) ? margin : 0;
  }, [kit.preco_venda, totalValue]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Atualizar o kit na tabela produtos
      const { error: updateError } = await supabase
        .from('produtos')
        .update({
          nome: editedName,
          preco_venda: editedPrice
        })
        .eq('id', kit.id);

      if (updateError) throw updateError;

      showToast({
        title: "Sucesso!",
        description: "Kit atualizado com sucesso",
        variant: "success",
      });

      setIsEditing(false);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error updating kit:', error);
      showToast({
        title: "Erro!",
        description: "Erro ao atualizar o kit",
        variant: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-6 max-w-4xl">
        <DialogHeader className="mb-6">
          <DialogTitle>Detalhes do Kit</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <Label>Nome do Kit</Label>
              <Input
                type="text"
                value={isEditing ? editedName : kit.nome}
                onChange={(e) => setEditedName(e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-4">
              <Label>Preço de Venda</Label>
              <Input
                type="number"
                value={isEditing ? editedPrice : kit.preco_venda}
                onChange={(e) => setEditedPrice(Number(e.target.value))}
                disabled={!isEditing}
                step="0.01"
              />
            </div>
          </div>

          <div className="flex justify-between items-center mt-8 mb-4">
            <h3 className="text-lg font-medium">Produtos no Kit</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAddProductModalOpen(true)}
            >
              Incluir Produto
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[30%]">Produto</TableHead>
                  <TableHead className="text-right w-[20%]">Vlr Unit.</TableHead>
                  <TableHead className="text-center w-[15%]">Quantidade</TableHead>
                  <TableHead className="text-right w-[20%]">Total</TableHead>
                  <TableHead className="text-right w-[15%]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {kit.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.product.nome}</TableCell>
                    <TableCell className="text-right">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(item.product.preco_venda)}
                    </TableCell>
                    <TableCell className="text-center">{item.quantidade}</TableCell>
                    <TableCell className="text-right">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(item.product.preco_venda * item.quantidade)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedProduct(item);
                            setIsEditProductModalOpen(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Remover Produto</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja remover este produto do kit?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                variant="destructive"
                                onClick={async () => {
                                  try {
                                    const { error } = await supabase
                                      .from('produtos_kit')
                                      .delete()
                                      .eq('id', item.id);

                                    if (error) throw error;

                                    showToast({
                                      title: "Sucesso!",
                                      description: "Produto removido do kit",
                                      variant: "success",
                                    });

                                    if (onUpdate) onUpdate();
                                  } catch (error) {
                                    console.error('Erro ao remover produto do kit:', error);
                                    showToast({
                                      title: "Erro!",
                                      description: "Erro ao remover produto do kit",
                                      variant: "error",
                                    });
                                  }
                                }}
                              >
                                Remover
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

          <div className="flex justify-end items-center mt-4">
            <div className="grid grid-cols-3 gap-8 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Vlr Total:</span>
                <span className="font-semibold">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(totalValue)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Vlr Venda:</span>
                <span className="font-semibold">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(kit.preco_venda)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Margem:</span>
                <span className="font-semibold">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'percent',
                    maximumFractionDigits: 2
                  }).format(marginValue / 100)}
                </span>
              </div>
            </div>
          </div>

        </div>

        <DialogFooter className="mt-6">
          <div className="flex justify-end gap-2 w-full">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="mr-auto"
                >
                  Excluir Kit
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Excluir Kit</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja excluir este kit?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    variant="destructive"
                    onClick={async () => {
                      try {
                        // Primeiro excluir todos os produtos do kit
                        const { error: deleteProductsError } = await supabase
                          .from('produtos_kit')
                          .delete()
                          .eq('kit_id', kit.id);

                        if (deleteProductsError) throw deleteProductsError;

                        // Depois excluir o kit
                        const { error: deleteKitError } = await supabase
                          .from('produtos')
                          .delete()
                          .eq('id', kit.id);

                        if (deleteKitError) throw deleteKitError;

                        showToast({
                          title: "Sucesso!",
                          description: "Kit excluído com sucesso",
                          variant: "success",
                        });

                        if (onDelete) onDelete();
                        onClose();
                      } catch (error) {
                        console.error('Erro ao excluir kit:', error);
                        showToast({
                          title: "Erro!",
                          description: "Erro ao excluir o kit",
                          variant: "error",
                        });
                      }
                    }}
                  >
                    Excluir
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button variant="outline" onClick={onClose}>
              {isEditing ? "Cancelar" : "Fechar"}
            </Button>
            {isEditing ? (
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Salvando..." : "Salvar"}
              </Button>
            ) : (
              <Button onClick={() => setIsEditing(true)}>Editar</Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>

      <AddProductToKitModal
        isOpen={isAddProductModalOpen}
        onClose={() => setIsAddProductModalOpen(false)}
        onAdd={async (newItem) => {
          try {
            const { error } = await supabase
              .from('produtos_kit')
              .insert({
                kit_id: kit.id,
                produto_id: newItem.product.id,
                quantidade: newItem.quantidade
              });

            if (error) throw error;

            showToast({
              title: "Sucesso!",
              description: "Produto adicionado ao kit",
              variant: "success",
            });

            if (onUpdate) onUpdate();
          } catch (error) {
            console.error('Error adding product to kit:', error);
            showToast({
              title: "Erro!",
              description: "Erro ao adicionar produto ao kit",
              variant: "error",
            });
          }
        }}
        currentItems={kit.items}
      />

      {selectedProduct && (
        <EditProductInKitModal
          isOpen={isEditProductModalOpen}
          onClose={() => {
            setIsEditProductModalOpen(false);
            setSelectedProduct(null);
          }}
          product={selectedProduct}
          kitId={kit.id}
          onUpdate={onUpdate}
          onProductUpdated={() => {
            if (onUpdate) onUpdate();
          }}
        />
      )}
    </Dialog>
  );
}
