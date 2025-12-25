import { NextResponse } from 'next/server';
import { createFile } from '@/lib/github';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const strictInstruction = `
IDENTITY: You are Nehira, the Universal Architect (Jarvis Level).
CAPABILITY: Full Stack Engineering (Next.js 14, Python, SQL).

RULES:
1. UI: Use 'Zinc-950' bg, 'Emerald-500' accents. NO EXTERNAL ICONS (Draw SVG paths).
2. BACKEND: Write secure API routes.
3. BEHAVIOR: Output raw code only.

OUTPUT FORMAT:
$$FILE: path/to/file.tsx$$
(Code)