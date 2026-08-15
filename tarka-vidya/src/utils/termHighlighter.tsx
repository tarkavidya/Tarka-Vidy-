import React from "react";
import KOSA_TERMS from "../data/kosa.json";

// Map of term IDs to term objects for instant lookup
const termsMap = new Map(KOSA_TERMS.map(t => [t.id, t]));

// Combined regular expression to catch Nyaya-Vaisesika technical terms
// Captures both Romanized diacritic forms, plain English, and Devanagari
const highlightRegex = /(\bvyāptis?\b|\bvyaptis?\b|\bpakṣas?\b|\bpaksas?\b|\bhetus?\b|\bsādhyas?\b|\bsadhyas?\b|\bpramāṇas?\b|\bpramanas?\b|\bpratyakṣas?\b|\bpratyaksas?\b|\banumānas?\b|\banumanas?\b|\bparāmarśas?\b|\bparamarsas?\b|\bsamavāyas?\b|\bsamavayas?\b|\bpadārthas?\b|\bpadarthas?\b|\bprameyas?\b|\bsaṃśayas?\b|\bsamsayas?\b|\bprayojanas?\b|\bdṛṣṭāntas?\b|\bdrstantas?\b|\bsiddhāntas?\b|\bsiddhantas?\b|\bavayavas?\b|\btarkas?\b|\bnirṇayas?\b|\bnirnayas?\b|\bvādas?\b|\bvadas?\b|\bjalpas?\b|\bvitaṇḍās?\b|\bvitandas?\b|\bhetvābhāsas?\b|\bhetvabhasas?\b|\bchalas?\b|\bjātis?\b|\bjatis?\b|\bnigrahasthānas?\b|\bnigrahasthanas?\b|व्याप्ति|पक्ष|हेतु|साध्य|प्रमाण|प्रत्यक्ष|अनुमान|परामर्श|समवाय|पदार्थ|प्रमेय|संशय|प्रयोजन|दृष्टान्त|सिद्धान्त|अवयव|तर्क|निर्णय|वाद|जल्प|वितण्डा|हेत्वाभास|छल|जाति|निग्रहस्थान)/gi;

function getTermId(matchedText: string): string | null {
  const normalized = matchedText.toLowerCase();
  if (normalized.startsWith("vyap") || normalized.includes("व्याप्ति")) return "vyapti";
  if (normalized.startsWith("paks") || normalized.includes("पक्ष")) return "paksa";
  if (normalized.startsWith("het") || normalized.includes("हेतु")) return "hetu";
  if (normalized.startsWith("sadhy") || normalized.includes("साध्य")) return "sadhya";
  if (normalized.startsWith("praman") || normalized.startsWith("pramāṇ") || normalized.includes("प्रमाण")) return "pramana";
  if (normalized.startsWith("pratyak") || normalized.includes("प्रत्यक्ष")) return "pratyaksa";
  if (normalized.startsWith("anuman") || normalized.startsWith("anumā") || normalized.includes("अनुमान")) return "anamana";
  if (normalized.startsWith("paramars") || normalized.startsWith("parāmarś") || normalized.includes("परामर्श")) return "paramarsa";
  if (normalized.startsWith("samavay") || normalized.startsWith("samavāy") || normalized.includes("समवाय")) return "samavaya";
  if (normalized.startsWith("padarth") || normalized.startsWith("padārt") || normalized.includes("पदार्थ")) return "padartha";
  if (normalized.startsWith("pramey") || normalized.includes("प्रमेय")) return "prameya";
  if (normalized.startsWith("samsay") || normalized.startsWith("saṃśay") || normalized.includes("संशय")) return "samsaya";
  if (normalized.startsWith("prayojan") || normalized.includes("प्रयोजन")) return "prayojana";
  if (normalized.startsWith("drstant") || normalized.startsWith("dṛṣṭānt") || normalized.includes("दृष्टान्त")) return "drstanta";
  if (normalized.startsWith("siddhant") || normalized.startsWith("siddhānt") || normalized.includes("सिद्धान्त")) return "siddhanta";
  if (normalized.startsWith("avayav") || normalized.includes("अवयव")) return "avayava";
  if (normalized.startsWith("tarka") || normalized.includes("तर्क")) return "tarka";
  if (normalized.startsWith("nirnay") || normalized.startsWith("nirṇay") || normalized.includes("निर्णय")) return "nirnaya";
  if (normalized.startsWith("vada") || normalized.startsWith("vāda") || normalized.includes("वाद")) return "vada";
  if (normalized.startsWith("jalpa") || normalized.includes("जल्प")) return "jalpa";
  if (normalized.startsWith("vitand") || normalized.startsWith("vitaṇḍ") || normalized.includes("वितण्डा")) return "vitanda";
  if (normalized.startsWith("hetvabhas") || normalized.startsWith("hetvābhās") || normalized.includes("हेत्वाभास")) return "hetvabhasa";
  if (normalized.startsWith("chala") || normalized.includes("छल")) return "chala";
  if (normalized.startsWith("jati") || normalized.startsWith("jāti") || normalized.includes("जाति")) return "jati";
  if (normalized.startsWith("nigrahasthan") || normalized.startsWith("nigrahasthān") || normalized.includes("निग्रहस्थान")) return "nigrahasthana";
  return null;
}

/**
 * Parses and renders text by converting technical Nyāya-Vaiśeṣika terms
 * into elegantly styled dotted-underlined terms with rich hover tooltips.
 */
export function renderHighlightedText(text: string): React.ReactNode {
  if (!text) return "";

  const parts = text.split(highlightRegex);

  return (
    <>
      {parts.map((part, index) => {
        // Test if this part matches our technical terms
        if (highlightRegex.test(part)) {
          const termId = getTermId(part);
          const termObj = termId ? termsMap.get(termId) : null;

          if (termObj) {
            return (
              <span
                key={`${termId}-${index}`}
                className="relative group/term inline-block cursor-help border-b-2 border-dotted border-[#795548] text-[#795548] font-bold hover:bg-[#ECE0D1]/40 px-0.5 transition-all"
              >
                {part}
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-3.5 bg-white text-stone-800 text-[11px] leading-relaxed rounded-none border-2 border-[#1A1A1A] shadow-[3px_3px_0px_0px_rgba(26,26,26,1)] opacity-0 pointer-events-none group-hover/term:opacity-100 group-hover/term:pointer-events-auto transition-all duration-200 z-50 font-sans normal-case text-left font-medium">
                  <span className="flex items-center justify-between border-b border-[#1A1A1A]/20 pb-1.5 mb-1.5">
                    <strong className="font-serif font-black text-xs text-[#3B2314]">
                      {termObj.iast} ({termObj.term})
                    </strong>
                    <span className="text-[7px] font-mono font-bold px-1.5 py-0.5 border border-stone-200 bg-stone-50 uppercase tracking-wider text-stone-500">
                      {termObj.category.split(" (")[0]}
                    </span>
                  </span>
                  
                  <span className="block text-[#8C6239] text-[9.5px] font-bold uppercase tracking-wider mb-1">
                    {termObj.translation}
                  </span>
                  
                  <span className="block text-stone-650 font-normal">
                    {termObj.definition}
                  </span>
                  
                  <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1A1A1A]"></span>
                </span>
              </span>
            );
          }
        }
        return part;
      })}
    </>
  );
}
