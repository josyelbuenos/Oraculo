# Termos de Uso e Política de Privacidade

**Última atualização:** 25 de Julho de 2024

Este documento rege o uso da aplicação "Oráculo: Cyber Data Scanner" (doravante "Software").

## 1. Aceitação dos Termos

Ao acessar, clonar, modificar ou utilizar este Software de qualquer forma, você ("Usuário") concorda em cumprir e estar vinculado a estes Termos de Uso e Política de Privacidade. Se você não concorda com qualquer parte destes termos, você não tem permissão para usar o Software.

## 2. Propósito do Software

Este Software foi desenvolvido com fins estritamente **educacionais e para a criação de um portfólio de desenvolvimento**. Ele foi projetado para simular uma interface de "terminal hacker" e demonstrar habilidades técnicas em:
- Desenvolvimento Frontend com Next.js e React.
- Design de interface e experiência do usuário (UI/UX).
- Integração com APIs de backend.
- Uso de modelos de Inteligência Artificial (Google Gemini) para processamento de dados.

**O Software não foi criado para, e não deve ser usado para, interagir com dados reais, realizar atividades ilegais ou acessar sistemas sem permissão.**

## 3. Uso Proibido e Responsabilidade do Usuário

O Usuário concorda em não utilizar o Software para qualquer finalidade que seja ilegal, maliciosa, ou que viole os direitos de terceiros. Isso inclui, mas não se limita a:
- Tentar acessar, consultar ou distribuir dados pessoais reais ou sensíveis de indivíduos ou empresas.
- Realizar ataques cibernéticos, testes de penetração não autorizados ou qualquer forma de hacking.
- Infringir leis de privacidade de dados, como a LGPD, GDPR, entre outras.

**O Usuário é o único e exclusivo responsável por todas as suas ações e por qualquer consequência que possa surgir do uso deste Software.** Qualquer modificação feita no código original, bem como a forma como o Software é utilizado, é de inteira responsabilidade do Usuário.

## 4. Limitação de Responsabilidade do Criador

O criador e os contribuidores deste projeto (doravante "o Autor") fornecem o Software "COMO ESTÁ", sem qualquer garantia de qualquer tipo, expressa ou implícita.

**Sob nenhuma circunstância o Autor será responsável por qualquer reivindicação, dano, perda ou outra responsabilidade, seja em uma ação de contrato, delito ou de outra forma, decorrente de, fora de, ou em conexão com o Software ou o uso ou outras negociações no Software.**

O Autor condena veementemente qualquer uso deste projeto para fins maliciosos e se isenta de qualquer responsabilidade por tais atos.

## Política de Privacidade

### 1. Coleta de Dados

O Software, em sua forma original, **não coleta, armazena ou transmite quaisquer dados pessoais dos seus usuários finais**. As interações ocorrem localmente no ambiente do Usuário.

### 2. Chaves de API e Credenciais

Para seu funcionamento, o Software requer que o Usuário forneça credenciais (usuário/senha da API externa) e uma chave de API do Google Gemini. Essas informações devem ser armazenadas no arquivo `.env` na máquina do Usuário.
- **Essas credenciais não são transmitidas para o Autor ou para terceiros.**
- A segurança dessas chaves e credenciais no ambiente de produção (se aplicável) é de total responsabilidade do Usuário que realiza o deploy da aplicação.

### 3. Dados de Consulta

Os dados inseridos nos campos de consulta são enviados para uma API proxy interna, que por sua vez os repassa para a API externa e para a API do Google Gemini. Nenhum dado de consulta é armazenado permanentemente pelo Software.

## 5. Modificações nos Termos

O Autor se reserva o direito de modificar estes termos a qualquer momento. Recomenda-se que o Usuário revise esta página periodicamente para estar ciente de quaisquer alterações.
