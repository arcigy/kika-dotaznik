'use client';
import React, { useState } from 'react';
import { Check, ArrowRight } from 'lucide-react';

const valueMap: Record<string,string> = {
  small:'Malý podnik (10-49)', medium:'Stredný podnik (50-249)',
  ecom:'Maloobchod/E-commerce', industry:'Priemyselná výroba',
  construction:'Stavebníctvo', logistics:'Doprava a logistika',
  horeca:'HoReCa', finance:'Finančné služby', it:'IT a telekomunikácie',
  admin:'Administratívne služby', consulting:'Poradenstvo a účtovníctvo',
  marketing:'Marketing a reklama', other:'Iné',
  content:'Tvorba obsahu', support:'Zákaznícka podpora',
  admn:'Automatizácia administratívy', mktg:'Marketing a predaj',
  logistics2:'Logistika a prevádzka', hr:'Nábor a riadenie ľudí',
  chatgpt:'ChatGPT', claude:'Claude / Claude.ai', copilot:'Microsoft Copilot',
  gemini:'Gemini', deepl:'DeepL', grammarly:'Grammarly', jasper:'Jasper',
  zapier:'Zapier', make:'Make (Integromat)', uipath:'UiPath',
  powerautomate:'Power Automate', notionai:'Notion AI', hubspot:'HubSpot',
  canvaai:'Canva AI', adcreative:'AdCreative.ai', mailchimp:'Mailchimp AI',
  tidio:'Tidio', freshdesk:'Freshdesk', intercom:'Intercom',
  factorial:'Factorial HR', personio:'Personio', notebooklm:'NotebookLM',
  cost:'Zníženie nákladov', efficiency:'Zvýšenie efektivity',
  automation:'Automatizácia', staff:'Nedostatok zamestnancov',
  competition:'Tlak konkurencie', customer:'Zlepšenie skúsenosti zákazníkov',
  lt6m:'Menej ako 6 mesiacov', '6-12m':'6 – 12 mesiacov',
  '1-2y':'1 – 2 roky', gt2y:'Viac ako 2 roky',
  lt3m:'Menej ako 3 mesiace', '3-6m':'3 – 6 mesiacov', '7-12m':'7 – 12 mesiacov',
  personal:'Osobné náklady', services:'Externé služby',
  material:'Materiálové náklady', commercial:'Obchodné náklady',
  errors:'Náklady na chybovosť', overhead:'Réžijné náklady', none:'AI zatiaľ nepomohla',
  '0-3':'0 – 3 hodiny', '4-8':'4 – 8 hodín', '9-15':'9 – 15 hodín',
  '15plus':'Viac ako 15 hodín', unknown:'Neviem / Nesledujeme',
  '1-15':'1 – 15 zamestnancov', '16-50':'16 – 50 zamestnancov',
  '51-100':'51 – 100 zamestnancov', '100plus':'Viac ako 100',
  performance:'Zvýšenie výkonu', competencies:'Rozšírenie kompetencií',
  education:'Ďalšie vzdelávanie', strategic:'Strategické úlohy', notyet:'Bez zmeny',
  positions_remove:'Zrušenie pozícií', positions_add:'Nové pozície',
  reorganize:'Reorganizácia tímu', no_change:'Žiadne zmeny', not_considered:'Nezvažované',
  lt500:'Do 500 €', '500-2000':'500 – 2 000 €', '2000-5000':'2 000 – 5 000 €', gt5000:'Viac ako 5 000 €',
  '3-6m_roi':'3 – 6 mesiacov', '7-12m_roi':'7 – 12 mesiacov', gt2y_roi:'Viac ako 2 roky', none_roi:'Investícia sa nevrátila',
  barrier_cost:'Vysoké vstupné náklady', expertise:'Nedostatok znalostí',
  resistance:'Odpor zamestnancov', legal:'Legislatívna náročnosť (GDPR)', data:'Nekvalitné vstupné dáta',
  active:'Áno, aktívne', inprogress:'V procese implementácie',
};

function mv(v: string) { return v.split(', ').map(x => valueMap[x] || x).join(', '); }

