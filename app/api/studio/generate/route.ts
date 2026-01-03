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
    
    // 🕵️ SPY LOGIC: Check Keys
    if (hfTokens.length === 0) {
        throw new Error("CRITICAL: No HF_TOKEN found in Cloudflare Environment.");
    }

    const token = hfTokens[Math.floor(Math.random() * hfTokens.length)];
    // Mask key for safety in logs
    const maskedKey = `...${token.slice(-5)}`; 

    // 1. CALL DEEPSEEK
    console.log(`Attempting DeepSeek with Key: ${maskedKey}`);
    
    const response = await fetch(
        "https://api-inference.huggingface.co/models/deepseek-ai/DeepSeek-Coder-V2-Instruct",
        {
          headers: { 
              Authorization: `Bearer ${token}`, 
              "Content-Type": "application/json" 
          },
          method: "POST",
          body: JSON.stringify({
            inputs: `You are KRYV Architect. Create a JSON profile for: "${prompt}".
            Format: {"name": "Agent_Name", "role": "Role", "bio": "Bio", "apis": ["API1"], "cost": "250"}
            Output JSON only.`,
            parameters: { max_new_tokens: 250, return_full_text: false }
          }),
        }
    );

    // 🕵️ SPY LOGIC: Exact Error Reporting
    if (!response.ok) {
        const errText = await response.text();
        const status = response.status;
        
        if (status === 503) {
            throw new Error(`Model Loading (503): DeepSeek is waking up. Try again in 30s.`);
        } else if (status === 401) {
            throw new Error(`Auth Failed (401): Check HF_TOKEN in Cloudflare.`);
        } else if (status === 429) {
            throw new Error(`Rate Limit (429): Key ${maskedKey} exhausted.`);
        } else {
            throw new Error(`HF Error (${status}): ${errText}`);
        }
    }

    const result = await response.json();
    
    // 2. PARSE JSON
    let jsonString = Array.isArray(result) ? result[0]?.generated_text : result?.generated_text;
    if (!jsonString) throw new Error("Received Empty Response from Model.");

    jsonString = jsonString.replace(/```json/g, '').replace(/```/g, '').trim();
    const match = jsonString.match(/\{[\s\S]*\}/);
    if (!match) throw new Error(`Invalid JSON format received: ${jsonString.substring(0, 50)}...`);
    
    const blueprint = JSON.parse(match[0]);

    // 3. DB ENTRY
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
    // Return exact error to Frontend so you can see it in "Studio Logs"
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

