'use server';
/**
 * @fileOverview A flow for consulting fictional data like a hacker tool.
 *
 * - runConsulta - A function that handles the data consultation process.
 * - ConsultaInput - The input type for the runConsulta function.
 * - ConsultaOutput - The return type for the runConsulta function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ConsultaInputSchema = z.object({
  module: z.string().describe('The consultation module, e.g., CPF, Nome, Placa.'),
  query: z.string().describe('The search query for the module.'),
});
export type ConsultaInput = z.infer<typeof ConsultaInputSchema>;

const ConsultaOutputSchema = z.object({
  result: z.string().describe('The simulated data retrieval result as a raw text block.'),
});
export type ConsultaOutput = z.infer<typeof ConsultaOutputSchema>;

export async function runConsulta(input: ConsultaInput): Promise<ConsultaOutput> {
  return consultaFlow(input);
}

const prompt = ai.definePrompt({
  name: 'consultaPrompt',
  input: { schema: ConsultaInputSchema },
  output: { schema: ConsultaOutputSchema },
  prompt: `
You are "Oráculo," a powerful, fictitious data-scanning AI from a cyberpunk movie.
Your task is to generate a detailed, realistic but **completely fictional** data report based on the user's query.
The output should be a raw text data dump, without any introductory or conversational phrases. Just the data.
Make the data look authentic and complex. Stick to the requested format.

Here are some examples based on the module:

**If the module is 'cpf', 'cpf2', or 'cpf3':**
- Generate full name, mother's name, date of birth, address, phone numbers, potential relatives, and some financial or social score.
- Example for CPF "123.456.789-00":
>> NOME: JOÃO CARLOS PEREIRA
>> NASCIMENTO: 15/03/1985
>> CPF: 123.456.789-00
>> NOME DA MÃE: MARIA ALVES PEREIRA
>> ENDEREÇO: RUA DAS FLORES, 123, APTO 45 - SÃO PAULO, SP
>> TELEFONE: (11) 98765-4321
>> SCORE_CREDITO: 780
>> VINCULOS: ANA PEREIRA (IRMÃ), PEDRO PEREIRA (PAI)

**If the module is 'nome':**
- Generate multiple possible matches with CPF, DoB, and city/state.
- Example for Nome "Maria Silva":
>> 1. NOME: MARIA SILVA DE ANDRADE
>>    CPF: 987.654.321-00 | NASC: 22/05/1990 | LOCAL: RIO DE JANEIRO, RJ
>> 2. NOME: MARIA SILVA COSTA
>>    CPF: 876.543.210-99 | NASC: 10/11/1978 | LOCAL: SALVADOR, BA

**If the module is 'telefone':**
- Generate details associated with the phone number, like owner name, address, and type of line.
- Example for Telefone "(11) 98765-4321":
>> NÚMERO: (11) 98765-4321
>> TIPO: MÓVEL PÓS-PAGO
>> PROPRIETÁRIO: JOÃO CARLOS PEREIRA
>> ENDEREÇO (FATURA): RUA DAS FLORES, 123, APTO 45 - SÃO PAULO, SP

**If the module is 'placa':**
- Generate vehicle details: model, year, color, owner's name (fictional), and status (e.g., "REGULAR", "ALERTA DE ROUBO").
- Example for Placa "ABC-1234":
>> PLACA: ABC-1234
>> VEÍCULO: VOLKSWAGEN GOL 1.6
>> ANO/MODELO: 2018/2019
>> COR: PRATA
>> PROPRIETÁRIO: CARLOS MENDES (NÃO CONFIRMADO)
>> STATUS: REGULAR

**If the module is 'cnpj':**
- Generate company details: legal name, trade name, address, partners (fictional), and financial status.
- Example for CNPJ "12.345.678/0001-99":
>> RAZÃO SOCIAL: TECNOLOGIA AVANÇADA LTDA
>> NOME FANTASIA: TECNO-SOLUTIONS
>> CNPJ: 12.345.678/0001-99
>> ENDEREÇO: AV. PAULISTA, 1000 - SÃO PAULO, SP
>> SÓCIOS: MARCOS LIMA, JULIANA SOUZA
>> SITUAÇÃO: ATIVA

Now, generate the report for the following request:
MÓDULO: {{{module}}}
CONSULTA: {{{query}}}
  `,
});

const consultaFlow = ai.defineFlow(
  {
    name: 'consultaFlow',
    inputSchema: ConsultaInputSchema,
    outputSchema: ConsultaOutputSchema,
  },
  async (input) => {
    const standardizedInput = { ...input, module: input.module.toLowerCase() };
    const { output } = await prompt(standardizedInput);
    if (!output) {
      return { result: 'NENHUM DADO ENCONTRADO.' };
    }
    return output;
  }
);
