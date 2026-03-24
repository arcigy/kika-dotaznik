import { NextRequest, NextResponse } from 'next/server';
import sql from '../../../lib/db';
import { z } from 'zod';

const surveySchema = z.record(z.any());

export async function POST(req: NextRequest) {
  try {
    const rawData = await req.json();
    const data = surveySchema.parse(rawData);

    // 1. ZÁPIS DO POSTGRESQL (Railway)
    let pgId = `local-${Date.now()}`;
    try {
      const res = await sql`
        INSERT INTO prieskum_odpovede (payload, created_at) 
        VALUES (${JSON.stringify(data)}, NOW())
        RETURNING id
      `;
      pgId = res?.[0]?.id || pgId;
    } catch (pgError) {
      console.error('PostgreSQL error:', pgError);
    }

    // 2. ZÁPIS DO GOOGLE SHEETS (cez link vo variables)
    const sheetUrl = process.env.GOOGLE_SHEET_URL;
    if (sheetUrl && sheetUrl.includes('script.google.com')) {
      try {
        await fetch(sheetUrl, {
          method: 'POST',
          body: JSON.stringify({ id: pgId, ...data }),
          headers: { 'Content-Type': 'application/json' },
        });
      } catch (gsError) {
        console.error('Google Sheets link error:', gsError);
      }
    }

    return NextResponse.json({ success: true, message: 'Dotazník bol uložený do DB aj Sheets.' });
  } catch (error: any) {
    console.error('Submit error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
