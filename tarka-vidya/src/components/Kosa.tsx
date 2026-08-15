import React, { useState, useEffect } from "react";
import { Search, Volume2, BookOpen, Layers, Award, Tag, Compass, HelpCircle, ArrowRight, Play, Pause } from "lucide-react";
import { KosaTerm } from "../types";
import KOSA_TERMS from "../data/kosa.json";
import { transliterate, formatSanskrit } from "../utils/transliteration";

interface KosaProps {
  scriptTheme: "devanagari" | "gregorian" | "combined";
  targetScript: string;
  initialTermId?: string | null;
  onTermSelected?: (id: string | null) => void;
}

export default function Kosa({ scriptTheme, targetScript, initialTermId, onTermSelected }: KosaProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTerm, setSelectedTerm] = useState<KosaTerm>(KOSA_TERMS[0]);
  const [isChanting, setIsChanting] = useState(false);

  useEffect(() => {
    if (initialTermId) {
      const term = KOSA_TERMS.find((t) => t.id === initialTermId);
      if (term) {
        setSelectedTerm(term);
        setSearchTerm("");
      }
    }
  }, [initialTermId]);

  const filteredTerms = KOSA_TERMS.filter((t) => {
    return (
      t.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.iast.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.definition.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.translation.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleChant = (textDeval: string) => {
    if ("speechSynthesis" in window) {
      if (isChanting) {
        window.speechSynthesis.cancel();
        setIsChanting(false);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(textDeval);
      utterance.lang = "hi-IN";
      utterance.rate = 0.8; // Scholarly chanting pace
      utterance.onend = () => {
        setIsChanting(false);
      };
      window.speechSynthesis.speak(utterance);
      setIsChanting(true);
    } else {
      alert("Voice synthesis is unavailable on this browser platform.");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans" id="kosa-dictionary-module">
      
      {/* Search and Title Block */}
      <div className="bg-[#F5F2EA] border-2 border-[#1A1A1A] p-6 rounded-none flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-black text-[#3B2314] uppercase tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#795548]" />
            Tarka-Vidyā Kośa (तर्कविद्या-कोषः)
          </h2>
          <p className="text-xs text-stone-705 mt-1 max-w-2xl font-bold">
            Classical Nyāya-Vaiśeṣika Lexicon. Explore the core epistemological categories (प्रमाण), ontological categories (प्रमेय), and key debate principles of standard Indian syllogistic logic.
          </p>
        </div>

        {/* Rapid Search Bar */}
        <div className="relative w-full md:w-80 shrink-0">
          <Search className="absolute left-3 top-3.5 h-4 w-4 text-stone-600" />
          <input
            type="text"
            placeholder="Search Nyāya terms (e.g. Vyapti, हेतु)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white text-[#1A1A1A] text-xs border-2 border-[#1A1A1A] rounded-none pl-9 pr-4 py-3 focus:outline-none focus:bg-[#FFF] font-sans font-bold uppercase tracking-wide"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Term Selection Index on the Left */}
        <div className="lg:col-span-4 bg-white border-2 border-[#1A1A1A] p-4 rounded-none space-y-3.5 h-[600px] overflow-y-auto custom-scrollbar">
          <span className="text-[10px] font-black text-[#1A1A1A] uppercase tracking-widest block pb-1 border-b border-stone-200">
            Dictionary Terms Index ({filteredTerms.length})
          </span>
          {filteredTerms.length === 0 ? (
            <p className="text-xs text-stone-550 py-10 text-center font-serif">No terms found matching search constraint.</p>
          ) : (
            <div className="space-y-2">
              {filteredTerms.map((t) => {
                const isSelected = selectedTerm.id === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      setSelectedTerm(t);
                      if (onTermSelected) {
                        onTermSelected(t.id);
                      }
                      if (isChanting) {
                        window.speechSynthesis.cancel();
                        setIsChanting(false);
                      }
                    }}
                    className={`w-full text-left p-3 rounded-none border-2 transition-all flex items-start justify-between cursor-pointer ${
                      isSelected
                        ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
                        : "bg-white text-[#1A1A1A] border-stone-300 hover:border-[#1A1A1A] hover:bg-[#F5F2EA]"
                    }`}
                  >
                    <div>
                      <div className="font-serif text-sm font-black flex items-center gap-1.5">
                        <span className={isSelected ? "text-[#FFF]" : "text-[#795548]"}>
                          {transliterate(t.term, targetScript)}
                        </span>
                        <span className={`text-[10px] font-sans font-normal uppercase ${isSelected ? "text-stone-300" : "text-stone-500"}`}>
                          ({t.iast})
                        </span>
                      </div>
                      <p className={`text-[10px] mt-1 line-clamp-1 font-sans ${isSelected ? "text-stone-300" : "text-stone-605"}`}>
                        {t.definition}
                      </p>
                    </div>
                    
                    <ArrowRight className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${isSelected ? "text-[#FFF]" : "text-stone-400"}`} />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Highly Detailed Morphological Content Board on the Right */}
        <div className="lg:col-span-8 space-y-5">
          {selectedTerm ? (
            <div className="bg-white border-2 border-[#1A1A1A] p-6 rounded-none shadow-none space-y-6">
              
              {/* Header Box with standard Ashtadhyayi definitions */}
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b-2 border-[#1A1A1A] pb-4">
                <div className="space-y-1">
                  <span className="text-[11px] font-black text-[#795548] tracking-widest uppercase block font-sans">
                    {selectedTerm.translation}
                  </span>
                  <h3 className="text-2xl font-serif font-black text-[#3B2314] flex items-baseline gap-2">
                    <span>{transliterate(selectedTerm.term, targetScript)}</span>
                    <span className="text-stone-550 font-sans font-normal text-sm">({selectedTerm.iast})</span>
                  </h3>
                </div>

                {/* Speech Synthesis Recitation Button */}
                <button
                  onClick={() => handleChant(selectedTerm.sanskritQuote || selectedTerm.term)}
                  className={`flex items-center gap-2 text-xs border-2 border-[#1A1A1A] px-4 py-2 font-black uppercase tracking-wider rounded-none transition-all cursor-pointer ${
                    isChanting ? "bg-[#1A1A1A] text-white" : "bg-white hover:bg-[#F5F2EA]"
                  }`}
                >
                  <Volume2 className={`w-4 h-4 ${isChanting ? "text-white" : "text-[#795548]"}`} />
                  <span>{isChanting ? "Reciting..." : "Listen to Term Chant"}</span>
                </button>
              </div>

              {/* Nyāya-Vaiśeṣika Categorizations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#F5F2EA] p-4 border-2 border-[#1A1A1A] rounded-none space-y-2.5 font-sans">
                  <div className="flex items-center gap-1 text-[10px] font-black text-[#795548] uppercase tracking-wider">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Logical Category (वर्गः)</span>
                  </div>
                  <div className="font-serif text-base font-black text-[#1A1A1A]">
                    {selectedTerm.category}
                  </div>
                  <p className="text-xs text-stone-705 leading-relaxed">
                    Classified under standard scholastic treatises defining ontological (प्रमेय) or epistemological (प्रमाण) frameworks of debate.
                  </p>
                </div>

                <div className="bg-[#F5F2EA] p-4 border-2 border-[#1A1A1A] rounded-none space-y-2.5 font-sans">
                  <div className="flex items-center gap-1 text-[10px] font-black text-[#795548] uppercase tracking-wider">
                    <Compass className="w-3.5 h-3.5" />
                    <span>Debate Execution Role (विनियोगः)</span>
                  </div>
                  <div className="font-serif text-sm font-bold text-[#1A1A1A] leading-relaxed">
                    {selectedTerm.logicalRole}
                  </div>
                  
                  <div className="flex justify-between items-center text-xs mt-3.5 pt-2 border-t border-stone-300">
                    <span className="text-stone-550 font-bold uppercase block text-[9px]">Textbook validation:</span>
                    <strong className="text-[#1A1A1A] font-serif italic text-xs">{selectedTerm.source}</strong>
                  </div>
                </div>
              </div>

              {/* English Academic Definition */}
              <div className="space-y-2 font-sans">
                <span className="text-[10px] font-black text-stone-500 tracking-wider uppercase block">
                  Conceptual Epistemology Definition
                </span>
                <p className="text-stone-800 text-sm leading-relaxed border-l-4 border-[#795548] pl-3">
                  {selectedTerm.definition}
                </p>
              </div>

              {/* Exact Textual Sanskrit Quotation (Shastra Sutras) */}
              <div className="bg-[#F2FAF4] border-2 border-[#1A1A1A] p-5 rounded-none space-y-3">
                <span className="text-[10px] font-black text-emerald-900 tracking-wider uppercase block font-sans">
                  Classical Definitional Quote (लक्षण-वाक्यम्)
                </span>
                <p className="font-serif text-lg leading-relaxed text-[#1A1A1A] font-medium whitespace-pre-wrap">
                  {transliterate(selectedTerm.sanskritQuote, targetScript)}
                </p>
                <p className="text-xs font-mono text-stone-550 italic leading-relaxed">
                  {selectedTerm.sanskritQuoteIast}
                </p>
              </div>

              {/* Scholastic commentary */}
              <div className="space-y-1.5 font-sans">
                <span className="text-[10px] font-black text-[#795548] tracking-widest uppercase block">
                  Debate & Epistemological Role (टीका-टिप्पणी)
                </span>
                <p className="text-xs text-stone-705 leading-relaxed whitespace-pre-wrap">
                  {selectedTerm.commentaryNotes}
                </p>
              </div>

            </div>
          ) : (
            <div className="bg-[#F5F2EA] rounded-none border-2 border-dashed border-[#1A1A1A] py-24 text-center">
              <BookOpen className="w-8 h-8 text-[#795548] mx-auto" />
              <p className="text-sm font-bold text-[#1A1A1A] mt-2 font-serif">Select a logical terminology from the index list to review its logical definition.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// Quick helper to avoid lint complaints
function setIsChChamping(val: boolean) {}
