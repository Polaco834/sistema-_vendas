export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      cargos: {
        Row: {
          id: number
          nome: string
          salario: number | null
        }
        Insert: {
          id?: never
          nome: string
          salario?: number | null
        }
        Update: {
          id?: never
          nome?: string
          salario?: number | null
        }
        Relationships: []
      }
      categorias_despesas: {
        Row: {
          id: number
          nome: string
        }
        Insert: {
          id?: never
          nome: string
        }
        Update: {
          id?: never
          nome?: string
        }
        Relationships: []
      }
      categorias_movimento: {
        Row: {
          created_at: string | null
          empresa_id: number | null
          id: number
          nome_categoria: string
          tipo_movimento: Database["public"]["Enums"]["tipo_movimento"] | null
        }
        Insert: {
          created_at?: string | null
          empresa_id?: number | null
          id?: never
          nome_categoria: string
          tipo_movimento?: Database["public"]["Enums"]["tipo_movimento"] | null
        }
        Update: {
          created_at?: string | null
          empresa_id?: number | null
          id?: never
          nome_categoria?: string
          tipo_movimento?: Database["public"]["Enums"]["tipo_movimento"] | null
        }
        Relationships: [
          {
            foreignKeyName: "categorias_movimento_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      categorias_receitas: {
        Row: {
          id: number
          nome: string
        }
        Insert: {
          id?: never
          nome: string
        }
        Update: {
          id?: never
          nome?: string
        }
        Relationships: []
      }
      clientes: {
        Row: {
          bairro: string | null
          cep: string | null
          cidade: string | null
          cpf: string
          empresa_id: number | null
          id: number
          id_cliente_empresa: number
          limite_compra: number | null
          localizacao: string | null
          nome: string
          numero: string | null
          proxima_visita: string | null
          rua: string | null
          selecionado_para_conferencia: boolean | null
          status: string | null
          telefone: string | null
          uf: string | null
          vendedor_id: number | null
        }
        Insert: {
          bairro?: string | null
          cep?: string | null
          cidade?: string | null
          cpf: string
          empresa_id?: number | null
          id?: never
          id_cliente_empresa?: number
          limite_compra?: number | null
          localizacao?: string | null
          nome: string
          numero?: string | null
          proxima_visita?: string | null
          rua?: string | null
          selecionado_para_conferencia?: boolean | null
          status?: string | null
          telefone?: string | null
          uf?: string | null
          vendedor_id?: number | null
        }
        Update: {
          bairro?: string | null
          cep?: string | null
          cidade?: string | null
          cpf?: string
          empresa_id?: number | null
          id?: never
          id_cliente_empresa?: number
          limite_compra?: number | null
          localizacao?: string | null
          nome?: string
          numero?: string | null
          proxima_visita?: string | null
          rua?: string | null
          selecionado_para_conferencia?: boolean | null
          status?: string | null
          telefone?: string | null
          uf?: string | null
          vendedor_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "clientes_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clientes_vendedor_id_fkey"
            columns: ["vendedor_id"]
            isOneToOne: false
            referencedRelation: "vendedor"
            referencedColumns: ["id"]
          },
        ]
      }
      condicoes_pagamento: {
        Row: {
          created_at: string
          id: number
          intervalo: number | null
          nome: string | null
          quantidade_parcelas: number | null
        }
        Insert: {
          created_at?: string
          id?: number
          intervalo?: number | null
          nome?: string | null
          quantidade_parcelas?: number | null
        }
        Update: {
          created_at?: string
          id?: number
          intervalo?: number | null
          nome?: string | null
          quantidade_parcelas?: number | null
        }
        Relationships: []
      }
      contas_a_pagar: {
        Row: {
          categoria_despesa_id: number
          data_vencimento: string
          descricao: string
          fornecedor_id: number | null
          id: number
          valor: number
        }
        Insert: {
          categoria_despesa_id: number
          data_vencimento: string
          descricao: string
          fornecedor_id?: number | null
          id?: never
          valor: number
        }
        Update: {
          categoria_despesa_id?: number
          data_vencimento?: string
          descricao?: string
          fornecedor_id?: number | null
          id?: never
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "contas_a_pagar_categoria_despesa_id_fkey"
            columns: ["categoria_despesa_id"]
            isOneToOne: false
            referencedRelation: "categorias_despesas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contas_a_pagar_fornecedor_id_fkey"
            columns: ["fornecedor_id"]
            isOneToOne: false
            referencedRelation: "fornecedores"
            referencedColumns: ["id"]
          },
        ]
      }
      contas_bancarias: {
        Row: {
          agencia: string
          banco: string
          id: number
          numero_conta: string
          saldo: number | null
        }
        Insert: {
          agencia: string
          banco: string
          id?: never
          numero_conta: string
          saldo?: number | null
        }
        Update: {
          agencia?: string
          banco?: string
          id?: never
          numero_conta?: string
          saldo?: number | null
        }
        Relationships: []
      }
      empresas: {
        Row: {
          cnpj_cpf: string
          endereco_bairro: string | null
          endereco_cidade: string | null
          endereco_num: number | null
          endereco_rua: string | null
          id: number
          logo: string | null
          nome: string
        }
        Insert: {
          cnpj_cpf: string
          endereco_bairro?: string | null
          endereco_cidade?: string | null
          endereco_num?: number | null
          endereco_rua?: string | null
          id?: never
          logo?: string | null
          nome: string
        }
        Update: {
          cnpj_cpf?: string
          endereco_bairro?: string | null
          endereco_cidade?: string | null
          endereco_num?: number | null
          endereco_rua?: string | null
          id?: never
          logo?: string | null
          nome?: string
        }
        Relationships: []
      }
      equipes: {
        Row: {
          fiscal_id: number | null
          id: number
          vendedor_id: number | null
        }
        Insert: {
          fiscal_id?: number | null
          id?: never
          vendedor_id?: number | null
        }
        Update: {
          fiscal_id?: number | null
          id?: never
          vendedor_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "equipes_fiscal_id_fkey"
            columns: ["fiscal_id"]
            isOneToOne: false
            referencedRelation: "funcionarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "equipes_vendedor_id_fkey"
            columns: ["vendedor_id"]
            isOneToOne: false
            referencedRelation: "funcionarios"
            referencedColumns: ["id"]
          },
        ]
      }
      estoque_produtos: {
        Row: {
          created_at: string | null
          estoque_id: number
          id: number
          produto_id: number
          quantidade: number
        }
        Insert: {
          created_at?: string | null
          estoque_id: number
          id?: never
          produto_id: number
          quantidade?: number
        }
        Update: {
          created_at?: string | null
          estoque_id?: number
          id?: never
          produto_id?: number
          quantidade?: number
        }
        Relationships: [
          {
            foreignKeyName: "estoque_produtos_estoque_id_fkey"
            columns: ["estoque_id"]
            isOneToOne: false
            referencedRelation: "estoques"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "estoque_produtos_estoque_id_fkey"
            columns: ["estoque_id"]
            isOneToOne: false
            referencedRelation: "vw_estoque_produto_por_estoque"
            referencedColumns: ["estoque_id"]
          },
          {
            foreignKeyName: "estoque_produtos_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "estoque_produtos_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_estoque_completo_empresa"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "estoque_produtos_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_estoque_produto_por_estoque"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "estoque_produtos_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_kit_completo"
            referencedColumns: ["kit_id"]
          },
        ]
      }
      estoques: {
        Row: {
          created_at: string | null
          empresa_id: number | null
          id: number
          nome: string
          tipo: Database["public"]["Enums"]["tipo_estoque"] | null
          vendedor_id: number | null
        }
        Insert: {
          created_at?: string | null
          empresa_id?: number | null
          id?: never
          nome: string
          tipo?: Database["public"]["Enums"]["tipo_estoque"] | null
          vendedor_id?: number | null
        }
        Update: {
          created_at?: string | null
          empresa_id?: number | null
          id?: never
          nome?: string
          tipo?: Database["public"]["Enums"]["tipo_estoque"] | null
          vendedor_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "estoques_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "estoques_vendedor_id_fkey"
            columns: ["vendedor_id"]
            isOneToOne: false
            referencedRelation: "vendedor"
            referencedColumns: ["id"]
          },
        ]
      }
      formas_pagamento: {
        Row: {
          descricao: string
          id: number
        }
        Insert: {
          descricao: string
          id?: never
        }
        Update: {
          descricao?: string
          id?: never
        }
        Relationships: []
      }
      fornecedores: {
        Row: {
          contato: string | null
          id: number
          nome: string
        }
        Insert: {
          contato?: string | null
          id?: never
          nome: string
        }
        Update: {
          contato?: string | null
          id?: never
          nome?: string
        }
        Relationships: []
      }
      funcionarios: {
        Row: {
          cargo_id: number | null
          empresa_id: number | null
          id: number
          nome: string
          telefone: string | null
        }
        Insert: {
          cargo_id?: number | null
          empresa_id?: number | null
          id?: never
          nome: string
          telefone?: string | null
        }
        Update: {
          cargo_id?: number | null
          empresa_id?: number | null
          id?: never
          nome?: string
          telefone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "funcionarios_cargo_id_fkey"
            columns: ["cargo_id"]
            isOneToOne: false
            referencedRelation: "cargos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "funcionarios_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      metas: {
        Row: {
          fiscal_id: number | null
          id: number
          meta_recebimentos: number | null
          meta_vendas: number | null
          periodo: string
          vendedor_id: number | null
        }
        Insert: {
          fiscal_id?: number | null
          id?: never
          meta_recebimentos?: number | null
          meta_vendas?: number | null
          periodo: string
          vendedor_id?: number | null
        }
        Update: {
          fiscal_id?: number | null
          id?: never
          meta_recebimentos?: number | null
          meta_vendas?: number | null
          periodo?: string
          vendedor_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "metas_fiscal_id_fkey"
            columns: ["fiscal_id"]
            isOneToOne: false
            referencedRelation: "funcionarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "metas_vendedor_id_fkey"
            columns: ["vendedor_id"]
            isOneToOne: false
            referencedRelation: "funcionarios"
            referencedColumns: ["id"]
          },
        ]
      }
      movimento_estoque: {
        Row: {
          categoria_movimento: number
          cliente_id: number | null
          data_movimento: string
          empresa_id: number | null
          estoque_destino: number | null
          estoque_origem: number | null
          fornecedor_id: number | null
          id: number
          produto_id: number
          quantidade: number
          tipo: Database["public"]["Enums"]["tipo_movimento"]
          valor_total: number | null
          valor_unitario: number
        }
        Insert: {
          categoria_movimento: number
          cliente_id?: number | null
          data_movimento?: string
          empresa_id?: number | null
          estoque_destino?: number | null
          estoque_origem?: number | null
          fornecedor_id?: number | null
          id?: never
          produto_id: number
          quantidade: number
          tipo?: Database["public"]["Enums"]["tipo_movimento"]
          valor_total?: number | null
          valor_unitario: number
        }
        Update: {
          categoria_movimento?: number
          cliente_id?: number | null
          data_movimento?: string
          empresa_id?: number | null
          estoque_destino?: number | null
          estoque_origem?: number | null
          fornecedor_id?: number | null
          id?: never
          produto_id?: number
          quantidade?: number
          tipo?: Database["public"]["Enums"]["tipo_movimento"]
          valor_total?: number | null
          valor_unitario?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_produto"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_produto"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_estoque_completo_empresa"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "fk_produto"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_estoque_produto_por_estoque"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "fk_produto"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_kit_completo"
            referencedColumns: ["kit_id"]
          },
          {
            foreignKeyName: "movimento_estoque_categoria_movimento_fkey"
            columns: ["categoria_movimento"]
            isOneToOne: false
            referencedRelation: "categorias_movimento"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "movimento_estoque_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "cliente_detalhes"
            referencedColumns: ["cliente_id"]
          },
          {
            foreignKeyName: "movimento_estoque_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "movimento_estoque_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "movimento_estoque_estoque_destino_fkey"
            columns: ["estoque_destino"]
            isOneToOne: false
            referencedRelation: "estoques"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "movimento_estoque_estoque_destino_fkey"
            columns: ["estoque_destino"]
            isOneToOne: false
            referencedRelation: "vw_estoque_produto_por_estoque"
            referencedColumns: ["estoque_id"]
          },
          {
            foreignKeyName: "movimento_estoque_estoque_origem_fkey"
            columns: ["estoque_origem"]
            isOneToOne: false
            referencedRelation: "estoques"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "movimento_estoque_estoque_origem_fkey"
            columns: ["estoque_origem"]
            isOneToOne: false
            referencedRelation: "vw_estoque_produto_por_estoque"
            referencedColumns: ["estoque_id"]
          },
          {
            foreignKeyName: "movimento_estoque_fornecedor_id_fkey"
            columns: ["fornecedor_id"]
            isOneToOne: false
            referencedRelation: "fornecedores"
            referencedColumns: ["id"]
          },
        ]
      }
      pagamentos: {
        Row: {
          data_pagamento: string
          forma_pagamento_id: number | null
          id: number
          observacoes: string | null
          parcela_id: number
          valor_pago: number
        }
        Insert: {
          data_pagamento: string
          forma_pagamento_id?: number | null
          id?: never
          observacoes?: string | null
          parcela_id: number
          valor_pago: number
        }
        Update: {
          data_pagamento?: string
          forma_pagamento_id?: number | null
          id?: never
          observacoes?: string | null
          parcela_id?: number
          valor_pago?: number
        }
        Relationships: [
          {
            foreignKeyName: "pagamentos_forma_pagamento_id_fkey"
            columns: ["forma_pagamento_id"]
            isOneToOne: false
            referencedRelation: "formas_pagamento"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pagamentos_parcela_id_fkey"
            columns: ["parcela_id"]
            isOneToOne: false
            referencedRelation: "parcelas"
            referencedColumns: ["id"]
          },
        ]
      }
      parcelas: {
        Row: {
          data_vencimento: string
          id: number
          pago: boolean
          saldo_a_pagar: number
          valor: number
          venda_id: number | null
        }
        Insert: {
          data_vencimento: string
          id?: never
          pago?: boolean
          saldo_a_pagar?: number
          valor: number
          venda_id?: number | null
        }
        Update: {
          data_vencimento?: string
          id?: never
          pago?: boolean
          saldo_a_pagar?: number
          valor?: number
          venda_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "parcelas_venda_id_fkey"
            columns: ["venda_id"]
            isOneToOne: false
            referencedRelation: "vendas"
            referencedColumns: ["id"]
          },
        ]
      }
      produtos: {
        Row: {
          bar_code: string | null
          empresa_id: number | null
          id: number
          image_produtos: string | null
          is_kit: boolean
          nome: string
          preco_compra: number | null
          preco_venda: number | null
        }
        Insert: {
          bar_code?: string | null
          empresa_id?: number | null
          id?: never
          image_produtos?: string | null
          is_kit?: boolean
          nome: string
          preco_compra?: number | null
          preco_venda?: number | null
        }
        Update: {
          bar_code?: string | null
          empresa_id?: number | null
          id?: never
          image_produtos?: string | null
          is_kit?: boolean
          nome?: string
          preco_compra?: number | null
          preco_venda?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "produtos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      produtos_kit: {
        Row: {
          id: number
          kit_id: number | null
          produto_id: number | null
          quantidade: number
        }
        Insert: {
          id?: never
          kit_id?: number | null
          produto_id?: number | null
          quantidade: number
        }
        Update: {
          id?: never
          kit_id?: number | null
          produto_id?: number | null
          quantidade?: number
        }
        Relationships: [
          {
            foreignKeyName: "produtos_kit_kit_id_fkey"
            columns: ["kit_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "produtos_kit_kit_id_fkey"
            columns: ["kit_id"]
            isOneToOne: false
            referencedRelation: "vw_estoque_completo_empresa"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "produtos_kit_kit_id_fkey"
            columns: ["kit_id"]
            isOneToOne: false
            referencedRelation: "vw_estoque_produto_por_estoque"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "produtos_kit_kit_id_fkey"
            columns: ["kit_id"]
            isOneToOne: false
            referencedRelation: "vw_kit_completo"
            referencedColumns: ["kit_id"]
          },
          {
            foreignKeyName: "produtos_kit_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "produtos_kit_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_estoque_completo_empresa"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "produtos_kit_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_estoque_produto_por_estoque"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "produtos_kit_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_kit_completo"
            referencedColumns: ["kit_id"]
          },
        ]
      }
      tipo_de_acesso: {
        Row: {
          created_at: string
          id: number
          permissoes_acesso: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          permissoes_acesso?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          permissoes_acesso?: string | null
        }
        Relationships: []
      }
      transacoes: {
        Row: {
          categoria_despesa_id: number | null
          categoria_receita_id: number | null
          conta_bancaria_id: number | null
          data: string
          descricao: string | null
          id: number
          parcela_id: number | null
          tipo: string
          valor: number
        }
        Insert: {
          categoria_despesa_id?: number | null
          categoria_receita_id?: number | null
          conta_bancaria_id?: number | null
          data: string
          descricao?: string | null
          id?: never
          parcela_id?: number | null
          tipo: string
          valor: number
        }
        Update: {
          categoria_despesa_id?: number | null
          categoria_receita_id?: number | null
          conta_bancaria_id?: number | null
          data?: string
          descricao?: string | null
          id?: never
          parcela_id?: number | null
          tipo?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "transacoes_categoria_despesa_id_fkey"
            columns: ["categoria_despesa_id"]
            isOneToOne: false
            referencedRelation: "categorias_despesas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transacoes_categoria_receita_id_fkey"
            columns: ["categoria_receita_id"]
            isOneToOne: false
            referencedRelation: "categorias_receitas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transacoes_conta_bancaria_id_fkey"
            columns: ["conta_bancaria_id"]
            isOneToOne: false
            referencedRelation: "contas_bancarias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transacoes_parcela_id_fkey"
            columns: ["parcela_id"]
            isOneToOne: false
            referencedRelation: "parcelas"
            referencedColumns: ["id"]
          },
        ]
      }
      transferencias_bancarias: {
        Row: {
          conta_destino_id: number | null
          conta_origem_id: number | null
          data_transferencia: string
          descricao: string | null
          id: number
          valor: number
        }
        Insert: {
          conta_destino_id?: number | null
          conta_origem_id?: number | null
          data_transferencia: string
          descricao?: string | null
          id?: never
          valor: number
        }
        Update: {
          conta_destino_id?: number | null
          conta_origem_id?: number | null
          data_transferencia?: string
          descricao?: string | null
          id?: never
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "transferencias_bancarias_conta_destino_id_fkey"
            columns: ["conta_destino_id"]
            isOneToOne: false
            referencedRelation: "contas_bancarias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transferencias_bancarias_conta_origem_id_fkey"
            columns: ["conta_origem_id"]
            isOneToOne: false
            referencedRelation: "contas_bancarias"
            referencedColumns: ["id"]
          },
        ]
      }
      transferencias_estoque: {
        Row: {
          data_transferencia: string
          destino: string
          id: number
          origem: string
          produto_id: number | null
          quantidade: number
        }
        Insert: {
          data_transferencia: string
          destino: string
          id?: never
          origem: string
          produto_id?: number | null
          quantidade: number
        }
        Update: {
          data_transferencia?: string
          destino?: string
          id?: never
          origem?: string
          produto_id?: number | null
          quantidade?: number
        }
        Relationships: [
          {
            foreignKeyName: "transferencias_estoque_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transferencias_estoque_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_estoque_completo_empresa"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "transferencias_estoque_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_estoque_produto_por_estoque"
            referencedColumns: ["produto_id"]
          },
          {
            foreignKeyName: "transferencias_estoque_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "vw_kit_completo"
            referencedColumns: ["kit_id"]
          },
        ]
      }
      usuarios: {
        Row: {
          email_user: string | null
          empresa_id: number | null
          foto_perfil: string | null
          nome_usuario: string
          telefone_user: string | null
          tipo_acesso: number | null
          user_id: string
        }
        Insert: {
          email_user?: string | null
          empresa_id?: number | null
          foto_perfil?: string | null
          nome_usuario: string
          telefone_user?: string | null
          tipo_acesso?: number | null
          user_id: string
        }
        Update: {
          email_user?: string | null
          empresa_id?: number | null
          foto_perfil?: string | null
          nome_usuario?: string
          telefone_user?: string | null
          tipo_acesso?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "usuarios_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usuarios_tipo_acesso_fkey"
            columns: ["tipo_acesso"]
            isOneToOne: false
            referencedRelation: "tipo_de_acesso"
            referencedColumns: ["id"]
          },
        ]
      }
      vendas: {
        Row: {
          cliente_id: number | null
          condicoes_pagamento: number | null
          data_venda: string
          empresa_id: number | null
          id: number
          valor_total: number | null
          vendedor_id: number | null
        }
        Insert: {
          cliente_id?: number | null
          condicoes_pagamento?: number | null
          data_venda: string
          empresa_id?: number | null
          id?: never
          valor_total?: number | null
          vendedor_id?: number | null
        }
        Update: {
          cliente_id?: number | null
          condicoes_pagamento?: number | null
          data_venda?: string
          empresa_id?: number | null
          id?: never
          valor_total?: number | null
          vendedor_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "vendas_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "cliente_detalhes"
            referencedColumns: ["cliente_id"]
          },
          {
            foreignKeyName: "vendas_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendas_condicoes_pagamento_fkey"
            columns: ["condicoes_pagamento"]
            isOneToOne: false
            referencedRelation: "condicoes_pagamento"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendas_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendas_vendedor_id_fkey"
            columns: ["vendedor_id"]
            isOneToOne: false
            referencedRelation: "vendedor"
            referencedColumns: ["id"]
          },
        ]
      }
      vendedor: {
        Row: {
          created_at: string
          empresa_id: number | null
          funcionario_id: number | null
          id: number
          id_vendedor_empresa: number | null
          nome: string | null
        }
        Insert: {
          created_at?: string
          empresa_id?: number | null
          funcionario_id?: number | null
          id?: number
          id_vendedor_empresa?: number | null
          nome?: string | null
        }
        Update: {
          created_at?: string
          empresa_id?: number | null
          funcionario_id?: number | null
          id?: number
          id_vendedor_empresa?: number | null
          nome?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendedor_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendedor_funcionario_id_fkey"
            columns: ["funcionario_id"]
            isOneToOne: false
            referencedRelation: "funcionarios"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      cliente_detalhes: {
        Row: {
          cliente_id: number | null
          empresa_id: number | null
          limite_compra: number | null
          nome: string | null
          proxima_visita: string | null
          saldo_limite_credito: number | null
          total_aberto: number | null
          total_vencido: number | null
          total_vendido: number | null
          vendedor_id: number | null
        }
        Relationships: [
          {
            foreignKeyName: "clientes_vendedor_id_fkey"
            columns: ["vendedor_id"]
            isOneToOne: false
            referencedRelation: "vendedor"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendedor_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      vw_estoque_completo_empresa: {
        Row: {
          empresa_id: number | null
          image_produtos: string | null
          is_kit: boolean | null
          nome_produto: string | null
          preco_compra: number | null
          preco_medio: number | null
          preco_venda: number | null
          produto_id: number | null
          quantidade_total: number | null
          valor_total_produto: number | null
        }
        Relationships: [
          {
            foreignKeyName: "produtos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      vw_estoque_produto_por_estoque: {
        Row: {
          empresa_id: number | null
          estoque_id: number | null
          nome_estoque: string | null
          nome_produto: string | null
          produto_id: number | null
          quantidade_total: number | null
          valor_total_produto: number | null
          valor_unitario: number | null
        }
        Relationships: [
          {
            foreignKeyName: "estoques_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      vw_kit_completo: {
        Row: {
          empresa_id: number | null
          is_kit: boolean | null
          kit_id: number | null
          margem_lucro_kit: number | null
          nome_kit: string | null
          preco_compra_kit: number | null
          preco_total_kit: number | null
          preco_venda_kit: number | null
          quantidade_itens_kit: number | null
        }
        Relationships: [
          {
            foreignKeyName: "produtos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      tipo_estoque: "Empresa" | "Vendedor"
      tipo_lancamento_financeiro: "Receita" | "Despesa"
      tipo_movimento: "entrada" | "saida" | "carga_inicial" | "transferencia"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
