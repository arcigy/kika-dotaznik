import { NextRequest, NextResponse } from 'next/server';
import sql from '../../../lib/db';
import { z } from 'zod';

// Validácia vstupu
const surveySchema = z.record(z.string());

export async function POST(req: NextRequest) {
  try {
    const rawData = await req.json();
    const data = surveySchema.parse(rawData);

    // 1. Zápis do PostgreSQL stĺpcom JSONB
    // Tabuľka: prieskum_odpovede (id, created_at, payload)
    await sql`
      INSERT INTO prieskum_odpovede 
      (payload, created_at) 
      VALUES 
      (${JSON.stringify(data)}, NOW())
    `;

    return NextResponse.json({ success: true, message: 'Odpoveď bola uložená do databázy.' });
  } catch (error: any) {
    console.error('Submit error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
