'use client';

import React, { useState, useEffect } from 'react';
import { Bot, Building, Zap, Banknote, Timer, TrendingUp, CheckCircle2, ShieldCheck, Layers, Clock, ArrowRight, ArrowLeft, Check, Smile } from 'lucide-react';

const SECTIONS_COUNT = 5;

export default function SurveyPage() {
  const [currentSection, setCurrentSection] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<'success' | 'no' | null>(null);

  // Update progress
  const progressPercent = Math.round((currentSection / SECTIONS_COUNT) * 100);

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
    if (currentSection < SECTIONS_COUNT) setCurrentSection(currentSection + 1);
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
        setCurrentSection(SECTIONS_COUNT);
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
          <p className="text-[#6d7f9a] text-lg max-w-md mx-auto">
            {submitted === 'success' 
              ? 'Vaše odpovede boli úspešne zaznamenané do PostgreSQL. Výsledky prieskumu pomôžu lepšie pochopiť digitalizáciu na Slovensku.' 
              : 'Tento prieskum je zameraný na firmy využívajúce AI. Vaša odpoveď bola aj tak cenná.'}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#060a16] text-[#e2e8f0] font-sans overflow-x-hidden selection:bg-[#63b3ed]/30 relative pb-20 pt-12 px-6">
      {/* Background Blobs */}
      <div className="fixed top-[-100px] right-[-100px] w-[500px] h-[500px] bg-[#63b3ed]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-100px] left-[-100px] w-[500px] h-[500px] bg-[#a78bfa]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-[760px] mx-auto relative z-10">
        {/* Hero */}
        <header className="text-center mb-16 animate-in fade-in duration-1000 slide-in-from-top-4">
          <div className="inline-flex items-center gap-2 bg-[#63b3ed]/10 border border-[#63b3ed]/25 text-[#63b3ed] text-[11px] font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-8 backdrop-blur-md">
            ◆ Akademický prieskum 2025
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold font-syne leading-[1.1] mb-6 bg-gradient-to-br from-white via-[#63b3ed] to-[#a78bfa] bg-clip-text text-transparent">
            Vplyv AI na MSP
          </h1>
          <p className="text-[#6d7f9a] text-lg max-w-[580px] mx-auto mb-10 font-medium leading-relaxed">
            Zistite, ako moderné nástroje umelej inteligencie optimalizujú prevádzkové náklady firiem na slovenskom trhu.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-sm text-[#6d7f9a]">
              <Clock size={16} className="text-[#63b3ed]" /> <strong>5 minút</strong>
            </div>
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-sm text-[#6d7f9a]">
              <ShieldCheck size={16} className="text-[#63b3ed]" /> <strong>Anonymné</strong>
            </div>
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-sm text-[#6d7f9a]">
              <Layers size={16} className="text-[#63b3ed]" /> <strong>5 sekcií</strong>
            </div>
          </div>
        </header>

        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between items-center text-xs font-bold text-[#6d7f9a] uppercase tracking-wider mb-3">
            <span>{currentSection === 0 ? 'Začíname' : `Krok ${currentSection} z ${SECTIONS_COUNT}`}</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#63b3ed] to-[#a78bfa] shadow-[0_0_15px_rgba(99,179,237,0.3)] transition-all duration-700 ease-out" 
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-[#111827]/70 border border-white/10 backdrop-blur-3xl rounded-[2rem] p-8 md:p-12 shadow-2xl animate-in fade-in zoom-in-95 duration-500">
          
          {/* SECTION 0 */}
          {currentSection === 0 && (
            <div className="space-y-8">
              <div className="flex items-center gap-5 pb-8 border-b border-white/5">
                <div className="w-14 h-14 bg-[#63b3ed]/10 text-[#63b3ed] rounded-2xl flex items-center justify-center shadow-inner">
                  <Bot size={28} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold font-syne">Využívanie AI</h2>
                  <p className="text-sm text-[#6d7f9a]">Základná otázka pre správne smerovanie</p>
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-base font-semibold">Využíva vaša firma aktuálne nástroje umelej inteligencie?</p>
                <div className="grid gap-3">
                  {['active', 'inprogress', 'planning', 'no'].map((val) => (
                    <Option 
                      key={val}
                      label={val === 'active' ? 'Áno, aktívne využívame' : val === 'inprogress' ? 'Sme v procese implementácie' : val === 'planning' ? 'Nie, ale plánujeme' : 'Nie a neplánujeme'}
                      selected={formData['ai_usage'] === val}
                      onClick={() => updateField('ai_usage', val)}
                    />
                  ))}
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <button onClick={handleIntroNext} className="group bg-gradient-to-r from-[#63b3ed] to-[#3b82f6] hover:translate-y-[-2px] hover:shadow-lg hover:shadow-[#63b3ed]/30 text-white font-bold py-4 px-8 rounded-2xl flex items-center gap-3 transition-all duration-300">
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
                  <h2 className="text-2xl font-bold font-syne">Profil podniku</h2>
                  <p className="text-sm text-[#6d7f9a]">Základné údaje o spoločnosti</p>
                </div>
              </div>

              <Question label="Veľkosť podniku">
                <div className="grid gap-3">
                  <Option sub="10 – 49 zamestnancov" label="Malý podnik" selected={formData['q1'] === 'small'} onClick={() => updateField('q1', 'small')} />
                  <Option sub="50 – 249 zamestnancov" label="Stredný podnik" selected={formData['q1'] === 'medium'} onClick={() => updateField('q1', 'medium')} />
                </div>
              </Question>

              <Question label="Oblasť podnikania">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {['it', 'marketing', 'finance', 'industry', 'ecom', 'other'].map(val => (
                    <Option 
                      key={val} 
                      label={val === 'it' ? 'IT & Telco' : val === 'marketing' ? 'Marketing' : val === 'finance' ? 'Financie' : val === 'industry' ? 'Výroba' : val === 'ecom' ? 'E-commerce' : 'Iné...'} 
                      selected={formData['q2'] === val} 
                      onClick={() => updateField('q2', val)} 
                    />
                  ))}
                </div>
                {formData['q2'] === 'other' && (
                  <input type="text" className="w-full mt-4 bg-[#1a2235]/60 border border-white/10 rounded-2xl p-4 outline-none focus:border-[#63b3ed] transition-colors" placeholder="Uveďte vašu oblasť..." value={formData['q2_other'] || ''} onChange={e => updateField('q2_other', e.target.value)} />
                )}
              </Question>

              <div className="flex justify-between pt-4">
                <button onClick={() => setCurrentSection(0)} className="text-[#6d7f9a] font-bold flex items-center gap-2 hover:text-white transition-colors">
                  <ArrowLeft size={18} /> Späť
                </button>
                <button onClick={nextSection} className="group bg-[#63b3ed] hover:translate-y-[-2px] text-white font-bold py-4 px-10 rounded-2xl flex items-center gap-3 transition-all">
                  Ďalej <ArrowRight size={20} />
                </button>
              </div>
            </div>
          )}

          {/* ... OSTATNE SEKCE PODOBNE ... PRE STRCNOST POJDEME NA FINALNU SEKCIU */}
          {currentSection >= 2 && currentSection < 5 && (
            <div className="text-center py-10">
              <h3 className="text-xl font-bold mb-4">Sekcie II – IV vo vývoji...</h3>
              <p className="text-[#6d7f9a] mb-8">Postupne prepájam všetky tvoje otázky do Reactu.</p>
              <button onClick={() => setCurrentSection(SECTIONS_COUNT)} className="bg-white/5 border border-white/10 px-8 py-4 rounded-2xl font-bold">
                Skočiť na finále (test DB)
              </button>
            </div>
          )}

          {/* SECTION 5 - FINAL */}
          {currentSection === 5 && (
            <div className="space-y-8">
              <div className="flex items-center gap-5 pb-8 border-b border-white/5">
                <div className="w-14 h-14 bg-[#f472b6]/10 text-[#f472b6] rounded-2xl flex items-center justify-center shadow-inner">
                  <TrendingUp size={28} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold font-syne">Odoslanie</h2>
                  <p className="text-sm text-[#6d7f9a]">Posledný krok do PostgreSQL databázy</p>
                </div>
              </div>
              <div className="p-6 bg-[#63b3ed]/5 border border-[#63b3ed]/20 rounded-2xl">
                 <p className="text-sm font-medium leading-relaxed">
                   Kliknutím na tlačidlo "Odoslať" sa vaše odpovede bezpečne uložia do Railway databázy a spustí sa prepojenie na Google Sheets.
                 </p>
              </div>
              <div className="flex justify-between items-center pt-8">
                <button onClick={() => setCurrentSection(1)} className="text-[#6d7f9a] font-bold flex items-center gap-2 hover:text-white transition-colors">
                   <ArrowLeft size={18} /> Späť
                </button>
                <button 
                  onClick={submitSurvey} 
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-[#34d399] to-[#059669] hover:translate-y-[-2px] hover:shadow-lg hover:shadow-[#34d399]/30 text-white font-extrabold py-5 px-12 rounded-[1.25rem] flex items-center gap-3 transition-all duration-300 disabled:opacity-50"
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

function Question({ label, children }: { label: string, children: React.ReactNode }) {
  return (
    <div className="space-y-5">
      <p className="text-lg font-bold tracking-tight">{label}</p>
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
        <div className={`w-5 h-5 rounded-full border-2 mt-0.5 flex-shrink-0 transition-all ${selected ? 'bg-[#63b3ed] border-[#63b3ed]' : 'border-[#6d7f9a]/30'}`}>
          {selected && <div className="w-1.5 h-1.5 bg-white rounded-full m-auto absolute inset-0" />}
        </div>
        <div>
          <span className="block font-bold text-base leading-tight">{label}</span>
          {sub && <span className="block text-xs text-[#6d7f9a] mt-1.5 uppercase font-bold tracking-wider">{sub}</span>}
        </div>
      </div>
    </button>
  );
}
