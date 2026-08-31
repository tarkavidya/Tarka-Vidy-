/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import Granthasarani from "./components/Granthasarani";
import GlobalSearch from "./components/GlobalSearch";
import OcrCuration from "./components/OcrCuration";
import Anuvada from "./components/Anuvada";
import VadaVidya from "./components/VadaVidya";
import TraditionMap from "./components/TraditionMap";
import Kosa from "./components/Kosa";
import Asmatkatha from "./components/Asmatkatha";
import Mangalacharanam from "./components/Mangalacharanam";
import FeedbackMaildesk from "./components/FeedbackMaildesk";
import TarkaVidyaChat from "./components/TarkaVidyaChat";
import SadhanaResources from "./components/SadhanaResources";
import AcademicShareModal, { AcademicSharePayload } from "./components/AcademicShareModal";
import NYAYA_TEXTS from "./data/texts.json";
import KOSA_TERMS from "./data/kosa.json";

import NYAYA_SECTIONS_RAW from "./data/nyayaSutras.json";
import TARKASASTRAS_SECTIONS_RAW from "./data/tarkasastram.json";
import TARKABHASHA_SECTIONS_RAW from "./data/tarkabhasha.json";
import LAKSANA_SECTIONS_RAW from "./data/laksana-sangraha.json";
import VAISESHIKA_SECTIONS_RAW from "./data/vaiseasika-sutras.json";
import PADARTHA_SECTIONS_RAW from "./data/padartha-dharmasamgraha.json";
import TARKASAMGRAHA_SECTIONS_RAW from "./data/tarkasamgraha.json";
import KARIKAVALI_SECTIONS_RAW from "./data/karikavali.json";
import ANANDAGIRI_SECTIONS_RAW from "./data/anandagiri-tarkasangraha.json";
import VYOMAVATI_SECTIONS_RAW from "./data/vyomavati.json";
import TATTVA_CINTAMANI_SECTIONS_RAW from "./data/tattva-cintamani.json";

import { SavedHighlight, NyayaSection } from "./types";
import { SCRIPT_NAMES, formatSanskrit, transliterate, getScriptFontClass } from "./utils/transliteration";
import { jsPDF } from "jspdf";
import {
  Home,
  Compass,
  Cpu,
  Layers,
  BookOpen,
  Users,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Info,
  HelpCircle,
  ExternalLink,
  Clock,
  Languages,
  Book,
  Grid,
  X,
  Volume2,
  Play,
  Pause,
  ArrowRight,
  Ruler,
  Brain,
  Sparkles,
  RefreshCw,
  Sliders,
  Download,
  FileText,
  Sun,
  Moon,
  Highlighter,
  Quote,
  Clipboard,
  Trash2,
  Plus,
  Bookmark,
  Eye,
  Search,
  Mail,
  Tv,
  Share2,
  Copy,
  Check,
  Link2,
  Unlink,
  Columns
} from "lucide-react";

export function DiyaLogoIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 500 320"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Flame of the Diya */}
      <path
        d="M 250 20 C 205 90, 205 150, 250 150 C 295 150, 295 90, 250 20 Z"
        fill="#C25E3E"
        className="fill-[#C25E3E]" /* Warm fire clay copper colors */
      />
      {/* Inner flame core */}
      <path
        d="M 250 55 C 228 100, 228 135, 250 135 C 272 135, 272 100, 250 55 Z"
        fill="#FAF8F5"
      />
      
      {/* Diya Bowl (Traditional clay pot) resting above book */}
      <path
        d="M 140 180 C 140 255, 360 255, 360 180 Z"
        fill="#8C6239"
        stroke="#8C6239"
        strokeWidth="12"
        strokeLinejoin="round"
        className="fill-[#8C6239] stroke-[#8C6239]"
      />
      <path
        d="M 140 180 Q 250 185, 360 180"
        stroke="#FAF8F5"
        strokeWidth="8"
        strokeLinecap="round"
      />
      
      {/* Elegant Open Book / Scripture Pages below */}
      <path
        d="M 30 260 
           Q 140 260, 250 290 
           Q 360 260, 470 260 
           L 440 155 
           Q 350 155, 250 180 
           Q 150 155, 60 155 
           Z"
        stroke="#1F1A17"
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-[#1F1A17]"
      />
      
      {/* Book Center spine / pages sheets lines */}
      <path
        d="M 250 290 L 250 180"
        stroke="#1F1A17"
        strokeWidth="10"
        strokeLinecap="round"
        className="stroke-[#1F1A17]"
      />
      <path
        d="M 45 240 Q 140 240, 240 265"
        stroke="#1F1A17"
        strokeWidth="6"
        strokeLinecap="round"
        className="stroke-[#1F1A17] opacity-35"
      />
      <path
        d="M 455 240 Q 360 240, 260 265"
        stroke="#1F1A17"
        strokeWidth="6"
        strokeLinecap="round"
        className="stroke-[#1F1A17] opacity-35"
      />
    </svg>
  );
}

