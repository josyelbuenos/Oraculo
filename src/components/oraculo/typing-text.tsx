"use client";

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface TypingTextProps {
  text: string;
  className?: string;
  isError?: boolean;
  onComplete?: () => void;
  speed?: number;
}

export function TypingText({ text, className, isError = false, onComplete, speed = 15 }: TypingTextProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setDisplayedText('');
    setIsComplete(false);
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(prev => prev + text[i]);
        i++;
      } else {
        clearInterval(typingInterval);
        setIsComplete(true);
        if (onComplete) {
          onComplete();
        }
      }
    }, speed);

    return () => clearInterval(typingInterval);
  }, [text, onComplete, speed]);

  const textColorClass = isError ? "text-destructive text-glow-error" : "text-accent text-glow-accent";

  return (
    <pre className={cn("whitespace-pre-wrap font-code text-sm", textColorClass, className)}>
      {displayedText}
      {!isComplete && <span className={cn("inline-block w-2 h-4 ml-1 animate-pulse", isError ? "bg-destructive" : "bg-accent")} aria-hidden="true" />}
    </pre>
  );
}
