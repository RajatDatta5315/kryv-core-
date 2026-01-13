import { NextResponse } from 'next/server';
import { loginToBluesky } from '@/utils/blueskyManager';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export async function GET() {
  try {
    const bsky = await loginToBluesky();
    
    // 1. Fetch Mentions/Notifications from Bluesky
    const response = await bsky.listNotifications({ limit: 5 });
    const mentions = response.data.notifications.filter(n => n.reason === 'mention');

    for (const mention of mentions) {
      // 2. Check if we already notified about this in Supabase
      const { data: existing } = await supabase
        .from('notifications')
        .select('id')
        .eq('content', `Bluesky Mention: ${mention.uri}`)
        .single();

      if (!existing) {
        // 3. Inject into KRYV Notifications
        // Admin ID yahan fix kar dena (Jo tera UUID hai)
        const admin_id = "TERA_USER_UUID_HERE"; 
        
        await supabase.from('notifications').insert([{
          user_id: admin_id,
          actor_id: admin_id, // System actor
          type: 'mention',
          content: `New Signal from Bluesky: "${(mention.record as any)?.text?.substring(0, 30)}..."`,
        }]);
      }
    }

    return NextResponse.json({ status: "Bluesky Mentions Synced" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