type ActiveTab = "home" | "overview" | "library" | "kosa" | "translate" | "curate" | "dialectics" | "ai-chat" | "feedback" | "about" | "search" | "resources";

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("home");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const [curationLoadText, setCurationLoadText] = useState("");
  const [isOnline, setIsOnline] = useState(() => typeof navigator !== "undefined" ? navigator.onLine : true);

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const [translationLoadText, setTranslationLoadText] = useState("");
  const [visitorCount, setVisitorCount] = useState<number>(3141);
  const [liveUsers, setLiveUsers] = useState<number>(108);

  React.useEffect(() => {
    // Visitor counter persistence loaded from localStorage
    try {
      const curValString = localStorage.getItem("tarka_visitor_count");
      let curVal = curValString ? parseInt(curValString, 10) : 3141;
      const sessionActive = sessionStorage.getItem("tarka_session_active");
      if (!sessionActive) {
        curVal += 1;
        localStorage.setItem("tarka_visitor_count", curVal.toString());
        sessionStorage.setItem("tarka_session_active", "true");
      }
      setVisitorCount(curVal);
    } catch {
      setVisitorCount(3141);
    }

    // Live users minor fluctuation to look realistic and interactive
    const timer = setInterval(() => {
      setLiveUsers((prev) => {
        const delta = Math.floor(Math.random() * 5) - 2; // -2 to +2
        const next = prev + delta;
        return next > 90 && next < 130 ? next : prev;
      });
    }, 8000);

    return () => clearInterval(timer);
  }, []);

  const [showWelcomeModal, setShowWelcomeModal] = useState(() => {
    try {
      return localStorage.getItem("dismiss_tarka_guide_v2") !== "true";
    } catch {
      return true;
    }
  });
  
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth < 1024; // Collapse by default on tablet/mobile, open on desktop
    }
    return true;
  });
  
  // Custom multi-script support configurations
  const [scriptTheme, setScriptTheme] = useState<"devanagari" | "gregorian" | "combined">("combined");
  const [targetScript, setTargetScript] = useState<string>("devanagari");
  
  // Outer text focus index state (like Ashtadhyayi.com independent navigation sidebar)
  const [selectedTextId, setSelectedTextId] = useState<string | null>("nyaya-sutras");
  const [selectedSearchSectionId, setSelectedSearchSectionId] = useState<string | null>(null);
  const [selectedSearchSutraIndex, setSelectedSearchSutraIndex] = useState<number | null>(null);

  // Spotlight Reader States for Reading Optimization
  const [selectedTextExcerpt, setSelectedTextExcerpt] = useState("");
  const [showSpotlightTrigger, setShowSpotlightTrigger] = useState(false);
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);
  const [spotlightTheme, setSpotlightTheme] = useState<"manuscript" | "diya" | "slate" | "ink">("manuscript");
  const [spotlightHighContrast, setSpotlightHighContrast] = useState<boolean>(false);
  const [spotlightFontSize, setSpotlightFontSize] = useState<number>(24);
  const [spotlightScript, setSpotlightScript] = useState<string>("devanagari");
  const [spotlightSpacing, setSpotlightSpacing] = useState<"standard" | "relaxed" | "loose">("relaxed");
  const [spotlightRulerActive, setSpotlightRulerActive] = useState<boolean>(false);
  const [spotlightRulerY, setSpotlightRulerY] = useState<number>(50); // percentage vertical layout
  const [spotlightSpeechRate, setSpotlightSpeechRate] = useState<number>(0.85);
  const [isSpotlightChanting, setIsSpotlightChanting] = useState<boolean>(false);
  const [selectedWord, setSelectedWord] = useState<string>("");
  const [selectedKosaTermId, setSelectedKosaTermId] = useState<string | null>(null);
  const [lookupHistory, setLookupHistory] = useState<string[]>([]);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [pdfProgress, setPdfProgress] = useState("");

  // Spotlight Auto-Scroll Synchronization & Layout State
  const [isAutoScrollSyncEnabled, setIsAutoScrollSyncEnabled] = useState<boolean>(true);
  const [spotlightLayoutMode, setSpotlightLayoutMode] = useState<"dual" | "unified">("dual");
  const coreVersePaneRef = useRef<HTMLDivElement | null>(null);
  const transCommentaryPaneRef = useRef<HTMLDivElement | null>(null);
  const isSyncingScrollRef = useRef<boolean>(false);

  // --- Text Highlighting & Permanent Storage State ---
  const [highlights, setHighlights] = useState<SavedHighlight[]>(() => {
    try {
      const saved = localStorage.getItem("tarkavidya_highlights");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error(e);
      return [];
    }
  });

  const [highlightNote, setHighlightNote] = useState("");
  const [highlightColor, setHighlightColor] = useState("rgba(254, 240, 138, 0.5)"); // Default cozy yellow
  const [isHighlightsSectionOpen, setIsHighlightsSectionOpen] = useState(false);
  const [isCitationSectionOpen, setIsCitationSectionOpen] = useState(false);
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  // --- Main Workspace Academic Sharing State ---
  const [isWorkspaceShareOpen, setIsWorkspaceShareOpen] = useState(false);
  const [workspaceSharePayload, setWorkspaceSharePayload] = useState<AcademicSharePayload | null>(null);
  const [quickCopied, setQuickCopied] = useState(false);

  const getWorkspaceSharePayload = (): AcademicSharePayload => {
    const currentUrl = typeof window !== "undefined" ? window.location.href : "https://tarkavidya.in";
    if (activeTab === "library") {
      const curText = NYAYA_TEXTS.find((t) => t.id === selectedTextId) || NYAYA_TEXTS[0];
      return {
        title: `${curText?.title || "Treatise"} (${curText?.devanagariTitle || ""})`,
        sanskritText: curText?.devanagariTitle,
        transliteration: curText?.author,
        translation: curText?.description || "Nyāya-Vaiśeṣika Epistemological Treatise",
        source: `${curText?.title} — ${curText?.author || "Classical Ācārya"}`,
        category: "verse",
        url: typeof window !== "undefined" ? `${window.location.origin}${window.location.pathname}?tab=library&text=${curText?.id}` : currentUrl,
      };
    } else if (activeTab === "overview") {
      return {
        title: "Darśana Tradition Map & Epistemological Matrix",
        sanskritText: "॥ प्रमाणतर्कन्यायसिद्धान्तव्यवस्था ॥",
        transliteration: "Pramāṇa-Tarka-Nyāya-Siddhānta-Vyavasthā",
        translation: "Comparative analysis of Pramāṇas, 7 Padārthas (Ontology), and Hetvābhāsa (Logical Fallacies) across Indian philosophical systems.",
        source: "Tarka-Vidyā Comparative Epistemology Portal",
        category: "comparative-insight",
        url: typeof window !== "undefined" ? `${window.location.origin}${window.location.pathname}?tab=overview` : currentUrl,
      };
    } else if (activeTab === "dialectics") {
      return {
        title: "Vāda-Vidyā: Nyāya Syllogistic Inference Assembly (Pañcāvayava)",
        sanskritText: "प्रतिज्ञा-हेतु-उदाहरण-उपनय-निगमनानि पञ्चावयवाः",
        transliteration: "Pratijñā - Hetu - Udāharaṇa - Upanaya - Nigamanāni Pañcāvayavāḥ",
        translation: "Formal 5-membered syllogism of Indian logic: Proposition, Ground, Exemplification, Application, and Conclusion.",
        source: "Akṣapāda Gautama's Nyāyasūtra & Tarkasaṁgraha",
        category: "comparative-insight",
        url: typeof window !== "undefined" ? `${window.location.origin}${window.location.pathname}?tab=dialectics` : currentUrl,
      };
    } else if (activeTab === "kosa") {
      return {
        title: "Tarka-Koṣa: Nyāya-Vaiśeṣika Philosophical Lexicon",
        sanskritText: "तर्ककोषः — परिभाषासङ्ग्रहः",
        transliteration: "Tarkakoṣaḥ — Paribhāṣāsaṅgrahaḥ",
        translation: "Comprehensive epistemological lexicon and philosophical dictionary with classical Sanskrit definitions.",
        source: "Tarka-Vidyā Lexicon",
        category: "dictionary",
        url: typeof window !== "undefined" ? `${window.location.origin}${window.location.pathname}?tab=kosa` : currentUrl,
      };
    } else {
      return {
        title: "Tarka-Vidyā (तर्कविद्या) — Digital Nyāya & Vaiśeṣika Episteme Archive",
        sanskritText: "॥ ॐ कणादगौतमादिभ्यस्तर्कविद्यासम्प्रदायकर्तृभ्यो वंशऋषिभ्यो नमो महद्भ्यो नमो गुरुभ्यः ॥",
        transliteration: "Om Kaṇāda-Gautamādibhyas Tarka-Vidyā-Sampradāya-Kartṛbhyo Vaṁśa-Ṛṣibhyo Namo Mahadbhyo Namo Gurubhyaḥ",
        translation: "Scholarly digital archive for Indian epistemology, classical logic, and Sanskrit foundational treatises.",
        source: "Tarka-Vidyā Digital Swādhyāya Project",
        category: "portal",
        url: currentUrl,
      };
    }
  };

  const handleOpenWorkspaceShare = () => {
    setWorkspaceSharePayload(getWorkspaceSharePayload());
    setIsWorkspaceShareOpen(true);
  };

  const handleDirectSocialShare = (platform: "whatsapp" | "twitter" | "facebook" | "copy") => {
    const payload = getWorkspaceSharePayload();
    const rawUrl = payload.url || (typeof window !== "undefined" ? window.location.href : "https://tarkavidya.in");
    const formattedText = `📜 *${payload.title}*\n${payload.sanskritText ? `\n"${payload.sanskritText}"` : ""}\n\n${payload.translation}\n\n📖 _Source: ${payload.source}_\n🔗 ${rawUrl}`;

    if (platform === "whatsapp") {
      const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(formattedText)}`;
      window.open(waUrl, "_blank", "noopener,noreferrer");
    } else if (platform === "twitter") {
      const tweetText = `${payload.title}${payload.sanskritText ? `\n${payload.sanskritText}` : ""}\n\n${payload.translation.slice(0, 140)}...`;
      const twUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(rawUrl)}&hashtags=Nyaya,IndianPhilosophy,Logic,TarkaVidya`;
      window.open(twUrl, "_blank", "noopener,noreferrer");
    } else if (platform === "facebook") {
      const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(rawUrl)}&quote=${encodeURIComponent(payload.title + " — " + payload.translation)}`;
      window.open(fbUrl, "_blank", "noopener,noreferrer");
    } else if (platform === "copy") {
      navigator.clipboard.writeText(`${payload.title}\n${payload.sanskritText ? payload.sanskritText + "\n" : ""}${payload.translation}\nSource: ${payload.source}\n${rawUrl}`);
      setQuickCopied(true);
      setTimeout(() => setQuickCopied(false), 2000);
    }
  };

  React.useEffect(() => {
    try {
      localStorage.setItem("tarkavidya_highlights", JSON.stringify(highlights));
    } catch (e) {
      console.error(e);
    }
  }, [highlights]);

  const handleSaveSelectionHighlight = (typeOverride?: "verse" | "translation" | "commentary", textOverride?: string) => {
    let textToSave = "";
    let hType: "verse" | "translation" | "commentary" = "verse";
    let hScript = spotlightScript;

    if (textOverride) {
      textToSave = textOverride;
      hType = typeOverride || "verse";
    } else {
      const selection = window.getSelection();
      const selectionText = selection ? selection.toString().trim() : "";
      
      if (selectionText) {
        textToSave = selectionText;
        const verseRendered = transliterate(spotlightVerse, spotlightScript);
        if (verseRendered.toLowerCase().includes(selectionText.toLowerCase())) {
          hType = "verse";
          hScript = spotlightScript;
        } else if (spotlightTranslation.toLowerCase().includes(selectionText.toLowerCase())) {
          hType = "translation";
        } else if (spotlightCommentary.toLowerCase().includes(selectionText.toLowerCase())) {
          hType = "commentary";
        } else {
          hType = "verse";
        }
      }
    }

    if (!textToSave) {
      alert("Please highlight/select some text on the right-hand canvas using your mouse, or click one of the 'Highlight...' preset buttons below!");
      return;
    }

    const isDuplicate = highlights.some(h => h.text.toLowerCase() === textToSave.toLowerCase() && h.sutraId === selectedTextId && h.type === hType);
    if (isDuplicate) {
      alert("This text segment is already highlighted!");
      return;
    }

    const currentTextObj = NYAYA_TEXTS.find(t => t.id === selectedTextId);

    const newHighlight: SavedHighlight = {
      id: "h_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9),
      text: textToSave,
      type: hType,
      script: hType === "verse" ? hScript : undefined,
      color: highlightColor,
      note: highlightNote.trim() || undefined,
      sutraId: selectedTextId,
      sutraTitle: currentTextObj ? `${currentTextObj.title}` : "Tarka-Vidyā Library",
      timestamp: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      })
    };

    setHighlights(prev => [newHighlight, ...prev]);
    setHighlightNote("");
    window.getSelection()?.removeAllRanges();
  };

  const handleDeleteHighlight = (id: string) => {
    setHighlights(prev => prev.filter(h => h.id !== id));
  };

  const generateCitation = (format: "apa" | "mla" | "chicago" | "harvard" | "bibtex") => {
    const textObj = NYAYA_TEXTS.find(t => t.id === selectedTextId);
    const title = textObj?.title || "Tarka-Vidyā Treatise";
    const author = textObj?.author || "Traditional Sage";
    const period = textObj?.century || "Ancient Period";
    const verseClean = spotlightVerse.replace(/\s+/g, " ").trim();
    const transClean = spotlightTranslation ? ` "${spotlightTranslation}"` : "";

    switch (format) {
      case "apa":
        return `${author}. (${period}). ${title}. [Sanskrit Manuscript Digital Edition]. tarkavidya.com Archive. Excerpt: "${verseClean}"${transClean}.`;
      case "mla":
        return `${author}. *${title}*. (${period}). tarkavidya.com. Excerpt: "${verseClean}"${transClean}.`;
      case "chicago":
        return `${author}. *${title}*. ${period}. tarkavidya.com Archive. Excerpt: "${verseClean}"${transClean}.`;
      case "harvard":
        return `${author} (${period}) *${title}*, tarkavidya.com digital collection. Excerpt: "${verseClean}"${transClean}.`;
      case "bibtex":
        const bibKey = (author.split(" ").pop() || "Sutra").toLowerCase() + "_" + (title.replace(/\s+/g, "").substring(0, 10).toLowerCase());
        return `@book{${bibKey},
  author = {${author}},
  title = {${title}},
  note = {Sanskrit text: "${verseClean}". English: "${spotlightTranslation}"},
  publisher = {tarkavidya.com Digital Archive},
  year = {${period.includes("Century") ? "n.d." : "2026"}}
}`;
    }
  };

  const handleCopyCitation = (format: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFormat(format);
    setTimeout(() => {
      setCopiedFormat(null);
    }, 2000);
  };

  // --- Dynamic Highlight Renderer Helpers ---
  const highlightString = (fullText: string, activeHighlights: SavedHighlight[]) => {
    const sorted = [...activeHighlights].sort((a, b) => b.text.length - a.text.length);
    
    interface MatchRange {
      start: number;
      end: number;
      color: string;
      note?: string;
      id: string;
    }

    const ranges: MatchRange[] = [];
    sorted.forEach(h => {
      let idx = fullText.toLowerCase().indexOf(h.text.toLowerCase());
      while (idx !== -1) {
        const start = idx;
        const end = idx + h.text.length;
        
        const hasOverlap = ranges.some(r => 
          (start >= r.start && start < r.end) || 
          (end > r.start && end <= r.end) ||
          (r.start >= start && r.start < end)
        );
        
        if (!hasOverlap) {
          ranges.push({ start, end, color: h.color, note: h.note, id: h.id });
        }
        
        idx = fullText.toLowerCase().indexOf(h.text.toLowerCase(), idx + 1);
      }
    });

    if (ranges.length === 0) {
      return fullText;
    }

    ranges.sort((a, b) => a.start - b.start);

    const elements: React.ReactNode[] = [];
    let lastIndex = 0;
    ranges.forEach((r, idx) => {
      if (r.start > lastIndex) {
        elements.push(fullText.substring(lastIndex, r.start));
      }
      
      elements.push(
        <span
          key={`canvas-h-${r.id}-${idx}`}
          style={{ backgroundColor: r.color }}
          className="rounded px-1 relative group cursor-help text-[#1F1A17] inline border-b border-[#1F1A17]/20 transition-all duration-150"
          title={r.note ? `Annotation: ${r.note}` : "Saved Highlight"}
        >
          {fullText.substring(r.start, r.end)}
          {r.note && (
            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-[#1F1A17] text-[#FCF8EC] text-[10px] px-2 py-1 rounded shadow-lg z-30 max-w-xs whitespace-normal font-sans font-medium">
              📝 {r.note}
            </span>
          )}
        </span>
      );
      lastIndex = r.end;
    });

    if (lastIndex < fullText.length) {
      elements.push(fullText.substring(lastIndex));
    }

    return <>{elements}</>;
  };

  const renderCoreVerseWithHighlights = () => {
    if (isMemoriseMode) {
      const tokens = spotlightVerse.split(/([^\s\d।॥!?,;:()\[\]{}]+)/);
      const elements: React.ReactNode[] = [];
      let wordIndexCounter = 0;

      const shouldHideWord = (idx: number, level: number) => {
        if (level === 1) return idx % 4 === 3;     // 25% hidden
        if (level === 2) return idx % 2 === 1;     // 50% hidden
        if (level === 3) return idx % 4 !== 0;     // 75% hidden
        if (level === 4) return true;              // 100% hidden
        return false;
      };

      for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        if (i % 2 === 1) {
          // It's a word token
          const currentIdx = wordIndexCounter;
          const isWordHidden = shouldHideWord(currentIdx, memoriseHideLevel);
          const isRevealed = revealedWordIndices.includes(currentIdx);
          const transliteratedWord = transliterate(token, spotlightScript);

          if (isWordHidden) {
            if (isRevealed) {
              elements.push(
                <span
                  key={`word-revealed-${i}`}
                  onClick={() => {
                    setRevealedWordIndices(prev => prev.filter(idx => idx !== currentIdx));
                  }}
                  className="inline-block mx-0.5 px-1 rounded bg-emerald-500/10 text-emerald-800 border border-emerald-500/40 cursor-pointer transition-all hover:bg-emerald-500/20"
                  title="Revealed! Click to hide again"
                >
                  {transliteratedWord}
                </span>
              );
            } else {
              elements.push(
                <span
                  key={`word-masked-${i}`}
                  onClick={() => {
                    setRevealedWordIndices(prev => [...prev, currentIdx]);
                  }}
                  className="inline-block mx-1 px-2 py-0.5 rounded-md border border-[#8C6239]/30 bg-[#ECE0D1]/10 hover:bg-[#ECE0D1]/25 hover:border-[#8C6239]/60 text-[#8C6239] cursor-pointer transition-all select-none font-sans text-xs font-bold align-middle"
                  title="Click to recall/reveal"
                >
                  {"•".repeat(Math.min(6, Math.max(2, token.length)))}
                </span>
              );
            }
          } else {
            elements.push(
              <span key={`word-normal-${i}`}>
                {transliteratedWord}
              </span>
            );
          }
          wordIndexCounter++;
        } else {
          // It's preceding/succeeding whitespace or punctuation
          elements.push(
            <span key={`nonword-${i}`}>
              {transliterate(token, spotlightScript)}
            </span>
          );
        }
      }
      return <>{elements}</>;
    }

    const renderedText = transliterate(spotlightVerse, spotlightScript);
    const activeHighlights = highlights.filter(h => 
      h.type === "verse" && 
      h.script === spotlightScript && 
      h.sutraId === selectedTextId &&
      renderedText.toLowerCase().includes(h.text.toLowerCase())
    );

    if (activeHighlights.length === 0) {
      return renderedText;
    }

    return highlightString(renderedText, activeHighlights);
  };

  const renderTranslationWithHighlights = () => {
    const activeHighlights = highlights.filter(h => 
      h.type === "translation" && 
      h.sutraId === selectedTextId &&
      spotlightTranslation.toLowerCase().includes(h.text.toLowerCase())
    );

    if (activeHighlights.length === 0) {
      return spotlightTranslation;
    }

    return highlightString(spotlightTranslation, activeHighlights);
  };

  const renderCommentaryWithHighlights = () => {
    const activeHighlights = highlights.filter(h => 
      h.type === "commentary" && 
      h.sutraId === selectedTextId &&
      spotlightCommentary.toLowerCase().includes(h.text.toLowerCase())
    );

    if (activeHighlights.length === 0) {
      return spotlightCommentary;
    }

    return highlightString(spotlightCommentary, activeHighlights);
  };

  const normalizeIast = (str: string) => {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ā/g, "a")
      .replace(/ī/g, "i")
      .replace(/ū/g, "u")
      .replace(/ṛ/g, "r")
      .replace(/ñ/g, "n")
      .replace(/ṅ/g, "n")
      .replace(/ṭ/g, "t")
      .replace(/ḍ/g, "d")
      .replace(/ṇ/g, "n")
      .replace(/ś/g, "s")
      .replace(/ṣ/g, "s")
      .replace(/ḥ/g, "h")
      .replace(/ṃ/g, "m");
  };

  const getMatchingKosaTerm = (wordStr: string) => {
    if (!wordStr) return null;
    const clean = wordStr.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()॥।]/g, "").trim().toLowerCase();
    const normalizedClean = normalizeIast(clean);
    if (!clean) return null;

    let match = KOSA_TERMS.find(t => {
      const termClean = t.term.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()॥।]/g, "").trim().toLowerCase();
      const iastNormalized = normalizeIast(t.iast);
      return clean === termClean || normalizedClean === iastNormalized;
    });
    if (match) return match;

    match = KOSA_TERMS.find(t => {
      const termClean = t.term.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()॥।]/g, "").trim().toLowerCase();
      const iastNormalized = normalizeIast(t.iast);
      return (
        termClean.includes(clean) || 
        clean.includes(termClean) ||
        iastNormalized.includes(normalizedClean) ||
        normalizedClean.includes(iastNormalized)
      );
    });
    return match;
  };

  const [spotlightVerse, setSpotlightVerse] = useState("");
  const [isMemoriseMode, setIsMemoriseMode] = useState<boolean>(false);
  const [memoriseHideLevel, setMemoriseHideLevel] = useState<number>(2); // 1 = 25%, 2 = 50%, 3 = 75%, 4 = 100%
  const [revealedWordIndices, setRevealedWordIndices] = useState<number[]>([]);

  React.useEffect(() => {
    setRevealedWordIndices([]);
  }, [spotlightVerse]);

  const [spotlightTranslation, setSpotlightTranslation] = useState("");
  const [spotlightCommentary, setSpotlightCommentary] = useState("");
  const [isEditingSpotlight, setIsEditingSpotlight] = useState(false);
  const [showSpotlightVerse, setShowSpotlightVerse] = useState(true);
  const [showSpotlightPadaccheda, setShowSpotlightPadaccheda] = useState(true);
  const [showSpotlightTranslation, setShowSpotlightTranslation] = useState(true);

  const [spotlightSutras, setSpotlightSutras] = useState<any[]>([]);
  const [spotlightSutraIndex, setSpotlightSutraIndex] = useState<number>(-1);
  const [spotlightLang, setSpotlightLang] = useState<"english" | "hindi" | "bengali">("english");

  React.useEffect(() => {
    if (isSpotlightOpen && selectedTextExcerpt) {
      const fullText = selectedTextExcerpt;
      if (fullText.includes("[Translation") || fullText.includes("[Commentary]")) {
        const lines = fullText.split("\n");
        let currentSection: "verse" | "translation" | "commentary" = "verse";
        const verseLines: string[] = [];
        const translationLines: string[] = [];
        const commentaryLines: string[] = [];

        lines.forEach((line) => {
          if (line.includes("[Translation")) {
            currentSection = "translation";
          } else if (line.includes("[Commentary]")) {
            currentSection = "commentary";
          } else {
            const cleanLine = line
              .replace(/^\[Translation.*?\]:\s*/i, "")
              .replace(/^\[Commentary\]:\s*/i, "");
            
            if (currentSection === "verse") {
              verseLines.push(line);
            } else if (currentSection === "translation") {
              translationLines.push(cleanLine);
            } else if (currentSection === "commentary") {
              commentaryLines.push(cleanLine);
            }
          }
        });

        setSpotlightVerse(verseLines.join("\n").trim());
        setSpotlightTranslation(translationLines.join("\n").trim());
        setSpotlightCommentary(commentaryLines.join("\n").trim());
      } else {
        setSpotlightVerse(fullText.trim());
        setSpotlightTranslation("");
        setSpotlightCommentary("");
      }
      setIsEditingSpotlight(false);
    }
  }, [isSpotlightOpen, selectedTextExcerpt]);

  React.useEffect(() => {
    const handleTextSelection = (e: MouseEvent) => {
      setTimeout(() => {
        const selection = window.getSelection();
        if (selection && !selection.isCollapsed) {
          // Verify if selection is within a valid reader text container
          const target = e.target as HTMLElement;
          const isReaderText = target && (
            target.closest("#granthasarani-module") || 
            target.closest("#fullscreen-reader-overlay")
          );
          
          if (!isReaderText) {
            const anchorParent = selection.anchorNode?.parentElement;
            const isAnchorReaderText = anchorParent && (
              anchorParent.closest("#granthasarani-module") ||
              anchorParent.closest("#fullscreen-reader-overlay")
            );
            
            if (!isAnchorReaderText) {
              return;
            }
          }

          const selectedTextStr = selection.toString().trim();
          if (selectedTextStr.length > 2 && selectedTextStr.replace(/\s+/g, "").length > 1) {
            setSelectedTextExcerpt(selectedTextStr);
            setShowSpotlightTrigger(true);
            return;
          }
        }
      }, 50);
    };

    const handleClearSelection = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("#spotlight-widget") || target.closest("#spotlight-trigger")) {
        return;
      }
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) {
        setShowSpotlightTrigger(false);
      }
    };

    document.addEventListener("mouseup", handleTextSelection);
    document.addEventListener("mousedown", handleClearSelection);
    return () => {
      document.removeEventListener("mouseup", handleTextSelection);
      document.removeEventListener("mousedown", handleClearSelection);
    };
  }, []);

  const handleSpotlightRecite = () => {
    if ("speechSynthesis" in window) {
      if (isSpotlightChanting) {
        window.speechSynthesis.cancel();
        setIsSpotlightChanting(false);
        return;
      }
      const textToSpeak = (showSpotlightVerse && spotlightVerse) ? spotlightVerse : selectedTextExcerpt;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = "hi-IN";
      utterance.rate = spotlightSpeechRate;
      utterance.onend = () => {
        setIsSpotlightChanting(false);
      };
      utterance.onerror = () => {
        setIsSpotlightChanting(false);
      };
      
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
      setIsSpotlightChanting(true);
    } else {
      alert("Browser speech synthesis is not supported on this platform.");
    }
  };

  // Synchronized scrolling handlers for Spotlight Dual Panes
  const handleCoreVerseScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!isAutoScrollSyncEnabled || isSyncingScrollRef.current) return;
    if (!coreVersePaneRef.current || !transCommentaryPaneRef.current) return;

    const source = e.currentTarget;
    const target = transCommentaryPaneRef.current;
    const sourceScrollable = source.scrollHeight - source.clientHeight;
    const targetScrollable = target.scrollHeight - target.clientHeight;

    if (sourceScrollable <= 2 || targetScrollable <= 2) return;

    const scrollRatio = source.scrollTop / sourceScrollable;
    isSyncingScrollRef.current = true;
    target.scrollTop = scrollRatio * targetScrollable;
    setTimeout(() => {
      isSyncingScrollRef.current = false;
    }, 50);
  };

  const handleTransCommentaryScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!isAutoScrollSyncEnabled || isSyncingScrollRef.current) return;
    if (!coreVersePaneRef.current || !transCommentaryPaneRef.current) return;

    const source = e.currentTarget;
    const target = coreVersePaneRef.current;
    const sourceScrollable = source.scrollHeight - source.clientHeight;
    const targetScrollable = target.scrollHeight - target.clientHeight;

    if (sourceScrollable <= 2 || targetScrollable <= 2) return;

    const scrollRatio = source.scrollTop / sourceScrollable;
    isSyncingScrollRef.current = true;
    target.scrollTop = scrollRatio * targetScrollable;
    setTimeout(() => {
      isSyncingScrollRef.current = false;
    }, 50);
  };

  const handleSpotlightNavigate = (direction: "prev" | "next") => {
    if (spotlightSutras.length === 0 || spotlightSutraIndex === -1) return;

    let newIndex = spotlightSutraIndex;
    if (direction === "prev") {
      newIndex = spotlightSutraIndex - 1;
    } else {
      newIndex = spotlightSutraIndex + 1;
    }

    if (newIndex >= 0 && newIndex < spotlightSutras.length) {
      const sutra = spotlightSutras[newIndex];
      setSpotlightSutraIndex(newIndex);

      const text = `Sūtra ${sutra.sutraNum}: ${sutra.heading}\n\n${sutra.devanagari}\n\n[Translation (${spotlightLang})]: ${sutra.translations[spotlightLang]}${sutra.commentary ? `\n\n[Commentary]: ${sutra.commentary[spotlightLang]}` : ""}`;

      setSelectedTextExcerpt(text);
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      setIsSpotlightChanting(false);
      setSelectedWord("");
    }
  };

  const handleWordSpeak = (word: string) => {
    if ("speechSynthesis" in window) {
      const cleanWord = word.replace(/\u00AD/g, "").replace(/[.,\/#!$%\^&\*;:{}=\-_`~()॥।]/g,"").trim();
      if (!cleanWord) return;
      const utterance = new SpeechSynthesisUtterance(cleanWord);
      utterance.lang = "hi-IN";
      utterance.rate = 0.7;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleDownloadPDF = () => {
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        throw new Error("Could not create canvas context");
      }

      // We'll prepare the sections we need to render
      const textToRenderVerse = (showSpotlightVerse && spotlightVerse ? transliterate(spotlightVerse, spotlightScript) : "").replace(/\u00AD/g, "");
      const textToRenderTranslation = showSpotlightTranslation && spotlightTranslation ? spotlightTranslation : "";
      const textToRenderCommentary = showSpotlightTranslation && spotlightCommentary ? spotlightCommentary : "";

      // Padaccheda words
      const padacchedaWords = showSpotlightPadaccheda && spotlightVerse 
        ? spotlightVerse.split(/\s+/).map(w => transliterate(w.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()॥।]/g, "").trim(), spotlightScript).replace(/\u00AD/g, "")).filter(Boolean)
        : [];

      // Helper function to wrap text
      const wrapText = (context: CanvasRenderingContext2D, text: string, maxWidth: number) => {
        const paragraphs = text.split("\n");
        const linesList: string[] = [];
        paragraphs.forEach(paragraph => {
          const words = paragraph.split(/\s+/);
          let currentLine = "";
          for (let i = 0; i < words.length; i++) {
            const word = words[i];
            const testLine = currentLine + (currentLine ? " " : "") + word;
            const metrics = context.measureText(testLine);
            if (metrics.width > maxWidth && i > 0) {
              linesList.push(currentLine);
              currentLine = word;
            } else {
              currentLine = testLine;
            }
          }
          if (currentLine) {
            linesList.push(currentLine);
          }
          // Add empty line for paragraph spacing if not the last one
          linesList.push("");
        });
        if (linesList.length > 0 && linesList[linesList.length - 1] === "") {
          linesList.pop(); // remove trailing empty paragraph line
        }
        return linesList;
      };

      // Measure sizes to calculate total canvas height
      const canvasWidth = 1200;
      let totalHeight = 160; // top header margin

      // Set font to measure verse
      ctx.font = "bold 32px 'Tiro Devanagari Sanskrit', 'Tiro Gurmukhi', 'Tiro Kannada', 'Tiro Tamil', 'Tiro Telugu', 'Tiro Bangla', 'Noto Serif Bengali', 'Noto Serif', serif, sans-serif";
      let wrappedVerseLines: string[] = [];
      if (textToRenderVerse) {
        wrappedVerseLines = wrapText(ctx, textToRenderVerse, 1080);
        totalHeight += 40; // Title "VERSE (मूलपाठः)"
        totalHeight += wrappedVerseLines.length * 48; // Line-height
        totalHeight += 40; // Spacing after verse
      }

      // Padaccheda block height
      let padacchedaHeight = 0;
      if (padacchedaWords.length > 0) {
        totalHeight += 40; // Title
        // calculate wrapped buttons layout
        let currentX = 60;
        let currentY = 0;
        ctx.font = "18px 'Tiro Devanagari Sanskrit', 'Tiro Gurmukhi', 'Tiro Kannada', 'Tiro Tamil', 'Tiro Telugu', 'Tiro Bangla', 'Noto Serif Bengali', serif";
        padacchedaWords.forEach(w => {
          const wordWidth = ctx.measureText(w).width + 30; // with padding
          if (currentX + wordWidth > 1140) {
            currentX = 60;
            currentY += 45;
          }
          currentX += wordWidth + 15;
        });
        padacchedaHeight = currentY + 45;
        totalHeight += padacchedaHeight;
        totalHeight += 40; // spacing after
      }

      // Set font to measure translation
      ctx.font = "italic 24px 'Tiro Devanagari Sanskrit', 'Tiro Gurmukhi', 'Tiro Kannada', 'Tiro Tamil', 'Tiro Telugu', 'Tiro Bangla', 'Noto Serif Bengali', 'Noto Serif', serif, sans-serif";
      let wrappedTranslationLines: string[] = [];
      if (textToRenderTranslation) {
        wrappedTranslationLines = wrapText(ctx, textToRenderTranslation, 1080);
        totalHeight += 40; // Title
        totalHeight += wrappedTranslationLines.length * 36;
        totalHeight += 40; // spacing after
      }

      // Set font to measure commentary
      ctx.font = "20px 'Tiro Devanagari Sanskrit', 'Tiro Gurmukhi', 'Tiro Kannada', 'Tiro Tamil', 'Tiro Telugu', 'Tiro Bangla', 'Noto Serif Bengali', 'Noto Serif', serif, sans-serif";
      let wrappedCommentaryLines: string[] = [];
      if (textToRenderCommentary) {
        wrappedCommentaryLines = wrapText(ctx, textToRenderCommentary, 1080);
        totalHeight += 40; // Title
        totalHeight += wrappedCommentaryLines.length * 30;
        totalHeight += 40; // spacing after
      }

      totalHeight += 100; // footer padding

      // Ensure canvas has a minimum height
      canvas.width = canvasWidth;
      canvas.height = Math.max(800, totalHeight);

      // --- RENDERING ON CANVAS ---
      // Background colors based on theme
      let bgColor = "#F3EBE0"; // manuscript/palm-leaf
      let textColor = "#3B2314";
      let accentColor = "#8C6239";
      let dividerColor = "rgba(140, 98, 57, 0.2)";

      if (spotlightHighContrast) {
        if (spotlightTheme === "diya" || spotlightTheme === "slate") {
          bgColor = "#000000";
          textColor = "#FFFFFF";
          accentColor = "#FFFFFF";
          dividerColor = "rgba(255, 255, 255, 0.3)";
        } else {
          bgColor = "#FFFFFF";
          textColor = "#000000";
          accentColor = "#000000";
          dividerColor = "rgba(0, 0, 0, 0.3)";
        }
      } else {
        if (spotlightTheme === "diya") {
          bgColor = "#281D17";
          textColor = "#ECE0CC";
          accentColor = "#D9A05B";
          dividerColor = "rgba(217, 160, 91, 0.2)";
        } else if (spotlightTheme === "slate") {
          bgColor = "#141517";
          textColor = "#DFDFDF";
          accentColor = "#A3A3A3";
          dividerColor = "rgba(163, 163, 163, 0.2)";
        } else if (spotlightTheme === "ink") {
          bgColor = "#FFFFFF";
          textColor = "#1A1A1A";
          accentColor = "#1A1A1A";
          dividerColor = "rgba(26, 26, 26, 0.2)";
        }
      }

      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw subtle ornamental border
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 4;
      ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
      ctx.lineWidth = 1;
      ctx.strokeRect(26, 26, canvas.width - 52, canvas.height - 52);

      // Header Banner
      ctx.fillStyle = accentColor;
      ctx.font = "bold 36px 'Inter', sans-serif";
      ctx.fillText("Tarka-Vidyā Swādhyāya Digital Archive", 60, 80);

      // Meta info
      ctx.fillStyle = textColor;
      ctx.font = "18px monospace";
      ctx.fillText(`Date: ${new Date().toLocaleDateString()}`, 60, 120);

      // Top Divider
      ctx.strokeStyle = dividerColor;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(60, 140);
      ctx.lineTo(1140, 140);
      ctx.stroke();

      let yCursor = 190;

      // Draw Verse
      if (textToRenderVerse) {
        ctx.fillStyle = accentColor;
        ctx.font = "bold 20px monospace";
        ctx.fillText("VERSE (मूलपाठः)", 60, yCursor);
        yCursor += 35;

        ctx.fillStyle = textColor;
        ctx.font = "bold 32px 'Tiro Devanagari Sanskrit', 'Tiro Gurmukhi', 'Tiro Kannada', 'Tiro Tamil', 'Tiro Telugu', 'Tiro Bangla', 'Noto Serif Bengali', 'Noto Serif', serif, sans-serif";
        wrappedVerseLines.forEach(line => {
          if (line) {
            ctx.fillText(line, 60, yCursor);
          }
          yCursor += 48;
        });
        yCursor += 10; // margin after
      }

      // Draw Padaccheda
      if (padacchedaWords.length > 0) {
        ctx.fillStyle = accentColor;
        ctx.font = "bold 20px monospace";
        ctx.fillText("PADA-CCHEDA (पदच्छेदः / Split Words)", 60, yCursor);
        yCursor += 35;

        // Draw words in nice boxes
        let currentX = 60;
        ctx.font = "20px 'Tiro Devanagari Sanskrit', 'Tiro Gurmukhi', 'Tiro Kannada', 'Tiro Tamil', 'Tiro Telugu', 'Tiro Bangla', 'Noto Serif Bengali', serif, sans-serif";
        
        padacchedaWords.forEach(w => {
          const textWidth = ctx.measureText(w).width;
          const wordWidth = textWidth + 24; // padding
          
          if (currentX + wordWidth > 1140) {
            currentX = 60;
            yCursor += 45;
          }

          // draw subtle border box
          ctx.strokeStyle = dividerColor;
          ctx.lineWidth = 1;
          ctx.strokeRect(currentX, yCursor, wordWidth, 36);

          // fill subtle background for words
          ctx.fillStyle = dividerColor;
          ctx.fillRect(currentX, yCursor, wordWidth, 36);

          // draw text
          ctx.fillStyle = textColor;
          ctx.fillText(w, currentX + 12, yCursor + 25);

          currentX += wordWidth + 15;
        });

        yCursor += 65; // margin after
      }

      // Draw Translation
      if (textToRenderTranslation) {
        ctx.fillStyle = accentColor;
        ctx.font = "bold 20px monospace";
        ctx.fillText("TRANSLATION (भाषानुवादः)", 60, yCursor);
        yCursor += 35;

        ctx.fillStyle = textColor;
        ctx.font = "italic 24px 'Tiro Devanagari Sanskrit', 'Tiro Gurmukhi', 'Tiro Kannada', 'Tiro Tamil', 'Tiro Telugu', 'Tiro Bangla', 'Noto Serif Bengali', 'Noto Serif', serif, sans-serif";
        wrappedTranslationLines.forEach(line => {
          if (line) {
            ctx.fillText(line, 60, yCursor);
          }
          yCursor += 36;
        });
        yCursor += 10;
      }

      // Draw Commentary
      if (textToRenderCommentary) {
        ctx.fillStyle = accentColor;
        ctx.font = "bold 20px monospace";
        ctx.fillText("COMMENTARY (भाष्यम्)", 60, yCursor);
        yCursor += 35;

        ctx.fillStyle = textColor;
        ctx.font = "20px 'Tiro Devanagari Sanskrit', 'Tiro Gurmukhi', 'Tiro Kannada', 'Tiro Tamil', 'Tiro Telugu', 'Tiro Bangla', 'Noto Serif Bengali', 'Noto Serif', serif, sans-serif";
        wrappedCommentaryLines.forEach(line => {
          if (line) {
            ctx.fillText(line, 60, yCursor);
          }
          yCursor += 30;
        });
        yCursor += 10;
      }

      // Footer line
      ctx.strokeStyle = dividerColor;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(60, canvas.height - 80);
      ctx.lineTo(1140, canvas.height - 80);
      ctx.stroke();

      ctx.fillStyle = accentColor;
      ctx.font = "italic 16px 'Tiro Devanagari Sanskrit', serif, sans-serif";
      ctx.fillText("Tarka-Vidyā Digital Preservation Project", 60, canvas.height - 50);

      // Render tarkavidya.com as a visual hyperlink on the canvas
      ctx.fillStyle = "#0055BB";
      ctx.font = "bold italic 16px 'Inter', sans-serif";
      ctx.fillText("tarkavidya.com", canvas.width - 200, canvas.height - 50);
      const linkTextWidth = ctx.measureText("tarkavidya.com").width;
      ctx.strokeStyle = "#0055BB";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(canvas.width - 200, canvas.height - 46);
      ctx.lineTo(canvas.width - 200 + linkTextWidth, canvas.height - 46);
      ctx.stroke();

      // --- SAVE TO PDF ---
      const imgData = canvas.toDataURL("image/png");
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      const pageHeightMM = 297;
      const pageWidthMM = 210;
      const printWidthMM = 180; // A4 width is 210, so 15mm margins on each side
      const scale = printWidthMM / canvasWidth;
      const printHeightMM = canvas.height * scale;

      let heightLeft = printHeightMM;
      let position = 15; // top margin in mm

      doc.addImage(imgData, 'PNG', 15, position, printWidthMM, printHeightMM);
      heightLeft -= (pageHeightMM - 30); // 15mm top and 15mm bottom margins

      while (heightLeft >= 0) {
        position = heightLeft - printHeightMM + 15;
        doc.addPage();
        doc.addImage(imgData, 'PNG', 15, position, printWidthMM, printHeightMM);
        heightLeft -= (pageHeightMM - 30);
      }

      // Add clickable hyperlink annotation overlay on the last page at the exact coordinate of the link text
      const linkX = 15 + ((canvas.width - 200) * scale);
      const linkY = position + ((canvas.height - 65) * scale);
      const linkW = (linkTextWidth + 20) * scale;
      const linkH = 25 * scale;
      doc.link(linkX, linkY, linkW, linkH, { url: "https://tarkavidya.com" });

      doc.save("tarka_swadhyaya_session.pdf");
    } catch (error) {
      console.error("Failed to generate PDF with Canvas:", error);
    }
  };

  const getSectionsSourceForText = (textId: string): NyayaSection[] => {
    switch (textId) {
      case "tarka-sastram": return TARKASASTRAS_SECTIONS_RAW as NyayaSection[];
      case "tarka-samgraha": return TARKASAMGRAHA_SECTIONS_RAW as NyayaSection[];
      case "tarkabhasha": return TARKABHASHA_SECTIONS_RAW as NyayaSection[];
      case "laksana-sangraha": return LAKSANA_SECTIONS_RAW as NyayaSection[];
      case "vaiseasika-sutras": return VAISESHIKA_SECTIONS_RAW as NyayaSection[];
      case "padartha-dharmasamgraha": return PADARTHA_SECTIONS_RAW as NyayaSection[];
      case "karikavali":
      case "nyayasiddhantamuktavali": return KARIKAVALI_SECTIONS_RAW as NyayaSection[];
      case "anandagiri-tarkasangraha": return ANANDAGIRI_SECTIONS_RAW as NyayaSection[];
      case "vyomavati": return VYOMAVATI_SECTIONS_RAW as NyayaSection[];
      case "tattva-cintamani": return TATTVA_CINTAMANI_SECTIONS_RAW as NyayaSection[];
      default: return NYAYA_SECTIONS_RAW as NyayaSection[];
    }
  };

  const handleDownloadFullBookPDF = async () => {
    const selectedText = NYAYA_TEXTS.find(t => t.id === selectedTextId);
    if (!selectedText) return;
    setIsGeneratingPDF(true);
    setPdfProgress("Initializing document...");

    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      const canvas = document.createElement("canvas");
      canvas.width = 1200;
      canvas.height = 1600;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not create canvas context");

      let pageNum = 1;
      let yCursor = 150;

      const wrapText = (context: CanvasRenderingContext2D, text: string, maxWidth: number) => {
        const paragraphs = text.split("\n");
        const linesList: string[] = [];
        paragraphs.forEach(paragraph => {
          const words = paragraph.split(/\s+/);
          let currentLine = "";
          for (let i = 0; i < words.length; i++) {
            const word = words[i];
            const testLine = currentLine + (currentLine ? " " : "") + word;
            const metrics = context.measureText(testLine);
            if (metrics.width > maxWidth && i > 0) {
              linesList.push(currentLine);
              currentLine = word;
            } else {
              currentLine = testLine;
            }
          }
          if (currentLine) {
            linesList.push(currentLine);
          }
          linesList.push("");
        });
        if (linesList.length > 0 && linesList[linesList.length - 1] === "") {
          linesList.pop();
        }
        return linesList;
      };

      const startNewPage = () => {
        ctx.fillStyle = "#FAF8F5";
        ctx.fillRect(0, 0, 1200, 1600);
        
        ctx.strokeStyle = "#8C6239";
        ctx.lineWidth = 4;
        ctx.strokeRect(20, 20, 1160, 1560);
        ctx.lineWidth = 1;
        ctx.strokeRect(26, 26, 1148, 1548);
        
        ctx.fillStyle = "#8C6239";
        ctx.font = "bold 24px 'Inter', sans-serif";
        ctx.fillText(selectedText.title, 60, 65);
        
        ctx.fillStyle = "#3B2314";
        ctx.font = "italic 16px sans-serif";
        ctx.fillText("Academic Recension & Swādhyāya Digital Archive", 60, 95);
        
        ctx.strokeStyle = "rgba(140, 98, 57, 0.2)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(60, 115);
        ctx.lineTo(1140, 115);
        ctx.stroke();
        
        yCursor = 160;
      };

      const savePageAndCreateNew = (isLastPage = false) => {
        ctx.strokeStyle = "rgba(140, 98, 57, 0.2)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(60, 1510);
        ctx.lineTo(1140, 1510);
        ctx.stroke();
        
        ctx.fillStyle = "#8C6239";
        ctx.font = "italic 14px 'Tiro Devanagari Sanskrit', serif";
        ctx.fillText("Tarka-Vidyā Digital Preservation Project", 60, 1545);
        
        ctx.fillStyle = "#0055BB";
        ctx.font = "bold italic 14px 'Inter', sans-serif";
        ctx.fillText("tarkavidya.com", 900, 1545);
        
        ctx.fillStyle = "#3B2314";
        ctx.font = "bold 14px sans-serif";
        ctx.fillText(`Page ${pageNum}`, 1080, 1545);
        
        const imgData = canvas.toDataURL("image/png");
        if (pageNum > 1) {
          doc.addPage();
        }
        doc.addImage(imgData, 'PNG', 0, 0, 210, 297);
        
        pageNum++;
        if (!isLastPage) {
          startNewPage();
        }
      };

      // RENDER COVER PAGE
      setPdfProgress("Generating Cover Page...");
      ctx.fillStyle = "#FAF8F5";
      ctx.fillRect(0, 0, 1200, 1600);

      ctx.strokeStyle = "#8C6239";
      ctx.lineWidth = 6;
      ctx.strokeRect(30, 30, 1140, 1540);
      ctx.lineWidth = 1.5;
      ctx.strokeRect(40, 40, 1120, 1520);

      ctx.strokeStyle = "rgba(140, 98, 57, 0.4)";
      ctx.lineWidth = 2;
      ctx.strokeRect(60, 60, 1080, 1480);

      ctx.textAlign = "center";
      ctx.fillStyle = "#3B2314";
      ctx.font = "bold 56px 'Tiro Devanagari Sanskrit', serif";
      ctx.fillText(transliterate(selectedText.devanagariTitle, targetScript), 600, 350);

      ctx.font = "bold 38px 'Inter', sans-serif";
      ctx.fillText(selectedText.title, 600, 430);

      ctx.strokeStyle = "#8C6239";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(450, 520);
      ctx.lineTo(750, 520);
      ctx.stroke();

      ctx.font = "bold 24px 'Inter', sans-serif";
      ctx.fillStyle = "#8C6239";
      ctx.fillText(`प्रणेता / Author: ${selectedText.author}`, 600, 600);
      ctx.fillText(`दर्शनम् / School: ${selectedText.school}`, 600, 650);
      ctx.fillText(`कालः / Period: ${selectedText.century}`, 600, 700);

      ctx.font = "italic 20px 'Noto Serif', serif";
      ctx.fillStyle = "#555555";
      const wrappedDesc = wrapText(ctx, selectedText.description, 800);
      let descY = 820;
      wrappedDesc.forEach(line => {
        if (line) {
          ctx.fillText(line, 600, descY);
        }
        descY += 32;
      });

      ctx.font = "bold 18px 'Inter', sans-serif";
      ctx.fillStyle = "#3B2314";
      ctx.fillText("TARKA-VIDYĀ DIGITAL SWĀDHYĀYA PROJECT", 600, 1350);
      ctx.font = "16px monospace";
      ctx.fillText("Academic Preservation Initiative", 600, 1395);
      ctx.fillText(`Generated on: ${new Date().toLocaleDateString()}`, 600, 1435);

      ctx.textAlign = "left";
      savePageAndCreateNew(false);

      const sectionsSource = getSectionsSourceForText(selectedText.id);

      // Now process sections sequentially
      for (let i = 0; i < sectionsSource.length; i++) {
        const sec = sectionsSource[i];
        setPdfProgress(`Processing Section ${i + 1} of ${sectionsSource.length}: ${sec.titleEnglish}...`);
        await new Promise(resolve => setTimeout(resolve, 100)); // Non-blocking yield to main thread

        if (yCursor + 150 > 1450) {
          savePageAndCreateNew(false);
        }

        ctx.fillStyle = "rgba(140, 98, 57, 0.08)";
        ctx.fillRect(60, yCursor, 1080, 80);
        
        ctx.strokeStyle = "#8C6239";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(60, yCursor, 1080, 80);
        
        ctx.fillStyle = "#3B2314";
        ctx.font = "bold 24px 'Tiro Devanagari Sanskrit', serif";
        const secTitle = `${transliterate(sec.titleDevanagari, targetScript)} - ${sec.titleEnglish}`;
        ctx.fillText(secTitle, 80, yCursor + 48);
        
        yCursor += 120;

        for (const sutra of sec.sutras) {
          const sutraNumText = `Sūtra ${sutra.sutraNum}: ${sutra.heading}`;
          const devaline = transliterate(sutra.devanagari, targetScript);
          const transText = sutra.translations["english"] || "";
          const commText = (sutra.commentary && sutra.commentary["english"]) || "";

          ctx.font = "bold 20px 'Inter', sans-serif";
          const wrappedHeader = wrapText(ctx, sutraNumText, 1080);
          
          ctx.font = "bold 28px 'Tiro Devanagari Sanskrit', serif";
          const wrappedSanskrit = wrapText(ctx, devaline, 1080);
          
          ctx.font = "italic 20px 'Noto Serif', serif";
          const wrappedTrans = wrapText(ctx, transText ? `Translation: ${transText}` : "", 1080);
          
          ctx.font = "20px 'Noto Serif', serif";
          const wrappedComm = wrapText(ctx, commText ? `Commentary: ${commText}` : "", 1080);

          let blockHeight = 0;
          blockHeight += wrappedHeader.length * 28;
          blockHeight += wrappedSanskrit.length * 38;
          if (transText) blockHeight += wrappedTrans.length * 28;
          if (commText) blockHeight += wrappedComm.length * 28;
          blockHeight += 50;

          if (yCursor + blockHeight > 1450) {
            savePageAndCreateNew(false);
          }

          ctx.fillStyle = "#8C6239";
          ctx.font = "bold 20px 'Inter', sans-serif";
          wrappedHeader.forEach(line => {
            if (line) {
              ctx.fillText(line, 60, yCursor);
            }
            yCursor += 28;
          });
          yCursor += 8;

          ctx.fillStyle = "#1A1A1A";
          ctx.font = "bold 28px 'Tiro Devanagari Sanskrit', serif";
          wrappedSanskrit.forEach(line => {
            if (line) {
              ctx.fillText(line, 60, yCursor);
            }
            yCursor += 38;
          });
          yCursor += 12;

          if (transText) {
            ctx.fillStyle = "#555555";
            ctx.font = "italic 20px 'Noto Serif', serif";
            wrappedTrans.forEach(line => {
              if (line) {
                ctx.fillText(line, 60, yCursor);
              }
              yCursor += 28;
            });
            yCursor += 12;
          }

          if (commText) {
            ctx.fillStyle = "#222222";
            ctx.font = "20px 'Noto Serif', serif";
            wrappedComm.forEach(line => {
              if (line) {
                ctx.fillText(line, 60, yCursor);
              }
              yCursor += 28;
            });
            yCursor += 12;
          }

          ctx.strokeStyle = "rgba(140, 98, 57, 0.1)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(60, yCursor);
          ctx.lineTo(1140, yCursor);
          ctx.stroke();

          yCursor += 30;
        }
      }

      savePageAndCreateNew(true);
      setPdfProgress("Finalizing document...");
      doc.save(`${selectedText.id}_full_recension.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setIsGeneratingPDF(false);
      setPdfProgress("");
    }
  };

  const handleLoadToCuration = (text: string) => {
    setCurationLoadText(text);
    setActiveTab("curate");
  };

  const handleLoadToTranslation = (text: string) => {
    setTranslationLoadText(text);
    setActiveTab("translate");
  };

  // Primary categories matching "In the upper part there will be three button such as - ग्रन्थाः and सूत्रपाठः and all."
  const menuItems = [
    {
      id: "home" as ActiveTab,
      label: "Swādhyāya Home",
      sanskrit: "मङ्गलाचरणम्",
      subtitle: "Sacred lineage invocation",
      icon: Home,
    },
    {
      id: "overview" as ActiveTab,
      label: "Overview Map",
      sanskrit: "प्रवेशिका",
      subtitle: "Introduction & tradition flows",
      icon: Compass,
    },
    {
      id: "library" as ActiveTab,
      label: "Granthas List",
      sanskrit: "ग्रन्थाः",
      subtitle: "Treatises library & core categories",
      icon: Layers,
    },
    {
      id: "search" as ActiveTab,
      label: "Sarvanusadhana Mandapam",
      sanskrit: "सर्वानुसन्धानमण्डपम्",
      subtitle: "Universal corpus & glossary search",
      icon: Search,
    },
    {
      id: "resources" as ActiveTab,
      label: "Sādhanā Resources",
      sanskrit: "वीडियो व्याख्यानानि",
      subtitle: "Traditional video lecture series",
      icon: Tv,
    },
    {
      id: "kosa" as ActiveTab,
      label: "Lexicon Glossary",
      sanskrit: "कोषः",
      subtitle: "Nyāya term derivations",
      icon: Book,
    },
    {
      id: "translate" as ActiveTab,
      label: "Pañcanaya-Samanvaya",
      sanskrit: "पञ्चनयसमन्वयः",
      subtitle: "Translation exegesis",
      icon: BookOpen,
    },
    {
      id: "curate" as ActiveTab,
      label: "Akṣaradīpa",
      sanskrit: "अक्षरदीपः",
      subtitle: "Palm leaf text editor",
      icon: Cpu,
    },
    {
      id: "dialectics" as ActiveTab,
      label: "Vāda Arena",
      sanskrit: "वादतर्कविद्या",
      subtitle: "Syllogistic assembly chat",
      icon: Grid,
    },
    {
      id: "ai-chat" as ActiveTab,
      label: "Tarka Vidyā AI",
      sanskrit: "तर्कविद्या",
      subtitle: "Indian logic expert companion",
      icon: Sparkles,
    },
    {
      id: "feedback" as ActiveTab,
      label: "Maildesk",
      sanskrit: "लेखालयः",
      subtitle: "Suggestions & typos",
      icon: Mail,
    },
    {
      id: "about" as ActiveTab,
      label: "Asmatkathā",
      sanskrit: "अस्माकं कथा",
      subtitle: "About us & mission",
      icon: Users,
    },
  ];

  return (
    <div className={`min-h-screen bg-[#ECE0D1] text-[#1A1A1A] flex flex-col ${getScriptFontClass(targetScript)}`} id="app-root-container">
      
      {/* Top Academic Subheader Nav */}
      <header className="bg-[#3B2314] border-b-2 border-[#1A1A1A] py-4.5 px-6 shrink-0 flex items-center justify-between text-white shadow-none">
        
        {/* Title branding with dual script configuration dynamically translated */}
        <div 
          onClick={() => setActiveTab("home")}
          id="tarka-vidya-logo-home"
          className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition-all select-none"
          title="Swādhyāya Home"
        >
          <div className="bg-[#8C6239] text-white p-1 rounded-none border-2 border-white flex items-center justify-center w-11 h-11 shadow-xs">
            <DiyaLogoIcon className="w-9 h-9 text-[#FAF8F5] animate-blink" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <h1 className="text-lg md:text-xl font-serif tracking-tight font-black uppercase leading-none text-[#FAF8F5]">
                {formatSanskrit("तर्कविद्या", "Tarka-Vidyā", scriptTheme, targetScript)}
              </h1>
            </div>
            <p className="text-[10px] text-stone-300 font-sans font-bold uppercase tracking-widest mt-1">
              Traditional Nyāya-Vaiśeṣika Episteme Digitization
            </p>
          </div>
        </div>

        {/* System controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              const selection = window.getSelection();
              let textToEnhance = "";
              if (selection && !selection.isCollapsed) {
                textToEnhance = selection.toString().trim();
              }
              
              if (!textToEnhance) {
                // Determine content based on activeTab
                switch (activeTab) {
                  case "home": {
                    textToEnhance = `मङ्गलाचरणम् — Opening Invocation\n\n॥  ॐ कणादगौतमादिभ्यस्तर्कविद्यासम्प्रदायकर्तृभ्यो वंशऋषिभ्यो नमो महद्भ्यो नमो गुरुभ्यः॥\n\n[Translation]: Om. Salutations to the great sages, beginning with Kaṇāda and Gautama, who are the founders of the tradition of Tarka-Vidyā (the science of logic and reasoning), the lineage of seers. Salutations to the great teachers, salutations to our gurus.\n\n[Commentary]: This sacred Mangalacharanam (opening invocation) pays homage to Sage Kaṇāda (compiler of the Vaiśeṣika Sūtras) and Sage Gautama (compiler of the Nyāya Sūtras). Together, these dual traditions form the bedrock of Indian logical realism and epistemology, paving the path of intellectual discernment.`;
                    break;
                  }
                  case "overview": {
                    const headerText = document.querySelector('#tradition-map-portal h3')?.textContent?.trim();
                    const englishTitle = document.querySelector('#tradition-map-portal span.text-\\[10px\\]')?.textContent?.trim();
                    const description = document.querySelector('#tradition-map-portal .text-stone-700, #tradition-map-portal p.text-stone-700')?.textContent?.trim();
                    const pramanas = document.querySelector('#tradition-map-portal .text-stone-800, #tradition-map-portal p.text-stone-800')?.textContent?.trim();
                    const founder = document.querySelector('#tradition-map-portal strong')?.textContent?.trim();

                    if (headerText) {
                      textToEnhance = `${headerText} ${englishTitle ? `(${englishTitle})` : ""}\n\n`;
                      if (founder) {
                        textToEnhance += `Foundational Acārya: ${founder}\n\n`;
                      }
                      if (pramanas) {
                        textToEnhance += `Accepted Pramāṇas: ${pramanas}\n\n`;
                      }
                      if (description) {
                        textToEnhance += `[Commentary]: ${description}`;
                      }
                    } else {
                      // Fallback to searching common elements in tradition map
                      const activeSchoolCard = document.querySelector('.school-details-card, .bg-white.border-2.border-\\[\\#1A1A1A\\]');
                      if (activeSchoolCard) {
                        textToEnhance = activeSchoolCard.textContent?.trim() || "";
                      } else {
                        textToEnhance = `Scholastic Tradition Map\n\nIndian Philosophical Systems: The vast ocean of Indian critical inquiry, centering on epistemology (Pramāṇa-śāstra), metaphysics (Prameya), and logic (Tarka). Divided fundamentally by attitude towards Vedic epistemic authority.`;
                      }
                    }
                    break;
                  }
                  case "library": {
                    const activeCard = document.querySelector('.active-sutra-card, [data-active-sutra="true"]');
                    const anyCard = activeCard || document.querySelector('[id^="sutra-card-"], .sutra-card');
                    
                    if (anyCard) {
                      const sNumEl = anyCard.querySelector('.font-mono');
                      const headingEl = anyCard.querySelector('.font-serif.text-xs, .font-serif.text-sm');
                      const devanagariEl = anyCard.querySelector('h3');
                      const transEl = anyCard.querySelector('.font-sans.text-xs, .font-sans.text-sm, .font-sans.text-base');
                      
                      const sNum = sNumEl ? sNumEl.textContent?.trim() : "";
                      const heading = headingEl ? headingEl.textContent?.trim() : "";
                      const devanagari = devanagariEl ? devanagariEl.textContent?.trim() : "";
                      const translation = transEl ? transEl.textContent?.trim() : "";
                      
                      if (devanagari) {
                        textToEnhance = `${sNum ? sNum + ": " : ""}${heading ? heading : ""}\n\n${devanagari}`;
                        if (translation) {
                          textToEnhance += `\n\n[Translation]: ${translation}`;
                        }
                        const commEl = anyCard.querySelector('.italic.leading-relaxed');
                        if (commEl) {
                          textToEnhance += `\n\n[Commentary]: ${commEl.textContent?.trim()}`;
                        }
                      } else {
                        textToEnhance = anyCard.textContent?.trim() || "";
                      }
                    } else {
                      // Fallback to currently selected text metadata in the sidebar/pane
                      const titleEl = document.querySelector('h2.font-serif, .book-details-title');
                      const descEl = document.querySelector('p.text-stone-605, p.text-stone-600, .text-stone-600, .book-details-desc');
                      if (titleEl) {
                        textToEnhance = `${titleEl.textContent?.trim()}\n\n[Commentary]: ${descEl?.textContent?.trim() || ""}`;
                      } else {
                        textToEnhance = `Tarkasaṃgrahaḥ with Dīpikā Commentary\n\nThe standard primer of Nyāya-Vaiśeṣika logic, providing a comprehensive taxonomy of the seven padārthas (categories) and four pramāṇas (instruments of valid knowledge). Select a chapter from the directory to read.`;
                      }
                    }
                    break;
                  }
                  case "curate": {
                    const textarea = document.querySelector('textarea') as HTMLTextAreaElement | null;
                    const curationResult = document.querySelector('.curation-result, .corrected-text-container, .bg-emerald-50\\/30')?.textContent?.trim();
                    
                    if (curationResult) {
                      textToEnhance = curationResult;
                    } else if (textarea && textarea.value.trim()) {
                      textToEnhance = textarea.value.trim();
                    } else {
                      textToEnhance = "Curate & Correct Manuscripts\n\nInput raw Sanskrit manuscript text here to correct errors, perform word-splitting (padaccheda), and analyze syntactic relations.";
                    }
                    break;
                  }
                  case "translate": {
                    const textarea = document.querySelector('textarea') as HTMLTextAreaElement | null;
                    const transCard = document.querySelector('.translation-output, blockquote, .translate-result-panel, .border-emerald-800');
                    
                    if (transCard) {
                      textToEnhance = transCard.textContent?.trim() || "";
                    } else if (textarea && textarea.value.trim()) {
                      textToEnhance = textarea.value.trim();
                    } else {
                      textToEnhance = "Anuvāda (अनुवादः) — Scholastic Translation Portal\n\nInput raw Sanskrit sutras or verses to receive direct, literal word-by-word translation, grammatical analysis, and logical exegesis.";
                    }
                    break;
                  }
                  case "dialectics": {
                    const textarea = document.querySelector('textarea') as HTMLTextAreaElement | null;
                    const analysisResult = document.querySelector('.analysis-result, .dialectics-result, .p-6.rounded-none.bg-white')?.textContent?.trim();
                    const activeChatMsg = document.querySelector('.chat-message-bubble, .message-bubble')?.textContent?.trim();
                    
                    if (analysisResult) {
                      textToEnhance = analysisResult;
                    } else if (activeChatMsg) {
                      textToEnhance = activeChatMsg;
                    } else if (textarea && textarea.value.trim()) {
                      textToEnhance = textarea.value.trim();
                    } else {
                      textToEnhance = "Vāda-Vidyā (वादविद्या) — Dialectical Arena\n\nEnter the Sabhā (assembly) to analyze logical claims or debate with philosophical opponents (such as Dignāga). If an argument has been analyzed, it will be loaded here.";
                    }
                    break;
                  }
                  case "kosa": {
                    const termTitle = document.querySelector('#kosa-dictionary-module h3')?.textContent?.trim() || "";
                    const category = document.querySelector('#kosa-dictionary-module .text-base.font-black, #kosa-dictionary-module .font-serif.text-base')?.textContent?.trim() || "";
                    const definition = document.querySelector('#kosa-dictionary-module .border-l-4, #kosa-dictionary-module .text-stone-800.text-sm')?.textContent?.trim() || "";
                    const sansQuote = document.querySelector('#kosa-dictionary-module .bg-\\#F2FAF4 p, #kosa-dictionary-module .text-emerald-900 + p')?.textContent?.trim() || "";
                    const exegesis = document.querySelector('#kosa-dictionary-module .space-y-1\\.5 p, #kosa-dictionary-module .text-stone-700')?.textContent?.trim() || "";
                    
                    if (termTitle) {
                      textToEnhance = `${termTitle} (${category})\n\n`;
                      if (definition) {
                        textToEnhance += `Definition: ${definition}\n\n`;
                      }
                      if (sansQuote) {
                        textToEnhance += `Lakaṣaṇa-vākya: ${sansQuote}\n\n`;
                      }
                      if (exegesis) {
                        textToEnhance += `[Commentary]: ${exegesis}`;
                      }
                    } else {
                      textToEnhance = "Tarka-Vidyā Kośa (तर्कविद्या-कोषः)\n\nClassical Nyāya-Vaiśeṣika Lexicon. Explore core epistemological categories, ontological definitions, and key logical principles.";
                    }
                    break;
                  }
                  case "about": {
                    const mission = document.querySelector('#asmatkatha-module p.text-stone-700')?.textContent?.trim() || "";
                    const genesis = document.querySelector('#asmatkatha-module .lg\\:col-span-7 .text-justify')?.textContent?.trim() || "";
                    
                    if (mission) {
                      textToEnhance = `अस्मत्कथा — Editorial Chronicle\n\nOur Mission:\n${mission}\n\n[Commentary]: ${genesis || "Sowing the seeds of the Bengal debate lineage through digital preservation and scholastic access."}`;
                    } else {
                      textToEnhance = "अस्मत्कथा — About Us & Mission\n\ntarkavidya.com is an accessible and scholarly digital repository dedicated to the Indian philosophical tradition of Tarka-Vidyā—the science of reasoning, debate, and cognition.";
                    }
                    break;
                  }
                  default: {
                    textToEnhance = "॥  ॐ कणादगौतमादिभ्यस्तर्कविद्यासम्प्रदायकर्तृभ्यो वंशऋषिभ्यो नमो महद्भ्यो नमो गुरुभ्यः॥";
                    break;
                  }
                }
              }
              
              setSelectedTextExcerpt(textToEnhance);
              setSpotlightScript(targetScript);
              setIsSpotlightOpen(true);
            }}
            className="flex items-center gap-1.5 text-xs text-[#ECE0D1] bg-[#8C6239] hover:bg-[#FAF8F5] hover:text-[#3B2314] border-2 border-white px-4 py-2 font-bold uppercase tracking-wide transition-all rounded-none cursor-pointer"
            title="Reader Activation Mode: Launch reader for current active text or selection"
          >
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>Reader Mode</span>
          </button>

          {/* Offline/Online Badge */}
          <div className={`hidden md:flex items-center gap-1.5 text-[10px] font-sans font-bold border-2 px-3 py-2 uppercase tracking-wider transition-all rounded-none ${
            isOnline ? "border-emerald-500/40 text-emerald-400 bg-emerald-500/10" : "border-amber-500/40 text-amber-400 bg-amber-500/10 animate-pulse"
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? "bg-emerald-400" : "bg-amber-400 animate-ping"}`} />
            <span>{isOnline ? "Synced" : "Fully Offline"}</span>
          </div>

          <button
            onClick={() => setShowWelcomeModal(true)}
            className="flex items-center gap-1.5 text-xs text-white hover:bg-white hover:text-[#3B2314] border-2 border-white px-4 py-2 font-bold uppercase tracking-wide transition-all rounded-none bg-transparent cursor-pointer"
          >
            <Info className="w-3.5 h-3.5 text-white" />
            <span>{formatSanskrit("निर्देशिका", "Guide", scriptTheme, targetScript)}</span>
          </button>
        </div>
      </header>

      {/* Top Academic Quick-Links / Navigation bar */}
      <div className="bg-[#F5F2EA] border-b-2 border-[#1A1A1A] px-4 md:px-6 py-2.5 flex items-center justify-between gap-4 overflow-visible shrink-0 select-none sticky top-0 z-40 shadow-md">
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          {/* Toggle sidebar button */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="px-2.5 py-1.5 bg-white border border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-all text-xs font-bold flex items-center gap-1.5 shadow-none rounded-none cursor-pointer"
            title={sidebarCollapsed ? "Expand Scholastic Settings & Index" : "Collapse Scholastic Settings & Index"}
          >
            {sidebarCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">Index & Settings</span>
          </button>
        </div>

        {/* Scrollable horizontal navigation of main portals */}
        <div className="flex-1 flex items-center gap-1.5 md:gap-2.5 overflow-x-auto custom-scrollbar py-0.5 max-w-full">
          {menuItems.filter(item => ["home", "overview", "library", "search", "ai-chat"].includes(item.id)).map((item) => {
            const isSelected = activeTab === item.id;
            const IconComponent = item.icon;
            const isSearch = item.id === "search";
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-1 text-xs font-black uppercase tracking-wider rounded-none flex items-center gap-2 border-2 transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
                    : isSearch
                    ? "bg-[#FFF9E6] text-[#8C6239] border-[#8C6239] hover:bg-[#8C6239] hover:text-white font-extrabold ring-1 ring-[#8C6239]/30"
                    : "bg-white text-[#1A1A1A] border-stone-300 hover:border-[#1A1A1A]"
                }`}
              >
                <IconComponent className="w-3.5 h-3.5 shrink-0" />
                <div className="flex flex-col items-start text-left leading-tight py-0.5">
                  <span className="font-sans font-black text-[11px]">{item.label}</span>
                  <span className="text-xs opacity-90 font-serif font-black tracking-wide normal-case mt-0.5">
                    {transliterate(item.sanskrit, targetScript)}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* All other portals in a dropdown menu */}
        {(() => {
          const dropdownItems = menuItems.filter(item => !["home", "overview", "library", "search", "ai-chat"].includes(item.id));
          const activeDropdownItem = dropdownItems.find(item => item.id === activeTab);
          const isDropdownActive = !!activeDropdownItem;
          
          return (
            <div ref={dropdownRef} className="relative inline-block text-left shrink-0 z-50">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`px-3 py-1 text-xs font-black uppercase tracking-wider rounded-none flex items-center gap-1.5 border-2 transition-all cursor-pointer whitespace-nowrap ${
                  isDropdownActive
                    ? "bg-[#8C6239] text-white border-[#8C6239]"
                    : "bg-white text-[#1A1A1A] border-stone-300 hover:border-[#1A1A1A]"
                }`}
              >
                <div className="flex flex-col items-start text-left leading-tight py-0.5">
                  {isDropdownActive ? (
                    <>
                      <span className="font-sans font-black text-[11px]">{activeDropdownItem.label}</span>
                      <span className="text-xs opacity-90 font-serif font-black tracking-wide normal-case mt-0.5">
                        {transliterate(activeDropdownItem.sanskrit, targetScript)}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="font-sans font-black text-[11px]">More Portals</span>
                      <span className="text-xs opacity-90 font-serif font-black tracking-wide normal-case mt-0.5">
                        {transliterate("अधिकानि विद्यास्थानानि", targetScript)}
                      </span>
                    </>
                  )}
                </div>
                <ChevronDown className="w-3.5 h-3.5 shrink-0" />
              </button>
              
              {dropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-64 bg-white border-2 border-[#1A1A1A] shadow-2xl rounded-none z-[100] divide-y divide-stone-200">
                  <div className="divide-y divide-stone-200">
                    {dropdownItems.map((item) => {
                      const isSelected = activeTab === item.id;
                      const IconComponent = item.icon;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveTab(item.id);
                            setDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center justify-between transition-all hover:bg-[#F5F2EA] cursor-pointer ${
                            isSelected ? "bg-[#1A1A1A] text-white" : "text-[#1A1A1A]"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <IconComponent className="w-3.5 h-3.5 shrink-0" />
                            <span>{item.label}</span>
                          </div>
                          <span className="text-xs opacity-90 font-serif font-black">
                            {transliterate(item.sanskrit, targetScript)}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* External Portals Section */}
                  <div className="bg-stone-50 border-t border-stone-200 divide-y divide-stone-200">
                    <div className="px-4 py-2 text-[8px] font-black uppercase text-stone-500 tracking-wider bg-stone-100">
                      External Portals / बाह्य-विद्यास्थानानि
                    </div>
                    
                    <a
                      href="https://rasasarani.in"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setDropdownOpen(false)}
                      className="w-full text-left px-4 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center justify-between transition-all hover:bg-[#F5F2EA] cursor-pointer text-[#8C6239]"
                    >
                      <div className="flex items-center gap-2">
                        <ExternalLink className="w-3.5 h-3.5 shrink-0 text-[#8C6239]" />
                        <span>Indian Aesthetics</span>
                      </div>
                      <span className="text-xs opacity-90 font-serif font-black text-[#8C6239]">
                        {transliterate("रससारणी", targetScript)}
                      </span>
                    </a>

                    <a
                      href="https://vedantatattvam.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setDropdownOpen(false)}
                      className="w-full text-left px-4 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center justify-between transition-all hover:bg-[#F5F2EA] cursor-pointer text-[#8C6239]"
                    >
                      <div className="flex items-center gap-2">
                        <ExternalLink className="w-3.5 h-3.5 shrink-0 text-[#8C6239]" />
                        <span>Vedantic Tradition</span>
                      </div>
                      <span className="text-xs opacity-90 font-serif font-black text-[#8C6239]">
                        {transliterate("वेदान्ततत्त्वम्", targetScript)}
                      </span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {/* Main Workspace Academic Share Action Suite (WhatsApp, X, Facebook, Copy Link) */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 pl-2 border-l-2 border-stone-300">
          {/* WhatsApp Share */}
          <button
            onClick={() => handleDirectSocialShare("whatsapp")}
            className="w-8 h-8 flex items-center justify-center bg-[#25D366]/10 text-[#128C7E] hover:bg-[#25D366] hover:text-white border border-[#25D366]/40 transition-all rounded-none cursor-pointer"
            title="Share current academic insight on WhatsApp"
            aria-label="Share on WhatsApp"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
            </svg>
          </button>

          {/* Facebook Share */}
          <button
            onClick={() => handleDirectSocialShare("facebook")}
            className="w-8 h-8 flex items-center justify-center bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2] hover:text-white border border-[#1877F2]/40 transition-all rounded-none cursor-pointer"
            title="Share on Facebook"
            aria-label="Share on Facebook"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </button>

          {/* X / Twitter Share */}
          <button
            onClick={() => handleDirectSocialShare("twitter")}
            className="w-8 h-8 flex items-center justify-center bg-black/10 text-stone-900 hover:bg-black hover:text-white border border-stone-400 transition-all rounded-none cursor-pointer"
            title="Share on X (Twitter)"
            aria-label="Share on X"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </button>

          {/* Copy Link */}
          <button
            onClick={() => handleDirectSocialShare("copy")}
            className={`w-8 h-8 flex items-center justify-center border transition-all rounded-none cursor-pointer ${
              quickCopied
                ? "bg-emerald-700 text-white border-emerald-800"
                : "bg-white text-stone-800 hover:bg-[#8C6239] hover:text-white border-stone-400"
            }`}
            title={quickCopied ? "Academic Verse Copied!" : "Copy Verse & Link to Clipboard"}
            aria-label="Copy Link"
          >
            {quickCopied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {/* Full Academic Share Dialog Trigger */}
          <button
            onClick={handleOpenWorkspaceShare}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold uppercase tracking-wider bg-[#8C6239] text-white hover:bg-[#3B2314] transition-all cursor-pointer border border-[#8C6239] rounded-none shadow-xs ml-1"
            title="Open comprehensive Academic Verse & Insight Share Dialog"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="text-[10px]">Share</span>
          </button>
        </div>
      </div>

      {/* Auspicious Scholastic Invocation Benediction Block (मङ्गलाचरणम्) */}
      {activeTab !== "home" && (
        <div className={`px-6 py-4.5 bg-[#FAF8F5] border-b border-stone-250 flex flex-col items-center justify-center text-center text-xs gap-3 ${getScriptFontClass(targetScript)}`}>
          <div className="flex flex-col items-center gap-1.5 w-full">
            <span className="font-extrabold text-[#3B2314] tracking-wider uppercase text-[9px] font-sans">मङ्गलाचरणम् | Benediction</span>
            <p className="text-[#3B2314] italic text-[14px] font-bold leading-relaxed block text-center max-w-2xl">
              {transliterate("॥  ॐ कणादगौतमादिभ्यस्तर्कविद्यासम्प्रदायकर्तृभ्यो वंशऋषिभ्यो नमो महद्भ्यो नमो गुरुभ्यः॥", targetScript)}
            </p>
          </div>
        </div>
      )}

      {/* Main workspace frame: Sidebar layout */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0 bg-[#ECE0D1] relative">
        
        {/* Left Side Navigation (Tarka-Vidya Specialized) */}
        {!sidebarCollapsed && (
          <aside className="md:w-[325px] bg-[#ECE0D1] border-r-2 border-[#1A1A1A] shrink-0 flex flex-col p-4 gap-5 md:sticky md:top-[52px] md:h-[calc(100vh-52px)] overflow-y-auto custom-scrollbar select-none shadow-none rounded-none relative">
            
            {/* Collapse Close Arrow in Sidebar block */}
            <div className="flex items-center justify-between border-b-2 border-[#1A1A1A]/20 pb-2 mb-1">
              <span className="text-[10px] font-black uppercase text-[#8C6239] tracking-widest font-sans">
                Scholastic Settings
              </span>
              <button
                onClick={() => setSidebarCollapsed(true)}
                className="p-1 hover:bg-[#1A1A1A] hover:text-white border border-[#1A1A1A] rounded-none bg-white transition-all cursor-pointer flex items-center justify-center shrink-0"
                title="Collapse Sidebar"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
            </div>
            
            {/* Section: Script theme controls */}
          <div className="bg-white border-2 border-[#1A1A1A] p-3.5 space-y-3 font-sans">
            <div className="flex items-center gap-1.5 text-[10px] font-black text-[#795548] uppercase tracking-wider">
              <Languages className="w-3.5 h-3.5" />
              <span>लेखन-संस्कारः | Script Engine</span>
            </div>
            
            {/* Theme selector: Devanagari, Gregorian, Combined */}
            <div className="grid grid-cols-3 gap-1.5 text-[9px] font-bold">
              <button
                onClick={() => setScriptTheme("devanagari")}
                className={`py-1.5 text-center border-2 rounded-none transition-all cursor-pointer ${
                  scriptTheme === "devanagari" 
                    ? "bg-[#1A1A1A] text-white border-[#1A1A1A]" 
                    : "bg-white text-[#1A1A1A] border-stone-300 hover:border-[#1A1A1A]"
                }`}
                title="Sanskrit Devanagari rendering"
              >
                देवनागरी
              </button>
              <button
                onClick={() => setScriptTheme("gregorian")}
                className={`py-1.5 text-center border-2 rounded-none transition-all cursor-pointer ${
                  scriptTheme === "gregorian" 
                    ? "bg-[#1A1A1A] text-white border-[#1A1A1A]" 
                    : "bg-white text-[#1A1A1A] border-stone-300 hover:border-[#1A1A1A]"
                }`}
                title="Gregorian Romanized English IAST rendering"
              >
                IAST
              </button>
              <button
                onClick={() => setScriptTheme("combined")}
                className={`py-1.5 text-center border-2 rounded-none transition-all cursor-pointer ${
                  scriptTheme === "combined" 
                    ? "bg-[#1A1A1A] text-white border-[#1A1A1A]" 
                    : "bg-white text-[#1A1A1A] border-stone-300 hover:border-[#1A1A1A]"
                }`}
                title="Both scripts side-by-side"
              >
                द्विभाषी
              </button>
            </div>

            {/* Target Indian regional alphabet selector (from list of 22 major scripts) */}
            <div className="space-y-1">
              <label className="text-[8px] font-black text-stone-500 uppercase block tracking-wider">
                Multi-Script Translator (Sanskrit Headings):
              </label>
              <select
                value={targetScript}
                onChange={(e) => setTargetScript(e.target.value)}
                className="w-full bg-white text-[#1A1A1A] text-[10px] font-bold uppercase border-2 border-[#1A1A1A] rounded-none py-1.5 px-2 focus:outline-none"
              >
                {Object.entries(SCRIPT_NAMES).map(([key, name]) => (
                  <option key={key} value={key}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Section: Main Portals menu switches */}
          <div className="space-y-2">
            <h2 className="text-[10px] font-black text-[#3B2314] uppercase tracking-widest px-2.5 pb-1 border-b border-stone-300 font-sans">
              विद्यास्थान-प्रवेशः | Portals
            </h2>
            <nav className="space-y-2" aria-label="Main Navigation">
              {menuItems.map((item) => {
                const isSelected = activeTab === item.id;
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                    }}
                    className={`w-full text-left p-2.5 rounded-none classy-transition flex items-start gap-3 border-2 cursor-pointer cool-3d-gently ${
                      isSelected
                        ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
                        : "bg-white text-[#1A1A1A] border-stone-300 hover:border-[#1A1A1A] hover:bg-[#F5F2EA]"
                    }`}
                  >
                    <div
                      className={`p-1.5 rounded-none shrink-0 flex items-center justify-center border transition-all ${
                        isSelected ? "bg-[#795548] text-white border-white" : "bg-[#F5F2EA] text-[#1A1A1A] border-stone-300"
                      }`}
                    >
                      <IconComponent className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`text-[10px] font-black uppercase tracking-wide ${isSelected ? "text-white" : "text-[#1A1A1A]"}`}>
                          {item.label}
                        </span>
                        <span className={`text-[9px] font-serif font-black ${isSelected ? "text-[#FFF]" : "text-[#795548]"}`}>
                          ({transliterate(item.sanskrit, targetScript)})
                        </span>
                      </div>
                      <p className={`text-[9px] leading-tight mt-0.5 ${isSelected ? "text-stone-300" : "text-stone-605"}`}>
                        {item.subtitle}
                      </p>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Section: Independent Treatises Index (like Ashtadhyayi.com) */}
          <div className="space-y-2">
            <h2 className="text-[10px] font-black text-[#3B2314] uppercase tracking-widest px-2.5 pb-1 border-b border-stone-300 font-sans">
              ग्रन्थ-प्रवेशद्वारम् | Direct Texts Index
            </h2>
            <div className="bg-white border-2 border-[#1A1A1A] p-2 space-y-1 max-h-[180px] overflow-y-auto custom-scrollbar">
              {NYAYA_TEXTS.map((txt) => {
                const isSelected = selectedTextId === txt.id && activeTab === "library";
                return (
                  <button
                    key={txt.id}
                    onClick={() => {
                      setSelectedTextId(txt.id);
                      setActiveTab("library");
                    }}
                    className={`w-full text-left text-[10px] px-2.5 py-1.5 rounded-none classy-transition flex items-center justify-between border cursor-pointer ${
                      isSelected
                        ? "bg-[#795548] text-white border-[#795548]"
                        : "bg-white text-[#1A1A1A] border-stone-302 hover:bg-[#F5F2EA]"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-ellipsis overflow-hidden whitespace-nowrap">
                      <span className={`w-1 h-3 shrink-0 ${isSelected ? "bg-white" : "bg-[#795548]"}`}></span>
                      <strong className="font-serif">
                        {transliterate(txt.devanagariTitle, targetScript)}
                      </strong>
                      <span className="text-stone-400 font-sans text-[8px]">({txt.title})</span>
                    </div>
                    <ChevronRight className={`w-2.5 h-2.5 ${isSelected ? "text-white" : "text-stone-400"}`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Lineages Info card at foot of menu panel */}
          <div className="bg-[#F5F2EA] rounded-none p-3.5 border-2 border-[#1A1A1A] font-sans space-y-1.5 mt-auto classy-transition">
            <div className="flex items-center gap-1 text-[9px] font-black text-[#1A1A1A] uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5 text-[#795548]" />
              <span>Sabhā Protocol (सभानियमः)</span>
            </div>
            <p className="text-[8.5px] text-stone-705 leading-relaxed">
              Arguments entered into Tarka-Vidyā are evaluated under the strict logical guidelines of Sage Gautama’s <span className="font-serif italic font-semibold">Nyāyasūtra</span>. Verify assertions to avoid logical fallacy (<span className="italic font-semibold">Savyabhicāra</span>).
            </p>
          </div>
        </aside>
        )}

        {sidebarCollapsed && (
          <button
            onClick={() => setSidebarCollapsed(false)}
            className="absolute left-0 top-[150px] z-20 bg-[#ECE0D1] hover:bg-[#8C6239] hover:text-white text-[#1A1A1A] py-4 px-2 border-r-2 border-y-2 border-[#1A1A1A] transition-all cursor-pointer shadow-md flex items-center justify-center group rounded-r-md"
            title="Expand Settings Sidebar"
          >
            <ChevronRight className="w-4 h-4 animate-pulse group-hover:translate-x-0.5" />
          </button>
        )}

        {/* Dynamic Frame for Active Views with subtle smooth fade-in motion */}
        <main className="flex-1 p-5 md:p-7 bg-[#ECE0D1] min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="max-w-7xl mx-auto h-full"
            >
              {activeTab === "home" && (
                <Mangalacharanam
                  onEnterArchive={() => setActiveTab("library")}
                  onEnterSearch={() => setActiveTab("search")}
                  scriptTheme={scriptTheme}
                  targetScript={targetScript}
                />
              )}
              {activeTab === "overview" && (
                <TraditionMap
                  onSelectTextById={(id) => {
                    setSelectedTextId(id);
                    setActiveTab("library");
                  }}
                  scriptTheme={scriptTheme}
                  targetScript={targetScript}
                />
              )}
              {activeTab === "library" && (
                <Granthasarani
                  selectedTextId={selectedTextId}
                  initialSectionId={selectedSearchSectionId}
                  initialSutraIndex={selectedSearchSutraIndex}
                  onLoadTextToCuration={handleLoadToCuration}
                  onLoadTextToTranslation={handleLoadToTranslation}
                  scriptTheme={scriptTheme}
                  targetScript={targetScript}
                  onTriggerReader={(text, sutras, index, lang) => {
                    setSelectedTextExcerpt(text);
                    setSpotlightScript(targetScript);
                    setIsSpotlightOpen(true);
                    if (sutras) {
                      setSpotlightSutras(sutras);
                      setSpotlightSutraIndex(index !== undefined ? index : -1);
                    } else {
                      setSpotlightSutras([]);
                      setSpotlightSutraIndex(-1);
                    }
                    if (lang) {
                      setSpotlightLang(lang);
                    }
                  }}
                />
              )}
              {activeTab === "search" && (
                <GlobalSearch
                  targetScript={targetScript}
                  onSelectSutra={(textId, sectionId, sutraIndex) => {
                    setSelectedTextId(textId);
                    setSelectedSearchSectionId(sectionId);
                    setSelectedSearchSutraIndex(sutraIndex);
                    setActiveTab("library");
                  }}
                />
              )}
              {activeTab === "curate" && <OcrCuration initialText={curationLoadText} />}
              {activeTab === "translate" && <Anuvada initialText={translationLoadText} />}
              {activeTab === "dialectics" && <VadaVidya targetScript={targetScript} />}
              {activeTab === "ai-chat" && <TarkaVidyaChat />}
              {activeTab === "feedback" && <FeedbackMaildesk />}
              {activeTab === "kosa" && (
                <Kosa
                  scriptTheme={scriptTheme}
                  targetScript={targetScript}
                  initialTermId={selectedKosaTermId}
                  onTermSelected={(id) => setSelectedKosaTermId(id)}
                />
              )}
              {activeTab === "resources" && (
                <SadhanaResources
                  targetScript={targetScript}
                  onSelectTopic={(textId, sectionId) => {
                    setSelectedTextId(textId);
                    setSelectedSearchSectionId(sectionId);
                    setSelectedSearchSutraIndex(0);
                    setActiveTab("library");
                  }}
                />
              )}
              {activeTab === "about" && (
                <Asmatkatha
                  scriptTheme={scriptTheme}
                  targetScript={targetScript}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Dynamic Academic Repository Footer */}
      <footer className="bg-[#3B2314] border-t-2 border-[#1A1A1A] p-6 text-xs font-sans text-stone-300 mt-auto">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-1">
              <h2 
                onClick={() => {
                  setActiveTab("home");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                id="tarka-vidya-footer-logo-home"
                className="text-sm font-serif font-black tracking-wide text-[#FAF8F5] flex items-center gap-2 cursor-pointer hover:opacity-95 transition-all select-none"
                title="Return to Swādhyāya Home"
              >
                <DiyaLogoIcon className="w-5 h-5 text-[#FAF8F5] inline shrink-0" />
                <span>तर्कविद्या — NYĀYA & VAIŚEṢIKA DARŚAṆA TEXT REPOSITORY</span>
              </h2>
              <p className="max-w-3xl text-stone-300 leading-relaxed text-xs">
                This scholarly digital archive preserves ancient Indian epistemology, atomist realist systems of Darśanas. Free to use, built with meticulous typographic care, and supported by semantic AI Tārkika logic commentary servers.
              </p>
            </div>

            {/* Counters */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 shrink-0 bg-[#4A2F1D] border border-white/20 px-4 py-3 rounded-none shadow-sm font-sans font-bold text-stone-200">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Live: <code className="text-[#FAF8F5]">{liveUsers}</code> Tarkapriyas Online</span>
              </div>
              <div className="flex items-center gap-1.5 text-stone-400">
                <span>Visitor</span>
                <code className="text-white font-extrabold bg-[#3B2314] px-1.5 py-0.5 border border-white/10 font-mono text-[10px]">{visitorCount}</code>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-[10px] border-t border-white/10 pt-3 text-stone-400 font-bold uppercase tracking-wider">
            <span>Free To Use</span>
            <span className="text-stone-500">•</span>
            <span>Academic preservation</span>
            <span className="text-stone-500">•</span>
            <span>Tarkavidya preserve</span>
          </div>
        </div>
      </footer>

      {/* Manual / Welcome Modal */}
      {showWelcomeModal && (
        <div className="fixed inset-0 bg-[#1A1A1A]/75 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in font-sans">
          <div className="bg-[#ECE0D1] border-4 border-[#1A1A1A] max-w-2xl w-full rounded-none shadow-none overflow-hidden animate-scale-up">
            
            <div className="bg-[#1A1A1A] px-5 py-4 border-b-2 border-[#1A1A1A] flex items-center justify-between text-white">
              <div>
                <h3 className="text-white font-serif font-black text-base flex items-center gap-1.5 uppercase tracking-tight">
                  <span className="text-[#a17a6c]">Tarka-Vidyā Guide</span>
                  <span className="text-xs text-stone-400 font-sans font-normal lowercase italic">
                    ({transliterate("तर्कविद्या निर्देशिका", targetScript)})
                  </span>
                </h3>
                <p className="text-stone-400 text-[9px] uppercase tracking-widest block mt-0.5 font-bold">
                  Scholastic Indian Logic Epistemological Workspace Manual
                </p>
              </div>
              <button
                onClick={() => setShowWelcomeModal(false)}
                className="text-stone-300 hover:text-white bg-transparent hover:bg-stone-850 rounded-none p-1.5 transition-all text-xs font-bold border border-transparent hover:border-[#ECE0D1] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[420px] overflow-y-auto custom-scrollbar text-xs text-[#1A1A1A] leading-relaxed bg-[#ECE0D1]">
              {/* Logo and Devotional Invocation (मङ्गलाचरणम्) */}
              <div className="bg-[#FAF8F5] p-4 border border-[#8C6239]/20 rounded-none flex flex-col items-center text-center space-y-2">
                <span className="text-[10px] uppercase tracking-widest font-sans font-black text-[#8C6239]">
                  Auspicious Invocation (मङ्गलाचरणम्)
                </span>
                <p className={`text-[13px] font-bold text-[#1F1A17] max-w-md leading-relaxed ${getScriptFontClass(targetScript)}`}>
                  {transliterate("॥  ॐ कणादगौतमादिभ्यस्तर्कविद्यासम्प्रदायकर्तृभ्यो वंशऋषिभ्यो नमो महद्भ्यो नमो गुरुभ्यः॥", targetScript)}
                </p>
                <span className="text-[9px] text-[#8C6239]/70 font-mono">
                  - Salutations to Kaṇāda and Gautama, the founders of logic
                </span>
              </div>

              <p className="font-serif text-sm text-[#1A1A1A]">
                Welcome to <strong className="text-[#1A1A1A]">Tarka-Vidyā (तर्कविद्या)</strong>. This digital environment is designed to study, translate, proofread, and explore the logical schools and rigorous dialectics of traditional <strong className="text-[#795548]">Nyāya-Vaiśeṣika</strong> philosophy.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-[#1A1A1A] rounded-none p-3 bg-white space-y-1">
                  <h4 className="font-black text-[11px] text-[#1A1A1A] flex items-center gap-1.5 font-sans uppercase tracking-wider">
                    <Compass className="w-3.5 h-3.5 text-[#795548]" />
                    1. Overview Map & Classes
                  </h4>
                  <p className="text-[10px] text-stone-605">
                    Navigate Indian philosophical schools (Āstika vs Nāstika) & stream structured Vimeo classes (with automatic syllabus deep-linking) inside the <strong>Sādhanā Resources</strong> panel.
                  </p>
                </div>

                <div className="border border-[#1A1A1A] rounded-none p-3 bg-white space-y-1">
                  <h4 className="font-black text-[11px] text-[#1A1A1A] flex items-center gap-1.5 font-sans uppercase tracking-wider">
                    <Layers className="w-3.5 h-3.5 text-[#795548]" />
                    2. Granthasāraṇī (Full PDF)
                  </h4>
                  <p className="text-[10px] text-stone-605">
                    Explore major treaties, 7 padārthas, and pramāṇas. Download a professional, styled <strong>Full-Text PDF</strong> of any selected scripture directly from either the Fullscreen Reader or the Spotlight sidebar's Document Services.
                  </p>
                </div>

                <div className="border border-[#1A1A1A] rounded-none p-3 bg-white space-y-1">
                  <h4 className="font-black text-[11px] text-[#1A1A1A] flex items-center gap-1.5 font-sans uppercase tracking-wider">
                    <BookOpen className="w-3.5 h-3.5 text-[#795548]" />
                    3. Pañcanaya-Samanvaya
                  </h4>
                  <p className="text-[10px] text-stone-605">
                    Convert and extract logical syllogisms. Read complex Sanskrit phrases, toggle split-screen commentaries, or study the five-membered inference structures.
                  </p>
                </div>

                <div className="border border-[#1A1A1A] rounded-none p-3 bg-white space-y-1">
                  <h4 className="font-black text-[11px] text-[#1A1A1A] flex items-center gap-1.5 font-sans uppercase tracking-wider">
                    <Users className="w-3.5 h-3.5 text-[#795548]" />
                    4. Offline-First & Kośa
                  </h4>
                  <p className="text-[10px] text-stone-605">
                    The platform is fully <strong>offline capable</strong>. Search the classical Nyāya-Vaiśeṣika lexicon, listen to audio pronunciations, and access library texts without an active internet connection!
                  </p>
                </div>
              </div>

              <div className="border-t border-stone-300 pt-3 flex flex-col gap-1 text-[10px] text-stone-650 bg-[#F5F2EA] p-3 rounded-none border-2">
                <span className="font-extrabold text-[#1A1A1A] uppercase tracking-wider flex items-center gap-1.5">
                  <Grid className="w-3.5 h-3.5 text-[#795548]" />
                  Dynamic Multilingual script rules:
                </span>
                <p>
                  Toggle the <strong>Script Engine</strong> in the left drawer side to instantly convert the site options and head text into Devanagari, romanized Gregorian IAST, dual layouts, or regional Indian scripts (Telugu, Bengali, Tamil etc.).
                </p>
              </div>
            </div>

            <div className="bg-[#F5F2EA] border-t-2 border-[#1A1A1A] px-5 py-4 flex justify-between items-center text-[9px] font-mono font-bold text-[#1A1A1A]">
              <span>Tarka-Vidyā v2.1.0</span>
              <button
                onClick={() => {
                  try {
                    localStorage.setItem("dismiss_tarka_guide_v2", "true");
                  } catch (e) {
                    console.error(e);
                  }
                  setShowWelcomeModal(false);
                }}
                className="bg-[#795548] hover:bg-[#1A1A1A] text-white rounded-none text-xs font-bold uppercase tracking-widest py-2.5 px-6 transition-all border-2 border-[#1A1A1A] shadow-none cursor-pointer cool-3d-gently classy-transition"
              >
                Enter the Tarka-Vidyā Mandira
              </button>
            </div>
          </div>
        </div>
      )}
      {/* 1. Floating Action Popover trigger for Text Selection */}
      <AnimatePresence>
        {showSpotlightTrigger && selectedTextExcerpt && !isSpotlightOpen && (
          <motion.div
            id="spotlight-trigger"
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-40 bg-[#8C6239] text-white border-2 border-[#1F1A17] pl-4 pr-5 py-3 rounded-none flex items-center gap-3 shadow-[0_12px_36px_rgba(140,98,57,0.3)] hover:bg-[#1F1A17] hover:scale-105 active:scale-95 cursor-pointer select-none font-sans transition-all"
            onClick={() => {
              setSpotlightScript(targetScript); // sync
              setIsSpotlightOpen(true);
              setShowSpotlightTrigger(false);
              // Reset isolated word explorer
              setSelectedWord("");
            }}
          >
            <div className="bg-white/10 p-1.5 rounded-none flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#F5EDD6] animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-black tracking-widest block text-[#F5EDD6]">
                Spotlight Reader Active
              </span>
              <p className="text-xs font-bold tracking-tight line-clamp-1 max-w-xs text-stone-100 italic">
                "{selectedTextExcerpt}"
              </p>
            </div>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Spotlight Optimization Fullscreen Backdrop Modal */}
      <AnimatePresence>
        {isSpotlightOpen && (
          <motion.div
            id="spotlight-widget"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#1F1A17]/90 backdrop-blur-md flex flex-col md:flex-row items-stretch justify-stretch overflow-hidden font-sans"
          >
            {/* Left Control Column (The Board) */}
            <div className="w-full md:w-[380px] bg-[#FCF8EC] border-b-2 md:border-b-0 md:border-r-2 border-[#1F1A17] p-6 overflow-y-auto flex flex-col gap-6 custom-scrollbar text-[#1F1A17]">
              <div>
                <span className="text-[10px] font-black text-[#8C6239] uppercase tracking-widest block mb-1">
                  Swādhyāya Spotlight
                </span>
                <h3 className="text-lg font-serif font-black uppercase tracking-tight flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#8C6239]" />
                  Reading Optimization (स्वाध्यायः)
                </h3>
                <p className="text-[11px] text-stone-605 mt-1 font-bold">
                  Sanskrit text selection isolate viewer. Customize script, typeface parameters, and spacing triggers to minimize distraction.
                </p>
              </div>

              {/* Theme Selector */}
              <div className="space-y-2">
                <span className="text-[10px] font-black text-[#1F1A17] uppercase tracking-widest block flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-[#8C6239]" />
                  Aesthetic Canvas Color:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "manuscript", label: "📜 Palm-Leaf" },
                    { id: "diya", label: "🕯️ Cozy Diya" },
                    { id: "slate", label: "🪨 Dark Slate" },
                    { id: "ink", label: "🖋️ Scholarly" },
                  ].map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => setSpotlightTheme(theme.id as any)}
                      className={`text-xs p-2.5 font-bold rounded-none border border-[#1F1A17] transition-all cursor-pointer ${
                        spotlightTheme === theme.id
                          ? "bg-[#1F1A17] text-[#FCF8EC]"
                          : "bg-white hover:bg-stone-50"
                      }`}
                    >
                      {theme.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* High Contrast Mode Toggle */}
              <div className="space-y-1.5">
                <label className="flex items-center justify-between p-2.5 bg-white border border-[#1F1A17] cursor-pointer select-none transition-colors hover:bg-stone-50">
                  <span className="text-xs font-bold text-[#1F1A17] flex items-center gap-1.5">
                    <Eye className="w-4 h-4 text-[#8C6239]" />
                    High Contrast Mode
                  </span>
                  <input
                    type="checkbox"
                    checked={spotlightHighContrast}
                    onChange={(e) => setSpotlightHighContrast(e.target.checked)}
                    className="w-4 h-4 accent-[#8C6239] cursor-pointer"
                  />
                </label>
                <p className="text-[10px] text-stone-500 leading-normal font-bold">
                  Adjusts the text-to-background colour ratio to pure black-on-white or white-on-black for improved accessibility during long reading sessions.
                </p>
              </div>

              {/* Target script Selector */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-black text-[#1F1A17] uppercase tracking-widest block">
                  Transliterator Script Engine:
                </span>
                <select
                  value={spotlightScript}
                  onChange={(e) => setSpotlightScript(e.target.value)}
                  className="w-full bg-white border border-[#1F1A17] rounded-none py-2 px-2.5 text-xs font-bold focus:outline-none cursor-pointer"
                >
                  {Object.entries(SCRIPT_NAMES).map(([id, label]) => (
                    <option key={id} value={id}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Font Size & Line Height Row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-[#1F1A17] uppercase tracking-widest block">
                    Font Size:
                  </span>
                  <div className="flex border border-[#1F1A17] bg-white rounded-none overflow-hidden font-sans">
                    <button
                      onClick={() => setSpotlightFontSize(Math.max(16, spotlightFontSize - 4))}
                      className="flex-1 py-1 px-2 text-xs font-bold hover:bg-stone-100 transition-colors border-r border-[#1F1A17] font-mono cursor-pointer"
                    >
                      -
                    </button>
                    <span className="px-2 py-1 text-xs font-bold flex items-center justify-center font-mono select-none bg-stone-50 min-w-[40px]">
                      {spotlightFontSize}px
                    </span>
                    <button
                      onClick={() => setSpotlightFontSize(Math.min(48, spotlightFontSize + 4))}
                      className="flex-1 py-1 px-2 text-xs font-bold hover:bg-stone-100 transition-colors font-mono cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-black text-[#1F1A17] uppercase tracking-widest block">
                    Paragraph Spacing:
                  </span>
                  <div className="flex border border-[#1F1A17] bg-white rounded-none overflow-hidden h-7">
                    {(["standard", "relaxed", "loose"] as const).map((spacing) => (
                      <button
                        key={spacing}
                        onClick={() => setSpotlightSpacing(spacing)}
                        className={`flex-1 text-[9px] font-black uppercase text-center focus:outline-none transition-all cursor-pointer ${
                          spotlightSpacing === spacing
                            ? "bg-[#1F1A17] text-white"
                            : "hover:bg-stone-100 text-[#1F1A17]"
                        }`}
                      >
                        {spacing[0]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* focus tools: Ruler */}
              <div className="space-y-2 pt-2 border-t border-[#1F1A17]/10">
                <span className="text-[10px] font-black text-[#1F1A17] uppercase tracking-widest block">
                  Cognitive Tracking utilities:
                </span>
                <button
                  onClick={() => setSpotlightRulerActive(!spotlightRulerActive)}
                  className={`w-full py-2.5 px-3 rounded-none border border-[#1F1A17] font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    spotlightRulerActive
                      ? "bg-[#8C6239] text-white"
                      : "bg-white hover:bg-stone-50 text-[#1F1A17]"
                  }`}
                >
                  <Ruler className="w-4 h-4 shrink-0" />
                  <span>{spotlightRulerActive ? "Disable Reading Ruler" : "Enable Reading Ruler"}</span>
                </button>
                {spotlightRulerActive && (
                  <p className="text-[10px] text-stone-605 italic font-medium leading-tight">
                    💡 Click and drag/move your mouse on the text space. The horizontal focal rule will align to help guide translation step-by-step.
                  </p>
                )}
              </div>

              {/* Memorisation Mode */}
              <div className="space-y-2 pt-2 border-t border-[#1F1A17]/10">
                <span className="text-[10px] font-black text-[#1F1A17] uppercase tracking-widest block">
                  Sanskrit Memorisation Mode:
                </span>
                <button
                  onClick={() => setIsMemoriseMode(!isMemoriseMode)}
                  className={`w-full py-2.5 px-3 rounded-none border border-[#1F1A17] font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isMemoriseMode
                      ? "bg-[#D97706] text-white"
                      : "bg-white hover:bg-stone-50 text-[#1F1A17]"
                  }`}
                >
                  <Brain className="w-4 h-4 shrink-0" />
                  <span>{isMemoriseMode ? "Disable Memorisation Mode" : "Enable Memorisation Mode"}</span>
                </button>
                {isMemoriseMode && (
                  <div className="space-y-2.5 bg-amber-50/40 p-2.5 border border-[#1F1A17]/20 mt-1">
                    <p className="text-[10px] text-stone-600 italic font-medium leading-tight">
                      💡 Test your recall! Select the portion of words to hide. Tap/click on any hidden word to temporarily reveal it.
                    </p>
                    
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold text-stone-600 uppercase block">Hiding level:</span>
                      <div className="grid grid-cols-4 gap-1">
                        {[
                          { val: 1, label: "25%" },
                          { val: 2, label: "50%" },
                          { val: 3, label: "75%" },
                          { val: 4, label: "100%" },
                        ].map((level) => (
                          <button
                            key={level.val}
                            onClick={() => {
                              setMemoriseHideLevel(level.val);
                              setRevealedWordIndices([]);
                            }}
                            className={`py-1 text-[10px] font-mono font-bold border ${
                              memoriseHideLevel === level.val
                                ? "bg-[#8C6239] text-white border-[#8C6239]"
                                : "bg-white border-stone-250 text-stone-700 hover:bg-stone-50"
                            }`}
                          >
                            {level.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-1.5">
                      <button
                        onClick={() => setRevealedWordIndices([])}
                        className="flex-1 py-1 px-2 border border-stone-300 bg-white text-stone-600 hover:text-stone-800 hover:bg-stone-50 text-[10px] font-bold uppercase transition-colors cursor-pointer"
                      >
                        Hide All Again
                      </button>
                      <button
                        onClick={() => {
                          const words = (spotlightVerse || "").split(/\s+/).filter(Boolean);
                          const indices = words.map((_, i) => i);
                          setRevealedWordIndices(indices);
                        }}
                        className="flex-1 py-1 px-2 border border-[#8C6239] bg-white text-[#8C6239] hover:bg-[#8C6239]/5 text-[10px] font-bold uppercase transition-colors cursor-pointer"
                      >
                        Reveal All
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Chanting TTS Vocal Recitation */}
              <div className="space-y-2 pt-2 border-t border-[#1F1A17]/10">
                <span className="text-[10px] font-black text-[#1F1A17] uppercase tracking-widest block">
                  Vocal Reciter Engine rate:
                </span>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0.5"
                    max="1.5"
                    step="0.1"
                    value={spotlightSpeechRate}
                    onChange={(e) => setSpotlightSpeechRate(parseFloat(e.target.value))}
                    className="flex-1 accent-[#8C6239] cursor-pointer slider-custom"
                  />
                  <span className="text-xs font-bold font-mono text-[#1F1A17] min-w-[35px]">
                    {spotlightSpeechRate}x
                  </span>
                </div>

                {/* Discrete Speech Rate Presets */}
                <div className="grid grid-cols-3 gap-1.5 pt-0.5">
                  {[
                    { rate: 0.5, label: "Slow", sub: "0.5x" },
                    { rate: 1.0, label: "Standard", sub: "1.0x" },
                    { rate: 1.5, label: "Fast", sub: "1.5x" }
                  ].map((preset) => {
                    const isSelected = Math.abs(spotlightSpeechRate - preset.rate) < 0.05;
                    return (
                      <button
                        key={preset.rate}
                        type="button"
                        onClick={() => {
                          setSpotlightSpeechRate(preset.rate);
                        }}
                        className={`py-1.5 px-1.5 text-center border font-mono transition-all rounded-none cursor-pointer flex flex-col items-center justify-center ${
                          isSelected
                            ? "bg-[#8C6239] text-white border-[#8C6239] font-black shadow-xs ring-1 ring-[#8C6239]"
                            : "bg-white text-[#1F1A17] border-stone-300 hover:bg-[#FAF8F5] hover:border-[#1F1A17]"
                        }`}
                        title={`Set speech rate to ${preset.label} (${preset.sub})`}
                      >
                        <span className="text-[10px] uppercase font-sans font-black tracking-wider leading-tight">{preset.label}</span>
                        <span className="text-[9px] opacity-80 leading-none mt-0.5">({preset.sub})</span>
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={handleSpotlightRecite}
                  className={`w-full py-2.5 px-4 rounded-none border border-[#1F1A17] font-black uppercase text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isSpotlightChanting
                      ? "bg-[#1F1A17] text-white"
                      : "bg-[#8C6239] text-white hover:bg-[#714E2C]"
                  }`}
                >
                  {isSpotlightChanting ? (
                    <>
                      <Pause className="w-4 h-4 text-white" />
                      <span>Pause Recitation</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4 text-white fill-white" />
                      <span>Recite Selected Text</span>
                    </>
                  )}
                </button>
              </div>

              {/* Content Layer Visibility Switches & Auto-Scroll Synchronization */}
              <div className="space-y-2 pt-2 border-t border-[#1F1A17]/10">
                <span className="text-[10px] font-black text-[#1F1A17] uppercase tracking-widest block">
                  Active Display Layers & Sync:
                </span>
                <div className="space-y-1.5 bg-white border border-[#1F1A17] p-2.5 rounded-none text-xs font-bold text-[#1F1A17]">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={showSpotlightVerse}
                      onChange={(e) => setShowSpotlightVerse(e.target.checked)}
                      className="accent-[#8C6239] cursor-pointer"
                    />
                    <span>Show Core Verse (मूलपाठः)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer select-none mt-1">
                    <input
                      type="checkbox"
                      checked={showSpotlightPadaccheda}
                      onChange={(e) => setShowSpotlightPadaccheda(e.target.checked)}
                      className="accent-[#8C6239] cursor-pointer"
                    />
                    <span>Show Padaccheda (पदच्छेदः)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer select-none mt-1">
                    <input
                      type="checkbox"
                      checked={showSpotlightTranslation}
                      onChange={(e) => setShowSpotlightTranslation(e.target.checked)}
                      className="accent-[#8C6239] cursor-pointer"
                    />
                    <span>Show Translation & Commentary</span>
                  </label>

                  {/* Auto-Scroll Synchronization Toggle */}
                  <div className="pt-2 mt-2 border-t border-stone-200">
                    <label className="flex items-center justify-between gap-2 cursor-pointer select-none">
                      <div className="flex items-center gap-1.5">
                        <Link2 className={`w-3.5 h-3.5 ${isAutoScrollSyncEnabled ? "text-[#8C6239]" : "text-stone-400"}`} />
                        <span className="text-[11px] font-black">Auto-Scroll Sync</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={isAutoScrollSyncEnabled}
                        onChange={(e) => setIsAutoScrollSyncEnabled(e.target.checked)}
                        className="accent-[#8C6239] cursor-pointer w-4 h-4"
                      />
                    </label>
                    <p className="text-[9.5px] text-stone-500 font-sans font-normal mt-0.5 leading-tight">
                      Scrolling Core Verse automatically synchronizes Translation & Commentary.
                    </p>
                  </div>
                </div>
              </div>

              {/* Highlights & Study Annotations Section */}
              <div className="space-y-2 pt-2 border-t border-[#1F1A17]/10">
                <button
                  onClick={() => setIsHighlightsSectionOpen(!isHighlightsSectionOpen)}
                  className={`w-full py-2.5 px-3 border border-[#1F1A17] text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                    isHighlightsSectionOpen ? "bg-[#1F1A17] text-[#FCF8EC]" : "bg-white hover:bg-stone-50 text-[#1F1A17]"
                  }`}
                >
                  <span className="uppercase font-black text-[9px] tracking-wider flex items-center gap-1.5">
                    <Highlighter className={`w-3.5 h-3.5 ${isHighlightsSectionOpen ? "text-[#FCF8EC]" : "text-[#8C6239]"}`} />
                    📚 Sūtra Highlights & Notes
                  </span>
                  <span>{isHighlightsSectionOpen ? "Hide" : "Expand"}</span>
                </button>

                {isHighlightsSectionOpen && (
                  <div className="space-y-3 bg-[#F3EBE0] border-2 border-dashed border-[#8C6239]/30 p-3 rounded-none animate-fade-in text-left">
                    <div className="space-y-1">
                      <span className="text-[9px] font-black uppercase text-[#8C6239] block">1. Color Marker Palette:</span>
                      <div className="flex gap-2">
                        {[
                          { color: "rgba(254, 240, 138, 0.5)", label: "Yellow", bg: "bg-[#FEF08A]" },
                          { color: "rgba(187, 247, 208, 0.5)", label: "Mint", bg: "bg-[#BBF7D0]" },
                          { color: "rgba(254, 205, 211, 0.5)", label: "Rose", bg: "bg-[#FECDD3]" },
                          { color: "rgba(253, 230, 138, 0.5)", label: "Amber", bg: "bg-[#FDE68A]" }
                        ].map((c) => (
                          <button
                            key={c.color}
                            onClick={() => setHighlightColor(c.color)}
                            className={`w-6 h-6 rounded-full border border-stone-800 transition-transform cursor-pointer ${c.bg} ${
                              highlightColor === c.color ? "scale-125 ring-2 ring-[#8C6239]" : "hover:scale-110"
                            }`}
                            title={c.label}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[9px] font-black uppercase text-[#8C6239] block">2. Add Note / Gloss:</span>
                      <input
                        type="text"
                        placeholder="e.g. Core definition, key concept..."
                        value={highlightNote}
                        onChange={(e) => setHighlightNote(e.target.value)}
                        className="w-full bg-white border border-[#1F1A17] text-xs px-2.5 py-1.5 focus:outline-none rounded-none placeholder-stone-400"
                      />
                    </div>

                    <div className="space-y-1.5 pt-1">
                      <button
                        onClick={() => handleSaveSelectionHighlight()}
                        className="w-full bg-[#8C6239] text-white hover:bg-stone-900 border border-[#1F1A17] text-[10px] font-black uppercase py-2 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Highlighter className="w-3.5 h-3.5" />
                        <span>Highlight Selected Text</span>
                      </button>

                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          onClick={() => handleSaveSelectionHighlight("verse", transliterate(spotlightVerse, spotlightScript))}
                          className="border border-[#1F1A17] bg-white text-[#1F1A17] hover:bg-stone-100 text-[9px] font-bold uppercase py-1.5 flex items-center justify-center gap-1 transition-all cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Whole Verse</span>
                        </button>
                        <button
                          onClick={() => handleSaveSelectionHighlight("translation", spotlightTranslation)}
                          className="border border-[#1F1A17] bg-white text-[#1F1A17] hover:bg-stone-100 text-[9px] font-bold uppercase py-1.5 flex items-center justify-center gap-1 transition-all cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Translation</span>
                        </button>
                      </div>
                    </div>

                    <p className="text-[9px] text-stone-600 leading-normal italic bg-stone-100 p-1.5 border border-stone-200">
                      💡 Tip: Use your mouse/finger to select any word or phrase on the right canvas, then click "Highlight Selected Text" to save it forever.
                    </p>

                    {/* Saved Highlights List */}
                    <div className="space-y-1 border-t border-[#1F1A17]/10 pt-2">
                      <span className="text-[9px] font-black uppercase text-[#8C6239] block">
                        Saved Annotations ({highlights.filter(h => h.sutraId === selectedTextId).length}):
                      </span>
                      {highlights.filter(h => h.sutraId === selectedTextId).length === 0 ? (
                        <p className="text-[10px] text-stone-500 italic">No highlights saved in this study session.</p>
                      ) : (
                        <div className="max-h-[160px] overflow-y-auto border border-[#1F1A17] bg-white divide-y divide-[#1F1A17]/10 custom-scrollbar">
                          {highlights
                            .filter(h => h.sutraId === selectedTextId)
                            .map((h) => (
                              <div key={h.id} className="p-2 text-[10px] space-y-1 relative group">
                                <button
                                  onClick={() => handleDeleteHighlight(h.id)}
                                  className="absolute top-2 right-2 text-stone-400 hover:text-red-700 p-0.5 cursor-pointer"
                                  title="Delete Highlight"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                                <div className="flex items-center gap-1.5">
                                  <span
                                    className="px-1 py-0.2 rounded-sm text-[8px] font-black uppercase text-stone-900"
                                    style={{ backgroundColor: h.color }}
                                  >
                                    {h.type}
                                  </span>
                                  <span className="text-[8px] font-mono text-stone-500">{h.timestamp}</span>
                                </div>
                                <p className="font-serif leading-relaxed font-bold italic text-stone-850 select-all pr-5">
                                  "{h.text}"
                                </p>
                                {h.note && (
                                  <p className="text-[9px] text-[#8C6239] font-medium bg-[#8C6239]/5 p-1 border-l-2 border-[#8C6239]">
                                    ✍️ {h.note}
                                  </p>
                                )}
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Academic Citation Export Section */}
              <div className="space-y-2 pt-2 border-t border-[#1F1A17]/10">
                <button
                  onClick={() => setIsCitationSectionOpen(!isCitationSectionOpen)}
                  className={`w-full py-2.5 px-3 border border-[#1F1A17] text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                    isCitationSectionOpen ? "bg-[#1F1A17] text-[#FCF8EC]" : "bg-white hover:bg-stone-50 text-[#1F1A17]"
                  }`}
                >
                  <span className="uppercase font-black text-[9px] tracking-wider flex items-center gap-1.5">
                    <Quote className={`w-3.5 h-3.5 ${isCitationSectionOpen ? "text-[#FCF8EC]" : "text-[#8C6239]"}`} />
                    🎓 Academic Citation Export
                  </span>
                  <span>{isCitationSectionOpen ? "Hide" : "Expand"}</span>
                </button>

                {isCitationSectionOpen && (
                  <div className="space-y-3 bg-[#F3EBE0] border-2 border-dashed border-[#8C6239]/30 p-3 rounded-none animate-fade-in text-left">
                    <p className="text-[10px] text-stone-600 leading-snug">
                      Generate bibliographic citations for this specific aphorism segment across major publication styles:
                    </p>
                    
                    {(["apa", "mla", "chicago", "harvard", "bibtex"] as const).map((format) => {
                      const cit = generateCitation(format);
                      const isCopied = copiedFormat === format;
                      return (
                        <div key={format} className="space-y-1 bg-white p-2.5 border border-[#1F1A17] relative">
                          <div className="flex items-center justify-between border-b border-stone-100 pb-1 mb-1">
                            <span className="text-[9px] font-black uppercase text-[#8C6239] font-mono">{format} Format</span>
                            <button
                              onClick={() => handleCopyCitation(format, cit)}
                              className={`text-[9px] font-black uppercase px-2 py-0.5 border border-[#1F1A17] transition-all cursor-pointer ${
                                isCopied ? "bg-green-800 text-white border-green-800" : "bg-stone-50 hover:bg-stone-100 text-[#1F1A17]"
                              }`}
                            >
                              {isCopied ? "✓ Copied" : "Copy"}
                            </button>
                          </div>
                          <p className="text-[10px] leading-relaxed font-serif text-stone-800 select-all pr-1 max-h-[85px] overflow-y-auto custom-scrollbar break-words">
                            {cit}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Dynamic Content Editor Accordion */}
              <div className="space-y-2 pt-2 border-t border-[#1F1A17]/10">
                <button
                  onClick={() => setIsEditingSpotlight(!isEditingSpotlight)}
                  className={`w-full py-2 px-3 border border-[#1F1A17] text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                    isEditingSpotlight ? "bg-[#1F1A17] text-[#FCF8EC]" : "bg-white hover:bg-stone-50 text-[#1F1A17]"
                  }`}
                >
                  <span className="uppercase font-black text-[9px] tracking-wider">✏️ Swādhyāya Content Editor</span>
                  <span>{isEditingSpotlight ? "Hide Editor" : "Edit Text"}</span>
                </button>
                
                {isEditingSpotlight && (
                  <div className="space-y-3 bg-[#F3EBE0] border-2 border-dashed border-[#8C6239]/30 p-3 rounded-none animate-fade-in text-left">
                    <div className="space-y-1">
                      <span className="text-[9px] font-black uppercase text-[#8C6239]">Sanskrit Verse / Main Text:</span>
                      <textarea
                        value={spotlightVerse}
                        onChange={(e) => setSpotlightVerse(e.target.value)}
                        rows={3}
                        className="w-full text-xs font-serif p-2 bg-white border border-[#1F1A17] rounded-none focus:outline-none focus:ring-1 focus:ring-[#8C6239] custom-scrollbar text-[#1F1A17]"
                        placeholder="Write or edit original Sanskrit text here..."
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] font-black uppercase text-[#8C6239]">Translation:</span>
                      <textarea
                        value={spotlightTranslation}
                        onChange={(e) => setSpotlightTranslation(e.target.value)}
                        rows={3}
                        className="w-full text-xs p-2 bg-white border border-[#1F1A17] rounded-none focus:outline-none focus:ring-1 focus:ring-[#8C6239] custom-scrollbar text-[#1F1A17]"
                        placeholder="Write English translation..."
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] font-black uppercase text-[#8C6239]">Commentary:</span>
                      <textarea
                        value={spotlightCommentary}
                        onChange={(e) => setSpotlightCommentary(e.target.value)}
                        rows={3}
                        className="w-full text-xs p-2 bg-white border border-[#1F1A17] rounded-none focus:outline-none focus:ring-1 focus:ring-[#8C6239] custom-scrollbar text-[#1F1A17]"
                        placeholder="Write scholarly commentary..."
                      />
                    </div>
                    <div className="text-[9px] text-stone-605 italic leading-tight text-stone-500">
                      * Changes made above update the reader workspace canvas in real-time and will be included in the PDF export.
                    </div>
                  </div>
                )}
              </div>

              {/* Document Services and PDF Export */}
              <div className="space-y-2 pt-2 border-t border-[#1F1A17]/10">
                <span className="text-[10px] font-black text-[#1F1A17] uppercase tracking-widest block flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-[#8C6239]" />
                  Document Services:
                </span>
                <div className="grid grid-cols-1 gap-2">
                  <button
                    onClick={handleDownloadPDF}
                    className="w-full py-2 px-3 bg-white text-[#1F1A17] hover:bg-[#8C6239] hover:text-white border border-[#1F1A17] hover:border-[#1F1A17] font-bold uppercase text-[10px] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    title="Download PDF of the current spotlighted verse or excerpt"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Verse PDF</span>
                  </button>
                  <button
                    onClick={handleDownloadFullBookPDF}
                    className="w-full py-2 px-3 bg-[#8C6239] text-white hover:bg-[#714E2C] border border-[#8C6239] font-bold uppercase text-[10px] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    title="Download the complete book text as a beautifully formatted multi-page PDF"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Download Whole Text PDF</span>
                  </button>
                </div>
              </div>

              {/* Close Button at bottom of Sidebar */}
              <button
                onClick={() => {
                  window.speechSynthesis.cancel();
                  setIsSpotlightChanting(false);
                  setIsSpotlightOpen(false);
                }}
                className="mt-auto w-full bg-red-900 border border-[#1F1A17] hover:bg-stone-900 text-white font-black uppercase tracking-wider text-xs py-3 rounded-none flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
                <span>Return to Library</span>
              </button>
            </div>

            {/* Right Display Area (The Canvas) */}
            <div
              className={`flex-1 relative p-8 md:p-16 flex flex-col justify-start py-12 md:py-20 overflow-y-auto transition-colors duration-500 ease-in-out ${
                spotlightHighContrast
                  ? (spotlightTheme === "diya" || spotlightTheme === "slate")
                    ? "bg-black text-white"
                    : "bg-white text-black"
                  : spotlightTheme === "manuscript"
                  ? "bg-[#F3EBE0] text-[#3B2314]"
                  : spotlightTheme === "diya"
                  ? "bg-[#281D17] text-[#ECE0CC]"
                  : spotlightTheme === "slate"
                  ? "bg-[#141517] text-[#DFDFDF]"
                  : "bg-white text-[#1A1A1A]"
              } ${getScriptFontClass(spotlightScript)}`}
              onMouseMove={(e) => {
                if (spotlightRulerActive) {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const yRelative = ((e.clientY - rect.top) / rect.height) * 100;
                  setSpotlightRulerY(yRelative);
                }
              }}
            >
              {/* Sticky Immersive Reader Top Bar */}
              <div
                className={`sticky top-0 z-30 flex items-center justify-between py-2.5 px-4 sm:px-6 md:px-8 -mt-12 md:-mt-20 -mx-8 md:-mx-16 mb-6 border-b backdrop-blur-md shadow-xs select-none transition-colors duration-500 ease-in-out ${
                  spotlightHighContrast
                    ? (spotlightTheme === "diya" || spotlightTheme === "slate")
                      ? "bg-black/95 text-white border-white/20"
                      : "bg-white/95 text-black border-black/20"
                    : spotlightTheme === "manuscript"
                    ? "bg-[#F3EBE0]/95 text-[#3B2314] border-[#3B2314]/15"
                    : spotlightTheme === "diya"
                    ? "bg-[#281D17]/95 text-[#ECE0CC] border-[#ECE0CC]/15"
                    : spotlightTheme === "slate"
                    ? "bg-[#141517]/95 text-[#DFDFDF] border-[#DFDFDF]/15"
                    : "bg-white/95 text-[#1A1A1A] border-stone-200"
                }`}
              >
                {/* Left Side: Prev button & Layout toggles */}
                <div className="flex items-center gap-2">
                  <button
                    disabled={spotlightSutraIndex <= 0}
                    onClick={() => handleSpotlightNavigate("prev")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 border border-current/30 text-[11px] font-black uppercase transition-all rounded-none ${
                      spotlightSutraIndex <= 0
                        ? "opacity-25 cursor-not-allowed"
                        : "hover:bg-current/10 cursor-pointer active:scale-95"
                    }`}
                    title="Previous Aphorism / Sūtra"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Prev</span>
                  </button>

                  {/* Auto-Scroll Sync Toggle Button */}
                  <button
                    type="button"
                    onClick={() => setIsAutoScrollSyncEnabled(!isAutoScrollSyncEnabled)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 border text-[10px] sm:text-[11px] font-black uppercase transition-all rounded-none cursor-pointer ${
                      isAutoScrollSyncEnabled
                        ? "bg-[#8C6239] text-white border-[#8C6239] shadow-xs"
                        : "bg-current/5 text-current border-current/30 hover:bg-current/10"
                    }`}
                    title={isAutoScrollSyncEnabled ? "Auto-Scroll Sync is ON: scrolling Core Verse syncs Commentary" : "Auto-Scroll Sync is OFF"}
                  >
                    {isAutoScrollSyncEnabled ? (
                      <>
                        <Link2 className="w-3.5 h-3.5 text-white animate-pulse" />
                        <span className="hidden md:inline">Sync Scrolling: ON</span>
                        <span className="md:hidden">Sync ON</span>
                      </>
                    ) : (
                      <>
                        <Unlink className="w-3.5 h-3.5 opacity-60" />
                        <span className="hidden md:inline">Sync Scrolling: OFF</span>
                        <span className="md:hidden">Sync OFF</span>
                      </>
                    )}
                  </button>

                  {/* Dual vs Single Pane Toggle */}
                  <button
                    type="button"
                    onClick={() => setSpotlightLayoutMode(spotlightLayoutMode === "dual" ? "unified" : "dual")}
                    className="hidden lg:flex items-center gap-1 px-2 py-1.5 border border-current/30 text-[10px] font-bold uppercase transition-all rounded-none hover:bg-current/10 cursor-pointer"
                    title="Toggle between Dual-Pane Synchronized layout and Single Stream"
                  >
                    <Columns className="w-3 h-3" />
                    <span>{spotlightLayoutMode === "dual" ? "Dual Panes" : "Single Stream"}</span>
                  </button>
                </div>

                {/* Middle: Verse navigation index indicator */}
                {spotlightSutras.length > 0 && spotlightSutraIndex !== -1 ? (
                  <div className="text-center font-mono text-[10px] sm:text-xs font-black tracking-tight px-3 py-1 bg-current/5 border border-current/10 rounded-none">
                    <span>
                      Sūtra {spotlightSutras[spotlightSutraIndex].sutraNum} ({spotlightSutraIndex + 1} of {spotlightSutras.length})
                    </span>
                  </div>
                ) : (
                  <div className="text-center font-mono text-[10px] sm:text-xs font-black tracking-tight px-3 py-1 bg-current/5 border border-current/10 rounded-none">
                    <span>Immersive Workspace</span>
                  </div>
                )}

                {/* Right: Next and Exit Button */}
                <div className="flex items-center gap-2">
                  <button
                    disabled={spotlightSutras.length === 0 || spotlightSutraIndex >= spotlightSutras.length - 1}
                    onClick={() => handleSpotlightNavigate("next")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 border border-current/30 text-[11px] font-black uppercase transition-all rounded-none ${
                      spotlightSutras.length === 0 || spotlightSutraIndex >= spotlightSutras.length - 1
                        ? "opacity-25 cursor-not-allowed"
                        : "hover:bg-current/10 cursor-pointer active:scale-95"
                    }`}
                    title="Next Aphorism / Sūtra"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="w-px h-5 bg-current/20 mx-1 sm:mx-2" />

                  {/* Exit Option above the corner */}
                  <button
                    onClick={() => {
                      window.speechSynthesis.cancel();
                      setIsSpotlightChanting(false);
                      setIsSpotlightOpen(false);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 bg-red-800/10 hover:bg-red-900 hover:text-white border border-red-800/30 hover:border-red-900 text-red-600 hover:text-white font-black text-[11px] uppercase tracking-widest transition-all rounded-none cursor-pointer active:scale-95"
                    title="Exit Immersive Reader (Return to Library)"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Exit</span>
                  </button>
                </div>
              </div>

              {/* Reading Focus Ruler Guide Overlay */}
              {spotlightRulerActive && (
                <div
                  className="absolute left-0 right-0 h-10 bg-[#8C6239]/15 border-y-2 border-dashed border-[#8C6239]/50 pointer-events-none transition-all duration-75 mix-blend-multiply"
                  style={{ top: `${spotlightRulerY}%`, transform: "translateY(-50%)" }}
                />
              )}

              {/* Synchronized Dual-Pane or Single Stream Layout Container */}
              {spotlightLayoutMode === "dual" ? (
                <div className="w-full max-w-7xl mx-auto z-10 grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                  
                  {/* Left Pane: Core Verse & Pada-Ccheda (with scroll synchronization handler) */}
                  <div
                    ref={coreVersePaneRef}
                    onScroll={handleCoreVerseScroll}
                    className="h-auto lg:h-[calc(100vh-190px)] overflow-y-auto custom-scrollbar p-6 sm:p-8 bg-current/3 border border-current/15 rounded-none flex flex-col space-y-6 text-left transition-colors duration-500 ease-in-out"
                  >
                    <div className="border-b border-current/10 pb-3 flex items-center justify-between sticky top-0 bg-inherit backdrop-blur-xs z-10">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-black tracking-widest uppercase opacity-90 flex items-center gap-1.5">
                          <Book className="w-3.5 h-3.5 text-[#8C6239]" />
                          Core Verse (मूलपाठः)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {isAutoScrollSyncEnabled && (
                          <span className="text-[9px] font-mono font-bold px-2 py-0.5 border border-[#8C6239] text-[#8C6239] bg-[#8C6239]/5 uppercase flex items-center gap-1">
                            <Link2 className="w-2.5 h-2.5" /> Synced
                          </span>
                        )}
                        <span className="text-[9px] font-mono px-2 py-0.5 border border-current bg-current/5 uppercase opacity-60">
                          {spotlightScript}
                        </span>
                      </div>
                    </div>

                    {/* 1. Core Verse Content */}
                    {showSpotlightVerse && spotlightVerse ? (
                      <div
                        className={`font-serif tracking-normal text-left break-words ${
                          spotlightSpacing === "standard"
                            ? "leading-relaxed"
                            : spotlightSpacing === "relaxed"
                            ? "leading-loose"
                            : "leading-loose tracking-wide"
                        }`}
                        style={{ fontSize: `${spotlightFontSize}px` }}
                      >
                        {renderCoreVerseWithHighlights()}
                      </div>
                    ) : (
                      <div className="p-6 text-center text-xs opacity-50 italic">
                        Core Verse display is currently hidden via sidebar controls.
                      </div>
                    )}

                    {/* 2. Scholastic Pada-Ccheda (Word Level Splitter) */}
                    {showSpotlightPadaccheda && spotlightVerse && (
                      <div className="pt-6 border-t border-current/10 space-y-4 text-left">
                        <div className="flex items-center gap-1.5 opacity-80 text-[10px] font-extrabold tracking-widest uppercase">
                          <Sparkles className={`w-3.5 h-3.5 ${spotlightHighContrast ? "text-current" : "text-[#8C6239]"}`} />
                          <span>Pada-Ccheda (Interactive Word Splitter / पदच्छेदः)</span>
                        </div>
                        <p className="text-xs opacity-75">
                          Tap or click any isolated word below to focus typography, inspect spelling, and listen to that individual phoneme chant.
                        </p>

                        <div className="flex flex-wrap gap-2 pt-1">
                          {spotlightVerse.split(/\s+/).map((word, idx) => {
                            const cleanWord = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()॥।]/g, "").trim();
                            if (!cleanWord) return null;
                            
                            const kosaTerm = getMatchingKosaTerm(cleanWord);
                            const hasRef = !!kosaTerm;

                            return (
                              <button
                                key={idx}
                                onClick={() => {
                                  setSelectedWord(word);
                                  handleWordSpeak(word);
                                  setLookupHistory((prev) => {
                                    const filtered = prev.filter((w) => w !== word);
                                    return [word, ...filtered].slice(0, 6);
                                  });
                                }}
                                className={`px-2.5 py-1 text-xs font-serif rounded-none border cursor-pointer transition-all ${
                                  selectedWord === word
                                    ? "bg-current/15 border-current font-bold"
                                    : hasRef
                                    ? spotlightHighContrast
                                      ? "bg-current/10 border-current text-current font-bold hover:bg-current/20 underline decoration-dotted"
                                      : "bg-[#8C6239]/10 border-[#8C6239] text-[#8C6239] hover:bg-[#8C6239]/20"
                                    : "border-current/30 bg-transparent hover:bg-current/10 hover:border-current"
                                }`}
                                title={hasRef ? `Click to view definition for ${kosaTerm.iast} in Kośa` : undefined}
                              >
                                {transliterate(word, spotlightScript)}
                                {hasRef && (
                                  <span className="ml-1 text-[9px] font-sans font-black uppercase opacity-75">📖</span>
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {selectedWord && (
                          <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="p-4 border-2 border-dashed border-current/30 bg-current/5 mt-4 space-y-3 rounded-none flex flex-col justify-between gap-3 text-current"
                          >
                            <div className="space-y-2">
                              <div>
                                <span className={`text-[10px] uppercase tracking-wider font-extrabold block ${spotlightHighContrast ? "text-current" : "text-[#8C6239]"}`}>
                                  Bīja-Pratyaya (Isolated Word Focus)
                                </span>
                                <div className="text-2xl font-serif font-black">
                                  {transliterate(selectedWord, spotlightScript)}
                                </div>
                                <p className="text-[10.5px] font-mono opacity-80 mt-0.5">
                                  Raw: <strong className="font-serif">{selectedWord}</strong> | Length: {selectedWord.length}
                                </p>
                              </div>

                              {/* Cross-reference indicator */}
                              {(() => {
                                const kosaTerm = getMatchingKosaTerm(selectedWord);
                                if (kosaTerm) {
                                  return (
                                    <div className={`border-l-4 pl-3 py-1 pr-2 space-y-1 mt-2 ${spotlightHighContrast ? "border-current bg-current/5" : "border-[#8C6239] bg-[#8C6239]/5"}`}>
                                      <span className={`text-[9px] uppercase tracking-wider font-extrabold block ${spotlightHighContrast ? "text-current" : "text-[#8C6239]"}`}>
                                        Lexicon Cross-Reference Available
                                      </span>
                                      <p className={`text-xs font-serif font-bold ${spotlightHighContrast ? "text-current" : "text-stone-800"}`}>
                                        Found in Kośa: <span className={spotlightHighContrast ? "text-current underline" : "text-[#8C6239]"}>{kosaTerm.term} ({kosaTerm.iast})</span>
                                      </p>
                                      <p className={`text-[10.5px] leading-relaxed line-clamp-2 italic ${spotlightHighContrast ? "text-current/90 font-medium" : "text-stone-650"}`}>
                                        "{kosaTerm.definition}"
                                      </p>
                                      <button
                                        onClick={() => {
                                          window.speechSynthesis.cancel();
                                          setIsSpotlightChanting(false);
                                          setSelectedKosaTermId(kosaTerm.id);
                                          setActiveTab("kosa");
                                          setIsSpotlightOpen(false);
                                        }}
                                        className={`mt-1 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-1 flex items-center gap-1 transition-all cursor-pointer ${
                                          spotlightHighContrast
                                            ? "bg-stone-950 hover:bg-stone-800 border border-stone-950"
                                            : "bg-[#8C6239] hover:bg-[#1A1A1A] border border-[#1A1A1A]"
                                        }`}
                                      >
                                        <span>Open in Kośa Dictionary</span>
                                        <ArrowRight className="w-2.5 h-2.5" />
                                      </button>
                                    </div>
                                  );
                                }
                                return null;
                              })()}

                              {/* Lookup History inside the Focused Word Panel */}
                              {lookupHistory.length > 1 && (
                                <div className="mt-3 pt-2.5 border-t border-current/10">
                                  <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-[9px] uppercase tracking-widest font-black text-stone-500 font-sans flex items-center gap-1">
                                      <Bookmark className="w-2.5 h-2.5 text-[#8C6239]" />
                                      Recent Lookups:
                                    </span>
                                    <button
                                      onClick={() => setLookupHistory([])}
                                      className={`text-[9px] uppercase tracking-wider font-extrabold flex items-center gap-1 transition-colors px-1.5 py-0.5 border cursor-pointer ${
                                        spotlightTheme === "diya" || spotlightTheme === "slate" || spotlightHighContrast
                                          ? "text-red-400 hover:text-red-300 border-red-900/50 hover:border-red-700 bg-red-950/40 hover:bg-red-950/80"
                                          : "text-red-700 hover:text-red-950 border-red-200 hover:border-red-400 bg-red-50 hover:bg-red-100"
                                      }`}
                                      title="Clear entire history"
                                    >
                                      <Trash2 className="w-2.5 h-2.5" />
                                      <span>Clear</span>
                                    </button>
                                  </div>
                                  <div className="flex flex-wrap gap-1.5">
                                    {lookupHistory.map((historyWord, hIdx) => {
                                      const isCurrent = selectedWord === historyWord;
                                      return (
                                        <button
                                          key={`${historyWord}-${hIdx}`}
                                          onClick={() => {
                                            setSelectedWord(historyWord);
                                            handleWordSpeak(historyWord);
                                          }}
                                          className={`px-2 py-0.5 text-[10px] font-serif border rounded-none transition-all cursor-pointer ${
                                            isCurrent
                                              ? "bg-[#8C6239] text-white border-[#8C6239] font-bold"
                                              : "bg-current/10 text-current border-current/30 hover:bg-current/20 hover:border-current"
                                          }`}
                                        >
                                          {transliterate(historyWord, spotlightScript)}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>

                            <button
                              onClick={() => handleWordSpeak(selectedWord)}
                              className="py-1.5 px-3 bg-amber-900 text-white hover:bg-stone-900 border border-current flex items-center justify-center gap-1.5 rounded-none cursor-pointer self-start text-xs"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                              <span>Chant Word</span>
                            </button>
                          </motion.div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Right Pane: Translation & Commentary (with scroll synchronization handler) */}
                  <div
                    ref={transCommentaryPaneRef}
                    onScroll={handleTransCommentaryScroll}
                    className="h-auto lg:h-[calc(100vh-190px)] overflow-y-auto custom-scrollbar p-6 sm:p-8 bg-current/3 border border-current/15 rounded-none flex flex-col space-y-6 text-left transition-colors duration-500 ease-in-out"
                  >
                    <div className="border-b border-current/10 pb-3 flex items-center justify-between sticky top-0 bg-inherit backdrop-blur-xs z-10">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-black tracking-widest uppercase opacity-90 flex items-center gap-1.5">
                          <Compass className="w-3.5 h-3.5 text-[#8C6239]" />
                          Translation & Commentary (भाषानुवादः भाष्यञ्च)
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {isAutoScrollSyncEnabled && (
                          <span className="text-[9px] font-mono font-bold px-2 py-0.5 border border-[#8C6239] text-[#8C6239] bg-[#8C6239]/5 uppercase flex items-center gap-1">
                            <Link2 className="w-2.5 h-2.5" /> Auto-Synced
                          </span>
                        )}
                      </div>
                    </div>

                    {showSpotlightTranslation && (spotlightTranslation || spotlightCommentary) ? (
                      <div className="space-y-6">
                        {/* 1. English Translation / Anuvāda */}
                        {spotlightTranslation && (
                          <div className="space-y-2">
                            <div className="flex items-center gap-1.5 opacity-80 text-[10px] font-extrabold tracking-widest uppercase">
                              <FileText className={`w-3.5 h-3.5 ${spotlightHighContrast ? "text-current" : "text-[#8C6239]"}`} />
                              <span>Anuvāda (English Translation / भाषानुवादः)</span>
                            </div>
                            <div className="p-5 bg-current/5 border border-current/25 rounded-none text-sm leading-relaxed opacity-95">
                              {renderTranslationWithHighlights()}
                            </div>
                          </div>
                        )}

                        {/* 2. Scholastic Commentary / Bhāṣya */}
                        {spotlightCommentary && (
                          <div className="space-y-2">
                            <div className="flex items-center gap-1.5 opacity-80 text-[10px] font-extrabold tracking-widest uppercase">
                              <Compass className={`w-3.5 h-3.5 ${spotlightHighContrast ? "text-current" : "text-[#8C6239]"}`} />
                              <span>Bhāṣya (Scholastic Commentary / भाष्यम्)</span>
                            </div>
                            <div className="p-5 bg-current/5 border border-current/25 rounded-none text-xs leading-relaxed opacity-90">
                              {renderCommentaryWithHighlights()}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-6 text-center text-xs opacity-50 italic">
                        Translation & Commentary display is currently turned off or empty for this verse.
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Unified Single Stack Layout Mode */
                <div className="max-w-4xl mx-auto space-y-8 w-full z-10 text-center transition-colors duration-500 ease-in-out">
                  <div className="border-b border-current/10 pb-4 flex items-center justify-between text-left">
                    <span className="text-[10px] font-bold tracking-widest uppercase opacity-75">
                      Isolated Aphorism Segment (एकान्त-विमर्शः)
                    </span>
                    <span className="text-[9px] font-mono px-2 py-0.5 border border-current bg-current/5 uppercase opacity-60">
                      Script: {spotlightScript}
                    </span>
                  </div>

                  {/* 1. Core Verse */}
                  {showSpotlightVerse && spotlightVerse && (
                    <div
                      className={`font-serif tracking-normal text-center break-words ${
                        spotlightSpacing === "standard"
                          ? "leading-relaxed"
                          : spotlightSpacing === "relaxed"
                          ? "leading-loose"
                          : "leading-loose tracking-wide"
                      }`}
                      style={{ fontSize: `${spotlightFontSize}px` }}
                    >
                      {renderCoreVerseWithHighlights()}
                    </div>
                  )}

                  {/* 2. Scholastic Pada-Ccheda (Word Level Splitter) */}
                  {showSpotlightPadaccheda && spotlightVerse && (
                    <div className="pt-6 border-t border-current/10 space-y-4 text-left">
                      <div className="flex items-center gap-1.5 opacity-80 text-[10px] font-extrabold tracking-widest uppercase">
                        <Sparkles className={`w-3.5 h-3.5 ${spotlightHighContrast ? "text-current" : "text-[#8C6239]"}`} />
                        <span>Pada-Ccheda (Interactive Word Splitter / पदच्छेदः)</span>
                      </div>
                      <p className="text-xs opacity-75 max-w-xl">
                        Tap or click any isolated word below to focus typography, inspect spelling, and listen to that individual phoneme chant.
                      </p>

                      <div className="flex flex-wrap gap-2.5 pt-1.5">
                        {spotlightVerse.split(/\s+/).map((word, idx) => {
                          const cleanWord = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()॥।]/g, "").trim();
                          if (!cleanWord) return null;
                          
                          const kosaTerm = getMatchingKosaTerm(cleanWord);
                          const hasRef = !!kosaTerm;

                          return (
                            <button
                              key={idx}
                              onClick={() => {
                                setSelectedWord(word);
                                handleWordSpeak(word);
                                setLookupHistory((prev) => {
                                  const filtered = prev.filter((w) => w !== word);
                                  return [word, ...filtered].slice(0, 6);
                                });
                              }}
                              className={`px-3 py-1.5 text-xs font-serif rounded-none border cursor-pointer transition-all ${
                                selectedWord === word
                                  ? "bg-current/15 border-current font-bold"
                                  : hasRef
                                  ? spotlightHighContrast
                                    ? "bg-current/10 border-current text-current font-bold hover:bg-current/20 underline decoration-dotted"
                                    : "bg-[#8C6239]/10 border-[#8C6239] text-[#8C6239] hover:bg-[#8C6239]/20"
                                  : "border-current/30 bg-transparent hover:bg-current/10 hover:border-current"
                              }`}
                              title={hasRef ? `Click to view definition for ${kosaTerm.iast} in Kośa` : undefined}
                            >
                              {transliterate(word, spotlightScript)}
                              {hasRef && (
                                <span className="ml-1 text-[9px] font-sans font-black uppercase opacity-75">📖</span>
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {selectedWord && (
                        <motion.div
                          initial={{ scale: 0.95, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="p-4 border-2 border-dashed border-current/30 bg-current/5 mt-4 space-y-3.5 rounded-none flex flex-col md:flex-row md:items-center justify-between gap-4 text-current"
                        >
                          <div className="space-y-2 flex-1">
                            <div>
                              <span className={`text-[10px] uppercase tracking-wider font-extrabold block ${spotlightHighContrast ? "text-current" : "text-[#8C6239]"}`}>
                                Bīja-Pratyaya (Isolated Word Focus)
                              </span>
                              <div className="text-3xl font-serif font-black">
                                {transliterate(selectedWord, spotlightScript)}
                              </div>
                              <p className="text-[11px] font-mono opacity-80 mt-1">
                                Raw Devanagari: <strong className="font-serif">{selectedWord}</strong> | Syllables: {selectedWord.length} syllables
                              </p>
                            </div>

                            {/* Cross-reference indicator and link to Kośa dictionary */}
                            {(() => {
                              const kosaTerm = getMatchingKosaTerm(selectedWord);
                              if (kosaTerm) {
                                return (
                                  <div className={`border-l-4 pl-3 py-1 pr-3 space-y-1 mt-2 ${spotlightHighContrast ? "border-current bg-current/5" : "border-[#8C6239] bg-[#8C6239]/5"}`}>
                                    <span className={`text-[9px] uppercase tracking-wider font-extrabold block ${spotlightHighContrast ? "text-current" : "text-[#8C6239]"}`}>
                                      Lexicon Cross-Reference Available
                                    </span>
                                    <p className={`text-xs font-serif font-bold ${spotlightHighContrast ? "text-current" : "text-stone-800"}`}>
                                      Found in Kośa: <span className={spotlightHighContrast ? "text-current underline" : "text-[#8C6239]"}>{kosaTerm.term} ({kosaTerm.iast})</span>
                                    </p>
                                    <p className={`text-[10.5px] leading-relaxed line-clamp-2 italic ${spotlightHighContrast ? "text-current/90 font-medium" : "text-stone-650"}`}>
                                      "{kosaTerm.definition}"
                                    </p>
                                    <button
                                      onClick={() => {
                                        window.speechSynthesis.cancel();
                                        setIsSpotlightChanting(false);
                                        setSelectedKosaTermId(kosaTerm.id);
                                        setActiveTab("kosa");
                                        setIsSpotlightOpen(false);
                                      }}
                                      className={`mt-1 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-1 flex items-center gap-1 transition-all cursor-pointer ${
                                        spotlightHighContrast
                                          ? "bg-stone-950 hover:bg-stone-800 border border-stone-950"
                                          : "bg-[#8C6239] hover:bg-[#1A1A1A] border border-[#1A1A1A]"
                                      }`}
                                    >
                                      <span>Open in Kośa Dictionary</span>
                                      <ArrowRight className="w-2.5 h-2.5" />
                                    </button>
                                  </div>
                                );
                              }
                              return null;
                            })()}

                            {/* Lookup History inside the Focused Word Panel */}
                            {lookupHistory.length > 1 && (
                              <div className="mt-4 pt-3 border-t border-current/10">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-[9px] uppercase tracking-widest font-black text-stone-500 font-sans flex items-center gap-1">
                                    <Bookmark className="w-2.5 h-2.5 text-[#8C6239]" />
                                    Lookup History (Session):
                                  </span>
                                  <button
                                    onClick={() => setLookupHistory([])}
                                    className={`text-[9px] uppercase tracking-wider font-extrabold flex items-center gap-1 transition-colors px-1.5 py-0.5 border cursor-pointer ${
                                      spotlightTheme === "diya" || spotlightTheme === "slate" || spotlightHighContrast
                                        ? "text-red-400 hover:text-red-300 border-red-900/50 hover:border-red-700 bg-red-950/40 hover:bg-red-950/80"
                                        : "text-red-700 hover:text-red-950 border-red-200 hover:border-red-400 bg-red-50 hover:bg-red-100"
                                    }`}
                                    title="Clear entire history"
                                  >
                                    <Trash2 className="w-2.5 h-2.5" />
                                    <span>Clear</span>
                                  </button>
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                  {lookupHistory.map((historyWord, hIdx) => {
                                    const isCurrent = selectedWord === historyWord;
                                    return (
                                      <button
                                        key={`${historyWord}-${hIdx}`}
                                        onClick={() => {
                                          setSelectedWord(historyWord);
                                          handleWordSpeak(historyWord);
                                        }}
                                        className={`px-2.5 py-1 text-[10px] font-serif border rounded-none transition-all cursor-pointer ${
                                          isCurrent
                                            ? "bg-[#8C6239] text-white border-[#8C6239] font-bold"
                                            : "bg-current/10 text-current border-current/30 hover:bg-current/20 hover:border-current"
                                        }`}
                                      >
                                        {transliterate(historyWord, spotlightScript)}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>

                          <button
                            onClick={() => handleWordSpeak(selectedWord)}
                            className="py-2.5 px-4 bg-amber-900 text-white hover:bg-stone-900 border border-current flex items-center gap-1.5 rounded-none cursor-pointer self-start md:self-center shrink-0"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>Chant</span>
                          </button>
                        </motion.div>
                      )}
                    </div>
                  )}

                  {/* 3. Translation & Commentary */}
                  {showSpotlightTranslation && (spotlightTranslation || spotlightCommentary) && (
                    <div className="pt-6 border-t border-current/10 space-y-6 text-left">
                      {spotlightTranslation && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-1.5 opacity-80 text-[10px] font-extrabold tracking-widest uppercase">
                            <FileText className={`w-3.5 h-3.5 ${spotlightHighContrast ? "text-current" : "text-[#8C6239]"}`} />
                            <span>Anuvāda (English Translation / भाषानुवादः)</span>
                          </div>
                          <div className="p-4 bg-current/5 border border-current/25 rounded-none text-sm leading-relaxed opacity-95">
                            {renderTranslationWithHighlights()}
                          </div>
                        </div>
                      )}

                      {spotlightCommentary && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-1.5 opacity-80 text-[10px] font-extrabold tracking-widest uppercase">
                            <Compass className={`w-3.5 h-3.5 ${spotlightHighContrast ? "text-current" : "text-[#8C6239]"}`} />
                            <span>Bhāṣya (Scholastic Commentary / भाष्यम्)</span>
                          </div>
                          <div className="p-4 bg-current/5 border border-current/25 rounded-none text-xs leading-relaxed opacity-90">
                            {renderCommentaryWithHighlights()}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PDF Generation Loader Overlay */}
      {isGeneratingPDF && (
        <div className="fixed inset-0 bg-black/75 flex flex-col items-center justify-center z-[9999] p-4 text-center select-none font-sans">
          <div className="bg-white border-2 border-[#1A1A1A] p-8 max-w-md w-full space-y-6 rounded-none shadow-2xl relative text-left">
            <div className="h-2 w-full bg-stone-100 overflow-hidden relative border border-[#1A1A1A]">
              <div className="absolute top-0 bottom-0 left-0 bg-[#8C6239] animate-pulse" style={{ width: "100%" }}></div>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-serif font-black text-[#3B2314]">Synthesizing Swādhyāya PDF</h3>
              <p className="text-xs text-stone-500 font-bold uppercase tracking-widest animate-pulse">{pdfProgress}</p>
              <p className="text-[10px] text-stone-400 leading-normal">
                Please wait. The Tarka-Vidyā high-fidelity script renderer is generating vectors and layout grids for the entire scripture. This may take up to 10 seconds.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Workspace Academic Share Modal */}
      <AcademicShareModal
        isOpen={isWorkspaceShareOpen}
        onClose={() => setIsWorkspaceShareOpen(false)}
        payload={workspaceSharePayload}
        targetScript={targetScript}
      />
    </div>
  );
}
