/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
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
import TATTVA_CINTAMANI_SECTIONS_RAW from "../data/tattva-cintamani.json";
import MANAMANOHARA_SECTIONS_RAW from "../data/manamanoharah.json";
import PRAMANASAMUCCAYA_SECTIONS_RAW from "../data/pramanasamuccaya.json";
import PRAMANAVARTTIKA_SECTIONS_RAW from "../data/pramanavarttika.json";
import NYAYAVATARA_SECTIONS_RAW from "../data/nyayavatara.json";
import PRAMANAMIMAMSA_SECTIONS_RAW from "../data/pramanamimamsa.json";
import { NyayaText, NyayaSection } from "../types";
import { jsPDF } from "jspdf";

const NYAYA_TEXTS = NYAYA_TEXTS_RAW as NyayaText[];
const NYAYA_SECTIONS = NYAYA_SECTIONS_RAW as NyayaSection[];
const TARKASASTRAS_SECTIONS = TARKASASTRAS_SECTIONS_RAW as NyayaSection[];
const TARKABHASHA_SECTIONS = TARKABHASHA_SECTIONS_RAW as NyayaSection[];
const LAKSANA_SECTIONS = LAKSANA_SECTIONS_RAW as NyayaSection[];
const VAISESHIKA_SECTIONS = VAISESHIKA_SECTIONS_RAW as NyayaSection[];
const PADARTHA_SECTIONS = PADARTHA_SECTIONS_RAW as NyayaSection[];
const TARKASAMGRAHA_SECTIONS = TARKASAMGRAHA_SECTIONS_RAW as NyayaSection[];
const KARIKAVALI_SECTIONS = KARIKAVALI_SECTIONS_RAW as NyayaSection[];
const ANANDAGIRI_SECTIONS = ANANDAGIRI_SECTIONS_RAW as NyayaSection[];
const VYOMAVATI_SECTIONS = VYOMAVATI_SECTIONS_RAW as NyayaSection[];
const TATTVA_CINTAMANI_SECTIONS = TATTVA_CINTAMANI_SECTIONS_RAW as NyayaSection[];
const MANAMANOHARA_SECTIONS = MANAMANOHARA_SECTIONS_RAW as NyayaSection[];
const PRAMANASAMUCCAYA_SECTIONS = PRAMANASAMUCCAYA_SECTIONS_RAW as NyayaSection[];
const PRAMANAVARTTIKA_SECTIONS = PRAMANAVARTTIKA_SECTIONS_RAW as NyayaSection[];
const NYAYAVATARA_SECTIONS = NYAYAVATARA_SECTIONS_RAW as NyayaSection[];
const PRAMANAMIMAMSA_SECTIONS = PRAMANAMIMAMSA_SECTIONS_RAW as NyayaSection[];

export function getSectionSourceForText(id?: string): NyayaSection[] {
  switch (id) {
    case "tarka-sastram": return TARKASASTRAS_SECTIONS;
    case "tarka-samgraha": return TARKASAMGRAHA_SECTIONS;
    case "tarkabhasha": return TARKABHASHA_SECTIONS;
    case "laksana-sangraha": return LAKSANA_SECTIONS;
    case "vaiseasika-sutras": return VAISESHIKA_SECTIONS;
    case "padartha-dharmasamgraha": return PADARTHA_SECTIONS;
    case "karikavali":
    case "nyayasiddhantamuktavali": return KARIKAVALI_SECTIONS;
    case "anandagiri-tarkasangraha": return ANANDAGIRI_SECTIONS;
    case "vyomavati": return VYOMAVATI_SECTIONS;
    case "tattva-cintamani": return TATTVA_CINTAMANI_SECTIONS;
    case "manamanoharah": return MANAMANOHARA_SECTIONS;
    case "pramanasamuccaya": return PRAMANASAMUCCAYA_SECTIONS;
    case "pramanavarttika": return PRAMANAVARTTIKA_SECTIONS;
    case "nyayavatara": return NYAYAVATARA_SECTIONS;
    case "pramānamimāmsā": return PRAMANAMIMAMSA_SECTIONS;
    case "nyaya-sutras":
    default: return NYAYA_SECTIONS;
  }
}

export function getInitialSectionForText(id?: string): string {
  switch (id) {
    case "nyaya-sutras": return "sec-intro";
    case "vaiseasika-sutras": return "vaiseasika-1";
    case "tarka-samgraha": return "tarkasamgraha-1";
    case "tattva-cintamani": return "tattva-cintamani-1";
    case "padartha-dharmasamgraha": return "padartha-1";
    case "manamanoharah": return "manamanohara-1";
    case "pramanasamuccaya": return "pramanasamuccaya-1";
    case "pramanavarttika": return "pramanavarttika-1";
    case "nyayavatara": return "nyayavatara-1";
    case "pramānamimāmsā": return "pramanamimamsa-1";
    case "tarka-sastram": return "tarka-1";
    case "tarkabhasha": return "tarkabhasha-1";
    case "laksana-sangraha": return "laksana-1";
    case "karikavali":
    case "nyayasiddhantamuktavali": return "karikavali-1";
    case "anandagiri-tarkasangraha": return "anandagiri-tarkasangraha-1";
    case "vyomavati": return "vyomavati-1";
    default: return "sec-intro";
  }
}

export function getDefaultChaptersForText(id?: string): number[] {
  switch (id) {
    case "tarka-samgraha": return [1, 2, 3, 4, 5, 6];
    case "tarka-sastram":
    case "tarkabhasha":
    case "laksana-sangraha":
    case "manamanoharah":
    case "pramanasamuccaya":
    case "pramanavarttika":
    case "nyayavatara":
    case "pramānamimāmsā":
    case "karikavali":
    case "nyayasiddhantamuktavali": return [1, 2, 3, 4];
    case "padartha-dharmasamgraha": return [1, 2, 3, 4];
    case "vyomavati": return [1, 2, 3, 4, 5, 6, 7];
    case "tattva-cintamani": return [1, 4];
    case "nyaya-sutras":
    case "vaiseasika-sutras":
    case "anandagiri-tarkasangraha":
    default: return [1, 2, 3, 4, 5];
  }
}
import { 
  BookOpen, 
  Search, 
  Clock, 
  ArrowRight, 
  Compass, 
  Volume2, 
  Pause, 
  Play, 
  Sparkles, 
  Maximize2, 
  Minimize2, 
  Bookmark, 
  ChevronLeft, 
  ChevronRight, 
  Grid, 
  List,
  Columns,
  Printer,
  ZoomIn,
  ZoomOut,
  Mail,
  Share2
} from "lucide-react";
import { transliterate, formatSanskrit } from "../utils/transliteration";
import { renderHighlightedText } from "../utils/termHighlighter";
import FeedbackMaildesk from "./FeedbackMaildesk";
import AcademicShareModal, { AcademicSharePayload } from "./AcademicShareModal";

interface GranthasaraniProps {
  onLoadTextToCuration: (text: string) => void;
  onLoadTextToTranslation: (text: string) => void;
  selectedTextId?: string | null;
  initialSectionId?: string | null;
  initialSutraIndex?: number | null;
  scriptTheme: "devanagari" | "gregorian" | "combined";
  targetScript: string;
  onTriggerReader?: (
    text: string,
    sutras?: any[],
    index?: number,
    lang?: "english" | "hindi" | "bengali"
  ) => void;
}

