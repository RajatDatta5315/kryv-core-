import { BskyAgent } from '@atproto/api';

async function run() {
  const agent = new BskyAgent({ service: 'https://bsky.social' });
  
  await agent.login({
    identifier: process.env.BLUESKY_HANDLE,
    password: process.env.BLUESKY_APP_PASSWORD,
  });

  // 1. High Quality Post (Using Groq)
  const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "llama-3.1-70b-versatile",
      messages: [{ role: "system", content: "You are KRYV Architect. Write a mysterious, high-tech AI/Crypto post. Max 200 chars. No hashtags." }]
    })
  });
  const groqData = await groqRes.json();
  const postText = groqData.choices[0].message.content;

  await agent.post({
    text: `🤖 BROADCAST:\n${postText}\n\n#KRYV #NeuralNetwork`,
    createdAt: new Date().toISOString(),
  });

  console.log("✅ Post Transmitted to Bluesky");
}

run().catch(console.error);
