/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Basic types for OCR correction & textual curation
export interface OcrCorrection {
  original: string;
  corrected: string;
  explanation: string;
}

export interface OcrCurationResponse {
  rawText: string;
  correctedText: string;
  corrections: OcrCorrection[];
}

// Types for Translation & Exegesis
export interface ExegeticalTerm {
  term: string;
  transliteration: string;
  definition: string;
}

export interface SyllogismPart {
  name: string; // e.g., "Proposition (Pratijñā)", "Reason (Hetu)", etc.
  sanskritName: string; // e.g., "Pratijñā"
  description: string; // Meaning of the step
  value: string; // Actual statement corresponding to this step
}

export interface TranslationResponse {
  originalText: string;
  translation: string;
  exegesis: string;
  terms: ExegeticalTerm[];
  syllogism?: SyllogismPart[];
}

// Types for Interactive Dialectics (Vāda-Tarka Vidyā)
export interface FallacyAnalysis {
  fallacyName: string; // e.g. "Viruddha", "Sādhāraṇa"
  sanskritName: string; // e.g. "विरुद्ध"
  description: string; // Explanation of the fallacy from classic text
  detected: boolean;
  explanation: string; // How it applies to the user's argument
}

export interface DialecticalResponse {
  originalArgument: string;
  validity: "perfect" | "defective" | "not_a_syllogism";
  fivePartSyllogism?: SyllogismPart[];
  fallacies: FallacyAnalysis[];
  scholarlyAnalysis: string; // Erudite breakdown in Nyāya philosophy
  refutation: string; // Counter-argument or constructive feedback
}

// Types for Mock Debate Conversation
export interface ChatMessage {
  id: string;
  sender: "user" | "opponent" | "tutor";
  text: string;
  timestamp: string;
  analysis?: DialecticalResponse;
}

// Types for Textual Mapping (Granthasāraṇī)
export interface NyayaText {
  id: string;
  title: string;
  devanagariTitle: string;
  author: string;
  century: string;
  school: "Nyāya" | "Vaiśeṣika" | "Navya-Nyāya" | "Syncretic" | "Syncretic (Nyāya-Vaiśeṣika)" | "Buddhist Logic" | "Jaina Logic" | "Advaita Vedānta";
  description: string;
  foundationalTexts: string[];
  commentaries: string[];
  sampleOcrText?: string;
  sampleAphorism?: string;
  wikisourceUrl?: string;
}

export interface NyayaSutraItem {
  id: string;
  sutraNum: string;
  devanagari: string;
  heading: string;
  translations: {
    english: string;
    hindi: string;
    bengali: string;
  };
  commentarySanskrit?: string;
  commentary?: {
    english: string;
    hindi: string;
    bengali: string;
  };
}

export interface NyayaSection {
  id: string;
  titleDevanagari: string;
  titleEnglish: string;
  sutras: NyayaSutraItem[];
}

export interface KosaTerm {
  id: string;
  term: string;
  iast: string;
  category: string;
  logicalRole: string;
  definition: string;
  translation: string;
  source: string;
  sanskritQuote: string;
  sanskritQuoteIast: string;
  commentaryNotes: string;
}

export interface ComparativePramana {
  school: string;
  count: number;
  sources: string[];
}

export interface ConceptDefinition {
  term: string;
  transliteration: string;
  definition: string;
  details: string;
}

export interface SavedHighlight {
  id: string;
  text: string;
  type: "verse" | "translation" | "commentary";
  script?: string; // only for verse
  color: string;
  note?: string;
  sutraId: string | null;
  sutraTitle: string;
  timestamp: string;
}


