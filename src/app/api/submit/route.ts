import { NextRequest, NextResponse } from 'next/server';
import sql from '../../../lib/db';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import { z } from 'zod';

const surveySchema = z.record(z.any());

export async function POST(req: NextRequest) {
  try {
    const rawData = await req.json();
    const data = surveySchema.parse(rawData);

    // 1. ZÁPIS DO POSTGRESQL (Railway)
    let pgResult;
    try {
      pgResult = await sql`
        INSERT INTO prieskum_odpovede (payload, created_at) 
        VALUES (${JSON.stringify(data)}, NOW())
        RETURNING id
      `;
    } catch (pgError) {
      console.error('PostgreSQL error:', pgError);
    }

    // 2. ZÁPIS DO GOOGLE SHEETS (ak je link a kľúče prítomné)
    const sheetUrl = process.env.GOOGLE_SHEET_URL;
    const docIdMatch = sheetUrl?.match(/\/d\/(.*?)(\/|$)/);
    const docId = docIdMatch ? docIdMatch[1] : null;

    if (docId && process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
      try {
        const auth = new JWT({
          email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
          key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
          scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const doc = new GoogleSpreadsheet(docId, auth);
        await doc.loadInfo();
        const sheet = doc.sheetsByIndex[0];

        // Pridaj riadok (kľúče z dotazníka ako názvy stĺpcov)
        await sheet.addRow({
          id: pgResult?.[0]?.id || `local-${Date.now()}`,
          created_at: new Date().toISOString(),
          ...data
        });
      } catch (gsError) {
        console.error('Google Sheets error:', gsError);
        // Nechceme, aby chyba Sheets zhodila celú odpoveď (Postgres je hlavný)
      }
    }

    return NextResponse.json({ success: true, message: 'Dotazník bol uložený.' });
  } catch (error: any) {
    console.error('Submit error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
