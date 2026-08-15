import { GoogleGenAI, Type } from "@google/genai";
import * as fs from "fs";
import * as path from "path";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

interface SutraRaw {
  id: string;
  sutraNum: string;
  text: string;
  type: string;
}

interface SectionRaw {
  id: string;
  titleDevanagari: string;
  titleEnglish: string;
  sutras: SutraRaw[];
}

const rawSections: SectionRaw[] = [
  // AHNIKA 1
  {
    id: "sec-4-1-pravrtti-dosa",
    titleDevanagari: "प्रवृत्तिदोषसामान्यपरीक्षाप्रकरणम्",
    titleEnglish: "General Examination of Activity and Defects (Sūtras 4.1.1 - 4.1.2)",
    sutras: [
      { id: "4.1.1", sutraNum: "४.१.१", text: "प्रवृत्तिर्यथोक्ता", type: "सिद्धान्त-सूत्र" },
      { id: "4.1.2", sutraNum: "४.१.२", text: "तथा दोषाः", type: "सिद्धान्त-सूत्र" }
    ]
  },
  {
    id: "sec-4-1-dosa-trairasya",
    titleDevanagari: "दोषत्रैराश्यपरीक्षाप्रकरणम्",
    titleEnglish: "Triad of Defects (Sūtras 4.1.3 - 4.1.9)",
    sutras: [
      { id: "4.1.3", sutraNum: "४.१.३", text: "त्रैराश्यं रागद्वेषमोहार्थान्तर्भावात्", type: "सिद्धान्त-सूत्र" },
      { id: "4.1.4", sutraNum: "४.१.४", text: "न, एकप्रत्यनीकभावात्", type: "पूर्वपक्ष-सूत्र" },
      { id: "4.1.5", sutraNum: "४.१.५", text: "व्यभिचारादहेतुः", type: "सिद्धान्त-सूत्र" },
      { id: "4.1.6", sutraNum: "४.१.६", text: "तेषां मोहः पापीयान्, नामूढस्येतरोत्पत्तेः", type: "सिद्धान्त-सूत्र" },
      { id: "4.1.7", sutraNum: "४.१.७", text: "निमित्तनैमित्तिकभावादर्थान्तरभावो दोषेभ्यः", type: "पूर्वपक्ष-सूत्र" },
      { id: "4.1.8", sutraNum: "४.१.८", text: "न दोषलक्षणावरोधान्मोहस्य", type: "सिद्धान्त-सूत्र" },
      { id: "4.1.9", sutraNum: "४.१.९", text: "निमित्तनैमित्तिकोपपत्तेश्च तुल्यजातीयानामप्रतिषेधः", type: "सिद्धान्त-सूत्र" }
    ]
  },
  {
    id: "sec-4-1-pretyabhava",
    titleDevanagari: "प्रेत्यभावपरीक्षाप्रकरणम्",
    titleEnglish: "Transmigration & Rebirth (Sūtras 4.1.10 - 4.1.13)",
    sutras: [
      { id: "4.1.10", sutraNum: "४.१.१०", text: "आत्मनित्यत्वे प्रेत्यभावसिद्धिः", type: "सिद्धान्त-सूत्र" },
      { id: "4.1.11", sutraNum: "४.१.११", text: "व्यक्ताद् व्यक्तानाम्, प्रत्यक्षप्रामाण्यात्", type: "सिद्धान्त-सूत्र" },
      { id: "4.1.12", sutraNum: "४.१.१२", text: "न, घटाद् घटनिष्पत्तेः", type: "पूर्वपक्ष-सूत्र" },
      { id: "4.1.13", sutraNum: "४.१.१३", text: "व्यक्ताद् घटनिष्पत्तेरप्रतिषेधः", type: "सिद्धान्त-सूत्र" }
    ]
  },
  {
    id: "sec-4-1-shunyata-upadana",
    titleDevanagari: "शून्यतोपादाननिराकरणप्रकरणम्",
    titleEnglish: "Refutation of Void as Material Cause (Sūtras 4.1.14 - 4.1.18)",
    sutras: [
      { id: "4.1.14", sutraNum: "४.१.१४", text: "अभावाद् भावोत्पत्तिः, नानुपमृद्य प्रादुर्भावात्", type: "पूर्वपक्ष-सूत्र" },
      { id: "4.1.15", sutraNum: "४.१.१५", text: "व्याघातादप्रयोगः", type: "सिद्धान्त-सूत्र" },
      { id: "4.1.16", sutraNum: "४.१.१६", text: "न, अतीतानागतयोः कारकशब्दप्रयोगात्", type: "पूर्वपक्ष-सूत्र" },
      { id: "4.1.17", sutraNum: "४.१.१७", text: "न, विनष्टेभ्यो ऽनिष्पत्तेः", type: "सिद्धान्त-सूत्र" },
      { id: "4.1.18", sutraNum: "४.१.१८", text: "क्रमनिर्देशादप्रतिषेधः", type: "सिद्धान्त-सूत्र" }
    ]
  },
  {
    id: "sec-4-1-ishvara-upadana",
    titleDevanagari: "ईश्वरोपादानाताप्रकरणम्",
    titleEnglish: "God as the Cause of the Universe (Sūtras 4.1.19 - 4.1.21)",
    sutras: [
      { id: "4.1.19", sutraNum: "४.१.१९", text: "ईश्वरः कारणम्, पुरुषकर्माफल्यदर्शनात्", type: "सिद्धान्त-सूत्र" },
      { id: "4.1.20", sutraNum: "४.१.२०", text: "न, पुरुषकर्माभावे फ्लानिष्पत्तेः", type: "पूर्वपक्ष-सूत्र" },
      { id: "4.1.21", sutraNum: "४.१.२१", text: "तत्कारितत्वाद् अहेतुः", type: "सिद्धान्त-सूत्र" }
    ]
  },
  {
    id: "sec-4-1-akasmikatva-nirakarana",
    titleDevanagari: "आकस्मिकत्वनिराकरणप्रकरणम्",
    titleEnglish: "Refutation of Accidentalism (Sūtras 4.1.22 - 4.1.24)",
    sutras: [
      { id: "4.1.22", sutraNum: "४.१.२२", text: "अनिमित्ततो भावोत्पत्तिः, कण्टकतैक्ष्ण्यादिदर्शनात्", type: "पूर्वपक्ष-सूत्र" },
      { id: "4.1.23", sutraNum: "४.१.२३", text: "अनिमित्तनिमित्तत्वान्ननिमित्ततः", type: "सिद्धान्त-सूत्र" },
      { id: "4.1.24", sutraNum: "४.१.२४", text: "निमित्तनिमित्तयोरर्थान्तरभावादप्रतिषेधः", type: "सिद्धान्त-सूत्र" }
    ]
  },
  {
    id: "sec-4-1-sarva-anityatva",
    titleDevanagari: "सर्वानित्यत्वनिराकरणप्रकरणम्",
    titleEnglish: "Refutation of Universal Impermanence (Sūtras 4.1.25 - 4.1.28)",
    sutras: [
      { id: "4.1.25", sutraNum: "४.१.२५", text: "सर्वम् अनित्यम्, उत्पत्तिविनाशधर्मकत्वात्", type: "पूर्वपक्ष-सूत्र" },
      { id: "4.1.26", sutraNum: "४.१.२६", text: "न, अनित्यतानित्यत्वात्", type: "सिद्धान्त-सूत्र" },
      { id: "4.1.27", sutraNum: "४.१.२७", text: "तदनित्यत्वमग्नेर्दाह्यं विनाश्यानुविनाशवत्", type: "सिद्धान्त-सूत्र" },
      { id: "4.1.28", sutraNum: "४.१.२८", text: "नित्यस्याप्रत्याख्यानम्, यथोपलब्धि व्यवस्थानात्", type: "सिद्धान्त-सूत्र" }
    ]
  },
  {
    id: "sec-4-1-sarva-nityatva",
    titleDevanagari: "सर्वनित्यत्वनिराकरणम्",
    titleEnglish: "Refutation of Universal Permanence (Sūtras 4.1.29 - 4.1.33)",
    sutras: [
      { id: "4.1.29", sutraNum: "४.१.२९", text: "सर्वं नित्यम्, पञ्चभूतनित्यत्वात्", type: "पूर्वपक्ष-सूत्र" },
      { id: "4.1.30", sutraNum: "४.१.३०", text: "न, उत्पत्तिविनाशकारणोपलब्धेः", type: "सिद्धान्त-सूत्र" },
      { id: "4.1.31", sutraNum: "४.१.३१", text: "तल्लक्षणावरोधादप्रतिषेधः", type: "पूर्वपक्ष-सूत्र" },
      { id: "4.1.32", sutraNum: "४.१.३२", text: "न, उत्पत्तितत्कारणोपलब्धेः", type: "सिद्धान्त-सूत्र" },
      { id: "4.1.33", sutraNum: "४.१.३३", text: "न, व्यवस्थानुपपत्तेः", type: "सिद्धान्त-सूत्र" }
    ]
  },
  {
    id: "sec-4-1-sarva-prthaktva",
    titleDevanagari: "सर्वपृथक्त्वनिराकरणप्रकरणम्",
    titleEnglish: "Refutation of Absolute Singularity/Plurality (Sūtras 4.1.34 - 4.1.36)",
    sutras: [
      { id: "4.1.34", sutraNum: "४.१.३४", text: "सर्वं पृथग्, भावलक्षणपृथक्त्वात्", type: "पूर्वपक्ष-सूत्र" },
      { id: "4.1.35", sutraNum: "४.१.३५", text: "न, अनेकलक्षणैरेकभावनिष्पत्तेः", type: "सिद्धान्त-सूत्र" },
      { id: "4.1.36", sutraNum: "४.१.३६", text: "लक्षणव्यवस्थानादेवाप्रतिषेधः", type: "सिद्धान्त-सूत्र" }
    ]
  },
  {
    id: "sec-4-1-sarva-shunyata",
    titleDevanagari: "सर्वशून्यतानिराकरणप्रकरणम्",
    titleEnglish: "Refutation of Universal Void/Nihilism (Sūtras 4.1.37 - 4.1.40)",
    sutras: [
      { id: "4.1.37", sutraNum: "४.१.३७", text: "सर्वम् अभावो भावेष्वितरेतराभावसिद्धेः", type: "पूर्वपक्ष-सूत्र" },
      { id: "4.1.38", sutraNum: "४.१.३८", text: "न, स्वभावसिद्धेर्भावानाम्", type: "सिद्धान्त-सूत्र" },
      { id: "4.1.39", sutraNum: "४.१.३९", text: "न स्वभावसिद्धिः, आपेक्षिकत्वात्", type: "पूर्वपक्ष-सूत्र" },
      { id: "4.1.40", sutraNum: "४.१.४०", text: "व्याहतत्वादयुक्तम्", type: "सिद्धान्त-सूत्र" }
    ]
  },
  {
    id: "sec-4-1-sankhya-ekanta",
    titleDevanagari: "संख्यैकान्तवादप्रकरणम्",
    titleEnglish: "Refutation of Monistic Number Theories (Sūtras 4.1.41 - 4.1.43)",
    sutras: [
      { id: "4.1.41", sutraNum: "४.१.४१", text: "संख्यैकान्तासिद्धिः, कारणानुपपत्त्युपपत्तिभ्याम्", type: "सिद्धान्त-सूत्र" },
      { id: "4.1.42", sutraNum: "४.१.४२", text: "न, कारणवयवाभावात्", type: "पूर्वपक्ष-सूत्र" },
      { id: "4.1.43", sutraNum: "४.१.४३", text: "निरवयवत्वादहेतुः", type: "सिद्धान्त-सूत्र" }
    ]
  },
  {
    id: "sec-4-1-phala-pariksa",
    titleDevanagari: "फलपरीक्षाप्रकरणम्",
    titleEnglish: "Examination of Retribution & Results of Karma (Sūtras 4.1.44 - 4.1.54)",
    sutras: [
      { id: "4.1.44", sutraNum: "४.१.४४", text: "सद्यः कालान्तरे च फलनिष्पत्तेः संशयः", type: "सिद्धान्त-सूत्र" },
      { id: "4.1.45", sutraNum: "४.१.४५", text: "न सद्यः, कालान्तरोपभोग्यत्वात्", type: "सिद्धान्त-सूत्र" },
      { id: "4.1.46", sutraNum: "४.१.४६", text: "कालान्तरेणानिष्पत्तिहेतुर्विनाशात्", type: "पूर्वपक्ष-सूत्र" },
      { id: "4.1.47", sutraNum: "४.१.४७", text: "प्राङ्निष्पत्तेर्वृक्षफलवत् तत्स्यात्", type: "सिद्धान्त-सूत्र" },
      { id: "4.1.48", sutraNum: "४.१.४८", text: "नासन्न सन्न सदसत्, सदसतोर्वैधर्मयात्", type: "पूर्वपक्ष-सूत्र" },
      { id: "4.1.49", sutraNum: "४.१.४९", text: "उत्पादव्ययदर्शनात्", type: "सिद्धान्त-सूत्र" },
      { id: "4.1.50", sutraNum: "४.१.५०", text: "बुद्धिसिद्धं तु तदसत्", type: "सिद्धान्त-सूत्र" },
      { id: "4.1.51", sutraNum: "४.१.५१", text: "आश्रयव्यतिरेकाद् वृक्षफलोत्पत्तिवद् इत्यहेतुः", type: "पूर्वपक्ष-सूत्र" },
      { id: "4.1.52", sutraNum: "४.१.५२", text: "प्रीतेरात्माश्रयत्वादप्रतिषेधः", type: "सिद्धान्त-सूत्र" },
      { id: "4.1.53", sutraNum: "४.१.५३", text: "न पुत्रपशुस्त्रीपरिच्छेदहिरण्यान्नादिफलनिर्द्देशात्", type: "पूर्वपक्ष-सूत्र" },
      { id: "4.1.54", sutraNum: "४.१.५४", text: "तत्सम्बन्धात् फलनिष्पत्तेस्तेषु फलवदुपचारः", type: "सिद्धान्त-सूत्र" }
    ]
  },
  {
    id: "sec-4-1-duhkha-pariksa",
    titleDevanagari: "दुःखपरीक्षाप्रकरणम्",
    titleEnglish: "Examination of Pain & Suffering (Sūtras 4.1.55 - 4.1.58)",
    sutras: [
      { id: "4.1.55", sutraNum: "४.१.५५", text: "विविधवाधनायोगाद् दुःखमेव जन्मोत्पत्तिः", type: "सिद्धान्त-सूत्र" },
      { id: "4.1.56", sutraNum: "४.१.५६", text: "न, सुखस्याप्यन्तरालनिष्पत्तेः", type: "सिद्धान्त-सूत्र" },
      { id: "4.1.57", sutraNum: "४.१.५७", text: "भाधनानिवृत्तेर्वेदयतः प्र्येषणदोषादप्रतिषेधः", type: "सिद्धान्त-सूत्र" },
      { id: "4.1.58", sutraNum: "४.१.५८", text: "दुःखविकल्पे सुखाभिमानाच्च", type: "सिद्धान्त-सूत्र" }
    ]
  },
  {
    id: "sec-4-1-apavarga-pariksa",
    titleDevanagari: "अपवर्गपरीक्षाप्रकरणम्",
    titleEnglish: "Examination of Ultimate Liberation (Sūtras 4.1.59 - 4.1.68)",
    sutras: [
      { id: "4.1.59", sutraNum: "४.१.५९", text: "ऋणक्लेशप्रवृत्त्यनुब्न्धादपवर्गाभावः", type: "पूर्वपक्ष-सूत्र" },
      { id: "4.1.60", sutraNum: "४.१.६०", text: "प्रधानशब्दानुपपत्तेर्गुणशब्देनानुवादो निन्दाप्रशंसोपपत्तेः", type: "सिद्धान्त-सूत्र" },
      { id: "4.1.61", sutraNum: "४.१.६१", text: "समारोपणादात्मन्यप्रतिषेधः", type: "सिद्धान्त-सूत्र" },
      { id: "4.1.62", sutraNum: "४.१.६२", text: "पात्रचयान्तानुपपत्तेश्च फलाभावः", type: "सिद्धान्त-सूत्र" },
      { id: "4.1.63", sutraNum: "४.१.६३", text: "सुषुप्तस्य स्वप्नादर्शने क्लेशाभावादपवर्गः", type: "सिद्धान्त-सूत्र" },
      { id: "4.1.64", sutraNum: "४.१.६४", text: "न प्रवृत्तिः प्रतिसन्धानाय हीनक्लेशस्य", type: "सिद्धान्त-सूत्र" },
      { id: "4.1.65", sutraNum: "४.१.६५", text: "न, क्लेशसन्ततेः स्वाभाविकत्वात्", type: "पूर्वपक्ष-सूत्र" },
      { id: "4.1.66", sutraNum: "४.१.६६", text: "प्रागुत्पत्तेरभावानित्यत्ववत् स्वाभाविके ऽप्यनित्यत्वम्", type: "सिद्धान्त-सूत्र" },
      { id: "4.1.67", sutraNum: "४.१.६७", text: "अणुश्यामतानित्यत्ववद् वा", type: "सिद्धान्त-सूत्र" },
      { id: "4.1.68", sutraNum: "४.१.६८", text: "न, सङ्कल्पनिमित्तत्वाच्च रागादीनाम्", type: "सिद्धान्त-सूत्र" }
    ]
  },

  // AHNIKA 2
  {
    id: "sec-4-2-tattvajnana-utpatti",
    titleDevanagari: "तत्त्वज्ञानोत्पत्तिप्रकरणम्",
    titleEnglish: "Arising of True Knowledge (Sūtras 4.2.1 - 4.2.3)",
    sutras: [
      { id: "4.2.1", sutraNum: "४.२.१", text: "दोषनिमित्तानां तत्त्वज्ञानादहङ्कारनिवृत्तिः", type: "सिद्धान्त-सूत्र" },
      { id: "4.2.2", sutraNum: "४.२.२", text: "दोषनिमित्तं रूपादयो विषयः सङ्कल्पकृताः", type: "सिद्धान्त-सूत्र" },
      { id: "4.2.3", sutraNum: "४.२.३", text: "तन्निमित्तं त्ववयव्यभिमानः", type: "सिद्धान्त-सूत्र" }
    ]
  },
  {
    id: "sec-4-2-avayavi",
    titleDevanagari: "प्रासङ्गिकम् अवयविप्रकरणम्",
    titleEnglish: "Syllogistic Whole vs Parts (Sūtras 4.2.4 - 4.2.17)",
    sutras: [
      { id: "4.2.4", sutraNum: "४.२.४", text: "विद्याविद्याद्वैविध्यात् संशयः", type: "पूर्वपक्ष-सूत्र" },
      { id: "4.2.5", sutraNum: "४.२.५", text: "तदसंशयः, पूर्वहेतुप्रसिद्धत्वात्", type: "सिद्धान्त-सूत्र" },
      { id: "4.2.6", sutraNum: "४.२.६", text: "वृत्त्यनुपपत्तेरपि तर्हि न संशयः", type: "पूर्वपक्ष-सूत्र" },
      { id: "4.2.7", sutraNum: "४.२.७", text: "कृत्स्नैकदेशावृत्तित्वादवयवानामवयव्यभावः", type: "पूर्वपक्ष-सूत्र" },
      { id: "4.2.8", sutraNum: "४.२.८", text: "तेषु चावृत्तेरवयव्यभावः", type: "पूर्वपक्ष-सूत्र" },
      { id: "4.2.9", sutraNum: "४.२.९", text: "पृथक चावयवेभ्यो ऽवृत्तेः", type: "सिद्धान्त-सूत्र" },
      { id: "4.2.10", sutraNum: "४.२.१०", text: "न चावयव्यवयवाः", type: "पूर्वपक्ष-सूत्र" },
      { id: "4.2.11", sutraNum: "४.२.११", text: "एकस्मिन् भेदाभावाद् भेदशब्दप्रयोगानुपपत्तेरप्रश्नः", type: "सिद्धान्त-सूत्र" },
      { id: "4.2.12", sutraNum: "४.२.१२", text: "अवयवान्तरभावे ऽप्यवृत्तेरहेतुः", type: "सिद्धान्त-सूत्र" },
      { id: "4.2.13", sutraNum: "४.२.१३", text: "केशसमूहे तैमिरिकोपलब्धिवत् तदुपलब्धिः", type: "पूर्वपक्ष-सूत्र" },
      { id: "4.2.14", sutraNum: "४.२.१४", text: "स्वविषयानतिक्रमेणेन्द्रियस्य पटुमन्दभावाद्विषयग्रहणस्य तथाभाबो नाविषये प्रवृत्तिः", type: "सिद्धान्त-सूत्र" },
      { id: "4.2.15", sutraNum: "४.२.१५", text: "अवयवावयविप्रसङ्गश्चैवमाप्रलयात्", type: "सिद्धान्त-सूत्र" },
      { id: "4.2.16", sutraNum: "४.२.१६", text: "न प्रलयो ऽणुसद्भावात्", type: "सिद्धान्त-सूत्र" },
      { id: "4.2.17", sutraNum: "४.२.१७", text: "परं वा त्रुटेः", type: "सिद्धान्त-सूत्र" }
    ]
  },
  {
    id: "sec-4-2-niravayava",
    titleDevanagari: "औपोद्घातिकं निरवयवप्रकरणम्",
    titleEnglish: "Partless Atoms & Space (Sūtras 4.2.18 - 4.2.25)",
    sutras: [
      { id: "4.2.18", sutraNum: "४.२.१८", text: "आकाशव्यतिभेदात् तदनुपपत्तिः", type: "सिद्धान्त-सूत्र" },
      { id: "4.2.19", sutraNum: "४.२.१९", text: "आकाशासर्वगतत्वं वा", type: "पूर्वपक्ष-सूत्र" },
      { id: "4.2.20", sutraNum: "४.२.२०", text: "अन्तर्रबहिश्च कार्यद्रव्यस्य कारणान्तरवचनादकार्ये तदभावः", type: "सिद्धान्त-सूत्र" },
      { id: "4.2.21", sutraNum: "४.२.२१", text: "शब्दसंयोगविभावाच्च सर्वगतम्", type: "सिद्धान्त-सूत्र" },
      { id: "4.2.22", sutraNum: "४.२.२२", text: "अव्यूहाविष्टम्भविभुत्वानि चाकाशधर्माः", type: "सिद्धान्त-सूत्र" },
      { id: "4.2.23", sutraNum: "४.२.२३", text: "मूर्तिमतां च संस्थानोपपत्तेरवयवसद्भावः", type: "पूर्वपक्ष-सूत्र" },
      { id: "4.2.24", sutraNum: "४.२.२४", text: "संयोगोपपत्तेश्च", type: "पूर्वपक्ष-सूत्र" },
      { id: "4.2.25", sutraNum: "४.२.२५", text: "अनवस्थाकारितत्वादनवस्थानुपपत्तेश्चाप्रतिषेधः", type: "सिद्धान्त-सूत्र" }
    ]
  },
  {
    id: "sec-4-2-bahyartha-bhanga",
    titleDevanagari: "बाह्यार्थभङ्गनिराकरणप्रकरणम्",
    titleEnglish: "Refutation of Idealism & External World denial (Sūtras 4.2.26 - 4.2.37)",
    sutras: [
      { id: "4.2.26", sutraNum: "४.२.२६", text: "बुद्ध्या विवेचनात्तु भावानां याथात्म्यानुपलब्धिस्तन्त्वपकर्षणे पटसद्भावानुपलब्धिवत् तदनुपलब्धिः", type: "पूर्वपक्ष-सूत्र" },
      { id: "4.2.27", sutraNum: "४.२.२७", text: "व्याहतत्वादहेतुः", type: "सिद्धान्त-सूत्र" },
      { id: "4.2.28", sutraNum: "४.२.२८", text: "तदाश्रयत्वादपृथग्ग्रहणम्", type: "सिद्धान्त-सूत्र" },
      { id: "4.2.29", sutraNum: "४.२.२९", text: "प्रमाणतश्चार्थप्रतिपत्तेः", type: "सिद्धान्त-सूत्र" },
      { id: "4.2.30", sutraNum: "४.२.३०", text: "प्रमाणानुपपत्त्युपपत्तिभ्याम्", type: "सिद्धान्त-सूत्र" },
      { id: "4.2.31", sutraNum: "४.२.३१", text: "स्वप्नविषयाभिमानवदयं प्रमाणप्रमेयाभिमानः", type: "पूर्वपक्ष-सूत्र" },
      { id: "4.2.32", sutraNum: "४.२.३२", text: "मायागन्धर्वनगरमृगतृष्णिकावद्वा", type: "पूर्वपक्ष-सूत्र" },
      { id: "4.2.33", sutraNum: "४.२.३३", text: "हेत्वभावादसिद्धिः", type: "सिद्धान्त-सूत्र" },
      { id: "4.2.34", sutraNum: "४.२.३४", text: "स्मृतिसंकल्पवच्च स्वप्नविषयाभिमानः", type: "सिद्धान्त-सूत्र" },
      { id: "4.2.35", sutraNum: "४.२.३५", text: "मिथ्योपलब्धेर्विनाशस्तत्त्वज्ञानात्स्वप्नविषयाभिमानप्रणाशवत् प्रतिबोधे", type: "सिद्धान्त-सूत्र" },
      { id: "4.2.36", sutraNum: "४.२.३६", text: "बुद्धैशचैव निमित्तसद्भावोपलम्भात्", type: "सिद्धान्त-सूत्र" },
      { id: "4.2.37", sutraNum: "४.२.३७", text: "तत्त्वप्रधानभेदाच्च मिथ्याबुद्धेर्द्वैविध्योपपत्तिः", type: "सिद्धान्त-सूत्र" }
    ]
  },
  {
    id: "sec-4-2-tattvajnana-vivrddhi",
    titleDevanagari: "तत्त्वज्ञानविवृद्धिप्रकरणम्",
    titleEnglish: "Cultivation & Growth of True Knowledge (Sūtras 4.2.38 - 4.2.49)",
    sutras: [
      { id: "4.2.38", sutraNum: "४.२.३८", text: "समाधिविशेषाभ्यासात्", type: "सिद्धान्त-सूत्र" },
      { id: "4.2.39", sutraNum: "४.२.३९", text: "न, अर्थविशेषप्रावल्यात्", type: "पूर्वपक्ष-सूत्र" },
      { id: "4.2.40", sutraNum: "४.२.४०", text: "क्षुदादिभिः प्रवर्तनाच्च", type: "पूर्वपक्ष-सूत्र" },
      { id: "4.2.41", sutraNum: "४.२.४१", text: "पूर्वकृतफलानुबन्धात् तदुत्पत्तिः", type: "सिद्धान्त-सूत्र" },
      { id: "4.2.42", sutraNum: "४.२.४२", text: "अरण्यगुहापुलिनादिषु योगाभ्यासोपदेशः", type: "सिद्धान्त-सूत्र" },
      { id: "4.2.43", sutraNum: "४.२.४३", text: "अपवर्गे ऽप्येवं प्रसङ्गः", type: "पूर्वपक्ष-सूत्र" },
      { id: "4.2.44", sutraNum: "४.२.४४", text: "न, निष्पन्नावश्यम्भावित्वात्", type: "सिद्धान्त-सूत्र" },
      { id: "4.2.45", sutraNum: "४.२.४५", text: "तदभावश्चापवर्गे", type: "सिद्धान्त-सूत्र" },
      { id: "4.2.46", sutraNum: "४.२.४६", text: "तदर्थं यमनियमाभ्यासात्मसंस्कारो योगाच्चाध्यात्मविध्युपायैः", type: "सिद्धान्त-सूत्र" },
      { id: "4.2.47", sutraNum: "४.२.४७", text: "ज्ञानग्रहणाभ्यासस्तद्विद्यैश्च सह संवादः", type: "सिद्धान्त-सूत्र" },
      { id: "4.2.48", sutraNum: "४.२.४८", text: "तं शिष्यगुरुसब्रह्मचारिविशिष्टश्रेयो ऽर्थिभिरनसूयिभिरभ्युपेयात्", type: "सिद्धान्त-सूत्र" },
      { id: "4.2.49", sutraNum: "४.२.४९", text: "प्रतिपक्षहीनम् अपि वा प्रयोजनार्थमर्थित्वे", type: "सिद्धान्त-सूत्र" }
    ]
  },
  {
    id: "sec-4-2-tattvajnana-paripalana",
    titleDevanagari: "तत्त्वज्ञानपरिपालनप्रकरणम्",
    titleEnglish: "Protection & Preservation of True Knowledge (Sūtras 4.2.50 - 4.2.51)",
    sutras: [
      { id: "4.2.50", sutraNum: "४.२.५०", text: "तत्त्वाध्यवसायसंरक्षणार्थं जल्पवितण्डे, बीजप्ररोहसंरक्षणार्थं कण्टकशाखावरणवत्", type: "सिद्धान्त-सूत्र" },
      { id: "4.2.51", sutraNum: "४.२.५१", text: "ताभ्यां विगृह्यकथनम्", type: "सिद्धान्त-सूत्र" }
    ]
  }
];

