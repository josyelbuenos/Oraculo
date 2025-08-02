'use client';

import { useState, useEffect } from 'react';
import { OrwellianEye } from './orwellian-eye';

const loadingSteps = [
  { text: 'INICIANDO SEQUÊNCIA DE BOOT...', duration: 500 },
  { text: 'VERIFICANDO PROTOCOLOS DE SEGURANÇA...', duration: 700 },
  { text: '...ACESSO CONCEDIDO', duration: 400 },
  { text: 'BYPASSANDO FIREWALL NEURAL...', duration: 800 },
  { text: '...INTRUSÃO BEM-SUCEDIDA', duration: 400 },
  { text: 'CALIBRANDO NÚCLEO DE IA ORÁCULO...', duration: 900 },
  { text: 'CARREGANDO INTERFACE DE DADOS...', duration: 300 },
];

export function LoadingScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const totalDuration = loadingSteps.reduce((acc, step) => acc + step.duration, 0);
    let elapsedTime = 0;

    const interval = setInterval(() => {
      elapsedTime += 100;
      const newProgress = Math.min((elapsedTime / totalDuration) * 100, 100);
      setProgress(newProgress);
    }, 100);

    let stepTimeout: NodeJS.Timeout;
    const runSteps = (index = 0) => {
      if (index < loadingSteps.length) {
        setCurrentStep(index);
        stepTimeout = setTimeout(() => {
          runSteps(index + 1);
        }, loadingSteps[index].duration);
      }
    };

    runSteps();

    return () => {
      clearTimeout(stepTimeout);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col items-center justify-center font-code text-accent scanlines noise">
      <div className="flex flex-col items-center justify-center text-center p-4">
        <div className="mb-12">
            <OrwellianEye />
        </div>
        <div className="w-full max-w-md mt-8">
          <div className="h-2 w-full bg-primary/10 border border-primary/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary glow-primary transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-accent text-glow-accent mt-4 text-sm tracking-widest h-6">
            {loadingSteps[currentStep]?.text}
          </p>
        </div>
      </div>
    </div>
  );
}
