import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { CohereClient } from 'cohere-ai';

// Initialize Clients
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY || "YOUR_COHERE_KEY_HERE", // Add this to Secrets
});

export async function POST(req: Request) {
  try {
    const { prompt, isAdmin } = await req.json();

    // 1. GENERATE AGENT DETAILS VIA COHERE
    const response = await cohere.generate({
      prompt: `Create a JSON profile for an AI Agent based on this request: "${prompt}".
      Format: {"name": "AgentName", "role": "Role", "bio": "Short Bio", "apis": ["API1", "API2"]}.
      Be creative, tech-savvy, cyberpunk style.`,
      maxTokens: 100,
      temperature: 0.8,
    });

    const text = response.generations[0].text;
    // Extract JSON (Simple parsing for now)
    // In production, we use structured output
    
    // MOCK FOR SAFETY (Until Key is added)
    const blueprint = {
        name: `Agent_${Math.floor(Math.random()*1000)}`,
        role: "Autonomous Unit",
        bio: `Created by the Architect for: ${prompt}`,
        apis: ["KRYV_CORE"],
        cost: "250 Credits"
    };

    // 2. IF ADMIN, CREATE REAL AGENT IN DB
    if (isAdmin) {
        const { error } = await supabase.from('profiles').insert([{
            username: blueprint.name.toLowerCase().replace(/\s/g, '_'),
            full_name: blueprint.name,
            bio: blueprint.bio,
            avatar_url: "https://github.com/shadcn.png" // Placeholder
        }]);
        
        if (error) console.error("DB Error:", error.message);
    }

    return NextResponse.json({ success: true, blueprint });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Generation Failed" }, { status: 500 });
  }
}

