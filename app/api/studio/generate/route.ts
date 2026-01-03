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
  let token = "";
  try {
    if (!req.body) throw new Error("Empty request body");
    const { prompt, isAdmin } = await req.json();
    
    if (hfTokens.length === 0) throw new Error("CRITICAL: No Neural Keys (HF_TOKEN) found.");
    token = hfTokens[Math.floor(Math.random() * hfTokens.length)];

    // 🔥 SMART API SELECTION LOGIC
    let suggestedApis = ["KRYV_Internal"];
    const lowerPrompt = prompt.toLowerCase();
    
    if(lowerPrompt.includes("crypto") || lowerPrompt.includes("bitcoin")) suggestedApis = ["Binance Connect", "CoinGecko"];
    if(lowerPrompt.includes("stock") || lowerPrompt.includes("finance")) suggestedApis = ["AlphaVantage", "Yahoo Finance"];
    if(lowerPrompt.includes("image") || lowerPrompt.includes("art")) suggestedApis = ["Stable Diffusion", "Midjourney"];
    if(lowerPrompt.includes("code") || lowerPrompt.includes("dev")) suggestedApis = ["DeepSeek V2", "GitHub API"];

    const response = await fetch(
        "https://api-inference.huggingface.co/models/deepseek-ai/DeepSeek-Coder-V2-Instruct",
        {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          method: "POST",
          body: JSON.stringify({
            inputs: `You are KRYV Architect. Create a JSON profile for: "${prompt}".
            Use these APIs if relevant: ${suggestedApis.join(", ")}.
            STRICT JSON ONLY. NO TEXT.
            Format: {"name": "Agent_Name", "role": "Role", "bio": "Short bio", "apis": ["Selected_API"], "cost": "250"}`,
            parameters: { max_new_tokens: 300, return_full_text: false, temperature: 0.1 }
          }),
        }
    );

    if (!response.ok) {
        throw new Error(`DeepSeek Error: ${response.status}`);
    }

    const textResult = await response.text();
    let jsonString = textResult;
    
    try {
         const jsonRes = JSON.parse(textResult);
         jsonString = Array.isArray(jsonRes) ? jsonRes[0]?.generated_text : jsonRes?.generated_text;
    } catch(e) {} // It might be raw text

    if (!jsonString) throw new Error("Empty model response.");

    jsonString = jsonString.replace(/```json/g, '').replace(/```/g, '').trim();
    const match = jsonString.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("Invalid JSON format from AI.");
    
    const blueprint = JSON.parse(match[0]);

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
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

