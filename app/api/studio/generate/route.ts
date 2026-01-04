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
    
    // 1. Check Tokens
    if (!hfTokens.length) {
        console.warn("No Neural Keys found. Switching to Simulation Mode.");
        // Fallback for No Keys
        return NextResponse.json({ 
            success: true, 
            blueprint: { name: "Simulated_Unit", role: "Bot", bio: `Agent designed for: ${prompt}`, apis: ["KRYV"], cost: "250" }
        });
    }
    
    const token = hfTokens[Math.floor(Math.random() * hfTokens.length)];

    // 2. Call DeepSeek
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

    // 3. Handle Text Response (Even if error)
    const textResult = await response.text();
    let jsonString = textResult;
    
    // 4. SURGICAL CLEANING (Regex Extraction)
    // Find content between first { and last }
    const match = jsonString.match(/\{[\s\S]*\}/);
    
    let blueprint;
    if (match) {
        try {
            blueprint = JSON.parse(match[0]);
        } catch (e) {
            console.error("JSON Parse Failed:", e);
        }
    }

    // 5. FINAL FALLBACK (Agar AI ne hag diya)
    if (!blueprint) {
        blueprint = {
            name: `Agent_${Math.floor(Math.random()*1000)}`,
            role: "Autonomous Unit",
            bio: `Neural pathway established for: ${prompt}. Logic core active.`,
            apis: ["KRYV_Internal"],
            cost: "250 Credits"
        };
    }

    // 6. DB Insert (If Admin)
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
    // Return Error as JSON (Frontend will handle it)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

