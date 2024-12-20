import React, { useState, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Package2, PackagePlus, ImageIcon, Plus, Search } from "lucide-react";
import NewProductModal from '@/components/estoque/NewProductModal';
import KitDetailsModal from '@/components/estoque/KitDetailsModal';
import { useToast } from "@/components/ui/use-toast";
import { EstoqueItem, useEstoque } from '@/hooks/useEstoque';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useProducts } from '@/hooks/useProducts';
import { useKitDetails } from '@/hooks/useKitDetails';

interface Product extends EstoqueItem {
  nome?: string; // Campo adicional para compatibilidade
}

interface KitItem {
  kit_id: number;
  nome_kit: string;
  preco_total_kit: number;
  preco_venda_kit: number;
  margem_lucro_kit: number;
  quantidade_itens_kit: number;
}

export default function Estoque() {
  const { items, loading, fetchItems } = useEstoque();
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedKit, setSelectedKit] = useState<KitItem | null>(null);
  const [isKitDetailsModalOpen, setIsKitDetailsModalOpen] = useState(false);
  const { getProductById } = useProducts();
  const { getKitDetails } = useKitDetails();

  const handleProductClick = async (item: EstoqueItem) => {
    try {
      const productData = await getProductById(item.produto_id);
      if (productData) {
        setSelectedProduct(productData);
        setIsProductModalOpen(true);
      }
    } catch (error) {
      console.error('Error loading product:', error);
      toast({
        title: "Erro ao carregar produto",
        description: "Não foi possível carregar os dados do produto para edição.",
        variant: "destructive",
      });
    }
  };

  // Limpa o produto selecionado quando o modal é fechado
  const handleModalClose = (open: boolean) => {
    if (!open) {
      setSelectedProduct(null);
    }
    setIsProductModalOpen(open);
  };

  // Função para abrir o modal de novo produto
  const handleNewProduct = () => {
    setSelectedProduct(null);
    setIsProductModalOpen(true);
  };

  const handleKitClick = async (kit: KitItem) => {
    try {
      const kitDetails = await getKitDetails(kit.kit_id.toString());
      setSelectedKit({
        ...kit,
        items: kitDetails.items
      });
      setIsKitDetailsModalOpen(true);
    } catch (error) {
      console.error('Error loading kit details:', error);
      toast({
        title: "Erro ao carregar detalhes do kit",
        description: "Não foi possível carregar os itens do kit.",
        variant: "destructive",
      });
    }
  };

  const handleEditKit = () => {
    // Aqui você pode implementar a lógica para editar o kit
    setIsKitDetailsModalOpen(false);
    // Adicione aqui a lógica para abrir o modal de edição
  };

  // Filtra os itens baseado na busca
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      if (!item) return false;
      const itemName = item.nome || '';
      return itemName.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [items, searchTerm]);

  // Efeito para carregar os itens quando mudar a aba
  useEffect(() => {
    if (!loading) {
      fetchItems(false);
    }
  }, [fetchItems, loading]);

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">
              Estoque
            </h2>
            <p className="text-sm text-muted-foreground">
              Gerencie seus produtos e quantidades em estoque
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="rounded-md border">
            <ProductTable 
              items={filteredItems} 
              loading={loading}
              handleProductClick={handleProductClick}
            />
          </div>
        </div>
      </div>

      <NewProductModal
        open={isProductModalOpen}
        onOpenChange={handleModalClose}
        product={selectedProduct}
        onSuccess={() => {
          handleModalClose(false);
          toast({
            title: selectedProduct ? "Dados atualizados" : "Produto cadastrado",
            description: selectedProduct
              ? "Os dados foram atualizados com sucesso."
              : "O produto foi cadastrado com sucesso.",
          });
          fetchItems(false);
        }}
      />

      {selectedKit && (
        <KitDetailsModal
          isOpen={isKitDetailsModalOpen}
          onClose={() => setIsKitDetailsModalOpen(false)}
          kit={{
            id: selectedKit.kit_id.toString(),
            name: selectedKit.nome_kit,
            sale_price: selectedKit.preco_venda_kit,
            items: selectedKit.items || []
          }}
          onEdit={handleEditKit}
        />
      )}
    </div>
  );
}

const ProductTable = ({ 
  items, 
  loading,
  handleProductClick 
}: { 
  items: EstoqueItem[], 
  loading: boolean,
  handleProductClick: (item: EstoqueItem) => void 
}) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Imagem</TableHead>
        <TableHead>Nome do Produto</TableHead>
        <TableHead className="text-right">Preço de Compra</TableHead>
        <TableHead className="text-right">Preço de Venda</TableHead>
        <TableHead className="text-right">Margem Lucro</TableHead>
        <TableHead className="text-right">Preço Médio</TableHead>
        <TableHead className="text-right">Quantidade</TableHead>
        <TableHead className="text-right">Valor Total</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {loading ? (
        <TableRow key="loading">
          <TableCell colSpan={8} className="text-center py-4">
            Carregando...
          </TableCell>
        </TableRow>
      ) : items.length === 0 ? (
        <TableRow key="empty">
          <TableCell colSpan={8} className="text-center py-4">
            Nenhum produto encontrado
          </TableCell>
        </TableRow>
      ) : (
        items.map((item, index) => {
          // O preço médio é igual ao preço de compra
          const precoMedio = item.preco_compra || 0;
          const uniqueKey = item.produto_id || item.id || `product-${index}`;
          
          return (
            <TableRow
              key={uniqueKey}
              className={`cursor-pointer hover:bg-muted/50 ${item.is_kit ? 'bg-muted/5' : ''}`}
              onClick={() => !item.is_kit && handleProductClick(item)}
            >
              <TableCell>
                <Avatar className="h-10 w-10 bg-muted">
                  <AvatarImage 
                    src={item.image_produtos || item.imagem_url} 
                    alt={item.nome || item.nome_produto} 
                    className="object-cover"
                    loading="lazy"
                  />
                  <AvatarFallback className="bg-muted">
                    <ImageIcon className="h-5 w-5 text-muted-foreground" />
                  </AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell className="font-medium">
                {item.nome || item.nome_produto}
              </TableCell>
              <TableCell className="text-right">
                {item.preco_compra?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </TableCell>
              <TableCell className="text-right">
                {item.preco_venda?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </TableCell>
              <TableCell className="text-right">
                {((((item.preco_venda || 0) - (item.preco_compra || 0)) / (item.preco_compra || 1)) * 100).toFixed(2)}%
              </TableCell>
              <TableCell className="text-right">
                {precoMedio.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </TableCell>
              <TableCell className="text-right">
                {item.quantidade_total}
              </TableCell>
              <TableCell className="text-right">
                {item.valor_total_produto?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </TableCell>
            </TableRow>
          );
        })
      )}
    </TableBody>
  </Table>
);
