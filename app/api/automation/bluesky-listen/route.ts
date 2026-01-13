import { NextResponse } from 'next/server';
import { loginToBluesky } from '@/utils/blueskyManager';
import { generateMarketingPost } from '@/utils/aiManager';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  try {
    const bsky = await loginToBluesky();
    
    // 1. Fetch Mentions/Notifications from Bluesky
    const response = await bsky.listNotifications({ limit: 10 });
    const mentions = response.data.notifications.filter(n => n.reason === 'mention' && !n.isRead);

    if (mentions.length === 0) {
        return NextResponse.json({ status: "No new mentions" });
    }

    for (const mention of mentions) {
      const uri = mention.uri;
      const cid = mention.cid;
      const author = mention.author.handle;
      const text = (mention.record as any)?.text || "";

      // 2. Check if we already handled this mention in Supabase
      const { data: existing } = await supabase
        .from('notifications')
        .select('id')
        .eq('content', `BSKY_REPLY_${uri}`)
        .single();

      if (!existing) {
        console.log(`📡 New mention from @${author}: ${text}`);

        // 3. Generate Smart AI Reply using Groq
        const replyText = await generateMarketingPost(
            `User @${author} said: "${text}". Give a short, futuristic KRYV-style reply.`
        );

        // 4. Post Reply to Bluesky
        await bsky.post({
          text: replyText,
          reply: {
            root: { uri: uri, cid: cid },
            parent: { uri: uri, cid: cid }
          },
          createdAt: new Date().toISOString(),
        });

        // 5. Notify the Architect (Admin) in KRYV
        // NOTE: Replace this UUID with your real profile ID from Supabase
        const ADMIN_ID = "63d76b1e-xxxx-xxxx-xxxx-xxxxxxxxxxxx"; 
        
        await supabase.from('notifications').insert([{
          user_id: ADMIN_ID,
          actor_id: ADMIN_ID, 
          type: 'mention',
          content: `BSKY_REPLY_${uri}`, // Marker to avoid double replies
          metadata: { bsky_user: author, msg: text } // Optional extra info
        }]);
      }
    }

    // Mark notifications as read on Bluesky
    await bsky.updateSeenNotifications();

    return NextResponse.json({ success: true, count: mentions.length });
  } catch (error: any) {
    console.error("Bluesky Listen Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
