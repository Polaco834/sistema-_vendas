import { Client } from '../types/client';

// Dados fictícios para simulação
export const mockClients: Client[] = [
  {
    id: '1',
    nome: 'João Silva',
    cpf: '123.456.789-00',
    status: 'ativo',
    telefone: '(11) 98765-4321',
    saldo: 1500.50
  },
  {
    id: '2',
    nome: 'Maria Santos',
    cpf: '987.654.321-00',
    status: 'inadimplente',
    telefone: '(11) 91234-5678',
    saldo: -500.75
  },
  {
    id: '3',
    nome: 'Pedro Oliveira',
    cpf: '456.789.123-00',
    status: 'ativo',
    telefone: '(11) 94567-8901',
    saldo: 3000.25
  },
  {
    id: '4',
    nome: 'Ana Costa',
    cpf: '789.123.456-00',
    status: 'ativo',
    telefone: '(11) 95678-9012',
    saldo: 750.00
  },
  {
    id: '5',
    nome: 'Carlos Ferreira',
    cpf: '321.654.987-00',
    status: 'inadimplente',
    telefone: '(11) 96789-0123',
    saldo: -1200.30
  }
];
