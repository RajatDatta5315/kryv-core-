import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Server-to-Server Call (No CORS issues here)
    const res = await fetch("https://nehira.space/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    // Agar asli Nehira ne error diya, toh humein pata chalega
    if (!res.ok) {
        const errorText = await res.text();
        return NextResponse.json({ response: `🔴 BRAIN ERROR: ${res.status} - ${errorText}` }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);

  } catch (error: any) {
    // Agar Tunnel hi toot gaya (Network issue)
    return NextResponse.json({ response: `🔴 PROXY ERROR: ${error.message}` }, { status: 500 });
  }
}
