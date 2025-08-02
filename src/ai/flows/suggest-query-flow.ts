'use server';
/**
 * @fileOverview Flow to generate search query suggestions.
 * - suggestQueries - A function that takes a partial query and returns suggestions.
 * - SuggestQueryInput - The input type for the function.
 * - SuggestQueryOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const SuggestQueryInputSchema = z.object({
  query: z.string().describe('The partial query typed by the user.'),
  userName: z.string().describe('The name of the user performing the query.'),
});
export type SuggestQueryInput = z.infer<typeof SuggestQueryInputSchema>;

const SuggestQueryOutputSchema = z.object({
  suggestions: z.array(z.string()).describe('A list of 3 to 5 search query suggestions.'),
});
export type SuggestQueryOutput = z.infer<typeof SuggestQueryOutputSchema>;

export async function suggestQueries(input: SuggestQueryInput): Promise<SuggestQueryOutput> {
  // Return empty array if query is too short
  if (input.query.length < 3) {
    return { suggestions: [] };
  }
  return suggestQueryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestQueryPrompt',
  input: { schema: SuggestQueryInputSchema },
  output: { schema: SuggestQueryOutputSchema },
  prompt: `
Você é o motor de sugestões da I.A Oráculo.
Seu operador, '{{{userName}}}', está digitando uma busca.
Sua tarefa é gerar de 3 a 5 sugestões de busca concisas e relevantes, baseadas no texto parcial fornecido.
O tom deve ser técnico e direto, no estilo de uma ferramenta de hacking ou inteligência.

Exemplos de sugestões para a query "falha de segurança em":
- "falha de segurança em servidores Nginx"
- "exploit para falha de segurança em Apache"
- "relatório de falhas de segurança em sistemas IoT"
- "documentação sobre falhas de segurança em APIs REST"

Texto parcial do operador: "{{{query}}}"

Gere as sugestões.
  `,
});

const suggestQueryFlow = ai.defineFlow(
  {
    name: 'suggestQueryFlow',
    inputSchema: SuggestQueryInputSchema,
    outputSchema: SuggestQueryOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      return { suggestions: [] };
    }
    return output;
  }
);
