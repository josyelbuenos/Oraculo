# Oráculo: Cyber Data Scanner

Oráculo é uma aplicação web imersiva com tema cyberpunk, projetada para simular um terminal de busca e análise de dados avançado. A interface utiliza uma estética hacker, com efeitos visuais e animações, para criar uma experiência de usuário envolvente.

O sistema integra-se a uma API externa para realizar consultas e emprega Inteligência Artificial (através do Google Gemini) para analisar e apresentar os dados brutos em um formato estilizado e detalhado, mantendo-se fiel à persona de uma poderosa IA de vigilância de dados.

## ✨ Funcionalidades Principais

- **Interface de Terminal Imersiva:** Uma tela de boas-vindas animada e um display de resultados com efeito de "digitação" para simular um terminal real.
- **Seleção Modular de Consultas:** Interface para selecionar o tipo de consulta desejada (CPF, Nome, Placa, CNPJ, etc.).
- **Análise com Inteligência Artificial:** Utiliza o Google Gemini através do Genkit para interpretar os dados brutos e gerar uma análise detalhada e estilizada, como se fosse uma IA de hacking.
- **Proxy de API Seguro:** As chamadas para a API externa são feitas através de um proxy no backend para proteger as credenciais e contornar restrições de CORS.
- **Estilo Cyberpunk:** Paleta de cores neon, fontes monoespaçadas e efeitos visuais como "scanlines" e "noise" para reforçar a atmosfera futurista.
- **Suporte a Progressive Web App (PWA):** A aplicação pode ser "instalada" em dispositivos móveis e desktops para uma experiência mais próxima a de um aplicativo nativo, com suporte a funcionamento offline.
- **Design Responsivo:** A interface se adapta a diferentes tamanhos de tela, de desktops a dispositivos móveis.

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
- **Deployment:**
  - Preparado para deploy na [Firebase App Hosting](https://firebase.google.com/docs/hosting) ou outras plataformas que suportam Next.js.

## ⚙️ Configuração e Instalação

Siga os passos abaixo para executar o projeto em seu ambiente de desenvolvimento.

### Pré-requisitos

- [Node.js](https://nodejs.org/en/) (versão 18 ou superior)
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
│   └── lib/                # Funções utilitárias
├── public/                 # Arquivos estáticos (ícones, manifest.webmanifest)
├── .env                    # Arquivo para variáveis de ambiente (NÃO VERSIONAR)
├── next.config.ts          # Configuração do Next.js
└── package.json            # Dependências e scripts do projeto
```

## ⚖️ Licença

Este projeto é distribuído sob a licença MIT. Veja o arquivo [LICENSE.md](LICENSE.md) para mais detalhes.

---
_Criado com dedicação por JosyelBuenos._