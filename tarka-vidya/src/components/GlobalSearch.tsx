import React, { useState, useMemo } from "react";
import { Search, Book, Layers, ArrowRight, BookOpen, Sparkles, Filter, X, CheckSquare } from "lucide-react";
import NYAYA_TEXTS_RAW from "../data/texts.json";
import NYAYA_SECTIONS_RAW from "../data/nyayaSutras.json";
import TARKASASTRAS_SECTIONS_RAW from "../data/tarkasastram.json";
import TARKABHASHA_SECTIONS_RAW from "../data/tarkabhasha.json";
import LAKSANA_SECTIONS_RAW from "../data/laksana-sangraha.json";
import VAISESHIKA_SECTIONS_RAW from "../data/vaiseasika-sutras.json";
import PADARTHA_SECTIONS_RAW from "../data/padartha-dharmasamgraha.json";
import TARKASAMGRAHA_SECTIONS_RAW from "../data/tarkasamgraha.json";
import KARIKAVALI_SECTIONS_RAW from "../data/karikavali.json";
import ANANDAGIRI_SECTIONS_RAW from "../data/anandagiri-tarkasangraha.json";
import VYOMAVATI_SECTIONS_RAW from "../data/vyomavati.json";
import KOSA_TERMS_RAW from "../data/kosa.json";

import { NyayaText, NyayaSection, NyayaSutraItem, KosaTerm } from "../types";
import { transliterate } from "../utils/transliteration";

const NYAYA_TEXTS = NYAYA_TEXTS_RAW as NyayaText[];
const KOSA_TERMS = KOSA_TERMS_RAW as KosaTerm[];

const PRAMANA_OPTIONS = [
  { id: "pratyaksa", label: "Pratyakṣa (Perception)" },
  { id: "anumana", label: "Anumāna (Inference)" },
  { id: "upamana", label: "Upamāna (Comparison)" },
  { id: "sabda", label: "Śabda (Testimony)" },
  { id: "other", label: "Other / Ontology (इतर)" },
];

const classifyPramanas = (textToAnalyze: string): string[] => {
  const text = textToAnalyze.toLowerCase();
  const pramanas: string[] = [];

  // Pratyakṣa (Perception)
  if (
    text.includes("pratyaksa") ||
    text.includes("pratyakṣa") ||
    text.includes("perception") ||
    text.includes("sensory") ||
    text.includes("indriya") ||
    text.includes("senses") ||
    text.includes("प्रत्यक्ष") ||
    text.includes("इन्द्रिय") ||
    text.includes("चाक्षुष") ||
    text.includes("स्पार्शन")
  ) {
    pramanas.push("pratyaksa");
  }

  // Anumāna (Inference)
  if (
    text.includes("anumana") ||
    text.includes("anumāna") ||
    text.includes("inference") ||
    text.includes("deduction") ||
    text.includes("syllogism") ||
    text.includes("hetu") ||
    text.includes("vyapti") ||
    text.includes("vyāpti") ||
    text.includes("paksa") ||
    text.includes("pakṣa") ||
    text.includes("sadhya") ||
    text.includes("sādhya") ||
    text.includes("linga") ||
    text.includes("liṅga") ||
    text.includes("अनुमान") ||
    text.includes("हेतु") ||
    text.includes("व्याप्ति") ||
    text.includes("पक्ष") ||
    text.includes("साध्य") ||
    text.includes("व्यापक")
  ) {
    pramanas.push("anumana");
  }

  // Upamāna (Comparison)
  if (
    text.includes("upamana") ||
    text.includes("upamāna") ||
    text.includes("comparison") ||
    text.includes("analogy") ||
    text.includes("similarity") ||
    text.includes("sadrsya") ||
    text.includes("sādṛśya") ||
    text.includes("उपमान") ||
    text.includes("सादृश्य") ||
    text.includes("अतिदेशवाक्य")
  ) {
    pramanas.push("upamana");
  }

  // Śabda (Verbal Testimony)
  if (
    text.includes("sabda") ||
    text.includes("śabda") ||
    text.includes("testimony") ||
    text.includes("verbal") ||
    text.includes("word") ||
    text.includes("authority") ||
    text.includes("apta") ||
    text.includes("āpta") ||
    text.includes("vākya") ||
    text.includes("vakya") ||
    text.includes("शब्द") ||
    text.includes("आप्त") ||
    text.includes("वाक्य") ||
    text.includes("आगम")
  ) {
    pramanas.push("sabda");
  }

  if (pramanas.length === 0) {
    pramanas.push("other");
  }

  return pramanas;
};

