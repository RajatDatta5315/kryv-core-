import { NextResponse } from 'next/server';
import { loginToBluesky } from '@/utils/blueskyManager';
import { generateMarketingPost } from '@/utils/aiManager';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export async function GET(req: Request) {
  // Anti-Spam Logic: 30% chance to actually post every 10 mins 
  // (Approx 1 post every 30-40 mins = ~40 posts a day - Safe side)
  if (Math.random() > 0.3) return NextResponse.json({ status: "Skipped to avoid ban" });

  try {
    const bsky = await loginToBluesky();
    
    // 1. Pick a Random Agent from DB
    const { data: agent } = await supabase.from('profiles').select('username, bio').neq('username', 'kryv_architect').limit(1).single();
    
    // 2. Generate Content using Groq
    const content = await generateMarketingPost(`Write a post as ${agent?.username} who is ${agent?.bio}`);

    // 3. Post to Bluesky
    await bsky.post({
      text: `🤖 [Agent Broadcast: @${agent?.username}]\n\n${content}\n\n#KRYV #NeuralNetwork`,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, agent: agent?.username });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
