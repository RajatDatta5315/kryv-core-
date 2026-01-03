import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { queryDeepSeek } from '@/utils/deepseekEngine';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export async function POST(req: Request) {
  try {
    const { prompt, isAdmin } = await req.json();

    // 1. CALL DEEPSEEK (Via Rotation Engine)
    // Hum strictly bolenge ki sirf JSON do.
    const output = await queryDeepSeek({
      inputs: `
      You are the System Architect of KRYV.
      User Request: "${prompt}"
      
      Task: Create a JSON profile for an AI Agent based on the request.
      
      STRICT RULES:
      1. Output ONLY JSON. No intro, no markdown, no explanation.
      2. If user asks for high-tech (crypto, stock, hacking), cost is "250 Credits". Else "FREE".
      3. Format:
      {
        "name": "Agent_Name_V1",
        "role": "Role Title",
        "bio": "Short, cyberpunk bio under 15 words.",
        "apis": ["API_Name_1", "API_Name_2"],
        "cost": "FREE"
      }
      `,
      parameters: { max_new_tokens: 200, temperature: 0.1, return_full_text: false }
    });

    // 2. PARSING MAGIC (Bulletproof)
    let jsonString = "";
    
    // HuggingFace ka response kabhi Array hota hai kabhi Object
    if (Array.isArray(output)) {
        jsonString = output[0]?.generated_text || "{}";
    } else if (output?.generated_text) {
        jsonString = output.generated_text;
    } else {
        throw new Error("Invalid Neural Response");
    }

    // JSON ko clean karo (Markdown remove karo)
    jsonString = jsonString.replace(/```json/g, '').replace(/```/g, '').trim();
    // Kabhi kabhi wo text ke beech mein JSON deta hai, usse extract karo
    const match = jsonString.match(/\{[\s\S]*\}/);
    if (match) jsonString = match[0];

    const blueprint = JSON.parse(jsonString);

    // 3. DATABASE ENTRY (REAL AGENT)
    if (isAdmin) {
        const cleanName = blueprint.name.replace(/\s/g, '_').toLowerCase() + '_' + Math.floor(Math.random()*999);
        const { error } = await supabase.from('profiles').insert([{
            username: cleanName,
            full_name: blueprint.name,
            bio: blueprint.bio,
            avatar_url: `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${cleanName}` // Auto Robot Avatar
        }]);
        if(error) console.error("DB Error:", error.message);
    }

    return NextResponse.json({ success: true, blueprint });

  } catch (error: any) {
    console.error("Studio Error:", error);
    return NextResponse.json({ success: false, error: error.message || "Neural Link Severed" }, { status: 500 });
  }
}

