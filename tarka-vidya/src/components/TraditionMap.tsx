import React, { useState } from "react";
import { GitFork, BookOpen, Compass, ArrowRight, CornerDownRight, HelpCircle, Activity, Award, User, Volume2, Pause, ShieldAlert, ChevronLeft, ChevronRight } from "lucide-react";
import { formatSanskrit, transliterate } from "../utils/transliteration";
import SEVEN_PADARTHAS from "../data/sevenPadarthas.json";
import COMPARATIVE_PRAMANAS from "../data/comparativePramanas.json";
import FIVE_HETVABHASAS from "../data/fiveHetvabhasas.json";

const PARIBHASA_DEFINITIONS = {
  tarka: {
    term: "Tarka (तर्क)",
    sanskrit: "तर्क्यान्तरसम्मतव्याप्त्युपपादकत्वम्",
    definition: "Hypothetical, supportive or conditional reasoning that guides and guards the valid instruments of knowledge (pramāṇa)."
  },
  ūha: {
    term: "Ūha (ऊह)",
    sanskrit: "ऊहो नामाविर्भाव्यप्रमाणानुकूलवितर्कः",
    definition: "Deliberate cognitive deliberation or conjectural reasoning acting as a precursor to valid inferential certainty."
  },
  pramāṇas: {
    term: "Pramāṇas (प्रमाणानि)",
    sanskrit: "प्रमाकरणं प्रमाणम्",
    definition: "The primary valid sources or instruments of knowledge, recognized as fourfold: perception, inference, comparison, and verbal testimony."
  },
  vyabhicāra: {
    term: "Vyabhicāra (व्यभिचारः)",
    sanskrit: "साध्याभाववद्द्वृत्तित्वं व्यभिचारः",
    definition: "Irregular concomitance; the fallacy where the reasoning sign (hetu) exists where the target property (sādhya) is absent."
  },
  ātmāśraya: {
    term: "Ātmāśraya (आत्माश्रयः)",
    sanskrit: "स्वोत्पत्तौ स्वज्ञाने वा स्वापेक्षा",
    definition: "The fallacy of self-dependence. Occurs when something is postulated to depend entirely on itself to come into existence or be understood."
  },
  anyonyāśraya: {
    term: "Anyonyāśraya (अन्योन्याश्रयः)",
    sanskrit: "परस्परापेक्षा अन्योन्याश्रयत्वम्",
    definition: "The fallacy of mutual dependence; a reciprocal circle where concept A depends on concept B, and concept B likewise depends on A."
  },
  cakraka: {
    term: "Cakraka (चक्रकम्)",
    sanskrit: "चक्राकारोत्पत्तिपरम्परा",
    definition: "The fallacy of causal circularity. A chain of dependency (A depends on B, B on C, and C on A) rendering the proof invalid."
  },
  anavasthā: {
    term: "Anavasthā (अनवस्था)",
    sanskrit: "अव्यवस्थितपरम्पराप्रवाहः",
    definition: "The fallacy of infinite regress; an endless chain of required conditions or causes that prevents reaching a definitive validation."
  },
  "pramāṇa-bādhitārthaka-prasaṅga": {
    term: "Pramāṇa-bādhitārthaka-prasaṅga (प्रमाणबाधितार्थप्रसङ्गः)",
    sanskrit: "प्रत्यक्षादिप्रमाणबाधितनिष्कर्षः",
    definition: "A reductio ad absurdum argument where the assumed hypothesis leads to conclusions directly contradicted by valid experience or physical truths."
  },
  vyāpti: {
    term: "Vyāpti (व्याप्तिः)",
    sanskrit: "साहचर्यियमो व्याप्तिः",
    definition: "Invariable concomitance; the absolute, unconditional space-time association between the sign (smoke) and the signified (fire)."
  },
  ahetuka: {
    term: "Ahetuka (अहेतुकम्)",
    sanskrit: "कारणाभावकल्पना दोषः",
    definition: "The defect of being without a cause; the illogical claim that an effect can arise spontaneously without any antecedent condition."
  },
  upādhi: {
    term: "Upādhi (उपाधिः)",
    sanskrit: "साध्यव्यापकत्वे सति साधनाव्यापकः",
    definition: "A limiting condition or a hidden variable that is co-extensive with the conclusion (sādhya) but not with the reason (hetu)."
  },
  "bhūyo-darśana": {
    term: "Bhūyo-darśana (भूयोदर्शनम्)",
    sanskrit: "बहुकृत्वः साहचर्यदर्शनम्",
    definition: "Repeated, wide-ranging observation of co-existence in positive and negative loci, reinforcing the induction of vyāpti."
  }
};

interface TermHighlightProps {
  termKey: keyof typeof PARIBHASA_DEFINITIONS;
  children: React.ReactNode;
}