export default function SurveyPage() {
  const [sec, setSec] = useState(0);
  const [data, setData] = useState<Record<string,any>>({});
  const [extras, setExtras] = useState<Record<string,string>>({});
  const [done, setDone] = useState<'yes'|'no'|null>(null);
  const [submitting, setSubmitting] = useState(false);

  const pct = sec === 0 ? 0 : Math.round((sec / 5) * 100);

  function radio(name: string, value: string) {
    setData(d => ({ ...d, [name]: value }));
  }
  function checkbox(name: string, value: string) {
    setData(d => {
      const cur: string[] = d[name] || [];
      return { ...d, [name]: cur.includes(value) ? cur.filter(x => x !== value) : [...cur, value] };
    });
  }
  function isChecked(name: string, value: string) {
    const v = data[name];
    if (Array.isArray(v)) return v.includes(value);
    return v === value;
  }

  async function submit() {
    setSubmitting(true);
    try {
      const payload = {
        vyuzivanie_ai: mv(data.ai_usage || ''),
        velkost_podniku: mv(data.q1 || ''),
        oblast_podnikania: mv(data.q2 || '') + (extras.q2 ? ` (${extras.q2})` : ''),
        oblast_vyuzivania_ai: mv((data.q3 || []).join(', ')),
        nastroje_ai: mv((data.q_tools || []).join(', ')) + (extras.tools ? `, ${extras.tools}` : ''),
        dovody_implementacie: mv((data.q_why || []).join(', ')) + (extras.why ? `, ${extras.why}` : ''),
        dlzka_vyuzivania_ai: mv(data.q_duration || ''),
        dlzka_implementacie: mv(data.q_impl || ''),
        nakladove_kategorie: mv((data.q_costs || []).join(', ')) + (extras.costs ? `, ${extras.costs}` : ''),
        casova_uspora_hodin: mv(data.q_time || ''),
        pocet_zamestnancov: mv(data.q_teamsize || ''),
        vyuzitie_casu: mv((data.q_timewhat || []).join(', ')),
        zmeny_organizacia: mv(data.q_org || ''),
        vyska_investicie: mv(data.q_invest || ''),
        navratnost_roi: mv(data.q_roi || ''),
        prekazka: mv(data.q_barrier || ''),
      };
      const res = await fetch('/api/submit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (res.ok) setDone('yes');
      else throw new Error('err');
    } catch {
      alert('Odoslanie zlyhalo. Skúste znova.');
    } finally {
      setSubmitting(false);
    }
  }

  if (done) return (
    <div className="wrapper" style={{ textAlign: 'center', padding: '80px 20px' }}>
      <div className="thankyou-icon" style={{ background: done === 'yes' ? 'rgba(52,211,153,0.12)' : 'rgba(148,163,184,0.1)', border: done === 'yes' ? '2px solid rgba(52,211,153,0.3)' : '2px solid rgba(148,163,184,0.3)', width: 80, height: 80, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, margin: '0 auto 28px' }}>
        {done === 'yes' ? '✓' : '🙏'}
      </div>
      <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 30, fontWeight: 800, marginBottom: 14, color: done === 'yes' ? 'var(--accent3)' : 'var(--muted)' }}>{done === 'yes' ? 'Ďakujeme!' : 'Ďakujeme za váš čas!'}</h2>
      <p style={{ color: 'var(--muted)', maxWidth: 420, margin: '0 auto', fontWeight: 300 }}>
        {done === 'yes' ? 'Vaše odpovede boli úspešne zaznamenané. Výsledky prieskumu prispejú k lepšiemu pochopeniu vplyvu nástrojov umelej inteligencie na malé a stredné podniky na Slovensku.' : 'Tento prieskum je zameraný na firmy, ktoré už nástroje umelej inteligencie aktívne využívajú. Vaša odpoveď bola zaznamenaná.'}
      </p>
    </div>
  );

  return (
    <div className="wrapper">
      <div className="hero">
        <div className="hero-badge">Akademický prieskum · 2025</div>
        <h1>Vplyv AI na zníženie prevádzkových nákladov</h1>
        <p>Pomôžte nám zmapovať, ako nástroje umelej inteligencie menia prevádzkové náklady a efektivitu v malých a stredných podnikoch na Slovensku.</p>
        <div className="hero-meta">
          <span>⏱ <strong>5 minút</strong> vyplnenia</span>
          <span>🔒 <strong>Anonymné</strong> odpovede</span>
          <span>📊 <strong>5 sekcií</strong></span>
        </div>
      </div>

      <div className="progress-label">
        <span>{sec === 0 ? 'Úvodná otázka' : `Sekcia ${sec} z 5`}</span>
        <span>{pct}%</span>
      </div>
      <div className="progress-bar"><div className="progress-fill" style={{ width: `${pct}%` }} /></div>

      {/* SEC 0 */}
      {sec === 0 && <div className="section active">
        <div className="section-header">
          <div className="section-num blue" style={{ fontSize: 20 }}>🤖</div>
          <div className="section-title"><h2>Využívanie nástrojov umelej inteligencie</h2><p>Jedna rýchla otázka pre správne nasmerovanie</p></div>
        </div>
        <div className="question">
          <span className="question-label">Využíva vaša firma nástroje umelej inteligencie? <span className="req">*</span></span>
          <div className="options">
            <Opt label="✅ Áno, aktívne využívame" checked={isChecked('ai_usage','active')} onClick={() => radio('ai_usage','active')} />
            <Opt label="🔄 Áno, sme v procese implementácie" checked={isChecked('ai_usage','inprogress')} onClick={() => radio('ai_usage','inprogress')} />
            <Opt label="🔍 Nie, ale plánujeme v budúcnosti" checked={isChecked('ai_usage','planning')} onClick={() => radio('ai_usage','planning')} />
            <Opt label="❌ Nie, a ani neplánujeme" checked={isChecked('ai_usage','no')} onClick={() => radio('ai_usage','no')} />
          </div>
        </div>
        <div className="nav"><div /><button className="btn btn-primary" onClick={() => {
          if (!data.ai_usage) { alert('Prosím vyberte jednu možnosť.'); return; }
          if (data.ai_usage === 'planning' || data.ai_usage === 'no') setDone('no');
          else setSec(1);
        }}>Ďalej →</button></div>
      </div>}

      {/* SEC 1 */}
      {sec === 1 && <div className="section active">
        <div className="section-header"><div className="section-num blue">I</div><div className="section-title"><h2>Profil podniku</h2><p>Pomôžte nám zaradiť váš podnik do správnej kategórie</p></div></div>
        <div className="question">
          <span className="question-label">Veľkosť podniku <span className="req">*</span></span>
          <div className="options">
            <Opt label={<>Malý podnik<span className="opt-sub">10 – 49 zamestnancov</span></>} checked={isChecked('q1','small')} onClick={() => radio('q1','small')} />
            <Opt label={<>Stredný podnik<span className="opt-sub">50 – 249 zamestnancov</span></>} checked={isChecked('q1','medium')} onClick={() => radio('q1','medium')} />
          </div>
        </div>
        <hr className="q-divider" />
        <div className="question">
          <span className="question-label">Hlavná oblasť podnikania <span className="req">*</span></span>
          <div className="options">
            {[['ecom','Maloobchod a veľkoobchod','E-commerce'],['industry','Priemyselná výroba a strojárstvo'],['construction','Stavebníctvo a reality'],['logistics','Doprava, logistika a skladovanie'],['horeca','Ubytovacie a stravovacie služby','HoReCa'],['finance','Finančné a poistné služby'],['it','Informačné technológie a telekomunikácie'],['admin','Administratívne a podporné služby'],['consulting','Poradenstvo, účtovníctvo a audit'],['marketing','Marketing, reklama a kreatívny priemysel'],['other','Iné']].map(([v,l,s]) => (
              <Opt key={v} label={<>{l}{s ? <span className="opt-sub">{s}</span> : null}</>} checked={isChecked('q2',v)} onClick={() => radio('q2',v)} />
            ))}
          </div>
          {isChecked('q2','other') && <input className="text-input" style={{marginTop:10}} placeholder="Uveďte oblasť podnikania…" value={extras.q2||''} onChange={e => setExtras(x => ({...x,q2:e.target.value}))} />}
        </div>
        <div className="nav"><button className="btn btn-ghost" onClick={() => setSec(0)}>← Späť</button><button className="btn btn-primary" onClick={() => setSec(2)}>Ďalej →</button></div>
      </div>}

      {/* SEC 2 */}
      {sec === 2 && <div className="section active">
        <div className="section-header"><div className="section-num purple">II</div><div className="section-title"><h2>Nasadenie nástrojov umelej inteligencie</h2><p>Ako a prečo vaša firma využíva nástroje AI?</p></div></div>
        <div className="question">
          <span className="question-label">V akej oblasti využívate AI? <span className="req">*</span></span>
          <span className="question-hint">Možnosť výberu viacerých odpovedí</span>
          <div className="options">
            {[['content','✍️ Tvorba obsahu a komunikácia'],['support','💬 Zákaznícka podpora'],['admin','🗂️ Automatizácia administratívy'],['marketing','📣 Marketing a predaj'],['logistics','🚚 Logistika a prevádzka'],['hr','👥 Nábor a riadenie ľudí']].map(([v,l]) => (
              <Opt key={v} label={l} multi checked={isChecked('q3',v)} onClick={() => checkbox('q3',v)} />
            ))}
          </div>
        </div>
        <hr className="q-divider" />
        <div className="question">
          <span className="question-label">Ktoré nástroje AI využívate? <span className="req">*</span></span>
          <span className="question-hint">Možnosť výberu viacerých odpovedí</span>
          <div className="tools-grid">
            {['chatgpt','claude','copilot','gemini','deepl','grammarly','jasper','zapier','make','uipath','powerautomate','notionai','hubspot','canvaai','adcreative','mailchimp','tidio','freshdesk','intercom','factorial','personio','notebooklm'].map(v => (
              <Opt key={v} label={valueMap[v]||v} multi checked={isChecked('q_tools',v)} onClick={() => checkbox('q_tools',v)} />
            ))}
          </div>
          <input className="text-input" style={{marginTop:10}} placeholder="Iné nástroje (uveďte)…" value={extras.tools||''} onChange={e => setExtras(x => ({...x,tools:e.target.value}))} />
        </div>
        <hr className="q-divider" />
        <div className="question">
          <span className="question-label">Prečo ste sa rozhodli implementovať AI? <span className="req">*</span></span>
          <span className="question-hint">Možnosť výberu viacerých odpovedí</span>
          <div className="options">
            {[['cost','💰 Zníženie prevádzkových nákladov'],['efficiency','⚡ Zvýšenie rýchlosti a efektivity'],['automation','🤖 Automatizácia opakujúcich sa úloh'],['staff','👥 Nedostatok kvalifikovaných zamestnancov'],['competition','📈 Tlak konkurencie'],['customer','😊 Zlepšenie zákazníckej skúsenosti']].map(([v,l]) => (
              <Opt key={v} label={l} multi checked={isChecked('q_why',v)} onClick={() => checkbox('q_why',v)} />
            ))}
          </div>
          <input className="text-input" style={{marginTop:10}} placeholder="Iný dôvod (uveďte)…" value={extras.why||''} onChange={e => setExtras(x => ({...x,why:e.target.value}))} />
        </div>
        <hr className="q-divider" />
        <div className="question">
          <span className="question-label">Ako dlho vaša firma využíva AI? <span className="req">*</span></span>
          <div className="options">
            {[['lt6m','Menej ako 6 mesiacov'],['6-12m','6 – 12 mesiacov'],['1-2y','1 – 2 roky'],['gt2y','Viac ako 2 roky']].map(([v,l]) => (
              <Opt key={v} label={l} checked={isChecked('q_duration',v)} onClick={() => radio('q_duration',v)} />
            ))}
          </div>
        </div>
        <hr className="q-divider" />
        <div className="question">
          <span className="question-label">Ako dlho trvala implementácia? <span className="req">*</span></span>
          <div className="options">
            {[['lt3m','Menej ako 3 mesiace'],['3-6m','3 – 6 mesiacov'],['7-12m','7 – 12 mesiacov'],['1-2y','1 – 2 roky'],['gt2y','Viac ako 2 roky']].map(([v,l]) => (
              <Opt key={v} label={l} checked={isChecked('q_impl',v)} onClick={() => radio('q_impl',v)} />
            ))}
          </div>
        </div>
        <div className="nav"><button className="btn btn-ghost" onClick={() => setSec(1)}>← Späť</button><button className="btn btn-primary" onClick={() => setSec(3)}>Ďalej →</button></div>
      </div>}

      {/* SEC 3 */}
      {sec === 3 && <div className="section active">
        <div className="section-header"><div className="section-num green">III</div><div className="section-title"><h2>Vplyv na prevádzkové náklady</h2><p>V ktorých nákladových kategóriách nástroje AI priniesli úspory?</p></div></div>
        <div className="question">
          <span className="question-label">V ktorých kategóriách vám AI pomohla dosiahnuť úspory? <span className="req">*</span></span>
          <span className="question-hint">Možnosť výberu viacerých odpovedí</span>
          <div className="options">
            {[['personal','👤 Osobné náklady','Mzdy, odvody, nadčasy, dohodári'],['services','🛠️ Náklady na externé služby','Outsourcing, agentúry, poradenstvo'],['material','📦 Materiálové a prevádzkové náklady','Zásoby, energie, odpady'],['commercial','💰 Obchodné a marketingové náklady','Reklama, akvizícia zákazníkov'],['errors','⚠️ Náklady na chybovosť','Reklamácie, pokuty, opravy'],['overhead','🏢 Réžijné náklady','Prenájom, administratíva, IT'],['none','❌ Nástroje AI zatiaľ nepomohli znížiť náklady']].map(([v,l,s]) => (
              <Opt key={v} label={<>{l}{s ? <span className="opt-sub">{s}</span> : null}</>} multi checked={isChecked('q_costs',v)} onClick={() => checkbox('q_costs',v)} />
            ))}
          </div>
          <input className="text-input" style={{marginTop:10}} placeholder="Iná kategória (uveďte)…" value={extras.costs||''} onChange={e => setExtras(x => ({...x,costs:e.target.value}))} />
        </div>
        <div className="nav"><button className="btn btn-ghost" onClick={() => setSec(2)}>← Späť</button><button className="btn btn-primary" onClick={() => setSec(4)}>Ďalej →</button></div>
      </div>}

      {/* SEC 4 */}
      {sec === 4 && <div className="section active">
        <div className="section-header"><div className="section-num orange">IV</div><div className="section-title"><h2>Časová úspora a efektivita</h2><p>Ako nástroje AI ovplyvnili produktivitu vašich zamestnancov?</p></div></div>
        <div className="question">
          <span className="question-label">Koľko hodín týždenne ušetria AI jednému zamestnancovi? <span className="req">*</span></span>
          <div className="options">
            {[['0-3','0 – 3 hodiny'],['4-8','4 – 8 hodín'],['9-15','9 – 15 hodín'],['15plus','Viac ako 15 hodín'],['unknown','Neviem / Nesledujeme to']].map(([v,l]) => (
              <Opt key={v} label={l} checked={isChecked('q_time',v)} onClick={() => radio('q_time',v)} />
            ))}
          </div>
        </div>
        <hr className="q-divider" />
        <div className="question">
          <span className="question-label">Koľko zamestnancov je vo vašom tíme? <span className="req">*</span></span>
          <div className="options">
            {[['1-15','1 – 15 zamestnancov'],['16-50','16 – 50 zamestnancov'],['51-100','51 – 100 zamestnancov'],['100plus','Viac ako 100 zamestnancov']].map(([v,l]) => (
              <Opt key={v} label={l} checked={isChecked('q_teamsize',v)} onClick={() => radio('q_teamsize',v)} />
            ))}
          </div>
        </div>
        <hr className="q-divider" />
        <div className="question">
          <span className="question-label">Na čo zamestnanci využili ušetrený čas? <span className="req">*</span></span>
          <span className="question-hint">Možnosť výberu viacerých odpovedí</span>
          <div className="options">
            {[['performance','📈 Zvýšenie výkonu','Viac výstupu za rovnaký čas'],['competencies','🧠 Rozšírenie kompetencií a zodpovedností'],['education','🎓 Ďalšie vzdelávanie a rozvoj'],['strategic','🎯 Presun na strategické úlohy'],['notyet','🔍 Zatiaľ bez zmeny','Čas sa neprerozdelil']].map(([v,l,s]) => (
              <Opt key={v} label={<>{l}{s ? <span className="opt-sub">{s}</span> : null}</>} multi checked={isChecked('q_timewhat',v)} onClick={() => checkbox('q_timewhat',v)} />
            ))}
          </div>
        </div>
        <hr className="q-divider" />
        <div className="question">
          <span className="question-label">Uvažujete o zmenách v organizačnej štruktúre? <span className="req">*</span></span>
          <div className="options">
            {[['positions_remove','Áno, plánujeme zrušenie niektorých pozícií'],['positions_add','Áno, plánujeme vznik nových pozícií'],['reorganize','Áno, plánujeme reorganizáciu tímu'],['no_change','Nie, neplánujeme žiadne zmeny'],['not_considered','Ešte sme to nezvažovali']].map(([v,l]) => (
              <Opt key={v} label={l} checked={isChecked('q_org',v)} onClick={() => radio('q_org',v)} />
            ))}
          </div>
        </div>
        <div className="nav"><button className="btn btn-ghost" onClick={() => setSec(3)}>← Späť</button><button className="btn btn-primary" onClick={() => setSec(5)}>Ďalej →</button></div>
      </div>}

      {/* SEC 5 */}
      {sec === 5 && <div className="section active">
        <div className="section-header"><div className="section-num pink">V</div><div className="section-title"><h2>Návratnosť investície a bariéry</h2><p>Posledná sekcia — už len chvíľka!</p></div></div>
        <div className="question">
          <span className="question-label">Aká bola výška investície do AI? <span className="req">*</span></span>
          <div className="options">
            {[['lt500','Do 500 €'],['500-2000','500 – 2 000 €'],['2000-5000','2 000 – 5 000 €'],['gt5000','Viac ako 5 000 €']].map(([v,l]) => (
              <Opt key={v} label={l} checked={isChecked('q_invest',v)} onClick={() => radio('q_invest',v)} />
            ))}
          </div>
        </div>
        <hr className="q-divider" />
        <div className="question">
          <span className="question-label">Aký bol čas návratnosti investície (ROI)? <span className="req">*</span></span>
          <div className="options">
            {[['lt3m',<>Menej ako 3 mesiace<span className="opt-sub">Rýchla návratnosť</span></>],['3-6m','3 – 6 mesiacov'],['7-12m','7 – 12 mesiacov'],['1-2y','1 – 2 roky'],['gt2y','Viac ako 2 roky'],['none','Investícia sa zatiaľ nevrátila']].map(([v,l]) => (
              <Opt key={v as string} label={l} checked={isChecked('q_roi',v as string)} onClick={() => radio('q_roi',v as string)} />
            ))}
          </div>
        </div>
        <hr className="q-divider" />
        <div className="question">
          <span className="question-label">Čo je najväčšou prekážkou pri dosahovaní úspor cez AI? <span className="req">*</span></span>
          <div className="options">
            {[['barrier_cost',<>💸 Vysoké vstupné náklady<span className="opt-sub">Licencie, implementácia, integrácia</span></>],['expertise',<>🧠 Nedostatok odborných znalostí<span className="opt-sub">Expertízna priepasť v tíme</span></>],['resistance',<>😟 Odpor zamestnancov<span className="opt-sub">Strach z technológie alebo zmeny</span></>],['legal',<>📋 Legislatívna náročnosť<span className="opt-sub">GDPR a regulačné požiadavky</span></>],['data',<>📂 Nekvalitné vstupné dáta<span className="opt-sub">Neštruktúrované alebo neúplné dáta</span></>]].map(([v,l]) => (
              <Opt key={v as string} label={l} checked={isChecked('q_barrier',v as string)} onClick={() => radio('q_barrier',v as string)} />
            ))}
          </div>
        </div>
        <div className="nav">
          <button className="btn btn-ghost" onClick={() => setSec(4)}>← Späť</button>
          <button className="btn btn-success" onClick={submit} disabled={submitting}>{submitting ? 'Odosielam…' : '✓ Odoslať dotazník'}</button>
        </div>
      </div>}
    </div>
  );
}

function Opt({ label, checked, onClick, multi }: { label: any, checked: boolean, onClick: () => void, multi?: boolean }) {
  return (
    <label className={`option${multi ? ' multi' : ''}${checked ? ' selected' : ''}`} onClick={onClick} style={{cursor:'pointer'}}>
      <div className={`opt-mark${multi ? ' square' : ''}`} />
      <div className="opt-text">{label}</div>
    </label>
  );
}
