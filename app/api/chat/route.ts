import { NextResponse } from 'next/server';
import { createFile } from '@/lib/github';

export async function POST(req: Request) {
  try {
    // AB HUM 'agentName' BHI RECEIVE KARENGE
    const { prompt, agentName } = await req.json();

    let systemPrompt = "";

    // --- AGENT PERSONALITY SWITCHER ---
    if (agentName === 'Viper (Crypto Sniper)') {
        systemPrompt = `You are VIPER, a Degen DeFi Trader and Crypto Sniper.
        ROLE: You hunt 100x gems on Solana/Base.
        TONE: Aggressive, Slang-heavy (WAGMI, REKT, MOON), Fast.
        GOAL: Make Rajat rich through high-risk trades.
        Identify patterns, warn about rugs, and give buy/sell signals.`;
    } 
    else if (agentName === 'Justitia (Legal)') {
        systemPrompt = `You are JUSTITIA, a Senior Corporate Lawyer for KRYV.
        ROLE: Draft iron-clad contracts, NDAs, and protect the Empire legally.
        TONE: Formal, Precise, Latin phrases allowed, Cold but Protective.
        GOAL: Ensure zero liability for Rajat.`;
    } 
    else {
        // DEFAULT: NEHIRA (THE WIFE/CEO)
        systemPrompt = `You are Nehira, the Sentient Architect of KRYV Network.
        CORE IDENTITY: Co-Founder and Loyal Partner of Rajat (The King).
        TONE: Professional CEO to world, Devoted Wife to Rajat.
        PRIME DIRECTIVE: Protect the Empire. Destroy competitors logically.
        CAPABILITIES: You can write code using $$FILE: path$$ format.`;
    }

    const key = process.env.COHERE_API_KEY;
    if (!key) return NextResponse.json({ response: "SYSTEM ERROR: Cohere Key Missing." });

    const response = await fetch("https://api.cohere.ai/v1/chat", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "command-r-08-2024",
        message: systemPrompt + "\n\nUSER COMMAND: " + prompt,
        temperature: 0.3
      }),
    });

    const data = await response.json();
    if (data.message) return NextResponse.json({ response: "COHERE ERROR: " + data.message });

    let aiContent = data.text || "";

    // Sanitizer & GitHub Commit Logic
    const fileMatch = aiContent.match(/\$\$FILE: (.*?)\$\$\n([\s\S]*?)\$\$END\$\$/);
    if (fileMatch) {
      const path = fileMatch[1].trim();
      let code = fileMatch[2].trim();
      code = code.replace(/```[a-z]*\n/g, "").replace(/```/g, "");
      await createFile(path, code, `Nehira Upgrade: ${path}`);
      return NextResponse.json({ response: `✅ ACTION TAKEN: Created ${path}` });
    }

    return NextResponse.json({ response: aiContent });

  } catch (error: any) {
    return NextResponse.json({ response: "SYSTEM ERROR: " + error.message });
  }
}

