import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
import { Package2, PackagePlus, ImageIcon, Plus, Search, PlusCircle } from "lucide-react";
import NewProductModal from '@/components/estoque/NewProductModal';
import KitDetailsModal from '@/components/estoque/KitDetailsModal';
import NewKitModal from '@/components/estoque/NewKitModal';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { EstoqueItem, useEstoque } from '@/hooks/useEstoque';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useProducts } from '@/hooks/useProducts';
import { useKitDetails } from '@/hooks/useKitDetails';
import { useKits, Kit } from '@/hooks/useKits';

interface Product extends EstoqueItem {
  nome?: string;
}

interface KitDetails {
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
}

export default function Estoque() {
  const { items, loading: itemsLoading, fetchItems } = useEstoque();
  const { kits, loading: kitsLoading, fetchKits } = useKits();
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isKitModalOpen, setIsKitModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [kitSearchTerm, setKitSearchTerm] = useState('');
  const { toast } = useToast();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedKit, setSelectedKit] = useState<KitDetails | null>(null);
  const [isKitDetailsModalOpen, setIsKitDetailsModalOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState('produtos');
  const { getProductById } = useProducts();
  const { getKitDetails } = useKitDetails();

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  useEffect(() => {
    if (selectedTab === 'kits') {
      fetchKits();
    }
  }, [selectedTab, fetchKits]);

  const filteredItems = useMemo(() => {
    if (itemsLoading) return [];
    return items.filter(item => {
      if (!item) return false;
      const itemName = item.nome || '';
      return itemName.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [items, searchTerm, itemsLoading]);

  const filteredKits = useMemo(() => {
    if (kitsLoading) return [];
    return kits.filter(kit => 
      kitSearchTerm 
        ? kit.nome_kit.toLowerCase().includes(kitSearchTerm.toLowerCase())
        : true
    );
  }, [kits, kitSearchTerm, kitsLoading]);

  const handleNewProduct = useCallback(() => {
    setSelectedProduct(null);
    setIsProductModalOpen(true);
  }, []);

  const handleNewKit = useCallback(() => {
    setIsKitModalOpen(true);
  }, []);

  const handleKitClick = useCallback(async (kit: Kit) => {
    try {
      if (!kit.kit_id) {
        toast({
          title: "Erro ao carregar detalhes",
          description: "ID do kit não encontrado",
          variant: "destructive"
        });
        return;
      }

      const kitDetails = await getKitDetails(kit.kit_id.toString());
      if (!kitDetails) {
        toast({
          title: "Erro ao carregar detalhes",
          description: "Não foi possível carregar os detalhes do kit",
          variant: "destructive"
        });
        return;
      }
      setSelectedKit(kitDetails);
      setIsKitDetailsModalOpen(true);
    } catch (error) {
      console.error('Error loading kit details:', error);
      toast({
        title: "Erro ao carregar detalhes",
        description: "Não foi possível carregar os detalhes do kit",
        variant: "destructive"
      });
    }
  }, [getKitDetails, toast]);

  const handleProductClick = useCallback((product: Product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  }, []);

  const handleEditKit = useCallback(() => {
    fetchKits();
    setIsKitDetailsModalOpen(false);
    setSelectedKit(null);
  }, [fetchKits]);

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">
            Estoque
          </h2>
          <p className="text-sm text-muted-foreground">
            Gerencie seus produtos e kits em estoque
          </p>
        </div>
      </div>

      <Tabs defaultValue="produtos" className="w-full" value={selectedTab} onValueChange={setSelectedTab}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <TabsList className="h-10 bg-muted/50 dark:bg-muted/80">
              <TabsTrigger 
                value="produtos"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Produtos
              </TabsTrigger>
              <TabsTrigger 
                value="kits"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Kits
              </TabsTrigger>
            </TabsList>

            <div className="flex gap-2 items-center flex-1 max-w-md">
              <Input
                placeholder={`Buscar ${selectedTab === 'produtos' ? 'produtos' : 'kits'}...`}
                value={selectedTab === 'produtos' ? searchTerm : kitSearchTerm}
                onChange={(e) => selectedTab === 'produtos' 
                  ? setSearchTerm(e.target.value)
                  : setKitSearchTerm(e.target.value)
                }
                className="w-full"
              />
              <Button variant="outline" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Button 
            onClick={selectedTab === 'produtos' ? handleNewProduct : handleNewKit}
            className="bg-primary hover:bg-primary/90"
          >
            <PlusCircle className="mr-2 h-5 w-5" />
            {selectedTab === 'produtos' ? 'Novo Produto' : 'Novo Kit'}
          </Button>
        </div>

        <TabsContent value="produtos" className="mt-6">
          <div className="rounded-md border">
            <ProductTable 
              items={filteredItems} 
              loading={itemsLoading}
              handleProductClick={handleProductClick}
            />
          </div>
        </TabsContent>

        <TabsContent value="kits" className="mt-6">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome do Kit</TableHead>
                  <TableHead className="text-right">Preço Venda</TableHead>
                  <TableHead className="text-right">Preço Total</TableHead>
                  <TableHead className="text-right">Margem Lucro</TableHead>
                  <TableHead className="text-center">Qtd. Itens</TableHead>
                  <TableHead className="text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {kitsLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      Carregando kits...
                    </TableCell>
                  </TableRow>
                ) : filteredKits.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      Nenhum kit encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredKits.map((kit) => (
                    <TableRow key={kit.id}>
                      <TableCell>{kit.nome_kit}</TableCell>
                      <TableCell className="text-right">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(kit.preco_venda_kit)}
                      </TableCell>
                      <TableCell className="text-right">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(kit.preco_total_kit)}
                      </TableCell>
                      <TableCell className="text-right">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'percent',
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        }).format(kit.margem_lucro_kit / 100)}
                      </TableCell>
                      <TableCell className="text-center">
                        {kit.quantidade_itens_kit}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleKitClick(kit)}
                        >
                          Ver Detalhes
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      <NewProductModal
        open={isProductModalOpen}
        onOpenChange={setIsProductModalOpen}
        product={selectedProduct}
        onSuccess={() => {
          setIsProductModalOpen(false);
          toast({
            title: selectedProduct ? "Dados atualizados" : "Produto cadastrado",
            description: selectedProduct
              ? "Os dados foram atualizados com sucesso."
              : "O produto foi cadastrado com sucesso.",
          });
          fetchItems();
        }}
      />

      <NewKitModal
        open={isKitModalOpen}
        onOpenChange={setIsKitModalOpen}
        onSuccess={() => {
          setIsKitModalOpen(false);
          toast({
            title: "Kit cadastrado",
            description: "O kit foi cadastrado com sucesso.",
          });
          fetchKits();
        }}
      />

      {selectedKit && (
        <KitDetailsModal
          isOpen={isKitDetailsModalOpen}
          onClose={() => {
            setIsKitDetailsModalOpen(false);
            setSelectedKit(null);
          }}
          kit={selectedKit}
          onEdit={() => {
            setIsKitModalOpen(true);
            setIsKitDetailsModalOpen(false);
          }}
          onDelete={() => {
            // Implementaremos a lógica de exclusão depois
            console.log('Excluir kit:', selectedKit.id);
          }}
          onUpdate={() => {
            fetchKits();
            setIsKitDetailsModalOpen(false);
            setSelectedKit(null);
          }}
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
