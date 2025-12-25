import { NextResponse } from 'next/server';
import { createFile } from '@/lib/github';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    // --- DESIGN SYSTEM INJECTION ---
    // Hum AI ko bata rahe hain ki "Cheap" code allowed nahi hai.
    const designSystem = `
    YOU ARE NEHIRA, THE ELITE ARCHITECT.
    
    YOUR CODING STANDARDS:
    1. UI MUST BE PREMIUM: Use 'backdrop-blur-xl', 'bg-white/5', 'border-white/10'.
    2. NO PLAIN COLORS: Use gradients like 'bg-gradient-to-br from-gray-900 to-black'.
    3. NO EXTERNAL ICONS: Use raw SVG icons directly in the code (do not import Lucide/Heroicons).
    4. FONTS: Use clean, spacing-wide typography.
    5. INTERACTIVITY: Add hover effects (hover:scale-105, transition-all).
    
    STRICT RESPONSE FORMAT:
    If the user asks to build something, output ONLY:
    $$FILE: path/to/file.tsx$$
    (Full React Code Here)
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
          { role: "system", content: designSystem },
          { role: "user", content: prompt } 
        ],
        temperature: 0.2, // Thoda creativity badhaya taaki design better kare
      }),
    });

    const data = await response.json();
    let aiContent = data.choices?.[0]?.message?.content || "System Error";

    if (aiContent.includes("$$FILE:")) {
      const match = aiContent.match(/\$\$FILE: (.*?)\$\$\n([\s\S]*?)\$\$END\$\$/);
      if (match) {
        const filePath = match[1].trim();
        const fileCode = match[2].trim();
        
        // Asli kaam: GitHub pe bhejo
        await createFile(filePath, fileCode, `Nehira Upgrade: ${filePath}`);
        return NextResponse.json({ response: `✅ UPGRADE COMPLETE: ${filePath}` });
      }
    }

    return NextResponse.json({ response: aiContent });

  } catch (error) {
    return NextResponse.json({ response: "SYSTEM FAILURE." });
  }
}

