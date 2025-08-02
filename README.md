
<img width="1024" height="1024" alt="Oraculo" src="https://github.com/user-attachments/assets/44a5d65e-161a-4ad8-8f2d-5d2e6da9d2e0" />
# Oráculo: Cyber Data Scanner

Oráculo é uma aplicação web imersiva com tema cyberpunk, projetada para simular um terminal de busca e análise de dados avançado. A interface utiliza uma estética hacker, com efeitos visuais e animações, para criar uma experiência de usuário envolvente e centralizar diversas ferramentas de consulta e comunicação.

O sistema integra-se a uma API externa para realizar consultas de dados, utiliza o Firebase Realtime Database para comunicação em tempo real e emprega Inteligência Artificial (através do Google Gemini) para analisar e apresentar os dados brutos em um formato estilizado e detalhado, mantendo-se fiel à persona de uma poderosa IA de vigilância.

## ✨ Funcionalidades Principais

- **Interface de Terminal Imersiva:** Uma tela de boas-vindas animada e um display de resultados com efeito de "digitação" para simular um terminal real.
- **Autenticação de Operador:** Sistema de login para garantir o acesso apenas a usuários autorizados.
- **Seleção Hierárquica de Módulos:**
    - **Seleção de Ferramentas:** Um menu principal para escolher entre diferentes ferramentas: Consulta de Dados, Chat de Operadores, Interação com a I.A Oráculo e Geolocalização de IP.
    - **Seleção de Módulos:** Uma grade de seleção em dois níveis para a "Consulta de Dados", onde o operador primeiro escolhe uma categoria (CPF, Nome, Veicular, etc.) e depois um submódulo específico.
- **Análise com Inteligência Artificial:** Utiliza o Google Gemini através do Genkit para interpretar os dados brutos da consulta e gerar uma análise detalhada e estilizada, como se fosse uma IA de hacking.
- **Chat de Operadores em Tempo Real:** Um canal de comunicação criptografado e anônimo, construído com Firebase Realtime Database, para que os operadores possam conversar entre si.
- **Interação Direta com a I.A.:** Uma interface de chat dedicada para conversar diretamente com a persona "Oráculo", mantendo o histórico da conversa e utilizando a IA para respostas contextuais.
- **Geolocalização de IP:** Ferramenta para rastrear a localização física aproximada de um endereço de IP.
- **Proxy de API Seguro:** As chamadas para a API de consulta externa são feitas através de um proxy no backend (Next.js API Routes) para proteger as credenciais e contornar restrições de CORS.
- **Estilo Cyberpunk Consistente:** Paleta de cores neon em modo escuro, fontes monoespaçadas e efeitos visuais como "scanlines", "noise" e "glitch" para reforçar a atmosfera futurista.
- **Suporte a Progressive Web App (PWA):** A aplicação pode ser "instalada" em dispositivos móveis e desktops para uma experiência mais próxima a de um aplicativo nativo.
- **Design Responsivo:** A interface se adapta a diferentes tamanhos de tela, de desktops a dispositivos móveis, com layouts otimizados para cada ambiente.

## 🗂️ Módulos de Consulta Disponíveis

A ferramenta "Consulta de Dados" oferece acesso a 37 módulos diferentes, organizados nas seguintes categorias:

-   **Nome**
    -   `nome`: Consulta de nome básica.
    -   `nome2`: Consulta de nome com mais detalhes.
    -   `nome3`: Consulta de nome complementar.
    -   `nome4`: Consulta de nome completa.
    -   `nome5`: Consulta de nome alternativa 1.
    -   `nome6`: Consulta de nome alternativa 2.
-   **CPF**
    -   `cpf`: Consulta de CPF básica.
    -   `cpf2`: Consulta de CPF com mais detalhes.
    -   `cpf3`: Consulta de CPF complementar.
    -   `cpf4`: Consulta de CPF completa.
-   **Telefone**
    -   `telefone`: Consulta de telefone celular.
    -   `telefone2`: Consulta de celular alternativa.
    -   `telefonefixo`: Consulta de telefone fixo.
-   **Veicular**
    -   `placa`: Consulta de placa básica.
    -   `placa2`: Consulta de placa com mais detalhes.
    -   `placa3`: Consulta de placa complementar.
    -   `placa4`: Consulta de placa completa.
    -   `chassi`: Consulta por chassi.
    -   `motor`: Consulta por número de motor.
-   **Empresarial**
    -   `cnpj`: Consulta de CNPJ.
    -   `funcionarios`: Consulta de funcionários por CNPJ.
