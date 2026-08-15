/**
 * Sanskrit Script Transliterator for Tarka-Vidyā
 * Supports Devanagari, IAST (Gregorian Romanization), and major regional Indian scripts
 * using phonetic mapping and Unicode offsets.
 */

export const SCRIPT_NAMES: Record<string, string> = {
  devanagari: "देवनागरी (Devanagari)",
  iast: "Devanāgarī (Gregorian/IAST)",
  bengali: "বাংলা (Bengali)",
  telugu: "తెలుగు (Telugu)",
  tamil: "தமிழ் (Tamil)",
  kannada: "ಕನ್ನಡ (Kannada)",
  malayalam: "മലയാളം (Malayalam)",
  gujarati: "ગુજરાતી (Gujarati)",
  gurmukhi: "ਗੁਰਮੁਖੀ (Gurmukhi/Grantha)",
  odia: "ଓଡ଼ିଆ (Odia)"
};

// Unicode offsets relative to Devanagari (0x0900)
const SCRIPT_OFFSETS: Record<string, number> = {
  bengali: 0x0080,
  gurmukhi: 0x0100,
  gujarati: 0x0180,
  odia: 0x0200,
  tamil: 0x0280,
  telugu: 0x0300,
  kannada: 0x0380,
  malayalam: 0x0400
};

