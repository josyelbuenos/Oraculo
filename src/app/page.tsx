'use client';

import { useState, useEffect, useRef, FormEvent } from 'react';
import { User, Phone, Car, Building, Search, Eye, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import ParticleBackground from '@/components/oraculo/particle-background';
import { TypingText } from '@/components/oraculo/typing-text';
import { analisarConsulta } from '@/ai/flows/analise-consulta-flow';

const modules = [
  { id: 'cpf', icon: <User className="h-5 w-5" />, label: 'CPF' },
  { id: 'cpf2', icon: <User className="h-5 w-5" />, label: 'CPF v2' },
  { id: 'cpf3', icon: <User className="h-5 w-5" />, label: 'CPF v3' },
  { id: 'nome', icon: <User className="h-5 w-5" />, label: 'Nome' },
  { id: 'telefone', icon: <Phone className="h-5 w-5" />, label: 'Telefone' },
  { id: 'placa', icon: <Car className="h-5 w-5" />, label: 'Placa' },
  { id: 'cnpj', icon: <Building className="h-5 w-5" />, label: 'CNPJ' },
];

const welcomeMessage = `
🔮 BEM-VINDO AO ORÁCULO.
> SISTEMA INICIALIZADO.
> CONECTANDO AO MAINFRAME.
> CONEXÃO ESTABELECIDA.
> VERIFICANDO OS MÓDULOS.
> SISTEMA INICADO!.
> AGUARDANDO SELEÇÃO DE MÓDULO PARA CONSULTA.
`;

export default function OraclePage() {
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [output, setOutput] = useState(welcomeMessage);
  const [isTyping, setIsTyping] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [fictionalData, setFictionalData] = useState({ crypto: 'A4B8', signal: 98, ping: 12 });
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectedModule) {
      inputRef.current?.focus();
    }
  }, [selectedModule]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setFictionalData({
        crypto: Math.random().toString(16).substr(2, 4).toUpperCase(),
        signal: Math.floor(Math.random() * (100 - 90 + 1)) + 90,
        ping: Math.floor(Math.random() * (25 - 8 + 1)) + 8
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleModuleSelect = (moduleId: string) => {
    setSelectedModule(moduleId);
    setInputValue('');
    setOutput(`> MÓDULO [${moduleId.toUpperCase()}] SELECIONADO.
> INSIRA OS DADOS PARA CONSULTA...`);
    setIsTyping(true);
    setIsError(false);
  };

  const handleQuery = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputValue || !selectedModule) return;

    setIsLoading(true);
    setIsTyping(false);
    setOutput(`> EXECUTANDO CONSULTA...
> MÓDULO: ${selectedModule.toUpperCase()}
> VALOR: ${inputValue}
> AGUARDANDO RESPOSTA DO SERVIDOR...`);
    setIsError(false);

    try {
      const res = await fetch(`/api/consulta/${selectedModule}/${inputValue}`);

      if (!res.ok) {
        let errorDetail = "Erro do servidor.";
        try {
            const errorJson = await res.json();
            errorDetail = errorJson.detail || `HTTP error! status: ${res.status}`;
        } catch (e) {
            errorDetail = res.statusText || `HTTP error! status: ${res.status}`;
        }
        throw new Error(errorDetail);
      }

      const data = await res.json();
      
      const headersToRemove = [
        '👤 USUÁRIO:',
        '🤖 BY:',
        '✅ Canal:',
        '• Total de resultados encontrados:',
        'O RESULTADO DA SUA CONSULTA ESTA NO DOCUMENTO ✅',
        'O RESULTADO DA SUA CONSULTA ESTÁ NO DOCUMENTO ✅',
        '🔎 CONSULTA DE CPF DATA 🔎',
        '🔎 CONSULTA DE NOME 🔎',
        '🔎 CONSULTA DE CPF 🔎',
      ];

      const cleanResult = (text: string) => {
        if (!text) return '';
        const lines = text.split('\n');
        const filteredLines = lines.filter(line => 
            !headersToRemove.some(header => line.trim().toLowerCase().includes(header.trim().toLowerCase()))
        );
        return filteredLines.join('\n').trim();
      }

      const cleanedData = cleanResult(data.resultado);

      if (!cleanedData || cleanedData.trim().length < 5 || cleanedData.toLowerCase().includes('timeout') || cleanedData.toLowerCase().includes('inválido')) {
         throw new Error('Nenhum dado encontrado ou a consulta expirou.');
      }

      setOutput(`> DADOS RECEBIDOS.
> INICIANDO ANÁLISE PROFUNDA COM IA...
> CONECTANDO AO NÚCLEO DO ORÁCULO...`);

      const analysisResult = await analisarConsulta({ rawData: cleanedData });

      if (!analysisResult || !analysisResult.analysis) {
        throw new Error('A análise da IA falhou em retornar um resultado.');
      }

      setOutput(analysisResult.analysis);

    } catch (error: any) {
      console.error(error);
      setIsError(true);
      const errorMessage = error.message.includes('Failed to fetch') 
        ? "Falha na comunicação com o servidor."
        : error.message;
      setOutput(`⛔ ACESSO NEGADO: ${errorMessage || "Parâmetros inválidos ou tempo esgotado."}`);
    } finally {
      setIsLoading(false);
      setIsTyping(true);
      setInputValue('');
    }
  };

  return (
    <main className="relative min-h-screen w-full bg-background font-code overflow-hidden scanlines">
      <ParticleBackground />
      <div className="relative z-10 flex flex-col p-2 sm:p-4 gap-4 min-h-[100svh] md:flex-row pb-14">
        <nav className="flex flex-row md:flex-col gap-2 p-2 bg-black/30 backdrop-blur-sm border border-primary/20 rounded-lg md:w-64 overflow-x-auto md:overflow-y-auto">
          <div className="flex items-center gap-2 p-2 border-b border-primary/20">
            <Eye className="text-primary text-glow-primary h-6 w-6" />
            <h1 className="text-lg font-bold text-primary text-glow-primary">ORÁCULO</h1>
          </div>
          <div className="flex flex-row md:flex-col gap-2 p-2">
            {modules.map((mod) => (
              <Button
                key={mod.id}
                variant="ghost"
                onClick={() => handleModuleSelect(mod.id)}
                className={cn(
                  'justify-start gap-3 transition-all duration-300 hover:bg-primary/20 hover:text-primary hover:text-glow-primary',
                  selectedModule === mod.id && 'bg-primary/20 text-primary font-bold text-glow-primary'
                )}
              >
                {mod.icon}
                <span>{mod.label}</span>
              </Button>
            ))}
          </div>
        </nav>

        <div className="flex-1 flex flex-col gap-4 min-h-0">
          <Card className="flex-1 flex flex-col bg-black/30 backdrop-blur-sm border-primary/20 overflow-hidden">
            <CardContent className="p-4 flex-1 overflow-y-auto">
              {isTyping ? (
                 <TypingText text={output} isError={isError} onComplete={() => setIsTyping(false)} />
              ) : (
                <pre className={cn("whitespace-pre-wrap font-code text-sm", isError ? "text-destructive text-glow-error" : "text-accent text-glow-accent")}>
                  {output}
                </pre>
              )}
            </CardContent>
          </Card>

          {selectedModule && (
            <form onSubmit={handleQuery} className="flex items-center gap-2 p-2 bg-black/30 backdrop-blur-sm border border-primary/20 rounded-lg">
              <span className="text-primary text-glow-primary pl-2">$</span>
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={`Inserir ${selectedModule.toUpperCase()}...`}
                className="flex-1 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-accent text-lg terminal-input"
                disabled={isLoading}
              />
              <Button type="submit" variant="ghost" size="icon" disabled={isLoading || !inputValue.trim()}>
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin text-primary" /> : <Search className="h-5 w-5 text-primary hover:text-glow-primary" />}
              </Button>
              <Button type="button" variant="ghost" size="icon" onClick={() => setSelectedModule(null)}>
                <X className="h-5 w-5 text-muted-foreground hover:text-destructive" />
              </Button>
            </form>
          )}
        </div>
      </div>
       <footer className="fixed bottom-0 left-0 right-0 z-20 p-2 bg-background/50 backdrop-blur-sm border-t border-primary/20">
        <div className="mx-auto flex justify-between items-center text-xs font-code text-muted-foreground px-4">
          <div className="flex items-center gap-4">
            <span className="text-primary/80 text-glow-primary">STATUS: CONECTADO</span>
            <span className="hidden sm:inline text-muted-foreground">|</span>
            <span className="hidden sm:inline">CRIPTO: {fictionalData.crypto}</span>
            <span className="hidden md:inline text-muted-foreground">|</span>
            <span className="hidden md:inline">SINAL: {fictionalData.signal}%</span>
            <span className="hidden lg:inline text-muted-foreground">|</span>
            <span className="hidden lg:inline">PING: {fictionalData.ping}ms</span>
          </div>
          <div className="text-glow-primary">By: JosyelBuenos</div>
        </div>
      </footer>
    </main>
  );
}
