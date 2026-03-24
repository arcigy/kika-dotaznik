'use client';

import React, { useState } from 'react';
import { 
  Bot, Building, Zap, Banknote, Timer, TrendingUp, CheckCircle2, 
  ShieldCheck, Layers, Clock, ArrowRight, ArrowLeft, Check, 
  Smile, AlertCircle 
} from 'lucide-react';

const SECTIONS_COUNT = 6;

export default function SurveyPage() {
  const [currentSection, setCurrentSection] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({
    id: `resp-${Date.now()}`
  });
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

  const submitSurvey = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) setSubmitted('success');
      else throw new Error('Chyba pri ukladaní.');
    } catch (e: any) {
      alert('Chyba: ' + e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-[#060a16] text-[#e2e8f0] flex items-center justify-center p-6">
        <div className="max-w-xl text-center space-y-6">
          <div className="mx-auto w-24 h-24 rounded-full flex items-center justify-center border-2 border-[#34d399] bg-[#34d399]/10 text-[#34d399]">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="text-4xl font-bold font-syne tracking-tight">Všetko prebehlo úspešne!</h2>
          <p className="text-[#6d7f9a] text-lg">Vaše dáta sú bezpečne uložené v PostgreSQL a Google Tabuľke.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#060a16] text-[#e2e8f0] pb-20 pt-12 px-6">
      <div className="max-w-[760px] mx-auto relative z-10">
        <div className="mb-12">
          <div className="flex justify-between items-center text-xs font-bold text-[#6d7f9a] uppercase mb-3">
             <span>Krok {currentSection} z {SECTIONS_COUNT - 1}</span>
             <span>{progressPercent}%</span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#63b3ed] to-[#a78bfa] transition-all duration-700" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        <div className="bg-[#111827]/70 border border-white/10 backdrop-blur-3xl rounded-[2.5rem] p-8 md:p-12 shadow-2xl">
          
          {currentSection === 0 && (
            <Section title="Využívanie AI" sub="Základný filter" icon={<Bot size={28}/>}>
              <Question label="Využíva vaša firma aktuálne nástroje umelej inteligencie?">
                <Option label="Áno, aktívne" selected={formData['vyuziva_ai'] === 'Áno'} onClick={() => updateField('vyuziva_ai', 'Áno')} />
                <Option label="Sme v procese" selected={formData['vyuziva_ai'] === 'V procese'} onClick={() => updateField('vyuziva_ai', 'V procese')} />
                <Option label="Plánujeme" selected={formData['vyuziva_ai'] === 'Plánujeme'} onClick={() => { updateField('vyuziva_ai', 'Plánujeme'); setSubmitted('no'); }} />
                <Option label="Nie a neplánujeme" selected={formData['vyuziva_ai'] === 'Nie'} onClick={() => { updateField('vyuziva_ai', 'Nie'); setSubmitted('no'); }} />
              </Question>
              <NextBtn onClick={() => currentSection < SECTIONS_COUNT-1 && setCurrentSection(currentSection+1)} />
            </Section>
          )}

          {currentSection === 1 && (
            <Section title="I. Profil podniku" icon={<Building size={28}/>}>
              <Question label="Veľkosť podniku:">
                 <Option label="Malý podnik (10-49)" selected={formData['velkost_podniku'] === 'Malý'} onClick={() => updateField('velkost_podniku', 'Malý')} />
                 <Option label="Stredný podnik (50-249)" selected={formData['velkost_podniku'] === 'Stredný'} onClick={() => updateField('velkost_podniku', 'Stredný')} />
              </Question>
              <Question label="Oblasť podnikania:">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                   {['IT & Telco', 'Marketing', 'Financie', 'Výroba', 'E-commerce', 'Iné'].map(v => (
                     <Option key={v} label={v} selected={formData['oblast_podnikania'] === v} onClick={() => updateField('oblast_podnikania', v)} />
                   ))}
                 </div>
              </Question>
              <div className="flex justify-between pt-6">
                <button onClick={() => setCurrentSection(0)} className="text-[#6d7f9a] font-bold">Späť</button>
                <NextBtn onClick={() => setCurrentSection(2)} />
              </div>
            </Section>
          )}

          {currentSection === 2 && (
            <Section title="II. Oblasti a nástroje" icon={<Zap size={28}/>}>
              <Question label="V ktorých oblastiach využívate AI? (Viacero)">
                 {['Zákaznícka podpora', 'Marketing', 'Analýza dát', 'Procesy', 'HR'].map(v => (
                   <Option key={v} label={v} selected={(formData['oblasti_vyuzitia'] || []).includes(v)} onClick={() => updateField('oblasti_vyuzitia', v, true)} />
                 ))}
              </Question>
              <Question label="Konkrétne AI nástroje:">
                 {['ChatGPT', 'Claude', 'Copilot', 'Vlastné riešenie', 'Iné'].map(v => (
                   <Option key={v} label={v} selected={(formData['ai_nastroje'] || []).includes(v)} onClick={() => updateField('ai_nastroje', v, true)} />
                 ))}
              </Question>
              <div className="flex justify-between pt-6">
                <button onClick={() => setCurrentSection(1)} className="text-[#6d7f9a] font-bold">Späť</button>
                <NextBtn onClick={() => setCurrentSection(3)} />
              </div>
            </Section>
          )}

          {currentSection === 3 && (
            <Section title="III. Čas a úspory" icon={<Timer size={28}/>}>
              <Question label="Dĺžka využívania AI:">
                 {['Zatiaľ < 3 mes.', '3-12 mesiacov', '1-2 roky', '> 2 roky'].map(v => (
                   <Option key={v} label={v} selected={formData['dlzka_vyuzivania'] === v} onClick={() => updateField('dlzka_vyuzivania', v)} />
                 ))}
              </Question>
              <Question label="Priemerná časová úspora na pracovníka:">
                 {['Do 5%', '5% – 15%', '15% – 30%', 'Viac ako 30%'].map(v => (
                   <Option key={v} label={v} selected={formData['časová_úspora'] === v} onClick={() => updateField('časová_úspora', v)} />
                 ))}
              </Question>
              <div className="flex justify-between pt-6">
                <button onClick={() => setCurrentSection(2)} className="text-[#6d7f9a] font-bold">Späť</button>
                <NextBtn onClick={() => setCurrentSection(4)} />
              </div>
            </Section>
          )}

          {currentSection === 4 && (
            <Section title="IV. Investície a ROI" icon={<Banknote size={28}/>}>
              <Question label="Výška investície do AI:">
                 {['Zanedbateľná (free)', 'Do 5 000 EUR', '5 000 – 20 000 EUR', '> 20 000 EUR'].map(v => (
                   <Option key={v} label={v} selected={formData['vyska_investicie'] === v} onClick={() => updateField('vyska_investicie', v)} />
                 ))}
              </Question>
              <Question label="Finančná návratnosť (ROI):">
                 {['Do 3 mesiacov', '3–12 mesiacov', 'Viac ako rok', 'Zatiaľ nemeriame'].map(v => (
                   <Option key={v} label={v} selected={formData['navratnost_roi'] === v} onClick={() => updateField('navratnost_roi', v)} />
                 ))}
              </Question>
              <div className="flex justify-between pt-6">
                <button onClick={() => setCurrentSection(3)} className="text-[#6d7f9a] font-bold">Späť</button>
                <NextBtn onClick={() => setCurrentSection(5)} />
              </div>
            </Section>
          )}

          {currentSection === 5 && (
            <Section title="V. Bariéry a odoslanie" icon={<AlertCircle size={28}/>}>
              <Question label="Najväčšia prekážka:">
                 {['Dáta a súkromie', 'Nedostatok znalostí', 'Vysoké náklady', 'Etika', 'Iné'].map(v => (
                   <Option key={v} label={v} selected={formData['najvacsia_prekazka'] === v} onClick={() => updateField('najvacsia_prekazka', v)} />
                 ))}
              </Question>
              <div className="flex justify-between pt-8">
                <button onClick={() => setCurrentSection(4)} className="text-[#6d7f9a] font-bold">Späť</button>
                <button onClick={submitSurvey} disabled={isSubmitting} className="bg-gradient-to-r from-[#34d399] to-[#059669] text-white font-extrabold py-4 px-12 rounded-2xl flex items-center gap-3 transition-all">
                  {isSubmitting ? 'Odosielam...' : 'Odoslať'} <Check size={24} />
                </button>
              </div>
            </Section>
          )}

        </div>
      </div>
    </main>
  );
}

const Section = ({ title, sub, icon, children }: any) => (
  <div className="space-y-8 animate-in fade-in duration-500">
    <div className="flex items-center gap-5 pb-6 border-b border-white/5">
      <div className="w-14 h-14 bg-white/5 text-[#63b3ed] rounded-2xl flex items-center justify-center">{icon}</div>
      <div><h2 className="text-2xl font-bold font-syne">{title}</h2>{sub && <p className="text-sm text-[#6d7f9a]">{sub}</p>}</div>
    </div>
    {children}
  </div>
);

const Question = ({ label, children }: any) => (
  <div className="space-y-4">
    <p className="text-lg font-bold">{label}</p>
    <div className="grid grid-cols-1 gap-3">{children}</div>
  </div>
);

const Option = ({ label, selected, onClick }: any) => (
  <button onClick={onClick} className={`text-left p-5 rounded-2xl border transition-all flex items-center gap-4 ${selected ? 'bg-[#63b3ed]/10 border-[#63b3ed]' : 'bg-white/5 border-white/5 hover:border-white/20'}`}>
     <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selected ? 'bg-[#63b3ed] border-[#63b3ed]' : 'border-white/20'}`}>{selected && <Check size={12} className="text-white"/>}</div>
     <span className="font-bold">{label}</span>
  </button>
);

const NextBtn = ({ onClick }: any) => (
  <div className="flex justify-end pt-4">
    <button onClick={onClick} className="bg-[#63b3ed] hover:translate-y-[-2px] text-white font-bold py-4 px-10 rounded-2xl flex items-center gap-3 transition-all">
      Ďalej <ArrowRight size={20} />
    </button>
  </div>
);
