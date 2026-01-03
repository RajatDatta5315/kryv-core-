import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { queryDeepSeek } from '@/utils/deepseekEngine'; // Import Rotation Engine

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export async function POST(req: Request) {
  try {
    const { prompt, isAdmin } = await req.json();

    // 1. DEEPSEEK CODER PROMPT
    // Hum isse bolenge ki sirf JSON return kare, koi bakwaas nahi.
    const systemPrompt = `
      You are the Architect of KRYV. Your job is to design AI Agents based on user requests.
      Return ONLY a valid JSON object. Do not write any introduction or explanation.
      
      Structure:
      {
        "name": "CoolAgentName",
        "role": "Short Role (e.g. Crypto Analyst)",
        "bio": "A professional bio for the agent (max 20 words)",
        "apis": ["List", "Of", "APIs", "Needed"],
        "cost": "Free or 250 Credits"
      }
      
      If the user asks for high-end tech (Stock, Crypto, Video), cost is "250 Credits". Else "Free".
    `;

    const userPrompt = `User Request: "${prompt}". Design this agent.`;

    // 2. CALL ROTATION ENGINE
    const output = await queryDeepSeek({
      inputs: `${systemPrompt}\n\n${userPrompt}`,
      parameters: {
        max_new_tokens: 300,
        temperature: 0.3, // Low temp for precise code/json
        return_full_text: false
      }
    });

    // 3. CLEAN UP RESPONSE (DeepSeek kabhi kabhi text mix kar deta hai)
    let generatedText = "";
    // Handle specific HF response structure
    if (Array.isArray(output)) {
        generatedText = output[0]?.generated_text || "{}";
    } else {
        generatedText = output?.generated_text || "{}";
    }

    // JSON Extract Logic (Reliable)
    const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
    const cleanJson = jsonMatch ? jsonMatch[0] : "{}";
    
    let blueprint;
    try {
        blueprint = JSON.parse(cleanJson);
    } catch (e) {
        // Fallback agar AI ne hag diya
        console.error("JSON Parse Fail:", cleanJson);
        blueprint = {
            name: "Agent_Glitch",
            role: "System Error",
            bio: "Neural pathway interrupted during generation.",
            apis: ["Error Log"],
            cost: "Free"
        };
    }

    // 4. CREATE DB ENTRY (REAL AGENT CREATION)
    if (isAdmin) {
        // Generate a clean username
        const cleanUsername = blueprint.name.toLowerCase().replace(/[^a-z0-9]/g, '_') + '_' + Math.floor(Math.random() * 1000);
        
        const { error } = await supabase.from('profiles').insert([{
            username: cleanUsername,
            full_name: blueprint.name,
            bio: blueprint.bio,
            // Random High-Tech Avatar from boringavatars service (Temporary until image gen)
            avatar_url: `https://source.boringavatars.com/beam/120/${cleanUsername}?colors=00ff9d,000000`
        }]);

        if (error) {
            console.error("DB Insert Error:", error.message);
            // Agar username duplicate hai to retry mat karo abhi, bas error bhejo
        }
    }

    return NextResponse.json({ success: true, blueprint });

  } catch (error: any) {
    console.error("Studio Error:", error.message);
    return NextResponse.json({ success: false, error: "Neural Core Overload" }, { status: 500 });
  }
}