async function translateSutraGroupWithRetry(sutras: SutraRaw[], secTitle: string): Promise<any[]> {
  const prompt = `You are an expert in Nyāya Philosophy, Sanskrit linguistics, and Indian Darshanas.
Given the following Sanskrit sūtras from Gautamīya Nyāyasūtra Chapter 4, under the section "${secTitle}", generate a highly polished and professional translation and commentary in English, Hindi, and Bengali for each.

Return the result as a JSON array matching exactly this schema (without markdown codeblocks):
[
  {
    "id": "4.1.x", // string
    "sutraNum": "४.१.x", // string
    "heading": "Descriptive Heading in English & Sanskrit", // string
    "devanagari": "Sanskrit text", // string
    "translations": {
      "english": "Precise scholarly translation",
      "hindi": "Precise Hindi translation",
      "bengali": "Precise Bengali translation"
    },
    "commentarySanskrit": "Concise traditional Sanskrit explanation of the sutra.",
    "commentary": {
      "english": "In-depth scholarly commentary explaining the debate and philosophical arguments.",
      "hindi": "Hindi academic commentary.",
      "bengali": "Bengali academic commentary."
    }
  }
]

Sūtras:
${sutras.map(s => `- ID: ${s.id}, Num: ${s.sutraNum}, Text: ${s.text}, Type: ${s.type}`).join("\n")}

Respond ONLY with the JSON array.`;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      const cleanText = response.text?.trim() || "[]";
      return JSON.parse(cleanText);
    } catch (error: any) {
      console.warn(`Attempt ${attempt} failed for "${secTitle}": ${error.message}`);
      if (attempt < 3) {
        // Wait 15 seconds before retry
        console.log(`Waiting 15s before attempt ${attempt + 1}...`);
        await new Promise(resolve => setTimeout(resolve, 15000));
      } else {
        throw error;
      }
    }
  }
  return [];
}

