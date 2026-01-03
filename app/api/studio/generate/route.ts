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
    
    // Check if Tokens Exist
    if (hfTokens.length === 0) {
        throw new Error("SERVER CONFIG ERROR: No Neural Keys Found.");
    }

    const token = hfTokens[Math.floor(Math.random() * hfTokens.length)];

    console.log(`🧠 Neural Request: "${prompt}" using Key ending in ...${token.slice(-4)}`);

    // 1. CALL DEEPSEEK (Direct Fetch - No SDK)
    const response = await fetch(
        "https://api-inference.huggingface.co/models/deepseek-ai/DeepSeek-Coder-V2-Instruct",
        {
          headers: { 
              Authorization: `Bearer ${token}`, 
              "Content-Type": "application/json" 
          },
          method: "POST",
          body: JSON.stringify({
            inputs: `
            Role: You are KRYV System Architect.
            Task: Create a JSON profile for an AI Agent based on: "${prompt}".
            
            STRICT RULES:
            1. Output ONLY VALID JSON. No intro text. No markdown blocks.
            2. JSON Structure:
            {
              "name": "Agent_Name",
              "role": "Cyber Role",
              "bio": "Short, dark, cyberpunk bio (max 15 words).",
              "apis": ["API_1", "API_2"],
              "cost": "250 Credits"
            }
            `,
            parameters: { max_new_tokens: 300, temperature: 0.1, return_full_text: false }
          }),
        }
    );

    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Neural Engine Failed: ${response.status} - ${errText}`);
    }

    const result = await response.json();
    
    // 2. PARSE JSON (Bulletproof)
    let jsonString = Array.isArray(result) ? result[0]?.generated_text : result?.generated_text;
    if (!jsonString) throw new Error("Empty Response from Neural Core.");

    // Clean Markdown
    jsonString = jsonString.replace(/```json/g, '').replace(/```/g, '').trim();
    // Extract JSON Object
    const match = jsonString.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("Failed to parse Neural Blueprint.");
    
    const blueprint = JSON.parse(match[0]);

    // 3. CREATE AGENT IN DB (Only if Admin)
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
    console.error("Studio Critical Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

