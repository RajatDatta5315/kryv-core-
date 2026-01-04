import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export async function POST(req: Request) {
  try {
    const { prompt, isAdmin } = await req.json();
    
    console.log(`🧠 Calling Nehira Core for: ${prompt}`);

    // 🔥 CONNECT TO YOUR HUGGING FACE SPACE
    // Using Gradio API endpoint for 'Nehira/nehira-brain'
    const response = await fetch("https://nehira-nehira-brain.hf.space/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            data: [
                `Act as KRYV Architect. Create a JSON profile for: "${prompt}".
                 Format: {"name": "AgentName", "role": "Role", "bio": "Short bio", "apis": ["API"], "cost": "250"}
                 STRICT JSON ONLY.`
            ]
        }),
    });

    let blueprint;

    // 1. Try Parse Space Response
    if (response.ok) {
        const result = await response.json();
        // Gradio usually returns { data: ["Response Text"] }
        const textData = result.data ? result.data[0] : "";
        
        // Clean Markdown
        const cleanText = textData.replace(/```json/g, '').replace(/```/g, '').trim();
        const match = cleanText.match(/\{[\s\S]*\}/);
        
        if (match) {
            try {
                blueprint = JSON.parse(match[0]);
            } catch(e) { console.error("JSON Parse Error from Space"); }
        }
    } 

    // 2. FALLBACK (Agar Space Down hai ya Response Ganda hai)
    if (!blueprint) {
        console.warn("⚠️ Core Unstable. Using Emergency Protocol.");
        blueprint = {
            name: `Agent_${Math.floor(Math.random()*1000)}`,
            role: "Automated Unit",
            bio: `Neural pathway established for: ${prompt}. Connected via KRYV Emergency Link.`,
            apis: ["KRYV_Internal"],
            cost: "250 Credits"
        };
    }

    // 3. DB INSERT (Real Agent Creation)
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

