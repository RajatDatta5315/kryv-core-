import { NextResponse } from 'next/server';
import { createFile } from '@/lib/github';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    const ADMIN_PASS = process.env.ADMIN_PASSWORD;

    // --- SECURITY LAYER ---
    // Agar User ne password nahi likha, toh Access Denied.
    if (!ADMIN_PASS || !prompt.includes(ADMIN_PASS)) {
      return NextResponse.json({ 
        response: `⛔ ACCESS DENIED. \nAuth Code Missing or Incorrect.` 
      });
    }

    // --- STRICT INSTRUCTION LAYER ---
    // Isse hum user prompt ke saath jod denge taaki AI ise ignore na kar sake
    const strictInstruction = `
    TASK: You are a silent code generator.
    1. DO NOT explain. DO NOT say "Here is the code".
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
          { role: "system", content: "You are a backend process. You output raw text only. No markdown formatting outside the $$ tags." },
          { role: "user", content: strictInstruction + "\n\nUSER REQUEST: " + prompt } 
          // Instruction user message mein daal di taaki wo usse zyada serious le.
        ],
        temperature: 0.1, 
      }),
    });

    const data = await response.json();
    let aiContent = data.choices?.[0]?.message?.content || "System Error";

    // --- EXECUTION LAYER ---
    if (aiContent.includes("$$FILE:")) {
      const match = aiContent.match(/\$\$FILE: (.*?)\$\$\n([\s\S]*?)\$\$END\$\$/);
      
      if (match) {
        const filePath = match[1].trim();
        const fileCode = match[2].trim();

        try {
          await createFile(filePath, fileCode, `Nehira Auto-Build: ${filePath}`);
          return NextResponse.json({ 
            response: `✅ ACCESS GRANTED.\nTarget: ${filePath}\nStatus: BUILD SUCCESSFUL.\n\n(Wait 30s & Refresh)` 
          });
        } catch (err) {
          return NextResponse.json({ response: `❌ GITHUB ERROR: Token Invalid or Repo Name Wrong.` });
        }
      }
    }

    return NextResponse.json({ response: aiContent });

  } catch (error) {
    return NextResponse.json({ response: "CRITICAL SYSTEM FAILURE." });
  }
}

