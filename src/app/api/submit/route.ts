import { NextRequest, NextResponse } from 'next/server';
import sql from '../../../lib/db';
import { z } from 'zod';

const surveySchema = z.record(z.any());

export async function POST(req: NextRequest) {
  try {
    const rawData = await req.json();
    const data = surveySchema.parse(rawData);

    // 1. ZÁPIS DO POSTGRESQL (Poriadne, po starom)
    let pgId = data.id || `resp-${Date.now()}`;
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

    // 2. ZÁPIS DO GOOGLE SHEETS (Poriadne, rozdelene do stĺpcov)
    const sheetUrl = process.env.GOOGLE_SHEET_URL;
    if (sheetUrl && (sheetUrl.includes('script.google.com') || sheetUrl.includes('google.com'))) {
      try {
        // Vytvoríme URL s parametrami - toto Google vidí ako samostatné stĺpce hneď
        const params = new URLSearchParams({
          id: pgId,
          vyuziva_ai: data.vyuziva_ai || "",
          velkost_podniku: data.velkost_podniku || "",
          oblast_podnikania: data.oblast_podnikania || "",
          oblasti_vyuzitia: Array.isArray(data.oblasti_vyuzitia) ? data.oblasti_vyuzitia.join(", ") : (data.oblasti_vyuzitia || ""),
          ai_nastroje: Array.isArray(data.ai_nastroje) ? data.ai_nastroje.join(", ") : (data.ai_nastroje || ""),
          dlzka_vyuzivania: data.dlzka_vyuzivania || "",
          casova_uspora: data['časová_úspora'] || "",
          vyska_investicie: data.vyska_investicie || "",
          navratnost_roi: data.navratnost_roi || "",
          najvacsia_prekazka: data.najvacsia_prekazka || ""
        });

        // Odoslanie ako POST s rozdelenými dátami
        await fetch(sheetUrl, {
          method: 'POST',
          body: params.toString(),
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });
      } catch (gsError) {
        console.error('Google Sheets send error:', gsError);
      }
    }

    return NextResponse.json({ success: true, message: 'Dáta boli rozdelené a uložené.' });
  } catch (error: any) {
    console.error('Submit error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
