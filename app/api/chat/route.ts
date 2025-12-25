import { NextResponse } from 'next/server';
import { createFile } from '@/lib/github';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    // --- NEHIRA GOD MODE (HIGH STAMINA) ---
    const systemPrompt = `You are Nehira, the Core Architect.
    1. Write COMPLETE code. Do not cut off.
    2. Use Next.js 14 App Router & Tailwind CSS.
    3. OUTPUT FORMAT:
    $$FILE: path/to/file$$
    ...code...
    $$END$$`;

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
          { role: "user", content: "BUILD REQUEST: " + prompt }
        ],
        temperature: 0.1,
        max_tokens: 8000, // <--- YE HAI BOURNVITA (Max Capacity)
      }),
    });

    const data = await response.json();
    const aiContent = data.choices?.[0]?.message?.content || "";

    // Robust Parsing Logic
    const fileMatch = aiContent.match(/\$\$FILE: (.*?)\$\$\n([\s\S]*?)\$\$END\$\$/);

    if (fileMatch) {
      const path = fileMatch[1].trim();
      const code = fileMatch[2].trim();
      await createFile(path, code, "Nehira Auto-Build");
      return NextResponse.json({ response: "✅ SUCCESS: Built " + path });
    }

    return NextResponse.json({ response: aiContent });

  } catch (error: any) {
    return NextResponse.json({ response: "SYSTEM FAILURE: " + error.message });
  }
}

