'use client'

import { createContext, useContext, ReactNode } from 'react';
import OpenAI from 'openai';


const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Only use this if you're handling API calls client-side
});


interface OpenAIContextType {
  openai: OpenAI;
}

const OpenAIContext = createContext<OpenAIContextType | undefined>(undefined);

export function OpenAIProvider({ children }: { children: ReactNode }) {
  return (
    <OpenAIContext.Provider value={{ openai }}>
      {children}
    </OpenAIContext.Provider>
  );
}

export function useOpenAI() {
  const context = useContext(OpenAIContext);
  if (context === undefined) {
    throw new Error('useOpenAI must be used within an OpenAIProvider');
  }
  return context;
} 