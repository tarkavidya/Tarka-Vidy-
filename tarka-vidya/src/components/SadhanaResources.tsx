import React, { useState } from "react";
import { 
  Tv, 
  ExternalLink, 
  BookOpen, 
  Award, 
  Info, 
  Sparkles, 
  ArrowRight, 
  Play, 
  MapPin, 
  Search, 
  PlayCircle
} from "lucide-react";
import { transliterate } from "../utils/transliteration";

interface SadhanaResourcesProps {
  onSelectTopic: (textId: string, sectionId: string, sutraIndex: number) => void;
  targetScript: string;
}

export default function SadhanaResources({ onSelectTopic, targetScript }: SadhanaResourcesProps) {
  const [activeShowcase, setActiveShowcase] = useState<"showcase1" | "showcase2">("showcase1");
  const [selectedTopicSearch, setSelectedTopicSearch] = useState("");

  const instructorName = "Vidvān Dattanubhava Tangse";
  const organizerName = "Medha Gurukulam, Chennai";

  const syllabusItems = [
    {
      id: "syllabus-1",
      title: "Introduction & Mangalācaraṇam",
      sanskrit: "मङ्गलाचरणम्",
      desc: "Sacred invocation and the purpose of the treatise: helping beginners enter the ocean of shastras.",
      showcase: "Volume I (Vimeo: 10428964)",
      vimeoUrl: "https://vimeo.com/showcase/10428964",
      sectionId: "tarkasamgraha-1",
      sutraIndex: 0,
      keywords: "mangalacaranam purpose beginner"
    },
    {
      id: "syllabus-2",
      title: "Satta Padārthāḥ (Seven Categories)",
      sanskrit: "सप्तपदार्थाः",
      desc: "Enumeration and classification of the seven ontological categories of the syncretic Nyāya-Vaiśeṣika system.",
      showcase: "Volume I (Vimeo: 10428964)",
      vimeoUrl: "https://vimeo.com/showcase/10428964",
      sectionId: "tarkasamgraha-1",
      sutraIndex: 1,
      keywords: "satta padartha categories enumeration"
    },
    {
      id: "syllabus-3",
      title: "Nava Dravyakhaṇḍam (Nine Substances)",
      sanskrit: "नवद्रव्याणि",
      desc: "Deep analysis of the nine substances of the universe: Earth, Water, Fire, Air, Space, Time, Direction, Self, and Mind.",
      showcase: "Volume I (Vimeo: 10428964)",
      vimeoUrl: "https://vimeo.com/showcase/10428964",
      sectionId: "tarkasamgraha-1",
      sutraIndex: 2,
      keywords: "dravya substances earth water fire air space time self mind"
    },
    {
      id: "syllabus-4",
      title: "Caturviṃśati Guṇāḥ (24 Attributes)",
      sanskrit: "चतुर्विंशतिगुणाः",
      desc: "Examination of the twenty-four qualities, their definitions, and their inactive residence in substances.",
      showcase: "Volume I (Vimeo: 10428964)",
      vimeoUrl: "https://vimeo.com/showcase/10428964",
      sectionId: "tarkasamgraha-2",
      sutraIndex: 0,
      keywords: "guna attributes qualities colour taste smell touch number"
    },
    {
      id: "syllabus-5",
      title: "Pañca Karmāṇi (Five Kinds of Action)",
      sanskrit: "पञ्चकर्माणि",
      desc: "Analyzing physical movements: throwing upward, throwing downward, contraction, expansion, and locomotion.",
      showcase: "Volume I (Vimeo: 10428964)",
      vimeoUrl: "https://vimeo.com/showcase/10428964",
      sectionId: "tarkasamgraha-2",
      sutraIndex: 1,
      keywords: "karma action movement upward downward contraction expansion locomotion"
    },
    {
      id: "syllabus-6",
      title: "Sāmānya, Viśeṣa, Samavāya & Abhāva",
      sanskrit: "सामान्य-विशेष-समवाय-अभावाः",
      desc: "Ontology of universals (generality), absolute particulars, inseparable relation of inherence, and the four types of non-existence.",
      showcase: "Volume I (Vimeo: 10428964)",
      vimeoUrl: "https://vimeo.com/showcase/10428964",
      sectionId: "tarkasamgraha-2",
      sutraIndex: 2,
      keywords: "samanya universal visesa particular samavaya inherence abhava negation nonexistence"
    },
    {
      id: "syllabus-7",
      title: "Kāraṇa-Vāda (Theory of Causation)",
      sanskrit: "कारणवादः",
      desc: "Central causal tenets: Inherent (samavāyi), non-inherent (asamavāyi), and instrumental (nimitta) causes with standard textile examples.",
      showcase: "Volume I (Vimeo: 10428964)",
      vimeoUrl: "https://vimeo.com/showcase/10428964",
      sectionId: "tarkasamgraha-3",
      sutraIndex: 2,
      keywords: "karana causation cause inherent threads cloth weaver"
    },
    {
      id: "syllabus-8",
      title: "Buddhikhaṇḍam (Cognition, Memory & Truth)",
      sanskrit: "बुद्धिखण्डः",
      desc: "The classification of cognition into Smṛti (Memory) and Anubhava (Apprehension), and truth-value criteria (Pramā vs. Apramā).",
      showcase: "Volume II (Vimeo: 10950519)",
      vimeoUrl: "https://vimeo.com/showcase/10950519",
      sectionId: "tarkasamgraha-3",
      sutraIndex: 0,
      keywords: "buddhi cognition memory smrti apprehension anubhava prama aprama truth"
    },
    {
      id: "syllabus-9",
      title: "Pratyakṣa-Pramāṇam (Sensory Perception)",
      sanskrit: "प्रत्यक्षप्रमाणम्",
      desc: "Direct apprehension, determinate and indeterminate perception, and the six unique sensory contacts (sannikarṣas) with objects.",
      showcase: "Volume II (Vimeo: 10950519)",
      vimeoUrl: "https://vimeo.com/showcase/10950519",
      sectionId: "tarkasamgraha-4",
      sutraIndex: 0,
      keywords: "pratyaksa perception sensory determinate indeterminate sannikarsa contact"
    },
    {
      id: "syllabus-10",
      title: "Anumāna-Khaṇḍam (Inferential Logic)",
      sanskrit: "अनुमानखण्डः",
      desc: "Syllogistic logic: consideration (parāmarśa), vyāpti (concomitance), and the classical five-membered syllogism (pañcavayava-vākya).",
      showcase: "Volume II (Vimeo: 10950519)",
      vimeoUrl: "https://vimeo.com/showcase/10950519",
      sectionId: "tarkasamgraha-5",
      sutraIndex: 0,
      keywords: "anumana inference logic vyapti paramarsa hill fire smoke syllogism five membered"
    },
    {
      id: "syllabus-11",
      title: "Hetvābhāsa (Logical Fallacies)",
      sanskrit: "हेत्वाभासाः",
      desc: "Detailed study of structural fallacies in logical reasoning: straying, contradictory, counter-balanced, unproved, and stultified.",
      showcase: "Volume II (Vimeo: 10950519)",
      vimeoUrl: "https://vimeo.com/showcase/10950519",
      sectionId: "tarkasamgraha-5",
      sutraIndex: 3,
      keywords: "hetvabhasa fallacies logical error straying contradictory unproved stultified"
    },
    {
      id: "syllabus-12",
      title: "Upamāna & Śabda (Comparison & Verbal Testimony)",
      sanskrit: "उपमान-शब्दखण्डौ",
      desc: "Sanskrit linguistics: semantic expectancy (ākāṅkṣā), compatibility (yogyatā), proximity (sannidhi), and the speech of a trustworthy person.",
      showcase: "Volume II (Vimeo: 10950519)",
      vimeoUrl: "https://vimeo.com/showcase/10950519",
      sectionId: "tarkasamgraha-6",
      sutraIndex: 0,
      keywords: "upamana comparison sabda word speech testimony sentence meaning akanksa yogyata sannidhi"
    }
  ];

  const filteredSyllabus = syllabusItems.filter(item => {
    const query = selectedTopicSearch.toLowerCase().trim();
    if (!query) return true;
    return (
      item.title.toLowerCase().includes(query) ||
      item.sanskrit.toLowerCase().includes(query) ||
      item.desc.toLowerCase().includes(query) ||
      item.keywords.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6 animate-fade-in font-sans" id="sadhana-resources-module">
      
      {/* Editorial Page Banner */}
      <div className="bg-[#F5F2EA] border-2 border-[#1A1A1A] p-6 lg:p-8 rounded-none flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-bold text-[#8C6239] uppercase tracking-widest">
            <Tv className="w-5 h-5 text-[#8C6239]" />
            <span>व्याख्यानमाला | Scholastic Video Series</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-serif font-black text-[#3B2314] tracking-tight uppercase">
            {transliterate("तर्कसङ्ग्रह-व्याख्यानानि", targetScript)}{" "}
            <span className="font-sans font-normal text-lg text-stone-500 normal-case block sm:inline">
              (Tarka Saṅgraha Video Lectures)
            </span>
          </h2>
          <p className="text-xs text-stone-700 font-bold uppercase tracking-wider leading-relaxed">
            Authentic, traditional Shastric exposition of Annambhaṭṭa’s primer by an esteemed traditional scholar.
          </p>
        </div>
        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 opacity-5 pointer-events-none">
          <Tv className="w-64 h-64 text-[#8C6239]" />
        </div>
      </div>

      {/* Instructor & Organizer Spotlight Card */}
      <div className="bg-white border-2 border-[#1A1A1A] p-6 rounded-none cool-3d-gently grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-8 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-[#C25E3E] uppercase tracking-widest">
            <Award className="w-5 h-5 text-[#C25E3E]" />
            <span>प्रवक्ता च आयोजकः | Instructor & Organizer</span>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-serif font-black text-[#3B2314]">
              {instructorName}
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed font-semibold">
              Tenali Qualifier on Nyāya and Vedānta with First Class. The Tenali Examination is widely regarded as the most rigorous and elite traditional Shastric assessment framework in India, certifying scholars of exceptional depth and debate caliber.
            </p>
            <div className="flex items-center gap-1.5 pt-1 text-xs font-bold text-[#8C6239]">
              <MapPin className="w-4 h-4 text-[#8C6239]" />
              <span>Organized by Medha Gurukulam, Chennai</span>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-4 bg-[#FAF8F5] border border-[#1A1A1A]/10 p-4 space-y-2 text-xs text-stone-600 rounded-none h-full flex flex-col justify-between">
          <div className="space-y-1">
            <span className="font-bold text-[#3B2314] block">Medha Gurukulam</span>
            <p className="leading-normal">
              A premium institution committed to the preservation of traditional Indian pedagogy, Shastric debate, and meticulous study of ancient epistemology, bringing deep classical instruction into modern digital accessibility.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Video Showcase Player Section */}
      <div className="bg-white border-2 border-[#1A1A1A] p-6 rounded-none cool-3d-gently space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#8C6239] uppercase tracking-widest">
              <Play className="w-4 h-4 text-[#8C6239]" />
              <span>सद्यो-व्याख्यानम् | Active Player</span>
            </div>
            <h4 className="text-lg font-serif font-black text-[#3B2314]">
              Explore Course Playlists
            </h4>
          </div>

          {/* Tab buttons to switch showcases */}
          <div className="flex bg-[#ECE0D1]/30 p-1 border border-[#1A1A1A]/10 max-w-sm rounded-none">
            <button
              onClick={() => setActiveShowcase("showcase1")}
              className={`px-4 py-2 text-xs font-black uppercase tracking-wider cursor-pointer transition-all rounded-none ${
                activeShowcase === "showcase1"
                  ? "bg-[#3B2314] text-white"
                  : "text-stone-600 hover:text-stone-900 hover:bg-[#ECE0D1]/40"
              }`}
            >
              Volume I (Basics)
            </button>
            <button
              onClick={() => setActiveShowcase("showcase2")}
              className={`px-4 py-2 text-xs font-black uppercase tracking-wider cursor-pointer transition-all rounded-none ${
                activeShowcase === "showcase2"
                  ? "bg-[#3B2314] text-white"
                  : "text-stone-600 hover:text-stone-900 hover:bg-[#ECE0D1]/40"
              }`}
            >
              Volume II (Epistemology)
            </button>
          </div>
        </div>

        {/* The Vimeo Showcase Embed container */}
        <div className="space-y-4">
          {activeShowcase === "showcase1" ? (
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <span className="text-xs font-bold text-[#C25E3E] uppercase tracking-wider block">Showcase Album #10428964</span>
                  <span className="text-base font-bold text-[#1A1A1A]">Tarka Saṅgraha Śikṣaṇam (Prathama-Bhāgaḥ)</span>
                </div>
                <a 
                  href="https://vimeo.com/showcase/10428964" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex items-center gap-1.5 text-xs font-black text-[#8C6239] hover:text-[#3B2314] bg-[#FAF8F5] px-3 py-1.5 border border-[#1A1A1A]/15 hover:border-[#1A1A1A]"
                >
                  <span>Open on Vimeo</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
              
              {/* Responsive Vimeo Iframe */}
              <div className="relative aspect-video w-full bg-[#1A1A1A] border-2 border-[#1A1A1A]">
                <iframe 
                  src="https://player.vimeo.com/hubnut/album/10428964?byline=0&portrait=0&title=0&autoplay=0" 
                  width="100%" 
                  height="100%" 
                  frameBorder="0" 
                  allow="autoplay; fullscreen; picture-in-picture" 
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                  title="Tarka Sangraha Volume I Lectures"
                ></iframe>
              </div>
              <p className="text-xs text-stone-500 italic">
                Note: Use the playlist drawer icon in the top right corner of the video player above to browse and select from all available lessons in this volume.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <span className="text-xs font-bold text-[#C25E3E] uppercase tracking-wider block">Showcase Album #10950519</span>
                  <span className="text-base font-bold text-[#1A1A1A]">Tarka Saṅgraha Śikṣaṇam (Dvitīya-Bhāgaḥ)</span>
                </div>
                <a 
                  href="https://vimeo.com/showcase/10950519" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex items-center gap-1.5 text-xs font-black text-[#8C6239] hover:text-[#3B2314] bg-[#FAF8F5] px-3 py-1.5 border border-[#1A1A1A]/15 hover:border-[#1A1A1A]"
                >
                  <span>Open on Vimeo</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
              
              {/* Responsive Vimeo Iframe */}
              <div className="relative aspect-video w-full bg-[#1A1A1A] border-2 border-[#1A1A1A]">
                <iframe 
                  src="https://player.vimeo.com/hubnut/album/10950519?byline=0&portrait=0&title=0&autoplay=0" 
                  width="100%" 
                  height="100%" 
                  frameBorder="0" 
                  allow="autoplay; fullscreen; picture-in-picture" 
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                  title="Tarka Sangraha Volume II Lectures"
                ></iframe>
              </div>
              <p className="text-xs text-stone-500 italic">
                Note: Use the playlist drawer icon in the top right corner of the video player above to browse and select from all available lessons in this volume.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Structured study syllabus tying to the text reader */}
      <div className="bg-white border-2 border-[#1A1A1A] p-6 rounded-none cool-3d-gently space-y-6">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#8C6239] uppercase tracking-widest">
                <BookOpen className="w-4 h-4 text-[#8C6239]" />
                <span>स्वाध्याय-पद्धतिः | Guided Study Mapping</span>
              </div>
              <h4 className="text-lg font-serif font-black text-[#3B2314]">
                Topic Syllabus & Swādhyāya Linker
              </h4>
              <p className="text-xs text-stone-600 leading-normal">
                Click any topic to read its exact commentary text inside the Tarka-Vidyā Library while reviewing classes!
              </p>
            </div>

            {/* Quick search filter */}
            <div className="relative max-w-xs w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-stone-400" />
              </div>
              <input
                type="text"
                placeholder="Search study topics..."
                value={selectedTopicSearch}
                onChange={(e) => setSelectedTopicSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border-2 border-[#1A1A1A] bg-stone-50 text-xs text-[#1A1A1A] placeholder-stone-400 focus:outline-none focus:ring-0 focus:bg-white rounded-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSyllabus.map((item) => (
              <div 
                key={item.id}
                className="border-2 border-[#1A1A1A] p-4 bg-[#FAF8F5] hover:bg-[#F3EBE0] transition-all flex flex-col justify-between space-y-4 group rounded-none"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#C25E3E] uppercase tracking-wider bg-white border border-[#1A1A1A]/10 px-2 py-0.5 rounded-none">
                      {item.showcase.split(" ")[0] + " " + item.showcase.split(" ")[1]}
                    </span>
                    <span className="text-xs font-serif font-bold text-[#8C6239]">
                      {transliterate(item.sanskrit, targetScript)}
                    </span>
                  </div>
                  <h5 className="text-base font-bold text-[#3B2314] group-hover:text-[#8C6239] transition-colors">
                    {item.title}
                  </h5>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-dashed border-stone-200">
                  <span className="text-[10px] font-mono text-stone-400 font-bold uppercase">
                    Section: {item.sectionId}
                  </span>
                  
                  <button
                    onClick={() => onSelectTopic("tarka-samgraha", item.sectionId, item.sutraIndex || 0)}
                    className="flex items-center gap-1.5 text-xs font-black text-[#3B2314] hover:text-[#8C6239] group-hover:translate-x-1 transition-transform cursor-pointer"
                  >
                    <span>Read Text</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}

            {filteredSyllabus.length === 0 && (
              <div className="col-span-full border-2 border-dashed border-stone-300 p-8 text-center text-stone-500">
                <Info className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                <span className="text-xs">No matching topics found. Please try another search keyword!</span>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