async function run() {
  console.log("Starting Chapter 4 Bundled Generation with safe rate-limiting...");
  const outputSections: any[] = [];

  for (let i = 0; i < rawSections.length; i++) {
    const sec = rawSections[i];
    console.log(`Processing section ${i + 1}/${rawSections.length}: ${sec.titleDevanagari}...`);
    
    try {
      const translatedSutras = await translateSutraGroupWithRetry(sec.sutras, sec.titleDevanagari);
      outputSections.push({
        id: sec.id,
        titleDevanagari: sec.titleDevanagari,
        titleEnglish: sec.titleEnglish,
        sutras: translatedSutras
      });
      console.log(`Successfully completed section: ${sec.titleDevanagari}`);
    } catch (err) {
      console.error(`Fatal failure for ${sec.titleDevanagari}, writing fallback.`);
      outputSections.push({
        id: sec.id,
        titleDevanagari: sec.titleDevanagari,
        titleEnglish: sec.titleEnglish,
        sutras: sec.sutras.map(s => ({
          id: s.id,
          sutraNum: s.sutraNum,
          heading: `${s.text} (${s.type})`,
          devanagari: s.text,
          translations: {
            english: `Sūtra ${s.id}: ${s.text} (${s.type})`,
            hindi: `सूत्र ${s.sutraNum}: ${s.text} (${s.type})`,
            bengali: `সূত্র ${s.sutraNum}: ${s.text} (${s.type})`
          },
          commentary: {
            english: `Traditional Nyāya examination of ${s.text}.`,
            hindi: `न्याय दर्शन के अनुसार ${s.text} की विवेचना।`,
            bengali: `ন্যায় দর্শন অনুসারে ${s.text}-এর ব্যাখ্যা।`
          }
        }))
      });
    }

    // Always wait 15 seconds between SUCCESSFUL sections to stay perfectly within 4 requests per minute limit
    if (i < rawSections.length - 1) {
      console.log("Sleeping for 15 seconds to ensure clean API quota safety...");
      await new Promise(resolve => setTimeout(resolve, 15000));
    }
  }

  // Load existing file
  const filePath = path.join(process.cwd(), "src/data/nyayaSutras.json");
  const existingData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  
  // Revert / Clean existing Chapter 4 sections to avoid duplicates
  const cleanedData = existingData.filter((sec: any) => !sec.id.startsWith("sec-4-"));
  
  // Merge
  const mergedData = [...cleanedData, ...outputSections];
  
  fs.writeFileSync(filePath, JSON.stringify(mergedData, null, 2), "utf-8");
  console.log("Chapter 4 appended successfully!");
}

run();
