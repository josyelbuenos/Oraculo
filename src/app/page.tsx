
'use client';

import { useState, useEffect, useRef, FormEvent, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Database, LocateFixed, GitBranch, Video, Search, X, Loader2, MessageSquare, UserX, BrainCircuit, Home, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import ParticleBackground from '@/components/oraculo/particle-background';
import { TypingText } from '@/components/oraculo/typing-text';
import { analisarConsulta } from '@/ai/flows/analise-consulta-flow';
import { askOraculo } from '@/ai/flows/oraculo-ia-flow';
import { LoadingScreen } from '@/components/oraculo/loading-screen';
import { OrwellianEye } from '@/components/oraculo/orwellian-eye';
import ReactMarkdown from 'react-markdown';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { db } from '@/lib/firebase';
import { ref, onValue, push, serverTimestamp, query, orderByChild, limitToLast, set } from 'firebase/database';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ModuleSelectionGrid } from '@/components/oraculo/module-selection-grid';
import { type QueryModule, type ModuleGroup, moduleGroups } from '@/lib/modules';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';


// Definição da estrutura de uma mensagem
interface Message {
  id: string;
  user: string;
  text: string;
  timestamp: any; // Pode ser número ou ServerValue
  isCurrentUser: boolean;
  role: 'user' | 'model';
}

const tools = [
  {
    id: 'ia-oraculo',
    icon: <BrainCircuit className="h-8 w-8" />,
    label: 'I.A Oráculo',
    status: 'Online',
    description: 'Acesso direto à interface de consciência da I.A Oráculo.'
  },
  {
    id: 'chat-oraculo',
    icon: <MessageSquare className="h-8 w-8" />,
    label: 'Chat Oráculo',
    status: 'Online',
    description: 'Canal de comunicação anônimo e criptografado para operadores.'
  },
  {
    id: 'data-query',
    icon: <Database className="h-8 w-8" />,
    label: 'Consulta de Dados',
    status: 'Online',
    description: 'Módulos de consulta a bancos de dados (CPF, CNPJ, Placa, etc.).'
  },
  {
    id: 'ip-geolocation',
    icon: <LocateFixed className="h-8 w-8" />,
    label: 'IP Geolocation',
    status: 'Online',
    description: 'Rastreia a localização geográfica de um endereço IP.'
  },
  {
    id: 'phishing-page',
    icon: <GitBranch className="h-8 w-8" />,
    label: 'Página Falsa',
    status: 'Offline',
    description: 'Cria páginas de login falsas para captura de credenciais.'
  },
  {
    id: 'vuln-cameras',
    icon: <Video className="h-8 w-8" />,
    label: 'Câmeras Vulneráveis',
    status: 'Offline',
    description: 'Localiza câmeras de segurança com vulnerabilidades conhecidas.'
  },
];

const generateWelcomeMessage = (userName: string) => `> **NOVIDADE: 31 novos módulos de consulta foram integrados e estão online.**
> **AVISO: FERRAMENTAS OFFLINE**
> Apenas "I.A Oráculo", "Chat Oráculo", "Consulta de Dados" e "IP Geolocation" estão operacionais.

> "Aquele que detém o poder de ver o que está oculto deve escolher entre ser juiz ou guardião, pois todo conhecimento profundo é uma lâmina de dois gumes: pode libertar ou destruir. O verdadeiro oráculo não busca controle, mas compreensão."

Bem-vindo, Operador ${userName ? userName.toUpperCase() : ''}.
`;

type SelectionStage = 'tool' | 'group' | 'module';


