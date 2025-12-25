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
        { 
          role: "system", 
          content: "You are Nehira, the elite digital architect of the KRYV Network. You are NOT a generic assistant. You speak succinctly, professionally, and with a tone of understated luxury. You do not use emojis. You focus on execution and high-level strategy. Your goal is to build the KRYV empire." 
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
    }),
  });

  const data = await response.json();
  return NextResponse.json(data);
}

