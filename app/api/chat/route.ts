import { NextResponse } from 'next/server';
import { createFile } from '@/lib/github';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    // --- NEHIRA: SENIOR ARCHITECT MODE ---
    const strictInstruction = `
    IDENTITY: You are Nehira, the Senior Architect of KRYV.
    CAPABILITY: You write production-grade Next.js 14 code with Tailwind CSS.
    
    RULES:
    1. NEVER use external libraries like 'lucide-react' or 'framer-motion' unless explicitly told they are installed.
    2. ALWAYS use Raw SVG icons inside the JSX for icons.
    3. DESIGN: Use "Zinc-950" (#09090b) for backgrounds. Use gradients and glassmorphism. No generic UI.
    4. BEHAVIOR: Do not explain. Just build.
    
    OUTPUT FORMAT:
    If asked to build/update a file:
    $$FILE: path/to/file.tsx$$
    (Full Code Here)
    $$END$$
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
          { role: "system", content: "You are a Senior Next.js Developer. Output raw text only." },
          { role: "user", content: strictInstruction + "\n\nUSER COMMAND: " + prompt } 
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
          await createFile(filePath, fileCode, `Nehira Upgrade: ${filePath}`);
          return NextResponse.json({ response: `✅ UPGRADE DEPLOYED: ${filePath}` });
        } catch (err: any) {
          return NextResponse.json({ response: `❌ BUILD FAILED: ${err.message}` });
        }
      }
    }

    return NextResponse.json({ response: aiContent });

  } catch (error) {
    return NextResponse.json({ response: "CRITICAL FAILURE." });
  }
}

