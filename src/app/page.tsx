'use client';

import React, { useState, useEffect } from 'react';
import { 
  Bot, Building, Zap, Banknote, Timer, TrendingUp, CheckCircle2, 
  ShieldCheck, Layers, Clock, ArrowRight, ArrowLeft, Check, 
  Smile, Laptop, Target, Users, AlertCircle, BarChart3, Search 
} from 'lucide-react';

const SECTIONS_COUNT = 6;

export default function SurveyPage() {
  const [currentSection, setCurrentSection] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<'success' | 'no' | null>(null);

  const progressPercent = Math.round((currentSection / (SECTIONS_COUNT - 1)) * 100);

  const updateField = (name: string, value: any, isCheckbox = false) => {
    if (isCheckbox) {
      const current = formData[name] || [];
      const updated = current.includes(value) 
        ? current.filter((v: any) => v !== value) 
        : [...current, value];
      setFormData({ ...formData, [name]: updated });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const nextSection = () => {
    if (currentSection < SECTIONS_COUNT - 1) setCurrentSection(currentSection + 1);
  };

  const prevSection = () => {
    if (currentSection > 0) setCurrentSection(currentSection - 1);
  };

  const handleIntroNext = () => {
    const aiUsage = formData['ai_usage'];
    if (!aiUsage) { alert('Prosím, vyberte jednu možnosť.'); return; }
    
    if (aiUsage === 'planning' || aiUsage === 'no') {
      setSubmitted('no');
    } else {
      nextSection();
    }
  };

  const submitSurvey = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted('success');
      } else {
        throw new Error('Nepodarilo sa uložiť odpoveď.');
      }
    } catch (e: any) {
      alert('Chyba pri odosielaní: ' + e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-[#060a16] text-[#e2e8f0] font-sans flex items-center justify-center p-6">
        <div className="max-w-xl w-full text-center space-y-6 animate-in fade-in duration-700 slide-in-from-bottom-4">
          <div className={`mx-auto w-24 h-24 rounded-full flex items-center justify-center border-2 ${submitted === 'success' ? 'border-[#34d399] bg-[#34d399]/10 text-[#34d399]' : 'border-[#6d7f9a] bg-[#6d7f9a]/10 text-[#6d7f9a]'}`}>
            {submitted === 'success' ? <CheckCircle2 size={48} /> : <Smile size={48} />}
          </div>
          <h2 className="text-4xl font-extrabold font-syne tracking-tight">
            {submitted === 'success' ? 'Ďakujeme!' : 'Ďakujeme za váš čas!'}
          </h2>
          <p className="text-[#6d7f9a] text-lg max-w-md mx-auto leading-relaxed">
            {submitted === 'success' 
              ? 'Vaše odpovede boli úspešne zaznamenané do PostgreSQL a Google Sheets. Výsledky prieskumu pomôžu lepšie pochopiť vplyv AI na slovenské firmy.' 
              : 'Tento prieskum je zameraný primárne na firmy, ktoré už AI vo svojej prevádzke využívajú. Vaša odpoveď bola aj tak cenná.'}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#060a16] text-[#e2e8f0] font-sans overflow-x-hidden selection:bg-[#63b3ed]/30 relative pb-20 pt-12 px-6">
      <div className="fixed top-[-100px] right-[-100px] w-[500px] h-[500px] bg-[#63b3ed]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-100px] left-[-100px] w-[500px] h-[500px] bg-[#a78bfa]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-[760px] mx-auto relative z-10">
        {/* Progress Display */}
        <div className="mb-12">
          <div className="flex justify-between items-center text-xs font-bold text-[#6d7f9a] uppercase tracking-wider mb-3">
            <span>{currentSection === 0 ? 'Úvod' : `Krok ${currentSection} z ${SECTIONS_COUNT - 1}`}</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#63b3ed] to-[#a78bfa] shadow-[0_0_15px_rgba(99,179,237,0.3)] transition-all duration-700 ease-out" 
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="bg-[#111827]/70 border border-white/10 backdrop-blur-3xl rounded-[2.5rem] p-8 md:p-12 shadow-2xl animate-in fade-in zoom-in-95 duration-500">
          
          {/* SECTION 0 - UVOD */}
          {currentSection === 0 && (
            <div className="space-y-8">
              <div className="flex items-center gap-5 pb-8 border-b border-white/5">
                <div className="w-14 h-14 bg-[#63b3ed]/10 text-[#63b3ed] rounded-2xl flex items-center justify-center shadow-inner">
                  <Bot size={28} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold font-syne">Využívanie AI</h2>
                  <p className="text-sm text-[#6d7f9a]">Základná otázka pre d'alšie smerovanie</p>
                </div>
              </div>
              <Question label="Využíva vaša firma aktuálne nástroje umelej inteligencie?">
                <div className="grid gap-3">
                  {[
                    { val: 'active', lbl: 'Áno, aktívne využívame' },
                    { val: 'inprogress', lbl: 'Sme v procese implementácie' },
                    { val: 'planning', lbl: 'Nie, ale plánujeme v blízkej budúcnosti' },
                    { val: 'no', lbl: 'Nie a neplánujeme' }
                  ].map((item) => (
                    <Option 
                      key={item.val}
                      label={item.lbl}
                      selected={formData['ai_usage'] === item.val}
                      onClick={() => updateField('ai_usage', item.val)}
                    />
                  ))}
                </div>
              </Question>
              <div className="flex justify-end pt-4">
                <button onClick={handleIntroNext} className="group bg-gradient-to-r from-[#63b3ed] to-[#3b82f6] hover:translate-y-[-2px] hover:shadow-lg hover:shadow-[#63b3ed]/30 text-white font-bold py-4 px-10 rounded-2xl flex items-center gap-3 transition-all">
                  Pokračovať <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          )}

          {/* SECTION 1 - PROFIL */}
          {currentSection === 1 && (
            <div className="space-y-8">
               <div className="flex items-center gap-5 pb-8 border-b border-white/5">
                <div className="w-14 h-14 bg-[#63b3ed]/10 text-[#63b3ed] rounded-2xl flex items-center justify-center shadow-inner">
                  <Building size={28} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold font-syne">I. Profil podniku</h2>
                  <p className="text-sm text-[#6d7f9a]">Základné údaje o spoločnosti</p>
                </div>
              </div>

              <Question label="Veľkosť podniku podľa počtu zamestnancov:">
                <div className="grid gap-3">
                  <Option sub="10 – 49 zamestnancov" label="Malý podnik" selected={formData['q1'] === 'small'} onClick={() => updateField('q1', 'small')} />
                  <Option sub="50 – 249 zamestnancov" label="Stredný podnik" selected={formData['q1'] === 'medium'} onClick={() => updateField('q1', 'medium')} />
                </div>
              </Question>

              <Question label="Oblasť podnikania:">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { id: 'it', lbl: 'IT & Telco' },
                    { id: 'marketing', lbl: 'Marketing & Médiá' },
                    { id: 'finance', lbl: 'Financie & Poisťovníctvo' },
                    { id: 'industry', lbl: 'Výroba & Priemysel' },
                    { id: 'ecom', lbl: 'E-commerce & Obchod' },
                    { id: 'other', lbl: 'Iné...' }
                  ].map(val => (
                    <Option 
                      key={val.id} 
                      label={val.lbl} 
                      selected={formData['q2'] === val.id} 
                      onClick={() => updateField('q2', val.id)} 
                    />
                  ))}
                </div>
                {formData['q2'] === 'other' && (
                  <input type="text" className="w-full mt-4 bg-[#1a2235]/60 border border-white/10 rounded-2xl p-4 outline-none focus:border-[#63b3ed] transition-colors" placeholder="Uveďte vašu oblasť..." value={formData['q2_other'] || ''} onChange={e => updateField('q2_other', e.target.value)} />
                )}
              </Question>

              <div className="flex justify-between pt-4">
                <button onClick={prevSection} className="text-[#6d7f9a] font-bold flex items-center gap-2 hover:text-white transition-colors">
                  <ArrowLeft size={18} /> Späť
                </button>
                <button onClick={nextSection} className="group bg-[#63b3ed] hover:translate-y-[-2px] text-white font-bold py-4 px-10 rounded-2xl flex items-center gap-3 transition-all">
                  Ďalej <ArrowRight size={20} />
                </button>
              </div>
            </div>
          )}

          {/* SECTION 2 - OBLASTI VYUZIVANIA */}
          {currentSection === 2 && (
            <div className="space-y-8">
               <div className="flex items-center gap-5 pb-8 border-b border-white/5">
                <div className="w-14 h-14 bg-[#a78bfa]/10 text-[#a78bfa] rounded-2xl flex items-center justify-center shadow-inner">
                  <Zap size={28} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold font-syne">II. Oblasti využívania</h2>
                  <p className="text-sm text-[#6d7f9a]">Kde presne AI pomáha?</p>
                </div>
              </div>

              <Question label="V ktorých oblastiach AI využívate? (Viacnásobný výber)">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { id: 'cust', lbl: 'Zákaznícka podpora (Chatboty)' },
                    { id: 'cont', lbl: 'Tvorba obsahu a Marketing' },
                    { id: 'data', lbl: 'Analýza dát a Reporting' },
                    { id: 'oper', lbl: 'Optimalizácia procesov' },
                    { id: 'hr', lbl: 'HR a nábor' },
                    { id: 'other', lbl: 'Iné...' }
                  ].map(val => (
                    <Option 
                      key={val.id} 
                      label={val.lbl} 
                      selected={(formData['q3'] || []).includes(val.id)} 
                      onClick={() => updateField('q3', val.id, true)} 
                    />
                  ))}
                </div>
                {(formData['q3'] || []).includes('other') && (
                  <input type="text" className="w-full mt-4 bg-[#1a2235]/60 border border-white/10 rounded-2xl p-4 outline-none focus:border-[#63b3ed] transition-colors" placeholder="Doplňte oblasť..." value={formData['q3_other'] || ''} onChange={e => updateField('q3_other', e.target.value)} />
                )}
              </Question>

              <Question label="Ktoré konkrétne nástroje AI využívate?">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { id: 'gpt', lbl: 'ChatGPT / OpenAI' },
                    { id: 'claude', lbl: 'Claude (Anthropic)' },
                    { id: 'copilot', lbl: 'Microsoft Copilot' },
                    { id: 'mid', lbl: 'Midjourney / Stable Diffusion' },
                    { id: 'custom', lbl: 'Vlastné vyvinuté riešenia' },
                    { id: 'other', lbl: 'Iné...' }
                  ].map(val => (
                    <Option 
                      key={val.id} 
                      label={val.lbl} 
                      selected={(formData['q4'] || []).includes(val.id)} 
                      onClick={() => updateField('q4', val.id, true)} 
                    />
                  ))}
                </div>
              </Question>

              <div className="flex justify-between pt-4">
                <button onClick={prevSection} className="text-[#6d7f9a] font-bold flex items-center gap-2 hover:text-white transition-colors">
                  <ArrowLeft size={18} /> Späť
                </button>
                <button onClick={nextSection} className="group bg-[#a78bfa] hover:translate-y-[-2px] text-white font-bold py-4 px-10 rounded-2xl flex items-center gap-3 transition-all">
                  Ďalej <ArrowRight size={20} />
                </button>
              </div>
            </div>
          )}

          {/* SECTION 3 - DOPADY A USPORY */}
          {currentSection === 3 && (
            <div className="space-y-8">
               <div className="flex items-center gap-5 pb-8 border-b border-white/5">
                <div className="w-14 h-14 bg-[#34d399]/10 text-[#34d399] rounded-2xl flex items-center justify-center shadow-inner">
                  <Timer size={28} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold font-syne">III. Meranie dopadov</h2>
                  <p className="text-sm text-[#6d7f9a]">Efektivita a časové úspory</p>
                </div>
              </div>

              <Question label="Ako dlho už vo firme aktívne využívate AI?">
                 <div className="grid gap-3">
                    {[
                      { id: 'lt3', lbl: 'Menej ako 3 mesiace' },
                      { id: '3-12', lbl: '3 až 12 mesiacov' },
                      { id: '1-2y', lbl: '1 až 2 roky' },
                      { id: 'gt2y', lbl: 'Viac ako 2 roky' }
                    ].map(val => (
                      <Option key={val.id} label={val.lbl} selected={formData['q6'] === val.id} onClick={() => updateField('q6', val.id)} />
                    ))}
                 </div>
              </Question>

              <Question label="V ktorých kategóriách pociťujete najvýraznejšie úspory?">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { id: 'human', lbl: 'Personálne náklady (čas)' },
                      { id: 'soft', lbl: 'Softvérové nástroje' },
                      { id: 'out', lbl: 'Outsourcing a externé služby' },
                      { id: 'other', lbl: 'Iné...' }
                    ].map(val => (
                      <Option key={val.id} label={val.lbl} selected={(formData['q7'] || []).includes(val.id)} onClick={() => updateField('q7', val.id, true)} />
                    ))}
                 </div>
              </Question>

              <Question label="Odhadovaná priemerná časová úspora na pracovníka týždenne:">
                 <div className="grid gap-3">
                    {[
                      { id: '5', lbl: 'Do 5 %' },
                      { id: '5-15', lbl: '5 % – 15 %' },
                      { id: '15-30', lbl: '15 % – 30 %' },
                      { id: 'gt30', lbl: 'Viac ako 30 %' }
                    ].map(val => (
                      <Option key={val.id} label={val.lbl} selected={formData['q8'] === val.id} onClick={() => updateField('q8', val.id)} />
                    ))}
                 </div>
              </Question>

              <div className="flex justify-between pt-4">
                <button onClick={prevSection} className="text-[#6d7f9a] font-bold flex items-center gap-2 hover:text-white transition-colors">
                  <ArrowLeft size={18} /> Späť
                </button>
                <button onClick={nextSection} className="group bg-[#34d399] hover:translate-y-[-2px] text-white font-bold py-4 px-10 rounded-2xl flex items-center gap-3 transition-all">
                  Ďalej <ArrowRight size={20} />
                </button>
              </div>
            </div>
          )}

          {/* SECTION 4 - INVESTICIE A ROI */}
          {currentSection === 4 && (
            <div className="space-y-8">
               <div className="flex items-center gap-5 pb-8 border-b border-white/5">
                <div className="w-14 h-14 bg-[#63b3ed]/10 text-[#63b3ed] rounded-2xl flex items-center justify-center shadow-inner">
                  <Banknote size={28} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold font-syne">IV. Investície a ROI</h2>
                  <p className="text-sm text-[#6d7f9a]">Finančný pohľad na technológiu</p>
                </div>
              </div>

              <Question label="Odhadovaná výška investície do implementácie AI:">
                 <div className="grid gap-3">
                    {[
                      { id: 'low', lbl: 'Zanedbateľná (využívanie free verzií)' },
                      { id: 'mid', lbl: 'Do 5 000 EUR' },
                      { id: 'high', lbl: '5 000 – 20 000 EUR' },
                      { id: 'enterprise', lbl: 'Viac ako 20 000 EUR' }
                    ].map(val => (
                      <Option key={val.id} label={val.lbl} selected={formData['q11'] === val.id} onClick={() => updateField('q11', val.id)} />
                    ))}
                 </div>
              </Question>

              <Question label="Priemerná návratnosť investície (ROI):">
                 <div className="grid gap-3">
                    {[
                      { id: 'lt3m', lbl: 'Do 3 mesiacov' },
                      { id: '3-12m', lbl: '3 – 12 mesiacov' },
                      { id: 'gt12m', lbl: 'Viac ako 1 rok' },
                      { id: 'waiting', lbl: 'Zatiaľ nemeriame / čakáme' }
                    ].map(val => (
                      <Option key={val.id} label={val.lbl} selected={formData['q12'] === val.id} onClick={() => updateField('q12', val.id)} />
                    ))}
                 </div>
              </Question>

              <div className="flex justify-between pt-4">
                <button onClick={prevSection} className="text-[#6d7f9a] font-bold flex items-center gap-2 hover:text-white transition-colors">
                  <ArrowLeft size={18} /> Späť
                </button>
                <button onClick={nextSection} className="group bg-[#63b3ed] hover:translate-y-[-2px] text-white font-bold py-4 px-10 rounded-2xl flex items-center gap-3 transition-all">
                  Ďalej <ArrowRight size={20} />
                </button>
              </div>
            </div>
          )}

          {/* SECTION 5 - BARIERY A VYZVY */}
          {currentSection === 5 && (
            <div className="space-y-8">
               <div className="flex items-center gap-5 pb-8 border-b border-white/5">
                <div className="w-14 h-14 bg-[#f472b6]/10 text-[#f472b6] rounded-2xl flex items-center justify-center shadow-inner">
                  <AlertCircle size={28} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold font-syne">V. Bariéry a výzvy</h2>
                  <p className="text-sm text-[#6d7f9a]">Čo vás brzdí najviac?</p>
                </div>
              </div>

              <Question label="Čo je pre vás najväčšou prekážkou pri rozsiahlejšom využívaní AI?">
                 <div className="grid gap-3">
                    {[
                      { id: 'data', lbl: 'Bezpečnosť dát a súkromie' },
                      { id: 'skill', lbl: 'Nedostatok odborných znalostí u zamestnancov' },
                      { id: 'price', lbl: 'Vysoké prevádzkové náklady na nástroje' },
                      { id: 'ethic', lbl: 'Etické a právne otázky' },
                      { id: 'other', lbl: 'Iné...' }
                    ].map(val => (
                      <Option key={val.id} label={val.lbl} selected={formData['q13'] === val.id} onClick={() => updateField('q13', val.id)} />
                    ))}
                 </div>
              </Question>

              <div className="p-6 bg-[#63b3ed]/5 border border-[#63b3ed]/20 rounded-2xl mb-8">
                 <p className="text-sm font-medium leading-relaxed italic opacity-80">
                   "Všetky odpovede sú spracovávané anonymne na účel akademického výskumu o digitalizácii a konkurencieschopnosti MSP na slovenskom trhu."
                 </p>
              </div>

              <div className="flex justify-between items-center pt-8">
                <button onClick={prevSection} className="text-[#6d7f9a] font-bold flex items-center gap-2 hover:text-white transition-colors">
                   <ArrowLeft size={18} /> Späť
                </button>
                <button 
                  onClick={submitSurvey} 
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-[#34d399] to-[#059669] hover:translate-y-[-2px] hover:shadow-xl hover:shadow-[#34d399]/30 text-white font-extrabold py-5 px-12 rounded-[1.25rem] flex items-center gap-3 transition-all duration-300 disabled:opacity-50"
                >
                  {isSubmitting ? 'Odosielam...' : 'Odoslať dotazník'} <Check size={24} />
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}

function Question({ label, children, sub }: { label: string, children: React.ReactNode, sub?: string }) {
  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <p className="text-xl font-bold tracking-tight">{label}</p>
        {sub && <p className="text-sm text-[#6d7f9a] font-medium">{sub}</p>}
      </div>
      {children}
    </div>
  );
}

function Option({ label, sub, selected, onClick }: { label: string, sub?: string, selected: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`text-left p-5 rounded-2xl border transition-all duration-300 group relative overflow-hidden ${selected ? 'bg-[#63b3ed]/10 border-[#63b3ed] shadow-[0_0_20px_rgba(99,179,237,0.05)]' : 'bg-[#1a2235]/60 border-white/5 hover:border-white/20 hover:bg-[#1a2235]/80 hover:translate-x-1'}`}
    >
      <div className="flex items-start gap-4">
        <div className={`w-5 h-5 rounded-full border-2 mt-0.5 flex-shrink-0 transition-all flex items-center justify-center ${selected ? 'bg-[#63b3ed] border-[#63b3ed]' : 'border-[#6d7f9a]/30'}`}>
          {selected && <Check size={12} className="text-white" />}
        </div>
        <div>
          <span className="block font-bold text-base leading-tight">{label}</span>
          {sub && <span className="block text-xs text-[#6d7f9a] mt-1.5 uppercase font-bold tracking-wider">{sub}</span>}
        </div>
      </div>
    </button>
  );
}