const getPramanaBadgeProps = (pramanaId: string) => {
  switch (pramanaId) {
    case "pratyaksa":
      return { label: "Pratyakṣa", className: "bg-emerald-50 text-emerald-800 border-emerald-200" };
    case "anumana":
      return { label: "Anumāna", className: "bg-amber-50 text-amber-800 border-amber-200" };
    case "upamana":
      return { label: "Upamāna", className: "bg-purple-50 text-purple-800 border-purple-200" };
    case "sabda":
      return { label: "Śabda", className: "bg-blue-50 text-blue-800 border-blue-200" };
    default:
      return { label: "Ontology", className: "bg-stone-55 text-stone-700 border-stone-200" };
  }
};

// Map text IDs to their raw sections
const TEXTS_SECTIONS_MAP: Record<string, NyayaSection[]> = {
  "nyaya-sutras": NYAYA_SECTIONS_RAW as NyayaSection[],
  "tarka-sastram": TARKASASTRAS_SECTIONS_RAW as NyayaSection[],
  "tarkabhasha": TARKABHASHA_SECTIONS_RAW as NyayaSection[],
  "laksana-sangraha": LAKSANA_SECTIONS_RAW as NyayaSection[],
  "vaiseasika-sutras": VAISESHIKA_SECTIONS_RAW as NyayaSection[],
  "padartha-dharmasamgraha": PADARTHA_SECTIONS_RAW as NyayaSection[],
  "tarka-samgraha": TARKASAMGRAHA_SECTIONS_RAW as NyayaSection[],
  "karikavali": KARIKAVALI_SECTIONS_RAW as NyayaSection[],
  "anandagiri-tarkasangraha": ANANDAGIRI_SECTIONS_RAW as NyayaSection[],
  "vyomavati": VYOMAVATI_SECTIONS_RAW as NyayaSection[]
};

interface GlobalSearchProps {
  onSelectSutra: (textId: string, sectionId: string, sutraIndex: number) => void;
  targetScript: string;
}

