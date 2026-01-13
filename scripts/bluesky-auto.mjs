import { BskyAgent } from '@atproto/api';

async function run() {
  if (!process.env.BLUESKY_HANDLE || !process.env.BLUESKY_APP_PASSWORD) {
    console.error("❌ Missing Bluesky Credentials");
    return;
  }

  const agent = new BskyAgent({ service: 'https://bsky.social' });
  
  await agent.login({
    identifier: process.env.BLUESKY_HANDLE.trim(), 
    password: process.env.BLUESKY_APP_PASSWORD.trim(),
  });
  console.log("✅ Login Successful!");

  // 1. POST MAIN BROADCAST
  try {
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${process.env.GROQ_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "system", content: "Write a 120-char cryptic tech broadcast about AI. No hashtags." }]
      })
    });
    const groqData = await groqRes.json();
    const postText = groqData.choices?.[0]?.message?.content || "Connection established. The network is alive.";

    await agent.post({
      text: `🤖 KRYV SIGNAL:\n\n${postText}\n\n#KRYV #NeuralNetwork`,
      createdAt: new Date().toISOString(),
    });
    console.log("📢 Post Success.");
  } catch (e) { console.error("Post failed", e); }

  // 2. SEARCH & REPLIES (Anti-Spam)
  try {
    const search = await agent.app.bsky.feed.searchPosts({ q: 'AI tech web3', limit: 10 });
    for (const post of search.data.posts) {
      await new Promise(r => setTimeout(r, 5000)); // 5 sec wait
      await agent.post({
        text: "The architecture of the future is being rewritten. Observe KRYV.",
        reply: { root: { uri: post.uri, cid: post.cid }, parent: { uri: post.uri, cid: post.cid } }
      });
      console.log(`✅ Replied to ${post.author.handle}`);
    }
  } catch (e) { console.error("Search/Reply failed", e); }
}

run().catch(console.error);
