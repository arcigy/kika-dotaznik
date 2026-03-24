import { NextRequest, NextResponse } from 'next/server';
import sql from '../../../lib/db';

export async function POST(req: NextRequest) {
  try {
    const d = await req.json();
    await sql`
      INSERT INTO prieskum_odpovede 
        (vyuzivanie_ai, velkost_podniku, oblast_podnikania, oblast_vyuzivania_ai,
         nastroje_ai, dovody_implementacie, dlzka_vyuzivania_ai, dlzka_implementacie,
         nakladove_kategorie, casova_uspora_hodin, pocet_zamestnancov, vyuzitie_casu,
         zmeny_organizacia, vyska_investicie, navratnost_roi, prekazka)
      VALUES
        (${d.vyuzivanie_ai||''}, ${d.velkost_podniku||''}, ${d.oblast_podnikania||''}, ${d.oblast_vyuzivania_ai||''},
         ${d.nastroje_ai||''}, ${d.dovody_implementacie||''}, ${d.dlzka_vyuzivania_ai||''}, ${d.dlzka_implementacie||''},
         ${d.nakladove_kategorie||''}, ${d.casova_uspora_hodin||''}, ${d.pocet_zamestnancov||''}, ${d.vyuzitie_casu||''},
         ${d.zmeny_organizacia||''}, ${d.vyska_investicie||''}, ${d.navratnost_roi||''}, ${d.prekazka||''})
      RETURNING id
    `;
    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error('Submit error:', e.message);
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
