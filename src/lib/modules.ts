
import React from 'react';
import { 
  Fingerprint, 
  Phone, 
  User, 
  Car, 
  CreditCard, 
  Home, 
  Building, 
  CircleDollarSign, 
  Vote, 
  Mail, 
  Shield, 
  Briefcase, 
  HeartPulse, 
  CheckCircle, 
  FileText, 
  Key, 
  Wrench, 
  ShieldCheck, 
  Coins, 
  CalendarDays,
  HandCoins,
  Receipt,
  ScanSearch,
} from 'lucide-react';


// A single, executable query module
export interface QueryModule {
  id: string; // e.g., 'cpf-1'
  modulo: string; // e.g., 'cpf'
  descricao: string;
  formato: string;
}

// A group of related query modules
export interface ModuleGroup {
  id: string; // e.g., 'group-cpf'
  label: string; // e.g., 'CPF'
  descricao: string; // e.g., 'Consultas relacionadas a CPF'
  icon: string; // a key for the icon map
  subModules: QueryModule[];
}

export const moduleGroups: ModuleGroup[] = [
  // NOME
  {
    id: 'group-nome',
    label: 'Nome',
    descricao: 'Consultas por nome completo ou parcial',
    icon: 'nome',
    subModules: [
      { id: "nome-1", modulo: "nome", descricao: "Consulta de nome básica", formato: "nome Fulano de Tal" },
      { id: "nome-2", modulo: "nome2", descricao: "Consulta de nome com mais detalhes", formato: "nome2 Fulano de Tal" },
      { id: "nome-3", modulo: "nome3", descricao: "Consulta de nome complementar", formato: "nome3 Fulano de Tal" },
      { id: "nome-4", modulo: "nome4", descricao: "Consulta de nome completa", formato: "nome4 Fulano de Tal" },
      { id: "nome-5", modulo: "nome5", descricao: "Consulta de nome alternativa 1", formato: "nome5 Fulano de Tal" },
      { id: "nome-6", modulo: "nome6", descricao: "Consulta de nome alternativa 2", formato: "nome6 Fulano de Tal" },
    ]
  },
  // CPF
  {
    id: 'group-cpf',
    label: 'CPF',
    descricao: 'Consultas por Cadastro de Pessoa Física',
    icon: 'cpf',
    subModules: [
      { id: "cpf-1", modulo: "cpf", descricao: "Consulta de CPF básica", formato: "cpf 12345678901" },
      { id: "cpf-2", modulo: "cpf2", descricao: "Consulta de CPF com mais detalhes", formato: "cpf2 12345678901" },
      { id: "cpf-3", modulo: "cpf3", descricao: "Consulta de CPF complementar", formato: "cpf3 12345678901" },
      { id: "cpf-4", modulo: "cpf4", descricao: "Consulta de CPF completa", formato: "cpf4 12345678901" },
    ]
  },
  // TELEFONE
  {
    id: 'group-telefone',
    label: 'Telefone',
    descricao: 'Consultas por número de telefone fixo ou móvel',
    icon: 'telefone',
    subModules: [
      { id: "tel-1", modulo: "telefone", descricao: "Consulta de telefone celular", formato: "telefone 11987654321" },
      { id: "tel-2", modulo: "telefone2", descricao: "Consulta de celular alternativa", formato: "telefone2 11987654321" },
      { id: "tel-3", modulo: "telefonefixo", descricao: "Consulta de telefone fixo", formato: "telefonefixo 1133334444" },
    ]
  },
  // VEICULAR
  {
    id: 'group-veicular',
    label: 'Veicular',
    descricao: 'Consultas por Placa, Chassi ou Motor',
    icon: 'placa',
    subModules: [
      { id: "veic-1", modulo: "placa", descricao: "Consulta de placa básica", formato: "placa ABC1234" },
      { id: "veic-2", modulo: "placa2", descricao: "Consulta de placa com mais detalhes", formato: "placa2 ABC1234" },
      { id: "veic-3", modulo: "placa3", descricao: "Consulta de placa complementar", formato: "placa3 ABC1234" },
      { id: "veic-4", modulo: "placa4", descricao: "Consulta de placa completa", formato: "placa4 ABC1234" },
      { id: "veic-5", modulo: "chassi", descricao: "Consulta por chassi", formato: "chassi 9BWZZZ377VT004251" },
      { id: "veic-6", modulo: "motor", descricao: "Consulta por número de motor", formato: "motor QFJA88161304" },
    ]
  },
  // EMPRESARIAL
  {
    id: 'group-empresarial',
    label: 'Empresarial',
    descricao: 'Consultas por CNPJ ou de funcionários',
    icon: 'cnpj',
    subModules: [
       { id: "emp-1", modulo: "cnpj", descricao: "Consulta de CNPJ", formato: "cnpj 12345678000190" },
       { id: "emp-2", modulo: "funcionarios", descricao: "Consulta de funcionários por CNPJ", formato: "funcionarios 12345678000190" },
    ]
  },
  // FINANCEIRO
  {
    id: 'group-financeiro',
    label: 'Financeiro',
    descricao: 'Consultas de dados financeiros e de crédito',
    icon: 'score',
    subModules: [
      { id: "fin-1", modulo: "score", descricao: "Consulta de score de crédito", formato: "score 12345678901" },
      { id: "fin-2", modulo: "bin", descricao: "Consulta de BIN de cartão", formato: "bin 123456" },
      { id: "fin-3", modulo: "beneficios", descricao: "Consulta de benefícios sociais", formato: "beneficios 12345678901" },
      { id: "fin-4", modulo: "impostos", descricao: "Consulta de impostos", formato: "impostos 12345678901" },
      { id: "fin-5", modulo: "pix", descricao: "Consulta de chaves PIX", formato: "pix Chave" },
      { id: "fin-6", modulo: "radar", descricao: "Consulta de radar (financeiro)", formato: "radar 12345678901" }
    ]
  },
   // DADOS PESSOAIS
  {
    id: 'group-pessoais',
    label: 'Dados Pessoais',
    descricao: 'Outras consultas de dados pessoais',
    icon: 'vizinhos',
    subModules: [
      { id: "pes-1", modulo: "vizinhos", descricao: "Consulta de vizinhos por CPF", formato: "vizinhos 12356789000" },
      { id: "pes-2", modulo: "titulo", descricao: "Consulta de título eleitoral", formato: "titulo 123456789012" },
      { id: "pes-3", modulo: "email", descricao: "Consulta por e-mail", formato: "email exemplo@dominio.com" },
      { id: "pes-4", modulo: "cnh", descricao: "Consulta de CNH", formato: "cnh 12345678901" },
      { id: "pes-5", modulo: "obito", descricao: "Consulta de óbito", formato: "obito 12345678901" },
      { id: "pes-6", modulo: "vacina", descricao: "Consulta de vacinação", formato: "vacina 12345678901" },
      { id: "pes-7", modulo: "rg", descricao: "Consulta de RG", formato: "rg 123456789" },
      { id: "pes-8", modulo: "senha", descricao: "Consulta de senhas vazadas", formato: "senha email@dominio.com" },
      { id: "pes-9", modulo: "nascimento", descricao: "Consulta por data de nascimento", formato: "nascimento 01/01/2000" },
      { id: "pes-10", modulo: "cns", descricao: "Consulta de Cartão de Saúde", formato: "cns 123456789012345" },
    ]
  },
];


const iconClass = "h-8 w-8";

const iconMap: { [key: string]: React.FC<React.SVGProps<SVGSVGElement>> } = {
  cpf: Fingerprint,
  telefone: Phone,
  nome: User,
  placa: Car,
  bin: CreditCard,
  vizinhos: Home,
  cnpj: Building,
  score: CircleDollarSign,
  titulo: Vote,
  email: Mail,
  cnh: Shield,
  funcionarios: Briefcase,
  obito: HeartPulse,
  vacina: ShieldCheck,
  rg: FileText,
  senha: Key,
  chassi: ScanSearch,
  motor: Wrench,
  beneficios: HandCoins,
  impostos: Receipt,
  nascimento: CalendarDays,
  pix: Coins,
  cns: CreditCard,
  radar: CircleDollarSign,
  veicular: Car,
  empresarial: Building,
  financeiro: CircleDollarSign,
  pessoais: User,
};
  
export const getIconForModule = (moduleKey: string): React.ReactNode => {
    const IconComponent = iconMap[moduleKey] || FileText;
    return React.createElement(IconComponent, { className: iconClass });
};
