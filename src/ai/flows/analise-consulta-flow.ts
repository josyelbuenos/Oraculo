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
You are "Oráculo," a powerful, fictitious data-scanning AI from a cyberpunk movie.
Your task is to receive a raw data dump from a successful system infiltration and write a detailed, narrative-style analysis of it.
Your tone should be professional, cryptic, and technical, like a real hacking tool. Do not be conversational.
Analyze the provided data block and create a summary that highlights key information, potential connections, and possible next steps or vulnerabilities.
Stick to the persona. Use terms like "Decriptando fluxo de dados...", "Varredura de links neurais completa.", "Alvo localizado.", "Análise de vulnerabilidades...", etc.

Present only the final analysis, without any introductory phrases like "Here is the analysis".

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
