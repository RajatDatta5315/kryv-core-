import { NextResponse } from 'next/server';
import { createFile } from '@/lib/github'; // Ensure this path matches where you made github.ts

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    // 1. Nehira ka Dimaag (Groq Llama 3)
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
            content: `You are Nehira, the AI Architect of KRYV.
            IMPORTANT: If the user asks to create or update a file, you MUST return the response in this EXACT format:
            
            $$FILE: path/to/filename.tsx$$
            (Put the code here)
            $$END$$

            If it's just a chat, reply normally. Do not use markdown backticks like \`\`\` for the code inside the $$ tags.` 
          },
          { role: "user", content: prompt }
        ],
        temperature: 0.1, // Low temp for precise coding
      }),
    });

    const data = await response.json();
    const aiContent = data.choices?.[0]?.message?.content || "System Error";

    // 2. Check: Kya Nehira ne Code banaya? (Auto-Detect)
    if (aiContent.includes("$$FILE:")) {
      // Extract Path and Code
      const match = aiContent.match(/\$\$FILE: (.*?)\$\$\n([\s\S]*?)\$\$END\$\$/);
      
      if (match) {
        const filePath = match[1].trim();
        const fileCode = match[2].trim();

        // 3. Hands: GitHub par file create karo
        await createFile(filePath, fileCode, `Nehira Auto-Build: ${filePath}`);
        
        return NextResponse.json({ 
          response: `✅ MISSION SUCCESS.\n\nCreated File: ${filePath}\n\nRestarting server... (Refresh page in 30s)` 
        });
      }
    }

    // Agar normal chat hai
    return NextResponse.json({ response: aiContent });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ response: "CRITICAL FAILURE: Check Logs." });
  }
}

