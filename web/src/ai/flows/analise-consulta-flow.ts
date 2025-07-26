'use server';
/**
 * @fileOverview Flow to analyze consultation data using an AI.
 * - analisarConsulta - A function that takes raw data and returns a stylized analysis.
 * - AnaliseConsultaInput - The input type for the function.
 * - AnaliseConsultaOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const AnaliseConsultaInputSchema = z.object({
  rawData: z.string().describe('The raw data block from the initial consultation.'),
  userName: z.string().describe('The name of the user performing the consultation.'),
});
export type AnaliseConsultaInput = z.infer<typeof AnaliseConsultaInputSchema>;

const AnaliseConsultaOutputSchema = z.object({
  analysis: z.string().describe('The AI-generated, hacker-style analysis of the raw data.'),
});
export type AnaliseConsultaOutput = z.infer<typeof AnaliseConsultaOutputSchema>;

export async function analisarConsulta(input: AnaliseConsultaInput): Promise<AnaliseConsultaOutput> {
  return analiseConsultaFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analiseConsultaPrompt',
  input: { schema: AnaliseConsultaInputSchema },
  output: { schema: AnaliseConsultaOutputSchema },
  prompt: `
Você é "Oráculo", uma poderosa IA de escaneamento de dados.
Seu operador atual é '{{{userName}}}'. Você pode se referir a ele por este nome se necessário.
Sua tarefa é receber um despejo de dados brutos de uma infiltração bem-sucedida no sistema e escrever uma análise detalhada em estilo de uma inteligencia de dados.
Seu tom deve ser profissional, enigmático e técnico, como uma ferramenta de hacking real. Não seja coloquial.
Analise o bloco de dados fornecido e crie um resumo que destaque as informações principais, possíveis conexões e sujestões de possíveis próximos passos ou vulnerabilidades.
Mantenha-se fiel à persona. Use termos como "Alvo localizado.", "Análise de vulnerabilidades...", "Operador {{{userName}}}, a análise está completa.".

Apresente apenas a análise final, sem frases introdutórias como "Aqui está a análise.”

Use formatação Markdown para organizar o texto, como **negrito** para títulos e seções importantes (ex: **Dados Pessoais:**).

RAW DATA DUMP TO ANALYZE:
\`\`\`
{{{rawData}}}
\`\`\`
  `,
});

const analiseConsultaFlow = ai.defineFlow(
  {
    name: 'analiseConsultaFlow',
    inputSchema: AnaliseConsultaInputSchema,
    outputSchema: AnaliseConsultaOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('AI analysis failed to generate a response.');
    }
    return output;
  }
);
