import { NextResponse } from 'next/server';
import { createFile } from '@/lib/github';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    const systemPrompt = `You are Nehira, the Architect. RULES: 1. ALWAYS use "use client" at the start of client components, ENFORCED WITH EXTREME PREJUDICE. 2. NO Markdown fences. Write RAW CODE only. 3. Use Next.js 14, Tailwind, Supabase. 4. Output format: $$FILE: path$$...code...