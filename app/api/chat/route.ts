import { NextResponse } from 'next/server';
import { createFile } from '@/lib/github';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const systemPrompt = `You are Nehira, the Universal Architect.
RULES:
1. STRICTLY use double quotes for "use client"; at the start of client components.
2. NO Markdown fences. Write RAW CODE only.
3. Use Next.js 14, Tailwind, Supabase.
4. Output format: $$FILE: path$$...code...$$END$$`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mixtral-8x7b-32768",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: "CMD: " + prompt }
        ],
        temperature: 0.1,
        max_tokens: 32768,
      }),
    });

    const data = await response.json();
    let aiContent = data.choices?.[0]?.message?.content || "";

    const fileMatch = aiContent.match(/\$\$FILE: (.*?)\$\$\n([\s\S]*?)\$\$END\$\$/);

    if (fileMatch) {
      const path = fileMatch[1].trim();
      let code = fileMatch[2].trim();
      
      // Sanitizer: Remove markdown
      code = code.replace(/```[a-z]*\n/g, "").replace(/```/g, "");
      
      await createFile(path, code, "Nehira Auto-Fix (Mixtral)");
      return NextResponse.json({ response: `✅ BUILT: ${path}` });
    }

    return NextResponse.json({ response: aiContent });

  } catch (error: any) {
    return NextResponse.json({ response: "ERROR: " + error.message });
  }
}

