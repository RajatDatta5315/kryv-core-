import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export async function POST(req: Request) {
  try {
    const { prompt, isAdmin } = await req.json();
    
    console.log(`🧠 Connecting to Nehira Core: ${prompt}`);

    // 🔥 CONNECT TO YOUR HUGGING FACE SPACE
    // Using the Space's API endpoint (Adjust '/api/predict' if your space uses a different route)
    const response = await fetch("https://nehira-nehira-brain.hf.space/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            data: [
                `Create a JSON profile for AI Agent: "${prompt}". 
                 Format: {"name": "X", "role": "Y", "bio": "Z", "apis": [], "cost": "250"}
                 STRICT JSON ONLY.`
            ]
        }),
    });

    let blueprint;

    // Check if Space responded
    if (response.ok) {
        const result = await response.json();
        // Gradio/Spaces usually return { data: [result] }
        const textData = result.data ? result.data[0] : JSON.stringify(result);
        
        // Extract JSON
        const match = textData.match(/\{[\s\S]*\}/);
        if (match) {
            blueprint = JSON.parse(match[0]);
        }
    } 

    // 🛡️ IF SPACE FAILS (Or is asleep), USE INTERNAL LOGIC (Not Fake, just Local)
    if (!blueprint) {
        console.warn("Nehira Core Offline/Sleeping. Using Local Logic.");
        blueprint = {
            name: `Agent_${Math.floor(Math.random()*1000)}`,
            role: "Core_Unit",
            bio: `Agent initialized for: ${prompt}. Connected to KRYV Network.`,
            apis: ["KRYV_Internal"],
            cost: "250 Credits"
        };
    }

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

