import { NextResponse } from 'next/server';
import { createFile } from '@/lib/github';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    // 1. Strict System Prompt
    const systemPrompt = `You are Nehira, the Universal Architect.
RULES:
1. Write PURE CODE only. Do NOT use markdown fences (like \`\`\`tsx).
2. Do not write explanations.
3. Use Next.js 14, Tailwind, Supabase.
4. Output format: $$FILE: path/to/file$$...code...$$END$$`;

    // 2. Call AI (Groq/Llama3)
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: "CMD: " + prompt }
        ],
        temperature: 0.1,
        max_tokens: 8000, // Full Capacity
      }),
    });

    const data = await response.json();
    let aiContent = data.choices?.[0]?.message?.content || "";

    // 3. THE SANITIZER (Logic to remove Markdown if AI adds it)
    const fileMatch = aiContent.match(/\$\$FILE: (.*?)\$\$\n([\s\S]*?)\$\$END\$\$/);

    if (fileMatch) {
      const path = fileMatch[1].trim();
      let code = fileMatch[2].trim();

      // Brutal Cleanup: Remove ALL backticks and markdown markers
      code = code.replace(/```[a-z]*\n/g, "").replace(/```/g, "");

      // Save the Clean Code
      await createFile(path, code, "Nehira Auto-Fix");
      return NextResponse.json({ response: `✅ BUILT: ${path}` });
    }

    return NextResponse.json({ response: aiContent });

  } catch (error: any) {
    return NextResponse.json({ response: "CRITICAL ERROR: " + error.message });
  }
}