-   **Financeiro**
    -   `score`: Consulta de score de crédito.
    -   `bin`: Consulta de BIN de cartão.
    -   `beneficios`: Consulta de benefícios sociais.
    -   `impostos`: Consulta de impostos.
    -   `pix`: Consulta de chaves PIX.
    -   `radar`: Consulta de radar (financeiro).
-   **Dados Pessoais**
    -   `vizinhos`: Consulta de vizinhos por CPF.
    -   `titulo`: Consulta de título eleitoral.
    -   `email`: Consulta por e-mail.
    -   `cnh`: Consulta de CNH.
    -   `obito`: Consulta de óbito.
    -   `vacina`: Consulta de vacinação.
    -   `rg`: Consulta de RG.
    -   `senha`: Consulta de senhas vazadas.
    -   `nascimento`: Consulta por data de nascimento.
    -   `cns`: Consulta de Cartão de Saúde.


## 🚀 Tecnologias Utilizadas

- **Frontend:**
  - [Next.js](https://nextjs.org/) (com App Router)
  - [React](https://reactjs.org/)
  - [TypeScript](https://www.typescriptlang.org/)
- **UI & Estilização:**
  - [ShadCN/UI](https://ui.shadcn.com/) para componentes
  - [Tailwind CSS](https://tailwindcss.com/)
  - [Lucide React](https://lucide.dev/) para ícones
- **Inteligência Artificial:**
  - [Genkit](https://firebase.google.com/docs/genkit)
  - [Google Gemini](https://ai.google.dev/)
- **Backend & Real-time:**
  - [Firebase Realtime Database](https://firebase.google.com/docs/database) para o chat.
- **PWA:**
  - [@ducanh2912/next-pwa](https://www.npmjs.com/package/@ducanh2912/next-pwa)
- **Deployment:**
  - Preparado para deploy na [Firebase App Hosting](https://firebase.google.com/docs/hosting) ou outras plataformas que suportam Next.js.

## ⚙️ Configuração e Instalação

Siga os passos abaixo para executar o projeto em seu ambiente de desenvolvimento.

### Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)

### 1. Clone o Repositório

```bash
git clone https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git
cd SEU-REPOSITORIO
```

### 2. Instale as Dependências

```bash
npm install
```

### 3. Configure as Variáveis de Ambiente

Crie um arquivo chamado `.env` na raiz do projeto e adicione as seguintes variáveis. Substitua os valores de exemplo pelas suas credenciais reais.

```env
# Credenciais para a API de consulta externa
API_USER="seu_usuario_api"
API_PASSWORD="sua_senha_api"

# Chave de API para o Google Gemini
# Obtenha sua chave em: https://ai.google.dev/
GEMINI_API_KEY="sua_gemini_api_key"

# Se for usar o Firebase, adicione suas credenciais aqui
# NEXT_PUBLIC_FIREBASE_API_KEY="..."
# NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="..."
# ... etc
```

### 4. Execute o Servidor de Desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:9002`.

## 📂 Estrutura do Projeto

```
.
├── src/
│   ├── app/                # Páginas e rotas da aplicação (App Router)
│   │   ├── api/            # Rotas de API do Next.js (usadas como proxy)
│   │   ├── globals.css     # Estilos globais e variáveis de tema
│   │   └── page.tsx        # Página principal da aplicação
│   ├── ai/                 # Configuração e fluxos do Genkit/Gemini
│   │   ├── flows/          # Lógica dos fluxos de IA
│   │   └── genkit.ts       # Configuração do plugin Genkit
│   ├── components/         # Componentes React reutilizáveis
│   │   ├── oraculo/        # Componentes específicos do tema Oráculo
│   │   └── ui/             # Componentes da biblioteca ShadCN/UI
│   ├── hooks/              # Hooks React customizados
│   └── lib/                # Funções utilitárias e definições (módulos, firebase)
├── public/                 # Arquivos estáticos (ícones, manifest.webmanifest)
├── .env                    # Arquivo para variáveis de ambiente (NÃO VERSIONAR)
├── next.config.ts          # Configuração do Next.js
└── package.json            # Dependências e scripts do projeto
```

## ⚖️ Licença e Termos de Uso

Este projeto é distribuído sob a licença MIT. Veja o arquivo [LICENSE.md](LICENSE.md) para mais detalhes.

Ao utilizar este software, você concorda com nossos [Termos de Uso e Política de Privacidade](TERMS_OF_USE.md).

---
_Criado com dedicação por JosyelBuenos._
