/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

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
import TATTVA_CINTAMANI_SECTIONS_RAW from "../data/tattva-cintamani.json";
import MANAMANOHARA_SECTIONS_RAW from "../data/manamanoharah.json";
import PRAMANASAMUCCAYA_SECTIONS_RAW from "../data/pramanasamuccaya.json";
import PRAMANAVARTTIKA_SECTIONS_RAW from "../data/pramanavarttika.json";
import NYAYAVATARA_SECTIONS_RAW from "../data/nyayavatara.json";
import PRAMANAMIMAMSA_SECTIONS_RAW from "../data/pramanamimamsa.json";

import SEVEN_PADARTHAS_RAW from "../data/sevenPadarthas.json";
import FIVE_HETVABHASAS_RAW from "../data/fiveHetvabhasas.json";
import NYAYA_TEXTS from "../data/texts.json";
import KOSA_TERMS from "../data/kosa.json";

import { NyayaSection, NyayaText, NyayaSutraItem, KosaTerm } from "../types";
import { transliterate } from "./transliteration";

export interface GlobalSearchResultSentence {
  text: NyayaText;
  section: NyayaSection;
  sutra: NyayaSutraItem;
  sutraIndex: number;
  fieldType: string;
  sentence: string;
  pramanas: string[];
}

export interface GlobalSearchResults {
  sutras: GlobalSearchResultSentence[];
  kosa: Array<KosaTerm & { pramanas: string[] }>;
}

export interface GlobalSearchQueryOptions {
  query: string;
  filterType?: "all" | "sanskrit" | "translation" | "commentary" | "glossary";
  selectedTextId?: string;
  selectedPramanas?: string[];
  targetScript?: string;
}

// Master mapping of all canonical treatises to their sections
export const ALL_TEXT_SECTIONS_MAP: Record<string, NyayaSection[]> = {
  "nyaya-sutras": NYAYA_SECTIONS_RAW as NyayaSection[],
  "tarka-sastram": TARKASASTRAS_SECTIONS_RAW as NyayaSection[],
  "tarkabhasha": TARKABHASHA_SECTIONS_RAW as NyayaSection[],
  "laksana-sangraha": LAKSANA_SECTIONS_RAW as NyayaSection[],
  "vaiseasika-sutras": VAISESHIKA_SECTIONS_RAW as NyayaSection[],
  "padartha-dharmasamgraha": PADARTHA_SECTIONS_RAW as NyayaSection[],
  "tarka-samgraha": TARKASAMGRAHA_SECTIONS_RAW as NyayaSection[],
  "karikavali": KARIKAVALI_SECTIONS_RAW as NyayaSection[],
  "nyayasiddhantamuktavali": KARIKAVALI_SECTIONS_RAW as NyayaSection[],
  "anandagiri-tarkasangraha": ANANDAGIRI_SECTIONS_RAW as NyayaSection[],
  "vyomavati": VYOMAVATI_SECTIONS_RAW as NyayaSection[],
  "tattva-cintamani": TATTVA_CINTAMANI_SECTIONS_RAW as NyayaSection[],
  "manamanoharah": MANAMANOHARA_SECTIONS_RAW as NyayaSection[],
  "pramanasamuccaya": PRAMANASAMUCCAYA_SECTIONS_RAW as NyayaSection[],
  "pramanavarttika": PRAMANAVARTTIKA_SECTIONS_RAW as NyayaSection[],
  "nyayavatara": NYAYAVATARA_SECTIONS_RAW as NyayaSection[],
  "pramānamimāmsā": PRAMANAMIMAMSA_SECTIONS_RAW as NyayaSection[],
};

export const classifyCorpusPramanas = (textToAnalyze: string): string[] => {
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
    text.includes("लिङ्ग")
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
    text.includes("गवय")
  ) {
    pramanas.push("upamana");
  }

  // Śabda (Testimony)
  if (
    text.includes("sabda") ||
    text.includes("śabda") ||
    text.includes("testimony") ||
    text.includes("word") ||
    text.includes("authoritative") ||
    text.includes("apta") ||
    text.includes("āpta") ||
    text.includes("veda") ||
    text.includes("agama") ||
    text.includes("āgama") ||
    text.includes("शब्द") ||
    text.includes("आप्त") ||
    text.includes("आगम") ||
    text.includes("वेद")
  ) {
    pramanas.push("sabda");
  }

  if (pramanas.length === 0) {
    pramanas.push("other");
  }

  return pramanas;
};

