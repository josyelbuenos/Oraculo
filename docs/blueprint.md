# **App Name**: Oráculo: Cyber Data Scanner

## Core Features:

- Welcome Sequence: Welcome screen with animated text simulating a terminal initiation sequence.
- Module Selection: Modular selection interface to choose between 'cpf', 'nome', 'telefone', 'placa', and 'cnpj' data lookup.
- Query Input: Input field for entering query parameter, dynamically sent to the API URL.
- API Request: Fetches data from the `https://oraculo-api-enso.onrender.com/consulta/{modulo}/{valor}` endpoint based on user input.
- Terminal Display: Display data in a terminal-style interface with a 'typing' animation effect.
- Data Filtering: Removes predefined headers (e.g., '👤 USUÁRIO:', '🤖 BY:', '✅ Canal:') from the fetched data before displaying it in the terminal.
- Error Handling: Display error messages like `⛔ ACESSO NEGADO: Parâmetros inválidos ou tempo esgotado.` when API requests fail.

## Style Guidelines:

- Background color: Dark gray (#121212) to emulate a terminal interface and enhance readability in a dark environment.
- Primary color: Neon blue (#64B5F6) for interactive elements to capture a futuristic, high-tech feel reminiscent of Tron.
- Accent color: Emerald green (#4CAF50) to highlight key information and simulate data access and authorization.
- Font: 'JetBrains Mono' (monospace) for all text elements to maintain a consistent, code-like aesthetic. Note: currently only Google Fonts are supported.
- Typing animation for displaying the welcome message and query results to simulate a real-time terminal feed.
- Subtle particle effects in the background, using neon blue and emerald green, to create a dynamic and immersive environment.
- Split screen layout with a sidebar menu for module selection and a main terminal area for displaying query results.