// Simple IAST to Devanagari maps for backup if we need to go IAST -> Devanagari
const IAST_TO_DEVANAGARI_MAPS: [RegExp, string][] = [
  [/au/g, "ौ"],
  [/ai/g, "ै"],
  [/ā/g, "ा"],
  [/ī/g, "ी"],
  [/ū/g, "ू"],
  [/ṛ/g, "ृ"],
  [/ṝ/g, "ॄ"],
  [/ḷ/g, "ॢ"],
  [/e/g, "े"],
  [/o/g, "ो"],
  [/a/g, ""], // Halanta resolver helper or vowel dropping
  // Consonants
  [/kh/g, "ख"], [/gh/g, "घ"], [/ṅ/g, "ङ"],
  [/ch/g, "छ"], [/jh/g, "झ"], [/ñ/g, "ञ"],
  [/ṭh/g, "ठ"], [/ḍh/g, "ढ"], [/ṇ/g, "ण"],
  [/th/g, "थ"], [/dh/g, "ध"],
  [/ph/g, "फ"], [/bh/g, "भ"],
  [/k/g, "क"], [/g/g, "ग"], [/c/g, "च"], [/j/g, "ज"],
  [/ṭ/g, "ट"], [/ḍ/g, "ड"], [/t/g, "त"], [/d/g, "द"], [/n/g, "न"],
  [/p/g, "प"], [/b/g, "ब"], [/m/g, "म"],
  [/y/g, "य"], [/r/g, "र"], [/l/g, "ल"], [/v/g, "व"],
  [/ś/g, "श"], [/ṣ/g, "ष"], [/s/g, "स"], [/h/g, "ह"],
  [/ṃ/g, "ं"], [/ḥ/g, "ः"], [/\'/g, "ऽ"]
];

/**
 * Transliterates a Devanagari string into another Indic script or leaves it as-is.
 */
export function transliterate(text: string, toScript: string): string {
  if (!text) return "";
  
  const textWithHyphens = injectSanskritSoftHyphens(text);

  if (toScript === "devanagari") return textWithHyphens;
  
  // If requesting Romanized/IAST but we received Devanagari, we can display our dual-field from the text items,
  // or return the original text if we don't have a direct Deva -> IAST parser (which is complex and prone to visual bugs).
  if (toScript === "iast") {
    return textWithHyphens; // Fallback to Devanagari with hyphens, or relying on pre-mapped fields
  }

  const offset = SCRIPT_OFFSETS[toScript];
  if (!offset) return textWithHyphens;

  let processedText = textWithHyphens;
  if (toScript === "bengali") {
    // त् with space after it (\u0924\u094d ) -> ৎ with space (\u09ce )
    processedText = processedText.replace(/\u0924\u094d(\s)/g, "\u09ce$1");
    // त् at final end of string -> ৎ (\u09ce)
    processedText = processedText.replace(/\u0924\u094d$/g, "\u09ce");
  }

  let result = "";
  for (let i = 0; i < processedText.length; i++) {
    const code = processedText.charCodeAt(i);
    // Devanagari block is 0x0900 to 0x097F
    if (code >= 0x0900 && code <= 0x097F) {
      if (toScript === "bengali") {
        if (code === 0x0902) { // Devanagari Anusvara (ं) -> Bengali Anusvara (ং)
          result += "ং";
        } else if (code === 0x0935) { // Devanagari VA (व) -> Bengali/Assamese WA (ৱ)
          result += "ৱ";
        } else if (code === 0x092f) { // Devanagari YA (य)
          const isEnjoined = (i > 0 && processedText.charCodeAt(i - 1) === 0x094d) || 
                             (i < processedText.length - 1 && processedText.charCodeAt(i + 1) === 0x094d);
          if (isEnjoined) {
            result += "য";
          } else {
            result += "য়";
          }
        } else if (code === 0x092c) { // Devanagari BA (ब) -> Bengali BA (ব)
          result += "ব";
        } else {
          result += String.fromCharCode(code + offset);
        }
      } else {
        result += String.fromCharCode(code + offset);
      }
    } else {
      result += processedText[i];
    }
  }

  // Particular script-specific cleanups if necessary (e.g. Tamil pulli or Bengali adjustments)
  return result;
}

/**
 * Hook or helper to format text based on active script theme.
 * If theme is "combined", returns "Devanagari / IAST"
 */
export function formatSanskrit(deva: string, iast: string, scriptTheme: string, targetScript: string = "devanagari"): string {
  if (!deva) return "";
  if (!iast) return deva;

  const convertedDeva = transliterate(deva, targetScript);

  if (scriptTheme === "devanagari") {
    return convertedDeva;
  } else if (scriptTheme === "gregorian") {
    return iast;
  } else {
    // Combined
    return `${convertedDeva} [${iast}]`;
  }
}

/**
 * Returns the appropriate CSS font class for the selected script.
 */
export function getScriptFontClass(scriptId: string): string {
  switch (scriptId) {
    case "gurmukhi":
      return "font-script-gurmukhi";
    case "kannada":
      return "font-script-kannada";
    case "tamil":
      return "font-script-tamil";
    case "telugu":
      return "font-script-telugu";
    case "devanagari":
      return "font-script-devanagari";
    case "bengali":
      return "font-script-bengali";
    case "malayalam":
      return "font-script-malayalam";
    case "gujarati":
      return "font-script-gujarati";
    case "odia":
      return "font-script-odia";
    case "iast":
      return "font-script-iast";
    default:
      return "font-sans";
  }
}

/**
 * Injects soft hyphens (\u00AD) into Sanskrit words (Devanagari, IAST, or converted scripts)
 * to allow elegant line breaking with hyphens/arrows on small screens.
 */
export function injectSanskritSoftHyphens(text: string): string {
  if (!text) return "";
  
  // Split input into words, keeping punctuation and whitespace as is
  return text.split(/([^\s\d।॥!?,;:()\[\]{}]+)/).map((part, index) => {
    // If it's a word token (at odd indices in split), process it
    if (index % 2 === 1) {
      if (part.length > 8) {
        return insertSoftHyphensInWord(part);
      }
    }
    return part;
  }).join("");
}

function insertSoftHyphensInWord(word: string): string {
  // If the word contains any Indic characters (Devanagari, Bengali, Gurmukhi, Gujarati, Odia, Tamil, Telugu, Kannada, Malayalam, etc.),
  // do NOT inject any soft hyphens. Inserting \u00AD breaks grapheme clusters, ligatures, and dependent vowel signs (matras/svara karas),
  // causing them to render as detached, floating, or broken glyphs.
  const hasIndic = /[\u0900-\u0D7F]/.test(word);
  if (hasIndic) {
    return word;
  }

  // For Latin / IAST words, we can safely insert soft hyphens.
  let result = "";
  let sinceLastBreak = 0;
  const vowels = /[aeiouāīūṛṝḷṃḥ]/i;
  for (let i = 0; i < word.length; i++) {
    const char = word[i];
    result += char;
    sinceLastBreak++;
    
    if (i < word.length - 3 && sinceLastBreak >= 4) {
      const isVowel = vowels.test(char);
      const nextChar = word[i + 1] || "";
      const isNextConsonant = !vowels.test(nextChar) && /[a-zāīūṛṝḷṃḥ]/i.test(nextChar);
      
      if ((isVowel && isNextConsonant) || sinceLastBreak >= 5) {
        result += "\u00AD";
        sinceLastBreak = 0;
      }
    }
  }
  return result;
}

