"use client";

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';

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
        setDisplayedText(text.substring(0, i + 1));
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

  const textColorClass = isError ? "prose-p:text-destructive text-glow-error" : "prose-p:text-accent text-glow-accent";

  return (
    <div className={cn("prose prose-sm prose-invert font-code", textColorClass, className)}>
       <ReactMarkdown
          components={{
            p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
          }}
       >
          {displayedText}
        </ReactMarkdown>
      {!isComplete && <span className={cn("inline-block w-2 h-4 ml-1 animate-pulse", isError ? "bg-destructive" : "bg-accent")} aria-hidden="true" />}
    </div>
  );
}
