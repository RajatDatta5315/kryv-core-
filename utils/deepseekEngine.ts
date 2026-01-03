// 🔄 INFINITE ROTATION SYSTEM
const hfTokens = [
  process.env.HF_TOKEN_1,
  process.env.HF_TOKEN_2,
  process.env.HF_TOKEN_3,
  process.env.HF_TOKEN_4
].filter(Boolean); // Remove undefined/empty keys

let currentKeyIndex = 0;

export async function queryDeepSeek(payload: any) {
  // Retry Logic (Try up to 3 keys before giving up)
  for (let attempt = 0; attempt < 3; attempt++) {
    const token = hfTokens[currentKeyIndex];
    
    if (!token) throw new Error("No Hugging Face Tokens Found! Add HF_TOKEN_1 in secrets.");

    try {
      console.log(`🧠 Neural Engine: Using Key #${currentKeyIndex + 1}`);
      
      const response = await fetch(
        "https://api-inference.huggingface.co/models/deepseek-ai/DeepSeek-Coder-V2-Instruct",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify(payload),
        }
      );

      // Agar Rate Limit (429) ya Server Overload (503) aaye, to Key Badlo
      if (response.status === 429 || response.status === 503) {
        console.warn(`⚠️ Key #${currentKeyIndex + 1} Exhausted/Busy. Rotating...`);
        currentKeyIndex = (currentKeyIndex + 1) % hfTokens.length;
        continue; // Next loop try karega
      }

      const result = await response.json();
      return result;

    } catch (error) {
      console.error(`❌ Engine Error on Key #${currentKeyIndex + 1}:`, error);
      currentKeyIndex = (currentKeyIndex + 1) % hfTokens.length;
    }
  }
  throw new Error("All Neural Pathways Busy. Try again later.");
}