const TermHighlight: React.FC<TermHighlightProps> = ({ termKey, children }) => {
  const def = PARIBHASA_DEFINITIONS[termKey];
  if (!def) return <>{children}</>;

  return (
    <span className="relative group inline cursor-help border-b border-dotted border-[#8C6239] hover:border-solid hover:bg-[#FAF8F5] px-0.5 text-[#8C6239] transition-all font-semibold">
      {children}
      {/* 3D Dynamic Hover Tooltip Card */}
      <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:flex flex-col w-64 bg-[#FAF8F5] border-2 border-[#1A1A1A] p-2.5 text-stone-900 shadow-[4px_4px_0px_#1A1A1A] z-50 text-left font-sans normal-case pointer-events-none transition-all rounded-none animate-fade-in">
        <span className="text-[10px] font-black uppercase tracking-wider text-[#C25E3E] border-b border-stone-200 pb-0.5 flex justify-between items-center">
          <span>{def.term}</span>
          <span className="text-[8px] font-mono lowercase text-stone-500">paribhāṣā</span>
        </span>
        <span className="text-xs font-bold text-stone-700 italic mt-1 block">
          {def.sanskrit}
        </span>
        <span className="text-[10px] leading-relaxed text-stone-600 mt-1 block font-normal">
          {def.definition}
        </span>
        <span className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-[#1A1A1A]"></span>
      </span>
    </span>
  );
};

interface TraditionMapProps {
  onSelectTextById: (id: string) => void;
  scriptTheme: "devanagari" | "gregorian" | "combined";
  targetScript: string;
}

export default function TraditionMap({
  onSelectTextById,
  scriptTheme,
  targetScript,
}: TraditionMapProps) {
  const [selectedNode, setSelectedNode] = useState<string>("nyaya");
  const [isPlayingIntroduction, setIsPlayingIntroduction] = useState(false);
  const [playbackText, setPlaybackText] = useState("");
  const [overviewTab, setOverviewTab] = useState<"padarthas" | "pramanas" | "fallacies" | "history">("padarthas");
  const gangesaTab: string = "pramanya";

  const nodeOrder = ["darshana", "astika", "nyaya", "navya", "vaisheshika", "nastika", "buddhism", "jaina"];

  const handleNextNode = () => {
    const currentIndex = nodeOrder.indexOf(selectedNode);
    const nextIndex = (currentIndex + 1) % nodeOrder.length;
    setSelectedNode(nodeOrder[nextIndex]);
  };

  const handlePrevNode = () => {
    const currentIndex = nodeOrder.indexOf(selectedNode);
    const prevIndex = (currentIndex - 1 + nodeOrder.length) % nodeOrder.length;
    setSelectedNode(nodeOrder[prevIndex]);
  };

  const handleSpeakText = (text: string) => {
    if ("speechSynthesis" in window) {
      if (isPlayingIntroduction) {
        window.speechSynthesis.cancel();
        setIsPlayingIntroduction(false);
        return;
      }
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "hi-IN"; // Best approximation for Sanskrit Devanagari in standard browsers
      utterance.rate = 0.85; // Slightly slower for scholastic pronunciation
      utterance.onend = () => {
        setIsPlayingIntroduction(false);
      };
      
      window.speechSynthesis.speak(utterance);
      setIsPlayingIntroduction(true);
    } else {
      alert("Speech Synthesis not supported in this browser environment.");
    }
  };

  const nodes = {
    darshana: {
      title: "भारतीय दर्शन",
      iastTitle: "Bhāratīya Darśana",
      englishTitle: "Indian Philosophical Systems",
      description: "The vast ocean of Indian critical inquiry, centering on epistemology (Pramāṇa-śāstra), metaphysics (Prameya), and logic (Tarka). Divided fundamentally by attitude towards Vedic epistemic authority."
    },
    astika: {
      title: "आस्तिक दर्शन",
      iastTitle: "Āstika Darśana",
      englishTitle: "Orthodox / Vedic Schools",
      description: "Schools that accept the Vedas as a valid source of verbal testimony (Śabda). They develop integrated sciences of logic, cosmology, hermeneutics, and meditation."
    },
    nastika: {
      title: "नास्तिक दर्शन",
      iastTitle: "Nāstika Darśana",
      englishTitle: "Heterodox / Non-Vedic Schools",
      description: "Schools that reject Vedic authority. They construct powerful independent systems of reasoning, logic, and existential inquiry (like Buddhism and Jainism)."
    },
    nyaya: {
      title: "प्राचीन न्याय",
      iastTitle: "Prācīna Nyāya",
      englishTitle: "Classical School of Logic",
      founder: "Akṣapāda Gautama (2nd c. BCE)",
      acceptedPramanas: "Pratyakṣa (Perception), Anumāna (Inference), Upamāna (Comparison), Śabda (Verbal Testimony)",
      description: "Classical Nyāya, based on Sage Gautama's Nyāya-sūtra. Focuses on the sixteen topics of reasoning, the five-membered logical syllogism, and debate rules, presenting a robust realist philosophy.",
      keyTreatises: [
        { id: "nyaya-sutras", title: "Nyāya Sūtram (न्यायसूत्रम्)" },
        { id: "tarkabhasha", title: "Tarkabhāṣā (तर्कभाषा)" },
        { id: "tarka-samgraha", title: "Tarkasaṃgrahaḥ (तर्कसङ्ग्रहः)" }
      ]
    },
    navya: {
      title: "नव्य न्याय",
      iastTitle: "Navya-Nyāya",
      englishTitle: "New / Modern School of Logic",
      founder: "Gaṅgeśa Upādhyāya (14th c. CE)",
      acceptedPramanas: "Pratyakṣa (Perception), Anumāna (Inference), Upamāna (Comparison), Śabda (Verbal Testimony)",
      description: "Founded by Gaṅgeśa, this school replaced the older descriptive metaphysics with a rigorous, jargon-rich metalanguage designed to express precise relational statements, completely free of semantic noise or linguistic ambiguity.",
      keyTreatises: [
        { id: "tattva-cintamani", title: "Tattvacintāmaṇiḥ (तत्त्वचिन्तामणिः)" }
      ]
    },
    vaisheshika: {
      title: "वैशेषिक दर्शन",
      iastTitle: "Vaiśeṣika Darśana",
      englishTitle: "School of Atomism & Ontology",
      founder: "Sage Kaṇāda (6th–2nd c. BCE)",
      acceptedPramanas: "Pratyakṣa (Perception), Anumāna (Inference)",
      description: "A pluralistic realism establishing that everything in the physical universe is nameable, knowable, and categorizable into a set of ultimate ontological realities (Padārthas), composed of eternal, indivisible spherical atoms (Paramāṇu).",
      keyTreatises: [
        { id: "vaiseasika-sutras", title: "Vaiśeṣika Sūtram (वैशेषिकसूत्रम्)" },
        { id: "padartha-dharmasamgraha", title: "Padārthadharmasaṃgrahaḥ (पदार्थधर्मसङ्ग्रहः)" },
        { id: "manamanoharah", title: "Mānamanoharaḥ (मानमनोहरः)" },
        { id: "tarka-samgraha", title: "Tarkasaṃgrahaḥ (तर्कसङ्ग्रहः)" }
      ]
    },
    buddhism: {
      title: "बौद्ध न्याय",
      iastTitle: "Bauddha Nyāya",
      englishTitle: "Buddhist Logic & Epistemology",
      founder: "Acārya Dignāga (5th c. CE), Dharmakīrti (7th c. CE)",
      acceptedPramanas: "Pratyakṣa (Perception), Anumāna (Inference)",
      description: "Formulates a dynamic, nominalist logic. Rejects permanent souls and substances, establishing that reality is composed of flux or momentary elements (svalakṣaṇa). Words are merely conceptual exclusions (apoha).",
      keyTreatises: [
        { id: "pramanasamuccaya", title: "Pramāṇasamuccayaḥ (प्रमाणसमुच्चयः)" },
        { id: "pramanavarttika", title: "Pramāṇavārttikam (प्रमाणवार्त्तिकम्)" }
      ]
    },
    jaina: {
      title: "जैन न्याय",
      iastTitle: "Jaina Nyāya",
      englishTitle: "Jaina Logic & Epistemology",
      founder: "Siddhasena Divākara (5th c. CE), Haribhadra (8th c. CE)",
      acceptedPramanas: "Pratyakṣa (Direct / Intuitive), Parokṣa (Indirect / Inferential-Verbal)",
      description: "Develops a beautiful multi-valued logic based on the multi-faceted nature of reality (Anekāntavāda). Teaches Nayavāda (the analysis of distinct perspectives) and Syādvāda (seven-fold conditional predication).",
      keyTreatises: [
        { id: "nyayavatara", title: "Nyāyāvatāraḥ (न्यायावतारः)" },
        { id: "pramānamimāmsā", title: "Pramāṇamīmāṃsā (प्रमाणमीमांसा)" }
      ]
    }
  };

  return (
    <div className="space-y-8 animate-fade-in font-sans" id="tradition-map-portal">
      {/* Introduction Banner: The Dialectical Structure of Tarka */}
      <div className="bg-white border-2 border-[#1A1A1A] p-6 lg:p-8 rounded-none shadow-none space-y-6 manuscript-margin-line pl-6 md:pl-10 academic-blueprint-grid classy-transition">
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-[#1A1A1A] pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-[#795548] uppercase tracking-widest">
                <Compass className="w-5 h-5 text-[#8C6239]" />
                <span>Philosophical Discourse Segment</span>
              </div>
              <h2 className="text-xl md:text-2xl font-serif font-black text-[#3B2314] tracking-tight uppercase">
                The Dialectical Structure of Tarka
              </h2>
              <span className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-widest block">
                Derived from <span className="italic font-serif font-semibold">A History of Indian Philosophy (Vol IV)</span>, Surendranath Dasgupta
              </span>
            </div>
            
            {/* Audio Chanting Demo Player */}
            <div className="shrink-0">
              <button
                onClick={() =>
                  handleSpeakText(
                    "तर्कः खलु न प्रमाणसङ्गृहीतो न प्रमाणान्तरं प्रमाणानुकूलस्तत्त्वज्ञानाय कल्पते।"
                  )
                }
                className="flex items-center gap-2 text-xs text-white px-4 py-2 font-bold uppercase tracking-widest border-2 border-[#1A1A1A] bg-[#795548] hover:bg-[#1A1A1A] rounded-none transition-all cursor-pointer cool-3d-gently"
              >
                {isPlayingIntroduction ? (
                  <>
                    <Pause className="w-3.5 h-3.5 text-white animate-pulse" />
                    <span>Stop Dialogue Voice</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-white" />
                    <span>Listen classical voice</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Study Tip Callout Box */}
          <div className="bg-[#FAF8F5] border-l-4 border-[#C25E3E] p-3.5 flex items-start gap-2.5 cool-3d-gently">
            <span className="text-lg">💡</span>
            <div>
              <strong className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider block">Study Tip</strong>
              <p className="text-xs text-stone-605 mt-0.5">
                Hover over the highlighted Sanskrit terms in the text (e.g., <TermHighlight termKey="tarka">tarka</TermHighlight>, <TermHighlight termKey="vyāpti">vyāpti</TermHighlight>) to view their canonical <strong className="text-[#C25E3E]">Paribhāṣā (परिभाषा)</strong> technical definitions and explanations instantly!
              </p>
            </div>
          </div>

          {/* Prose Content */}
          <div className="text-sm text-stone-800 leading-relaxed space-y-4 max-h-[480px] overflow-y-auto pr-2 custom-scrollbar font-sans text-justify">
            <p>
              The determining oscillation constituent in a mental process leading to inference is called{" "}
              <TermHighlight termKey="tarka">tarka</TermHighlight> or <TermHighlight termKey="ūha">ūha</TermHighlight>
              <sup className="text-[10px] text-[#C25E3E] font-bold font-mono">[1]</sup>. Gautama, in his Nyāya-sūtra, describes it as being ratiocination with a view to knowledge of truth, involving attempt at determination of any fact as possessing a particular character, based on a proper enquiry regarding the cause of such a determination. Thus there is a desire to know the truth about the nature of selves as knowers. Are they produced or are they uncreated? If they were created, they would suffer destruction, like all created things, and would not suffer or enjoy the fruits of their own deeds. If they are uncreated, they may very well continue to exist for ever to suffer or enjoy the fruits of their deeds and undergo rebirth. So the self which undergoes rebirth and enjoys or suffers the fruits of all its deeds must necessarily be uncreated
              <sup className="text-[10px] text-[#C25E3E] font-bold font-mono">[2]</sup>. Vātsyāyana says that <TermHighlight termKey="tarka">tarka</TermHighlight> is neither included within the accepted <TermHighlight termKey="pramāṇas">pramāṇas</TermHighlight> nor is it a separate <TermHighlight termKey="pramāṇas">pramāṇa</TermHighlight>, but is a process which helps the <TermHighlight termKey="pramāṇas">pramāṇas</TermHighlight> to the determination of true knowledge
              <sup className="text-[10px] text-[#C25E3E] font-bold font-mono">[3]</sup>. Keśava Miśra, in his Tarka-bhāṣya, is inclined to include it under doubt
              <sup className="text-[10px] text-[#C25E3E] font-bold font-mono">[4]</sup>. But Annam bhaṭṭa, in his Tarka-dīpikā, says that, though <TermHighlight termKey="tarka">tarka</TermHighlight> should properly be counted under false knowledge (viparyaya), yet, since it helps the <TermHighlight termKey="pramāṇas">pramāṇas</TermHighlight>, it should be separately counted
              <sup className="text-[10px] text-[#C25E3E] font-bold font-mono">[5]</sup>. The usefulness of <TermHighlight termKey="tarka">tarka</TermHighlight> in inference consists in assuring the mind of the absence of any cases of failure of existence of the reason in the consequence and thereby helping the formation of the notation of the concomitance of the reason and the consequence
              <sup className="text-[10px] text-[#C25E3E] font-bold font-mono">[6]</sup>.
            </p>

            <blockquote className="border-l-4 border-[#1A1A1A] pl-4 my-3 italic text-stone-600 bg-stone-50 py-2.5 px-3">
              "Viśvanātha says that <TermHighlight termKey="tarka">tarka</TermHighlight> clears away the doubts regarding the possible cases of failure (<TermHighlight termKey="vyabhicāra">vyabhicāra</TermHighlight>) of the reason (e.g., if smoke existed in any instance where there was no fire, then fire would not be the cause of smoke), and thereby renders the knowledge of concomitance infallible..."
            </blockquote>

            <p>
              Viśvanātha further adds that such a <TermHighlight termKey="tarka">tarka</TermHighlight> is of five kinds, namely consideration of the fallacy of self-dependence (<TermHighlight termKey="ātmāśraya">ātmāśraya</TermHighlight>, e.g., if the knowledge of this jug is produced by the knowledge of this jug, then it should be different from it), mutual dependence (<TermHighlight termKey="anyonyāśraya">anyonyāśraya</TermHighlight>, e.g., if this jug is the object of the knowledge as produced by the knowledge, then it should be different from this jug), circle (<TermHighlight termKey="cakraka">cakraka</TermHighlight>, if this jug is produced by something else produced by this jug, then it should be different from anything produced by something else produced by this jug), vicious infinite (<TermHighlight termKey="anavasthā">anavasthā</TermHighlight>, e.g., if the class concept “jug” refers to all jugs, it cannot refer to things produced by the jug), contradictory experience (<TermHighlight termKey="pramāṇa-bādhitārthaka-prasaṅga">pramāṇa-bādhitārthaka-prasaṅga</TermHighlight>, e.g., if smoke exists where there is no fire, then it could not be produced by fire, or if there was no fire in the hill, there would be no smoke in it)
              <sup className="text-[10px] text-[#C25E3E] font-bold font-mono">[8]</sup>.
            </p>

            <p>
              Mathurānātha, in explaining the function of <TermHighlight termKey="tarka">tarka</TermHighlight> in the formation of the notion of concomitance (<TermHighlight termKey="vyāpti">vyāpti</TermHighlight>), says that, even when through noticing the existence of smoke in all known cases of fire and the absence of smoke in all those places where there is no fire, one decides that smoke is produced by fire or not, it is there that <TermHighlight termKey="tarka">tarka</TermHighlight> helps to remove all legitimate doubts. As Gaṅgeśa shows, such a <TermHighlight termKey="tarka">tarka</TermHighlight> would proceed thus: Either smoke is produced by fire or it is not produced there. So, if smoke is produced neither by fire nor by not-fire, it is not produced at all. If, however, there are the doubts whether smoke is from not-fire, or whether it can sometimes be where there is no fire, or whether it is produced without any cause (<TermHighlight termKey="ahetuka">ahetuka</TermHighlight>), then none of us can have the notion of inseparable existence of fire in all cases of smoke so as to lead us to action (sarvatva sva-kriyā-vyāghātaḥ)
              <sup className="text-[10px] text-[#C25E3E] font-bold font-mono">[9]</sup>. A course of thought such as is called <TermHighlight termKey="tarka">tarka</TermHighlight> is helpful to the formation of the notion of concomitance only when a large number of positive and negative cases has been actually perceived and a provisional certainty has been reached. Even when the provisional certainty is reached, so long as the mind is not cleared by the above <TermHighlight termKey="tarka">tarka</TermHighlight> the series of doubts (sarkśaya-dhārā) might continue to rise
              <sup className="text-[10px] text-[#C25E3E] font-bold font-mono">[10]</sup>.
            </p>

            <p>
              It cannot be urged, says Gaṅgeśa, that, even when by the above method the notion of concomitance has been formed, there might still arise doubts whether fire might not be the cause of smoke or whether smoke might be without any cause; for, had it been so, you would not always (niyata) make fire when you wanted smoke, or eat when you wanted to satisfy your hunger, or use words to carry your ideas to others. Such regular attempts themselves show that in such cases there are no doubts (śaṅkā); for, had there been doubts, these attempts would not be so invariable. It is not possible that you would be in doubt whether fire is the cause of smoke and yet always kindle fire when you try to get smoke. The existence of doubt in such cases would contradict your invariable attempt to kindle fire whenever you wanted smoke; doubts can be admitted only so long as one’s actions do not contradict (sva-kriyā-vyāghāta) them
              <sup className="text-[10px] text-[#C25E3E] font-bold font-mono">[11]</sup>.
            </p>

            <p>
              Śrīharṣa, however, arguing from the Vedānta point of view, denies the power of <TermHighlight termKey="tarka">tarka</TermHighlight> to dispel doubt. He urges that, if it is said that <TermHighlight termKey="tarka">tarka</TermHighlight> necessarily dispels doubts in all cases and helps the formation of any particular notion of concomitance, then this statement must itself depend on some other notion of concomitance, and so on, leading us to a vicious infinite (<TermHighlight termKey="anavasthā">anavasthā</TermHighlight>). Moreover, the fact that we know the universal coexistence of fire and smoke, and do not perceive any other element universally abiding in the fire which is equally universally coexistent with fire, does not prove that there is no such element in it which is really the cause of smoke (though apparently fire may appear as its cause).
            </p>

            <p>
              Udayana had said that, if even when no doubt is present you suppose that doubt might arise in the future, that can only be due to inference, so inference is valid. No doubts need be entertained regarding the concomitance underlying <TermHighlight termKey="tarka">tarka</TermHighlight>, as that would lead to the contradiction of our own actions; for we cannot say that we believe fire to be the cause of smoke and still doubt it. Śrīharṣa had replied to this by saying that, where there is experience of failure of coexistence, that itself makes the supposition of concomitance doubtful; when there is no experience of failure of coexistence, there is no end of indefinite doubts lurking about; for these unknown doubts are only put an end to when a specific failure of coexistence is noticed; so under no circumstances can doubts be dispelled by <TermHighlight termKey="tarka">tarka</TermHighlight>
              <sup className="text-[10px] text-[#C25E3E] font-bold font-mono">[13]</sup>.
            </p>

            <p>
              Vyāsa-tīrtha, however, in his Tarka-tāṇḍava, urges that <TermHighlight termKey="tarka">tarka</TermHighlight> is not an indispensable condition of the notion of concomitance; by faith in trusty persons, or from inherited tendencies, as a result of experiences in past life, or through acquiescence in universally accepted views, we may have a notion of concomitance without going through the process of <TermHighlight termKey="tarka">tarka</TermHighlight>. He seems, however, to be largely in agreement with the view of <TermHighlight termKey="tarka">tarka</TermHighlight> as held by Gaṅgeśa, holding that <TermHighlight termKey="tarka">tarka</TermHighlight> does not lead directly to the establishment of concomitance. For he says that <TermHighlight termKey="tarka">tarka</TermHighlight> does not directly lead us to the establishment of concomitance, since concomitance is directly grasped by a wide experience (<TermHighlight termKey="bhūyo-darśana">bhūyo-darśana</TermHighlight>) of coexistence, qualified by a knowledge of absence of failure of coexistence
              <sup className="text-[10px] text-[#C25E3E] font-bold font-mono">[15]</sup>. Vyāsa-tīrtha says that the determination of absence of vitiating conditions (<TermHighlight termKey="upādhi">upādhi</TermHighlight>), which is a function of <TermHighlight termKey="tarka">tarka</TermHighlight>, becomes necessary only in some kinds of inference; it is not always awaited. If failures of coexistence are not known, then from cases of coexistence the self may immediately form the notion of concomitance
              <sup className="text-[10px] text-[#C25E3E] font-bold font-mono">[18]</sup>.
            </p>

            <p>
              What is necessary therefore is to dispel the doubts as to failure of coexistence (vyabhicāra-śaṅkā-nivṛtti-dvāra). But such doubts come only occasionally (kvacitkaiva) and not always; and such occasional doubts require to be dispelled by only an occasional recourse to <TermHighlight termKey="tarka">tarka</TermHighlight>. If doubts raise of themselves, one may have doubts even as to the perception of one’s hands and feet, or one might even have doubts in regard to one’s doubts, which would render even the doubts invalid. So it must be admitted that in many cases we have a natural belief in certain orders of coexistence, where no doubts arise of themselves (sva-rasika-viśvāsasyāvaśyakatvān na sarvata śaṅkā)
              <sup className="text-[10px] text-[#C25E3E] font-bold font-mono">[19]</sup>.
            </p>

            <p>
              Jaya-tīrtha also says in his Pramāṇa-paddhati that <TermHighlight termKey="tarka">tarka</TermHighlight> means the necessary assumption of something else (consequence), when a particular character or entity (reason) is perceived or taken for granted (kasyacid dharmasyāṅgīkare’rthāntarasyāpādanaṃ tarkaḥ)
              <sup className="text-[10px] text-[#C25E3E] font-bold font-mono">[25]</sup>. Granted that there is no fire in the hill, it must necessarily be admitted that there is no smoke in it; this is <TermHighlight termKey="tarka">tarka</TermHighlight> and this is also inference
              <sup className="text-[10px] text-[#C25E3E] font-bold font-mono">[26]</sup>. <TermHighlight termKey="tarka">Tarka</TermHighlight> is thus the process by which the assumption of one hypothesis naturally forces the conclusion as true. This is therefore a <TermHighlight termKey="pramāṇas">pramāṇa</TermHighlight> (or valid source of knowledge).
            </p>

            {/* Citations block inside the flow element */}
            <div className="border-t border-stone-200 pt-4 mt-6 space-y-2">
              <h4 className="text-xs font-black uppercase text-stone-500 tracking-widest flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Scholarly Citations & Footnotes</span>
              </h4>
              <ol className="list-none text-[11px] text-stone-505 space-y-1.5 pl-0 max-h-[160px] overflow-y-auto">
                <li><span className="font-bold text-[#C25E3E] mr-1">[1]</span> ūhatvaṃ ca mānasatva-vyāpyo jāti-viśeṣaḥ 'tarkayāmi' ity anubhava-siddhaḥ. Viśvanātha-vṛtti, I, p. 40. Tarka as ūha stands between right knowledge and doubt.</li>
                <li><span className="font-bold text-[#C25E3E] mr-1">[2]</span> Nyāya-sūtra, I. 1. 40 and Vātsyāyana’s Vṛtti on it. (Dilemma of the soul: uncreated vs created).</li>
                <li><span className="font-bold text-[#C25E3E] mr-1">[3]</span> tarko na pramāṇa-saṃgṛhīto na pramāṇāntaram; pramāṇānām anugrāhakas tattva-jñānāya parikalpyate. Vātsyāyana-bhāṣya, I. 1. 1.</li>
                <li><span className="font-bold text-[#C25E3E] mr-1">[4]</span> Tarka-bhāṣya of Keśava Miśra, p. 44.</li>
                <li><span className="font-bold text-[#C25E3E] mr-1">[5]</span> vyabhicāra-jñānābhāva-saṃpādakatvena tarkasya vyāpti-grahe upayogaḥ. Bhavānandi on Dīdhiti, quoted in Nyāya-kośa, p. 292.</li>
                <li><span className="font-bold text-[#C25E3E] mr-1">[6]</span> Annam bhaṭṭa, Tarka-dīpikā, p. 88 (establishing invariable coexistence).</li>
                <li><span className="font-bold text-[#C25E3E] mr-1">[8]</span> Viśvanātha-vṛtti, I. 1. 40. Lists 5 kinds of Tarka (fallacies of reasoning): ātmāśraya, anyonyāśraya, cakraka, anavasthā, pramāṇa-bādhitārthaka-prasaṅga.</li>
                <li><span className="font-bold text-[#C25E3E] mr-1">[9]</span> Gaṅgeśa on tarka and Mathurānātha’s commentary thereon. Tattva-cintāmaṇi, Part II, pp. 219-28.</li>
                <li><span className="font-bold text-[#C25E3E] mr-1">[10]</span> sarkśaya-dhārā (the continuous stream of doubts) which might continue until dissipated.</li>
                <li><span className="font-bold text-[#C25E3E] mr-1">[11]</span> sva-kriyā-vyāghāto na bhavatīti; regular actions (like eating or kindling fire) reveal the absence of doubt.</li>
                <li><span className="font-bold text-[#C25E3E] mr-1">[13]</span> Udayana vs Śrīharṣa. Kusumāñjali, III. 7 (Doubt limit is active action contradiction).</li>
                <li><span className="font-bold text-[#C25E3E] mr-1">[15]</span> Tarka-tāṇḍava, MS., p. 20 (Direct grasp via bhūyo-darśana).</li>
                <li><span className="font-bold text-[#C25E3E] mr-1">[18]</span> Tarka-tāṇḍava, MS., p. 21 (Intuitive witness - sākṣin).</li>
                <li><span className="font-bold text-[#C25E3E] mr-1">[19]</span> na cāvirala-lagna-śaṅkā-dhārā anubhūyate (no one lives in perpetual infinite doubt, natural belief).</li>
                <li><span className="font-bold text-[#C25E3E] mr-1">[25]</span> Jaya-tīrtha, Pramāṇa-paddhati, p. 36a (kasyacid dharmasyāṅgīkare’rthāntarasyāpādanaṃ tarkaḥ).</li>
                <li><span className="font-bold text-[#C25E3E] mr-1">[26]</span> Tarka as negative or conditional inference: 'Had it been with fire, it would be without smoke.'</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Tradition Map / Flow Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Interactive SVG / CSS Flow Chart Layout */}
        <div className="lg:col-span-8 bg-white border-2 border-[#1A1A1A] p-6 rounded-none shadow-none space-y-6">
          <div>
            <h3 className="text-sm font-black text-[#1A1A1A] uppercase tracking-widest block font-sans">
              Interactive Traditions Flow Chart & Schools Map
            </h3>
            <p className="text-xs text-stone-500 font-sans mt-0.5">
              Click any orange block on the map to display scholastic overviews and primary texts.
            </p>
          </div>

          {/* Visual Grid Schematic representing Indian Philosophy */}
          <div className="space-y-6 p-4 bg-[#F5F2EA] border-2 border-[#1A1A1A]">
            
            {/* Level 1: Root */}
            <div className="flex justify-center">
              <button
                onClick={() => setSelectedNode("darshana")}
                className={`px-5 py-3 border-2 border-[#1A1A1A] transition-all rounded-none text-center min-w-[200px] cursor-pointer ${
                  selectedNode === "darshana" ? "bg-[#1A1A1A] text-white" : "bg-white text-[#1A1A1A] hover:bg-stone-50"
                }`}
              >
                <div className="text-xs font-bold uppercase tracking-wider">{nodes.darshana.title}</div>
                <div className="text-[10px] font-mono opacity-80 mt-0.5">{nodes.darshana.iastTitle}</div>
              </button>
            </div>

            {/* Connecting lines: Two vertical border lines indicating two sections */}
            <div className="flex justify-between w-full max-w-sm mx-auto px-16">
              <div className="w-0.5 h-6 bg-[#1A1A1A]"></div>
              <div className="w-0.5 h-6 bg-[#1A1A1A]"></div>
            </div>

            {/* Level 2: Astika vs Nastika Branches */}
            <div className="grid grid-cols-2 gap-4">
              
              {/* Astika Side */}
              <div className="space-y-4">
                <div className="flex justify-center">
                  <button
                    onClick={() => setSelectedNode("astika")}
                    className={`p-3 border-2 border-[#1A1A1A] w-full max-w-[220px] transition-all rounded-none cursor-pointer ${
                      selectedNode === "astika" ? "bg-[#1A1A1A] text-white" : "bg-white text-[#1A1A1A] hover:bg-stone-50"
                    }`}
                  >
                    <div className="text-[11px] font-bold uppercase tracking-wider">{nodes.astika.title}</div>
                    <div className="text-[9px] font-mono opacity-70">{nodes.astika.iastTitle}</div>
                    <div className="text-[8px] text-stone-500 mt-1 uppercase font-bold">Orthodox / Vedic</div>
                  </button>
                </div>

                {/* Connections down: Three vertical lines indicating subdivisions */}
                <div className="flex justify-between w-full max-w-[220px] mx-auto px-4">
                  <div className="w-0.5 h-5 bg-[#1A1A1A]"></div>
                  <div className="w-0.5 h-5 bg-[#1A1A1A]"></div>
                  <div className="w-0.5 h-5 bg-[#1A1A1A]"></div>
                </div>

                {/* Sub schools level */}
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    onClick={() => setSelectedNode("nyaya")}
                    className={`p-2 border-2 border-[#1A1A1A] transition-all rounded-none text-center cursor-pointer ${
                      selectedNode === "nyaya" ? "bg-[#795548] text-white border-[#1A1A1A]" : "bg-white text-[#1A1A1A] hover:bg-stone-55"
                    }`}
                  >
                    <div className="text-[9px] font-black uppercase">Classical (प्राचीन)</div>
                    <div className="text-[8px] opacity-75 font-mono">Nyāya school</div>
                  </button>
                  <button
                    onClick={() => setSelectedNode("navya")}
                    className={`p-2 border-2 border-[#1A1A1A] transition-all rounded-none text-center cursor-pointer ${
                      selectedNode === "navya" ? "bg-[#795548] text-white border-[#1A1A1A]" : "bg-white text-[#1A1A1A] hover:bg-stone-55"
                    }`}
                  >
                    <div className="text-[9px] font-black uppercase">Modern (नव्य न्याय)</div>
                    <div className="text-[8px] opacity-75 font-mono">Neo-logic</div>
                  </button>
                  <button
                    onClick={() => setSelectedNode("vaisheshika")}
                    className={`p-2 border-2 border-[#1A1A1A] transition-all rounded-none text-center cursor-pointer ${
                      selectedNode === "vaisheshika" ? "bg-[#795548] text-white border-[#1A1A1A]" : "bg-white text-[#1A1A1A] hover:bg-stone-55"
                    }`}
                  >
                    <div className="text-[9px] font-black uppercase">Vaiśeṣika (वैशेषिक)</div>
                    <div className="text-[8px] opacity-75 font-mono">Ontology</div>
                  </button>
                </div>
              </div>

              {/* Nastika Side */}
              <div className="space-y-4">
                <div className="flex justify-center">
                  <button
                    onClick={() => setSelectedNode("nastika")}
                    className={`p-3 border-2 border-[#1A1A1A] w-full max-w-[220px] transition-all rounded-none cursor-pointer ${
                      selectedNode === "nastika" ? "bg-[#1A1A1A] text-white" : "bg-white text-[#1A1A1A] hover:bg-stone-50"
                    }`}
                  >
                    <div className="text-[11px] font-bold uppercase tracking-wider">{nodes.nastika.title}</div>
                    <div className="text-[9px] font-mono opacity-70">{nodes.nastika.iastTitle}</div>
                    <div className="text-[8px] text-stone-500 mt-1 uppercase font-bold">Heterodox / Non-Vedic</div>
                  </button>
                </div>

                {/* Connector down to Buddhist & Jaina Logic */}
                <div className="flex flex-col items-center">
                  <div className="w-0.5 h-4 bg-[#1A1A1A]"></div>
                  <div className="grid grid-cols-2 gap-2 w-full">
                    <button
                      onClick={() => setSelectedNode("buddhism")}
                      className={`p-2 border-2 border-[#1A1A1A] transition-all rounded-none text-center cursor-pointer ${
                        selectedNode === "buddhism" ? "bg-[#795548] text-white border-[#1A1A1A]" : "bg-white text-[#1A1A1A] hover:bg-stone-55"
                      }`}
                    >
                      <div className="text-[9.5px] font-black uppercase">Bauddha (बौद्ध)</div>
                      <div className="text-[8px] opacity-75 font-mono">Buddhist Nyāya</div>
                    </button>
                    <button
                      onClick={() => setSelectedNode("jaina")}
                      className={`p-2 border-2 border-[#1A1A1A] transition-all rounded-none text-center cursor-pointer ${
                        selectedNode === "jaina" ? "bg-[#795548] text-white border-[#1A1A1A]" : "bg-white text-[#1A1A1A] hover:bg-stone-55"
                      }`}
                    >
                      <div className="text-[9.5px] font-black uppercase">Jaina (जैन न्याय)</div>
                      <div className="text-[8px] opacity-75 font-mono">Jaina Logic</div>
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Historical progression of Nyāya */}
          <div className="pt-4 border-t border-stone-200">
            <h4 className="text-[10px] font-black text-[#1A1A1A] uppercase tracking-widest mb-3">
              Progression Timeline of Logicians
            </h4>
            <div className="relative border-l-2 border-[#1A1A1A] pl-5 space-y-4 text-xs font-sans">
              <div className="relative">
                <span className="absolute -left-[26px] top-0.5 w-3.5 h-3.5 bg-[#795548] border-2 border-[#1A1A1A]"></span>
                <strong className="text-[#1A1A1A]">Sage Gautama (2nd Century BCE)</strong>
                <p className="text-stone-605 mt-0.5">Formulates the 16 Padārthas (topics) in the fundamental Nyāyasūtra.</p>
              </div>
              <div className="relative">
                <span className="absolute -left-[26px] top-0.5 w-3.5 h-3.5 bg-[#795548] border-2 border-[#1A1A1A]"></span>
                <strong className="text-[#1A1A1A]">Vātsyāyana & Praśastapāda (4th–6th Century CE)</strong>
                <p className="text-stone-605 mt-0.5">Draft canonical commentaries establishing atomic theory, logical classification and core definitions.</p>
              </div>
              <div className="relative">
                <span className="absolute -left-[26px] top-0.5 w-3.5 h-3.5 bg-[#795548] border-2 border-[#1A1A1A]"></span>
                <strong className="text-[#1A1A1A]">Gaṅgeśa Upādhyāya (14th Century CE)</strong>
                <p className="text-stone-605 mt-0.5">Launches the Navya-Nyāya (New Logic) movement with Tattvacintāmaṇi, using rigorous formal notation.</p>
              </div>
              <div className="relative">
                <span className="absolute -left-[26px] top-0.5 w-3.5 h-3.5 bg-[#795548] border-2 border-[#1A1A1A]"></span>
                <strong className="text-[#1A1A1A]">Annambhaṭṭa (17th Century CE)</strong>
                <p className="text-stone-605 mt-0.5">Synthesizes Nyāya epistemology and Vaiśeṣika ontology in the standard primer Tarkasaṅgraha.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Node Scholastic Overview Box on the right */}
        <div className="lg:col-span-4 space-y-6">
          {(selectedNode === "nyaya" || selectedNode === "navya" || selectedNode === "vaisheshika" || selectedNode === "buddhism" || selectedNode === "jaina") ? (
            <div className="bg-white border-2 border-[#1A1A1A] p-5 rounded-none shadow-none space-y-4">
              <div className="border-b border-stone-200 pb-3 flex items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-black text-[#795548] tracking-widest uppercase block font-sans">
                    {(nodes as any)[selectedNode].englishTitle}
                  </span>
                  <h3 className="text-lg font-serif font-black text-[#1A1A1A] mt-1">
                    {transliterate((nodes as any)[selectedNode].title, targetScript)}
                  </h3>
                  <p className="text-[10px] font-mono italic text-stone-500 mt-0.5 font-bold">
                    ({(nodes as any)[selectedNode].iastTitle})
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0 bg-[#F5F2EA] p-1 border-2 border-[#1A1A1A]">
                  <button 
                    onClick={handlePrevNode}
                    className="p-1 hover:bg-[#795548] hover:text-white transition-colors cursor-pointer text-[#1A1A1A]"
                    title="Previous School"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={handleNextNode}
                    className="p-1 hover:bg-[#795548] hover:text-white transition-colors cursor-pointer text-[#1A1A1A]"
                    title="Next School"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3.5 text-xs font-sans">
                {/* Founder */}
                {(nodes as any)[selectedNode].founder && (
                  <div>
                    <span className="text-[9px] font-black text-stone-500 uppercase tracking-wider block">Foundational Acārya</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <User className="w-3.5 h-3.5 text-[#795548]" />
                      <strong className="text-[#1A1A1A]">{(nodes as any)[selectedNode].founder}</strong>
                    </div>
                  </div>
                )}

                {/* Accepted Pramanas */}
                {(nodes as any)[selectedNode].acceptedPramanas && (
                  <div>
                    <span className="text-[9px] font-black text-stone-500 uppercase tracking-wider block">Accepted Pramāṇas (प्रमाण-विचारः)</span>
                    <p className="text-stone-800 leading-normal mt-0.5 font-bold">
                      {(nodes as any)[selectedNode].acceptedPramanas}
                    </p>
                  </div>
                )}

                {/* Description */}
                <div>
                  <span className="text-[9px] font-black text-stone-500 uppercase tracking-wider block">Theoretical core</span>
                  <p className="text-stone-700 leading-relaxed mt-1">
                    {(nodes as any)[selectedNode].description}
                  </p>
                </div>

                {/* Key treatises list */}
                {(nodes as any)[selectedNode].keyTreatises && (
                  <div className="border-t border-stone-150 pt-3.5">
                    <span className="text-[9px] font-black text-stone-500 uppercase tracking-wider block mb-2">Key Treatises in our library</span>
                    <div className="space-y-2">
                      {(nodes as any)[selectedNode].keyTreatises.map((textItem: any) => (
                        <button
                          key={textItem.id}
                          onClick={() => onSelectTextById(textItem.id)}
                          className="w-full text-left bg-[#F5F2EA] hover:bg-[#795548] hover:text-white border-2 border-[#1A1A1A] p-2.5 rounded-none font-bold transition-all flex items-center justify-between group cursor-pointer"
                        >
                          <span className="flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5 shrink-0" />
                            <span>{textItem.title}</span>
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 translate-x-0 group-hover:translate-x-1 transition-transform" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white border-2 border-[#1A1A1A] p-5 rounded-none shadow-none space-y-4">
              <div className="border-b border-stone-200 pb-3 flex items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-black text-[#795548] tracking-widest uppercase block font-sans">
                    Philosophical Division
                  </span>
                  <h3 className="text-lg font-serif font-bold text-[#1A1A1A]">
                    {transliterate((nodes as any)[selectedNode].title, targetScript)}
                  </h3>
                  <p className="text-[10px] font-mono italic text-stone-500 mt-0.5 font-bold">
                    ({(nodes as any)[selectedNode].iastTitle})
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0 bg-[#F5F2EA] p-1 border-2 border-[#1A1A1A]">
                  <button 
                    onClick={handlePrevNode}
                    className="p-1 hover:bg-[#795548] hover:text-white transition-colors cursor-pointer text-[#1A1A1A]"
                    title="Previous division"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={handleNextNode}
                    className="p-1 hover:bg-[#795548] hover:text-white transition-colors cursor-pointer text-[#1A1A1A]"
                    title="Next division"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-xs text-stone-705 leading-relaxed font-sans">
                {(nodes as any)[selectedNode].description}
              </p>
              
              <div className="bg-[#F5F2EA] p-3.5 border-2 border-[#1A1A1A] text-xs font-sans space-y-1">
                <span className="font-extrabold uppercase tracking-wider text-[#1A1A1A] block">Pedagogical note</span>
                <p className="text-stone-605">
                  The distinctions between these schools historically gave rise to rigorous debates (Sabhā) that refined the sciences of logic and grammar, ensuring extreme logical precision in argument writing.
                </p>
              </div>
            </div>
          )}

          {/* Quick links card */}
          <div className="bg-[#F5F2EA] border-2 border-[#1A1A1A] p-4 rounded-none space-y-3 font-sans">
            <h4 className="text-xs font-black text-[#1A1A1A] uppercase tracking-widest flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#795548]" />
              Comparative quick guides
            </h4>
            <p className="text-[11px] text-stone-650 leading-relaxed">
              Explore the core categories of reality (the 7 Padārthas) and compare valid means of knowledge (Pramāṇas) supported across orthodox and heterodox schools.
            </p>
          </div>
        </div>

      </div>

      {/* Dynamic Scholastic Tables: Realities, Proofs, and Fallacies */}
      <div className="bg-white border-2 border-[#1A1A1A] rounded-none p-6 shadow-none mt-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-[#1A1A1A] pb-3 gap-4">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-[#795548]" />
            <h3 className="text-lg font-serif font-black text-[#1A1A1A]">
              Darśana Śāstra Pramāṇa & Prameya Grid
            </h3>
          </div>
          
          {/* Tabs switch */}
          <div className="flex flex-wrap bg-white p-1 rounded-none border-2 border-[#1A1A1A] self-start sm:self-center">
            <button
              onClick={() => setOverviewTab("padarthas")}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-none transition-all cursor-pointer ${
                overviewTab === "padarthas"
                  ? "bg-[#1A1A1A] text-white"
                  : "text-[#1A1A1A] hover:bg-[#F5F2EA]"
              }`}
            >
              7 Padārthas (Ontology)
            </button>
            <button
              onClick={() => setOverviewTab("pramanas")}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-none transition-all cursor-pointer ${
                overviewTab === "pramanas"
                  ? "bg-[#1A1A1A] text-white"
                  : "text-[#1A1A1A] hover:bg-[#F5F2EA]"
              }`}
            >
              Comparative Pramāṇas
            </button>
            <button
              onClick={() => setOverviewTab("fallacies")}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-none transition-all cursor-pointer ${
                overviewTab === "fallacies"
                  ? "bg-[#1A1A1A] text-white"
                  : "text-[#1A1A1A] hover:bg-[#F5F2EA]"
              }`}
            >
              5 Fallacies (Hetvābhāsa)
            </button>
            <button
              onClick={() => setOverviewTab("history")}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-none transition-all cursor-pointer ${
                overviewTab === "history"
                  ? "bg-[#1A1A1A] text-white"
                  : "text-[#1A1A1A] hover:bg-[#F5F2EA]"
              }`}
            >
              Historiography & Manuscript Economy
            </button>
          </div>
        </div>

        {/* Tab content 1: Padarthas */}
        {overviewTab === "padarthas" && (
          <div className="space-y-4 animate-fade-in font-sans">
            <p className="text-sm text-[#1A1A1A] max-w-4xl font-sans leading-relaxed">
              Vaiśeṣika posits that all knowable things (abhidheya) are real, and classified into seven main ontological categories. Studying this allows a scholar to structure elements of any debate.
            </p>

            {/* Academic Synthesis of 16 Nyāya Categories into 7 Padārthas */}
            <div className="bg-[#FAF6E8] border-2 border-[#1A1A1A] p-5 rounded-none space-y-4 font-sans cool-3d-gently">
              <div className="border-b border-[#1A1A1A]/10 pb-2">
                <span className="text-[10px] font-mono font-black text-[#8C6239] uppercase tracking-widest block">
                  Syncretic Integration Theory (नयसमन्वयविचारः)
                </span>
                <h4 className="text-sm md:text-base font-serif font-black text-[#1A1A1A]">
                  How Gautama’s 16 Categories (ṣoḍaśa-padārtha) Synthesize into the Seven Padārthas
                </h4>
              </div>

              <p className="text-xs text-stone-700 leading-relaxed text-justify">
                In the historic syncretism of the Nyāya and Vaiśeṣika darśanas (culminating in manuals like the <em>Tarkasaṃgraha</em> of Annaṃbhaṭṭa), Gautama’s original <strong>16 dialectical categories</strong> are systematically consolidated into the <strong>Seven Padārthas</strong>. This maintains Nyāya's rigorous logical and debate machinery while adopting Vaiśeṣika's elegant, robust realist ontology.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                <div className="bg-white border border-[#1A1A1A] p-3.5 space-y-2.5">
                  <h5 className="text-[11px] font-black uppercase tracking-wider text-[#8C6239]">
                    1. The Consolidation Matrix
                  </h5>
                  <ul className="text-[11px] text-stone-700 space-y-1.5 list-disc pl-4 leading-normal">
                    <li>
                      <strong className="text-[#1A1A1A]">Pramāṇa (Means of Knowledge)</strong>: Subsumed under the Quality (<span className="italic font-serif">Guṇa</span>) of <strong>Buddhi (Cognition)</strong> as its instrumental cause or active state.
                    </li>
                    <li>
                      <strong className="text-[#1A1A1A]">Prameya (Objects of Knowledge)</strong>: Directly distributed across the classic substances like <span className="italic font-serif">Dravya</span> (e.g., Ātman, Manas, and Earth/Body) and qualities (<span className="italic font-serif">Guṇa</span>) like buddhi, pleasure, pain, desire, aversion, and volition.
                    </li>
                    <li>
                      <strong className="text-[#1A1A1A]">The Remaining 14 Categories</strong> (Doubt, purpose, members of syllogism, quibbles, futile rejoinders, etc.): Classified completely under <strong>Buddhi (Cognition)</strong> as specific mental phenomena, relational cognitions, or linguistic/deliberative acts.
                    </li>
                  </ul>
                </div>

                <div className="bg-white border border-[#1A1A1A] p-3.5 space-y-2.5">
                  <h5 className="text-[11px] font-black uppercase tracking-wider text-[#C25E3E]">
                    2. The Ontological Addition of Viśeṣa
                  </h5>
                  <p className="text-[11px] text-stone-700 leading-relaxed text-justify">
                    The inclusion of <strong className="text-[#1A1A1A]">Viśeṣa (Particularity)</strong> is the signature contribution of the Vaiśeṣika school. It is an independent eternal category that resides strictly in ultimate, indivisible, eternal substances (like individual eternal atoms, individual selves, and minds). 
                  </p>
                  <div className="bg-stone-50 p-2 border border-stone-200 text-[10px] italic text-[#1A1A1A] font-serif">
                    "Without Viśeṣa, there would be no ontological ground to distinguish two identical, adjacent liberated souls or two inherently identical atoms of earth from one another."
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border-2 border-[#1A1A1A] text-left text-xs font-sans">
                <thead>
                  <tr className="bg-[#1A1A1A] text-white uppercase font-extrabold text-[10px]">
                    <th className="py-3.5 px-4 font-serif text-[12px] border border-[#1A1A1A]">Padārtha (Sanskrit)</th>
                    <th className="py-3.5 px-4 border border-[#1A1A1A]">IAST & Category</th>
                    <th className="py-3.5 px-4 border border-[#1A1A1A]">Core Definition</th>
                    <th className="py-3.5 px-4 border border-[#1A1A1A]">Taxonomic details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1A1A1A]">
                  {SEVEN_PADARTHAS.map((p, i) => (
                    <tr key={i} className="hover:bg-[#795548]/5 transition-all">
                      <td className="py-3 px-4 font-[#795548] font-extrabold text-sm border border-[#1A1A1A] font-sans">
                        {transliterate(p.term, targetScript)}
                      </td>
                      <td className="py-3 px-4 font-black text-[#1A1A1A] border border-[#1A1A1A]">{p.transliteration}</td>
                      <td className="py-3 px-4 text-stone-850 border border-[#1A1A1A] leading-relaxed">{p.definition}</td>
                      <td className="py-3 px-4 text-stone-600 border border-[#1A1A1A] leading-relaxed">{p.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab content 2: Pramanas */}
        {overviewTab === "pramanas" && (
          <div className="space-y-4 animate-fade-in font-sans">
            <p className="text-sm text-[#1A1A1A] max-w-4xl font-sans leading-relaxed">
              A key focal point of intellectual debate (vāda) in ancient India was how many valid means of knowledge (Pramāṇas) each philosophical school admitted. Nyāya realists defend four separate pathways to truth.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="border-2 border-[#1A1A1A] rounded-none overflow-hidden bg-white">
                <table className="min-w-full border-collapse text-left text-xs font-sans">
                  <thead>
                    <tr className="bg-[#1A1A1A] text-white uppercase font-extrabold text-[10px] border-b-2 border-[#1A1A1A]">
                      <th className="py-3 px-4 border border-[#1A1A1A]">Philosophical Darśana</th>
                      <th className="py-3 px-4 text-center border border-[#1A1A1A]">Pramāṇa Count</th>
                      <th className="py-3 px-4 border border-[#1A1A1A]">Accepted Instruments</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1A1A1A]">
                    {COMPARATIVE_PRAMANAS.map((pr, idx) => (
                      <tr key={idx} className="hover:bg-[#F5F2EA] transition-colors">
                        <td className="py-3 px-4 font-black text-[#1A1A1A] border border-[#1A1A1A]">{pr.school}</td>
                        <td className="py-3 px-4 text-center font-extrabold text-[#795548] border border-[#1A1A1A]">{pr.count}</td>
                        <td className="py-3 px-4 text-stone-700 border border-[#1A1A1A]">{pr.sources.join(", ")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-[#F5F2EA] p-5 rounded-none border-2 border-[#1A1A1A] space-y-4">
                <h4 className="text-xs font-black text-[#1A1A1A] uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2 h-4 bg-[#795548]"></span>
                  The 4 Nyāya Pramāṇas explained:
                </h4>
                <div className="space-y-3 text-xs font-sans text-stone-700">
                  <p>
                    <strong className="text-[#1A1A1A]">1. Pratyakṣa (Perception):</strong> Direct cognitive contact between an object and the senses, which must be non-verbal, non-erroneous, and definite.
                  </p>
                  <p>
                    <strong className="text-[#1A1A1A]">2. Anumāna (Inference):</strong> Indirect knowledge based on an observed sign (hetu/linga) and an invariant universal relation (vyāpti) connecting it to the target (sādhya).
                  </p>
                  <p>
                    <strong className="text-[#795548] font-bold">3. Upamāna (Comparison):</strong> Gaining knowledge of an unfamiliar object through its structural resemblance to a familiar one (e.g., recognizing a wild forest ox).
                  </p>
                  <p>
                    <strong className="text-[#795548] font-bold">4. Śabda (Verbal Testimony):</strong> Assertions of a reliable persona (āpta) who possesses pristine knowledge and speaks with absolute integrity.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab content 3: Fallacies */}
        {overviewTab === "fallacies" && (
          <div className="space-y-4 animate-fade-in font-sans">
            <p className="text-sm text-[#1A1A1A] max-w-4xl font-sans leading-relaxed">
              In Nyāya syllogistic logic, a reason (hetu) is invalid if it suffers from a structural defect (hetvābhāsa). Identifying these errors immediately collapses the opponent's thesis during active dialectics.
            </p>

            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border-2 border-[#1A1A1A] text-left text-xs font-sans">
                <thead>
                  <tr className="bg-[#1A1A1A] text-white uppercase font-extrabold text-[10px] border-b-2 border-[#1A1A1A]">
                    <th className="py-3.5 px-4 font-serif text-[12px] border border-[#1A1A1A]">Fallacy (Sanskrit)</th>
                    <th className="py-3.5 px-4 border border-[#1A1A1A]">IAST Term</th>
                    <th className="py-3.5 px-4 border border-[#1A1A1A]">Standard Definition</th>
                    <th className="py-3.5 px-4 border border-[#1A1A1A]">Classic textbook example</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1A1A1A]">
                  {FIVE_HETVABHASAS.map((f, i) => (
                    <tr key={i} className="hover:bg-red-50/10 transition-all animate-fade-in">
                      <td className="py-3.5 px-4 text-red-900 font-extrabold text-sm border border-[#1A1A1A] font-sans">
                        {transliterate(f.term, targetScript)}
                      </td>
                      <td className="py-3.5 px-4 font-black text-[#1A1A1A] border border-[#1A1A1A]">{f.transliteration}</td>
                      <td className="py-3.5 px-4 text-stone-800 border border-[#1A1A1A] leading-relaxed">{f.definition}</td>
                      <td className="py-3.5 px-4 text-stone-550 border border-[#1A1A1A] leading-relaxed font-sans">{f.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab content 4: History & Manuscript Economy */}
        {overviewTab === "history" && (
          <div className="space-y-6 animate-fade-in font-sans">
            <p className="text-sm text-[#1A1A1A] max-w-4xl leading-relaxed">
              Explore the critical, transregional history of Sanskrit knowledge systems, academic networks, and the material "manuscript economy" of Navya-Nyāya and Shastric learning during the late precolonial and colonial periods in Bengal and Bihar.
            </p>

            {/* Samuel Wright (2021 & 2024) Highlights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Highlight 1: Scholar & Student Networks */}
              <div className="bg-[#FAF8F5] p-5 border-2 border-[#1A1A1A] space-y-3">
                <h4 className="text-sm font-black text-[#1A1A1A] uppercase tracking-wider flex items-center gap-2 font-serif">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#8C6239]"></span>
                  Scholar & Student Networks (Bengal)
                </h4>
                <p className="text-xs text-stone-700 leading-relaxed font-sans">
                  Historical evidence demonstrates that 18th-century Nyāya scholars were highly connected. For instance, in 1750, <strong>Gaṇeśa Śarman</strong> traveled over 1,600 km from Maharashtra to meet <strong>Śaṅkara Tarkavāgīśa</strong> in Hooghly. 
                </p>
                <p className="text-xs text-stone-700 leading-relaxed font-sans">
                  Student networks were equally active; in 1803, former students from Bikrampur pooled and transferred their leftover monthly stipends to ensure room and board for incoming students.
                </p>
              </div>

              {/* Highlight 2: Scribal Economy & Manuscript Proliferation */}
              <div className="bg-[#FAF8F5] p-5 border-2 border-[#1A1A1A] space-y-3">
                <h4 className="text-sm font-black text-[#1A1A1A] uppercase tracking-wider flex items-center gap-2 font-serif">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#8C6239]"></span>
                  Manuscript & Patronage Economy (Samuel Wright 2021)
                </h4>
                <p className="text-xs text-stone-700 leading-relaxed font-sans">
                  Wright's archival research reveals that Nyāya texts like the <em>Tattvacintāmaṇi</em> circulated within a highly monetized scholarly economy. Land grants (<em>brahmottara</em>) and monthly stipends from local landlords (<em>zamindars</em>) funded both the upkeep of traditional schools (<em>toḷs</em>) and the copying of manuscripts.
                </p>
                <p className="text-xs text-stone-700 leading-relaxed font-sans">
                  The copyists (scribes) were often paid in standard currency (rupees) or grain, which facilitated a rapid, standardized scriptural transmission across Bengal, Bihar, and Maharashtra.
                </p>
              </div>

            </div>

            {/* Advanced Navya-Nyaya Dialectics: Gangeśa's Tattvacintāmaṇi */}
            {false && (
              <div className="bg-[#FAF8F5] border-2 border-[#8C6239]/30 p-5 space-y-4">

              {gangesaTab === "pramanya" && (
                <div className="space-y-4 animate-fade-in">
                  <p className="text-xs text-stone-600 leading-relaxed font-sans">
                    Below is the original Sanskrit dialectic from the <strong>Śabdaprāmāṇyavāda</strong> (the opening chapter of the Śabdakhaṇḍa of the <em>Tattvacintāmaṇi</em>), defending the status of verbal testimony as an independent source of valid knowledge.
                  </p>

                  {/* Sanskrit Text Showcase */}
                  <div className="bg-white border border-[#8C6239]/20 p-4 font-serif text-sm text-[#1F1A17] space-y-4 leading-relaxed max-h-[350px] overflow-y-auto custom-scrollbar">
                    <div className="bg-[#FAF8F5] p-3 border-l-4 border-[#8C6239] italic text-xs text-[#8C6239] font-mono rounded-none">
                      Pūrvapakṣa (Vaiśeṣika Sceptical Objection: Reducibility to Inference)
                    </div>
                    <p className="leading-loose tracking-wide whitespace-pre-line text-stone-850">
                      अथ शब्दो निरूप्यते । प्रयोगहेतुभूतार्थतत्त्वज्ञानजन्य: शब्द: प्रमाणम् । करणञ्च तत् यस्मिन् सति क्रिया भवत्येव ।
                      {"\n\n"}
                      न च शब्दे सति प्रमा भवत्येवेति नायं शब्द: प्रामणम् । न च शब्दो न प्रमाणमिति वाक्यस्य प्रामाण्याप्रमाण्ययोव्र्याघात: , अस्याप्रामाण्येऽपि एतदुत्थाप्यमानाविसंवादादिति चेत् न, आकाङ्क्षादिमतः पदार्थस्मरणादिव्यापारवत: प्रमाणत्वेन तथाभूतात् प्रमोत्पत्तेरावश्यकत्वात् अतथाभूतत्वे च फलाजनकत्वस्य करणान्तरसाम्यात् । तथापि शब्दो न प्रमाणान्तरं पदार्थसंसर्गस्यानुमानादेव सिद्धे: । तथापि गामाभ्याज दण्डेति पदानि वैदिकपदानि वा तात्पय्र्यविषयस्मारितपदार्थसंसर्गज्ञानपूर्वकाणि आकाङ्क्षादिमत्पदकदम्बत्वात् घटमानयेतिवत् । योग्यतासत्तिमत्त्वे सति संसृष्टार्थपरत्वात् तत्परसन्निमत्त्वाद्देति न हेतु:, संसृष्टोहि योऽर्थस्तत्परत्वं तत्परसन्निधिमत्त्वं वा असिद्धं संसंर्गस्य प्रागप्रतीते:। संसृंष्टत्वप्रकारकप्रतीतिपरत्वं तत्प्रकारकप्रतीतिपरसन्निधिमत्त्वं वा अनाप्तोक्ते निराकाङ्क्षे च व्यभिचारि । संसर्गस्य बहुप्रकारकत्वेऽपि नानाभिमतसंसर्गसिद्धिस्तस्य तात्पय्र्याविषयत्वात् । अन्यथा शब्दादप्यभिमतान्वयबोधो न स्यात् । अत एव विशेषण-विशेष्यभाववदर्थकानि तद्बोधपूर्वकाणि वेति न साध्यम् ।
                      {"\n\n"}
                      यत्तु स्मारितार्थसंसर्गवन्तोति साध्यं, मत्वर्थश्र्च लिङ्गतया ज्ञापकत्वं । न चान्योन्याश्रय:, पूर्वपूर्वानुमितिहेतुत्वेन अनादित्वात् । तन्न । ज्ञापकत्वमात्रेणार्थासिद्धे: । प्रमापकत्वे तेनैव व्यभिचारात् । ज्ञानावच्छेदकतया च संसर्गसिद्धि: ज्ञानज्ञानस्य तद्विषयविषयकत्वनियमात् ।
                      {"\n\n"}
                      संसर्गे च सम्बन्धिन एव विशेषकत्वात् । पक्षधर्मताबलात् व्यपकत्वेनागृहीतस्यापि संसर्गविशेषस्य सिद्धि: । अथैवं भ्रान्तिज्ञानमपि भ्रम: स्यात् । न चेष्टापत्ति:., ईश्वरस्यापि भ्रान्तत्वापत्ते: । इदं रजतमिति भ्रमादिव शुक्तौ रजतज्ञानवानयमिति भ्रमस्य ज्ञानात् भ्रान्तिज्ञप्रवृत्त्यापत्तेश्र्च । यत्तु भ्रमविषयकत्वेन न प्रमत्वं भ्रमविषयाणां सिद्ध्य्यसिद्धिपराहतत्वात् इति, तच्च वक्ष्याम: । मैवं, असद्विषयकत्वेन न भ्रमत्वं भ्रमविषयाणां सत्त्वात् किन्तु व्यधिकरणप्रकारकतत्वेन । न च भ्रमस्य ज्ञाने व्यधिकरणं प्रकार:, रजतत्वप्रकारकत्व भ्रमेऽपि सत्त्वात् अन्यथा भआन्त्युच्छेद: प्रमाणाभावात् । ननु प्रकारकवाक्ये व्यभिचार: विशेषदर्शननेन तच्च संसर्गज्ञानाभावात् । न च संसर्गमप्रतीत्य वाक्यरचना न सम्भवतीत्याहाय्र्यं तस्य संसर्गज्ञानं सम्भवतीति वाच्यम् । तावत्पदज्ञानादेव एकस्येव वाक्यरचनोपपत्ते: । अन्यच्चापि तस्यैव तन्त्रत्वादिति चेत् , न, एतद्वाक्यमेतस्य पदार्थसंसर्गं बोधयिष्यतीत्याशयेन वाक्यप्रयोगात् तस्यापि संसर्गज्ञानात् योग्यताविरहाच्च । अत एव विसम्बादिवाक्ये एकवदुच्चरिते न व्यभिचार: । शब्दात् संसर्गप्रत्ययस्तु योग्यताभ्रमात् । अथ संसर्गज्ञानं विना एकस्यान्यस्य वा सम्बादिवाक्ये भ्रान्तप्रकारकवाक्ये च व्यभिचार: कथं वा तच्च संसर्गप्रमा वक्तृज्ञानानुमानासम्भवादिति चेत् न । यदि तच्च संसर्गप्रमा तदा वेदतुल्यतेत्युक्तम् । आकाङ्क्षा - योग्यतासत्तिश्र्च ज्ञातोपयुज्यते, अन्यथा शाब्दभ्रमानुपपत्तेरिति । उच्यते । अर्थज्ञानं प्रवत्र्तकं न तु तज्ज्ञानज्ञानं गौरवात् व्यभिचाराच्च, अतो रजतविषयकमिति चेत् सत्यं, न तु रजतत्वप्रकारकं प्रवत्र्तकञ्च तथा, तदुभयसङ्करापत्तिश्र्च । एतेन लक्षणाद्यनुरोधात्तात्पय्र्यग्रहो वाक्यर्थधीहेतु: तात्पर्यञ्च पदार्थसंसर्गविशेषप्रतीत्युद्धेश्यकत्वं, तथाच तद्ग्राहकानुमानादेव तात्पर्यज्ञानावच्छेदकतया संसर्गसिद्धिरित्यपास्तम् । किञ्च व्यापकतावच्छेदकप्रकारिकानुमितिरत: स्मारिपदार्थसंसर्गज्ञानपूर्वकाणीति तस्मात् प्रवत्र्तकं ज्ञानं शब्दादेव। अत एव प्रवृत्त्यर्थमनुवादकता शब्दस्येत्यपास्तं । शाब्दानुमित्योर्भभिन्नप्रकारकत्वात् एकविषयत्वाभावेन स्तात्पर्यविषयमिथःसंसर्गवन्त: आकाङ्क्षादिमत्पदस्मारितत्वात् योग्यतासत्तिमत्त्वे सति ससंर्गपरपदस्मारितत्वाद्वा, अनाप्तोक्ते योग्यताविरहात् न व्यभिचार:, तच्च बाधकसत्त्वात्, तज्जन्यज्ञानस्य भ्रमत्वात् एकाकारवाक्यस्यापि बाधकसत्त्वासत्त्वाभ्यां योग्यायोग्यत्वात् । अथ प्रतिपत्तुर्जिज्ञासां प्रति योग्यता सा च श्रोतरि तदुत्पाद्यसंसर्गावगमप्रागभावरूकाङ्का बाधकप्रमाविरहा योग्यता अव्यवहितसंसर्गप्रतियोगिज्ञानमासत्ति: ताश्र्च स्वरूपसत्यो हेतवो । न तु ज्ञाता: गौरवात् तद्बोधं विनाऽन्वयानुभवे विलम्बाभावात् संसर्गनिरूप्यत्वेन प्रथमं दुरवधारणत्वाच्चेति न तानि लिङ्गविशेषणानेति चेत्, न, योग्यतादिशून्यत्वेऽपि तदभिमानेन संसर्गप्रत्ययादन्यथा शाब्दभासोच्छेदप्रसङ्ग: । राजा पुत्रमाकाङ्क्षति पुरुषं वेति संशये विपर्यये च वाक्यार्थधीप्रतिबन्धाच्च, योग्यतायाश्र्च संशयसाधारणं ज्ञानमात्रं हेतु:, स्व- परबाधकप्रमाविरह: क्वचित् निश्र्चीयतेऽपि यथेह घटो नस्तीत्यच्च स्वयोग्यानुपलब्धा घटाभावनिश्र्चयेनान्यसस्यापि घटप्रमाविरहो निश्र्चीयते । क्वचिद्बाधकप्रमामात्रविरहसंशयेऽप्यन्वयबोध: बाधसंशयस्यादूषणत्वात् । किञ्च तवापि योग्यतादिकं प्रमाण्ये प्रयोजकं आप्तोक्तत्वस्य तथात्वे गौरवात् अनाप्तोऽक्तेऽपि संवादेन प्रमाण्याच्च । एवञ्च ज्ञायमानकरणे प्रमाण्यप्रयोजनकतया ज्ञानमावश्यकमिति तासां ज्ञानं हेतु:, तच्च समभिव्याहारविशेषादिनेति । मैवं । यत्र विमलं जलं इत्यश्रुत्वैव नद्या: कच्छे महिषश्र्चरतीति श्रृणोति तत्राकाङ्कादिकमस्ति । न च नदौ-कच्छयो: संसर्ग इति, व्यभिचारात् । अत एव तन्मात्रं प्रयोजकं प्रमाण्ये । अथ यावात्समभिव्याह्मतेत्यपि लिङ्गविशेषणं कतिपयपदस्मारिणस्तु संसर्गप्रत्ययोलिङ्गाभिमानादिति चेत् । न । तत्सन्देहेऽपि वाक्यार्थावगमात् । तत्र संसर्गभ्रान्तिरिति चेत् न । अन्यकारणाभावेन पदमेव भ्रान्तिजनकं तथाचादुष्टं सत्तदेवाभ्राÏन्त जनयत् केन वारणी#ायम् । असंसर्गाग्रहस्तचेति चेत् । न । संसर्गे बाधकाभावात् । अथाप्तोक्तत्वं लिङ्गविशेषणं तदेव वा लिङ्गम् । न च नदी- कच्छयो: संसर्गे आप्तोक्तत्वं, आप्तोक्तत्वञ्च प्रमाण्ये तन्त्रमिति तद्धत्तया ज्ञायमानस्य हेतुत्वेन तत्र ज्ञानमावशयकं व्याप्तिमत्तया ज्ञातस्येव लिङ्गस्य, तदवगमश्र्च लोके भ्रमाद्यमूलकतया महाजनपरिग्रहेण वेदे स्मृतौ चेति चेत् । न । यत्र कुत्रचिदाप्तत्वमनाप्तस्यापि सर्वचाप्तमप्रमितं, भ्रान्ते: पुरुषधर्मत्वात् प्रकृतवाक्यार्थयथार्थज्ञानवत्त्वञ्चाप्तत्वं प्रथमं दुग्रॅहं, भ्रमाद्यमूलकत्वस्य प्रवृत्तिसंवादादेश्र्च तद्ग्राहस्याज्ञानात् प्रवृत्तिश्र्च सन्देहादपि । किञ्च पकृतसंसर्गे अयमाभ्रान्तो यथार्थज्ञानवान्वेति संसर्गमप्रतीत्य ज्ञातुमशक्यं वाक्यार्थस्यापूर्वत्वात् । वयन्तु बूम: बाधकप्रमाणआभावो योग्यता सा च न लिङ्गविशेषणं बाधकप्रमाणमात्रविरहस्य सर्वत्र निश्र्चातुमशक्यत्वात् , तत्संशयेऽपि शब्दादन्वयबोधाच्च, शब्दप्रामाण्ये तु योग्यताया: संशय-निश्र्चयसाधारणं ज्ञानमात्रं प्रयोजकमिति शब्द: प्रमाणमिति ।
                      {"\n\n"}
                      जरन्मीमांसकास्तु लोके वक्तृज्ञानानुमानात्तदुपजीवसंसर्गानुमानाद्वा वाक्यर्थसिद्धो#ै शब्दस्यानुवादकत्वं वेदे तु तदभावात् स्वातन्त्र्#ेण प्रामाण्यमिति वदन्ति । तन्न । वेदे क्तृप्तसामग्री#ातो लोकेऽपि संसर्गप्रत्ययादन्यथानुवादकतापि न स्यात् लिङ्गस्य पूर्वत्वेऽपि व्याप्तिस्मृतिविलम्बेन तद्विलम्बात् । अनाप्तोक्तौ व्यभिचारात् वेदतुल्यापि सामग्रौ न निश्र्चायिकेति चेत् । न । चक्षुरादेस्तथात्वेन तच्छङ्कायामपि प्रमापकत्वात् । ज्ञायमानं करणं सन्देहे न निश्र्चायकं लिङ्गवदिति चेत् । न । संशयो हि न वाक्ये तस्य निश्र्चयात्, न तज्जनयज्ञानप्रमाण्ये तस्य तदुत्तरकालीनत्वात् , नाप्तोक्तत्वे तन्निश्र्चयस्यानङ्गत्व् । ननु लोके आप्तोक्तत्वसन्देहे वाक्यार्थधीर्नेति तन्निश्र्चयोहेतु: तथा च वाक्यार्तगोचरयथार्थज्ञानअन्यत्वग्राहकात् । तदुपजीविनोऽनुमानात् वाक्यर्थधीरिति चेत् । न । वेदेतद्रहितस्यापि सामथ्र्यावधारणात् तदनिश्र्चयेऽपि वेदानुकारेण पठमानमन्वादिवाक्येऽपौरुषेयत्वाभिमानि नोगौडमीमांसकस्यार्थनिश्र्चयात् । न चासौ भ्रान्ति:, बाधकाभावात् पौरुषेयत्वनिश्र्चयदशायामपि तस्य तथात्वात् ।
                      {"\n\n"}
                      न चासंसर्गाग्रहमात्रं तत् अर्थस्य तथाभावेऽपि असंसर्गाहत्वे संसर्गोच्छेदापत्ते: । न चाप्तोक्तत्वन्निश्र्चयरूपकारणाबाधात् संसर्गज्ञानबाध:, व्यभिचारेण हेतुतायामेव बाधात् लौकिकत्वेन ज्ञाते तदङ्गमिति चेत् । न । मानाभावात् वाक्यार्थस्यापूर्वत्वेन लिङ्गाभावेन तद्ग्रहासम्भात् । यदि चापौरुषेयत्वनिश्र्चये सत्येव वेदादर्थप्रत्यय: तदा दोषवत्पुरुषाप्रणीतत्वे सत्याकाङ्क्षादिमत्पदस्मारितत्वेन वेदे पदार्थसंसर्गसिद्धिरस्त्विति वेदेऽप्युनुवादक: स्यात् । तदुक्तं, व्यस्तपुंदूषणाशङ्कै: स्मारिततत्वात् पदैरमी । अन्विता इति निर्णीते वेदस्यापि न तत् कुत: । न चैवं शब्दस्य प्रमाणत्वमपि, अनुमानादेव वाक्यर्थप्रमोत्पत्तेरिति ।
                      {"\n\n"}
                      प्राभाकरास्तु व्यभिचारिशब्दव्यावृत्तमव्यभिचार्यनुगतप्रमाप्रयोजकमुपेयं यदभावादनाप्तोक्तवाक्यादप्रमा अन्यथा कार्यवैचित्र्यं न स्यात्, तच्च ज्ञातमुपयुज्यते ज्ञामानकरणे ज्ञनोपयोगिव्यभिचारिवैलक्षण्यत्वात् प्रमाहेतुत्वाद्वा व्याप्तिवच्छब्दशक्तिवच्चेति, अन्यथा शब्दाभासोच्छेदप्रसङ्ग: । न चाप्तोक्तत्वं तथा, संवादात् प्रमाणे शुकोदीरिते भ्रान्तप्रतारकसंवादिवाक्ये वेदे च तदभावादाप्तोक्तत्वानुमाने व्यभिचारिव्यावृत्तलिङ्गाभावाच्च । भावे वा तद्वत एव शब्दस्य प्रत्यायकत्वात् ।
                      {"\n\n"}
                      एतेनाप्रमाहेतुत्वं न भ्रम-पमाद-विप्रलिप्सा - करणापटवानां परस्परं व्यभिचारात् मिलितस्याव्यापकत्वात् । किन्त्वाप्तोक्तत्वाभावस्याप्रमाहेतुत्वं तदभावश्र्चाप्तोक्तत्वं प्रमाहेतुरित्यपास्तं । आप्तोक्तत्वस्य प्रथमं लिङ्गाभावेन ज्ञातुमशक्यत्वात् । अत एव व्यभिचारशङ्काविरहो हेतु: सा च लोके भ्रमादिमूलेत्याप्तोक्तत्वानुमानादुच्छिद्यते, वेदे च पौरुषेयत्वनिश्र्चयेनेति निरस्तं । अभिमतवाक्यार्थस्यापूर्वत्वेन साध्याप्रसिद्धे: वेदे सदोषपुरुषाप्रणीतपदस्मारितत्वेन संसर्गसिद्धेरनुवादकतापत्तेश्र्च । नापि दोषाभाव: भ्रान्तप्रतारकवाक्यजन्यज्ञाने प्रत्यक्षेणागृहीतसंवादे तदभावात् । दोषभावस्य हेतुत्वात् तत्र वाक्यं मूकमेव व्यवहारस्तु प्रत्यक्षादिति चेत् । न । अनुभवापलापापात् तद्धेतुत्वे विवादात् वेदेऽप्यनुवादकतापत्तेश्र्च । किञ्च दोषाभावस्य प्रमाहेतुत्वेऽप्रमायां दोष: कारणं तस्य च प्रत्येकं हेतुत्वे व्यभिचार: मिलितस्य तत्त्वे एकस्मादप्रमा न स्यात् भ्रमादीनां प्रत्येकं दोषत्वेऽननुगम: मिलितस्य तु तत्त्वे एकस्मादप्रमानुदयप्रसङ्ग: । तस्मात् लाघवात् यथार्थतात्पर्यकत्वं शाब्दप्रमाप्रयोजकं तच्च यथार्थवाक्यर्थवाक्यर्थप्रतीतिप्रयोजनकत्वं लोक-वेदसाधारणं तदभावादप्रमा स एव दोष:, न हि जात्यैव कश्र्चिद्दोष:, तद्विघातकत्वाच्च भ्रमादीनां दोषत्वं । अत एव भ्रान्तप्रतारकवांक्यं शुकादिवाक्यञ्च प्रमाणं संवादात् । अत एवान्यघटाभिप्रायेण गेहे घटोऽस्तीत्युक्ते यत्र धटान्तरं दृष्ट्वा तमानयति तत्रान्यपरत्वाच्छब्दो न प्रमाणं व्यवारस्तु प्रत्यक्षादेव यष्टी: प्रवेशयेति च मुख्यार्थबोधे तच्च तात्पर्यं ज्ञातमुपयुज्यते ज्ञायमानकरणे ज्ञानोपयोगिव्यभिचारिवैलक्षण्याद्व्याप्तिवच्छक्तिवच्च, अन्यथा अन्यपरादन्यान्वयबोधोन स्यात् इति शब्दाभासोच्छेदप्रसङ्ग:, तदभ्रमाच्च शाब्दभ्रम: । अत एव यष्टी: प्रवेशयेत्यच लक्षणा नानार्थे विनिगमना च तयोस्तात्पर्यग्रहमूलकत्वात् । यदि च यत्र वास्तवं तात्पर्यं तं शाब्दोबोधयति तदा लक्षणानां मुख्यार्थान्वयानुपपत्त्युपयोगो न स्यात् । अत एव पचतीत्युक्तेऽयोक्तेन स्वयं स्मृतेन वा कलायपदेनोपस्थिते कलायं पचतीत्यन्वयबोधो न भवति तात्पर्यानिश्र्चयात् । न च तात्पर्यग्राहकस्य प्रकरणादे: प्राथम्यादावश्यकत्वाच्च शब्दसहकारिता न तु तात्पर्यग्रहस्येति वाच्यम् । तेषामननुगतत्वेन परस्परव्यभिचारादहेतुत्वात् तात्पर्यग्राहकतात्वननुगतानामपि व्याप्यत्वात् धूमादीनामिव । तच्च तात्पर्य वेदे न्यायगम्यं, यत्र न्यायात् तात्पर्यमवधार्यते स एव वेदार्थ:, लोके च न केवलं न्यायानुसारि तात्पर्यं इति न न्यायगम्यं किन्तु पुमभिप्रायनियन्त्रितं, न्यायाविषयेऽपि पुरुषेच्छाविषये प्रतीतिजनकत्वात् पुंवचसां । वक्ता च परकीयवाक्यार्थज्ञानोत्पादनेच्छाया वाक्यमुच्चारयति । सा चेच्छा यदि वक्त्रुर्यथार्थवाक्यार्थज्ञानपूर्विका भवति तदैव परं तदुच्चारणस्य तदैव परं तदुच्चारणस्य पुमभिप्रेतयथार्थवाक्यार्थज्ञानपरत्वं यथार्थज्ञानेच्छाव्याप्यं निर्वहतीति वक्तुर्यथार्थवाक्यार्थज्ञानवत्तामविज्ञाय यथार्थप्रतीतिपरत्वं ज्ञातुं न शक्यत इति प्रथममाप्तवाक्याद्वक्तृज्ञानानुमानपूर्वकमर्थतथात्वमनुसन्धाय यथार्थप्रतीतिपरत्वं ज्ञातुं न शक्यत इति प्रथममाप्तवाक्याद्वक्तृज्ञानानुमानपूर्वकमर्थतथात्वमनुसन्धाय यथार्थतात्पर्यनिश्र्चय: । अनुमानच्चेदं वाक्यं भ्रमादि-विशिष्टज्ञानयोरन्यतरजन्यं वाक्यत्वादिति । ततो भ्रमादिनिरासे सति परिशेषाद्वाक्यार्थज्ञानानुमानं अयं स्वप्रयुक्तवाक्यार्थर्यथार्थज्ञानवान् भ्रमाद्यजन्यवाक्यप्रयोक्तुत्वात् अहमिव, न त्वाप्तत्वात् साध्यविशेषात् । तत एते पदार्था यथोचितसंसर्गवन्त: यथार्थज्ञानविषयत्वात् आप्तोक्तपदस्मारितत्वाद्वा मंदुक्तपदार्थवदिति । ननु वक्तुज्र्ञानविशेषोऽनुमेय: ज्ञाने चार्थ एव विशेष: न त्वर्थाधीनोऽन्य: अर्थेनैव विशेष: इत्यौपचारिको तृतीया तथाच वाक्यार्थज्ञानविशेषोऽनुमेय: तस्य चाप्रसिद्ध्या न व्याप्तिग्रह: । अत एवास्मिन् वाक्यर्थे अयमभ्रान्त आप्तो वेति ज्ञातुमशक्यमिति शब्द एव तमर्यं बोधयेदिति चेत्, न, तात्पर्यावधारणार्थं त्वयाप्यशाब्दा एव संसर्गविशेषप्रतीतेरवश्याभ्युपेयत्वात् अन्यथा क्व तात्पर्यनिरूपणं । अत एव आप्तोत्कत्वभ्रमाद्यन्यत्वनिरूपणमपि सुकरं । शाब्दन्तु संसर्गज्ञानं प्रथमं न भवति ज्ञानान्तरन्तु भवत्येव। न चैवं शब्दो न प्रमाणं तदर्थस्य प्रागेव सिद्धेरिति वाच्यम् । तवापि तुल्यत्वात् । ननु तथापि कथमर्थविशेषसिद्धि: विशेषेण व्याप्त्यग्रहादिति चेत्। न । यथा यो यत्र प्रवत्र्तते स तज्ज्ञानातीति सामान्यतोव्याप्तिज्ञाने पाकादौ प्रवृत्तिदर्शनात् पाकविषयकार्यताज्ञानानुमानं, यथा चेष्टाविशेषदर्शनात् दशसंख्याभिप्रायमात्रज्ञाने घटे तच्चेष्टादर्शनात् घटे दशत्वज्ञानं तथा सामान्यतोव्याप्त्यावापि विशेषसिद्धि: ।
                      {"\n\n"}
                      यद्वा इदं वाक्यं साकाङ्क्षैवतदर्थविषयकैकज्ञानहेकुकं आप्तोक्तत्वे सति एतदर्थप्रतिपादकत्वात् मद्वाक्यवत्, तत एते पदार्था: परस्परसंसर्गवन्त: साकाङ्कत्वे सत्येकज्ञानविषयत्वात् सत्यरजतज्ञानविषयवत्, एवं वक्तुर्यथार्थवाक्यार्थज्ञानेऽनुमिते प्रकरणादिना वक्त्रभिप्रेतयथार्थवाक्यार्थज्ञानेऽनुमिते प्रकरणादिना वक्त्रभिप्रेतयथार्थप्रतीतिपरत्वज्ञानं ततो वेदतुल्यतया शब्दादर्थप्रत्यय इत्यनुवादक शब्द: वक्तृज्ञानावच्छेदकतया संसर्गज्ञानानुमानात् तदुपजीविसंसर्गानुमानाद्वा वाक्यार्थस्य प्रागेव सिद्धे: । यत्तु संसर्गाग्रहो भ्रम: तदभावश्र्च संसर्गग्रह एवेति भमाभावेऽनुमीयमाने संसर्गज्ञानमेवानुमितं इत्याप्तत्वानुमानान्तर्गतमेव वक्तृज्ञानानुमानं न तु वक्तृज्र्ञानानुमाने तलिङ्गं इति । तन्न, भ्रमोहि ज्ञानद्वयं अगृहीतभेदं तदभावश्र्च गृहीतभेदज्ञानं, न हि ज्ञानाभावे सुषुप्तौ भ्रमव्यवहार:, ततो भ्रमाभावनिश्र्चयानन्तरं वक्तृज्ञानानुमानं, तर्हि यादृशं लिङ्गं तादृशमेव गमकमस्त्विति ।
                    </p>

                    <div className="bg-[#FAF8F5] p-3 border-l-4 border-emerald-800 italic text-xs text-emerald-800 font-mono rounded-none">
                      Siddhānta (Gaṅgeśa’s Establishing of Śabda-Pramā)
                    </div>
                    <p className="leading-loose tracking-wide whitespace-pre-line text-stone-850 font-bold">
                      अत्रोच्यते । यथार्थवाक्यर्थदीपरत्वं न ज्ञातं प्रमात्पादकं गौरवात् वाक्यर्थनिरूप्यत्वेन प्रथमं ज्ञातमशक्यत्वाच्च तस्यापूर्वत्वात् । यच्च लोके भ्रमादि निरासानन्तरं वक्तृज्ञानाच्छेदकतया तदग्रे स्वातन्त्र्ये वा पुमभिप्रेतवाक्यार्थज्ञाने तत्प्रतीतिपरत्वं प्रकरणादिना ज्ञायत इत्युक्तं, तन्न, वाक्यार्थमज्ञात्वा अत्रायभ्रान्त इति ज्ञातुं पुरुषत्वाद्वक्तुभ्र्रम - प्रमादसम्भवेन प्रथमं भ्रमाद्यजन्यत्वस्य ग्रहीतुमशक्यत्वात् प्रवृत्तिसंवादादेज्र्ञानोत्तरकालीनत्वात् भ्रमादिजन्यविलक्षणत्वेन च शब्दस्याज्ञानात् ज्ञाने वा यादृशोलिङ्गत्वं तस्यैव प्रत्यायकत्वं अव्यभिचारात् वेदेऽपि वाक्यार्थमविज्ञाय तद्यथार्थप्रतीतिपरत्वं न्यायेनापि ज्ञातुमशक्यं विषयनिरूप्यत्वात् प्रतीते: लोके तात्पर्यनिरूपणार्थमशाब्दवाक्यार्थप्रतीते: प्रथमं त्वयापि स्वीकारात् । अन्यथा वक्तृज्ञानानुमानं न स्यात् । न च लोकवत्मानान्तरात्तदवगम:, वेदार्थस्य तदविषयत्वात् वेदस्य प्रथमं मूकत्वत्, न च न्यायसिद्धे वेदार्थे मानान्तरातात्पर्यग्रह:, वेदस्यानुवादकतापत्ते: शब्दस्याप्रमाणत्वापत्तेर्वा । अज्ञाते वाक्यर्थे तर्क - संशययोरप्यभावात् अयं पदार्थोऽपरपदार्थसंसृष्टो न वेति संशये तर्के वा एककोटौ संसर्ग उपस्थित इति चेत्, न, अनिश्र्चिते तात्पर्यानिश्र्चयात् तयोरगृहीततासंसर्गविषत्वेनासदर्थविषयकत्वेन वा वाक्यर्थाविषयत्वाच्च । अन्यथा लाकेऽपि ताभ्यामेवोपस्थितिरिति किं वक्तृज्ञानानुमानेन । वस्तुतस्तु यदि यथार्थतात्पर्यकत्वं ज्ञानं शब्दप्रमोत्पादकं तदा लोक-वेदयास्तादृशपदस्मारितत्वेन पदार्थसंसर्गानुमितिसम्भवात् न शब्द: प्रमाणं स्यात् । अपि च पुंवाक्यस्य दोष-विशिष्टज्ञानान्यतरजन्यत्वेऽनुमिते परिशेषाद्दोषाजन्यत्वनिश्र्चयदशायां वेदतुल्या सामाग्री पुंंवाक्येऽपि वृत्तेति तत एवार्थनिश्र्चयात् वेदवत्तस्यापि प्रामाण्यं, अनुमितानुमानस्य व्याप्तिस्मृत्यादिविलम्बितत्वात् । एतेनाबाधितार्थपरत्वं लोके वेदे च प्रमापकं लोके वाक्यर्थो बाधितोऽपि दृष्ट इति श्रोतु: प्रमाणावतारं विना न बाधाभावनिश्र्चय: स च क्वचिच्छृतुरिन्द्रियेण क्वचिद्वक्तुराप्तत्वानुमानेन वेदे तु न्यायात्तन्निश्र्चय: तदर्थस्य प्रमाणान्तराविषयत्वात् न तत्र शङ्केति सामाग्रीभेद इति निरस्तं । प्रथमभ्रमाद्यभावस्याप्तस्य वा निश्र्चेतुमशक्यत्वात् वेदस्यानुवादकतापत्तेश्र्च । तस्मात् भ्रमाद्यजन्यत्वं आप्तोकत्वं अबाधितार्थकत्वं यथार्थतात्पर्यकत्वं निरस्तव्यभिचारशङ्कत्वं अन्यद्वा व्यभिचारिव्यावृत्तं यत्प्रमोत्पादकं तत् स्वरूपसत् न ज्ञातं । अन्यथा तादृशस्य वाक्यार्थाव्यभिचारितया तादृशपदस्मारितत्वात् लिङ्गादेव संसर्गसिद्धि: स्यादिति जितं वैशिषिकै: । अथ व्यवहारानुमितव्यवहत्र्तृकार्यान्वितज्ञाने उपस्थितत्वेन पदानां हेतुत्वग्रहादन्विताभिधायकत्वं तदानीं शब्दस्य लिङ्गत्वेनोनुपस्थितेरिति चेत् । न । लिङ्गाभावेनैव शब्दादन्वितज्ञानोपपत्तेर्नाकाङ्क्षादिमच्छब्देन कारणता गौरवात् । शब्दस्य लिङ्गत्वं सम्भवदपि बालेन न ज्ञातमिति चेत्, सोऽयं बालस्य दोषो न वस्तुन इत्यादि वक्ष्यते । किञ्चैवं लोकवद्वेदेऽपि अनुवादकता स्यात् । एतेन वाक्यार्थतात्पर्यग्राहकानुमानात् तात्पर्यावच्छेदकतया तदुपजीविनोऽनुमानात् स्वातन्त्र्येण वाक्यार्थसिद्धेर्न शब्द: प्रमाणमिति वैशेषिकमतपास्तम् । यथार्थतात्पर्यग्रहस्य वाक्यार्थबोधाहेतुत्वात् । यत्तु ज्ञायमानकरणे इति, तन्न, यथार्थतात्पर्यकत्वादे: प्रथमं ज्ञातुमशक्यत्वेनानुमानस्य बाधितत्वात् व्याप्त्यसिद्धेश्र्च । न हि व्याप्ति: शब्दशक्तिश्र्च कारणं, किन्तु तद्धी:, अतीतेऽनुमितिदर्शनात् । अपभ्रंशादौ शक्तिभ्रमादन्वयबोधाच्च । न च सैवापयुज्यत इति साध्यं, प्रथमं तदसम्भवात् । तस्मात् यत् अर्थाव्यभिचारित्वेन ज्ञातं कारणं तत्र व्यभिचारिवैलक्षण्यज्ञानमुपयुजन्यते अन्यथा शब्दस्यार्थव्यभिचारितया ज्ञातस्य ज्ञापकत्वे लिङ्गतापत्तेर्वज्जलेपायमानत्वात् । स्यादेतदनाप्तोक्ते बाधकेनार्थाभावदर्शनात् आकाङ्क्षादिमद्वाक्यत्वेन सदर्थकं बाधितार्थकं वेति संशयान्न तावन्मात्रादर्थनिश्र्चय:, न हि संशायकमेव निश्र्चायकं, इत्यधिकमपेक्षणीयमिति चेत् । न ।अर्थसंशयस्य तद्बाधसंशयस्य वा प्रमाणाप्रतिबन्धकत्वात् । वह्नि-तद्बाधयो: संशयेऽपि प्रत्यक्षानुमानादिना अर्थनिश्र्चयात् अन्यथा प्रमाणमात्रोच्छेद:, तत्पूर्वमर्थ-तद्बाधसंशयात् । विनाप्यर्थं वाक्यरचना सम्भत्यत एतस्यायमर्थो न वा, एतत्सदर्थकं न वा, एतत्जन्यज्ञानं सद्विषयकं न वेति संशयस्यार्थावगमोत्तरकालीनत्वाच्च । तस्मादाप्तोक्तत्वं भ्रमाद्यजन्यत्वं अबाधितार्थकत्वं यथार्थवाक्यार्थप्रतीतिपरत्वं वा ज्ञातं अनुगतमपि न हेतु: प्रथमं ग्रहीतुमशक्यत्वात्, किन्तु तात्पर्यग्राहकत्वेनाभिमतानां न्यायजन्यज्ञान-प्रकरणादीनामन्यतरत् तात्पर्यव्याप्यत्वेनानुगतं, तथाकाङ्क्षासत्तिनिश्र्चय:, तद्विपर्यये संशये च शाब्दज्ञानाभावात् । योग्यतायाश्र्च ज्ञानमत्रं हेतु: तत्संशये विपर्यये प्रमायाञ्च वाक्यार्थज्ञानात् , तथा विभक्तायादिसमभिव्याहर: सम्भूयोच्चारणञ्च शाब्दज्ञानमात्रे कारणानि नानार्थे श्लिष्टे चानेकोपस्थितावपि प्रकरणादिवशादेकमर्थमादयान्वयबोध: । लक्षणा च न तात्पर्यानुपपत्त्या किन्त्वन्वयानुपपत्त्यैव प्रकरणाद्भोजनप्रजनकत्वेनावगतप्रवेशनस्य यष्ट¬न्वयानुपपत्ते: । अजहत्स्वार्थायां प्रकरणादेव छत्रि तदितरस्य यान्तीत्यनेन गमनकर्तृत्वमवगतं तदन्वयानुपपत्तिच्छत्रिमात्रे, पचतीत्यस्य कलायमित्यन्योक्तेन समं नार्थप्रत्याकत्वं समभिव्याहाराभावात्, तवापि तस्य तात्पर्यग्राहकत्वात् सहोच्चरितानां सम्भूयार्थप्रत्यायकत्वस्य व्युत्पत्तिसिद्धत्वात् ।
                      {"\n\n"}
                      अन्ये तु नानार्थे लक्षणायाञ्च नियतोपस्थित्यर्थं पदार्थे तात्पर्यग्रहापेक्षा तेन विना तदभावात् न वाक्यार्थे, तदज्ञानेऽपि प्रकरणाद
                    </p>
                  </div>

                  {/* Scholar Summary of the Dialectic */}
                  <div className="border-t-2 border-dashed border-[#8C6239]/20 pt-4 space-y-3 font-sans">
                    <span className="text-[10px] text-[#8C6239] font-black uppercase tracking-wider block font-mono">
                      Siddhānta Philosophical Insight:
                    </span>
                    <p className="text-xs text-stone-755 leading-relaxed font-sans">
                      In Gaṅgeśa’s <strong>Śabdaprāmāṇyavāda</strong>, verbal testimony (<em>Śabda</em>) is established as an <strong>independent instrument of valid knowledge (<em>pramāṇa</em>)</strong>, refuting the Vaiśeṣika view that verbal comprehension is merely a form of inference (<em>anumāna</em>). Gaṅgeśa argues that the relational connection (<em>anvaya</em>) is cognized directly through words, powered by syntactic and semantic factors, generating a distinct cognitive experience (<em>śābda-bodha</em>) that inference cannot replicate.
                    </p>
                  </div>
                </div>
              )}

              {gangesaTab === "akanksha" && (
                <div className="space-y-4 animate-fade-in">
                  <p className="text-xs text-stone-600 leading-relaxed font-sans">
                    Below is the original Sanskrit dialectic from the first part of the <strong>Śabda-ākāṅkṣāvāda</strong> (Expectancy), investigating whether syntactic expectancy is purely psychological or is grounded in grammatical interdependency.
                  </p>

                  {/* Sanskrit Text Showcase */}
                  <div className="bg-white border border-[#8C6239]/20 p-4 font-serif text-sm text-[#1F1A17] space-y-4 leading-relaxed max-h-[350px] overflow-y-auto custom-scrollbar">
                    <div className="bg-[#FAF8F5] p-3 border-l-4 border-[#8C6239] italic text-xs text-[#8C6239] font-mono rounded-none">
                      Pūrvapakṣa (Analysis of Proposed Definitions)
                    </div>
                    <p className="leading-loose tracking-wide whitespace-pre-line text-stone-850">
                      अथ केयमाकङ्क्षा, न तावदविनाभाव:, नीलं सरोजमित्यादावभावात् । विमलं जलं नद्या: कच्छे महिष इत्यत्र जलान्वितनद्या अविनाभावात् कच्छे साकाङ्क्षतापत्ते: । नापि समभिव्याह्मतपदस्मारितपदार्थजिज्ञासा, अजिज्ञासोरपि वाक्यर्थबोधात् विश्र्वजिता यजेेत द्वारं इत्यत्रापदार्थयोप्यधिकारिणोऽप्याह्मतस्य पिधानस्य चाकाङ्क्षितत्वाच्च, तत्र शब्दकल्पनपक्षेऽपि घट: कर्मत्वमानयनं कृतिरित्यत्र जिज्ञासितस्यानयनादेराकाङ्क्षितत्वापत्ते: । अथ जिज्ञासायोग्यता, सा जिज्ञासा च विशेषाज्ञाने भवति, योग्यता च श्रोतरि तदुच्चारणजन्यसंसर्गावगमप्रागभाव:, विमलं जलं नद्या: कच्छे महिष इत्यत्र तात्पर्यवशात् कदाचित् नद्या: कच्छे संसर्गावगमात् तत्प्रागभावसत्त्वेऽपि श्रोतरि तदुच्चारणेन तात्पर्यवशात् जलान्वितनद्या: कच्छे संसर्गावगमोनेति न तत्प्रगाभाव:, घट: कर्मत्वमानयनमित्यत्रापि तथेति चेत् । न । निराकाङ्क्षे तदुच्चारणजन्यसंसर्गावगमप्रागभावस्य सिद्ध्यसिद्धिपराहतत्वात् । किञ्च यत्रैकोविमलं जलमित्यश्रुत्वैव तात्पर्यभ्रमेणा वा नद्या: कच्छान्वयपरत्वमवैति, अपर: समस्तेन श्रुत्वा नद्या जलान्वयपरत्वमवधारयति, तत्रोभयरपि तदुच्चारणजन्यसंसर्गावगमात् नद्या इत्युभयसाकाङ्क्षं स्यात् ।
                      {"\n\n"}
                      अपि च प्रगाभावाभावस्य कारणान्तराभावव्याप्तत्वात् तत एव कार्याभाव इति किमाकाङ्क्षया । एवञ्च योग्यतासत्ती अपि न हेतू अयोग्ये अनासन्ने च तदुच्चारणजन्यसंसर्गज्ञानाभावेन तत्प्रागभावाभावात् । न चैवं बाधाभावस्यानुमित्यादावपि हेतुत्वं, प्रागभावाभावेनैव कार्याभावात् प्रागभावस्य च कार्यमात्रहेतुत्वात् । शब्दे नासाधारण्यं उत्थितोत्थाप्याकाङ्क्षयोरुत्कर्षापकर्षौ न स्यातां प्रागभावे तदभावात् ।
                      {"\n\n"}
                      अथ ज्ञाप्य-तदितरान्वयप्रकारकजिज्ञासानुकूलपदार्थोपस्थितिजनकत्वे सत्यजनिततात्पर्यविषयान्वयबोधत्वमाकाङ्क्षा, घटमानयतीत्यत्र घटमित्युक्ते किमानयति पश्यति वा, आनयतीत्युक्ते किं घटं अन्यद्वेति जिज्ञासा भवति । घट: कर्मत्वमाननयनं कृतिरित्यत्राभेदेन नान्वयोऽयोग्यत्वात्, घटस्यानयनमिति तु नान्वयबोध: घट इतिपदात् सम्बन्धित्वेन घटस्यानुपस्थिते: । राज्ञ इति पुत्रेण जनितान्वयबोधत्वात् न पुरुषमाकाङ्क्षतीति चेत्, तर्हि नाम-विभक्ति-धात्वाख्यातार्थानां घट-कर्मत्वानयन-कृतीनां स्वरूपेणोपस्थितिर्नान्वयन्वयप्रकारकजिज्ञासानुकूलेति तत्र नाकाङ्क्षा स्यात् । घट: कर्मत्वमानयनं कृतिरित्यत्र घटमानयतीत्यत्रेवान्वयबोध: स्यात्, न हि तत्र पदार्थस्वरूपाणां एतद्वैलक्षण्येनोपस्थिति:, त्रयाणां तुल्यवत् स्मरणे प्रथमं यतो राज्ञ इति पुरुषेण नान्वेति किन्तु पुत्रेण ततएवाग्र्रेऽपि व्यर्थमजनितान्वयबोधत्वमिति ।
                    </p>

                    <div className="bg-[#FAF8F5] p-3 border-l-4 border-emerald-800 italic text-xs text-emerald-800 font-mono rounded-none">
                      Siddhānta (Gaṅgeśa’s True Definition)
                    </div>
                    <p className="leading-loose tracking-wide whitespace-pre-line text-stone-850 font-bold">
                      शब्दाकाङ्क्षावादसिद्धान्त:{"\n"}
                      उच्यते । अभिधानापर्यवसानमाकाङ्क्षा यस्य येन विना न स्वार्थान्वयानुभावकत्वं तस्य तदपर्यवसानं, नाम-विभकि-धत्वाख्यात-क्रिया-कारकपदानां परस्परं विना न परस्परस्य स्वार्थान्वयानुभवजनकत्वं । परमते नीलघटोऽस्ति नीलं घटमानयेत्यादौ नामार्थानां कारकाणाञ्च न परस्परमन्वयबोध: विशेषणान्वितविभक्त्यर्थानन्वयादिति न विशिष्टवैशिष्ट¬ेनान्वय: किन्त्वार्थ: समाज: । अस्माकन्तु नील-घटयोरभेदानुभवbलादभेद एव संसर्ग: विशेषविभक्ति: साधुत्वार्थं ।
                      {"\n\n"}
                      यद्वा समानविभक्तिकयोरभेदानुभवबलात् विशेषणान्वितविभक्तेरभेदार्थकत्वं अतो विशेषण-विशेष्यभावानुभावकत्वं तत्पदयो:, न परस्परं विना । द्वारमित्यत्राध्याहारं विना प्रतियोग्यलाभात् न स्वार्थान्वयानुभावकत्वं, विश्र्वजिता यजेतेत्यत्र ममेदं कार्यमिति प्रवत्र्तकतात्पर्यविषयज्ञानं नाधिकारिणां विनेति तदाकाङ्क्षा ।
                    </p>
                  </div>

                  {/* Scholar Summary of the Dialectic */}
                  <div className="border-t-2 border-dashed border-[#8C6239]/20 pt-4 space-y-3 font-sans">
                    <span className="text-[10px] text-[#8C6239] font-black uppercase tracking-wider block font-mono">
                      Siddhānta Philosophical Insight:
                    </span>
                    <p className="text-xs text-stone-755 leading-relaxed font-sans">
                      In Gaṅgeśa's <strong>Ākāṅkṣāvāda</strong>, expectancy (<em>Ākāṅkṣā</em>) is defined as <strong>Abhidhānāparyavasānam</strong>—the non-completion of the utterance's capacity to generate syntactic relational understanding (<em>anvaya-bodha</em>) without another word.
                    </p>
                    <p className="text-xs text-stone-755 leading-relaxed font-sans">
                      This definition centers on <strong>grammatical interdependency</strong> of words (e.g., nouns with case endings, verbs with agents) rather than purely psychological desires or curiosity of the listener.
                    </p>
                  </div>
                </div>
              )}

              {gangesaTab === "yogyata" && (
                <div className="space-y-4 animate-fade-in">
                  <p className="text-xs text-stone-600 leading-relaxed font-sans">
                    Below is the original Sanskrit dialectic from the <strong>Yogyatāvāda</strong> (Compatibility), defining how semantic compatibility acts as a requirement for verbal understanding.
                  </p>

                  {/* Sanskrit Text Showcase */}
                  <div className="bg-white border border-[#8C6239]/20 p-4 font-serif text-sm text-[#1F1A17] space-y-4 leading-relaxed max-h-[350px] overflow-y-auto custom-scrollbar">
                    <div className="bg-[#FAF8F5] p-3 border-l-4 border-[#8C6239] italic text-xs text-[#8C6239] font-mono rounded-none">
                      Pūrvapakṣa (Analysis of Proposed Definitions)
                    </div>
                    <p className="leading-loose tracking-wide whitespace-pre-line text-stone-850">
                      ननु का योग्यता, न तावत् सजातीयेऽन्वयदर्शनं, यथाकथञ्चित् साजात्यस्याव्यावत्र्तकत्वात् । पदार्थतावच्छेदकेन साजात्यस्याद्यजात: पय: पिबतीत्यदावभावात् वाक्यार्थस्यापूर्वत्वाच्च । नापि समभिव्याह्मतपदार्थसंसर्गव्याप्यधर्मवत्त्वं, वाक्यार्थस्यानुमेयत्वापत्ते: । न च वस्तुगत्या संसर्गव्याप्यो यो धर्मस्तद्वस्तं तच्च न ज्ञातुमुपयुज्यते इति नानुमेय: संसर्ग इति वाच्यम् । तर्हि प्रकृतसंसर्गबाधकस्याभाव: तच्चाप्रसिद्धम् । अत एव तत्र बाधकस्याप्यनिरूपणम् । नापीतरपदार्थसंसर्गाभावप्रमाविषयत्वाभावोऽपदपदार्थे, केवलान्वयिन्यप्रसिद्धे: । एतेन यत्रासम्बन्धग्राहकं प्रमाणं नास्ति तद्योग्यमिति निरस्तम् । नापि बोधनीयसंसर्गाभावप्रमाविरह:, प्रतियोग्यप्रसिद्धे:, बोधनीयसंसर्गस्य प्रागप्रतीते: योग्यता च न स्वरूपसत्युपयुज्यते इत्युक्तम्, अयोग्ये तत् सत्त्वस्यानिरूपणाच्च । अपि च स्वीयबाधकप्रमाविरहस्यायोग्येऽपि सत्त्वात् बाधकप्रमामात्रविरहस्य योग्येऽपि ज्ञातुमशक्यत्वात् परप्रमाया अयोग्यत्वात् । न च स्वरूपसन्नेवायं हेतु:, स्वीयबाधकप्रमाविरहदाशायां योग्यताभ्रमेण शाब्दभ्रमानुपपत्ते:, अन्वयप्रयोजकरूपवत्त्वेन बाधकप्रमामात्रविरहोऽनुमेय इति चेत् । न । सेकानान्विततोये द्रवद्रव्यत्वे सत्यपि बाधकसत्त्वेन व्यभिचारात् उपजीव्यत्वेन तस्यैव योग्यतात्वापत्तेश्र्च । न चैवमेवेति वाच्यम्। आकाङ्क्षासत्त्यन्वयप्रयोजकरूपवत्त्वे सत्यप्यनाप्तवाक्ये बाधकप्रमायामन्वाबोधात्, बाधकप्रमाविरहो हेतुरिति चेत्तह्र्रावश्यकत्वात् सैव योग्यता ।
                    </p>

                    <div className="bg-[#FAF8F5] p-3 border-l-4 border-emerald-800 italic text-xs text-emerald-800 font-mono rounded-none">
                      Siddhānta (Gaṅgeśa’s Confirmed Resolution)
                    </div>
                    <p className="leading-loose tracking-wide whitespace-pre-line text-stone-850 font-bold">
                      योग्यतावादसिद्धान्त:{"\n"}
                      उच्यते बाधकप्रमाविरहो योग्यता, सा चेतरपदार्थसंसर्गेऽपरपदार्थनिष्ठात्यन्ताभावप्रतियोगित्वप्रमाविशेष्यत्वाभाव: । प्रमेयं वाच्यमित्यत्र प्रमेयनिष्ठात्यन्ताभावप्रतियोगित्वप्रमाविशेष्यत्वं गोत्वे प्रसिद्धं वाच्यत्वसंसर्गे तदभाव: ।{"\n\n"}
                      वस्तुतस्त्वितरपदार्थसंसर्गेऽपरपदार्थनिष्ठात्यन्ताभावप्रतियोगितावच्छेदकधर्मशून्यत्वं योग्यता लाघवात् शक्यज्ञानत्वाञ्च ।{"\n\n"}
                      न च नरशिर:शौचानुमानबाधात् तदशौचबोधकशब्दात् अन्वयाबोध इति वाच्यम् । उपजीव्यजातीयत्वेन शब्दस्य बलवत्त्वात् तेनैव तदनुमानबाधात् । नन्वाकाङ्क्षासत्तिमत्त्वेन शब्दस्य प्रमाणता न तु योग्यतापि तन्निवेशिनो बाधाभावस्य प्रमामात्रहेतुत्वादिति चेत् । न । बाधे ही प्रमाणदोषोऽवश्यं वक्तव्य:, अन्यथा प्रमाणविषये बाधासम्भवात् यथानुमाने बाधादुपाधिकल्पनद्वारा व्याप्तिविघात:, निरूपाधौ बाधानवकाशात् ।
                    </p>

                    <div className="bg-[#FAF8F5] p-3 border-l-4 border-amber-800 italic text-xs text-amber-800 font-mono rounded-none">
                      Linguistic Invalidation & Cognition
                    </div>
                    <p className="leading-loose tracking-wide whitespace-pre-line text-stone-850">
                      सेयं न स्वरूपसतो प्रयोजिका शाब्दभासोच्छेदप्रसङ्गात् । तन्निश्र्चयश्र्च न भवत्युपायाभावात् इति चेत् । न । संशय-विपर्य-प्रमासाधारणस्य योग्यताज्ञानमात्रस्य कारणत्वात् । अयोग्यताज्ञानस्य प्रतिबन्धकस्य सर्वत्राभावात् क्वचित्तन्निश्र्चयोऽपि योग्यतानुपलब्धा यथेह घटो नास्तीति ।
                    </p>
                  </div>

                  {/* Scholar Summary of the Dialectic */}
                  <div className="border-t-2 border-dashed border-[#8C6239]/20 pt-4 space-y-3 font-sans">
                    <span className="text-[10px] text-[#8C6239] font-black uppercase tracking-wider block font-mono">
                      Siddhānta Philosophical Insight:
                    </span>
                    <p className="text-xs text-stone-755 leading-relaxed font-sans">
                      In Gaṅgeśa's formulation, <strong>Yogyatā</strong> is defined as the <strong>absence of valid contradictory knowledge (<em>bādhaka-pramā-virahaḥ</em>)</strong>. In Navya-Nyāya’s precise metalanguage, it is defined as: <em>the absence of any attribute that limits the counter-correlatability of absolute non-existence residing in one object in relation to another</em>.
                    </p>
                    <p className="text-xs text-stone-755 leading-relaxed font-sans">
                      Furthermore, Gaṅgeśa argues that <strong>actual compatibility is not required in reality</strong> for understanding a sentence; rather, the mere <strong>cognition of compatibility</strong> (which may be a valid certainty, a doubt, or even a temporary illusion) is what acts as the cause of verbal comprehension.
                    </p>
                  </div>
                </div>
              )}

              {gangesaTab === "akanksha2" && (
                <div className="space-y-4 animate-fade-in">
                  <p className="text-xs text-stone-600 leading-relaxed font-sans">
                    Below is the subsequent logical discussion of expectancy (<strong>Ākāṅkṣā II</strong>), analyzing semantic ellipsis, <em>adhyāhāra</em>, and the major debate between the Mimāṃsā school and Navya-Nyāya.
                  </p>

                  {/* Sanskrit Text Showcase */}
                  <div className="bg-white border border-[#8C6239]/20 p-4 font-serif text-sm text-[#1F1A17] space-y-4 leading-relaxed max-h-[350px] overflow-y-auto custom-scrollbar">
                    <div className="bg-[#FAF8F5] p-3 border-l-4 border-[#8C6239] italic text-xs text-[#8C6239] font-mono rounded-none">
                      Discussion of Ellipsis (Aadhyāhāra) & Word Competence
                    </div>
                    <p className="leading-loose tracking-wide whitespace-pre-line text-stone-850">
                      यद्वा कत्र्तुरिवाधिकारिणोऽपि आक्षेपादेव लाभ इति तदन्वयो न शाब्द: किन्त्वानुमानिक:, गौणलाक्षणिकयोरननुभावकत्वपक्षे तदुपस्थापितस्याध्याह्मतस्येवेतरपदं विना नानुभावकत्वं । घट: कर्मत्वं आनयनं कृतिरित्यादौ अभेदेन नान्वयबोधोऽयोग्यत्वात् तत्तत्पदेभ्यस्तात्पर्यविषयतत्तत्पदार्थस्वरूपज्ञानञ्च पदान्तरं विनैव । घटमानयतीत्यत्रेव भ्रमेण तथान्वयतात्पर्येऽपि क्रिया -कारकभावेन नान्वय: नाम-विभकि-धात्वाख्यात-क्रिया-कारकपदानां अन्वयबोधे तान्येव पदानि समर्थानि न तु तदर्थकानि पदान्तराणि । अग्नि: करणत्वं ओदन: कर्मता पाक: कृति: इष्टसाधनता इत्यादिपदेभ्य: अग्निर्नोदनं पचेतेत्यत्रेव अन्वयाबोधात्, अग्निकरणकौदनकर्मकपाकविषयककृतिरिष्टसाधनं इति तु वाक्यं न पदं, अत एव द्वारमित्यत्र पिधेहिपदाध्याहार:, क्रियापदार्थस्यान्यत उपस्थितौ अपि कारकानन्वयात् असामथ्र्यञ्च स्वभावात् । अनासन्नमपि आसन्नतादशायां आसन्नत्वभ्रमेण वा अन्वयबोधसमर्थमेव । वह्निना सिञ्चतीत्यत्र क्रिया-कारकपदयोरन्वयबोधे सामथ्र्येऽपि अयोग्यताज्ञानं प्रतिबन्धकं दाहे समर्थस्याप्यग्नेर्मणिरिव । अत एव योग्यताभ्रमात् प्रतिबन्धकाभावे ततोऽप्यन्वयबोध: । नहि स्वभावतोऽसमर्थं आरोपितसामथ्र्यं वा दहतु पचतु वेति, प्रकृते तु पदार्थस्वरूपज्ञानं न त्वन्वयभ्रमोऽपि । पुरूषपदं विनापि राज्ञा इत्यस्य पुत्रेण समं स्वार्थअन्वयानुभावकत्वं इति न तदाकाङ्क्षा ।
                    </p>

                    <div className="bg-[#FAF8F5] p-3 border-l-4 border-emerald-800 italic text-xs text-emerald-800 font-mono rounded-none">
                      Mimāṃsā vs Nyāya: Anvitābhidhāna vs Abhihitānvaya Debate
                    </div>
                    <p className="leading-loose tracking-wide whitespace-pre-line text-stone-850 font-bold">
                      अन्विताभिधानवादनिरासः अभिहितान्वयवादव्यवस्थापनञ्चः{"\n"}
                      ननु अन्वितानामेव पदानां स्वार्थबोधकत्वम्, अन्विते शक्तिग्रहात् । बालः प्रथमं 'गामानय' इति वृद्धवाक्यं शृणोति, मध्यमवृद्धस्य व्यवहारं पश्यति, गवानयनं दृष्ट्वा 'गामानय' इति पदकदम्बकस्य विशिष्टे संसर्गे शक्तिं गृह्णाति, तत्र आवापोद्वापाभ्यां 'गो' पदस्य सास्नादिमति 'आनय' पदस्य चानयने शक्तिं निश्चिनोति, तत्रान्वितस्यैवोपस्थित्या अन्विते शक्तिरिति प्राभाकराः । 
                      {"\n\n"}
                      तन्न । अनन्तशक्तिकल्पनापत्तेः, उपस्थितत्वाच्च संसर्गस्यापि । अस्माकन्तु पदेन स्वार्थे अभिहिते पश्चात् आकाङ्क्षा-योग्यता-आसत्तिवशेन पदार्थानां मिथः संसर्गबोधो जायते इति अभिहितान्वयवाद एव ज्यायान् । 'पदं स्वं स्वं पदार्थमभिधाय निवृत्तव्यापारं भवति, पश्चात् पदार्था एव वाक्यार्थं बोधयन्ति' इति न्यायानुसारिणः ।
                    </p>
                  </div>

                  {/* Scholar Summary of the Dialectic */}
                  <div className="border-t-2 border-dashed border-[#8C6239]/20 pt-4 space-y-3 font-sans">
                    <span className="text-[10px] text-[#8C6239] font-black uppercase tracking-wider block font-mono">
                      Siddhānta Philosophical Insight:
                    </span>
                    <p className="text-xs text-stone-755 leading-relaxed font-sans">
                      This section addresses the foundational Navya-Nyāya debate between <strong>Abhihitānvayavāda</strong> (the connection of expressed referents) and <strong>Anvitābhidhānavāda</strong> (the expression of connected referents). Gaṅgeśa defends the Nyāya stance of <em>Abhihitānvaya</em>, arguing that words first express their individual lexical meanings (<em>abhidhā</em>), which are subsequently connected into a unified sentence-meaning (<em>vākyārtha</em>) through the synthetic power of expectancy, compatibility, and proximity.
                    </p>
                  </div>
                </div>
              )}

              {gangesaTab === "asatti" && (
                <div className="space-y-4 animate-fade-in">
                  <p className="text-xs text-stone-600 leading-relaxed font-sans">
                    Below is the original Sanskrit dialectic from the <strong>Āsattivāda</strong> (Proximity), exploring how temporal and phonetic contiguity is essential for verbal comprehension.
                  </p>

                  {/* Sanskrit Text Showcase */}
                  <div className="bg-white border border-[#8C6239]/20 p-4 font-serif text-sm text-[#1F1A17] space-y-4 leading-relaxed max-h-[350px] overflow-y-auto custom-scrollbar">
                    <div className="bg-[#FAF8F5] p-3 border-l-4 border-[#8C6239] italic text-xs text-[#8C6239] font-mono rounded-none">
                      Introduction to Āsatti (Contiguity)
                    </div>
                    <p className="leading-loose tracking-wide whitespace-pre-line text-stone-850">
                      अथ आसत्तिवादः निरूप्यते । 
                      {"\n\n"}
                      किमिदम् आसत्तिः? अव्यवधानेन पदजन्य-पदार्थोपस्थितिः आसत्तिः । सा च शाब्दबोधे कारणम् । यत्र 'गवि' इति उच्चार्य प्रहरान्तरे 'अस्ति' इति पद्यते, तत्र न शाब्दबोधः, व्यवधानात् । अव्यवधानेन पदजन्यपदार्थस्मरणमेव संसर्गानुकूलं द्वारम् ।
                    </p>

                    <div className="bg-[#FAF8F5] p-3 border-l-4 border-emerald-800 italic text-xs text-emerald-800 font-mono rounded-none">
                      Siddhānta (On Proximity as a Cause)
                    </div>
                    <p className="leading-loose tracking-wide whitespace-pre-line text-stone-850 font-bold">
                      आसत्तिवादसिद्धान्त:{"\n"}
                      ननु आसत्तिः स्वरूपसती हेतुः ज्ञायमाना वा? उच्यते—स्वरूपसत्येव हेतुः, यत्र भ्रमेणासत्तिमनुसन्धाय शाब्दबोधो भवति तत्र आसत्तिभ्रमादेव बोधात् । नव्यास्तु—पदविशेषजन्य-पदार्थोपस्थितिरेव आसत्तिः, सा चाव्यवहिता ग्राह्या । समभिव्याहृतपदानां अव्यवधानेन उच्चारणं वा, तेन जनितोपस्थितेरव्यवधानं वा आसत्तिरिति सिद्धान्तः ।
                    </p>
                  </div>

                  {/* Scholar Summary of the Dialectic */}
                  <div className="border-t-2 border-dashed border-[#8C6239]/20 pt-4 space-y-3 font-sans">
                    <span className="text-[10px] text-[#8C6239] font-black uppercase tracking-wider block font-mono">
                      Siddhānta Philosophical Insight:
                    </span>
                    <p className="text-xs text-stone-755 leading-relaxed font-sans">
                      In Gaṅgeśa’s <strong>Āsattivāda</strong>, contiguity (<em>Āsatti</em>) is defined as the <strong>uninterrupted cognitive presentation of the word-meanings (<em>pada-janya-padārtha-upasthitiḥ</em>)</strong>. It requires that the constituent words and their meanings be recalled in close temporal proximity. Even if words possess expectancy and compatibility, a long temporal delay or intervening irrelevant cognitions will disrupt the synthesis necessary for <em>anvaya-bodha</em>.
                    </p>
                  </div>
                </div>
              )}
            </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
