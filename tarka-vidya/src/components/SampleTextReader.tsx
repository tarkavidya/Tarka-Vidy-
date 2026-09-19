/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import NYAYA_TEXTS_RAW from "../data/texts.json";
import { getSectionSourceForText } from "./Granthasarani";
import { NyayaText, NyayaSection, NyayaSutraItem } from "../types";
import { transliterate, getScriptFontClass } from "../utils/transliteration";
import {
  BookOpen,
  Layers,
  Copy,
  Check,
  ArrowRight,
  RotateCcw
} from "lucide-react";

function DiyaLogoIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 500 320" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M 250 20 C 205 90, 205 150, 250 150 C 295 150, 295 90, 250 20 Z" fill="#C25E3E" />
      <path d="M 250 55 C 228 100, 228 135, 250 135 C 272 135, 272 100, 250 55 Z" fill="#FAF8F5" />
      <path d="M 140 180 C 140 255, 360 255, 360 180 Z" fill="#8C6239" stroke="#8C6239" strokeWidth="12" strokeLinejoin="round" />
      <path d="M 140 180 Q 250 185, 360 180" stroke="#FAF8F5" strokeWidth="8" strokeLinecap="round" />
      <path d="M 30 260 Q 140 260, 250 290 Q 360 260, 470 260 L 440 155 Q 350 155, 250 180 Q 150 155, 60 155 Z" stroke="#1F1A17" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const NYAYA_TEXTS = NYAYA_TEXTS_RAW as NyayaText[];

interface SimpleTextReaderProps {
  selectedTextId: string | null;
  onSelectTextId: (textId: string) => void;
  onSwitchToScholarly: () => void;
  initialScript?: string;
}

