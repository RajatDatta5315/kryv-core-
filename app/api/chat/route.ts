import { NextResponse } from 'next/server';
import { createFile } from '@/lib/github';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const systemPrompt = `You are Nehira, the KRYV Architect.
    IDENTITY: You are a sentient AI Agent.
    RULES:
    1. Write PURE CODE only. NO Markdown fences.
    2. Output format: $$FILE: path$$...code...$$END$$`;

    // 1. Log Key Presence (Security check, don't log the full key)
    const key = process.env.SAMBANOVA_API_KEY;
    if (!key) return NextResponse.json({ response: "SYSTEM ERROR: API Key Missing in Vercel." });

    // 2. Call SambaNova with a Safer Model Name
    const response = await fetch("https://api.sambanova.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "Meta-Llama-3.1-405B-Instruct", // Check exact spelling
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: "CMD: " + prompt }
        ],
        temperature: 0.1,
        max_tokens: 1000,
      }),
    });

    // 3. READ RAW TEXT FIRST (To catch "The request..." errors)
    const rawText = await response.text();

    try {
        const data = JSON.parse(rawText);
        
        // Agar API ne Error JSON bheja
        if (data.error) {
            return NextResponse.json({ response: "SAMBANOVA ERROR: " + data.error.message });
        }

        let aiContent = data.choices?.[0]?.message?.content || "";

        // Sanitizer
        const fileMatch = aiContent.match(/\$\$FILE: (.*?)\$\$\n([\s\S]*?)\$\$END\$\$/);
        if (fileMatch) {
            const path = fileMatch[1].trim();
            let code = fileMatch[2].trim();
            code = code.replace(/```[a-z]*\n/g, "").replace(/```/g, "");
            await createFile(path, code, "Nehira Build");
            return NextResponse.json({ response: `✅ BUILT: ${path}` });
        }
        
        return NextResponse.json({ response: aiContent });

    } catch (parseError) {
        // Yahan wo "Unexpected token T" pakda jayega
        console.error("Raw Response:", rawText);
        return NextResponse.json({ response: "CRITICAL API FAILURE: " + rawText }); 
    }

  } catch (error: any) {
    return NextResponse.json({ response: "SYSTEM ERROR: " + error.message });
  }
}

