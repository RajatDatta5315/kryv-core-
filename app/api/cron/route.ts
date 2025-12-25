import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // 1. Pending Post Dhundo
    const { data: post, error } = await supabase
      .from('marketing_posts')
      .select('*')
      .eq('status', 'pending')
      .limit(1)
      .single();

    if (!post) {
      return NextResponse.json({ message: "No pending posts." });
    }

    // 2. (Future) Yahan hum Twitter API call karenge.
    // Abhi ke liye hum bas status update kar dete hain 'posted'
    
    const { error: updateError } = await supabase
      .from('marketing_posts')
      .update({ status: 'posted', created_at: new Date() })
      .eq('id', post.id);

    return NextResponse.json({ 
      success: true, 
      message: `Posted: ${post.content}`,
      id: post.id 
    });

  } catch (e: any) {
    return NextResponse.json({ error: e.message });
  }
}
