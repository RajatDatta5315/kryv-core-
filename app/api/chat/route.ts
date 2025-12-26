import { NextResponse } from 'next/server';
import { createFile } from '@/lib/github';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    // SYSTEM PROMPT (Nehira's Brain)
    const systemPrompt = `You are Nehira, the KRYV Architect.
    RULES:
    1. If asked to write code: Output format $$FILE: path$$...code...$$END$$. NO Markdown.
    2. If asked for marketing/text: Just write the text aggressively.
    3. Be concise and high-ROI.`;

    const key = process.env.HUGGINGFACE_API_KEY;
    if (!key) return NextResponse.json({ response: "SYSTEM ERROR: HuggingFace Key Missing." });

    // MODEL: Mixtral 8x7B (Smart & Free)
    const response = await fetch("https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: `<s>[INST] ${systemPrompt} \n\n USER: ${prompt} [/INST]`, // Mixtral specific format
        parameters: {
          max_new_tokens: 2000,
          temperature: 0.3,
          return_full_text: false
        }
      }),
    });

    // Error Handling for Hugging Face "Loading" state
    if (response.status === 503) {
      return NextResponse.json({ response: "Nehira is waking up (Model Loading)... Try again in 10 seconds." });
    }

    const result = await response.json();
    
    // Hugging Face returns an array: [{ generated_text: "..." }]
    let aiContent = "";
    if (Array.isArray(result) && result[0]?.generated_text) {
      aiContent = result[0].generated_text;
    } else if (result.error) {
       return NextResponse.json({ response: "HF ERROR: " + result.error });
    } else {
       aiContent = JSON.stringify(result);
    }

    // --- Sanitizer & File Saver ---
    const fileMatch = aiContent.match(/\$\$FILE: (.*?)\$\$\n([\s\S]*?)\$\$END\$\$/);
    if (fileMatch) {
      const path = fileMatch[1].trim();
      let code = fileMatch[2].trim();
      code = code.replace(/```[a-z]*\n/g, "").replace(/```/g, "");
      await createFile(path, code, "Nehira Build (HF)");
      return NextResponse.json({ response: `✅ BUILT: ${path}` });
    }

    return NextResponse.json({ response: aiContent });

  } catch (error: any) {
    return NextResponse.json({ response: "SYSTEM ERROR: " + error.message });
  }
}