export const splitCorpusSentences = (text: string, isSanskritOrIndic: boolean): string[] => {
  if (!text) return [];
  const lines = text.split(/\n+/);
  const sentences: string[] = [];

  lines.forEach((line) => {
    if (isSanskritOrIndic) {
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

  return sentences.map((s) => s.trim()).filter(Boolean);
};

/**
 * Unified search function that iterates through all imported
 * canonical sections and lexicon/ontological files, returning
 * sentence-level sūtra occurrences and kosa terms.
 */
export const searchUnifiedScholarlyCorpus = (options: GlobalSearchQueryOptions): GlobalSearchResults => {
  const {
    query,
    filterType = "all",
    selectedTextId = "all",
    selectedPramanas = ["pratyaksa", "anumana", "upamana", "sabda", "other"],
    targetScript = "devanagari",
  } = options;

  if (!query.trim() || query.trim().length < 2) {
    return { sutras: [], kosa: [] };
  }

  const searchStr = query.toLowerCase().trim();
  const matchesSentences: GlobalSearchResultSentence[] = [];
  const matchesKosa: Array<KosaTerm & { pramanas: string[] }> = [];

  // 1. Search Glossary Terms & Related Ontological/Dialectical Data Files
  if (filterType === "all" || filterType === "glossary") {
    (KOSA_TERMS as KosaTerm[]).forEach((term) => {
      const termText = [
        term.term,
        term.iast,
        term.definition,
        term.translation,
        term.category,
        term.commentaryNotes,
        term.logicalRole,
        term.source,
      ].join(" ");
      const pramanas = classifyCorpusPramanas(termText);
      const hasPramanaMatch = pramanas.some((p) => selectedPramanas.includes(p));
      if (!hasPramanaMatch) return;

      const termInTarget = transliterate(term.term, targetScript).toLowerCase();
      const isMatch =
        term.term.toLowerCase().includes(searchStr) ||
        term.iast.toLowerCase().includes(searchStr) ||
        term.definition.toLowerCase().includes(searchStr) ||
        term.translation.toLowerCase().includes(searchStr) ||
        term.category.toLowerCase().includes(searchStr) ||
        term.commentaryNotes.toLowerCase().includes(searchStr) ||
        termInTarget.includes(searchStr);

      if (isMatch) {
        matchesKosa.push({ ...term, pramanas });
      }
    });

    // Also iterate through related sevenPadarthas.json
    (SEVEN_PADARTHAS_RAW as any[]).forEach((padartha, idx) => {
      const pText = `${padartha.name} ${padartha.devanagari} ${padartha.english} ${padartha.definition} ${padartha.details || ""}`;
      if (pText.toLowerCase().includes(searchStr)) {
        const pramanas = classifyCorpusPramanas(pText);
        if (pramanas.some((p) => selectedPramanas.includes(p))) {
          const alreadyInKosa = matchesKosa.some(
            (k) => k.term === padartha.devanagari || k.iast.toLowerCase() === padartha.name.toLowerCase()
          );
          if (!alreadyInKosa) {
            matchesKosa.push({
              id: `padartha-extra-${idx}`,
              term: padartha.devanagari,
              iast: padartha.name,
              category: "Ontology (Padārtha)",
              logicalRole: padartha.english,
              definition: padartha.definition,
              translation: padartha.english,
              source: "Vaiśeṣika Sūtra / Padārthadharmasaṅgraha",
              sanskritQuote: padartha.devanagari,
              sanskritQuoteIast: padartha.name,
              commentaryNotes: padartha.details || "Foundational ontological category of Vaiśeṣika realism.",
              pramanas,
            });
          }
        }
      }
    });

    // Also iterate through related fiveHetvabhasas.json
    (FIVE_HETVABHASAS_RAW as any[]).forEach((fallacy, idx) => {
      const fText = `${fallacy.name} ${fallacy.devanagari} ${fallacy.english} ${fallacy.definition} ${fallacy.example || ""}`;
      if (fText.toLowerCase().includes(searchStr)) {
        const pramanas = classifyCorpusPramanas(fText);
        if (pramanas.some((p) => selectedPramanas.includes(p))) {
          const alreadyInKosa = matchesKosa.some(
            (k) => k.term === fallacy.devanagari || k.iast.toLowerCase() === fallacy.name.toLowerCase()
          );
          if (!alreadyInKosa) {
            matchesKosa.push({
              id: `hetvabhasa-extra-${idx}`,
              term: fallacy.devanagari,
              iast: fallacy.name,
              category: "Hetvābhāsa (Fallacy)",
              logicalRole: fallacy.english,
              definition: fallacy.definition,
              translation: fallacy.english,
              source: "Nyāyasūtra 1.2.4 / Tarkasaṅgraha",
              sanskritQuote: fallacy.devanagari,
              sanskritQuoteIast: fallacy.name,
              commentaryNotes: fallacy.example ? `Example: ${fallacy.example}` : "Formal fallacy of the probans in Indian syllogism.",
              pramanas,
            });
          }
        }
      }
    });
  }

  // 2. Iterate through all canonical treatises
  if (filterType !== "glossary") {
    (NYAYA_TEXTS as NyayaText[]).forEach((text) => {
      if (selectedTextId !== "all" && text.id !== selectedTextId) return;

      const sections = ALL_TEXT_SECTIONS_MAP[text.id] || [];
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
            sutra.commentary?.bengali || "",
          ].join(" ");
          const pramanas = classifyCorpusPramanas(sutraText);

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
            { name: "Bengali Commentary", text: sutra.commentary?.bengali || "", isIndic: true },
          ];

          fields.forEach((field) => {
            if (!field.text) return;

            // Apply active filters
            if (filterType === "sanskrit" && !field.isIndic) return;
            if (filterType === "translation" && !field.name.includes("Translation")) return;
            if (filterType === "commentary" && !field.name.includes("Commentary")) return;

            const sentences = splitCorpusSentences(field.text, field.isIndic);
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
                  sentence,
                  pramanas,
                });
              }
            });
          });
        });
      });
    });
  }

  return { sutras: matchesSentences, kosa: matchesKosa };
};