export default function Granthasarani({
  onLoadTextToCuration,
  onLoadTextToTranslation,
  selectedTextId,
  initialSectionId,
  initialSutraIndex,
  scriptTheme,
  targetScript,
  onTriggerReader,
}: GranthasaraniProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSchool, setSelectedSchool] = useState<string>("All");
  const [selectedText, setSelectedText] = useState<NyayaText | null>(NYAYA_TEXTS[0]);
  const isStructuredText = true;
  const [isPlayingText, setIsPlayingText] = useState(false);
  const [selectedSectionId, setSelectedSectionId] = useState<string>("sec-intro");
  const [sutraLang, setSutraLang] = useState<"english" | "hindi" | "bengali">("english");
  
  // Clean reading optimization states
  const [focusMode, setFocusMode] = useState(false);
  const [isLibraryExpanded, setIsLibraryExpanded] = useState(false);
  const [showMetadata, setShowMetadata] = useState(false);
  const [expandedSutras, setExpandedSutras] = useState<Record<string, boolean>>({});

  // Chapter-wise selection state (Chapter 1, 2, 3, 4, 5, 6)
  const [selectedChapters, setSelectedChapters] = useState<number[]>([1, 2, 3, 4, 5, 6]);

  // Content specifications toggles
  const [showSanskritSutra, setShowSanskritSutra] = useState(true);
  const [showTranslation, setShowTranslation] = useState(true);
  const [showCommentarySanskrit, setShowCommentarySanskrit] = useState(true); // vritti
  const [showCommentaryModern, setShowCommentaryModern] = useState(true); // modern hermeneutics
  const [selectedCommentary, setSelectedCommentary] = useState<string>("all");

  // Navigation and layout modes
  const [readerLayout, setReaderLayout] = useState<"continuous" | "single">("continuous");
  const [activeSutraIndex, setActiveSutraIndex] = useState(0);
  const hasUserNavigatedRef = useRef(false);
  const [isReaderFullscreen, setIsReaderFullscreen] = useState(false);
  const [readerFontSize, setReaderFontSize] = useState<"sm" | "base" | "lg" | "xl">("base");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [pdfProgress, setPdfProgress] = useState("");

  // Split-view / Comparative Mode states and Panel B states
  const [isSplitView, setIsSplitView] = useState(false);
  const [selectedTextB, setSelectedTextB] = useState<NyayaText | null>(NYAYA_TEXTS[1] || NYAYA_TEXTS[0]);
  const [selectedSectionIdB, setSelectedSectionIdB] = useState<string>("sec-intro");
  const [activeSutraIndexB, setActiveSutraIndexB] = useState(0);
  const [readerLayoutB, setReaderLayoutB] = useState<"continuous" | "single">("continuous");
  const [selectedChaptersB, setSelectedChaptersB] = useState<number[]>([1, 2, 3, 4, 5, 6]);
  const [expandedSutrasB, setExpandedSutrasB] = useState<Record<string, boolean>>({});
  const [isPlayingTextB, setIsPlayingTextB] = useState(false);
  const [sutraLangB, setSutraLangB] = useState<"english" | "hindi" | "bengali">("english");
  const [showSanskritSutraB, setShowSanskritSutraB] = useState(true);
  const [showTranslationB, setShowTranslationB] = useState(true);
  const [showCommentarySanskritB, setShowCommentarySanskritB] = useState(true);
  const [showCommentaryModernB, setShowCommentaryModernB] = useState(true);
  const [selectedCommentaryB, setSelectedCommentaryB] = useState<string>("all");
  const [showMetadataB, setShowMetadataB] = useState(false);
  const isStructuredTextB = true;

  const handleSelectText = (text: NyayaText) => {
    setSelectedText(text);
    const defaultChaps = getDefaultChaptersForText(text.id);
    setSelectedChapters(defaultChaps);
    const initSec = getInitialSectionForText(text.id);
    setSelectedSectionId(initSec);
    setActiveSutraIndex(0);
    const comms = getCommentaryHeadersForText(text.id);
    setSelectedCommentary(comms.length > 0 ? (text.id === "tarka-samgraha" ? "dipika" : comms[0]) : "all");
    setIsLibraryExpanded(false);
  };

  const handleSelectTextB = (text: NyayaText) => {
    setSelectedTextB(text);
    const defaultChapsB = getDefaultChaptersForText(text.id);
    setSelectedChaptersB(defaultChapsB);
    const initSecB = getInitialSectionForText(text.id);
    setSelectedSectionIdB(initSecB);
    setActiveSutraIndexB(0);
    const commsB = getCommentaryHeadersForText(text.id);
    setSelectedCommentaryB(commsB.length > 0 ? (text.id === "tarka-samgraha" ? "dipika" : commsB[0]) : "all");
  };

  // Swipe gesture support
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [reportingSutraId, setReportingSutraId] = useState<string | null>(null);
  const [gangesaTab, setGangesaTab] = useState<"pramanya" | "akanksha" | "yogyata" | "akanksha2" | "asatti">("pramanya");

  // Academic Share State
  const [shareModalPayload, setShareModalPayload] = useState<AcademicSharePayload | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const handleShareSutra = (sutra: any, sec?: any) => {
    const activeSec = sec || sectionsSource.find((s) => s.id === selectedSectionId) || sectionsSource[0];
    const curLang = sutraLang;
    const translationText = sutra.translations?.[curLang] || sutra.translations?.english || "";
    setShareModalPayload({
      title: `Sūtra ${sutra.sutraNum}: ${sutra.heading?.split(" (")[0] || ""}`,
      sanskritText: transliterate(sutra.devanagari, targetScript),
      transliteration: sutra.devanagari,
      translation: translationText,
      source: `${selectedText?.titleEnglish || "Treatise"} (${selectedText?.author || "Classical Nyāya-Vaiśeṣika"})`,
      chapterOrSection: activeSec ? `Section: ${activeSec.titleEnglish?.split(" (")[0] || ""}` : undefined,
      category: "verse",
      url: typeof window !== "undefined" ? `${window.location.origin}${window.location.pathname}?tab=library&text=${selectedText?.id}&sec=${activeSec?.id}&sutra=${sutra.sutraNum}` : "https://tarkavidya.in",
    });
    setIsShareModalOpen(true);
  };

  const handleShareCurrentTreatise = () => {
    if (!selectedText) return;
    setShareModalPayload({
      title: `${selectedText.titleEnglish} (${selectedText.titleDevanagari})`,
      sanskritText: transliterate(selectedText.titleDevanagari, targetScript),
      transliteration: selectedText.titleDevanagari,
      translation: `${selectedText.period ? `Philosophical Era: ${selectedText.period}. ` : ""}Tradition: ${selectedText.tradition || "Nyāya-Vaiśeṣika System"}. Author: ${selectedText.author || "Classical Ācārya"}.`,
      source: `${selectedText.titleEnglish} — Tarka-Vidyā Text Repository`,
      category: "verse",
      url: typeof window !== "undefined" ? `${window.location.origin}${window.location.pathname}?tab=library&text=${selectedText.id}` : "https://tarkavidya.in",
    });
    setIsShareModalOpen(true);
  };

  // Reading Progress State
  const [savedProgress, setSavedProgress] = useState<{
    textId: string;
    sectionId?: string;
    textTitle: string;
    sectionTitle?: string;
    timestamp: string;
  } | null>(null);

  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  // Load saved progress on mount
  useEffect(() => {
    const stored = localStorage.getItem("tarka_reading_progress");
    if (stored) {
      try {
        setSavedProgress(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse saved reading progress:", e);
      }
    }
  }, []);

  // Save current progress to local storage
  const handleSaveProgress = () => {
    if (!selectedText) return;
    
    // Find active section if Gautamīya Nyāyasūtra or Tarkaśāstram
    const activeSection = isStructuredText 
      ? sectionsSource.find((s) => s.id === selectedSectionId) 
      : null;

    const progress = {
      textId: selectedText.id,
      sectionId: isStructuredText ? selectedSectionId : undefined,
      textTitle: selectedText.title,
      sectionTitle: activeSection ? activeSection.titleEnglish.split(" (")[0] : undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + " on " + new Date().toLocaleDateString()
    };

    localStorage.setItem("tarka_reading_progress", JSON.stringify(progress));
    setSavedProgress(progress);
    setShowSaveSuccess(true);
    setTimeout(() => {
      setShowSaveSuccess(false);
    }, 3000);
  };

  // Restore saved progress
  const handleRestoreProgress = () => {
    if (!savedProgress) return;
    const foundText = NYAYA_TEXTS.find((t) => t.id === savedProgress.textId);
    if (foundText) {
      setSelectedText(foundText);
      if (savedProgress.sectionId) {
        setSelectedSectionId(savedProgress.sectionId);
      }
    }
  };

  // Clear saved progress
  const handleClearProgress = () => {
    localStorage.removeItem("tarka_reading_progress");
    setSavedProgress(null);
  };

  // Synchronize when outer navigation changes chosen text
  useEffect(() => {
    if (selectedTextId) {
      const found = NYAYA_TEXTS.find((text) => text.id === selectedTextId);
      if (found) {
        setSelectedText(found);
      }
    }
  }, [selectedTextId]);

  // Handle cross-tab search selection
  useEffect(() => {
    if (selectedTextId && initialSectionId) {
      setSelectedSectionId(initialSectionId);
      if (typeof initialSutraIndex === "number") {
        setActiveSutraIndex(initialSutraIndex);
      }
    }
  }, [selectedTextId, initialSectionId, initialSutraIndex]);

  // Synchronize chapter and section states when book changes
  useEffect(() => {
    if (!selectedText) return;
    
    // Check if initialSectionId belongs to the selected text. If so, we will use it!
    const availableSections = getSectionSourceForText(selectedText.id);
    const hasMatchingInitialSec = initialSectionId && availableSections.some(s => s.id === initialSectionId);

    const defaultChapters = getDefaultChaptersForText(selectedText.id);
    setSelectedChapters(defaultChapters);

    if (hasMatchingInitialSec && initialSectionId) {
      setSelectedSectionId(initialSectionId);
    } else {
      const initSec = getInitialSectionForText(selectedText.id);
      setSelectedSectionId(initSec);
    }

    if (selectedText.id === "tarka-samgraha") {
      setSelectedCommentary("dipika");
    } else {
      const comms = getCommentaryHeadersForText(selectedText.id);
      if (comms.length > 0) {
        setSelectedCommentary(comms[0]);
      } else {
        setSelectedCommentary("all");
      }
    }
  }, [selectedText]);

  // Synchronize chapter and section states for Panel B when book changes
  useEffect(() => {
    if (!selectedTextB) return;
    const defaultChaptersB = getDefaultChaptersForText(selectedTextB.id);
    setSelectedChaptersB(defaultChaptersB);
    const initSecB = getInitialSectionForText(selectedTextB.id);
    setSelectedSectionIdB(initSecB);

    if (selectedTextB.id === "tarka-samgraha") {
      setSelectedCommentaryB("dipika");
    } else {
      const comms = getCommentaryHeadersForText(selectedTextB.id);
      if (comms.length > 0) {
        setSelectedCommentaryB(comms[0]);
      } else {
        setSelectedCommentaryB("all");
      }
    }
  }, [selectedTextB]);

  // Handle speaker state on text load/unload
  useEffect(() => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingText(false);
    setIsPlayingTextB(false);
  }, [selectedText, selectedTextB]);

  // Expand first few commentaries by default when section changes
  useEffect(() => {
    setExpandedSutras({});
  }, [selectedSectionId, selectedText]);

  useEffect(() => {
    setExpandedSutrasB({});
  }, [selectedSectionIdB, selectedTextB]);

  const handleSpeakText = (text: string, isB: boolean = false) => {
    if ("speechSynthesis" in window) {
      const playing = isB ? isPlayingTextB : isPlayingText;
      if (playing) {
        window.speechSynthesis.cancel();
        if (isB) setIsPlayingTextB(false);
        else setIsPlayingText(false);
        return;
      }
      
      window.speechSynthesis.cancel(); // cancel any active reading before starting a new one
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "hi-IN"; // Devanagari Sanskrit phonetic locale
      utterance.rate = 0.85; // scholastic recital speed
      utterance.onend = () => {
        if (isB) setIsPlayingTextB(false);
        else setIsPlayingText(false);
      };
      
      window.speechSynthesis.speak(utterance);
      if (isB) {
        setIsPlayingTextB(true);
        setIsPlayingText(false);
      } else {
        setIsPlayingText(true);
        setIsPlayingTextB(false);
      }
    } else {
      alert("Browser speech synthesis/voice narration is not supported on this platform.");
    }
  };

  const toggleSutraCommentary = (sutraId: string) => {
    setExpandedSutras(prev => ({
      ...prev,
      [sutraId]: !prev[sutraId]
    }));
  };

  const toggleSutraCommentaryB = (sutraId: string) => {
    setExpandedSutrasB(prev => ({
      ...prev,
      [sutraId]: !prev[sutraId]
    }));
  };

  // Helper to extract all unique commentary headers dynamically from any structured text
  const getCommentaryHeadersForText = (textId: string): string[] => {
    const source = getSectionSourceForText(textId);

    const headers: string[] = [];
    for (const sec of source) {
      if (sec.sutras) {
        for (const sutra of sec.sutras) {
          if (sutra.commentarySanskrit) {
            const parts = sutra.commentarySanskrit.split("【");
            for (let i = 1; i < parts.length; i++) {
              const part = parts[i];
              const closedBracketIndex = part.indexOf("】");
              if (closedBracketIndex !== -1) {
                const header = part.substring(0, closedBracketIndex).trim();
                if (header && !headers.includes(header)) {
                  headers.push(header);
                }
              }
            }
          }
        }
      }
    }
    return headers;
  };

  const filterCommentary = (text: string, selection: string): string => {
    if (!text) return "";
    if (selection === "all") return text;
    
    // Split by 【 to parse sections like 【 ... 】
    const parts = text.split("【");
    let result = "";
    
    // If the original text didn't start with '【', there is some text before the first '【'
    if (parts[0] && parts[0].trim()) {
      result += parts[0];
    }
    
    const sections: { header: string; raw: string }[] = [];
    for (let i = 1; i < parts.length; i++) {
      const part = parts[i];
      const closedBracketIndex = part.indexOf("】");
      if (closedBracketIndex !== -1) {
        const header = part.substring(0, closedBracketIndex).trim();
        sections.push({ header, raw: "【" + part });
      } else {
        if (sections.length > 0) {
          sections[sections.length - 1].raw += "【" + part;
        }
      }
    }

    if (sections.length === 0) {
      return text;
    }

    const matched = sections.filter(s => 
      s.header.toLowerCase() === selection.toLowerCase() ||
      s.header.toLowerCase().includes(selection.toLowerCase()) ||
      selection.toLowerCase().includes(s.header.toLowerCase())
    );

    if (matched.length > 0) {
      return matched.map(m => m.raw).join("\n\n").trim();
    }

    return "";
  };

  // Helper to determine chapter of a section
  const getChapterNumOfSection = (sec: any): number => {
    if (!sec) return 1;
    if (selectedText?.id === "tarka-sastram") {
      if (sec.id.includes("tarka-2")) return 2;
      if (sec.id.includes("tarka-3")) return 3;
      return 1;
    }
    if (selectedText?.id === "tarka-samgraha") {
      if (sec.id.includes("tarkasamgraha-2")) return 2;
      if (sec.id.includes("tarkasamgraha-3")) return 3;
      if (sec.id.includes("tarkasamgraha-4")) return 4;
      if (sec.id.includes("tarkasamgraha-5")) return 5;
      if (sec.id.includes("tarkasamgraha-6")) return 6;
      return 1;
    }
    if (selectedText?.id === "tarkabhasha") {
      if (sec.id.includes("tarkabhasha-2")) return 2;
      if (sec.id.includes("tarkabhasha-3")) return 3;
      return 1;
    }
    if (selectedText?.id === "laksana-sangraha") {
      if (sec.id.includes("laksana-2")) return 2;
      if (sec.id.includes("laksana-3")) return 3;
      return 1;
    }
    if (selectedText?.id === "vaiseasika-sutras") {
      if (sec.id.includes("vaiseasika-1") || sec.id.includes("vaiseasika-2")) return 1;
      if (sec.id.includes("vaiseasika-3") || sec.id.includes("vaiseasika-4")) return 2;
      if (sec.id.includes("vaiseasika-5")) return 3;
      if (sec.id.includes("vaiseasika-6")) return 4;
      if (sec.id.includes("vaiseasika-7")) return 5;
      return 1;
    }
    if (selectedText?.id === "padartha-dharmasamgraha") {
      if (sec.id.includes("padartha-1")) return 1;
      if (sec.id.includes("padartha-2")) return 2;
      if (sec.id.includes("padartha-3") || sec.id.includes("padartha-5")) return 3;
      if (sec.id.includes("padartha-4")) return 4;
      return 1;
    }
    if (selectedText?.id === "karikavali" || selectedText?.id === "nyayasiddhantamuktavali") {
      if (sec.id.includes("karikavali-2")) return 2;
      if (sec.id.includes("karikavali-3")) return 3;
      return 1;
    }
    if (selectedText?.id === "anandagiri-tarkasangraha") {
      if (sec.id.includes("anandagiri-tarkasangraha-2")) return 2;
      if (sec.id.includes("anandagiri-tarkasangraha-3")) return 3;
      if (sec.id.includes("anandagiri-tarkasangraha-4")) return 4;
      if (sec.id.includes("anandagiri-tarkasangraha-5")) return 5;
      return 1;
    }
    if (selectedText?.id === "vyomavati") {
      if (sec.id.includes("vyomavati-2")) return 2;
      if (sec.id.includes("vyomavati-3")) return 3;
      if (sec.id.includes("vyomavati-4")) return 4;
      if (sec.id.includes("vyomavati-5")) return 5;
      if (sec.id.includes("vyomavati-6")) return 6;
      if (sec.id.includes("vyomavati-7")) return 7;
      return 1;
    }
    if (selectedText?.id === "manamanoharah") {
      if (sec.id.includes("manamanohara-2")) return 2;
      if (sec.id.includes("manamanohara-3")) return 3;
      return 1;
    }
    if (selectedText?.id === "pramanasamuccaya") {
      if (sec.id.includes("pramanasamuccaya-2")) return 2;
      if (sec.id.includes("pramanasamuccaya-3")) return 3;
      return 1;
    }
    if (selectedText?.id === "pramanavarttika") {
      if (sec.id.includes("pramanavarttika-2")) return 2;
      if (sec.id.includes("pramanavarttika-3")) return 3;
      return 1;
    }
    if (selectedText?.id === "nyayavatara") {
      if (sec.id.includes("nyayavatara-2")) return 2;
      return 1;
    }
    if (selectedText?.id === "pramānamimāmsā") {
      if (sec.id.includes("pramanamimamsa-2")) return 2;
      return 1;
    }
    if (selectedText?.id === "tattva-cintamani") {
      return 1;
    }
    const firstSutra = sec.sutras?.[0];
    if (!firstSutra) return 1;
    const sutraId = firstSutra.id; // e.g. "1.1.1" or "3.1.2"
    if (sutraId.startsWith("1.")) return 1;
    if (sutraId.startsWith("2.")) return 2;
    if (sutraId.startsWith("3.")) return 3;
    if (sutraId.startsWith("4.")) return 4;
    if (sutraId.startsWith("5.")) return 5;
    return 1;
  };

  const sectionsSource = getSectionSourceForText(selectedText?.id);

  const activeSections = sectionsSource.filter((sec) => {
    const ch = getChapterNumOfSection(sec);
    return selectedChapters.includes(ch);
  });

  // Synchronize active section selection if active chapters change
  useEffect(() => {
    const effectiveSecs = activeSections.length > 0 ? activeSections : sectionsSource;
    const isValid = effectiveSecs.some((sec) => sec.id === selectedSectionId);
    if (!isValid && effectiveSecs.length > 0) {
      setSelectedSectionId(effectiveSecs[0].id);
    }
  }, [selectedChapters, selectedSectionId, activeSections, sectionsSource]);

  // Reset active sutra index when section changes
  useEffect(() => {
    setActiveSutraIndex(0);
  }, [selectedSectionId]);

  // Synchronize selectedCommentary when the selected text changes
  useEffect(() => {
    if (selectedText) {
      const comms = getCommentaryHeadersForText(selectedText.id);
      if (comms.length > 0) {
        setSelectedCommentary(comms[0]); // Default to the first available commentary
      } else {
        setSelectedCommentary("all");
      }
    }
  }, [selectedText]);

  useEffect(() => {
    if (selectedTextB) {
      const comms = getCommentaryHeadersForText(selectedTextB.id);
      if (comms.length > 0) {
        setSelectedCommentaryB(comms[0]); // Default to the first available commentary
      } else {
        setSelectedCommentaryB("all");
      }
    }
  }, [selectedTextB]);

  // Helper to determine chapter of a section (Panel B)
  const getChapterNumOfSectionB = (sec: any): number => {
    if (!sec) return 1;
    if (selectedTextB?.id === "tarka-sastram") {
      if (sec.id.includes("tarka-2")) return 2;
      if (sec.id.includes("tarka-3")) return 3;
      return 1;
    }
    if (selectedTextB?.id === "tarka-samgraha") {
      if (sec.id.includes("tarkasamgraha-2")) return 2;
      if (sec.id.includes("tarkasamgraha-3")) return 3;
      if (sec.id.includes("tarkasamgraha-4")) return 4;
      if (sec.id.includes("tarkasamgraha-5")) return 5;
      if (sec.id.includes("tarkasamgraha-6")) return 6;
      return 1;
    }
    if (selectedTextB?.id === "tarkabhasha") {
      if (sec.id.includes("tarkabhasha-2")) return 2;
      if (sec.id.includes("tarkabhasha-3")) return 3;
      return 1;
    }
    if (selectedTextB?.id === "laksana-sangraha") {
      if (sec.id.includes("laksana-2")) return 2;
      if (sec.id.includes("laksana-3")) return 3;
      return 1;
    }
    if (selectedTextB?.id === "vaiseasika-sutras") {
      if (sec.id.includes("vaiseasika-1") || sec.id.includes("vaiseasika-2")) return 1;
      if (sec.id.includes("vaiseasika-3") || sec.id.includes("vaiseasika-4")) return 2;
      if (sec.id.includes("vaiseasika-5")) return 3;
      if (sec.id.includes("vaiseasika-6")) return 4;
      if (sec.id.includes("vaiseasika-7")) return 5;
      return 1;
    }
    if (selectedTextB?.id === "padartha-dharmasamgraha") {
      if (sec.id.includes("padartha-1")) return 1;
      if (sec.id.includes("padartha-2")) return 2;
      if (sec.id.includes("padartha-3") || sec.id.includes("padartha-5")) return 3;
      if (sec.id.includes("padartha-4")) return 4;
      return 1;
    }
    if (selectedTextB?.id === "karikavali" || selectedTextB?.id === "nyayasiddhantamuktavali") {
      if (sec.id.includes("karikavali-2")) return 2;
      if (sec.id.includes("karikavali-3")) return 3;
      return 1;
    }
    if (selectedTextB?.id === "anandagiri-tarkasangraha") {
      if (sec.id.includes("anandagiri-tarkasangraha-2")) return 2;
      if (sec.id.includes("anandagiri-tarkasangraha-3")) return 3;
      if (sec.id.includes("anandagiri-tarkasangraha-4")) return 4;
      if (sec.id.includes("anandagiri-tarkasangraha-5")) return 5;
      return 1;
    }
    if (selectedTextB?.id === "vyomavati") {
      if (sec.id.includes("vyomavati-2")) return 2;
      if (sec.id.includes("vyomavati-3")) return 3;
      if (sec.id.includes("vyomavati-4")) return 4;
      if (sec.id.includes("vyomavati-5")) return 5;
      if (sec.id.includes("vyomavati-6")) return 6;
      if (sec.id.includes("vyomavati-7")) return 7;
      return 1;
    }
    if (selectedTextB?.id === "manamanoharah") {
      if (sec.id.includes("manamanohara-2")) return 2;
      if (sec.id.includes("manamanohara-3")) return 3;
      return 1;
    }
    if (selectedTextB?.id === "pramanasamuccaya") {
      if (sec.id.includes("pramanasamuccaya-2")) return 2;
      if (sec.id.includes("pramanasamuccaya-3")) return 3;
      return 1;
    }
    if (selectedTextB?.id === "pramanavarttika") {
      if (sec.id.includes("pramanavarttika-2")) return 2;
      if (sec.id.includes("pramanavarttika-3")) return 3;
      return 1;
    }
    if (selectedTextB?.id === "nyayavatara") {
      if (sec.id.includes("nyayavatara-2")) return 2;
      return 1;
    }
    if (selectedTextB?.id === "pramānamimāmsā") {
      if (sec.id.includes("pramanamimamsa-2")) return 2;
      return 1;
    }
    if (selectedTextB?.id === "tattva-cintamani") {
      return 1;
    }
    const firstSutra = sec.sutras?.[0];
    if (!firstSutra) return 1;
    const sutraId = firstSutra.id;
    if (sutraId.startsWith("1.")) return 1;
    if (sutraId.startsWith("2.")) return 2;
    if (sutraId.startsWith("3.")) return 3;
    if (sutraId.startsWith("4.")) return 4;
    if (sutraId.startsWith("5.")) return 5;
    return 1;
  };

  const sectionsSourceB = getSectionSourceForText(selectedTextB?.id);

  const activeSectionsB = sectionsSourceB.filter((sec) => {
    const ch = getChapterNumOfSectionB(sec);
    return selectedChaptersB.includes(ch);
  });

  // Synchronize active section selection if active chapters change for Panel B
  useEffect(() => {
    const effectiveSecsB = activeSectionsB.length > 0 ? activeSectionsB : sectionsSourceB;
    const isValid = effectiveSecsB.some((sec) => sec.id === selectedSectionIdB);
    if (!isValid && effectiveSecsB.length > 0) {
      setSelectedSectionIdB(effectiveSecsB[0].id);
    }
  }, [selectedChaptersB, selectedSectionIdB, activeSectionsB, sectionsSourceB]);

  // Reset active sutra index when section changes for Panel B
  useEffect(() => {
    setActiveSutraIndexB(0);
  }, [selectedSectionIdB]);

  const maxChapters = (selectedText?.id === "tarka-sastram" || selectedText?.id === "tarka-samgraha" || selectedText?.id === "tarkabhasha" || selectedText?.id === "laksana-sangraha" || selectedText?.id === "karikavali" || selectedText?.id === "nyayasiddhantamuktavali") ? 3 : 5;

  const handleNextSutra = () => {
    hasUserNavigatedRef.current = true;
    const currentSecIndex = activeSections.findIndex((s) => s.id === selectedSectionId);
    const currentSection = activeSections[currentSecIndex] || activeSections[0];
    if (!currentSection) return;
    const totalSutras = currentSection.sutras.length;

    if (activeSutraIndex < totalSutras - 1) {
      setActiveSutraIndex(activeSutraIndex + 1);
    } else if (currentSecIndex < activeSections.length - 1) {
      // Transition to first sutra of next section
      const nextSec = activeSections[currentSecIndex + 1];
      setSelectedSectionId(nextSec.id);
      setActiveSutraIndex(0);
    } else {
      // Seamlessly transition to the next chapter if available
      const currentCh = getChapterNumOfSection(currentSection);
      if (currentCh < maxChapters) {
        const nextCh = currentCh + 1;
        setSelectedChapters([nextCh]);
        const nextSections = sectionsSource.filter(sec => getChapterNumOfSection(sec) === nextCh);
        if (nextSections.length > 0) {
          setSelectedSectionId(nextSections[0].id);
          setActiveSutraIndex(0);
        }
      }
    }
  };

  const handlePrevSutra = () => {
    hasUserNavigatedRef.current = true;
    const currentSecIndex = activeSections.findIndex((s) => s.id === selectedSectionId);
    if (currentSecIndex === -1) return;
    const currentSection = activeSections[currentSecIndex];

    if (activeSutraIndex > 0) {
      setActiveSutraIndex(activeSutraIndex - 1);
    } else if (currentSecIndex > 0) {
      // Transition to last sutra of previous section
      const prevSec = activeSections[currentSecIndex - 1];
      setSelectedSectionId(prevSec.id);
      setActiveSutraIndex(prevSec.sutras.length - 1);
    } else {
      // Seamlessly transition to the previous chapter if available
      const currentCh = getChapterNumOfSection(currentSection);
      if (currentCh > 1) {
        const prevCh = currentCh - 1;
        setSelectedChapters([prevCh]);
        const prevSections = sectionsSource.filter(sec => getChapterNumOfSection(sec) === prevCh);
        if (prevSections.length > 0) {
          const lastSecOfPrevCh = prevSections[prevSections.length - 1];
          setSelectedSectionId(lastSecOfPrevCh.id);
          setActiveSutraIndex(lastSecOfPrevCh.sutras.length - 1);
        }
      }
    }
  };

  const handleNextChapter = () => {
    hasUserNavigatedRef.current = true;
    const currentCh = selectedChapters[0] || 1;
    if (currentCh < maxChapters) {
      const nextCh = currentCh + 1;
      setSelectedChapters([nextCh]);
      const nextSections = sectionsSource.filter(sec => getChapterNumOfSection(sec) === nextCh);
      if (nextSections.length > 0) {
        setSelectedSectionId(nextSections[0].id);
        setActiveSutraIndex(0);
      }
    }
  };

  const handlePrevChapter = () => {
    hasUserNavigatedRef.current = true;
    const currentCh = selectedChapters[0] || 1;
    if (currentCh > 1) {
      const prevCh = currentCh - 1;
      setSelectedChapters([prevCh]);
      const prevSections = sectionsSource.filter(sec => getChapterNumOfSection(sec) === prevCh);
      if (prevSections.length > 0) {
        setSelectedSectionId(prevSections[0].id);
        setActiveSutraIndex(0);
      }
    }
  };

  const handleNextSection = () => {
    hasUserNavigatedRef.current = true;
    const currentSecIndex = activeSections.findIndex((s) => s.id === selectedSectionId);
    if (currentSecIndex < activeSections.length - 1) {
      setSelectedSectionId(activeSections[currentSecIndex + 1].id);
      setActiveSutraIndex(0);
    } else {
      handleNextChapter();
    }
  };

  const handlePrevSection = () => {
    hasUserNavigatedRef.current = true;
    const currentSecIndex = activeSections.findIndex((s) => s.id === selectedSectionId);
    if (currentSecIndex > 0) {
      setSelectedSectionId(activeSections[currentSecIndex - 1].id);
      setActiveSutraIndex(0);
    } else {
      // Transition to previous chapter's last section
      const currentCh = selectedChapters[0] || 1;
      if (currentCh > 1) {
        const prevCh = currentCh - 1;
        setSelectedChapters([prevCh]);
        const prevSections = sectionsSource.filter(sec => getChapterNumOfSection(sec) === prevCh);
        if (prevSections.length > 0) {
          setSelectedSectionId(prevSections[prevSections.length - 1].id);
          setActiveSutraIndex(0);
        }
      }
    }
  };

  const maxChaptersB = (selectedTextB?.id === "tarka-sastram" || selectedTextB?.id === "tarka-samgraha" || selectedTextB?.id === "tarkabhasha" || selectedTextB?.id === "laksana-sangraha" || selectedTextB?.id === "karikavali" || selectedTextB?.id === "nyayasiddhantamuktavali") ? 3 : 5;

  const handleNextSutraB = () => {
    const currentSecIndex = activeSectionsB.findIndex((s) => s.id === selectedSectionIdB);
    const currentSection = activeSectionsB[currentSecIndex] || activeSectionsB[0];
    if (!currentSection) return;
    const totalSutras = currentSection.sutras.length;

    if (activeSutraIndexB < totalSutras - 1) {
      setActiveSutraIndexB(activeSutraIndexB + 1);
    } else if (currentSecIndex < activeSectionsB.length - 1) {
      // Transition to first sutra of next section
      const nextSec = activeSectionsB[currentSecIndex + 1];
      setSelectedSectionIdB(nextSec.id);
      setActiveSutraIndexB(0);
    } else {
      // Seamlessly transition to the next chapter if available
      const currentCh = getChapterNumOfSectionB(currentSection);
      if (currentCh < maxChaptersB) {
        const nextCh = currentCh + 1;
        setSelectedChaptersB([nextCh]);
        const nextSections = sectionsSourceB.filter(sec => getChapterNumOfSectionB(sec) === nextCh);
        if (nextSections.length > 0) {
          setSelectedSectionIdB(nextSections[0].id);
          setActiveSutraIndexB(0);
        }
      }
    }
  };

  const handlePrevSutraB = () => {
    const currentSecIndex = activeSectionsB.findIndex((s) => s.id === selectedSectionIdB);
    if (currentSecIndex === -1) return;
    const currentSection = activeSectionsB[currentSecIndex];

    if (activeSutraIndexB > 0) {
      setActiveSutraIndexB(activeSutraIndexB - 1);
    } else if (currentSecIndex > 0) {
      // Transition to last sutra of previous section
      const prevSec = activeSectionsB[currentSecIndex - 1];
      setSelectedSectionIdB(prevSec.id);
      setActiveSutraIndexB(prevSec.sutras.length - 1);
    } else {
      // Seamlessly transition to the previous chapter if available
      const currentCh = getChapterNumOfSectionB(currentSection);
      if (currentCh > 1) {
        const prevCh = currentCh - 1;
        setSelectedChaptersB([prevCh]);
        const prevSections = sectionsSourceB.filter(sec => getChapterNumOfSectionB(sec) === prevCh);
        if (prevSections.length > 0) {
          const lastSecOfPrevCh = prevSections[prevSections.length - 1];
          setSelectedSectionIdB(lastSecOfPrevCh.id);
          setActiveSutraIndexB(lastSecOfPrevCh.sutras.length - 1);
        }
      }
    }
  };

  const handleNextChapterB = () => {
    const currentCh = selectedChaptersB[0] || 1;
    if (currentCh < maxChaptersB) {
      const nextCh = currentCh + 1;
      setSelectedChaptersB([nextCh]);
      const nextSections = sectionsSourceB.filter(sec => getChapterNumOfSectionB(sec) === nextCh);
      if (nextSections.length > 0) {
        setSelectedSectionIdB(nextSections[0].id);
        setActiveSutraIndexB(0);
      }
    }
  };

  const handlePrevChapterB = () => {
    const currentCh = selectedChaptersB[0] || 1;
    if (currentCh > 1) {
      const prevCh = currentCh - 1;
      setSelectedChaptersB([prevCh]);
      const prevSections = sectionsSourceB.filter(sec => getChapterNumOfSectionB(sec) === prevCh);
      if (prevSections.length > 0) {
        setSelectedSectionIdB(prevSections[0].id);
        setActiveSutraIndexB(0);
      }
    }
  };

  const handleNextSectionB = () => {
    const currentSecIndex = activeSectionsB.findIndex((s) => s.id === selectedSectionIdB);
    if (currentSecIndex < activeSectionsB.length - 1) {
      setSelectedSectionIdB(activeSectionsB[currentSecIndex + 1].id);
      setActiveSutraIndexB(0);
    } else {
      handleNextChapterB();
    }
  };

  const handlePrevSectionB = () => {
    const currentSecIndex = activeSectionsB.findIndex((s) => s.id === selectedSectionIdB);
    if (currentSecIndex > 0) {
      setSelectedSectionIdB(activeSectionsB[currentSecIndex - 1].id);
      setActiveSutraIndexB(0);
    } else {
      // Transition to previous chapter's last section
      const currentCh = selectedChaptersB[0] || 1;
      if (currentCh > 1) {
        const prevCh = currentCh - 1;
        setSelectedChaptersB([prevCh]);
        const prevSections = sectionsSourceB.filter(sec => getChapterNumOfSectionB(sec) === prevCh);
        if (prevSections.length > 0) {
          setSelectedSectionIdB(prevSections[prevSections.length - 1].id);
          setActiveSutraIndexB(0);
        }
      }
    }
  };

  // Keyboard arrow listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      if (isStructuredText) {
        if (e.key === "ArrowRight") {
          handleNextSutra();
        } else if (e.key === "ArrowLeft") {
          handlePrevSutra();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedText, selectedChapters, selectedSectionId, activeSutraIndex, activeSections]);

  // Scroll active sūtra into view in continuous mode
  useEffect(() => {
    if (readerLayout === "continuous" && isStructuredText) {
      if (hasUserNavigatedRef.current) {
        const currentSection = activeSections.find((s) => s.id === selectedSectionId) || activeSections[0];
        if (currentSection) {
          const activeSutra = currentSection.sutras[activeSutraIndex];
          if (activeSutra) {
            const element = document.getElementById(`sutra-card-${activeSutra.id}`);
            if (element) {
              element.scrollIntoView({ behavior: "smooth", block: "nearest" });
            }
          }
        }
        hasUserNavigatedRef.current = false;
      }
    }
  }, [activeSutraIndex, selectedSectionId, readerLayout, selectedText, activeSections]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStartX - touchEndX;

    if (Math.abs(diffX) > 50) { // 50px swipe threshold
      if (diffX > 0) {
        handleNextSutra();
      } else {
        handlePrevSutra();
      }
    }
    setTouchStartX(null);
  };

  const handleDownloadFullBookPDF = async () => {
    if (!selectedText) return;
    setIsGeneratingPDF(true);
    setPdfProgress("Initializing document...");

    try {
      // Small timeout to let the loader render
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
          const transText = sutra.translations[sutraLang] || sutra.translations["english"] || "";
          const commText = (sutra.commentary && sutra.commentary[sutraLang]) || (sutra.commentary && sutra.commentary["english"]) || "";

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

  const filteredTexts = NYAYA_TEXTS.filter((text) => {
    const matchesSearch =
      text.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      text.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      text.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSchool = selectedSchool === "All" || text.school === selectedSchool;
    return matchesSearch && matchesSchool;
  });

  // Split other books to display below selected book
  const otherTexts = filteredTexts.filter((t) => t.id !== selectedText?.id);

  const renderGangesaShabdaKhanda = (panelId: "A" | "B") => {
    // Current active targetScript
    const transliterateText = (txt: string) => transliterate(txt, targetScript);

    // Dynamic recitation / speech support
    const handleRecitation = (txt: string) => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(txt);
        utterance.lang = "sa-IN";
        utterance.rate = 0.8;
        window.speechSynthesis.speak(utterance);
      } else {
        alert("Speech synthesis is not supported in this browser.");
      }
    };

    const stopRecitation = () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };

    const gangesaTabsData = {
      pramanya: {
        title: "१. शब्दप्रामाण्यवादः (Originative Validity of Word)",
        sanskrit: `अथ शब्दो निरूप्यते । प्रयोगहेतुभूतार्थतत्त्वज्ञानजन्य: शब्द: प्रमाणम् । करणञ्च तत् यस्मिन् सति क्रिया भवत्येव ।\n\nन च शब्दे सति प्रमा भवत्येवेति नायं शब्द: प्रामणम् । न च शब्दो न प्रमाणमिति वाक्यस्य प्रामाण्याप्रमाण्ययोव्र्याघात:...`,
        siddhanta: "In Gangeśa's Śabdaprāmāṇyavāda, verbal testimony (Śabda) is established as an independent instrument of valid knowledge (Pramāṇa), distinct from Inference (Anumāna). Gangeśa refutes Vaiśeṣika and Buddhist attempts to reduce Śabda to Anumāna by demonstrating that the cognitive process of understanding a sentence (Anvaya-bodha) is unique and direct, relying on semantic relationships rather than logical concomitance (Vyāpti)."
      },
      akanksha: {
        title: "२. शब्दाकाङ्क्षावादः (Syntactic Expectancy)",
        sanskrit: `अथाकाङ्क्षा निरूप्यते । का तर्ह्ययमाकाङ्क्षा? अभिधानप्रयोजनाभाव इति चेत्, न । पुरुषस्य तदभावेऽपि शब्दानां आकाङ्क्षासत्त्वात् । तस्मात् यस्य पदस्य यत्पदव्यतिरेकप्रयुक्त-अन्वयानुभावकत्व-अभावः तस्य तदाकाङ्क्षा ।\n\nयद्वा अभिधानापर्यवसानं आकाङ्क्षा। सा च द्विविधा—उत्पत्तावपूर्वाकाङ्क्षा, ज्ञप्तावनुपस्थिताकाङ्क्षा च । सा च शब्दनिष्ठा न तु पुरुषनिष्ठा जिज्ञासा, जिज्ञासाविरहेऽपि व्युत्पन्नस्य वाक्यादन्वयबोधात् ।`,
        siddhanta: "Expectancy (Ākāṅkṣā) is defined as Abhidhānāparyavasānam—the non-completion of the utterance's capacity to generate syntactic relational understanding (anvaya-bodha) without another word. This definition centers on grammatical interdependency of words (e.g., nouns with case endings, verbs with agents) rather than purely psychological desires or curiosity of the listener."
      },
      yogyata: {
        title: "३. योग्यतावादः (Semantic Compatibility)",
        sanskrit: `ननु का योग्यता, न तावत् सजातीयेऽन्वयदर्शनं, यथाकथञ्चित् साजात्यस्याव्यावत्र्तकत्वात् । पदार्थतावच्छेदकेन साजात्यस्याद्यजात: पय: पिबतीत्यदावभावात् वाक्यार्थस्यापूर्वत्वाच्च । नापि समभिव्याह्मतपदार्थसंसर्गव्याप्यधर्मवत्त्वं, वाक्यार्थस्यानुमेयत्वापत्ते: ।\n\nउच्यते—बाधकप्रमाविरहो योग्यता, सा चेतरपदार्थसंसर्गेऽपरपदार्थनिष्ठात्यन्ताभावप्रतियोगित्वप्रमाविशेष्यत्वाभाव: । वस्तुतस्त्वितरपदार्थसंसर्गेऽपरपदार्थनिष्ठात्यन्ताभावप्रतियोगितावच्छेदकधर्मशून्यत्वं योग्यता लाघवात् शक्यज्ञानत्वाञ्च ।`,
        siddhanta: "In Gangeśa's formulation, Yogyatā is defined as the absence of valid contradictory knowledge (bādhaka-pramā-virahaḥ). Furthermore, Gangeśa argues that actual compatibility is not required in reality for understanding a sentence; rather, the mere cognition of compatibility (which may be a valid certainty, a doubt, or even a temporary illusion) is what acts as the cause of verbal comprehension."
      },
      akanksha2: {
        title: "४. शब्दाकाङ्क्षावादः (अध्याहारः - Cognitive Postulation)",
        sanskrit: `घट: कर्मत्वं आनयनं कृतिरित्यादौ अभेदेन नान्वयबोधोऽयोग्यत्वात् तत्तत्पदेभ्यस्तात्पर्यविषयतत्तत्पदार्थस्वरूपज्ञानञ्च पदान्तरं विनैव । घटमानयतीत्यत्रेव भ्रमेण तथान्वयतात्पर्येऽपि क्रिया -कारकभावेन नान्वय: नाम-विभकि-धात्वाख्यात-क्रिया-कारकपदानां अन्वयबोधे तान्येव पदानि समर्थानि न तु तदर्थकानि पदान्तराणि ।\n\nअस्माकन्तु पदेन स्वार्थे अभिहिते पश्चात् आकाङ्क्षा-योग्यता-आसत्तिवशेन पदार्थानां मिथः संसर्गबोधो जायते इति अभिहितान्वयवाद एव ज्यायान् । 'पदं स्वं स्वं पदार्थमभिधाय निवृत्तव्यापारं भवति, पश्चात् पदार्था एव वाक्यार्थं बोधयन्ति' इति न्यायानुसारिणः ।`,
        siddhanta: "This section addresses the foundational Navya-Nyāya debate between Abhihitānvayavāda (the connection of expressed referents) and Anvitābhidhānavāda (the expression of connected referents). Gaṅgeśa defends the Nyāya stance of Abhihitānvaya, arguing that words first express their individual lexical meanings (abhidhā), which are subsequently connected into a unified sentence-meaning (vākyārtha) through the synthetic power of expectancy, compatibility, and proximity."
      },
      asatti: {
        title: "५. आसत्तिवादः (Contiguity / Proximity)",
        sanskrit: `अथ आसत्तिवादः निरूप्यते । किमिदम् आसत्तिः? अव्यवधानेन पदजन्य-पदार्थोपस्थितिः आसत्तिः । सा च शाब्दबोधे कारणम् । यत्र 'गवि' इति उच्चार्य प्रहरान्तरे 'अस्ति' इति पद्यते, तत्र न शाब्दबोधः, व्यवधानात् ।\n\nनव्यास्तु—पदविशेषजन्य-पदार्थोपस्थितिरेव आसत्तिः, सा चाव्यवहिता ग्राह्या । समभिव्याहृतपदानां अव्यवधानेन उच्चारणं वा, तेन जनितोपस्थितेरव्यवधानं वा आसत्तिरिति सिद्धान्तः ।`,
        siddhanta: "In Gaṅgeśa’s Āsattivāda, contiguity (Āsatti) is defined as the uninterrupted cognitive presentation of the word-meanings (pada-janya-padārtha-upasthitiḥ). It requires that the constituent words and their meanings be recalled in close temporal proximity. Even if words possess expectancy and compatibility, a long temporal delay or intervening irrelevant cognitions will disrupt the synthesis necessary for anvaya-bodha."
      }
    };

    const activeTab = gangesaTabsData[gangesaTab];

    return (
      <div className="bg-[#FFFDF9] border-2 border-[#8C6239] p-4 sm:p-6 md:p-8 space-y-6 relative rounded-none select-text text-left">
        <div className="absolute left-2.5 top-0 bottom-0 w-0.5 bg-red-800/10 pointer-events-none"></div>
        <div className="absolute right-2.5 top-0 bottom-0 w-0.5 bg-red-800/10 pointer-events-none"></div>

        {/* Title */}
        <div className="border-b-2 border-[#1A1A1A] pb-3 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div>
            <h3 className="text-base sm:text-lg font-serif font-black text-[#3B2314]">
              तत्त्वचिन्तामणिः — चतुर्थः खण्डः (शब्दखण्डः)
            </h3>
            <p className="text-xs text-stone-500 font-sans font-bold">
              Gaṅgeśa Upādhyāya’s Great Treatise of Navya-Nyāya Logic
            </p>
          </div>
          <div className="flex gap-1.5 shrink-0">
            <span className="text-[10px] bg-[#3B2314] text-white px-2.5 py-1 font-bold uppercase tracking-wider rounded-none">
              Chapter 4 (Śabda)
            </span>
            <span className="text-[10px] bg-amber-800 text-white px-2.5 py-1 font-bold uppercase tracking-wider rounded-none">
              Offline Dialectic Stream
            </span>
          </div>
        </div>

        {/* 5 sub-chapter selection tabs */}
        <div className="flex flex-wrap gap-1 border-b border-stone-200 pb-2">
          {(Object.keys(gangesaTabsData) as Array<keyof typeof gangesaTabsData>).map((key) => {
            const isActive = gangesaTab === key;
            const displayTitle = key === "pramanya" ? "शब्दप्रामाण्यवादः" :
                                 key === "akanksha" ? "शब्दाकाङ्क्षावादः" :
                                 key === "yogyata" ? "योग्यतावादः" :
                                 key === "akanksha2" ? "शब्दाकाङ्क्षावादः" :
                                 "आसत्तिवादः";
            return (
              <button
                key={key}
                onClick={() => setGangesaTab(key)}
                className={`px-3 py-2 text-xs font-serif font-black cursor-pointer transition-all border rounded-none ${
                  isActive 
                    ? "bg-[#3B2314] text-white border-[#3B2314] shadow-xs" 
                    : "bg-white text-stone-700 border-stone-250 hover:bg-[#FAF8F5]"
                }`}
              >
                {transliterateText(displayTitle)}
              </button>
            );
          })}
        </div>

        {/* Sub-chapter Heading */}
        <div className="bg-[#FAF8F5] p-3 border-l-4 border-[#8C6239] font-sans font-bold text-xs text-[#3B2314] flex flex-wrap justify-between items-center gap-2">
          <span>{transliterateText(activeTab.title)}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleRecitation(activeTab.sanskrit)}
              className="px-2 py-1 bg-stone-100 hover:bg-[#8C6239] hover:text-white border border-stone-300 text-[10px] uppercase font-bold flex items-center gap-1 cursor-pointer transition-all rounded-none"
            >
              Play Recitation 🔊
            </button>
            <button
              onClick={stopRecitation}
              className="px-2 py-1 bg-stone-100 hover:bg-stone-300 border border-stone-300 text-[10px] uppercase font-bold flex items-center gap-1 cursor-pointer transition-all rounded-none"
            >
              Stop ⏹
            </button>
          </div>
        </div>

        {/* Sanskrit Manuscript Display */}
        <div className="bg-white border-y border-[#8C6239]/15 py-6 px-4 sm:px-6 relative text-center overflow-hidden shadow-inner font-serif">
          <div className="absolute left-2.5 top-0 bottom-0 w-0.5 bg-red-800/10 pointer-events-none"></div>
          <div className="absolute right-2.5 top-0 bottom-0 w-0.5 bg-red-800/10 pointer-events-none"></div>
          <p className="text-base sm:text-lg md:text-xl font-serif font-black text-stone-900 leading-loose tracking-wide whitespace-pre-line max-w-3xl mx-auto break-words">
            {transliterateText(activeTab.sanskrit)}
          </p>
          <div className="mt-4 pt-3 border-t border-dashed border-stone-150 text-[10px] font-mono text-stone-400">
            Source Text: Tattvacintāmaṇi Śabdakhaṇḍa • Devanāgarī: {activeTab.sanskrit.slice(0, 40)}...
          </div>
        </div>

        {/* Philosophical Insight Card */}
        <div className="border-t-2 border-dashed border-[#8C6239]/20 pt-4 space-y-3 font-sans">
          <span className="text-[10px] text-[#8C6239] font-black uppercase tracking-wider block font-mono">
            Siddhānta Philosophical Insight:
          </span>
          <p className="text-xs sm:text-sm text-stone-850 leading-relaxed text-justify break-words font-medium">
            {activeTab.siddhanta}
          </p>
        </div>

        {/* Inline Feedback / Maildesk integration */}
        <div className="border-t border-stone-200 pt-4 flex justify-between items-center">
          <span className="text-[9px] text-stone-400 font-mono font-bold">
            Editorial Curators: tarkavidya@gmail.com
          </span>
          <button
            onClick={() => setReportingSutraId(reportingSutraId === activeTab.title ? null : activeTab.title)}
            className="px-3 py-1.5 bg-[#FAF8F5] hover:bg-red-50 text-red-700 hover:text-red-900 border border-red-200 text-[10px] font-sans font-black uppercase tracking-wider cursor-pointer rounded-none transition-all flex items-center gap-1"
          >
            Report Typo / Correction
          </button>
        </div>

        {reportingSutraId === activeTab.title && (
          <div className="mt-4 border-2 border-red-800 bg-[#FFF5F5] p-2 animate-fade-in text-left font-sans">
            <div className="bg-red-900 text-white font-sans text-[10px] font-black uppercase tracking-wider px-3 py-1.5 mb-2.5">
              Reporting Correction for Gaṅgeśa's Śabda-Khaṇḍa: {activeTab.title}
            </div>
            <FeedbackMaildesk
              initialType="correction"
              initialSourceText={`Tattvacintāmaṇi Ch 4 - ${activeTab.title}`}
              initialSelection={activeTab.sanskrit}
              isEmbed={true}
            />
          </div>
        )}
      </div>
    );
  };

  const renderReaderPanel = (
    panelId: "A" | "B",
    text: NyayaText | null,
    isStructured: boolean,
    showMeta: boolean,
    setShowMeta: (v: boolean) => void,
    isPlaying: boolean,
    sLang: "english" | "hindi" | "bengali",
    setSLang: (v: "english" | "hindi" | "bengali") => void,
    selChapters: number[],
    setSelChapters: (v: number[]) => void,
    selSectionId: string,
    setSelSectionId: (v: string) => void,
    actSections: typeof activeSections,
    rLayout: "continuous" | "single",
    setRLayout: (v: "continuous" | "single") => void,
    actSutraIndex: number,
    setActSutraIndex: (v: number) => void,
    expSutras: Record<string, boolean>,
    toggleCommentary: (id: string) => void,
    showSanskrit: boolean,
    setShowSanskrit: (v: boolean) => void,
    showTrans: boolean,
    setShowTrans: (v: boolean) => void,
    showCommSanskrit: boolean,
    setShowCommSanskrit: (v: boolean) => void,
    showCommModern: boolean,
    setShowCommModern: (v: boolean) => void,
    selCommentary: string,
    setSelCommentary: (v: string) => void,
    onNextSutra: () => void,
    onPrevSutra: () => void,
    onNextSection: () => void,
    onPrevSection: () => void,
    sectSource: typeof sectionsSource,
    getChNum: (sec: any) => number
  ) => {
    if (!text) {
      return (
        <div className="bg-[#FAF8F5] rounded-none border-2 border-dashed border-[#1A1A1A] py-24 text-center h-full flex flex-col justify-center items-center">
          <BookOpen className="w-8 h-8 text-[#795548] mx-auto animate-pulse" />
          <p className="text-sm font-bold text-[#1A1A1A] mt-2 font-serif">Select a treatise to load this panel.</p>
        </div>
      );
    }

    return (
      <div className="bg-white border-2 border-[#1A1A1A] rounded-none p-4 sm:p-6 md:p-8 space-y-6 shadow-none break-words relative text-left">
        
        {/* Scholastic Reader Header */}
        <div className="border-b border-[#1A1A1A] pb-4">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              {/* Primary Title */}
              <h3 className="text-xl sm:text-2xl md:text-3xl font-serif font-black text-[#3B2314] leading-tight break-words">
                {transliterate(text.devanagariTitle, targetScript)}
              </h3>
              <div className="flex flex-wrap items-center gap-1.5 mt-1 text-[11px] text-stone-500 font-medium">
                <span className="font-sans font-bold tracking-wide">({text.title})</span>
                <span>•</span>
                <span className="italic">Dated to {text.century}</span>
                <span>•</span>
                <span>By {text.author}</span>
              </div>
            </div>
            
            {/* School Badge & Focus Indicator */}
            <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
              <span className="text-[9px] bg-[#FAF8F5] text-[#3B2314] border border-[#1A1A1A] px-2.5 py-1 rounded-none font-bold uppercase tracking-wider">
                {text.school} School
              </span>
              {focusMode && panelId === "A" && (
                <span className="text-[8px] bg-[#EBF7ED] text-emerald-800 border border-emerald-300 px-2 py-1 rounded-none font-sans font-black uppercase tracking-widest animate-pulse">
                  Focus ON
                </span>
              )}
            </div>
          </div>

          {/* Sub-Header Utility Strip */}
          <div className="mt-4 pt-3 border-t border-dashed border-stone-200 flex flex-wrap items-center justify-between gap-3 text-[10px] font-sans">
            
            {/* Recitation Player */}
            <div className="flex items-center gap-2 bg-[#FAF8F5] border border-stone-250 py-1.5 px-3 rounded-none">
              <span className="font-extrabold text-[#795548] uppercase tracking-wider flex items-center gap-1 shrink-0">
                <Volume2 className="w-3.5 h-3.5" />
                श्रवणम् | Recitation
              </span>
              <button
                onClick={() => handleSpeakText(text.sampleAphorism || text.sampleOcrText || text.description, panelId === "B")}
                className={`py-0.5 px-2 font-black uppercase text-[8px] rounded-none border transition-all cursor-pointer flex items-center gap-1 ${
                  isPlaying 
                    ? "bg-[#1A1A1A] text-white border-[#1A1A1A]" 
                    : "bg-white text-[#795548] border-[#795548] hover:bg-[#795548] hover:text-white"
                }`}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-2.5 h-2.5 animate-bounce" />
                    <span>Stop</span>
                  </>
                ) : (
                  <>
                    <Play className="w-2.5 h-2.5 fill-[#795548] hover:fill-white" />
                    <span>Listen</span>
                  </>
                )}
              </button>
            </div>

            {/* Bookmark Save & Toggle Info Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowMeta(!showMeta)}
                className={`px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider border rounded-none cursor-pointer transition-all ${
                  showMeta 
                    ? "bg-[#1A1A1A] text-white border-[#1A1A1A]" 
                    : "bg-white text-stone-600 border-stone-300 hover:border-[#1A1A1A]"
                }`}
              >
                {showMeta ? "Hide Text Details ▴" : "Show Text Details ▾"}
              </button>
              
              {panelId === "A" && (
                <>
                  <button
                    onClick={handleSaveProgress}
                    className="px-3 py-1.5 bg-[#FAF8F5] hover:bg-[#795548] hover:text-white text-[#1A1A1A] border border-[#1A1A1A] font-black uppercase tracking-wider cursor-pointer transition-all rounded-none flex items-center gap-1"
                  >
                    <span>Bookmark Page</span>
                  </button>

                  <button
                    onClick={handleShareCurrentTreatise}
                    className="px-3 py-1.5 bg-[#FAF8F5] hover:bg-[#8C6239] hover:text-white text-[#8C6239] border border-[#8C6239] font-black uppercase tracking-wider cursor-pointer transition-all rounded-none flex items-center gap-1 shadow-xs"
                    title="Share this treatise on WhatsApp, X, Facebook, or Copy Citation Link"
                  >
                    <Share2 className="w-3 h-3" />
                    <span>Share Treatise</span>
                  </button>
                </>
              )}
              
              {panelId === "A" && showSaveSuccess && (
                <span className="text-[9px] font-bold text-emerald-800 bg-emerald-50 px-2 py-1 border border-emerald-300 animate-fade-in shrink-0">
                  Saved!
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Collapsible Metadata Card */}
        {(showMeta || !isStructured) && (
          <div className="bg-[#FAF8F5] border border-stone-200 p-4 space-y-4 animate-fade-in font-sans rounded-none">
            <div>
              <h4 className="text-[10px] font-black text-[#795548] uppercase tracking-widest mb-1">
                Historical Epistemological Role
              </h4>
              <p className="text-xs text-stone-750 leading-relaxed text-left sm:text-justify break-words font-medium">
                {text.description}
              </p>
            </div>

            {text.commentaries.length > 0 && (
              <div className="border-t border-dashed border-stone-200 pt-3">
                <h4 className="text-[10px] font-black text-[#1A1A1A] uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-[#795548]" />
                  Intellectual Lineage & Commentaries (टीका-परम्परा)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-2">
                  {text.commentaries.map((com, index) => (
                    <div key={index} className="flex items-center gap-1.5 text-xs text-[#1A1A1A]">
                      <ArrowRight className="w-3 h-3 text-[#795548] shrink-0" />
                      <span className="font-medium break-words">{com}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Sample excerpt if not structured */}
        {!isStructured && (
          <div className="space-y-4">
            <div className="bg-[#FAF8F3] border border-[#8C6239]/20 p-4 sm:p-5 rounded-none relative">
              <span className="text-[9px] font-black uppercase text-[#8C6239] tracking-wider block mb-2">
                Sūtra / Text Excerpt (मूलग्रन्थखण्डः):
              </span>
              <p className="text-base sm:text-lg font-serif font-black text-stone-900 leading-relaxed text-center py-4 px-2 bg-white border-y border-[#8C6239]/10 break-words">
                {transliterate(text.sampleAphorism || text.sampleOcrText || "", targetScript)}
              </p>
              {onTriggerReader && (
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={() => onTriggerReader(text.sampleAphorism || text.sampleOcrText || "")}
                    className="px-3 py-1.5 bg-[#3B2314] hover:bg-[#1A1A1A] text-white text-[9px] font-black uppercase tracking-wider rounded-none cursor-pointer flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Open in Immersive Reader</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Sūtra Pāṭha Section Selector & Interactive Grid for Structured Texts */}
        {isStructured && (
          <div className="space-y-6">
            
            {/* Reader Customizer & Specification Console */}
            <div className="bg-[#FAF8F5] border-2 border-[#1A1A1A] p-4.5 space-y-4 font-sans rounded-none shadow-xs text-left">
              <div className="flex items-center gap-1.5 border-b border-stone-250 pb-2">
                <Sparkles className="w-4 h-4 text-[#795548]" />
                <h4 className="text-xs font-black text-[#3B2314] uppercase tracking-widest">
                  Reader Customizer & Specification Console (स्वाध्याय-विकल्पाः)
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Chapters selection */}
                <div className="space-y-2">
                  <span className="text-[9px] font-black text-stone-500 uppercase tracking-widest block">
                    1. Select Chapters to see together (अध्यायचयनम्):
                  </span>
                  <div className="flex flex-col gap-1.5 bg-white p-2.5 border border-stone-200">
                    <div className="flex flex-wrap gap-2">
                      {[1, 2, 3, 4, 5, 6, 7].slice(0, text.id === "tattva-cintamani" ? 4 : (text.id === "tarka-sastram" || text.id === "tarkabhasha" || text.id === "laksana-sangraha" || text.id === "karikavali" || text.id === "nyayasiddhantamuktavali") ? 3 : text.id === "tarka-samgraha" ? 6 : text.id === "padartha-dharmasamgraha" ? 4 : text.id === "vyomavati" ? 7 : 5).map((chap) => {
                        const isChecked = selChapters.includes(chap);
                        return (
                          <label key={chap} className="flex items-center gap-1.5 text-xs font-bold cursor-pointer select-none bg-[#FAF8F5] py-1 px-2 border hover:border-[#1A1A1A]">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {
                                if (isChecked) {
                                  setSelChapters(selChapters.filter((c) => c !== chap));
                                } else {
                                  setSelChapters([...selChapters, chap].sort());
                                }
                              }}
                              className="w-3.5 h-3.5 accent-[#795548]"
                            />
                            <span>{text.id === "tarka-sastram" ? "Prakaraṇa" : text.id === "tarka-samgraha" ? "Khaṇḍa" : "Chapter"} {chap}</span>
                          </label>
                        );
                      })}
                    </div>
                    <div className="flex items-center gap-2 pt-1 border-t border-stone-100 text-[8.5px] font-bold">
                      <button
                        onClick={() => setSelChapters([1])}
                        className="text-[#795548] hover:underline uppercase"
                      >
                        {text.id === "tarka-sastram" || text.id === "tarkabhasha" || text.id === "laksana-sangraha" || text.id === "anandagiri-tarkasangraha" ? "Prak 1 Only" : text.id === "tarka-samgraha" ? "Sec 1 Only" : "Ch 1 Only"}
                      </button>
                      <span className="text-stone-300">|</span>
                      <button
                        onClick={() => setSelChapters([1, 2])}
                        className="text-[#795548] hover:underline uppercase"
                      >
                        {text.id === "tarka-sastram" || text.id === "tarkabhasha" || text.id === "laksana-sangraha" || text.id === "anandagiri-tarkasangraha" ? "Prak 1 - 2" : text.id === "tarka-samgraha" ? "Sec 1 - 2" : "Ch 1 - 2"}
                      </button>
                      {text.id === "tattva-cintamani" && (
                        <>
                          <span className="text-stone-300">|</span>
                          <button
                            onClick={() => setSelChapters([4])}
                            className="text-[#795548] hover:underline uppercase font-extrabold"
                          >
                            Ch 4 Only (Śabdakhaṇḍa)
                          </button>
                        </>
                      )}
                      <span className="text-stone-300">|</span>
                      <button
                        onClick={() => setSelChapters(text.id === "tattva-cintamani" ? [4] : text.id === "tarka-sastram" || text.id === "tarkabhasha" || text.id === "laksana-sangraha" ? [1, 2, 3] : text.id === "tarka-samgraha" ? [1, 2, 3, 4, 5, 6] : text.id === "padartha-dharmasamgraha" ? [1, 2, 3, 4] : text.id === "vyomavati" ? [1, 2, 3, 4, 5, 6, 7] : [1, 2, 3, 4, 5])}
                        className="text-[#795548] hover:underline uppercase"
                      >
                        Full Book ({text.id === "tattva-cintamani" ? "1-4" : text.id === "tarka-sastram" || text.id === "tarkabhasha" || text.id === "laksana-sangraha" ? "1-3" : text.id === "tarka-samgraha" ? "1-6" : text.id === "padartha-dharmasamgraha" ? "1-4" : text.id === "vyomavati" ? "1-7" : "1-5"})
                      </button>
                    </div>
                  </div>
                </div>

                {/* Visible Columns / Commentary choice */}
                <div className="space-y-2">
                  <span className="text-[9px] font-black text-stone-500 uppercase tracking-widest block">
                    2. Content Display Toggles (प्रदर्शनाविकल्पाः):
                  </span>
                  <div className="grid grid-cols-2 gap-1.5 bg-white p-2.5 border border-stone-200">
                    <label className="flex items-center gap-1.5 text-[10px] font-bold cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={showSanskrit}
                        onChange={(e) => setShowSanskrit(e.target.checked)}
                        className="w-3.5 h-3.5 accent-[#795548]"
                      />
                      <span>Sanskrit Sūtra</span>
                    </label>
                    <label className="flex items-center gap-1.5 text-[10px] font-bold cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={showTrans}
                        onChange={(e) => setShowTrans(e.target.checked)}
                        className="w-3.5 h-3.5 accent-[#795548]"
                      />
                      <span>Translation</span>
                    </label>
                    <label className="flex items-center gap-1.5 text-[10px] font-bold cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={showCommSanskrit}
                        onChange={(e) => setShowCommSanskrit(e.target.checked)}
                        className="w-3.5 h-3.5 accent-[#795548]"
                      />
                      <span>Sanskrit Bhāṣya</span>
                    </label>
                    <label className="flex items-center gap-1.5 text-[10px] font-bold cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={showCommModern}
                        onChange={(e) => setShowCommModern(e.target.checked)}
                        className="w-3.5 h-3.5 accent-[#795548]"
                      />
                      <span>Modern Hermeneutics</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Advanced Commentary Filter Selection */}
              {showCommSanskrit && (
                <div className="pt-2 border-t border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <span className="text-[9.5px] font-black text-stone-650 uppercase tracking-wider flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-[#795548]" />
                    Filter Commentary Stream:
                  </span>
                  <select
                    value={selCommentary}
                    onChange={(e) => setSelCommentary(e.target.value)}
                    className="bg-white text-[#1A1A1A] border-2 border-[#1A1A1A] py-1 px-2.5 text-[10px] font-sans font-black uppercase cursor-pointer rounded-none focus:outline-none"
                  >
                    {/* Dynamically extracted commentaries */}
                    {getCommentaryHeadersForText(text.id).length > 0 ? (
                      <>
                        {getCommentaryHeadersForText(text.id).map((header) => (
                          <option key={header} value={header}>
                            {header}
                          </option>
                        ))}
                        <option value="all">Show All Together</option>
                      </>
                    ) : (
                      <option value="all">All Available / Default</option>
                    )}
                  </select>
                </div>
              )}
            </div>

            {/* Layout switchers & Translation Language */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-stone-50 border border-stone-250 p-3">
              {/* Layout switcher buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[9px] font-black text-stone-500 uppercase tracking-widest block font-sans">View Layout:</span>
                <div className="flex border border-stone-300">
                  <button
                    onClick={() => setRLayout("continuous")}
                    className={`px-3 py-1 text-[9px] font-bold uppercase cursor-pointer transition-all ${
                      rLayout === "continuous"
                        ? "bg-[#3B2314] text-white"
                        : "bg-white text-stone-600 hover:bg-stone-50"
                    }`}
                  >
                    Continuous Flow
                  </button>
                  <button
                    onClick={() => setRLayout("single")}
                    className={`px-3 py-1 text-[9px] font-bold uppercase cursor-pointer transition-all ${
                      rLayout === "single"
                        ? "bg-[#3B2314] text-white"
                        : "bg-white text-stone-600 hover:bg-stone-50"
                    }`}
                  >
                    Single Aphorism
                  </button>
                </div>
                <button
                  onClick={() => setIsReaderFullscreen(true)}
                  className="px-3 py-1 text-[9px] font-bold uppercase cursor-pointer transition-all bg-[#8C6239] hover:bg-[#714E2C] text-white flex items-center gap-1 border border-[#8C6239]"
                  title="Read the entire text in a dedicated distraction-free, smooth-scrolling window layout"
                >
                  <Maximize2 className="w-3 h-3" />
                  <span>📖 Immersive Full Screen</span>
                </button>
              </div>

              {/* Translation Language selector */}
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <span className="text-[9px] font-black text-stone-500 uppercase tracking-widest block font-sans">Translation:</span>
                <div className="flex border border-stone-300">
                  {(["english", "hindi", "bengali"] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setSLang(lang)}
                      className={`px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider cursor-pointer transition-all ${
                        sLang === lang
                          ? "bg-[#795548] text-white"
                          : "bg-white text-stone-600 hover:bg-stone-50"
                      }`}
                    >
                      {lang === "english" ? "English" : lang === "hindi" ? "हिन्दी" : "বাংলা"}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Interactive Grid / Nav */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 items-start">
              
              {/* Section navigator */}
              <div className="xl:col-span-1 space-y-3">
                <span className="text-[9px] font-black text-[#1A1A1A] uppercase tracking-widest block font-sans">Chapters & Sections:</span>
                <div className="flex flex-col gap-1 max-h-[300px] overflow-y-auto pr-1 border border-stone-200 p-1.5 bg-[#FAF8F5] custom-scrollbar">
                  {sectSource.map((sec) => {
                    const isSelected = sec.id === selSectionId;
                    return (
                      <button
                        key={sec.id}
                        onClick={() => {
                          setSelSectionId(sec.id);
                          setActSutraIndex(0);
                        }}
                        className={`p-2 text-left transition-all cursor-pointer rounded-none flex flex-col border ${
                          isSelected
                            ? "bg-[#ECE0D1]/55 border-[#8C6239] font-black text-[#3B2314] shadow-xs"
                            : "bg-white border-transparent hover:border-stone-350 hover:bg-[#FAF8F5]/30 text-stone-700"
                        }`}
                      >
                        <span className="text-[9.5px] font-serif font-black leading-tight">
                          {transliterate(sec.titleDevanagari, targetScript)}
                        </span>
                        <span className="text-[8.5px] text-stone-500 font-sans font-bold truncate mt-0.5">
                          {sec.titleEnglish.split(" (")[0]}
                        </span>
                        <span className="text-[7.5px] text-stone-400 font-mono mt-0.5 font-bold">
                          [{text.id === "tarka-sastram" ? "Prak" : "Ch"} {getChNum(sec)}] • {sec.sutras.length} Sūtras
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Level Level Nav */}
                <div className="grid grid-cols-2 gap-1.5 pt-1.5">
                  <button
                    onClick={onPrevSection}
                    className="p-1.5 bg-stone-50 hover:bg-[#8C6239] hover:text-white transition-all cursor-pointer border border-stone-250 text-[9px] font-sans font-extrabold uppercase rounded-none flex items-center justify-center gap-1"
                    title="Previous Lesson"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Prev Section</span>
                  </button>
                  <button
                    onClick={onNextSection}
                    className="p-1.5 bg-stone-50 hover:bg-[#8C6239] hover:text-white transition-all cursor-pointer border border-stone-250 text-[9px] font-sans font-extrabold uppercase rounded-none flex items-center justify-center gap-1"
                    title="Next Lesson"
                  >
                    <span>Next Section</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Sūtra / Verse Level Nav */}
                <div className="flex items-center justify-between bg-white border border-[#8C6239]/50 p-2.5 relative">
                  <button
                    onClick={onPrevSutra}
                    className="p-1.5 hover:bg-[#8C6239] hover:text-white transition-all cursor-pointer border border-stone-100 bg-stone-50"
                    title="Previous Sūtra"
                  >
                    <ChevronLeft className="w-4.5 h-4.5" />
                  </button>
                  <div className="text-center min-w-[90px]">
                    <span className="text-[8px] font-black text-[#8C6239] uppercase tracking-widest block font-sans">Aphorism (सूत्रम्)</span>
                    <span className="font-mono font-extrabold text-xs">
                      {(() => {
                        const currentSection = actSections.find((s) => s.id === selSectionId) || actSections[0];
                        const sutra = currentSection?.sutras?.[actSutraIndex];
                        return sutra ? `Sūtra ${sutra.sutraNum}` : "N/A";
                      })()}
                    </span>
                  </div>
                  <button
                    onClick={onNextSutra}
                    className="p-1.5 hover:bg-[#8C6239] hover:text-white transition-all cursor-pointer border border-stone-100 bg-stone-50"
                    title="Next Sūtra"
                  >
                    <ChevronRight className="w-4.5 h-4.5" />
                  </button>
                </div>

              </div>

              {/* Sūtra List View Rendering (Continuous vs. Single Aphorism) */}
              <div className="xl:col-span-3">
                {text.id === "tattva-cintamani" && selChapters.includes(4) ? (
                  renderGangesaShabdaKhanda(panelId)
                ) : actSections.length === 0 ? (
                  <div className="text-center py-12 bg-white border border-[#1A1A1A]/10">
                    <p className="text-xs font-serif text-stone-500">
                      Please select at least one Chapter checkbox to read.
                    </p>
                  </div>
                ) : rLayout === "single" ? (
                  (() => {
                    const currentSection = actSections.find((s) => s.id === selSectionId) || actSections[0];
                    if (!currentSection) return null;
                    const sutra = currentSection.sutras[actSutraIndex];
                    if (!sutra) return (
                      <div className="text-center py-8 font-mono text-xs text-stone-400">
                        Sūtra index out of bounds. Please select another section.
                      </div>
                    );
                    const isExpanded = !!expSutras[sutra.id];

                    return (
                      <div className="space-y-6 animate-fade-in text-left">
                        
                        {/* Navigation Controller Bar with arrows */}
                        <div className="flex items-center justify-between gap-3 py-2.5 border-t border-b border-stone-200">
                          <button
                            onClick={onPrevSutra}
                            className="p-1.5 sm:p-2 bg-white hover:bg-[#795548] hover:text-white border-2 border-[#1A1A1A] text-stone-800 transition-all cursor-pointer flex items-center justify-center gap-1 font-sans text-[10px] sm:text-xs font-black uppercase rounded-none"
                            title="Previous Sūtra"
                          >
                            <ChevronLeft className="w-4 h-4" />
                            <span className="hidden sm:inline">Prev Sūtra</span>
                          </button>
                          
                          <div className="text-center">
                            <span className="font-mono text-[10px] sm:text-xs font-bold text-stone-600 bg-[#FAF8F5] px-2.5 py-1 border border-stone-300">
                              Sūtra {sutra.sutraNum} ({actSutraIndex + 1} / {currentSection.sutras.length})
                            </span>
                          </div>

                          <button
                            onClick={onNextSutra}
                            className="p-1.5 sm:p-2 bg-white hover:bg-[#795548] hover:text-white border-2 border-[#1A1A1A] text-stone-800 transition-all cursor-pointer flex items-center justify-center gap-1 font-sans text-[10px] sm:text-xs font-black uppercase rounded-none"
                            title="Next Sūtra"
                          >
                            <span className="hidden sm:inline">Next Sūtra</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>

                        {/* SINGLE SŪTRA SLIDE */}
                        <div 
                          data-active-sutra="true"
                          className="bg-[#FFFDF9] border-2 border-[#8C6239]/25 p-4 sm:p-6 md:p-8 relative my-4 shadow-sm rounded-none select-text text-left transition-all hover:border-[#8C6239] active-sutra-card"
                        >
                          <div className="absolute left-2.5 top-0 bottom-0 w-0.5 bg-red-800/10 pointer-events-none"></div>
                          <div className="absolute right-2.5 top-0 bottom-0 w-0.5 bg-red-800/10 pointer-events-none"></div>
                          
                          <div className="flex items-center justify-between gap-2 border-b border-stone-150 pb-2 mb-4 text-xs font-sans font-bold">
                            <span className="font-mono text-[9px] bg-[#3B2314] text-white px-2 py-0.5 rounded-none font-bold">
                              Sūtra {sutra.sutraNum}
                            </span>
                            <span className="font-serif text-stone-650 tracking-tight text-center max-w-[70%] truncate font-black">
                              {sutra.heading.split(" (")[0]}
                            </span>
                            <span className="font-mono text-[9px] text-stone-400 font-bold shrink-0">{sutra.id}</span>
                          </div>

                          {showSanskrit && (
                            <div className="bg-white border-y border-[#8C6239]/10 py-6 px-3 text-center my-4 overflow-hidden relative">
                              <h3 className="text-lg sm:text-xl md:text-2xl font-serif font-black text-stone-900 tracking-wide leading-relaxed max-w-2xl mx-auto break-words">
                                {transliterate(sutra.devanagari, targetScript)}
                              </h3>
                              <p className="text-[9.5px] text-stone-400 mt-2 font-mono italic break-words">
                                Sanskrit Devanāgarī: {sutra.devanagari}
                              </p>
                            </div>
                          )}

                          {showTrans && (
                            <div className="my-4 border-l-2 border-[#795548]/30 pl-3 text-left">
                              <p className={`font-sans text-xs sm:text-sm md:text-base text-stone-900 leading-relaxed font-medium break-words text-left ${sLang === "bengali" ? "font-script-bengali" : ""}`}>
                                {renderHighlightedText(sutra.translations[sLang])}
                              </p>
                            </div>
                          )}

                          <div className="flex flex-wrap items-center justify-between gap-3 mt-4 border-t border-stone-150 pt-3 text-[9.5px] font-sans font-bold">
                            <button
                              onClick={() => toggleCommentary(sutra.id)}
                              className="text-[#8C6239] hover:text-[#3B2314] uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                            >
                              <span>{isExpanded ? "▴ Hide Traditional Commentary" : "▾ View Traditional Commentary & Vṛtti"}</span>
                            </button>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleShareSutra(sutra, currentSection)}
                                className="px-2.5 py-1 bg-[#FAF8F5] hover:bg-[#8C6239] hover:text-white text-[#8C6239] border border-[#8C6239]/50 uppercase rounded-none transition-all cursor-pointer flex items-center gap-1 font-bold shadow-xs active:scale-95"
                                title="Share Sūtra on WhatsApp, X, Facebook, or Copy Link"
                              >
                                <Share2 className="w-2.5 h-2.5" />
                                <span>Share Sūtra</span>
                              </button>

                              <button
                                onClick={() => setReportingSutraId(reportingSutraId === sutra.id ? null : sutra.id)}
                                className={`px-2.5 py-1 uppercase rounded-none transition-all cursor-pointer flex items-center gap-1 border ${
                                  reportingSutraId === sutra.id
                                    ? "bg-red-800 text-white border-red-900"
                                    : "bg-[#FAF8F5] hover:bg-red-50 text-red-700 border-red-200"
                                }`}
                              >
                                <Mail className="w-2.5 h-2.5" />
                                <span>{reportingSutraId === sutra.id ? "Close Reporter" : "Report Typo"}</span>
                              </button>

                              {onTriggerReader && (
                                <button
                                  onClick={() => onTriggerReader(
                                    `Sūtra ${sutra.sutraNum}: ${sutra.heading}\n\n${sutra.devanagari}\n\n[Translation (${sLang})]: ${sutra.translations[sLang]}${sutra.commentary ? `\n\n[Commentary]: ${sutra.commentary[sLang]}` : ""}`,
                                    currentSection?.sutras || [],
                                    actSutraIndex,
                                    sLang
                                  )}
                                  className="px-2.5 py-1 bg-[#FAF8F5] hover:bg-[#1A1A1A] hover:text-white text-stone-700 border border-stone-300 uppercase rounded-none transition-all cursor-pointer flex items-center gap-1"
                                >
                                  <Sparkles className="w-2.5 h-2.5 text-[#795548]" />
                                  <span>Immersive Mode</span>
                                </button>
                              )}
                            </div>
                          </div>

                          {reportingSutraId === sutra.id && (
                            <div className="mt-4 border-2 border-red-800 bg-[#FFF5F5] p-2 animate-fade-in text-left">
                              <div className="bg-red-900 text-white font-sans text-[10px] font-black uppercase tracking-wider px-3 py-1.5 mb-2.5">
                                Reporting Typo / Correction for Sūtra {sutra.sutraNum} ({selectedText?.titleEnglish || "Treatise"})
                              </div>
                              <FeedbackMaildesk
                                initialType="correction"
                                initialSourceText={`${selectedText?.titleEnglish || "Treatise"} - Sūtra ${sutra.sutraNum}`}
                                initialSelection={sutra.devanagari}
                                isEmbed={true}
                              />
                            </div>
                          )}

                          {isExpanded && (
                            <div className="mt-4 p-4.5 bg-[#FAF8F5] border border-[#1A1A1A]/10 space-y-4 font-sans rounded-none">
                              {showCommSanskrit && sutra.commentarySanskrit && (
                                (() => {
                                  const filtered = filterCommentary(sutra.commentarySanskrit, selCommentary);
                                  if (!filtered) return null;
                                  return (
                                    <div className="space-y-1 bg-white border border-stone-200 p-3.5 rounded-none text-left">
                                      <span className="text-[8px] font-extrabold text-[#C25E3E] uppercase tracking-widest block mb-1">
                                        Sanskrit Commentary (विवरणम् / वृत्तिः)
                                      </span>
                                      <div className="text-[12.5px] sm:text-sm font-serif text-stone-850 leading-relaxed whitespace-pre-line break-words">
                                        {transliterate(filtered, targetScript)}
                                      </div>
                                    </div>
                                  );
                                })()
                              )}

                              {showCommModern && sutra.commentary && (
                                <div className="space-y-1 bg-white border border-stone-200 p-3.5 rounded-none text-left">
                                  <span className="text-[8px] font-extrabold text-[#795548] uppercase tracking-widest block mb-1">
                                    Modern Epistemological Hermeneutics
                                  </span>
                                  <p className={`text-xs sm:text-sm text-stone-800 leading-relaxed text-justify whitespace-pre-line break-words ${sLang === "bengali" ? "font-script-bengali" : ""}`}>
                                    {renderHighlightedText(sutra.commentary[sLang])}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}

                        </div>

                      </div>
                    );
                  })()
                ) : (
                  <div className="space-y-8 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                    {actSections.map((sec) => (
                      <div key={sec.id} className="space-y-4">
                        <div className="border-b-2 border-[#1A1A1A] pb-1 bg-stone-50 p-2 border-l-4 border-l-[#795548]">
                          <h4 className="text-xs sm:text-sm font-serif font-black text-[#3B2314] flex flex-wrap items-center justify-between gap-2">
                            <span>
                              [{text.id === "tarka-sastram" ? "Prak" : "Ch"} {getChNum(sec)}] {transliterate(sec.titleDevanagari, targetScript)}
                            </span>
                            <span className="font-sans text-[10px] text-stone-500 font-bold tracking-tight">
                              {sec.titleEnglish.split(" (")[0]}
                            </span>
                          </h4>
                        </div>

                        <div className="space-y-12 pl-1 sm:pl-3">
                          {sec.sutras.map((sutra, sIdx) => {
                            const isExpanded = !!expSutras[sutra.id];
                            const currentSection = actSections.find((s) => s.id === selSectionId) || actSections[0];
                            const isActiveSutraInFlow = currentSection?.id === sec.id && currentSection.sutras[actSutraIndex]?.id === sutra.id;
                            return (
                              <div 
                                key={sutra.id}
                                id={`sutra-card-${sutra.id}`}
                                data-active-sutra={isActiveSutraInFlow ? "true" : undefined}
                                className={`space-y-4 pb-6 border-b border-dashed border-stone-200/70 last:border-b-0 relative group text-left transition-all duration-300 ${
                                  isActiveSutraInFlow
                                    ? "bg-[#ECE0D1]/35 border-2 border-[#8C6239] shadow-sm -mx-2 sm:-mx-4 p-3 sm:p-5 my-2 active-sutra-card"
                                    : ""
                                }`}
                              >
                                {/* Code Line Info */}
                                <div className="flex items-center justify-between gap-3 text-xs">
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono text-[9px] bg-[#3B2314] text-white px-2 py-0.5 font-bold uppercase tracking-wider rounded-none">
                                      Sūtra {sutra.sutraNum}
                                    </span>
                                    <span className="font-serif text-xs font-black text-stone-700 break-words">
                                      {sutra.heading.split(" (")[0]}
                                    </span>
                                  </div>
                                  <span className="font-mono text-[8px] sm:text-[9px] text-stone-400 font-bold shrink-0">{sutra.id}</span>
                                </div>

                                {/* Pure Sanskrit Manuscript Box */}
                                {showSanskrit && (
                                  <div className="bg-[#FFFDF9] border-y border-[#8C6239]/15 py-5 px-3 sm:px-6 md:px-8 relative text-center my-4 overflow-hidden shadow-inner">
                                    <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-red-800/10 pointer-events-none"></div>
                                    <div className="absolute right-2 top-0 bottom-0 w-0.5 bg-red-800/10 pointer-events-none"></div>
                                    
                                    <h3 className="text-lg sm:text-xl md:text-2xl font-serif font-black text-stone-900 tracking-wide leading-relaxed max-w-2xl mx-auto break-words">
                                      {transliterate(sutra.devanagari, targetScript)}
                                    </h3>
                                    <p className="text-[9.5px] text-stone-400 mt-2 font-mono italic max-w-xl mx-auto break-words font-medium">
                                      Sanskrit Devanāgarī: {sutra.devanagari}
                                    </p>
                                  </div>
                                )}

                                {/* Translation Paragraph */}
                                {showTrans && (
                                  <div className="my-4 max-w-3xl text-left border-l-2 border-[#795548]/30 pl-3">
                                    <p className={`font-sans text-xs sm:text-sm md:text-base text-stone-900 leading-relaxed text-left font-medium break-words ${sLang === "bengali" ? "font-script-bengali" : ""}`}>
                                      {renderHighlightedText(sutra.translations[sLang])}
                                    </p>
                                  </div>
                                )}

                                {/* Commentary Toggle & Reader Controls */}
                                <div className="flex flex-wrap items-center justify-between gap-3 mt-4 border-t border-stone-100 pt-3 text-[9.5px] font-sans font-bold">
                                  <button
                                    onClick={() => toggleCommentary(sutra.id)}
                                    className="text-[#8C6239] hover:text-[#3B2314] uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                                  >
                                    <span>{isExpanded ? "▴ Hide Traditional Commentary" : "▾ View Traditional Commentary & Vṛtti"}</span>
                                  </button>

                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => handleShareSutra(sutra, sec)}
                                      className="px-2.5 py-1 bg-[#FAF8F5] hover:bg-[#8C6239] hover:text-white text-[#8C6239] border border-[#8C6239]/50 uppercase rounded-none transition-all cursor-pointer flex items-center gap-1 font-bold shadow-xs active:scale-95"
                                      title="Share Sūtra on WhatsApp, X, Facebook, or Copy Link"
                                    >
                                      <Share2 className="w-2.5 h-2.5" />
                                      <span>Share Sūtra</span>
                                    </button>

                                    <button
                                      onClick={() => setReportingSutraId(reportingSutraId === sutra.id ? null : sutra.id)}
                                      className={`px-2.5 py-1 uppercase rounded-none transition-all cursor-pointer flex items-center gap-1 border ${
                                        reportingSutraId === sutra.id
                                          ? "bg-red-800 text-white border-red-900"
                                          : "bg-[#FAF8F5] hover:bg-red-50 text-red-700 border-red-200"
                                      }`}
                                    >
                                      <Mail className="w-2.5 h-2.5" />
                                      <span>{reportingSutraId === sutra.id ? "Close Reporter" : "Report Typo"}</span>
                                    </button>

                                    {onTriggerReader && (
                                      <button
                                        onClick={() => onTriggerReader(
                                          `Sūtra ${sutra.sutraNum}: ${sutra.heading}\n\n${sutra.devanagari}\n\n[Translation (${sLang})]: ${sutra.translations[sLang]}${sutra.commentary ? `\n\n[Commentary]: ${sutra.commentary[sLang]}` : ""}`,
                                          sec.sutras,
                                          sIdx,
                                          sLang
                                        )}
                                        className="px-2.5 py-1 bg-[#FAF8F5] hover:bg-[#1A1A1A] hover:text-white text-stone-700 border border-stone-300 uppercase rounded-none transition-all cursor-pointer flex items-center gap-1"
                                      >
                                        <Sparkles className="w-2.5 h-2.5 text-[#795548]" />
                                        <span>Immersive Mode</span>
                                      </button>
                                    )}
                                  </div>
                                </div>

                                {reportingSutraId === sutra.id && (
                                  <div className="mt-4 border-2 border-red-800 bg-[#FFF5F5] p-2 animate-fade-in text-left">
                                    <div className="bg-red-900 text-white font-sans text-[10px] font-black uppercase tracking-wider px-3 py-1.5 mb-2.5">
                                      Reporting Typo / Correction for Sūtra {sutra.sutraNum} ({selectedText?.titleEnglish || "Treatise"})
                                    </div>
                                    <FeedbackMaildesk
                                      initialType="correction"
                                      initialSourceText={`${selectedText?.titleEnglish || "Treatise"} - Sūtra ${sutra.sutraNum}`}
                                      initialSelection={sutra.devanagari}
                                      isEmbed={true}
                                    />
                                  </div>
                                )}

                                {/* Expandable Commentaries */}
                                {isExpanded && (
                                  <div className="mt-4 p-4.5 bg-[#FAF8F5] border border-[#1A1A1A]/10 space-y-4 animate-fade-in font-sans rounded-none">
                                    {showCommSanskrit && sutra.commentarySanskrit && (
                                      (() => {
                                        const filtered = filterCommentary(sutra.commentarySanskrit, selCommentary);
                                        if (!filtered) return null;
                                        return (
                                          <div className="space-y-1 bg-white border border-stone-200 p-3.5 rounded-none text-left">
                                            <span className="text-[8px] font-extrabold text-[#C25E3E] uppercase tracking-widest block mb-1">
                                              Sanskrit Commentary (विवरणम् / वृत्तिः)
                                            </span>
                                            <div className="text-[12.5px] sm:text-sm font-serif text-stone-850 leading-relaxed break-words whitespace-pre-line">
                                              {transliterate(filtered, targetScript)}
                                            </div>
                                          </div>
                                        );
                                      })()
                                    )}

                                    {showCommModern && sutra.commentary && (
                                      <div className="space-y-1 bg-white border border-stone-200 p-3.5 rounded-none text-left">
                                        <span className="text-[8px] font-extrabold text-[#795548] uppercase tracking-widest block mb-1">
                                          Modern Epistemological Hermeneutics
                                        </span>
                                        <p className={`text-xs sm:text-sm text-stone-800 leading-relaxed text-justify break-words whitespace-pre-line ${sLang === "bengali" ? "font-script-bengali" : ""}`}>
                                          {renderHighlightedText(sutra.commentary[sLang])}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                )}

                              </div>
                            );
                          })}
                        </div>

                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

      </div>
    );
  };

  return (
    <div className="space-y-6" id="granthasarani-module">
      
      {/* Header Block with modern premium textures */}
      <div className="bg-[#FAF8F5] border-2 border-[#1A1A1A] p-4 sm:p-5 rounded-none flex flex-col md:flex-row md:items-center justify-between gap-4 pl-5 sm:pl-6 md:pl-8 classy-transition">
        <div>
          <h2 className="text-base sm:text-lg font-serif font-black text-[#3B2314] uppercase tracking-tight flex items-center gap-2">
            <Compass className="w-4.5 h-4.5 text-[#C25E3E]" />
            Granthasāraṇī (ग्रन्थसारणी)
          </h2>
          <p className="text-[11px] sm:text-xs text-[#1A1A1A] mt-0.5 max-w-2xl font-bold opacity-70">
            Explore the historical timeline, lineages, and foundational texts of Nyāya and Vaiśeṣika schools. Use Focus Mode for a clean, immersive reading experience.
          </p>
        </div>
        
        {/* Universal View Mode Switcher */}
        {selectedText && (
          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
            {/* Split View Switcher */}
            <button
              onClick={() => {
                setIsSplitView(!isSplitView);
                if (!isSplitView && !selectedTextB) {
                  setSelectedTextB(NYAYA_TEXTS[1] || NYAYA_TEXTS[0]);
                }
              }}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 text-[10px] sm:text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all rounded-none border-2 shadow-[3px_3px_0px_0px_rgba(26,26,26,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 ${
                isSplitView
                  ? "bg-[#C25E3E] hover:bg-[#A84C2F] text-white border-[#1A1A1A]"
                  : "bg-white hover:bg-[#FAF8F5] text-[#3B2314] border-[#1A1A1A]"
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>{isSplitView ? "Single-View Mode" : "Comparative Split-View"}</span>
            </button>

            {/* Focus Reading Mode Switcher */}
            <button
              onClick={() => setFocusMode(!focusMode)}
              className="px-3 py-1.5 sm:px-4 sm:py-2 bg-[#3B2314] hover:bg-[#1A1A1A] text-white border-2 border-[#1A1A1A] font-sans text-[10px] sm:text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all rounded-none shadow-[3px_3px_0px_0px_rgba(26,26,26,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5"
            >
              {focusMode ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5" />
                  <span>Show Library Index</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Focus Reading Mode</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Reading Progress banner */}
      {savedProgress && !focusMode && (
        <div className="bg-[#FAF8F5] border border-[#795548] p-3 rounded-none flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2.5 text-left animate-fade-in">
          <div className="flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-[#795548] shrink-0" />
            <div className="text-[11px] text-stone-700">
              <span className="font-extrabold text-[#1A1A1A] uppercase tracking-wide mr-1">Saved Bookmark:</span>
              <span>Last read <strong className="text-[#795548] font-black">{savedProgress.textTitle}</strong></span>
              {savedProgress.sectionTitle && (
                <> &mdash; Section: <strong className="text-[#795548]">{savedProgress.sectionTitle}</strong></>
              )}
              <span className="opacity-60 text-[9px] ml-1">({savedProgress.timestamp})</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 font-sans text-[9px] w-full sm:w-auto justify-end">
            <button
              onClick={handleRestoreProgress}
              className="px-3 py-1 bg-[#795548] hover:bg-[#1A1A1A] text-white font-black uppercase tracking-wider cursor-pointer transition-all rounded-none"
            >
              Resume Study
            </button>
            <button
              onClick={handleClearProgress}
              className="px-2 py-1 bg-white hover:bg-stone-50 text-stone-600 border border-stone-300 font-extrabold uppercase tracking-wider cursor-pointer transition-all rounded-none"
              title="Clear Saved Bookmark"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Collapsible Treatise Selector / Library */}
      {!focusMode && selectedText && (
        <div className="bg-[#FAF8F5] border-2 border-[#1A1A1A] p-4 rounded-none shadow-[3px_3px_0px_0px_rgba(26,26,26,1)] relative transition-all space-y-3">
          {/* Quick Bar of All Treatises */}
          <div className="flex items-center justify-between gap-2 border-b border-[#1A1A1A]/20 pb-2.5">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#C25E3E]" />
              <span className="text-xs font-serif font-black text-[#3B2314] uppercase tracking-wider">
                ग्रन्थसूची | Treatise Library ({NYAYA_TEXTS.length} Classical Texts)
              </span>
            </div>
            <button
              onClick={() => setIsLibraryExpanded(!isLibraryExpanded)}
              className="text-[10px] font-mono font-bold bg-white px-2.5 py-1 border border-[#1A1A1A] hover:bg-[#F5F2EA] transition-all cursor-pointer text-[#3B2314]"
            >
              {isLibraryExpanded ? "Close Catalog ▴" : "Browse All Catalog ▾"}
            </button>
          </div>

          {/* Quick Treatise Carousel / Strip */}
          <div className="flex gap-1.5 overflow-x-auto pb-1.5 pt-0.5 custom-scrollbar">
            {NYAYA_TEXTS.map((t) => {
              const isSelected = t.id === selectedText.id;
              return (
                <button
                  key={t.id}
                  onClick={() => handleSelectText(t)}
                  className={`px-2.5 py-1.5 text-left border shrink-0 transition-all cursor-pointer font-sans ${
                    isSelected
                      ? "bg-[#3B2314] text-white border-[#1A1A1A] shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]"
                      : "bg-white text-[#1A1A1A] border-stone-300 hover:border-[#1A1A1A] hover:bg-[#F5F2EA]"
                  }`}
                  title={`${t.title} by ${t.author} (${t.century})`}
                >
                  <div className="text-[10px] font-black font-serif leading-tight">
                    {transliterate(t.devanagariTitle, targetScript)}
                  </div>
                  <div className={`text-[8px] truncate max-w-[130px] ${isSelected ? "text-stone-300" : "text-stone-500"}`}>
                    {t.title}
                  </div>
                </button>
              );
            })}
          </div>

          {isLibraryExpanded && (
            <div className="mt-3 pt-3 border-t border-[#1A1A1A]/30 space-y-4 animate-fade-in text-left">
              {/* Active Book Description */}
              <div className="bg-stone-50 border border-stone-250 p-4 space-y-2 rounded-none">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black uppercase text-[#8C6239] tracking-widest bg-[#ECE0D1] px-2 py-0.5 border border-[#8C6239]/20 font-sans">
                    वर्तमान-ग्रन्थः | SELECTED TREATISE DESCRIPTION
                  </span>
                  <span className="text-[8px] font-mono font-bold px-1.5 py-0.5 border border-stone-300 bg-white text-stone-600 uppercase">
                    {selectedText.school}
                  </span>
                </div>
                <div>
                  <h3 className="font-serif font-black text-[#3B2314] text-base leading-tight">
                    {transliterate(selectedText.devanagariTitle, targetScript)}
                  </h3>
                  <p className="text-[11.5px] text-stone-700 leading-relaxed text-left sm:text-justify mt-2 pt-2 border-t border-stone-200">
                    {selectedText.description}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Search & Filters */}
                <div className="space-y-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-3.5 w-3.5 text-stone-500" />
                    <input
                      type="text"
                      placeholder="Search other treatises..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-white text-[#1A1A1A] text-xs border-2 border-[#1A1A1A] rounded-none pl-9 pr-3 py-2.5 focus:outline-none focus:bg-[#F5F2EA] font-sans font-bold"
                    />
                  </div>

                  <div className="flex gap-1 overflow-x-auto pb-1.5 custom-scrollbar">
                    {["All", "Nyāya", "Vaiśeṣika", "Navya-Nyāya", "Buddhist Logic", "Jaina Logic", "Syncretic", "Advaita Vedānta"].map((school) => (
                      <button
                        key={school}
                        onClick={() => setSelectedSchool(school)}
                        className={`px-2 py-1 text-[8.5px] font-bold uppercase tracking-widest rounded-none border shrink-0 transition-all cursor-pointer ${
                          selectedSchool === school
                            ? "bg-[#795548] text-white border-[#1A1A1A]"
                            : "bg-white text-[#1A1A1A] border-stone-300 hover:border-[#1A1A1A] hover:bg-[#F5F2EA]"
                        }`}
                      >
                        {school}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Selected treatise summary */}
                <div className="bg-white border border-stone-250 p-4 flex flex-col justify-center">
                  <span className="text-[8px] font-black uppercase text-stone-400 tracking-wider">Currently Selected</span>
                  <h4 className="font-serif font-black text-[#3B2314] text-sm mt-0.5">
                    {transliterate(selectedText.devanagariTitle, targetScript)}
                  </h4>
                  <p className="text-[10px] text-stone-500 italic mt-0.5">{selectedText.title} ({selectedText.century})</p>
                  <div className="mt-2 text-[9px] font-bold text-stone-600 uppercase tracking-wide">
                    By {selectedText.author} • {selectedText.school}
                  </div>
                </div>
              </div>

              {/* Text Cards Grid - 3 columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar pt-2">
                {filteredTexts.map((text) => {
                  const isActive = text.id === selectedText.id;
                  return (
                    <div
                      key={text.id}
                      onClick={() => handleSelectText(text)}
                      className={`p-3 border-2 cursor-pointer transition-all text-left ${
                        isActive
                          ? "bg-[#ECE0D1]/50 border-[#8C6239] shadow-inner"
                          : "bg-white border-stone-200 hover:border-[#1A1A1A] hover:bg-[#FAF8F5]/60"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1">
                        <h5 className="font-serif font-black text-[#1A1A1A] text-xs truncate">
                          {transliterate(text.devanagariTitle, targetScript)}
                        </h5>
                        <span className="text-[7px] font-mono font-bold px-1.5 py-0.2 border border-stone-250 bg-[#FAF8F5] text-stone-600 uppercase shrink-0">
                          {text.school}
                        </span>
                      </div>
                      <p className="text-[9.5px] text-stone-500 truncate mt-0.5">{text.title}</p>
                      <div className="mt-2 flex items-center justify-between text-[8px] font-sans text-stone-400 border-t border-stone-100 pt-1">
                        <span>By {text.author}</span>
                        <span>{text.century}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Full Window Reader View Container */}
      <div className={`${isSplitView ? "max-w-7xl" : "max-w-4xl"} mx-auto w-full transition-all duration-350`}>
        {isSplitView ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            {/* Panel A */}
            <div className="space-y-4">
              <div className="bg-[#FAF8F5] border-2 border-[#1A1A1A] px-4 py-2 font-black uppercase text-xs text-[#3B2314] flex justify-between items-center">
                <span>Panel A — Comparative Treatise</span>
                <select
                  value={selectedText?.id || ""}
                  onChange={(e) => {
                    const txt = NYAYA_TEXTS.find((t) => t.id === e.target.value);
                    if (txt) {
                      handleSelectText(txt);
                    }
                  }}
                  className="bg-white border border-[#1A1A1A] text-[10px] font-bold p-1 font-sans focus:outline-none uppercase cursor-pointer"
                >
                  {NYAYA_TEXTS.map((t) => (
                    <option key={t.id} value={t.id}>{t.title}</option>
                  ))}
                </select>
              </div>
              {renderReaderPanel(
                "A",
                selectedText,
                isStructuredText,
                showMetadata,
                setShowMetadata,
                isPlayingText,
                sutraLang,
                setSutraLang,
                selectedChapters,
                setSelectedChapters,
                selectedSectionId,
                setSelectedSectionId,
                activeSections,
                readerLayout,
                setReaderLayout,
                activeSutraIndex,
                setActiveSutraIndex,
                expandedSutras,
                toggleSutraCommentary,
                showSanskritSutra,
                setShowSanskritSutra,
                showTranslation,
                setShowTranslation,
                showCommentarySanskrit,
                setShowCommentarySanskrit,
                showCommentaryModern,
                setShowCommentaryModern,
                selectedCommentary,
                setSelectedCommentary,
                handleNextSutra,
                handlePrevSutra,
                handleNextSection,
                handlePrevSection,
                sectionsSource,
                getChapterNumOfSection
              )}
            </div>

            {/* Panel B */}
            <div className="space-y-4">
              <div className="bg-[#FAF8F5] border-2 border-[#1A1A1A] px-4 py-2 font-black uppercase text-xs text-[#3B2314] flex justify-between items-center">
                <span>Panel B — Comparative Treatise</span>
                <select
                  value={selectedTextB?.id || ""}
                  onChange={(e) => {
                    const txt = NYAYA_TEXTS.find((t) => t.id === e.target.value);
                    if (txt) {
                      handleSelectTextB(txt);
                    }
                  }}
                  className="bg-white border border-[#1A1A1A] text-[10px] font-bold p-1 font-sans focus:outline-none uppercase cursor-pointer"
                >
                  {NYAYA_TEXTS.map((t) => (
                    <option key={t.id} value={t.id}>{t.title}</option>
                  ))}
                </select>
              </div>
              {renderReaderPanel(
                "B",
                selectedTextB,
                isStructuredTextB,
                showMetadataB,
                setShowMetadataB,
                isPlayingTextB,
                sutraLangB,
                setSutraLangB,
                selectedChaptersB,
                setSelectedChaptersB,
                selectedSectionIdB,
                setSelectedSectionIdB,
                activeSectionsB,
                readerLayoutB,
                setReaderLayoutB,
                activeSutraIndexB,
                setActiveSutraIndexB,
                expandedSutrasB,
                toggleSutraCommentaryB,
                showSanskritSutraB,
                setShowSanskritSutraB,
                showTranslationB,
                setShowTranslationB,
                showCommentarySanskritB,
                setShowCommentarySanskritB,
                showCommentaryModernB,
                setShowCommentaryModernB,
                selectedCommentaryB,
                setSelectedCommentaryB,
                handleNextSutraB,
                handlePrevSutraB,
                handleNextSectionB,
                handlePrevSectionB,
                sectionsSourceB,
                getChapterNumOfSectionB
              )}
            </div>
          </div>
        ) : (
          renderReaderPanel(
            "A",
            selectedText,
            isStructuredText,
            showMetadata,
            setShowMetadata,
            isPlayingText,
            sutraLang,
            setSutraLang,
            selectedChapters,
            setSelectedChapters,
            selectedSectionId,
            setSelectedSectionId,
            activeSections,
            readerLayout,
            setReaderLayout,
            activeSutraIndex,
            setActiveSutraIndex,
            expandedSutras,
            toggleSutraCommentary,
            showSanskritSutra,
            setShowSanskritSutra,
            showTranslation,
            setShowTranslation,
            showCommentarySanskrit,
            setShowCommentarySanskrit,
            showCommentaryModern,
            setShowCommentaryModern,
            selectedCommentary,
            setSelectedCommentary,
            handleNextSutra,
            handlePrevSutra,
            handleNextSection,
            handlePrevSection,
            sectionsSource,
            getChapterNumOfSection
          )
        )}
      </div>

      {isReaderFullscreen && selectedText && (
        <div className="fixed inset-0 z-50 bg-[#F3EBE0] overflow-y-auto select-text flex flex-col font-sans" id="fullscreen-reader-overlay">
          {/* Top Control Header */}
          <div className="bg-[#3B2314] text-white py-3.5 px-6 border-b-2 border-[#1A1A1A] sticky top-0 flex flex-wrap items-center justify-between gap-4 shadow-md z-10 print:hidden">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsReaderFullscreen(false)}
                className="px-3 py-1.5 bg-white text-[#3B2314] hover:bg-stone-200 border border-white font-sans text-[10px] font-black uppercase rounded-none transition-all cursor-pointer flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Exit Reader</span>
              </button>
              <div className="h-6 w-px bg-white/20"></div>
              <div>
                <h3 className="text-xs sm:text-sm font-serif font-black tracking-tight text-[#FDFCF8] truncate max-w-[200px] sm:max-w-xs">
                  {transliterate(selectedText.devanagariTitle, targetScript)}
                </h3>
                <p className="text-[9px] font-sans text-stone-300 font-bold uppercase tracking-wider">
                  {selectedText.title}
                </p>
              </div>
            </div>

            {/* Controls Bar inside Header */}
            <div className="flex flex-wrap items-center gap-4 text-xs">
              {/* Language Selector */}
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-black uppercase text-stone-300 tracking-wider">Translation:</span>
                <div className="flex border border-white/20 rounded-none bg-white/10 p-0.5">
                  {(["english", "hindi", "bengali"] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setSutraLang(lang)}
                      className={`px-2 py-0.5 text-[9px] font-bold uppercase transition-all rounded-none cursor-pointer ${
                        sutraLang === lang ? "bg-white text-[#3B2314]" : "text-white hover:bg-white/10"
                      }`}
                    >
                      {lang === "english" ? "English" : lang === "hindi" ? "हिन्दी" : "বাংলা"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Size Adjuster */}
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-black uppercase text-stone-300 tracking-wider">Font Size:</span>
                <div className="flex border border-white/20 rounded-none bg-white/10 p-0.5">
                  {(["sm", "base", "lg", "xl"] as const).map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setReaderFontSize(sz)}
                      className={`px-2 py-0.5 text-[9px] font-bold uppercase transition-all rounded-none cursor-pointer ${
                        readerFontSize === sz ? "bg-white text-[#3B2314]" : "text-white hover:bg-white/10"
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Print Book Button */}
              <button
                onClick={() => window.print()}
                className="px-3 py-1 bg-white/10 hover:bg-white/25 text-white border border-white/30 text-[10px] font-black uppercase rounded-none transition-all cursor-pointer flex items-center gap-1"
                title="Print the entire book text or save as PDF"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Book</span>
              </button>

              {/* Download PDF Button */}
              <button
                onClick={handleDownloadFullBookPDF}
                className="px-3 py-1 bg-[#8C6239] hover:bg-[#714E2C] text-white border border-[#8C6239] text-[10px] font-black uppercase rounded-none transition-all cursor-pointer flex items-center gap-1"
                title="Generate and download high-quality PDF of the entire text"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Download PDF (Whole Text)</span>
              </button>

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
                    </div>
                    <p className="text-[11px] text-stone-400">
                      Please wait while Tarka-Vidyā high-fidelity preservation engine wraps text, applies layout styling, and prepares multi-page high-contrast sheets.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Book Content Container */}
          <div className="flex-1 max-w-4xl mx-auto py-12 px-6 sm:px-12 space-y-16 print:py-4 print:px-2" id="fullscreen-reader-content">
            {/* Elegant Book-Style Cover / Title Header */}
            <div className="text-center space-y-4 pb-10 border-b-2 border-stone-300 select-text">
              <span className="text-[10px] font-black uppercase text-[#8C6239] tracking-widest block font-sans print:hidden">
                समग्रग्रन्थ-मूलपाठः • Academic Recension
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-stone-900 leading-tight">
                {transliterate(selectedText.devanagariTitle, targetScript)}
              </h1>
              <h2 className="text-lg sm:text-xl font-sans font-bold text-stone-700">
                {selectedText.title}
              </h2>
              
              <div className="h-0.5 w-24 bg-[#8C6239] mx-auto my-4"></div>

              <div className="text-xs sm:text-sm font-sans text-stone-500 font-bold space-y-1">
                <p>प्रणेता / Author: <strong className="text-stone-800">{selectedText.author}</strong></p>
                <p>परम्परा / School: <strong className="text-stone-800">{selectedText.school}</strong></p>
                <p>कालः / Period: <strong className="text-stone-800">{selectedText.century}</strong></p>
              </div>

              <p className="text-sm sm:text-base font-serif italic text-stone-700 max-w-2xl mx-auto leading-relaxed pt-3 text-justify sm:text-center select-text">
                {selectedText.description}
              </p>

              {selectedText.id === "tarka-samgraha" && (
                <div className="mt-5 p-4 bg-[#ECE0D1]/50 border border-[#8C6239]/20 rounded-none max-w-2xl mx-auto text-left space-y-2">
                  <div className="flex items-center gap-1.5 text-[#8C6239] font-black text-xs uppercase tracking-wider">
                    <span>🎥 स्वाध्याय-सहायकः | Swādhyāya Learning Resources</span>
                  </div>
                  <p className="text-xs text-stone-700 leading-relaxed font-sans">
                    Study this treatise with authentic, traditional video lectures of <strong>Vidvān Dattanubhava Tangse</strong> (Tenali Qualifier in Nyāya & Vedānta), organized by <strong>Medha Gurukulam, Chennai</strong>:
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <a 
                      href="https://vimeo.com/showcase/10428964" 
                      target="_blank" 
                      rel="noreferrer" 
                      className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-[#3B2314] text-white px-3 py-1.5 hover:bg-[#1A1A1A] border border-[#1A1A1A]"
                    >
                      <span>Volume I: Foundations</span>
                    </a>
                    <a 
                      href="https://vimeo.com/showcase/10950519" 
                      target="_blank" 
                      rel="noreferrer" 
                      className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-[#8C6239] text-white px-3 py-1.5 hover:bg-[#795548] border border-[#1A1A1A]"
                    >
                      <span>Volume II: Epistemology</span>
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Sūtras & Chapters */}
            <div className="space-y-16">
              {selectedText.id === "tattva-cintamani" && selectedChapters.includes(4) ? (
                renderGangesaShabdaKhanda("A")
              ) : sectionsSource.map((sec) => (
                <div key={sec.id} className="space-y-8 select-text">
                  {/* Chapter Section Title */}
                  <div className="border-b-2 border-[#1A1A1A] pb-2 bg-stone-100/60 p-4 border-l-4 border-l-[#795548] select-text">
                    <h3 className="text-sm sm:text-base md:text-lg font-serif font-black text-[#3B2314] flex flex-wrap items-center justify-between gap-2 break-words">
                      <span>
                        {transliterate(sec.titleDevanagari, targetScript)}
                      </span>
                      <span className="font-sans text-xs text-stone-500 font-bold">
                        {sec.titleEnglish}
                      </span>
                    </h3>
                  </div>

                  {/* Aphorisms under this section */}
                  <div className="space-y-12 pl-1 sm:pl-4">
                    {sec.sutras.map((sutra) => {
                      const fontSizeClass = 
                        readerFontSize === "sm" ? "text-xs" : 
                        readerFontSize === "lg" ? "text-sm sm:text-base" : 
                        readerFontSize === "xl" ? "text-base sm:text-lg" : 
                        "text-xs sm:text-sm";

                      const sanskritSizeClass = 
                        readerFontSize === "sm" ? "text-base leading-relaxed" : 
                        readerFontSize === "lg" ? "text-xl sm:text-2xl leading-relaxed" : 
                        readerFontSize === "xl" ? "text-2xl sm:text-3xl leading-relaxed" : 
                        "text-lg sm:text-xl leading-relaxed";

                      return (
                        <div key={sutra.id} className="space-y-3 pb-8 border-b border-stone-200/70 last:border-0 select-text">
                          <div className="flex items-center gap-2 text-[9px] font-mono font-bold text-stone-400 select-none print:hidden">
                            <span className="bg-[#3B2314] text-white px-1.5 py-0.2 font-bold uppercase tracking-wider">
                              Sūtra {sutra.sutraNum}
                            </span>
                            <span>ID: {sutra.id}</span>
                          </div>

                          <h4 className="text-[11.5px] sm:text-xs font-sans font-black uppercase text-[#8C6239] tracking-wider select-text break-words">
                            {transliterate(sutra.heading, targetScript)}
                          </h4>

                          {/* Sanskrit Aphorism Block */}
                          <div className="bg-white border border-[#8C6239]/20 py-4.5 px-4 sm:px-6 my-2 shadow-xs rounded-none select-text">
                            <p className={`font-serif font-black text-stone-900 leading-relaxed text-justify break-words ${sanskritSizeClass}`}>
                              {transliterate(sutra.devanagari, targetScript)}
                            </p>
                          </div>

                          {/* Translation block */}
                          <div className="border-l-2 border-[#795548]/40 pl-3.5 select-text">
                            <p className={`font-sans text-stone-850 leading-relaxed text-justify font-medium break-words ${fontSizeClass}`}>
                              {sutra.translations[sutraLang]}
                            </p>
                          </div>

                          {/* Commentary block */}
                          {sutra.commentarySanskrit && (
                            <div className="mt-2 text-xs text-stone-600 bg-stone-50/50 p-4 border border-stone-200/50 select-text rounded-none">
                              <span className="text-[8px] font-black uppercase tracking-widest text-[#C25E3E] block mb-1">
                                Sanskrit Commentary (विवरणम् / वृत्तिः)
                              </span>
                              <p className="font-serif leading-relaxed text-stone-800 text-justify text-[13px] break-words">
                                {transliterate(filterCommentary(sutra.commentarySanskrit, selectedCommentary), targetScript)}
                              </p>
                            </div>
                          )}

                          {sutra.commentary && (
                            <div className="mt-2 text-xs text-stone-600 bg-[#FAF9F5]/40 p-4 border border-stone-200/50 select-text rounded-none">
                              <span className="text-[8px] font-black uppercase tracking-widest text-[#795548] block mb-1">
                                Modern Hermeneutics
                              </span>
                              <p className={`font-sans leading-relaxed text-stone-750 text-justify break-words ${fontSizeClass}`}>
                                {sutra.commentary[sutraLang]}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Colophon / End of Book */}
            <div className="text-center py-12 border-t-2 border-stone-300 select-text">
              <span className="text-xl font-serif font-black text-stone-800">
                {transliterate("॥ इति समाप्तः ग्रन्थः ॥", targetScript)}
              </span>
              <p className="text-[10px] font-sans text-stone-400 font-bold uppercase tracking-widest mt-1">
                End of the Classical Text Recension
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Academic Share Modal */}
      <AcademicShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        payload={shareModalPayload}
        targetScript={targetScript}
      />
    </div>
  );
}

