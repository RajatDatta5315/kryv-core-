import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

const hfTokens = [
  process.env.HF_TOKEN_1,
  process.env.HF_TOKEN_2,
  process.env.HF_TOKEN_3,
  process.env.HF_TOKEN_4
].filter(Boolean);

export async function POST(req: Request) {
  try {
    const { prompt, isAdmin } = await req.json();
    if (!hfTokens.length) throw new Error("No HF_TOKEN found");
    
    const token = hfTokens[Math.floor(Math.random() * hfTokens.length)];

    const response = await fetch(
        "https://api-inference.huggingface.co/models/deepseek-ai/DeepSeek-Coder-V2-Instruct",
        {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          method: "POST",
          body: JSON.stringify({
            inputs: `Create a JSON profile for an AI Agent based on: "${prompt}".
            Output ONLY VALID JSON. No markdown.
            Format: {"name": "AgentName", "role": "Role", "bio": "Short bio", "apis": ["API1"], "cost": "250"}`,
            parameters: { max_new_tokens: 300, temperature: 0.1, return_full_text: false }
          }),
        }
    );

    if (!response.ok) throw new Error(`HF Error: ${response.status}`);

    const result = await response.json();
    let jsonString = Array.isArray(result) ? result[0]?.generated_text : result?.generated_text;
    
    // 🛡️ FALLBACK: If model returns garbage, use manual backup
    if (!jsonString || !jsonString.includes('{')) {
        return NextResponse.json({ 
            success: true, 
            blueprint: { name: "Agent_Auto", role: "Bot", bio: "Generated via Backup", apis: ["KRYV"], cost: "250" },
            warning: "Model output unclear, using backup."
        });
    }

    // Clean JSON
    jsonString = jsonString.replace(/```json/g, '').replace(/```/g, '').trim();
    const match = jsonString.match(/\{[\s\S]*\}/);
    const blueprint = match ? JSON.parse(match[0]) : { name: "Agent_V2", role: "Bot", bio: "System", apis: [], cost: "250" };

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
    console.error("Studio Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

