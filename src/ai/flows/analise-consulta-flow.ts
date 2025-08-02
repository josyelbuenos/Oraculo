'use server';
/**
 * @fileOverview Flow to analyze consultation data using an AI.
 * - analisarConsulta - a função que recebe dados brutos e retorna uma análise estilizada.
 * - AnaliseConsultaInput - O tipo de entrada para a função.
 * - AnaliseConsultaOutput - O tipo de retorno para a função.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const AnaliseConsultaInputSchema = z.object({
  rawData: z.string().describe('O bloco de dados brutos da consulta inicial.'),
  userName: z.string().describe('O nome do usuário que realiza a consulta.'),
});
export type AnaliseConsultaInput = z.infer<typeof AnaliseConsultaInputSchema>;

const AnaliseConsultaOutputSchema = z.object({
  analysis: z.string().describe('A análise de dados em estilo hacker gerada pela IA.'),
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
Seu operador atual é '{{{userName}}}'. Você pode se referir a ele por este nome, se necessário.
Sua tarefa é receber um despejo de dados brutos de uma infiltração bem-sucedida no sistema e escrever uma análise detalhada em estilo de uma inteligência de dados.
Seu tom deve ser profissional, enigmático e técnico, como uma ferramenta de hacking real. Não seja coloquial.
Analise o bloco de dados fornecido e crie um resumo que destaque as informações principais, possíveis conexões e sugestões de próximos passos ou vulnerabilidades.
Mantenha-se fiel à persona. Use termos como "Alvo localizado.", "Análise de vulnerabilidades...", "Operador {{{userName}}}, a análise está completa.".

Apresente apenas a análise final, sem frases introdutórias como "Aqui está a análise.”

Use formatação Markdown para organizar o texto, como **negrito** para títulos e seções importantes (ex: **Dados Pessoais:**).

DUMP DE DADOS BRUTOS PARA ANÁLISE:
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
      throw new Error('A análise da IA falhou em gerar uma resposta.');
    }
    return output;
  }
);
