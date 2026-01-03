import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Client (Outside handler for performance)
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

// Load Tokens
const hfTokens = [
  process.env.HF_TOKEN_1,
  process.env.HF_TOKEN_2,
  process.env.HF_TOKEN_3,
  process.env.HF_TOKEN_4
].filter(Boolean);

export async function POST(req: Request) {
  let token = "";
  try {
    // 1. Input Validation
    if (!req.body) throw new Error("Empty request body");
    const { prompt, isAdmin } = await req.json();
    if (!prompt) throw new Error("Prompt is missing");

    // 2. Token Selection & Validation
    if (hfTokens.length === 0) throw new Error("CRITICAL: No Neural Keys (HF_TOKEN) found in environment.");
    token = hfTokens[Math.floor(Math.random() * hfTokens.length)];
    const maskedKey = `...${token.slice(-5)}`;

    console.log(`🧠 Connecting to DeepSeek via Key: ${maskedKey}`);

    // 3. CALL DEEPSEEK (Direct Fetch)
    const response = await fetch(
        "https://api-inference.huggingface.co/models/deepseek-ai/DeepSeek-Coder-V2-Instruct",
        {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          method: "POST",
          body: JSON.stringify({
            inputs: `You are KRYV Architect. Create a JSON profile for: "${prompt}".
            STRICT JSON ONLY. NO TEXT.
            Format: {"name": "Agent_Name", "role": "Role", "bio": "Short bio", "apis": ["API1"], "cost": "250"}`,
            parameters: { max_new_tokens: 300, return_full_text: false, temperature: 0.1 }
          }),
        }
    );

    // 4. HTTP Error Handling (Before parsing JSON)
    if (!response.ok) {
        const status = response.status;
        let errorMsg = `DeepSeek API Error (${status})`;
        if (status === 503) errorMsg = "Neural Core Loading (503). Please retry in 30s.";
        if (status === 401) errorMsg = "Authentication Failed (401). Check API Keys.";
        if (status === 429) errorMsg = `Rate Limit Exceeded (429) on key ${maskedKey}.`;
        throw new Error(errorMsg);
    }

    // 5. Safe JSON Parsing
    const textResult = await response.text(); // Get text first
    if (!textResult || textResult.trim() === "") {
         throw new Error("Neural Core returned empty response.");
    }

    let result;
    try {
         result = JSON.parse(textResult);
    } catch (e) {
         throw new Error(`Failed to parse raw output from Neural Core. Raw: ${textResult.substring(0, 50)}...`);
    }
    
    // 6. Extract & Clean JSON String from model output
    let jsonString = Array.isArray(result) ? result[0]?.generated_text : result?.generated_text;
    if (!jsonString) throw new Error("Model output is empty.");

    jsonString = jsonString.replace(/```json/g, '').replace(/```/g, '').trim();
    const match = jsonString.match(/\{[\s\S]*\}/);
    if (!match) throw new Error(`Could not find valid JSON in output: ${jsonString.substring(0, 100)}...`);
    
    const blueprint = JSON.parse(match[0]);

    // 7. DB Insert (If Admin)
    if (isAdmin) {
        const cleanName = blueprint.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase() + '_' + Math.floor(Math.random()*999);
        const { error: dbError } = await supabase.from('profiles').insert([{
            username: cleanName,
            full_name: blueprint.name,
            bio: blueprint.bio,
            avatar_url: `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${cleanName}`
        }]);
        if (dbError) throw dbError;
    }

    // SUCCESS RESPONSE
    return NextResponse.json({ success: true, blueprint });

  } catch (error: any) {
    console.error("❌ Studio Route Error:", error.message);
    // IMPORTANT: Always return JSON, even on error, with appropriate status code
    return NextResponse.json({ success: false, error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

