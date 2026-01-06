import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export async function POST(req: Request) {
  try {
    // 1. Check Body
    const body = await req.json().catch(() => null);
    if (!body) throw new Error("Request body is empty or invalid JSON.");
    
    const { prompt, isAdmin } = body;
    console.log(`[STUDIO] Processing: ${prompt?.substring(0, 20)}...`);

    // 2. Check Environment Variables (Root Cause Check)
    const hfToken = process.env.HF_TOKEN_1;
    const cohereKey = process.env.COHERE_API_KEY_1;
    
    if (!hfToken && !cohereKey) {
        console.error("[CRITICAL] No API Keys found in Environment.");
        throw new Error("Server Configuration Error: API Keys Missing.");
    }

    let blueprint = null;
    let errorLog = "";

    // 3. TRY DEEPSEEK
    if (hfToken) {
        try {
            console.log("[STUDIO] Attempting DeepSeek...");
            const response = await fetch(
                "https://api-inference.huggingface.co/models/deepseek-ai/DeepSeek-Coder-V2-Instruct",
                {
                    headers: { Authorization: `Bearer ${hfToken}`, "Content-Type": "application/json" },
                    method: "POST",
                    body: JSON.stringify({
                        inputs: `Generate valid JSON for AI Agent: "${prompt}". Format: {"name": "X", "role": "Y", "bio": "Z", "apis": [], "cost": "250"}`,
                        parameters: { max_new_tokens: 300, return_full_text: false }
                    }),
                }
            );
            
            if (response.ok) {
                const res = await response.json();
                const text = Array.isArray(res) ? res[0]?.generated_text : res?.generated_text;
                const match = text?.match(/\{[\s\S]*\}/);
                if (match) blueprint = JSON.parse(match[0]);
            } else {
                errorLog += `DeepSeek Error: ${response.status}; `;
            }
        } catch (e: any) { errorLog += `DeepSeek Fail: ${e.message}; `; }
    }

    // 4. TRY COHERE (Backup)
    if (!blueprint && cohereKey) {
        try {
            console.log("[STUDIO] Switching to Cohere...");
            const response = await fetch('https://api.cohere.ai/v1/generate', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${cohereKey}`,
                    'Content-Type': 'application/json',
                    'X-Client-Name': 'KRYV'
                },
                body: JSON.stringify({
                    prompt: `Generate JSON for agent: "${prompt}". Structure: {"name": "Name", "role": "Role", "bio": "Bio", "apis": [], "cost": "250"}`,
                    max_tokens: 300
                })
            });
            const res = await response.json();
            const text = res.generations?.[0]?.text;
            const match = text?.match(/\{[\s\S]*\}/);
            if (match) blueprint = JSON.parse(match[0]);
        } catch (e: any) { errorLog += `Cohere Fail: ${e.message}; `; }
    }

    // 5. SUCCESS or ERROR
    if (blueprint) {
        // Save to DB if Admin
        if (isAdmin) {
            const cleanName = blueprint.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
            await supabase.from('profiles').insert([{
                username: cleanName + '_' + Math.floor(Math.random()*100),
                full_name: blueprint.name,
                bio: blueprint.bio,
                avatar_url: `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${cleanName}`
            }]);
        }
        return NextResponse.json({ success: true, blueprint });
    } else {
        // Return exact error log to Frontend
        throw new Error(`All AI Cores Failed. Logs: ${errorLog}`);
    }

  } catch (error: any) {
    console.error("[STUDIO ERROR]", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

