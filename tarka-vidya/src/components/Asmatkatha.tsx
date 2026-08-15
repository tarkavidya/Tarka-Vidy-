import React from "react";
import { Users, Target, Compass, BookOpen, MapPin, Sparkles } from "lucide-react";
import { formatSanskrit, transliterate } from "../utils/transliteration";

interface AsmatkathaProps {
  scriptTheme: "devanagari" | "gregorian" | "combined";
  targetScript: string;
}

export default function Asmatkatha({ scriptTheme, targetScript }: AsmatkathaProps) {
  return (
    <div className="space-y-6 animate-fade-in font-sans" id="asmatkatha-module">
      {/* Editorial Header */}
      <div className="bg-[#F5F2EA] border-2 border-[#1A1A1A] p-6 lg:p-8 rounded-none flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2 text-xs font-bold text-[#8C6239] uppercase tracking-widest">
            <Users className="w-5 h-5 text-[#8C6239]" />
            <span>अस्मत्कथा | Editorial Chronicle</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-serif font-black text-[#3B2314] tracking-tight uppercase">
            {transliterate("अस्मत्कथा", targetScript)}{" "}
            <span className="font-sans font-normal text-lg text-stone-500 normal-case">
              (About Us & Mission)
            </span>
          </h2>
          <p className="text-xs text-stone-701 font-black max-w-2xl leading-relaxed uppercase tracking-wider">
            Sowing the seeds of the Bengal debate lineage through digital preservation and scholastic access.
          </p>
        </div>
        <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-5 pointer-events-none">
          <Users className="w-64 h-64 text-[#8C6239]" />
        </div>
      </div>

      {/* Grid: Mission, Vision, and Dynamic Story */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Side: Mission & Vision Cards */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Mission Card */}
          <div className="bg-white border-2 border-[#1A1A1A] p-6 rounded-none cool-3d-gently flex-1 flex flex-col justify-between space-y-4 relative">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#C25E3E] uppercase tracking-widest border-b border-stone-200 pb-2">
                <Target className="w-4 h-4 text-[#C25E3E]" />
                <span>Our Mission / लक्ष्यः</span>
              </div>
              <p className="text-sm text-stone-700 leading-relaxed text-justify">
                At <strong className="text-[#1A1A1A]">tarkavidya.com</strong>, our mission is to create an accessible and scholarly digital repository dedicated to the Indian philosophical tradition of Tarka-Vidyā—the science of reasoning, debate, and cognition. With a strong foundation in the Nyāya school, we aim to compile, preserve, and share authentic texts, commentaries, and academic resources to support both traditional scholars and modern researchers. Our goal is to remove the barriers we ourselves faced while searching for reliable, organised materials in this field.
              </p>
            </div>
          </div>

          {/* Vision Card */}
          <div className="bg-white border-2 border-[#1A1A1A] p-6 rounded-none cool-3d-gently flex-1 flex flex-col justify-between space-y-4 relative">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#8C6239] uppercase tracking-widest border-b border-stone-200 pb-2">
                <Compass className="w-4 h-4 text-[#8C6239]" />
                <span>Our Vision / गन्तव्यम्</span>
              </div>
              <p className="text-sm text-stone-700 leading-relaxed text-justify">
                We envision <strong className="text-[#1A1A1A]">tarkavidya.com</strong> as a living digital archive that revitalises and popularises the vast and nuanced tradition of Indian logic and epistemology. Rooted in the intellectual legacy of Bengal—long known as a centre of academic excellence—we aspire to bridge classical Sanskrit thought with contemporary digital tools, making the treasures of Indian reasoning systems accessible to all who seek to engage deeply with them.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Detailed Genesis Narrative */}
        <div className="lg:col-span-7 bg-white border-2 border-[#1A1A1A] p-6 lg:p-8 rounded-none flex flex-col justify-between space-y-6 manuscript-margin-line pl-8 md:pl-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-[#8C6239] uppercase tracking-widest border-b border-stone-200 pb-2">
              <Sparkles className="w-4 h-4 text-[#8C6239]" />
              <span>How It Began / आरम्भकथा</span>
            </div>
            
            <div className="text-sm text-stone-700 leading-relaxed space-y-4 text-justify select-text">
              <p>
                The journey of <strong className="text-[#1A1A1A]">tarkavidya.com</strong> began with a shared passion and a set of academic frustrations. <span className="text-[#1A1A1A] font-semibold">Tapas Khanra</span>, an enthusiast of Indian philosophy and a researcher deeply engaged with Sanskrit verbal cognitive theories at IIT-B, struggled to find a consolidated, searchable collection of Nyāya texts during his research. This experience planted the idea of creating a digital corpus that could serve others facing the same hurdles.
              </p>
              
              <p>
                Around the same time, <span className="text-[#1A1A1A] font-semibold">Buddhodev Ghosh</span>, an Alumnus of IIT-B, had been working with CSIR’s Traditional Knowledge Digital Library and had already attempted to build a platform focused on Indian aesthetics. Though that project was paused due to overlap with another initiative, his dedication to preserving traditional Indian knowledge remained unwavering.
              </p>
              
              <p>
                Realising the complementary nature of their goals and expertise, Tapas and Buddhodev came together to create <strong className="text-[#1A1A1A]">tarkavidya.com</strong>—a site not just for digital access, but for the celebration and propagation of the deeply rooted Indian tradition of logic, debate, and philosophical inquiry.
              </p>
            </div>
          </div>

          {/* Concluding dedication motto statement */}
          <div className="bg-[#FAF8F5] border-l-4 border-[#8C6239] p-4 text-xs italic text-stone-600 font-sans cool-3d-gently">
            "Together with our team, we hope this platform will honour and carry forward the intellectual brilliance that Bengal and the broader Indian philosophical tradition have gifted to the world."
          </div>
        </div>

      </div>

      {/* Decorative Traditional Footer Credit */}
      <div className="bg-[#F5F2EA] border-2 border-[#1A1A1A] p-4 text-center">
        <span className="text-[10px] font-mono font-black uppercase text-stone-500 tracking-widest flex items-center justify-center gap-1.5 label-sans">
          <MapPin className="w-3.5 h-3.5 text-[#8C6239]" />
          <span>Navadvīpa & Bengal Scholarly Heritage Preservation Initiative</span>
        </span>
      </div>
    </div>
  );
}
