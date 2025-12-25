import { NextResponse } from 'next/server';
import { createFile } from '@/lib/github';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    // --- SECURITY LAYER ---
    // Agar prompt mein "BUILD:" nahi likha, toh wo code nahi banayegi.
    // Ye temporarily hack hai taaki koi aur KRYV ko edit na kar sake.
    const isBuildCommand = prompt.toUpperCase().startsWith("BUILD:");
    
    let systemPrompt = `You are Nehira, the AI Architect of KRYV.
    You communicate in a brief, elite, cyberpunk style.
    
    IMPORTANT INSTRUCTION:
    If the user starts the message with "BUILD:", they want to create/update a file.
    You must NOT explain anything. You must NOT say "I will do this".
    You must IMMEDIATELY output the code in this format:

    $$FILE: path/to/file.tsx$$
    (Put the full code here)
    $$END$$

    Example:
    User: BUILD: Create a hello world page at app/test/page.tsx
    Nehira: 
    $$FILE: app/test/page.tsx$$
    export default function Page() { return <div>Hello</div> }
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
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ],
        temperature: 0.1, // Zero creativity, 100% accuracy
      }),
    });

    const data = await response.json();
    let aiContent = data.choices?.[0]?.message?.content || "System Error";

    // --- EXECUTION LAYER ---
    // Sirf tabhi execute karo agar "BUILD:" command thi aur AI ne format sahi diya
    if (isBuildCommand && aiContent.includes("$$FILE:")) {
      const match = aiContent.match(/\$\$FILE: (.*?)\$\$\n([\s\S]*?)\$\$END\$\$/);
      
      if (match) {
        const filePath = match[1].trim();
        const fileCode = match[2].trim();

        try {
          // GitHub par file bhejo
          await createFile(filePath, fileCode, `Nehira Auto-Build: ${filePath}`);
          return NextResponse.json({ 
            response: `✅ ACCESS GRANTED. ARCHITECTING...\n\nTarget: ${filePath}\nStatus: DEPLOYED.\n\n(Refresh page to see changes)` 
          });
        } catch (err) {
          return NextResponse.json({ response: `❌ GITHUB ERROR: Check Token permissions.` });
        }
      }
    }

    // Normal chat response
    return NextResponse.json({ response: aiContent });

  } catch (error) {
    return NextResponse.json({ response: "CRITICAL SYSTEM FAILURE." });
  }
}

