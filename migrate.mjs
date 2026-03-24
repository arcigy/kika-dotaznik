import postgres from 'postgres';

const sql = postgres('postgresql://postgres:uKiwVuKJGuhfMDvqSttkTqNcrpZQoSYX@caboose.proxy.rlwy.net:40687/railway', { ssl: 'require' });

async function run() {
  try {
    // Pridáme všetky chýbajúce stĺpce
    const cols = [
      'oblast_vyuzivania_ai text',
      'nastroje_ai text',
      'dovody_implementacie text',
      'dlzka_vyuzivania_ai text',
      'dlzka_implementacie text',
      'nakladove_kategorie text',
      'casova_uspora_hodin text',
      'pocet_zamestnancov text',
      'vyuzitie_casu text',
      'zmeny_organizacia text',
      'vyska_investicie text',
      'navratnost_roi text',
      'prekazka text',
      'velkost_podniku text',
      'oblast_podnikania text',
      'vyuzivanie_ai text',
    ];

    for (const col of cols) {
      const [name] = col.split(' ');
      try {
        await sql.unsafe(`ALTER TABLE prieskum_odpovede ADD COLUMN IF NOT EXISTS ${col}`);
        console.log(`✅ Stĺpec: ${name}`);
      } catch(e) {
        console.log(`⚠️  ${name}: ${e.message}`);
      }
    }

    const check = await sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'prieskum_odpovede' ORDER BY ordinal_position`;
    console.log('\n📋 Stĺpce v tabuľke:');
    check.forEach(c => console.log('  -', c.column_name));

    await sql.end();
    process.exit(0);
  } catch(e) {
    console.error('❌', e.message);
    process.exit(1);
  }
}
run();
