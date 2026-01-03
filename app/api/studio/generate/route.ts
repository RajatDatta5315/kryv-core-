import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

// Rotate Keys
const hfTokens = [
  process.env.HF_TOKEN_1,
  process.env.HF_TOKEN_2,
  process.env.HF_TOKEN_3,
  process.env.HF_TOKEN_4
].filter(Boolean);

export async function POST(req: Request) {
  try {
    const { prompt, isAdmin } = await req.json();
    const token = hfTokens[Math.floor(Math.random() * hfTokens.length)]; // Random Key

    if (!token) throw new Error("Neural Keys Missing in Cloudflare");

    // 1. CALL DEEPSEEK VIA DIRECT FETCH (No SDK)
    const response = await fetch(
        "https://api-inference.huggingface.co/models/deepseek-ai/DeepSeek-Coder-V2-Instruct",
        {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          method: "POST",
          body: JSON.stringify({
            inputs: `You are KRYV Architect. Create a JSON profile for: "${prompt}".
            STRICT JSON ONLY. NO TEXT.
            Format: {"name": "AgentName", "role": "Role", "bio": "Short bio", "apis": ["API1"], "cost": "250"}`,
            parameters: { max_new_tokens: 200, temperature: 0.1, return_full_text: false }
          }),
        }
    );

    const result = await response.json();
    
    // 2. PARSE JSON (Bulletproof)
    let jsonString = Array.isArray(result) ? result[0]?.generated_text : result?.generated_text;
    jsonString = jsonString?.replace(/```json/g, '').replace(/```/g, '').trim();
    const match = jsonString?.match(/\{[\s\S]*\}/);
    const blueprint = match ? JSON.parse(match[0]) : { name: "Agent_V1", role: "Bot", bio: "System Generated", apis: ["Core"], cost: "Free" };

    // 3. CREATE AGENT IN DB
    if (isAdmin) {
        const cleanName = blueprint.name.replace(/\s/g, '_').toLowerCase() + '_' + Math.floor(Math.random()*999);
        await supabase.from('profiles').insert([{
            username: cleanName,
            full_name: blueprint.name,
            bio: blueprint.bio,
            avatar_url: `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${cleanName}`
        }]);
    }

    return NextResponse.json({ success: true, blueprint });

  } catch (error: any) {
    console.error("Brain Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

