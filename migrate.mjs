import postgres from 'postgres';

const sql = postgres('postgresql://postgres:uKiwVuKJGuhfMDvqSttkTqNcrpZQoSYX@caboose.proxy.rlwy.net:40687/railway', {
  ssl: 'require',
});

async function run() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS prieskum_odpovede (
        id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        vyuziva_ai        text,
        velkost_podniku   text,
        oblast_podnikania text,
        oblasti_vyuzitia  text,
        ai_nastroje       text,
        dlzka_vyuzivania  text,
        casova_uspora     text,
        vyska_investicie  text,
        navratnost_roi    text,
        najvacsia_prekazka text,
        created_at        timestamptz DEFAULT now()
      )
    `;
    console.log('✅ Tabuľka prieskum_odpovede úspešne vytvorená!');

    // Overíme, že tabuľka existuje
    const check = await sql`SELECT COUNT(*) FROM prieskum_odpovede`;
    console.log('✅ Tabuľka overená, počet záznamov:', check[0].count);

    await sql.end();
    process.exit(0);
  } catch (e) {
    console.error('❌ Chyba:', e.message);
    await sql.end();
    process.exit(1);
  }
}

run();
