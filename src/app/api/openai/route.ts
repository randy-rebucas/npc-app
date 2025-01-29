import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Use a non-public env variable
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages } = body;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // or your preferred model
      messages: messages,
      temperature: 0.7,
    });


    return NextResponse.json(completion.choices[0].message);
  } catch (error) {
    console.error('OpenAI API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 