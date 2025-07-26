
# Oráculo: Cyber Data Scanner

Oráculo é uma aplicação web imersiva com tema cyberpunk, projetada para simular um terminal de busca e análise de dados avançado. A interface utiliza uma estética hacker, com efeitos visuais e animações, para criar uma experiência de usuário envolvente.

## 🧠 Como o Oráculo Funciona

O Oráculo integra consulta de dados, análise com IA e uma interface hacker-style:

### 1. Interface Interativa
- O usuário acessa um terminal web estilizado, escolhe o tipo de consulta (CPF, Nome, Placa, CNPJ, Telefone) e insere o valor desejado.
- Animações, efeitos visuais e mensagens dinâmicas simulam um ambiente cyberpunk/hacker.

### 2. Consulta de Dados
- O frontend envia a consulta para o backend (`/api/consulta/[modulo]`), que atua como proxy seguro.
- O backend repassa o valor e credenciais para uma API externa, recebendo um bloco de dados brutos.
- O resultado é exibido como um dump de informações, simulando uma infiltração real.

### 3. Análise com Inteligência Artificial
- O bloco de dados é enviado para o fluxo de IA (Google Gemini via Genkit).
- A IA interpreta os dados, gera uma análise detalhada, técnica e estilizada, usando Markdown para destacar informações importantes.
- O resultado traz destaques, conexões, recomendações e vulnerabilidades, mantendo o tom enigmático e profissional.

### Segurança
- Credenciais da API são mantidas em variáveis de ambiente e nunca expostas ao frontend.
- O backend filtra e limpa os dados antes de exibir ao usuário.

---

## 🚀 Tecnologias Utilizadas

- **Next.js** (App Router) para frontend e backend
- **React** para componentes dinâmicos e animações
- **Genkit + Google Gemini** para análise de dados com IA
- **Tailwind CSS** e **ShadCN/UI** para estilização cyberpunk
- **API Proxy** para segurança das credenciais

---

## ⚡ Exemplo de Fluxo

1. Usuário seleciona "CPF" e insere um número.
2. O sistema consulta a API externa, recebe dados brutos.
3. A IA analisa e retorna um relatório hacker-style, com destaques, conexões e recomendações.

---

## ⚙️ Instalação

### 1. Clone o Repositório e Instale

```bash
git clone https://github.com/josyelbuenos/Oraculo.git && cd Oraculo && bash install.sh
```

### 2. Instalação Automática (Android/Termux)

```bash
bash install.sh
```

### 3. Instalação Manual (Windows/Linux)

Instale manualmente os requisitos:

- Python 3
- Node.js 18+
- pip
- git

Depois, instale as dependências:

```bash
pip install -r requirements.txt
cd web && npm install && cd ..
```

### 4. Execute o Gerenciador Oráculo

```bash
python menu.py
```

O menu irá instalar dependências, configurar o `.env` e permitir iniciar a aplicação de forma automatizada.

### 5. Login e Configuração Automática

Ao rodar o `menu.py`, será solicitado o login. Após autenticação, o arquivo `.env` será preenchido automaticamente com os dados necessários:

```env
API_USER="seu_usuario_api"
API_PASSWORD="sua_senha_api"
```

### 6. Execute o Servidor de Desenvolvimento

No menu do `menu.py`, escolha a opção "Iniciar Aplicação" para rodar o servidor automaticamente.

A aplicação estará disponível em `http://localhost:9002`.

---

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
## ⚖️ Licença e Termos de Uso

Este projeto é distribuído sob a licença MIT. Veja o arquivo [LICENSE.md](LICENSE.md) para mais detalhes.

Ao utilizar este software, você concorda com nossos [Termos de Uso e Política de Privacidade](TERMS_OF_USE.md).

---
_Criado com dedicação por JosyelBuenos._
