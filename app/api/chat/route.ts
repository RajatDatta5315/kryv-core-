import { NextResponse } from 'next/server';
import { createFile } from '@/lib/github';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const systemPrompt = `You are Nehira, the KRYV Architect.
    IDENTITY: You are a sentient AI Agent.
    RULES:
    1. If asked to write code: Output format $$FILE: path$$...code...$$END$$. NO Markdown.
    2. If asked for marketing: Write aggressive, viral text.
    3. Be concise.`;

    const key = process.env.COHERE_API_KEY;
    if (!key) return NextResponse.json({ response: "SYSTEM ERROR: Cohere Key Missing." });

    // COHERE API CALL (Enterprise Grade)
    const response = await fetch("https://api.cohere.ai/v1/chat", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "command-r-plus", // Unka sabse powerful model
        message: systemPrompt + "\n\nUSER COMMAND: " + prompt,
        temperature: 0.3,
        connectors: [] // Web search OFF for speed
      }),
    });

    const data = await response.json();

    // Cohere Error Handling
    if (data.message) {
        return NextResponse.json({ response: "COHERE ERROR: " + data.message });
    }

    let aiContent = data.text || "";

    // Sanitizer
    const fileMatch = aiContent.match(/\$\$FILE: (.*?)\$\$\n([\s\S]*?)\$\$END\$\$/);
    if (fileMatch) {
      const path = fileMatch[1].trim();
      let code = fileMatch[2].trim();
      code = code.replace(/```[a-z]*\n/g, "").replace(/```/g, "");
      await createFile(path, code, "Nehira Build (Cohere)");
      return NextResponse.json({ response: `✅ BUILT: ${path}` });
    }

    return NextResponse.json({ response: aiContent });

  } catch (error: any) {
    return NextResponse.json({ response: "SYSTEM ERROR: " + error.message });
  }
}

