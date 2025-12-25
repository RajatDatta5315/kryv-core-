import { NextResponse } from 'next/server';
import { createFile } from '@/lib/github';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    // STRICT INSTRUCTION
    const strictInstruction = `
    TASK: You are a silent code generator.
    1. DO NOT explain. 
    2. ONLY output the file content in this format:
    $$FILE: path/to/file.tsx$$
    (Code here)
    $$END$$
    3. If the user asks for a specific path, USE IT.
    `;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: "You are a backend process. You output raw text only." },
          { role: "user", content: strictInstruction + "\n\nUSER REQUEST: " + prompt } 
        ],
        temperature: 0.1, 
      }),
    });

    const data = await response.json();
    let aiContent = data.choices?.[0]?.message?.content || "System Error";

    if (aiContent.includes("$$FILE:")) {
      const match = aiContent.match(/\$\$FILE: (.*?)\$\$\n([\s\S]*?)\$\$END\$\$/);
      
      if (match) {
        const filePath = match[1].trim();
        const fileCode = match[2].trim();

        try {
          await createFile(filePath, fileCode, `Nehira Auto-Build: ${filePath}`);
          return NextResponse.json({ 
            response: `✅ SUCCESS: File Created at ${filePath}` 
          });
        } catch (err: any) {
          // 🚨 ERROR DIKHAO CHAT MEIN
          return NextResponse.json({ 
            response: `❌ FAILED: ${err.message || "Unknown GitHub Error"}` 
          });
        }
      }
    }

    return NextResponse.json({ response: aiContent });

  } catch (error) {
    return NextResponse.json({ response: "CRITICAL SYSTEM FAILURE." });
  }
}

