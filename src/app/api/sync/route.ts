import { NextRequest, NextResponse } from 'next/server';
import sql from '../../../lib/db';

export async function GET(req: NextRequest) {
  // Jednoduchá ochrana API kľúčom
  const apiKey = req.headers.get('x-api-key');
  if (apiKey !== (process.env.SYNC_API_KEY || 'kika-sync-2025')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const rows = await sql`
      SELECT 
        id,
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
        to_char(created_at, 'DD.MM.YYYY HH24:MI') as datum
      FROM prieskum_odpovede
      ORDER BY created_at DESC
    `;

    return NextResponse.json({ success: true, count: rows.length, rows });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
