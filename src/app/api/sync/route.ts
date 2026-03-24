import { NextRequest, NextResponse } from 'next/server';
import sql from '../../../lib/db';

export async function GET(req: NextRequest) {
  const apiKey = req.headers.get('x-api-key');
  if (apiKey !== (process.env.SYNC_API_KEY || 'kika-sync-2025')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const rows = await sql`
      SELECT 
        to_char(created_at, 'DD.MM.YYYY HH24:MI') as datum,
        vyuzivanie_ai, velkost_podniku, oblast_podnikania, oblast_vyuzivania_ai,
        nastroje_ai, dovody_implementacie, dlzka_vyuzivania_ai, dlzka_implementacie,
        nakladove_kategorie, casova_uspora_hodin, pocet_zamestnancov, vyuzitie_casu,
        zmeny_organizacia, vyska_investicie, navratnost_roi, prekazka
      FROM prieskum_odpovede
      ORDER BY created_at DESC
    `;
    return NextResponse.json({ success: true, count: rows.length, rows });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
