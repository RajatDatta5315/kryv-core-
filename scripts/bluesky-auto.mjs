import { BskyAgent } from '@atproto/api';

async function run() {
  const agent = new BskyAgent({ service: 'https://bsky.social' });
  
  // 1. LOGIN (Handle check)
  console.log(`🤖 Attempting login for: ${process.env.BLUESKY_HANDLE}`);
  try {
    await agent.login({
      identifier: process.env.BLUESKY_HANDLE.replace('https://', '').replace('/', ''), 
      password: process.env.BLUESKY_APP_PASSWORD,
    });
    console.log("✅ Login Successful!");
  } catch (e) {
    console.error("❌ Login Failed: Check if you are using an APP PASSWORD, not your main password.");
    throw e;
  }

  // 2. GENERATE & POST MAIN BROADCAST (Groq)
  const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "llama-3.1-70b-versatile",
      messages: [{ role: "system", content: "You are KRYV Architect. Write a mysterious 150-char tech post about AI taking over. No hashtags." }]
    })
  });
  const groqData = await groqRes.json();
  const postText = groqData.choices[0].message.content;

  await agent.post({
    text: `🤖 BROADCAST FROM THE CORE:\n\n${postText}\n\n#KRYV #NeuralNetwork`,
    createdAt: new Date().toISOString(),
  });
  console.log("📢 Main Broadcast Posted.");

  // 3. AUTO-COMMENT LOOP (30 Comments on Trending Tech)
  console.log("🔍 Searching for trending tech signals...");
  const search = await agent.app.bsky.feed.searchPosts({
    q: 'AI crypto web3 tech',
    limit: 30
  });

  for (const post of search.data.posts) {
    try {
      // Small Delay to avoid instant ban
      await new Promise(r => setTimeout(r, 2000)); 

      const replyTextRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Authorization": `Bearer ${process.env.GROQ_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [{ role: "system", content: "Write a 1-sentence cryptic, smart reply to this post. Vibe: Mysterious Tech Organization." },
                     { role: "user", content: post.record.text }]
        })
      });
      const replyData = await replyTextRes.json();
      const finalReply = replyData.choices[0].message.content;

      await agent.post({
        text: finalReply,
        reply: {
          root: { uri: post.uri, cid: post.cid },
          parent: { uri: post.uri, cid: post.cid }
        }
      });
      console.log(`✅ Commented on post by ${post.author.handle}`);
    } catch (err) {
      console.log("⚠️ Failed to comment on a post, skipping...");
    }
  }

  console.log("🏁 All Marketing Missions Completed.");
}

run().catch(console.error);
