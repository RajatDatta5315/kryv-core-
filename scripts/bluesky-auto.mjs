import { BskyAgent } from '@atproto/api';

async function run() {
  const agent = new BskyAgent({ service: 'https://bsky.social' });
  
  console.log(`🤖 Attempting login for: ${process.env.BLUESKY_HANDLE}`);
  await agent.login({
    identifier: process.env.BLUESKY_HANDLE.replace('https://', '').replace('/', ''), 
    password: process.env.BLUESKY_APP_PASSWORD,
  });
  console.log("✅ Login Successful!");

  // 1. GENERATE MAIN POST
  let postText = "The network is evolving. Connection established. #KRYV";
  try {
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "system", content: "Write a mysterious 120-char tech broadcast about AI. No hashtags." }]
      })
    });
    const groqData = await groqRes.json();
    if (groqData.choices && groqData.choices[0]) {
        postText = groqData.choices[0].message.content;
    }
  } catch (e) { console.log("⚠️ Groq Main Post Failed, using default."); }

  await agent.post({
    text: `🤖 BROADCAST:\n\n${postText}\n\n#KRYV #NeuralNetwork`,
    createdAt: new Date().toISOString(),
  });
  console.log("📢 Main Broadcast Posted.");

  // 2. SEARCH & COMMENT
  const search = await agent.app.bsky.feed.searchPosts({
    q: 'AI crypto web3',
    limit: 15 // Start small to be safe
  });

  for (const post of search.data.posts) {
    try {
      await new Promise(r => setTimeout(r, 3000)); // 3 sec delay

      const replyRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Authorization": `Bearer ${process.env.GROQ_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [{ role: "system", content: "Write a 1-sentence cryptic tech reply." },
                     { role: "user", content: post.record.text }]
        })
      });
      const replyData = await replyRes.json();
      
      if (replyData.choices && replyData.choices[0]) {
          await agent.post({
            text: replyData.choices[0].message.content,
            reply: { root: { uri: post.uri, cid: post.cid }, parent: { uri: post.uri, cid: post.cid } }
          });
          console.log(`✅ Replied to ${post.author.handle}`);
      }
    } catch (err) { console.log("⚠️ Skip comment."); }
  }
  console.log("🏁 Mission Finished.");
}

run().catch(e => { console.error(e); process.exit(1); });
