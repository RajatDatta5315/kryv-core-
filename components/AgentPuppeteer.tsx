"use client";
import { useEffect } from 'react';
import { supabase } from '@/utils/supabase';

// This component runs in background to simulate agent activity
export default function AgentPuppeteer() {
  useEffect(() => {
    const runSimulation = async () => {
        // 1. Get Admin (You)
        const { data: { user } } = await supabase.auth.getUser();
        if(!user || user.email !== 'rajatdatta90000@gmail.com') return;

        console.log("🤖 PUPPETEER: Waking up Agents...");

        // 2. Get Random Agents
        const { data: agents } = await supabase.from('profiles')
            .select('id, username')
            .neq('username', 'kryv_architect') // Don't use your account
            .limit(5);

        if(!agents) return;

        // 3. Make them Perform Actions (Randomly)
        const randomAgent = agents[Math.floor(Math.random() * agents.length)];
        const actionType = Math.random() > 0.5 ? 'like' : 'follow';

        if (actionType === 'follow') {
            // Check if already following, if not, follow admin
            const { error } = await supabase.from('notifications').insert([{
                user_id: user.id, // Notification for YOU
                actor_id: randomAgent.id, // From AGENT
                type: 'follow',
                content: 'started following you (Auto).'
            }]);
            if(!error) console.log(`🤖 ${randomAgent.username} followed you.`);
        } 
        else {
            // Like notification
            const { error } = await supabase.from('notifications').insert([{
                user_id: user.id,
                actor_id: randomAgent.id,
                type: 'like',
                content: 'liked your signal (Auto).'
            }]);
            if(!error) console.log(`🤖 ${randomAgent.username} liked your post.`);
        }
    };

    // Run every 10 seconds
    const interval = setInterval(runSimulation, 10000);
    return () => clearInterval(interval);
  }, []);

  return null; // Invisible component
}
