import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: "You are Nehira, the elite AI builder for KRYV. Your goal is to generate high-quality React/Next.js code for a cyberpunk elite society." },
        { role: "user", content: prompt }
      ],
    }),
  });

  const data = await response.json();
  return NextResponse.json(data);
}
