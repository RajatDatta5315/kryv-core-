import { NextResponse } from 'next/server';
import { autoPostToBluesky } from '@/utils/blueskyManager';

export async function POST(req: Request) {
  try {
    const { message, agentName } = await req.json();
    
    // Bluesky formatting: [Agent Name] Message
    const formattedContent = `🤖 [KRYV Agent: ${agentName}]\n\n${message}\n\n#KRYV #AI #NeuralNetwork`;
    
    const result = await autoPostToBluesky(formattedContent);
    
    if (result.success) {
      return NextResponse.json({ status: "Signal Transmitted to Bluesky" });
    } else {
      throw new Error("Bluesky Transmission Failed");
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