export default function GlobalSearch({ onSelectSutra, targetScript }: GlobalSearchProps) {
  const [query, setQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "sanskrit" | "translation" | "commentary" | "glossary">("all");
  const [selectedTextId, setSelectedTextId] = useState<string>("all");
  const [selectedPramanas, setSelectedPramanas] = useState<string[]>(["pratyaksa", "anumana", "upamana", "sabda", "other"]);

  const handleClear = () => {
    setQuery("");
  };

  const handlePramanaToggle = (id: string) => {
    setSelectedPramanas((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  // Helper to split a block of text into individual sentences/clauses
  const splitIntoSentences = (text: string, isSanskritOrIndic: boolean): string[] => {
    if (!text) return [];
    
    // Split by newlines first
    const lines = text.split(/\n+/);
    const sentences: string[] = [];
    
    lines.forEach(line => {
      if (isSanskritOrIndic) {
        // Split by । or ॥
        const parts = line.split(/([।॥])/);
        let current = "";
        for (let i = 0; i < parts.length; i++) {
          const p = parts[i];
          if (p === "।" || p === "॥") {
            current += p;
            sentences.push(current.trim());
            current = "";
          } else {
            current += p;
          }
        }
        if (current.trim()) {
          sentences.push(current.trim());
        }
      } else {
        // English / Roman split by periods, question marks, exclamation marks
        const parts = line.split(/([.?!])/);
        let current = "";
        for (let i = 0; i < parts.length; i++) {
          const p = parts[i];
          if (p === "." || p === "?" || p === "!") {
            current += p;
            sentences.push(current.trim());
            current = "";
          } else {
            current += p;
          }
        }
        if (current.trim()) {
          sentences.push(current.trim());
        }
      }
    });
    
    return sentences.map(s => s.trim()).filter(Boolean);
  };

  // Perform multi-dimensional search
  const results = useMemo(() => {
    if (!query.trim() || query.trim().length < 2) return { sutras: [], kosa: [] };

    const searchStr = query.toLowerCase().trim();
    const matchesSentences: Array<{
      text: NyayaText;
      section: NyayaSection;
      sutra: NyayaSutraItem;
      sutraIndex: number;
      fieldType: string;
      sentence: string;
      pramanas: string[];
    }> = [];

    const matchesKosa: Array<KosaTerm & { pramanas: string[] }> = [];

    // 1. Search Glossary Terms
    if (filterType === "all" || filterType === "glossary") {
      KOSA_TERMS.forEach((term) => {
        const termText = [
          term.term,
          term.iast,
          term.definition,
          term.translation,
          term.category,
          term.commentaryNotes,
          term.logicalRole,
          term.source
        ].join(" ");
        const pramanas = classifyPramanas(termText);

        const hasPramanaMatch = pramanas.some((p) => selectedPramanas.includes(p));
        if (!hasPramanaMatch) return;

        const isMatch = 
          term.term.toLowerCase().includes(searchStr) ||
          term.iast.toLowerCase().includes(searchStr) ||
          term.definition.toLowerCase().includes(searchStr) ||
          term.translation.toLowerCase().includes(searchStr) ||
          term.category.toLowerCase().includes(searchStr) ||
          term.commentaryNotes.toLowerCase().includes(searchStr);

        if (isMatch) {
          matchesKosa.push({ ...term, pramanas });
        }
      });
    }

    // 2. Search Sutras & Commentaries across texts sentence-by-sentence
    if (filterType !== "glossary") {
      NYAYA_TEXTS.forEach((text) => {
        if (selectedTextId !== "all" && text.id !== selectedTextId) return;

        const sections = TEXTS_SECTIONS_MAP[text.id] || [];
        sections.forEach((section) => {
          section.sutras.forEach((sutra, sIdx) => {
            const sutraText = [
              sutra.heading,
              sutra.devanagari,
              sutra.translations?.english || "",
              sutra.translations?.hindi || "",
              sutra.translations?.bengali || "",
              sutra.commentarySanskrit || "",
              sutra.commentary?.english || "",
              sutra.commentary?.hindi || "",
              sutra.commentary?.bengali || ""
            ].join(" ");
            const pramanas = classifyPramanas(sutraText);

            const hasPramanaMatch = pramanas.some((p) => selectedPramanas.includes(p));
            if (!hasPramanaMatch) return;

            const fields: Array<{ name: string; text: string; isIndic: boolean }> = [
              { name: "Sūtra Title", text: sutra.heading, isIndic: true },
              { name: "Sanskrit Aphorism", text: sutra.devanagari, isIndic: true },
              { name: "English Translation", text: sutra.translations?.english || "", isIndic: false },
              { name: "Hindi Translation", text: sutra.translations?.hindi || "", isIndic: true },
              { name: "Bengali Translation", text: sutra.translations?.bengali || "", isIndic: true },
              { name: "Sanskrit Commentary", text: sutra.commentarySanskrit || "", isIndic: true },
              { name: "English Commentary", text: sutra.commentary?.english || "", isIndic: false },
              { name: "Hindi Commentary", text: sutra.commentary?.hindi || "", isIndic: true },
              { name: "Bengali Commentary", text: sutra.commentary?.bengali || "", isIndic: true }
            ];

            fields.forEach((field) => {
              if (!field.text) return;
              
              // Apply active filters
              if (filterType === "sanskrit" && !field.isIndic) return;
              if (filterType === "translation" && !field.name.includes("Translation")) return;
              if (filterType === "commentary" && !field.name.includes("Commentary")) return;

              const sentences = splitIntoSentences(field.text, field.isIndic);
              sentences.forEach((sentence) => {
                const sentenceLower = sentence.toLowerCase();
                const sentenceInTargetLower = field.isIndic ? transliterate(sentence, targetScript).toLowerCase() : "";
                
                const isMatch = 
                  sentenceLower.includes(searchStr) || 
                  (sentenceInTargetLower && sentenceInTargetLower.includes(searchStr));

                if (isMatch) {
                  matchesSentences.push({
                    text,
                    section,
                    sutra,
                    sutraIndex: sIdx,
                    fieldType: field.name,
                    sentence: sentence,
                    pramanas
                  });
                }
              });
            });
          });
        });
      });
    }

    return { sutras: matchesSentences, kosa: matchesKosa };
  }, [query, filterType, selectedTextId, selectedPramanas, targetScript]);

  // Total available metrics for display
  const metrics = useMemo(() => {
    let totalSutras = 0;
    Object.values(TEXTS_SECTIONS_MAP).forEach((secs) => {
      secs.forEach((sec) => {
        totalSutras += sec.sutras.length;
      });
    });
    return {
      texts: NYAYA_TEXTS.length,
      sutras: totalSutras,
      kosa: KOSA_TERMS.length
    };
  }, []);

  // Highlight matches helper
  const highlightQueryText = (text: string, search: string) => {
    if (!search.trim()) return <span>{text}</span>;
    const parts = text.split(new RegExp(`(${search.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")})`, "gi"));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === search.toLowerCase() ? (
            <mark key={i} className="bg-amber-200 text-[#3B2314] font-bold px-1 py-0.5 rounded-xs">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  // Styles for field type badges
  const getFieldTypeStyles = (fieldType: string) => {
    switch (fieldType) {
      case "Sanskrit Aphorism":
        return "bg-[#8C6239] text-white border-[#8C6239]";
      case "Sūtra Title":
        return "bg-[#3B2314] text-[#ECE0D1] border-[#3B2314]";
      case "Sanskrit Commentary":
        return "bg-amber-50 text-amber-800 border-amber-200";
      case "English Translation":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "English Commentary":
        return "bg-slate-50 text-slate-700 border-slate-200";
      case "Hindi Translation":
      case "Hindi Commentary":
        return "bg-teal-50 text-teal-700 border-teal-200";
      case "Bengali Translation":
      case "Bengali Commentary":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-stone-50 text-stone-700 border-stone-200";
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4 md:p-6" id="global-search-portal">
      {/* Search Header Banner */}
      <div className="bg-[#F5EDD6] border-2 border-[#1A1A1A] p-6 text-center space-y-3 shadow-none rounded-none">
        <span className="text-[10px] font-black uppercase text-[#8C6239] tracking-widest block font-sans">
          सर्वानुसन्धानमण्डपम् • Universal Scholastic Search Engine
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif font-black text-stone-900">
          Sarvanusadhāna Maṇḍapam
        </h2>
        <p className="text-xs text-stone-600 max-w-2xl mx-auto font-sans leading-relaxed">
          Type queries in Devanāgarī (e.g. <span className="font-serif italic font-bold">अनुमान</span>), IAST transliteration (e.g. <span className="font-mono bg-white/50 px-1 py-0.5 rounded">anumana</span>), or English/Hindi/Bengali. Instantly look up sūtras, commentaries, and terms.
        </p>
        
        <div className="text-[10px] font-mono text-stone-500 font-bold flex flex-wrap justify-center gap-x-4 gap-y-1">
          <span>Treatises: {metrics.texts}</span>
          <span>•</span>
          <span>Aphorisms: {metrics.sutras}</span>
          <span>•</span>
          <span>Glossary Terms: {metrics.kosa}</span>
        </div>
      </div>

      {/* Search Bar Controls */}
      <div className="bg-white border-2 border-[#1A1A1A] p-4 space-y-4 rounded-none">
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-5 h-5 text-stone-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search treatises, sutras, commentaries, English, Hindi, or Bengali translations..."
            className="w-full bg-[#FAF8F5] border-2 border-stone-200 hover:border-stone-400 focus:border-[#8C6239] outline-none text-stone-900 py-3.5 pl-12 pr-12 text-sm sm:text-base font-serif rounded-none transition-all placeholder:text-stone-400 shadow-inner"
            id="global-search-input"
          />
          {query && (
            <button
              onClick={handleClear}
              className="absolute right-4 p-1 hover:bg-stone-100 rounded-full transition-all cursor-pointer"
              title="Clear Search"
            >
              <X className="w-5 h-5 text-stone-500" />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center pt-2 border-t border-stone-100">
          {/* Text selection filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-stone-500 shrink-0" />
            <span className="text-[10px] font-black uppercase text-stone-500 tracking-wider font-sans">Scope:</span>
            <select
              value={selectedTextId}
              onChange={(e) => setSelectedTextId(e.target.value)}
              className="bg-[#FAF8F5] text-stone-800 text-[11px] font-bold border border-stone-300 rounded-none py-1 px-2.5 focus:outline-none focus:border-[#8C6239]"
            >
              <option value="all">All Classical Treatises</option>
              {NYAYA_TEXTS.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title} ({transliterate(t.devanagariTitle, targetScript)})
                </option>
              ))}
            </select>
          </div>

          {/* Field Category Filter Buttons */}
          <div className="flex flex-wrap gap-1">
            {(["all", "sanskrit", "translation", "commentary", "glossary"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1 text-[10px] font-bold uppercase transition-all rounded-none cursor-pointer border ${
                  filterType === type
                    ? "bg-[#8C6239] text-white border-[#8C6239] shadow-xs"
                    : "bg-[#FAF8F5] text-stone-600 border-stone-250 hover:bg-stone-50"
                }`}
              >
                {type === "all" ? "All Fields" : type}
              </button>
            ))}
          </div>
        </div>

        {/* Pramāṇa Checkbox Filters */}
        <div className="pt-3 border-t border-stone-100 space-y-2">
          <div className="flex items-center gap-1.5">
            <CheckSquare className="w-3.5 h-3.5 text-[#8C6239] shrink-0" />
            <span className="text-[10px] font-black uppercase text-stone-500 tracking-wider font-sans">
              Pramāṇa Filters (Epistemic Source):
            </span>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {PRAMANA_OPTIONS.map((opt) => {
              const isChecked = selectedPramanas.includes(opt.id);
              return (
                <label key={opt.id} className="flex items-center gap-2 text-xs font-bold text-stone-700 hover:text-[#8C6239] cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handlePramanaToggle(opt.id)}
                    className="w-3.5 h-3.5 accent-[#8C6239] cursor-pointer"
                  />
                  <span className={isChecked ? "text-[#8C6239] font-extrabold" : "text-stone-500"}>
                    {opt.label}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      </div>

      {/* Search Status & Empty state */}
      {!query.trim() ? (
        <div className="text-center py-16 bg-[#FAF8F5] border border-dashed border-stone-300/80 rounded-none space-y-2">
          <BookOpen className="w-10 h-10 text-stone-300 mx-auto" />
          <p className="text-sm font-serif text-stone-500 font-bold">
            Awaiting your scholastic query...
          </p>
          <p className="text-[10px] text-stone-400 font-sans max-w-md mx-auto leading-relaxed">
            Results will update as you type. Real-time searching covers both original scripts, regional scripts, and all modern commentaries.
          </p>
        </div>
      ) : query.trim().length < 2 ? (
        <div className="text-center py-8 text-xs font-mono text-stone-500">
          Please enter at least 2 characters to search.
        </div>
      ) : results.sutras.length === 0 && results.kosa.length === 0 ? (
        <div className="text-center py-16 bg-[#FAF8F5] border border-dashed border-stone-300 rounded-none space-y-2">
          <Sparkles className="w-8 h-8 text-stone-300 mx-auto" />
          <p className="text-sm font-serif text-stone-500 font-black">
            No scholastic matches found for "{query}"
          </p>
          <p className="text-[10px] text-stone-400 font-sans max-w-sm mx-auto leading-relaxed">
            Try checking spelling, trying Devanāgarī, or changing your active search filters/scope above.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Results Status Bar */}
          <div className="flex items-center justify-between text-xs font-sans font-bold text-stone-500 px-1 border-b border-stone-200 pb-1">
            <span>
              Found {results.kosa.length + results.sutras.length} matching entries
            </span>
            <span className="font-mono text-[10px]">
              ({results.kosa.length} glossary terms • {results.sutras.length} sentence matches)
            </span>
          </div>

          {/* Glossary Matches Section */}
          {results.kosa.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#3B2314] flex items-center gap-1.5 font-sans">
                <Book className="w-4 h-4 text-[#8C6239]" />
                <span>Glossary Definitions ({results.kosa.length})</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.kosa.map((term) => (
                  <div
                    key={term.id}
                    className="bg-[#FAF9F5] border-2 border-stone-250 p-4.5 rounded-none flex flex-col justify-between hover:border-[#8C6239]/80 transition-all shadow-xs text-left"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2 border-b border-stone-200/50 pb-1.5">
                        <div>
                          <strong className="font-serif text-base text-stone-900 block">
                            {transliterate(term.term, targetScript)}
                          </strong>
                          <span className="text-[10px] font-mono text-stone-400 font-bold block mt-0.5">
                            {term.iast}
                          </span>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-[8px] font-black uppercase tracking-widest bg-stone-200 text-stone-700 px-2 py-0.5 rounded-none">
                            {term.category}
                          </span>
                          <div className="flex flex-wrap gap-1 justify-end">
                            {term.pramanas?.map((pId) => {
                              const badge = getPramanaBadgeProps(pId);
                              return (
                                <span key={pId} className={`text-[7.5px] font-bold px-1.5 py-0.5 border rounded-none uppercase tracking-wider ${badge.className}`}>
                                  {badge.label}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-xs text-stone-700 leading-relaxed font-sans">
                        <strong className="text-stone-800">Role:</strong> {term.logicalRole}
                        <p className="mt-1 font-serif text-stone-800 italic text-[12.5px] leading-normal">
                          "{highlightQueryText(term.definition, query)}"
                        </p>
                      </div>

                      {term.sanskritQuote && (
                        <div className="mt-2 text-[10.5px] font-serif italic text-[#8C6239] bg-stone-50 p-2 border-l-2 border-[#8C6239]/40 leading-relaxed">
                          {transliterate(term.sanskritQuote, targetScript)}
                        </div>
                      )}
                    </div>
                    <div className="text-[9px] font-sans font-bold text-stone-400 mt-3 flex items-center justify-between pt-2 border-t border-stone-100">
                      <span>Source: {term.source}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sūtra Matches Section */}
          {results.sutras.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#3B2314] flex items-center gap-1.5 font-sans">
                <Layers className="w-4 h-4 text-[#8C6239]" />
                <span>Textual Sentence Occurrences ({results.sutras.length})</span>
              </h3>
              
              <div className="space-y-4">
                {results.sutras.map(({ text, section, sutra, sutraIndex, fieldType, sentence, pramanas }, idx) => {
                  const isSanskritMatch = fieldType === "Sanskrit Aphorism" || fieldType === "Sanskrit Commentary" || fieldType === "Sūtra Title";
                  const displaySentence = isSanskritMatch ? transliterate(sentence, targetScript) : sentence;

                  return (
                    <div
                      key={`${sutra.id}-${idx}`}
                      className="bg-white border-2 border-[#1A1A1A] p-4 sm:p-5 rounded-none hover:border-[#8C6239] transition-all relative text-left shadow-xs"
                    >
                      {/* Header line of match */}
                      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5 border-b border-stone-150 pb-2 mb-3">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] font-black uppercase tracking-wider bg-[#3B2314] text-white px-2 py-0.5 rounded-none">
                            {text.title}
                          </span>
                          <span className="text-stone-400 text-[10px]">/</span>
                          <span className="text-[9px] font-serif font-black text-stone-600">
                            {transliterate(section.titleDevanagari, targetScript)}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {/* Pramāṇa Badges */}
                          <div className="flex flex-wrap gap-1">
                            {pramanas?.map((pId) => {
                              const badge = getPramanaBadgeProps(pId);
                              return (
                                <span key={pId} className={`text-[7.5px] font-bold px-1.5 py-0.5 border rounded-none uppercase tracking-wider ${badge.className}`}>
                                  {badge.label}
                                </span>
                              );
                            })}
                          </div>

                          {/* Segment Type Pill */}
                          <span className={`text-[8.5px] font-black uppercase tracking-wider px-2 py-0.5 border rounded-none ${getFieldTypeStyles(fieldType)}`}>
                            {fieldType}
                          </span>
                          
                          <span className="text-[9px] font-mono font-bold bg-[#FAF8F5] text-[#8C6239] px-2 py-0.5 border border-[#8C6239]/20">
                            Sūtra {sutra.sutraNum} ({sutra.id})
                          </span>
                        </div>
                      </div>

                      {/* Matching Sentence/Line */}
                      <div className="space-y-3">
                        <div className="p-3 bg-[#FAF9F5] border-l-4 border-[#8C6239] rounded-none">
                          <p className={`font-serif text-stone-900 leading-relaxed text-justify ${isSanskritMatch ? "text-base sm:text-lg font-black" : "text-sm font-medium"}`}>
                            {highlightQueryText(displaySentence, query)}
                          </p>
                        </div>

                        {/* Scholarly Sub-Context Section */}
                        <div className="text-[11px] font-sans text-stone-500 bg-stone-50/60 p-2.5 border border-stone-200/50 rounded-none flex flex-col gap-1">
                          <span className="text-[8px] font-black uppercase tracking-widest text-stone-400 block">
                            Parent Context (Aphorism Definition)
                          </span>
                          <div className="space-y-1">
                            <p className="font-serif font-black text-stone-850">
                              {transliterate(sutra.devanagari, targetScript)}
                            </p>
                            {sutra.translations?.english && (
                              <p className="font-sans italic text-stone-600 text-[10.5px]">
                                {sutra.translations.english}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Quick navigation and load buttons */}
                      <div className="mt-3.5 pt-3 border-t border-stone-150 flex flex-wrap items-center justify-between gap-3">
                        <div className="text-[9px] font-mono text-stone-400 font-bold">
                          ID: {sutra.id} • School: {text.school} • Period: {text.century}
                        </div>

                        <button
                          onClick={() => onSelectSutra(text.id, section.id, sutraIndex)}
                          className="px-3 py-1.5 bg-[#FAF8F5] hover:bg-[#3B2314] hover:text-white border-2 border-[#1A1A1A] text-[10px] font-sans font-black uppercase rounded-none transition-all cursor-pointer flex items-center gap-1 shadow-none"
                        >
                          <span>📖 Jump to Sūtra in Library</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
