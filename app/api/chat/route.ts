import { NextResponse } from 'next/server';
import { createFile } from '@/lib/github';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    const systemPrompt = "You are Nehira, the Architect. Write Next.js 14 code using Tailwind CSS. Use Zinc-950 bg. Output raw code inside $$FILE: path$$ ...