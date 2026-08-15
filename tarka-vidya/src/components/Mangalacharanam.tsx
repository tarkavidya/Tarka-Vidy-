/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion } from "motion/react";
import { transliterate } from "../utils/transliteration";
import { Sparkles, BookOpen, ArrowRight, Search } from "lucide-react";

interface MangalacharanamProps {
  onEnterArchive: () => void;
  onEnterSearch?: () => void;
  scriptTheme: "devanagari" | "gregorian" | "combined";
  targetScript: string;
}

export default function Mangalacharanam({
  onEnterArchive,
  onEnterSearch,
  scriptTheme,
  targetScript,
}: MangalacharanamProps) {
  const [lang, setLang] = useState<"english" | "hindi" | "bengali">("english");

  const benedictionSanskrit = "॥  ॐ कणादगौतमादिभ्यस्तर्कविद्यासम्प्रदायकर्तृभ्यो वंशऋषिभ्यो नमो महद्भ्यो नमो गुरुभ्यः॥";

  const translations = {
    english: {
      title: "Salutations to the Lineage of Sages",
      verse: "Om. Salutations to the great sages, beginning with Kaṇāda and Gautama, who are the founders of the tradition of Tarka-Vidyā (the science of logic and reasoning), the lineage of seers. Salutations to the great teachers, salutations to our gurus.",
      desc: "This sacred Mangalacharanam (opening invocation) pays homage to Sage Kaṇāda (author of the Vaiśeṣika Sūtram) and Sage Gautama (author of the Nyāya Sūtram). Together, these dual traditions form the bedrock of Indian logical realism and epistemology, paving the path of intellectual discernment.",
    },
    hindi: {
      title: "ऋषि-परम्परा को सादर नमन",
      verse: "ॐ। तर्कविद्या (न्याय-वैशेषिक) सम्प्रदाय के प्रवर्तक, वंश-ऋषि कणाद और गौतम आदि महान ऋषियों को नमस्कार है। उन महान आचार्यों और गुरुजनों को कोटि-कोटि नमन है।",
      desc: "यह पावन मङ्गलाचरण महर्षि कणाद (वैशेषिक दर्शन के प्रणेता) तथा महर्षि अक्षपाद गौतम (न्याय दर्शन के प्रणेता) की परम्परा को समर्पित है। यह ज्ञानमार्ग की शुचिता, सत्यनिष्ठा एवं तर्कशुद्ध विवेक का आवाहन करता है।",
    },
    bengali: {
      title: "ঋষি-পরম্পরার উদ্দেশ্যে প্রণাম",
      verse: "ওঁ। তর্কবিদ্যা (ন্যায়-বৈশেষিক) সম্প্রদায়ের আদি প্রবর্তক ও বংশঋষি মহর্ষি কণাদ ও মহর্ষি গৌতম প্রমুখ মহাত্মাগণকে প্রণাম। সেই মহান আচার্য ও গুরুদেবগণকে জানাই সশ্রদ্ধ নমস্কার।",
      desc: "এই পবিত্র মঙ্গলাচরণটি মহর্ষি কণাদ (বৈশেষিক সূত্রের রচয়িতা) ও মহর্ষি গৌতমের (ন্যায় সূত্রের রচয়িতা) পুণ্য স্মৃতির প্রতি নিবেদিত। ভারতীয় যুক্তিবিদ্যা ও জ্ঞানতত্ত্বের ভিত্তি স্থাপনকারী এই দুই ঋষির জ্ঞানালোক আমাদের অন্তরের বিবেক জাগ্রত করুক।",
    },
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] py-8 px-4 md:px-12 text-center" id="homepage-benediction">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-3xl w-full bg-[#FAF8F5] border-2 border-[#1A1A1A] p-8 md:p-14 space-y-10 shadow-[8px_8px_0px_0px_rgba(26,26,26,1)] hover:shadow-[12px_12px_0px_0px_rgba(26,26,26,1)] transition-all duration-300 relative"
      >
        {/* Ancient Manuscript Decorative Lines */}
        <div className="absolute top-3 left-3 right-3 bottom-3 border border-[#8C6239]/20 pointer-events-none"></div>
        <div className="absolute top-5 left-5 right-5 bottom-5 border border-dashed border-[#8C6239]/15 pointer-events-none"></div>

        {/* Diya Logo / Scholastic Lamp Indicator */}
        <div className="flex flex-col items-center justify-center space-y-3 relative z-10">
          <div className="relative flex items-center justify-center w-20 h-20 bg-[#3B2314] rounded-full border-4 border-[#1A1A1A] shadow-md">
            {/* Pulsing Diya Glow Flame */}
            <span className="absolute -top-1.5 text-3xl animate-pulse filter drop-shadow-[0_0_12px_rgba(245,158,11,0.8)] select-none">
              🪔
            </span>
            {/* Stylized lamp body represented by characters */}
            <span className="text-stone-300 text-xs font-mono font-black tracking-widest mt-4">
              तर्कः
            </span>
          </div>
          <span className="text-[10px] uppercase tracking-[0.25em] font-sans font-black text-[#8C6239]">
            मङ्गलाचरणम् • INVOCATION
          </span>
        </div>

        {/* Main Sacred Verse */}
        <div className="space-y-4 relative z-10">
          <h2 className="text-2xl md:text-3xl font-serif font-black text-[#3B2314] leading-relaxed max-w-2xl mx-auto tracking-wide">
            {transliterate(benedictionSanskrit, targetScript)}
          </h2>
          <p className="text-stone-400 font-mono text-[10px]">
            Devanāgarī: {benedictionSanskrit}
          </p>
        </div>

        {/* Language Tabs Selector */}
        <div className="flex justify-center gap-1.5 bg-[#ECE0D1]/30 p-1 rounded-none border border-[#1A1A1A]/10 max-w-xs mx-auto relative z-10">
          {([
            { code: "english", label: "English" },
            { code: "hindi", label: "हिन्दी" },
            { code: "bengali", label: "বাংলা" },
          ] as const).map((langObj) => (
            <button
              key={langObj.code}
              onClick={() => setLang(langObj.code)}
              className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-none transition-all cursor-pointer ${
                lang === langObj.code
                  ? "bg-[#795548] text-white border-0 shadow-xs"
                  : "text-stone-600 hover:text-stone-900 bg-transparent hover:bg-[#ECE0D1]/40"
              }`}
            >
              {langObj.label}
            </button>
          ))}
        </div>

        {/* Translation Content */}
        <div className={`space-y-4 max-w-2xl mx-auto relative z-10 ${lang === "bengali" ? "font-script-bengali text-left" : ""}`}>
          <div className="border-t border-dashed border-[#8C6239]/20 pt-5">
            <h3 className={`text-xs uppercase tracking-widest font-sans font-extrabold text-[#795548] mb-2.5 ${lang === "bengali" ? "font-script-bengali" : ""}`}>
              {translations[lang].title}
            </h3>
            <p className={`text-base md:text-lg text-stone-800 leading-relaxed font-medium ${lang === "bengali" ? "font-script-bengali not-italic" : "font-serif italic"}`}>
              “ {translations[lang].verse} ”
            </p>
          </div>

          <p className={`text-xs text-stone-600 leading-relaxed text-justify max-w-xl mx-auto pt-2 opacity-90 border-t border-[#8C6239]/10 ${lang === "bengali" ? "font-script-bengali" : "font-sans"}`}>
            {translations[lang].desc}
          </p>
        </div>

        {/* Call to Action Buttons */}
        <div className="pt-4 relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onEnterArchive}
            className="w-full sm:w-auto px-6 py-3.5 bg-[#3B2314] hover:bg-[#1A1A1A] text-white font-sans text-xs font-black uppercase tracking-widest border-2 border-[#1A1A1A] flex items-center justify-center gap-2.5 cursor-pointer transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
          >
            <BookOpen className="w-4 h-4 text-[#FAF8F5]" />
            <span>Enter the Library | ग्रन्थालयप्रवेशः</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>

          {onEnterSearch && (
            <button
              onClick={onEnterSearch}
              className="w-full sm:w-auto px-6 py-3.5 bg-[#8C6239] hover:bg-[#795548] text-white font-sans text-xs font-black uppercase tracking-widest border-2 border-[#1A1A1A] flex items-center justify-center gap-2.5 cursor-pointer transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
            >
              <Search className="w-4 h-4 text-[#FAF8F5]" />
              <span>Sarvanusadhana Mandapam | सर्वानुसन्धानमण्डपम्</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
