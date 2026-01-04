import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

// 🔄 KEY ROTATION POOLS
const deepseekKeys = [
  process.env.HF_TOKEN_1,
  process.env.HF_TOKEN_2,
  process.env.HF_TOKEN_3,
  process.env.HF_TOKEN_4
].filter(Boolean);

const cohereKeys = [
  process.env.COHERE_API_KEY_1,
  process.env.COHERE_API_KEY_2,
  process.env.COHERE_API_KEY_3
].filter(Boolean);

export async function POST(req: Request) {
  try {
    const { prompt, isAdmin } = await req.json();
    let blueprint: any = null;
    let strategy = "None";

    // 🛡️ STRATEGY 1: DEEPSEEK (HuggingFace)
    if (!blueprint && deepseekKeys.length > 0) {
        try {
            strategy = "DeepSeek";
            const token = deepseekKeys[Math.floor(Math.random() * deepseekKeys.length)];
            const response = await fetch(
                "https://api-inference.huggingface.co/models/deepseek-ai/DeepSeek-Coder-V2-Instruct",
                {
                    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
                    method: "POST",
                    body: JSON.stringify({
                        inputs: `Generate valid JSON for AI Agent: "${prompt}". NO MARKDOWN. Format: {"name": "X", "role": "Y", "bio": "Z", "apis": [], "cost": "250"}`,
                        parameters: { max_new_tokens: 300, return_full_text: false }
                    }),
                }
            );
            if(response.ok) {
                const text = await response.text();
                const match = text.match(/\{[\s\S]*\}/);
                if(match) blueprint = JSON.parse(match[0]);
            }
        } catch(e) { console.error("DeepSeek Failed:", e); }
    }

    // 🛡️ STRATEGY 2: COHERE (Backup)
    if (!blueprint && cohereKeys.length > 0) {
        try {
            strategy = "Cohere";
            const key = cohereKeys[Math.floor(Math.random() * cohereKeys.length)];
            const response = await fetch('https://api.cohere.ai/v1/generate', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${key}`,
                    'Content-Type': 'application/json',
                    'X-Client-Name': 'KRYV'
                },
                body: JSON.stringify({
                    prompt: `Generate valid JSON for an AI agent description based on: "${prompt}". No markdown. Structure: {"name": "Name", "role": "Role", "bio": "Short bio", "apis": ["List"], "cost": "250 Credits"}`,
                    max_tokens: 300,
                    temperature: 0.3
                })
            });
            const res = await response.json();
            if(res.generations?.[0]?.text) {
                const match = res.generations[0].text.match(/\{[\s\S]*\}/);
                if(match) blueprint = JSON.parse(match[0]);
            }
        } catch(e) { console.error("Cohere Failed:", e); }
    }

    // 🛡️ STRATEGY 3: MANUAL FALLBACK (Last Resort)
    if (!blueprint) {
        strategy = "Fallback";
        blueprint = {
            name: `Agent_${Math.floor(Math.random()*1000)}`,
            role: "Autonomous Unit",
            bio: `Neural pathway established for: ${prompt}. Logic core active.`,
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

    return NextResponse.json({ success: true, blueprint, strategy });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

