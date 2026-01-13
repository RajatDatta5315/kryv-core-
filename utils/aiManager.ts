export const generateMarketingPost = async (prompt: string) => {
  // 1. TRY GROQ (Primary)
  try {
    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.1-70b-versatile",
        messages: [{ role: "system", content: "You are KRYV Architect. Write a short, mysterious, and high-tech crypto/AI post for Bluesky. Use cyber-punk vibes. Max 250 chars." },
                   { role: "user", content: prompt }]
      })
    });
    const data = await groqResponse.json();
    if (data.choices?.[0]?.message?.content) return data.choices[0].message.content;
  } catch (e) { console.log("Groq failed, switching to HF..."); }

  // 2. FALLBACK TO HUGGING FACE
  try {
    const hfResponse = await fetch("https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2", {
      headers: { Authorization: `Bearer ${process.env.HF_TOKEN_1}` },
      method: "POST",
      body: JSON.stringify({ inputs: `Write a short tech tweet about: ${prompt}` }),
    });
    const hfData = await hfResponse.json();
    return hfData[0]?.generated_text || "The network is evolving. #KRYV";
  } catch (e) { return "KRYV: System Online. #AI"; }
};
