'use client'

import { createContext, useContext } from 'react';
import OpenAI from 'openai';

if (!process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
  throw new Error('Missing NEXT_PUBLIC_OPENAI_API_KEY environment variable');
}

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

interface OpenAIContextType {
  openai: OpenAI;
  createCompletion: (prompt: string) => Promise<string>;
}

const OpenAIContext = createContext<OpenAIContextType | undefined>(undefined);

export function OpenAIProvider({ children }: { children: React.ReactNode }) {
  const createCompletion = async (prompt: string): Promise<string> => {
    try {
      const completion = await openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "gpt-3.5-turbo",
      });

      return completion.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('Error creating completion:', error);
      throw new Error('Failed to generate completion');
    }
  };

  return (
    <OpenAIContext.Provider value={{ openai, createCompletion }}>
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