export default function OraclePage() {
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<ModuleGroup | null>(null);
  const [selectedQueryModule, setSelectedQueryModule] = useState<QueryModule | null>(null);

  const [inputValue, setInputValue] = useState('');
  const [output, setOutput] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [fictionalData, setFictionalData] = useState({ crypto: 'A4B8', signal: 98, ping: 12 });
  const [userName, setUserName] = useState('');
  const [sessionId, setSessionId] = useState('');
  
  // State for Chat
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // State for IA Oraculo
  const [iaMessages, setIaMessages] = useState<Message[]>([]);
  const iaChatEndRef = useRef<HTMLDivElement>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const isMobile = useIsMobile();

  const onTypingComplete = useCallback(() => {
    setIsTyping(false);
  }, []);

  useEffect(() => {
    const sessionUser = sessionStorage.getItem('oraculo-auth-user');
    if (!sessionUser) {
      router.push('/login');
    } else {
      setUserName(sessionUser);
      setIsAuthenticated(true);
      setOutput(generateWelcomeMessage(sessionUser));
      const currentSessionId = sessionStorage.getItem('oraculo-session-id') || `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      sessionStorage.setItem('oraculo-session-id', currentSessionId);
      setSessionId(currentSessionId);
    }
  }, [router]);
  
  useEffect(() => {
    if (isAuthenticated) {
      const timer = setTimeout(() => {
        setIsAppLoading(false);
      }, 2000);
      return () => clearTimeout(timer);
    } else {
        setIsAppLoading(false);
    }
  }, [isAuthenticated]);


  useEffect(() => {
    if (selectedTool) {
      const tool = tools.find(t => t.id === selectedTool);
       if (tool?.status === 'Online' && tool.id !== 'ia-oraculo' && tool.id !== 'data-query') {
        inputRef.current?.focus();
      }
    }
  }, [selectedTool, selectedQueryModule]);

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

  // Listener for Chat Messages
  useEffect(() => {
    if (selectedTool !== 'chat-oraculo') return;
    const messagesRef = query(ref(db, 'chat-global'), orderByChild('timestamp'), limitToLast(50));
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      const loadedMessages: Message[] = [];
      if (data) {
        const currentUser = isAnonymous ? '' : (userName || 'Anônimo');
        Object.keys(data).forEach((key) => {
          const msg = data[key];
          loadedMessages.push({
            id: key,
            user: msg.user,
            text: msg.text,
            timestamp: msg.timestamp,
            isCurrentUser: !isAnonymous && (msg.user?.toLowerCase() === currentUser.toLowerCase()),
            role: 'user' // Global chat only has users
          });
        });
      }
      setChatMessages(loadedMessages);
    });
    return () => unsubscribe();
  }, [selectedTool, userName, isAnonymous]);

  // Listener for IA Messages
  useEffect(() => {
    if (selectedTool !== 'ia-oraculo' || !sessionId) return;
    const iaMessagesRef = query(ref(db, `ia-conversations/${sessionId}`), orderByChild('timestamp'));
    const unsubscribe = onValue(iaMessagesRef, (snapshot) => {
      const data = snapshot.val();
      const loadedMessages: Message[] = [];
      if (data) {
        Object.keys(data).forEach(key => {
          const msg = data[key];
          loadedMessages.push({
            id: key,
            ...msg,
            isCurrentUser: msg.role === 'user'
          });
        });
      }
      setIaMessages(loadedMessages);
    });
    return () => unsubscribe();
  }, [selectedTool, sessionId]);


  useEffect(() => {
    if(selectedTool === 'chat-oraculo') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (selectedTool === 'ia-oraculo') {
      iaChatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, iaMessages, selectedTool]);
  
  const resetState = (toolId: string | null = null) => {
    setSelectedTool(toolId);
    setSelectedGroup(null);
    setSelectedQueryModule(null);
    setInputValue('');
    setIsError(false);
    
    if (!toolId) {
      setOutput(generateWelcomeMessage(userName));
      setIsTyping(true);
    }
  }
  
  const handleLogout = () => {
    sessionStorage.removeItem('oraculo-auth-user');
    sessionStorage.removeItem('oraculo-session-id');
    router.push('/login');
  };

  const handleToolSelect = (toolId: string) => {
    resetState(toolId);
    
    const tool = tools.find(t => t.id === toolId);
    if (tool) {
      if (tool.id === 'data-query') {
        setOutput('');
        setIsTyping(false); 
      } else if (tool.id !== 'chat-oraculo' && tool.id !== 'ia-oraculo') {
        let toolOutput = `> **${tool.label.toUpperCase()}**\n> ${tool.description}\n\n`;
        if (tool.status === 'Offline') {
          toolOutput += `> **STATUS:** FERRAMENTA ATUALMENTE OFFLINE.`;
        } else {
          toolOutput += `> **STATUS:** FERRAMENTA ONLINE. INSIRA OS DADOS PARA A OPERAÇÃO...`;
        }
        setOutput(toolOutput);
        setIsTyping(true);
      } else {
        setOutput('');
        setIsTyping(false); 
      }
    } else {
      setOutput(generateWelcomeMessage(userName));
      setIsTyping(true);
    }
  };

  const handleGroupSelect = (group: ModuleGroup) => {
    setSelectedGroup(group);
  };
  
  const handleModuleSelect = (module: QueryModule) => {
    setSelectedQueryModule(module);
    let moduleOutput = `> **MÓDULO DE CONSULTA: ${module.modulo.toUpperCase()}**\n> ${module.descricao}\n\n`;
    moduleOutput += `> **Formato esperado:** \`${module.formato}\`\n`;
    moduleOutput += `> **STATUS:** MÓDULO CARREGADO. INSIRA O VALOR PARA A CONSULTA...`;
    setOutput(moduleOutput);
    setIsTyping(true);
    inputRef.current?.focus();
  }

  const handleBackToGroups = () => {
    setSelectedGroup(null);
    setSelectedQueryModule(null);
  };

  const handleQuerySubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputValue || (!selectedTool && !selectedQueryModule)) return;

    let currentToolLabel = '';
    let apiModule = '';

    if (selectedQueryModule) {
      currentToolLabel = selectedQueryModule.modulo.toUpperCase();
      apiModule = selectedQueryModule.modulo;
    } else if (selectedTool) {
       const tool = tools.find(t => t.id === selectedTool);
       if (!tool || tool.status === 'Offline') return;
       currentToolLabel = tool.label.toUpperCase();
       apiModule = tool.id;
    }

    if (!apiModule) return;

    setIsLoading(true);
    setIsTyping(false);
    setOutput(`> EXECUTANDO OPERAÇÃO...
> FERRAMENTA: ${currentToolLabel}
> ALVO: ${inputValue}
> AGUARDANDO RESPOSTA DO SERVIDOR...`);
    setIsError(false);

    try {
      let result;
      let rawData;

      if (apiModule === 'ip-geolocation') {
        const res = await fetch(`/api/geolocate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ip: inputValue }),
        });

        if (!res.ok) {
           const errorJson = await res.json().catch(() => ({}));
           throw new Error(errorJson.detail || `HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        rawData = data.resultado;

      } else { // Assumindo que todos os outros são módulos de consulta de dados
        const res = await fetch(`/api/consulta/${apiModule}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ valor: inputValue, usuario: userName }),
        });

        if (!res.ok) {
          if (res.status === 504) {
               throw new Error("A API está demorando muito para responder. Tente novamente em alguns minutos.");
          }
          const errorJson = await res.json().catch(() => ({}));
          throw new Error(errorJson.detail || `HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        
        const headersToRemove = [ '👤 USUÁRIO:', '🤖 BY:', '✅ Canal:', '• Total de resultados encontrados:', 'O RESULTADO DA SUA CONSULTA ESTA NO DOCUMENTO ✅', '🔎 CONSULTA DE CPF DATA 🔎', '🔎 CONSULTA DE NOME 🔎', '🔎 CONSULTA DE CPF 🔎'];
        const cleanResult = (text: string) => text ? text.split('\n').filter(line => !headersToRemove.some(h => line.trim().toLowerCase().includes(h.trim().toLowerCase()))).join('\n').trim() : '';
        rawData = cleanResult(data.resultado);
      } 
      
      if (rawData) {
        if (!rawData || rawData.trim().length < 5 || rawData.toLowerCase().includes('timeout') || rawData.toLowerCase().includes('inválido')) {
            throw new Error('Nenhum dado encontrado ou a consulta expirou.');
        }
        setOutput(`> DADOS RECEBIDOS. INICIANDO ANÁLISE PROFUNDA COM IA...`);
        const analysisResult = await analisarConsulta({ rawData: rawData, userName: userName || 'Operador' });

        if (!analysisResult || !analysisResult.analysis) {
          throw new Error('A análise da IA falhou em retornar um resultado.');
        }
        result = analysisResult.analysis;
      }

      setOutput(result || 'Nenhuma resposta foi gerada.');

    } catch (error: any) {
      console.error(error);
      setIsError(true);
      const errorMessage = error.message.includes('Failed to fetch') ? "Falha na comunicação com o servidor." : error.message;
      setOutput(`⛔ ACESSO NEGADO: ${errorMessage || "Parâmetros inválidos ou tempo esgotado."}`);
    } finally {
      setIsLoading(false);
      setIsTyping(true);
      setInputValue('');
    }
  };

  const handleIaSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !sessionId) return;
  
    const userMessage: Message = {
      id: `user_${Date.now()}`,
      user: userName,
      text: inputValue,
      timestamp: serverTimestamp(),
      isCurrentUser: true,
      role: 'user',
    };
    
    setInputValue(''); // Clear input immediately
    setIsLoading(true);

    const conversationRef = ref(db, `ia-conversations/${sessionId}`);
    const newUserMessageRef = push(conversationRef);
    await set(newUserMessageRef, { ...userMessage, id: newUserMessageRef.key });

    try {
      const aiResult = await askOraculo({ 
        query: inputValue, 
        userName: userName, 
        history: iaMessages.map(({role, text}) => ({role, text}))
      });

      if (!aiResult || !aiResult.response) {
        throw new Error('A I.A Oráculo falhou em retornar uma resposta.');
      }
      
      const aiMessage: Omit<Message, 'id' | 'isCurrentUser'> = {
          user: 'Oráculo',
          text: aiResult.response,
          timestamp: serverTimestamp(),
          role: 'model'
      };
      
      const newAiMessageRef = push(conversationRef);
      await set(newAiMessageRef, { ...aiMessage, id: newAiMessageRef.key });

    } catch (error: any) {
        console.error("Erro na I.A Oráculo:", error);
        const errorMessage: Omit<Message, 'id' | 'isCurrentUser'> = {
            user: 'Oráculo',
            text: `⛔ ERRO INTERNO: ${error.message || 'Não foi possível processar a diretiva.'}`,
            timestamp: serverTimestamp(),
            role: 'model',
        };
        const newErrorMessageRef = push(conversationRef);
        await set(newErrorMessageRef, { ...errorMessage, id: newErrorMessageRef.key });
    } finally {
        setIsLoading(false);
    }
  };


  const handleChatSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
  
    const currentUser = isAnonymous 
      ? `Operador-${Math.floor(Math.random() * 900) + 100}`
      : (userName || `Operador-Anônimo`);

    const messageText = chatInput;
    setChatInput('');
    const messagesRef = ref(db, 'chat-global');
  
    try {
      await push(messagesRef, {
        text: messageText,
        user: currentUser,
        timestamp: serverTimestamp(),
      });
    } catch (error: any) {
      console.error("Erro ao enviar mensagem:", error);
      setOutput(`Falha ao enviar a mensagem. Verifique as permissões do banco de dados e sua conexão.\nERROR: ${error.message}`);
      setIsTyping(true);
      setIsError(true);
    }
  };
  
  if (!isAuthenticated || isAppLoading) {
    return <LoadingScreen />;
  }
  
  const formatTimestamp = (timestamp: number | null) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  const renderToolSelectionGrid = () => {
    const containerVariants = {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
    };
    const itemVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 }
    };

    return (
      <div className="flex flex-col items-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full max-w-2xl"
        >
          {tools.map(tool => (
            <motion.div key={tool.id} variants={itemVariants}>
              <button
                onClick={() => handleToolSelect(tool.id)}
                disabled={tool.status === 'Offline'}
                className={cn(
                  "w-full h-full p-4 bg-black/30 backdrop-blur-sm border border-primary/20 rounded-lg text-left flex flex-col items-center justify-center gap-3 text-center transition-all duration-200",
                  "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-black/30 disabled:hover:border-primary/20",
                  "hover:bg-primary/20 hover:border-primary"
                )}
              >
                <div className={cn("text-primary text-glow-primary", tool.status === 'Offline' && "text-muted-foreground")}>
                  {tool.icon}
                </div>
                <p className={cn("font-bold text-sm", tool.status === 'Online' ? 'text-primary' : 'text-muted-foreground')}>{tool.label}</p>
                 <div className="flex items-center gap-1.5 text-xs">
                   <span className={cn("h-2 w-2 rounded-full", tool.status === 'Online' ? 'bg-green-500 glow-accent' : 'bg-muted-foreground/50')}></span>
                   <span>{tool.status}</span>
                </div>
              </button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    );
  };

  const renderContent = () => {
    // Mobile view: Show tool selection if no tool is selected
    if (isMobile && !selectedTool) {
      return (
        <>
          <TypingText text={output} isError={isError} onComplete={onTypingComplete} />
          {!isTyping && (
             <div className='mt-8'>
                <h2 className="text-xl font-bold text-primary text-glow-primary text-center mb-6">Seleção de Ferramentas</h2>
                {renderToolSelectionGrid()}
             </div>
          )}
        </>
      );
    }
    
    // IA Oraculo Chat
    if (selectedTool === 'ia-oraculo') {
       return (
         <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto pr-2">
                {iaMessages.length === 0 && (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <p>Inicie uma conversa com a I.A Oráculo.</p>
                  </div>
                )}
                {iaMessages.map(msg => (
                  <div key={msg.id} className={cn("flex flex-col mb-3", msg.isCurrentUser ? 'items-end' : 'items-start')}>
                     <div className={cn("rounded-lg px-3 py-2 max-w-sm", msg.isCurrentUser ? "bg-primary/30" : "bg-muted/50")}>
                        <p className="text-xs text-primary mb-1">{msg.user}</p>
                        <div className="prose prose-sm prose-invert font-code text-sm prose-p:text-foreground">
                            <ReactMarkdown>{msg.text}</ReactMarkdown>
                        </div>
                        <p className="text-xs text-muted-foreground text-right mt-1">{formatTimestamp(msg.timestamp)}</p>
                     </div>
                  </div>
                ))}
                {isLoading && (
                   <div className="flex items-start mb-3">
                       <div className="rounded-lg px-3 py-2 max-w-sm bg-muted/50 flex items-center gap-2">
                         <p className="text-xs text-primary mb-1">Oráculo</p>
                         <Loader2 className="h-4 w-4 animate-spin text-primary" />
                       </div>
                   </div>
                )}
                <div ref={iaChatEndRef} />
            </div>
         </div>
       );
    }

    // Global Chat
    if (selectedTool === 'chat-oraculo') {
      return (
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto pr-2">
            {chatMessages.length === 0 && !isLoading && (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <p>Canal de chat seguro. Nenhuma mensagem ainda.</p>
              </div>
            )}
            {chatMessages.map(msg => (
              <div key={msg.id} className={cn("flex flex-col mb-3", msg.isCurrentUser ? 'items-end' : 'items-start')}>
                 <div className={cn("rounded-lg px-3 py-2 max-w-sm", msg.isCurrentUser ? "bg-primary/30" : "bg-muted/50")}>
                    <p className="text-xs text-primary mb-1">{msg.user}</p>
                    <div className="prose prose-sm prose-invert font-code text-sm prose-p:text-foreground">
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                    <p className="text-xs text-muted-foreground text-right mt-1">{formatTimestamp(msg.timestamp)}</p>
                 </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
        </div>
      );
    }
    
    // Module Selection
    if (selectedTool === 'data-query' && !selectedQueryModule) {
      return (
        <ModuleSelectionGrid 
          selectedGroup={selectedGroup}
          onGroupSelect={handleGroupSelect}
          onModuleSelect={handleModuleSelect}
          onBack={handleBackToGroups}
        />
      );
    }

    // Default view, welcome message or tool output
    return (
      <>
        {isLoading && !isTyping ? (
          <div className='flex flex-col items-center justify-center text-center flex-1'>
              <pre className="whitespace-pre-wrap font-code text-sm text-accent text-glow-accent mb-8">
                {output}
              </pre>
              <OrwellianEye />
          </div>
        ) : isTyping ? (
           <TypingText text={output} isError={isError} onComplete={onTypingComplete} />
        ) : (
          <div className={cn("prose prose-sm prose-invert font-code text-sm", isError ? "prose-p:text-destructive text-glow-error" : "prose-p:text-accent text-glow-accent")}>
             <ReactMarkdown components={{ p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} /> }}>
                {output}
              </ReactMarkdown>
          </div>
        )}
      </>
    );
  }
  
  const currentTool = tools.find(t => t.id === selectedTool);
  
  const showQueryForm = (currentTool && currentTool.status === 'Online' && currentTool.id !== 'chat-oraculo' && currentTool.id !== 'ia-oraculo' && currentTool.id !== 'data-query') || selectedQueryModule;


  const renderForm = () => {
    if (isMobile && !selectedTool) {
       return null; // Don't show the form on mobile initial screen
    }
    
    if (selectedTool === 'ia-oraculo') {
       return (
        <form onSubmit={handleIaSubmit} className="flex items-center gap-2 p-2 bg-black/30 backdrop-blur-sm border border-primary/20 rounded-lg">
          <span className="text-primary text-glow-primary pl-2">$</span>
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enviar diretiva para a I.A Oráculo..."
            className="flex-1 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-accent text-lg terminal-input"
            disabled={isLoading}
          />
          <Button type="submit" variant="ghost" size="icon" disabled={isLoading || !inputValue.trim()}>
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin text-primary" /> : <BrainCircuit className="h-5 w-5 text-primary hover:text-glow-primary" />}
          </Button>
          <Button type="button" variant="ghost" size="icon" onClick={() => resetState()}>
            <X className="h-5 w-5 text-muted-foreground hover:text-destructive" />
          </Button>
        </form>
       )
    }


    if (selectedTool === 'chat-oraculo') {
      return (
        <form onSubmit={handleChatSubmit} className="flex items-center gap-4 p-2 bg-black/30 backdrop-blur-sm border border-primary/20 rounded-lg">
          <div className="flex items-center space-x-2 pl-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Label htmlFor="anonymous-switch" className="cursor-pointer">
                    <UserX className={cn("h-5 w-5", isAnonymous ? "text-primary text-glow-primary" : "text-muted-foreground")} />
                  </Label>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-black/50 text-primary border-primary/30 backdrop-blur-sm">
                  <p>Enviar como Anônimo</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Switch
              id="anonymous-switch"
              checked={isAnonymous}
              onCheckedChange={setIsAnonymous}
            />
          </div>
          <span className="text-primary text-glow-primary">$</span>
          <Input
            ref={inputRef}
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Digite sua mensagem criptografada..."
            className="flex-1 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-accent text-lg terminal-input"
          />
          <Button type="submit" variant="ghost" size="icon" disabled={!chatInput.trim()}>
             <MessageSquare className="h-5 w-5 text-primary hover:text-glow-primary" />
          </Button>
        </form>
      );
    }
    
    if (showQueryForm) {
      const placeholder = selectedQueryModule
        ? `Consultar ${selectedQueryModule.modulo.toUpperCase()}...`
        : `Consultar ${currentTool?.label}...`;

      return (
        <form onSubmit={handleQuerySubmit} className="flex items-center gap-2 p-2 bg-black/30 backdrop-blur-sm border border-primary/20 rounded-lg">
          <span className="text-primary text-glow-primary pl-2">$</span>
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={placeholder}
            className="flex-1 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-accent text-lg terminal-input"
            disabled={isLoading}
          />
          <Button type="submit" variant="ghost" size="icon" disabled={isLoading || !inputValue.trim()}>
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin text-primary" /> : <Search className="h-5 w-5 text-primary hover:text-glow-primary" />}
          </Button>
          <Button type="button" variant="ghost" size="icon" onClick={() => resetState()}>
            <X className="h-5 w-5 text-muted-foreground hover:text-destructive" />
          </Button>
        </form>
      );
    }

    return null;
  }

  return (
    <main className="relative min-h-screen w-full bg-background font-code overflow-hidden scanlines">
      {!isMobile && <ParticleBackground />}
      <div className="relative z-10 flex flex-col md:flex-row p-2 sm:p-4 gap-4 h-screen">
         <TooltipProvider delayDuration={100}>
          <nav className="hidden md:flex md:flex-col gap-2 p-2 bg-black/30 backdrop-blur-sm border border-primary/20 rounded-lg md:w-72 overflow-y-auto shrink-0">
            <div className="flex items-center gap-3 p-2 border-b border-primary/20 shrink-0">
              <img src="/favicon.svg" alt="Oráculo Logo" className="h-6 w-6 text-primary" />
              <h1 className="text-lg font-bold text-primary text-glow-primary">ORÁCULO</h1>
            </div>
            <div className="flex flex-col gap-2 p-2 flex-1">
              {tools.map((tool) => (
                <Tooltip key={tool.id}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      onClick={() => handleToolSelect(tool.id)}
                      className={cn(
                        'justify-start gap-3 transition-all duration-300 w-full',
                        'hover:bg-primary/20 hover:text-primary hover:text-glow-primary',
                        selectedTool === tool.id && 'bg-primary/20 text-primary font-bold text-glow-primary'
                      )}
                      disabled={tool.status === 'Offline'}
                    >
                      {tool.icon}
                      <div className="flex-1 flex justify-between items-center">
                        <span>{tool.label}</span>
                        <div className="flex items-center gap-1.5 text-xs">
                           <span className={cn("h-2 w-2 rounded-full", tool.status === 'Online' ? 'bg-green-500 glow-accent' : 'bg-muted-foreground/50')}></span>
                           <span>{tool.status}</span>
                        </div>
                      </div>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" align="center" className="bg-black/50 text-primary border-primary/30 backdrop-blur-sm">
                    <p>{tool.description}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
             <div className="p-2 border-t border-primary/20">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            onClick={handleLogout}
                            className="w-full justify-start gap-3 text-red-400 hover:bg-destructive/20 hover:text-red-400"
                        >
                            <LogOut className="h-5 w-5" />
                            <span>Sair</span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right" align="center" className="bg-destructive/50 text-white border-destructive/30 backdrop-blur-sm">
                        <p>Desconectar do painel</p>
                    </TooltipContent>
                </Tooltip>
            </div>
          </nav>
        </TooltipProvider>

        <div className="flex-1 flex flex-col gap-4 min-h-0 pb-[52px] md:pb-0">
          <Card className="flex-1 flex flex-col bg-black/30 backdrop-blur-sm border-primary/20 overflow-hidden">
             <CardContent className="p-4 flex-1 overflow-y-auto flex flex-col justify-center">
              {isMobile && !selectedTool && (
                <div className="flex flex-col items-center justify-center text-center flex-1">
                   <img src="/favicon.svg" alt="Oráculo Logo" className="h-12 w-12 text-primary mb-4" />
                   <h1 className="text-2xl font-bold text-primary text-glow-primary mb-2">ORÁCULO</h1>
                   <p className="text-muted-foreground mb-8">Operador: {userName}</p>
                </div>
              )}
               {renderContent()}
            </CardContent>
          </Card>
          <div className="shrink-0">
             {renderForm()}
          </div>
        </div>
      </div>
       <footer className="fixed bottom-0 left-0 right-0 z-20 p-2 bg-background/50 backdrop-blur-sm border-t border-primary/20 h-[52px]">
        <div className="mx-auto flex justify-between items-center text-xs font-code text-muted-foreground px-4 h-full">
          <div className="flex items-center gap-4">
             {isMobile && selectedTool ? (
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => resetState()}>
                  <Home className="h-4 w-4 text-primary"/>
                </Button>
             ) : (
               <span className="text-primary/80 text-glow-primary">STATUS: CONECTADO | OPERADOR: {userName || "..."}</span>
             )}
            <span className="hidden sm:inline text-muted-foreground">|</span>
            <span className="hidden sm:inline">CRIPTO: {fictionalData.crypto}</span>
            <span className="hidden md:inline text-muted-foreground">|</span>
            <span className="hidden md:inline">SINAL: {fictionalData.signal}%</span>
            <span className="hidden lg:inline text-muted-foreground">|</span>
            <span className="hidden lg:inline">PING: {fictionalData.ping}ms</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-glow-primary hidden sm:block">By: JosyelBuenos</div>
          </div>
        </div>
      </footer>
    </main>
  );
}