export default function SimpleTextReader({
  selectedTextId,
  onSelectTextId,
  onSwitchToScholarly,
  initialScript = "devanagari",
}: SimpleTextReaderProps) {
  // Active text ID
  const currentTextId = selectedTextId || "nyaya-sutras";
  const activeText = useMemo(() => {
    return NYAYA_TEXTS.find((t) => t.id === currentTextId) || NYAYA_TEXTS[0];
  }, [currentTextId]);

  // Sections for this text
  const sections: NyayaSection[] = useMemo(() => {
    return getSectionSourceForText(activeText.id);
  }, [activeText.id]);

  // Selected section state ("all" for full text, or specific section id)
  const [selectedSectionId, setSelectedSectionId] = useState<string>("all");

  // Script selection
  const [readingScript, setReadingScript] = useState<string>(initialScript);

  // Font size state
  const [fontSize, setFontSize] = useState<number>(24);

  // Copy feedback state
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filtered sections to display
  const displayedSections = useMemo(() => {
    if (selectedSectionId === "all") return sections;
    return sections.filter((sec) => sec.id === selectedSectionId);
  }, [sections, selectedSectionId]);

  // Total sutras count in active text
  const totalSutrasCount = useMemo(() => {
    return sections.reduce((acc, sec) => acc + (sec.sutras?.length || 0), 0);
  }, [sections]);

  const handleCopySingle = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const handleCopyAll = () => {
    const fullText = displayedSections
      .map((sec) => {
        const secHeader = `॥ ${sec.titleDevanagari} ॥`;
        const sutrasText = sec.sutras
          .map((s) => `[${s.sutraNum}] ${s.devanagari}`)
          .join("\n\n");
        return `${secHeader}\n\n${sutrasText}`;
      })
      .join("\n\n---\n\n");

    navigator.clipboard.writeText(fullText);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2200);
  };

  return (
    <div className={`min-h-screen bg-[#FAF8F5] text-[#1A1A1A] flex flex-col font-serif ${getScriptFontClass(readingScript)}`} id="simple-version-container">
      {/* Top Header with Site Title & Two-Version Switcher */}
      <header className="bg-[#3B2314] border-b-2 border-[#1A1A1A] py-3.5 px-4 md:px-8 shrink-0 flex flex-wrap items-center justify-between gap-4 text-white sticky top-0 z-50 shadow-md">
        {/* Branding */}
        <div className="flex items-center gap-3 select-none">
          <div className="bg-[#8C6239] text-white p-1 border-2 border-white flex items-center justify-center w-10 h-10 shrink-0 shadow-xs">
            <DiyaLogoIcon className="w-8 h-8 text-[#FAF8F5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base md:text-lg font-serif font-black tracking-tight text-[#FAF8F5] leading-tight">
                {transliterate("तर्कविद्या", readingScript)}
              </h1>
              <span className="bg-[#FAF8F5] text-[#3B2314] text-[10px] font-sans font-black px-2 py-0.5 border border-white uppercase tracking-wider">
                Simple Version • सरलसंस्करणम्
              </span>
            </div>
            <p className="text-[10px] text-stone-300 font-sans tracking-wide">
              Traditional Sanskrit Logic Repository • Pure Text Only
            </p>
          </div>
        </div>

        {/* Two-Version Switcher Buttons in Top Bar */}
        <div className="flex items-center gap-2">
          <div className="flex items-center border-2 border-white bg-[#251509] p-0.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]">
            <button
              type="button"
              onClick={onSwitchToScholarly}
              id="simple-header-switch-scholarly-btn"
              className="px-3 py-1.5 text-xs font-sans font-bold uppercase tracking-wider text-stone-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer flex items-center gap-1.5"
              title="Switch to Scholarly Version with commentaries, AI chat, translation, and dialectics"
            >
              <Layers className="w-3.5 h-3.5 text-[#8C6239]" />
              <span>Scholarly Version</span>
            </button>
            <div className="px-3 py-1.5 text-xs font-sans font-black uppercase tracking-wider bg-white text-[#3B2314] flex items-center gap-1.5 shadow-xs">
              <BookOpen className="w-3.5 h-3.5 text-[#8C6239]" />
              <span>Simple Version (Active)</span>
            </div>
          </div>
        </div>
      </header>

      {/* Control Bar: Centered Text Selection Dropdown & Text Settings */}
      <div className="bg-[#ECE0D1] border-b-2 border-[#1A1A1A] py-3 px-4 md:px-8 sticky top-[57px] z-40 shadow-xs">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* PRIMARY TEXT CHOOSING DROPDOWN */}
          <div className="flex items-center gap-2 flex-1 min-w-[260px]">
            <label htmlFor="simple-text-select-main" className="text-xs font-sans font-black text-[#3B2314] uppercase tracking-wider shrink-0 flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-[#8C6239]" />
              <span>ग्रन्थः | Text:</span>
            </label>
            <select
              id="simple-text-select-main"
              value={activeText.id}
              onChange={(e) => {
                onSelectTextId(e.target.value);
                setSelectedSectionId("all");
              }}
              className="flex-1 bg-white text-[#1A1A1A] border-2 border-[#1A1A1A] px-3 py-1.5 text-xs md:text-sm font-serif font-bold cursor-pointer outline-none shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] hover:border-[#8C6239] transition-all"
              title="Choose text / ग्रन्थ-चयनम्"
            >
              {NYAYA_TEXTS.map((t) => (
                <option key={t.id} value={t.id} className="font-serif">
                  {t.devanagariTitle} ({t.title}) — {t.author}
                </option>
              ))}
            </select>
          </div>

          {/* Section / Chapter Selector (If text has multiple chapters) */}
          {sections.length > 1 && (
            <div className="flex items-center gap-1.5">
              <label htmlFor="simple-section-select-main" className="text-xs font-sans font-bold text-[#3B2314] uppercase tracking-wider shrink-0">
                अध्यायः:
              </label>
              <select
                id="simple-section-select-main"
                value={selectedSectionId}
                onChange={(e) => setSelectedSectionId(e.target.value)}
                className="bg-white text-[#1A1A1A] border-2 border-[#1A1A1A] px-2 py-1 text-xs font-serif cursor-pointer outline-none shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]"
                title="Filter by chapter or view all"
              >
                <option value="all">
                  {transliterate("सम्पूर्णः ग्रन्थः (Complete Text)", readingScript)} ({totalSutrasCount})
                </option>
                {sections.map((sec, idx) => (
                  <option key={sec.id} value={sec.id}>
                    {idx + 1}. {transliterate(sec.titleDevanagari, readingScript)} ({sec.sutras.length})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Script & Font Size Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Script Selector */}
            <select
              value={readingScript}
              onChange={(e) => setReadingScript(e.target.value)}
              className="bg-white text-[#1A1A1A] border-2 border-[#1A1A1A] px-2 py-1 text-xs font-sans font-bold cursor-pointer outline-none shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]"
              title="Change Script (लिपिः)"
              aria-label="Change Script"
            >
              <option value="devanagari">देवनागरी</option>
              <option value="iast">IAST (Roman)</option>
              <option value="bengali">বাংলা</option>
              <option value="telugu">తెలుగు</option>
              <option value="kannada">ಕನ್ನಡ</option>
              <option value="malayalam">മലയാളം</option>
              <option value="gujarati">ગુજરાતી</option>
              <option value="tamil">தமிழ்</option>
            </select>

            {/* Font Size Adjuster */}
            <div className="flex items-center bg-white border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]">
              <button
                onClick={() => setFontSize((s) => Math.max(16, s - 2))}
                className="px-2 py-0.5 text-xs font-bold hover:bg-stone-100 border-r border-[#1A1A1A] cursor-pointer"
                title="Smaller Font Size"
                aria-label="Smaller Font Size"
              >
                A-
              </button>
              <span className="px-2 py-0.5 text-[11px] font-mono font-bold text-stone-700">{fontSize}px</span>
              <button
                onClick={() => setFontSize((s) => Math.min(40, s + 2))}
                className="px-2 py-0.5 text-xs font-bold hover:bg-stone-100 cursor-pointer"
                title="Larger Font Size"
                aria-label="Larger Font Size"
              >
                A+
              </button>
            </div>

            {/* Copy All Button */}
            <button
              onClick={handleCopyAll}
              className="bg-white hover:bg-[#FAF8F5] text-[#3B2314] border-2 border-[#1A1A1A] px-2.5 py-1 text-xs font-sans font-bold shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] cursor-pointer flex items-center gap-1"
              title="Copy entire visible text to clipboard"
            >
              {copiedAll ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Text Content: ONLY THE TEXT! */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 md:px-8 py-10" id="simple-main-text-canvas">
        {/* Treatise Title */}
        <div className="text-center pb-8 mb-10 border-b-2 border-[#1A1A1A]/20">
          <div className="inline-block px-3 py-1 bg-[#ECE0D1] border border-[#1A1A1A] text-[11px] font-sans font-bold uppercase tracking-widest text-[#8C6239] mb-3">
            {activeText.school} • {activeText.century}
          </div>
          <h2 className="text-3xl md:text-5xl font-serif font-black text-[#1A1A1A] mb-3 tracking-tight">
            ॥ {transliterate(activeText.devanagariTitle, readingScript)} ॥
          </h2>
          <p className="text-xl md:text-2xl font-serif italic text-stone-700 mb-2">
            {activeText.title}
          </p>
          <p className="text-xs font-sans text-stone-600">
            प्रणेता (Author): <span className="font-bold text-stone-900">{activeText.author}</span> • कुल सूत्राणि (Total): {totalSutrasCount}
          </p>
        </div>

        {/* Text Sections & Continuous Sutras - Clean, unadorned, high-contrast mūla text */}
        <div className="space-y-12">
          {displayedSections.map((section, secIdx) => (
            <article key={section.id} className="space-y-6" id={`simple-section-${section.id}`}>
              {/* Section Header (Subtle & Scholarly) */}
              {sections.length > 1 && (
                <div className="pb-2 border-b-2 border-[#1A1A1A] flex items-baseline justify-between">
                  <h3 className="text-xl md:text-2xl font-serif font-black text-[#1A1A1A]">
                    ॥ {transliterate(section.titleDevanagari, readingScript)} ॥
                  </h3>
                  <span className="text-xs font-sans font-bold text-stone-500 uppercase tracking-widest">
                    {section.sutras.length} सूत्राणि
                  </span>
                </div>
              )}

              {/* Sutras: Pure Sacred Text with Sūtra Numbers */}
              <div className="space-y-6">
                {section.sutras.map((sutra: NyayaSutraItem, sIdx: number) => {
                  const transliteratedVerse = transliterate(sutra.devanagari, readingScript);
                  const isCopied = copiedId === sutra.id;

                  return (
                    <div
                      key={sutra.id || sIdx}
                      id={`simple-sutra-${sutra.id}`}
                      className="group p-4 bg-white/70 hover:bg-white border border-[#1A1A1A]/15 hover:border-[#1A1A1A] transition-all relative"
                    >
                      <div className="flex items-start justify-between gap-4 mb-1.5">
                        {/* Sutra Number Badge */}
                        <span className="font-mono text-xs font-bold px-2 py-0.5 bg-[#FAF8F5] border border-[#1A1A1A]/30 text-[#8C6239] select-none">
                          ॥ {transliterate(sutra.sutraNum, readingScript)} ॥
                        </span>

                        {/* Quick Copy on Hover */}
                        <button
                          onClick={() => handleCopySingle(transliteratedVerse, sutra.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-stone-400 hover:text-[#1A1A1A] hover:bg-[#ECE0D1] border border-transparent hover:border-[#1A1A1A] cursor-pointer"
                          title="Copy sūtra to clipboard"
                          aria-label="Copy sūtra to clipboard"
                        >
                          {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      {/* The Main Text Itself */}
                      <p
                        className="font-serif font-semibold text-[#1A1A1A] tracking-normal leading-relaxed text-left"
                        style={{
                          fontSize: `${fontSize}px`,
                          lineHeight: `${Math.round(fontSize * 1.7)}px`,
                        }}
                      >
                        {transliteratedVerse}
                      </p>
                    </div>
                  );
                })}
              </div>
            </article>
          ))}
        </div>

        {/* Pure Classical Colophon & Return to Scholarly Version */}
        <div className="text-center pt-16 pb-12 mt-16 border-t-2 border-[#1A1A1A]/20 select-none">
          <p className="text-sm font-serif font-bold text-stone-600 italic">
            ॥ इति {transliterate(activeText.devanagariTitle, readingScript)} संपूर्णम् ॥
          </p>
          <p className="text-xs font-sans text-stone-500 mt-1">
            शुभमस्तु • सर्वं श्रीकृष्णार्पणमस्तु
          </p>

          <div className="mt-8">
            <button
              onClick={onSwitchToScholarly}
              id="simple-bottom-switch-scholarly-btn"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#3B2314] hover:bg-[#1A1A1A] text-white border-2 border-[#1A1A1A] font-sans text-xs font-bold uppercase tracking-wider transition-all shadow-[3px_3px_0px_0px_rgba(26,26,26,1)] hover:shadow-none cursor-pointer"
            >
              <Layers className="w-4 h-4 text-amber-300" />
              <span>Switch to Scholarly Version (Commentaries, Vāda-Arena, Translation, AI Chat)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
