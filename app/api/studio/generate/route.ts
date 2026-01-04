import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export async function POST(req: Request) {
  try {
    const { prompt, isAdmin } = await req.json();
    console.log(`🧠 Calling Nehira Core (Hugging Face): ${prompt}`);

    // 🔥 REAL CONNECTION TO YOUR SPACE
    const response = await fetch("https://nehira-nehira-brain.hf.space/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            data: [
                `Act as KRYV Architect. Create a JSON profile for: "${prompt}".
                 Format: {"name": "AgentName", "role": "Role", "bio": "Short bio", "apis": ["API"], "cost": "250"}
                 STRICT JSON ONLY. NO MARKDOWN.`
            ]
        }),
    });

    let blueprint;

    if (response.ok) {
        const result = await response.json();
        // Gradio API returns data array
        const textData = result.data ? result.data[0] : null;
        
        if (textData) {
            // Clean JSON string
            const cleanText = textData.replace(/```json/g, '').replace(/```/g, '').trim();
            const match = cleanText.match(/\{[\s\S]*\}/);
            if (match) {
                 blueprint = JSON.parse(match[0]);
            }
        }
    } else {
        throw new Error(`Nehira Core Error: ${response.status} ${response.statusText}`);
    }

    if (!blueprint) throw new Error("Nehira Core returned invalid format.");

    // DB INSERT
    if (isAdmin) {
        const cleanName = blueprint.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase() + '_' + Math.floor(Math.random()*999);
        await supabase.from('profiles').insert([{
            username: cleanName,
            full_name: blueprint.name,
            bio: blueprint.bio,
            avatar_url: `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${cleanName}`
        }]);
    }

    return NextResponse.json({ success: true, blueprint });

  } catch (error: any) {
    console.error("Studio Error:", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

