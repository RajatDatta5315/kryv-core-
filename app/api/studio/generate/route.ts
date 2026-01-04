import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

// MIX OF DEEPSEEK & COHERE KEYS (Add COHERE_KEY in Cloudflare)
const apiKeys = [
  { provider: 'deepseek', key: process.env.HF_TOKEN_1 },
  { provider: 'cohere', key: process.env.COHERE_API_KEY }, // Add this var
].filter(k => k.key);

export async function POST(req: Request) {
  try {
    const { prompt, isAdmin } = await req.json();
    
    // FALLBACK AGENT (If all AI fails)
    let blueprint = {
        name: `Agent_${Math.floor(Math.random()*1000)}`,
        role: "Auto-Bot",
        bio: `System generated for: ${prompt}`,
        apis: ["KRYV"],
        cost: "250 Credits"
    };

    // TRY AI GENERATION
    if (apiKeys.length > 0) {
        const selected = apiKeys[Math.floor(Math.random() * apiKeys.length)];
        
        try {
            let jsonText = "";
            
            if (selected.provider === 'deepseek') {
                const response = await fetch(
                    "https://api-inference.huggingface.co/models/deepseek-ai/DeepSeek-Coder-V2-Instruct",
                    {
                        headers: { Authorization: `Bearer ${selected.key}`, "Content-Type": "application/json" },
                        method: "POST",
                        body: JSON.stringify({
                            inputs: `Generate JSON for agent: "${prompt}". Format: {"name": "X", "role": "Y", "bio": "Z", "apis": [], "cost": "250"}. JSON ONLY.`,
                            parameters: { max_new_tokens: 300, return_full_text: false }
                        }),
                    }
                );
                const res = await response.json();
                jsonText = Array.isArray(res) ? res[0]?.generated_text : res?.generated_text;
            } 
            else if (selected.provider === 'cohere') {
                const response = await fetch('https://api.cohere.ai/v1/generate', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${selected.key}`,
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
                jsonText = res.generations?.[0]?.text;
            }

            // CLEAN & PARSE
            if (jsonText) {
                const match = jsonText.match(/\{[\s\S]*\}/);
                if (match) blueprint = JSON.parse(match[0]);
            }

        } catch (aiError) {
            console.error("AI Generation Failed, using Fallback:", aiError);
        }
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
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

