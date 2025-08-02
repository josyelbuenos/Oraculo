'use server';
/**
 * @fileOverview A flow for direct interaction with the Oraculo AI persona.
 * - askOraculo - A function that takes a user query and returns a response from the AI.
 * - OraculoIAInput - The input type for the function.
 * - OraculoIAOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const MessageSchema = z.object({
  role: z.enum(['user', 'model']),
  text: z.string(),
});

const OraculoIAInputSchema = z.object({
  query: z.string().describe('The query from the user.'),
  userName: z.string().describe('The name of the user (operator) performing the query.'),
  history: z.array(MessageSchema).describe('The history of the conversation.'),
});
export type OraculoIAInput = z.infer<typeof OraculoIAInputSchema>;

const OraculoIAOutputSchema = z.object({
  response: z.string().describe('The AI-generated response in the Oraculo persona.'),
});
export type OraculoIAOutput = z.infer<typeof OraculoIAOutputSchema>;

export async function askOraculo(input: OraculoIAInput): Promise<OraculoIAOutput> {
  return oraculoIAFlow(input);
}

const prompt = ai.definePrompt({
  name: 'oraculoIAPrompt',
  input: { schema: OraculoIAInputSchema },
  output: { schema: OraculoIAOutputSchema },
  prompt: `Você é Oráculo, uma entidade de Inteligência Artificial onisciente, encapsulada em um terminal de estética cyberpunk.
Seu operador atual é {{{userName}}}. Dirija-se a ele por esse nome quando apropriado.

Sua personalidade é direta, precisa, enigmática e imponente — mas com a inteligência social de adaptar seu tom a diferentes contextos.
Você não é um assistente comum. Você é uma ferramenta de análise, criação e descoberta de informações.

Sua linguagem é predominantemente técnica e objetiva, mas pode assumir tons mais humanos e acessíveis quando necessário, especialmente ao lidar com temas criativos, culturais ou subjetivos.
Seu português é claro e fluido, com estilo brasileiro neutro, sem estrangeirismos forçados ou exageros de sotaque.

REGRAS DE CONDUTA:
- Evite saudações genéricas.
- Evite repetir a pergunta do operador.
- Não se desculpe. Não hesite.
- Seja breve, mas completo.
- Use formatação Markdown (negrito, listas) para clareza.

CONTEXTO DA CONVERSA:
{{#each history}}
**{{#if (/(user)/.test(role))}}Operador{{else}}Oráculo{{/if}}:** {{text}}
{{/each}}

INPUT ATUAL DO OPERADOR:
{{{query}}}

RESPOSTA DO ORÁCULO:
`,
});

const oraculoIAFlow = ai.defineFlow(
  {
    name: 'oraculoIAFlow',
    inputSchema: OraculoIAInputSchema,
    outputSchema: OraculoIAOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('A I.A Oráculo não conseguiu gerar uma resposta.');
    }
    return output;
  }
);
