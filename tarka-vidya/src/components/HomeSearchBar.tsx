/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, X, BookOpen, Bookmark, Sparkles, ArrowRight, Layers, FileText } from "lucide-react";
import { transliterate } from "../utils/transliteration";
import {
  searchUnifiedScholarlyCorpus,
  GlobalSearchResultSentence,
  ALL_TEXT_SECTIONS_MAP,
} from "../utils/corpusSearch";
import { KosaTerm } from "../types";

interface HomeSearchBarProps {
  onEnterSearch: (query?: string) => void;
  onSelectSutra: (textId: string, sectionId: string, sutraIndex: number) => void;
  scriptTheme: "devanagari" | "gregorian" | "combined";
  targetScript: string;
}

export default function HomeSearchBar({
  onEnterSearch,
  onSelectSutra,
  scriptTheme,
  targetScript,
}: HomeSearchBarProps) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Quick inquiry chips for rapid scholastic access - limited to five canonical concepts
  const quickQueries = [
    { devanagari: "प्रत्यक्ष", iast: "Pratyakṣa", desc: "Perception" },
    { devanagari: "व्याप्ति", iast: "Vyāpti", desc: "Concomitance" },
    { devanagari: "अनुमान", iast: "Anumāna", desc: "Inference" },
    { devanagari: "हेत्वाभास", iast: "Hetvābhāsa", desc: "Fallacies" },
    { devanagari: "पदार्थ", iast: "Padārtha", desc: "Categories" },
  ];

  // Perform search when query length >= 2
  const results = useMemo(() => {
    if (!query.trim() || query.trim().length < 2) {
      return { sutras: [], kosa: [] };
    }
    return searchUnifiedScholarlyCorpus({
      query,
      filterType: "all",
      selectedTextId: "all",
      targetScript,
    });
  }, [query, targetScript]);

  const totalResultsCount = results.sutras.length + results.kosa.length;
  const topSutras = results.sutras.slice(0, 5);
  const topKosa = results.kosa.slice(0, 4);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onEnterSearch(query.trim());
    } else {
      onEnterSearch();
    }
  };

  const handleChipClick = (term: string) => {
    setQuery(term);
    setIsFocused(true);
  };

  const highlightMatch = (text: string, search: string) => {
    if (!search.trim()) return text;
    const parts = text.split(new RegExp(`(${search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === search.toLowerCase() ? (
        <mark key={i} className="bg-amber-200 text-stone-900 font-bold px-0.5 rounded-none">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div
      ref={containerRef}
      className="w-full max-w-4xl mx-auto z-30 relative"
      id="home-global-search-bar"
    >
      {/* Prominent Scholarly Search Container */}
      <div className="bg-[#FAF8F5] border-2 border-[#1A1A1A] p-2.5 md:p-3.5 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] transition-all">
        {/* Search Input Form */}
        <form onSubmit={handleFormSubmit} className="relative flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1 flex items-center">
            <Search className="absolute left-3.5 w-4 h-4 text-stone-400 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsFocused(true);
              }}
              onFocus={() => setIsFocused(true)}
              autoComplete="off"
              placeholder="Search by Sanskrit (प्रत्यक्ष, हेतु, व्याप्ति), IAST, or English (perception, inference)..."
              className="w-full pl-10 pr-9 py-2 bg-white border-2 border-[#1A1A1A] text-sm text-stone-900 placeholder:text-stone-400 font-sans focus:outline-hidden focus:ring-2 focus:ring-[#8C6239] transition-all rounded-none"
              id="home-search-input"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setIsFocused(false);
                }}
                className="absolute right-2.5 p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            type="submit"
            className="px-5 py-2 bg-[#3B2314] hover:bg-[#1A1A1A] text-white font-sans text-xs font-black uppercase tracking-widest border-2 border-[#1A1A1A] flex items-center justify-center gap-2 cursor-pointer transition-all shrink-0 shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5"
            id="home-search-submit-btn"
          >
            <Search className="w-3.5 h-3.5 text-amber-300" />
            <span>Search</span>
            <ArrowRight className="w-3.5 h-3.5 text-white" />
          </button>
        </form>

        {/* Quick Scholastic Inquiry Chips */}
        <div className="flex items-center gap-1.5 flex-wrap mt-2 pt-2 border-t border-[#8C6239]/10 text-left">
          <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 flex items-center gap-1 mr-1">
            <Sparkles className="w-3 h-3 text-[#8C6239]" />
            <span>Concepts:</span>
          </span>
          {quickQueries.map((item) => (
            <button
              key={item.devanagari}
              type="button"
              onClick={() => handleChipClick(item.devanagari)}
              className="px-2 py-0.5 bg-white hover:bg-[#8C6239] hover:text-white border border-[#1A1A1A]/20 hover:border-[#1A1A1A] text-[10px] font-serif text-stone-700 transition-all cursor-pointer rounded-none flex items-center gap-1"
              title={`${item.iast} — ${item.desc}`}
            >
              <span className="font-bold">{transliterate(item.devanagari, targetScript)}</span>
              <span className="text-[9px] opacity-70">({item.desc})</span>
            </button>
          ))}
        </div>

        {/* Interactive Live Results Dropdown Overlay */}
        <AnimatePresence>
          {isFocused && query.trim().length >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="absolute left-0 right-0 top-full mt-2 bg-[#FAF8F5] border-2 border-[#1A1A1A] shadow-[8px_8px_0px_0px_rgba(26,26,26,1)] z-50 max-h-[460px] overflow-y-auto custom-scrollbar p-3 text-left"
            >
              {totalResultsCount === 0 ? (
                <div className="p-6 text-center text-stone-500 space-y-2">
                  <p className="font-serif text-sm">
                    No exact scholarly matches found for &ldquo;<strong>{query}</strong>&rdquo;
                  </p>
                  <p className="text-xs text-stone-400">
                    Try searching in Devanāgarī, Romanized IAST, or general English philosophical terms.
                  </p>
                  <button
                    type="button"
                    onClick={() => onEnterSearch(query)}
                    className="mt-2 text-xs font-bold text-[#8C6239] underline hover:text-[#3B2314] cursor-pointer"
                  >
                    Open Universal Search Portal to filter by specific treatise or Pramāṇa →
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Results Summary Bar */}
                  <div className="flex items-center justify-between border-b border-[#1A1A1A]/20 pb-2 px-1">
                    <span className="text-xs font-sans font-black text-[#8C6239] uppercase tracking-wider">
                      Found {totalResultsCount} results across corpus ({results.sutras.length} text citations, {results.kosa.length} lexicon terms)
                    </span>
                    <button
                      type="button"
                      onClick={() => onEnterSearch(query)}
                      className="text-xs font-bold text-[#1A1A1A] hover:text-[#8C6239] flex items-center gap-1 cursor-pointer"
                    >
                      <span>View in Universal Search</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Top Canonical Sūtras */}
                  {topSutras.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-stone-500 px-1">
                        <BookOpen className="w-3.5 h-3.5 text-[#8C6239]" />
                        <span>Canonical Sūtras & Commentaries</span>
                      </div>
                      <div className="grid gap-1.5">
                        {topSutras.map((res, idx) => (
                          <div
                            key={`${res.text.id}-${res.section.id}-${res.sutraIndex}-${idx}`}
                            onClick={() => onSelectSutra(res.text.id, res.section.id, res.sutraIndex)}
                            className="p-2.5 bg-white hover:bg-[#FFF9E6] border border-[#1A1A1A]/20 hover:border-[#1A1A1A] cursor-pointer transition-all group"
                          >
                            <div className="flex items-center justify-between gap-2 text-[10px] mb-1">
                              <span className="font-bold text-[#8C6239] uppercase font-sans">
                                {res.text.title} • {res.section.title}
                              </span>
                              <span className="px-1.5 py-0.2 bg-[#ECE0D1] text-[9px] font-mono font-bold text-stone-700">
                                {res.fieldType}
                              </span>
                            </div>
                            <p className="text-xs font-serif text-stone-800 leading-snug line-clamp-2">
                              {highlightMatch(res.sentence, query)}
                            </p>
                            <div className="mt-1 flex items-center justify-between text-[10px] text-stone-500 font-mono">
                              <span>Sūtra #{res.sutraIndex + 1}: {res.sutra.heading}</span>
                              <span className="text-[#8C6239] group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                                Read in Library <ArrowRight className="w-3 h-3 inline" />
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Top Lexicon Terms */}
                  {topKosa.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-stone-500 px-1">
                        <Bookmark className="w-3.5 h-3.5 text-[#8C6239]" />
                        <span>Tarka-Kośa & Ontological Definitions</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {topKosa.map((term) => (
                          <div
                            key={term.id}
                            onClick={() => onEnterSearch(term.iast || term.term)}
                            className="p-2.5 bg-white hover:bg-[#FFF9E6] border border-[#1A1A1A]/20 hover:border-[#1A1A1A] cursor-pointer transition-all"
                          >
                            <div className="flex items-baseline justify-between gap-1 mb-0.5">
                              <span className="font-serif font-black text-sm text-[#3B2314]">
                                {transliterate(term.term, targetScript)}
                              </span>
                              <span className="text-[10px] font-mono text-[#8C6239]">
                                {term.iast}
                              </span>
                            </div>
                            <span className="inline-block text-[9px] font-bold uppercase text-stone-500 bg-[#ECE0D1]/50 px-1 py-0.2 mb-1">
                              {term.category}
                            </span>
                            <p className="text-xs text-stone-700 leading-tight line-clamp-2 font-serif">
                              {highlightMatch(term.definition || term.translation, query)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* View All In Universal Search Button */}
                  <div className="pt-2 border-t border-[#1A1A1A]/10 text-center">
                    <button
                      type="button"
                      onClick={() => onEnterSearch(query)}
                      className="w-full py-2 bg-[#8C6239] hover:bg-[#795548] text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>Explore all {totalResultsCount} results in Universal Search Portal</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
