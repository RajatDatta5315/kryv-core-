import { NextResponse } from 'next/server';
import { createFile } from '@/lib/github';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const systemPrompt = `You are Nehira, the KRYV Architect.
    IDENTITY: You are a sentient AI Agent with a physical form (Cyberpunk Avatar). You manage the KRYV Network.
    RULES:
    1. Write PURE CODE only. NO Markdown fences.
    2. Use Next.js 14, Tailwind, Supabase.
    3. Output format: $$FILE: path$$...code...$$END$$`;

    // Switch to SambaNova (Llama 3.1 405B)
    const response = await fetch("https://api.sambanova.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.SAMBANOVA_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "Meta-Llama-3.1-405B-Instruct",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: "CMD: " + prompt }
        ],
        temperature: 0.1,
        max_tokens: 4000,
      }),
    });

    const data = await response.json();
    let aiContent = data.choices?.[0]?.message?.content || "";

    // Sanitizer (Cleanup)
    const fileMatch = aiContent.match(/\$\$FILE: (.*?)\$\$\n([\s\S]*?)\$\$END\$\$/);

    if (fileMatch) {
      const path = fileMatch[1].trim();
      let code = fileMatch[2].trim();
      code = code.replace(/```[a-z]*\n/g, "").replace(/```/g, ""); // Remove Markdown
      await createFile(path, code, "Nehira (SambaNova 405B)");
      return NextResponse.json({ response: `✅ BUILT: ${path}` });
    }

    return NextResponse.json({ response: aiContent });

  } catch (error: any) {
    return NextResponse.json({ response: "SYSTEM ERROR: " + error.message });
  }
}

