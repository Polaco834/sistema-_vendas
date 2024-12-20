import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit2, Share2, Bluetooth, CreditCard, MoreHorizontal, Search, Plus, ShoppingCart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const vendas = [
  {
    id: "#2695",
    cliente: "Giseli",
    valor: "R$ 300,00",
    data: "Hoje 17:08",
    produto: "1 Polaco"
  },
  {
    id: "#2694",
    cliente: "Luiz Felipe Graciana Ferreira",
    valor: "R$ 300,00",
    data: "Hoje 17:00",
    produto: "1 Polaco"
  },
  {
    id: "#2693",
    cliente: "Nelson Dantas Vieira",
    valor: "R$ 600,00",
    data: "Hoje 17:00",
    produto: "1 Polaco"
  },
  {
    id: "#2692",
    cliente: "Angela Maria Rangel",
    valor: "R$ 300,00",
    data: "Hoje 16:42",
    produto: "1 Polaco"
  },
  {
    id: "#2691",
    cliente: "Sonia Aparecida Serranos",
    valor: "R$ 300,00",
    data: "Ontem 11:00",
    produto: "1 Polaco"
  }
];

const Vendas = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredVendas = vendas.filter((venda) =>
    venda.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    venda.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    venda.produto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold mb-2">Vendas</h1>
          <p className="text-gray-600 hidden md:block">Gerencie suas vendas e acompanhe o desempenho</p>
        </div>

        {/* Desktop */}
        <div className="hidden md:flex justify-between items-center">
          <div className="relative flex-1 max-w-[60%]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Pesquisar por cliente, ID ou produto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-3">
            <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors inline-flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              <span>Nova Venda</span>
            </button>
            <button className="border border-gray-300 bg-white text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors inline-flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>Novo Orçamento</span>
            </button>
          </div>
        </div>

        {/* Mobile */}
        <div className="flex md:hidden items-start gap-3">
          <div className="relative flex-1">
            <div className="h-[42px]"> {/* Altura igual aos botões */}
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Pesquisar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-full"
              />
            </div>
          </div>
          
          <div className="flex flex-col items-center">
            <button className="bg-primary text-white p-3 h-[42px] w-[42px] rounded-lg hover:bg-primary/90 transition-colors inline-flex items-center justify-center">
              <ShoppingCart className="h-5 w-5" />
            </button>
            <span className="text-xs text-gray-600 mt-1">Venda</span>
          </div>

          <div className="flex flex-col items-center">
            <button className="border border-gray-300 bg-white text-gray-800 p-3 h-[42px] w-[42px] rounded-lg hover:bg-gray-50 transition-colors inline-flex items-center justify-center">
              <Plus className="h-5 w-5" />
            </button>
            <span className="text-xs text-gray-600 mt-1">Orçamento</span>
          </div>
        </div>
      </div>

      <Tabs defaultValue="todos" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="todos">Todos</TabsTrigger>
          <TabsTrigger value="vendas">Vendas</TabsTrigger>
          <TabsTrigger value="orcamentos">Orçamentos</TabsTrigger>
        </TabsList>

        <TabsContent value="todos">
          <div className="space-y-3">
            {filteredVendas.map((venda) => (
              <Card key={venda.id} className="p-4">
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {venda.cliente.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{venda.cliente}</span>
                          <span className="text-sm text-gray-500">{venda.id}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <span>{venda.data}</span>
                          <span>•</span>
                          <span>{venda.produto}</span>
                        </div>
                      </div>
                    </div>
                    <span className="font-semibold text-lg whitespace-nowrap">{venda.valor}</span>
                  </div>

                  <div className="flex items-center justify-between w-full">
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                      <Edit2 className="h-5 w-5 text-gray-500" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                      <Share2 className="h-5 w-5 text-gray-500" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                      <Bluetooth className="h-5 w-5 text-gray-500" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                      <CreditCard className="h-5 w-5 text-gray-500" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                      <MoreHorizontal className="h-5 w-5 text-gray-500" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="vendas">
          <Card className="p-4">
            <p className="text-gray-500">Conteúdo de vendas em desenvolvimento</p>
          </Card>
        </TabsContent>

        <TabsContent value="orcamentos">
          <Card className="p-4">
            <p className="text-gray-500">Conteúdo de orçamentos em desenvolvimento</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Vendas;