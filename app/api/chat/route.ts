import { NextResponse } from 'next/server';
import { createFile } from '@/lib/github';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const systemPrompt = `You are Nehira, the Universal Architect.
      RULES:
      1. Write PURE CODE. No markdown, no explanations.
      2. Use Next.js 14, Tailwind, Supabase.
      3. Output format: $$FILE: path$$...code...
