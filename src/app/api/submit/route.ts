import { NextRequest, NextResponse } from 'next/server';
import sql from '../../../lib/db';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const vyuziva_ai        = data.vyuziva_ai || '';
    const velkost_podniku   = data.velkost_podniku || '';
    const oblast_podnikania = data.oblast_podnikania || '';
    const oblasti_vyuzitia  = Array.isArray(data.oblasti_vyuzitia) ? data.oblasti_vyuzitia.join(', ') : (data.oblasti_vyuzitia || '');
    const ai_nastroje       = Array.isArray(data.ai_nastroje) ? data.ai_nastroje.join(', ') : (data.ai_nastroje || '');
    const dlzka_vyuzivania  = data.dlzka_vyuzivania || '';
    const casova_uspora     = data['časová_úspora'] || data.casova_uspora || '';
    const vyska_investicie  = data.vyska_investicie || '';
    const navratnost_roi    = data.navratnost_roi || '';
    const najvacsia_prekazka = data.najvacsia_prekazka || '';

    // 1. POSTGRESQL — zapis do vlastných stĺpcov (nie JSONB)
    let pgId = `resp-${Date.now()}`;
    try {
      const res = await sql`
        INSERT INTO prieskum_odpovede 
          (vyuziva_ai, velkost_podniku, oblast_podnikania, oblasti_vyuzitia, 
           ai_nastroje, dlzka_vyuzivania, casova_uspora, vyska_investicie, 
           navratnost_roi, najvacsia_prekazka)
        VALUES 
          (${vyuziva_ai}, ${velkost_podniku}, ${oblast_podnikania}, ${oblasti_vyuzitia},
           ${ai_nastroje}, ${dlzka_vyuzivania}, ${casova_uspora}, ${vyska_investicie},
           ${navratnost_roi}, ${najvacsia_prekazka})
        RETURNING id
      `;
      pgId = res?.[0]?.id || pgId;
      console.log('✅ PostgreSQL OK, id:', pgId);
    } catch (pgErr: any) {
      console.error('❌ PostgreSQL error:', pgErr.message);
    }

    // 2. GOOGLE SHEETS — posielame ako JSON (doPost to číta cez e.postData.contents)
    const sheetUrl = process.env.GOOGLE_SHEET_URL;
    if (sheetUrl?.includes('script.google.com')) {
      try {
        const payload = {
          id: pgId,
          vyuziva_ai,
          velkost_podniku,
          oblast_podnikania,
          oblasti_vyuzitia,
          ai_nastroje,
          dlzka_vyuzivania,
          casova_uspora,
          vyska_investicie,
          navratnost_roi,
          najvacsia_prekazka,
        };

        const res = await fetch(sheetUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify(payload),
          redirect: 'follow',
        });
        console.log('✅ Google Sheets OK, status:', res.status);
      } catch (gsErr: any) {
        console.error('❌ Google Sheets error:', gsErr.message);
      }
    }

    return NextResponse.json({ success: true, id: pgId });
  } catch (error: any) {
    console.error('❌ Main error:', error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
