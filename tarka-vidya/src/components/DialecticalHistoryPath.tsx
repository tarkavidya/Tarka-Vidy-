/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { transliterate } from "../utils/transliteration";
import { ChatMessage } from "../types";
import {
  GitBranch,
  ArrowDown,
  ArrowRight,
  ChevronRight,
  Sparkles,
  BookOpen,
  Info,
  Layers,
  Download,
  Award,
  BookOpenCheck,
  Scale,
  RefreshCw,
  HelpCircle,
  TrendingUp,
  FileText
} from "lucide-react";

interface PathNode {
  id: string;
  type: "purvapaksa" | "siddhanta";
  speaker: string;
  school: string;
  sanskrit: string;
  transliterationText: string;
  translation: string;
  logicalRole: string; // e.g. "Thesis (Pratijñā)", "Objection (Śaṅkā)", "Refutation (Khaṇḍana)", "Final Proof (Siddhānta)"
  pramanaUsed?: string; // e.g. "Pratyakṣa (Perception)", "Anumāna (Inference)", "Upamāna (Comparison)", "Śabda (Testimony)"
  defectChecked?: string; // e.g. "Hetvābhāsa (Logical Fallacy)", "Upādhi (Conditionality)"
  commentary: string;
}

interface HistoricalDebate {
  id: string;
  title: string;
  description: string;
  speakers: { purvapaksa: string; siddhanta: string };
  schools: { purvapaksa: string; siddhanta: string };
  nodes: PathNode[];
}

const HISTORICAL_DEBATES: HistoricalDebate[] = [
  {
    id: "atman",
    title: "Existence of the Eternal Self (Ātman-Vāda)",
    description: "A high-stakes epistemological dispute in Mithilā regarding the reality of an unchanging, immortal soul versus the Buddhist theory of momentary stream of consciousness.",
    speakers: { purvapaksa: "Ācārya Dignāga", siddhanta: "Uddyotakara / Gautama" },
    schools: { purvapaksa: "Yogācāra Buddhism (Svalakṣaṇa)", siddhanta: "Prācīna Nyāya" },
    nodes: [
      {
        id: "atman-1",
        type: "siddhanta",
        speaker: "Uddyotakara",
        school: "Nyāya",
        sanskrit: "अस्ति नित्य आत्मा, ज्ञानस्मरणयोराश्रयत्वात् घटवत्।",
        transliterationText: "asti nitya ātmā, jñānasmaraṇayorāśrayatvāt ghaṭavat.",
        translation: "An eternal, unchanging Self (Ātman) exists, because it serves as the necessary, unified locus of memory, recognition, and diverse cognitions.",
        logicalRole: "Siddhānta • Initial Thesis (Pratijñā)",
        pramanaUsed: "Anumāna (Inference) & Śabda (Vedic Testimony)",
        commentary: "Nyāya establishes that cognitive acts like 'I saw yesterday what I touch today' cannot float without a permanent substance. Memory is impossible without a singular, persisting agent."
      },
      {
        id: "atman-2",
        type: "purvapaksa",
        speaker: "Ācārya Dignāga",
        school: "Buddhism",
        sanskrit: "न, क्षणिकविज्ञानसन्तानस्यैव पूर्वोत्तरक्षणकारणत्वात् स्मृतिसिद्धिः। स्थिर आत्मा निरुपमः।",
        transliterationText: "na, kṣaṇikavijñānasantānasyāva pūrvottarakṣaṇakāraṇatvāt smṛtisiddhiḥ. sthira ātmā nirupamaḥ.",
        translation: "No. Memory is successfully established purely through the stream of momentary conscious impressions (vijñāna-santāna), where each preceding cognitive moment causally imprints the succeeding one. An eternal, unchanging soul is redundant.",
        logicalRole: "Pūrvapakṣa • Objection (Śaṅkā / Pratipakṣa)",
        defectChecked: "Gaurava Doṣa (Methodological Over-complexity / Occam's Razor violation)",
        commentary: "Buddhism asserts the doctrine of Momentariness (Kṣaṇikavāda). All things are momentary flashes. Since causal transmission (vāsana-saṅkrānti) happens from moment to moment, no stable, permanent soul is required."
      },
      {
        id: "atman-3",
        type: "siddhanta",
        speaker: "Uddyotakara",
        school: "Nyāya",
        sanskrit: "न, अन्यदृष्टस्यान्येन स्मरणासम्भवात्। प्रतिसन्धानं कर्तुरेकत्वे सिद्धम्।",
        transliterationText: "na, anyadṛṣṭasyānyena smaraṇāsambhavāt. pratisandhānaṃ karturekative siddham.",
        translation: "Incorrect. One entity cannot remember what was experienced by an entirely different entity. If moments are absolutely distinct, there is no causal continuum that can bridge them. Recognition (pratyabhijñā) proves the absolute oneness of the subject.",
        logicalRole: "Siddhānta • Refutation of Objection (Khaṇḍana)",
        pramanaUsed: "Pratyabhijñā (Recognition / Direct Self-Awareness)",
        commentary: "If the perceiver at time T1 is completely different from the rememberer at T2, memory would be impossible. It would be like Devadatta remembering what Yajñadatta saw, which is absurd (atiprasaṅga)."
      },
      {
        id: "atman-4",
        type: "purvapaksa",
        speaker: "Ācārya Dignāga",
        school: "Buddhism",
        sanskrit: "कर्तृत्वं काल्पनिकम्, यथा बीजसन्तानादङ्कुरो जायते न तु कश्चित् स्थिरो बीजस्वभावः।",
        transliterationText: "kartṛtvaṃ kālpanikam, yathā bījasantānādaṅkuro jāyate na tu kaścit sthiro bījasvabhāvaḥ.",
        translation: "The concept of an 'agent' or 'soul' is merely a linguistic designation. Just as a seed-stream produces a sprout without any eternal, unchanging 'seed-essence' existing inside the sprout, memory arises without an enduring agent.",
        logicalRole: "Pūrvapakṣa • Counter-Challenge (Pratyavasthāna)",
        defectChecked: "Upādhi (Conditional Association of agency to transient streams)",
        commentary: "The sprout depends on the seed, yet the seed has perished when the sprout emerges. Continuity is purely causal (Kārya-Kāraṇa-Bhāva) and functional, requiring no static underlying substrate."
      },
      {
        id: "atman-5",
        type: "siddhanta",
        speaker: "Uddyotakara",
        school: "Nyāya",
        sanskrit: "बीजमचेतनम्, चेतनस्यैव स्मृतिनियमादतिप्रसङ्गभङ्गाय नित्य आत्मा सिद्धः।",
        transliterationText: "bījamacetanam, cetanasyaiva smṛtiniyamādatiprasaṅgabhaṅgāya nitya ātmā siddhaḥ.",
        translation: "Seeds are non-cognitive and physical. Memory, desire, and recognition are unique qualities of consciousness (caitanya). A non-cognitive causal law cannot explain conscious recollection. To avoid absolute causal chaos, the eternal, conscious Self is established.",
        logicalRole: "Siddhānta • Final Integration & Conclusion (Nigamana)",
        pramanaUsed: "Arthāpatti (Presumption of singular agency for coherence)",
        commentary: "Siddhānta culminates here. The mechanical flow of seed-to-sprout cannot map to the moral, conscious, and recollecting activities of human life. Therefore, a permanent spiritual substance, the Ātman, is logically mandatory."
      }
    ]
  },
  {
    id: "sabda",
    title: "Eternity of the Primordial Sound (Śabda-Nityatvā-Vāda)",
    description: "The historic debate concerning the metaphysical status of speech and letters. Is sound eternal, self-existent, and merely uncovered, or is it created, temporary, and subject to decay?",
    speakers: { purvapaksa: "Sabara Swāmī / Kumārila", siddhanta: "Maharṣi Gautama / Jayanta Bhaṭṭa" },
    schools: { purvapaksa: "Pūrva-Mīmāṃsā (Veda-Apaurūṣeyatva)", siddhanta: "Nyāya-Vaiśeṣika" },
    nodes: [
      {
        id: "sabda-1",
        type: "purvapaksa",
        speaker: "Sabara Swāmī",
        school: "Mīmāṃsā",
        sanskrit: "नित्यः शब्दः, प्रत्यभिज्ञानात्। गकार इति बुद्धेः सर्वत्रैकत्वात्।",
        transliterationText: "nityaḥ śabdaḥ, प्रत्यभिज्ञानात्। gakāra iti buddheḥ sarvatraikatvāt.",
        translation: "Sound (specifically phonemic letters) is eternal. When multiple speakers utter the letter 'G' ('ga'), listeners recognize it as the identical letter that exists eternally, not as a newly created entity.",
        logicalRole: "Pūrvapakṣa • Initial Proposition (Pratijñā)",
        pramanaUsed: "Śabda (Testimony) & Pratyabhijñā",
        commentary: "Mīmāṃsā argues that phonemes (Varnas) are omnipresent and eternal. Human articulation merely removes the silent obstruction (āvaraṇa) and manifests the pre-existing sound. Sound itself is never born and never dies."
      },
      {
        id: "sabda-2",
        type: "siddhanta",
        speaker: "Gautama",
        school: "Nyāya",
        sanskrit: "अनित्यः शब्दः, प्रयत्नानन्तरीयकत्वात् घटवत्। प्रत्यभिज्ञा तु जातिविषया।",
        transliterationText: "anityaḥ śabdaḥ, prayatnānantarīyakatvāt ghaṭavat. pratyabhijñā tu jātiviṣayā.",
        translation: "Sound is non-eternal (anitya), because it is produced by active human effort (prayatna), just like a clay pot. The recognition of 'ga' is merely recognition of its universal class (Gātva-jāti), not of the identical physical sound wave.",
        logicalRole: "Siddhānta • First Refutation (Khaṇḍana)",
        pramanaUsed: "Anumāna (Syllogism of Production)",
        commentary: "If sound were eternal, it would be audible at all times. Since it arises only after vocal chords strike air, it must be produced. When we say 'it is the same letter,' we refer to the genus/universal, just as we recognize multiple cows as 'cow'."
      },
      {
        id: "sabda-3",
        type: "purvapaksa",
        speaker: "Sabara Swāmī",
        school: "Mīmāṃsā",
        sanskrit: "नात्पद्यते शब्दः, प्रयत्नेन तु विद्यमानस्यैव शब्दस्याभिव्यक्तिः क्रियते आवरणापगमात्।",
        transliterationText: "notpadyate śabdaḥ, prayatnena tu vidyamānasyaiva śabdasya-abhivyaktiḥ kriyate āvaraṇāpagamāt.",
        translation: "Human effort does not create sound; it merely manifests it. The striking of vocal organs removes the air-barrier, revealing the self-existent phoneme. Just as a lamp reveals a pre-existing jar in a dark room, effort reveals sound.",
        logicalRole: "Pūrvapakṣa • Counter-Objection & Analogy (Upamāna)",
        defectChecked: "Savyabhicāra (Irregularity of the manifestation analogy)",
        commentary: "The Mīmāṃsaka defends with the Manifestation Theory (Abhivyakti-vāda). Human effort is a trigger that uncovers eternal waves already present in the ether (Ākāśa)."
      },
      {
        id: "sabda-4",
        type: "siddhanta",
        speaker: "Gautama",
        school: "Nyāya",
        sanskrit: "अभिव्यक्तिमात्रत्वे तीव्रमन्दतानुपपत्तिः, प्रयत्नातिशयात् तीव्रतरशब्दात्पत्तेः।",
        transliterationText: "abhivyaktimātratve tīvramandatānupapattiḥ, prayatnātiśayāt tīvrataraśabdātpatteḥ.",
        translation: "If effort merely manifested a pre-existing sound, there would be no graduation in sound volume (loudness or softness). A stronger strike produces a physically louder sound. A lamp does not make a jar larger or smaller; it merely shows it. Thus, volume differences prove real physical creation.",
        logicalRole: "Siddhānta • Final Logical Refutation",
        pramanaUsed: "Pratyakṣa (Auditory Observation of intensity variation)",
        commentary: "If sound was already fully formed and merely 'revealed' by removing an obstruction, it would sound identical regardless of whether you whispered or screamed. The physical variation in sound energy proves that vocal effort creates new wave vibrations in Ākāśa."
      },
      {
        id: "sabda-5",
        type: "siddhanta",
        speaker: "Gautama",
        school: "Nyāya",
        sanskrit: "तस्मादभिव्यक्त्यसम्भवाद् उत्पत्तिविनाशधर्मकत्वाच्चानित्यः शब्दः सिद्धः।",
        transliterationText: "tasmādabhivyaktyasambhavād utpattivināśadharmakatvāccānityaḥ śabdaḥ siddhaḥ.",
        translation: "Therefore, because manifestation theory is logically unsupportable, and sound possesses the clear attributes of both creation and destruction, sound is conclusively proven to be non-eternal.",
        logicalRole: "Siddhānta • Decisive Conclusion (Nigamana)",
        pramanaUsed: "Anumāna (Invariable Concomitance of creation and impermanence)",
        commentary: "Since sound is transient, Vedic sound is a collection of compositions authored by trustworthy, compassionate seers (Āpta), rather than being an uncreated, impersonal cosmic substance. This establishes the human agency in knowledge."
      }
    ]
  },
  {
    id: "isvara",
    title: "The Prime Architect of Atoms (Īśvara-Kāraṇatva-Vāda)",
    description: "The grand theological disputation: Is the physical universe of structured elements compiled by an omniscient, benevolent Supreme Architect, or does it combine automatically by pure mechanical karma or material nature?",
    speakers: { purvapaksa: "Materialist Cārvāka & Mīmāṃsā", siddhanta: "Udayanācārya (Kusumāñjali)" },
    schools: { purvapaksa: "Cārvāka (Svabhāva-vāda) & Mīmāṃsā", siddhanta: "Navya-Nyāya (Theistic Logic)" },
    nodes: [
      {
        id: "isvara-1",
        type: "siddhanta",
        speaker: "Udayanācārya",
        school: "Nyāya",
        sanskrit: "क्षित्यादिकं सकर्तृकम्, कार्यत्वात्, घटवत्। यः कार्यं स सकर्तृकः।",
        transliterationText: "kṣityādikaṃ sakartṛkam, kāryatvāt, ghaṭavat. yaḥ kāryaṃ sa sakartṛkaḥ.",
        translation: "The earth, mountains, and trees must have an intelligent, conscious creator, because they are of the nature of physical effects (kārya) or structured composites, just like a clay pot.",
        logicalRole: "Siddhānta • Initial Proposition (Pratijñā)",
        pramanaUsed: "Anumāna (Cosmological Syllogism)",
        commentary: "This is Udayana's famous cosmological argument from the Nyāya Kusumāñjali. Any composite entity that undergoes creation and structural composition must have been designed and assembled by an agent possessing knowledge, desire, and will."
      },
      {
        id: "isvara-2",
        type: "purvapaksa",
        speaker: "Cārvāka Sceptic",
        school: "Cārvāka",
        sanskrit: "न, अशरीरिणः कर्तृत्वानुपपत्तेः। यदा शरीरं तदैव कर्तृत्वं लोकदृष्टम्।",
        transliterationText: "na, aśarīriṇaḥ kartṛtvānupapatteḥ. yadā śarīraṃ tadaiva kartṛtvaṃ lokadṛṣṭam.",
        translation: "No. In common human observation, only an agent possessing a physical body (śarīra) can act, construct, or design. If God has no body, He cannot arrange physical atoms. If God has a body, He is a created, perishable being Himself, requiring another creator, leading to infinite regress.",
        logicalRole: "Pūrvapakṣa • Sceptical Objection (Śaṅkā)",
        defectChecked: "Anavasthā (Infinite Regress fallacy) & Vyāpyatvāsiddhi",
        commentary: "The materialist argues that the 'bodyless creator' violates all empirical correlations of agency. No physical action is possible without muscles, hands, and neural intent. If God has a body, He is bound by material laws."
      },
      {
        id: "isvara-3",
        type: "siddhanta",
        speaker: "Udayanācārya",
        school: "Nyāya",
        sanskrit: "ईश्वरेच्छाया एव परमाणुसंयोगानुकूलप्रयत्नजनकत्वात्, शरीरं विनाप्यदृष्टसाहाय्येन सृष्टिः सम्भवति।",
        transliterationText: "īśvarecchāyā eva paramāṇusaṃyogānukūlaprayatnajanakatvāt, śarīraṃ vināpyadṛṣṭasāhāyyena sṛṣṭiḥ sambhavati.",
        translation: "The Supreme Lord operates directly through His eternal Will (Icchā) and Cognitive Effort (Kṛti). Just as an individual soul acts upon its own subtle life forces and bodily atoms without requiring an external physical body, the Supreme Soul acts directly upon primordial atoms (Paramāṇu) aided by the cumulative karma (Adṛṣṭa) of souls.",
        logicalRole: "Siddhānta • Refutation & Metaphysical Grounding",
        pramanaUsed: "Anumāna (Analogical Agency)",
        commentary: "Udayana resolves the corporeal objection by showing that even in humans, the initial mental act that moves a muscle does not require another physical tool to trigger it—it is a direct volition. Similarly, God's infinite volition directly acts upon the physical building blocks of the universe (atoms) to form initial dyads (dvyaṇuka)."
      },
      {
        id: "isvara-4",
        type: "purvapaksa",
        speaker: "Mīmāṃsā Ritualist",
        school: "Mīmāṃsā",
        sanskrit: "कर्मणैव विचित्रजगदुत्पत्तिसम्भवे किमपूर्वेणेश्वरेण? कर्माणि फलप्रदानसमर्थानि।",
        transliterationText: "karmaṇaiva vicitrajagadutpattisambhave kimapūrveṇeśvareṇa? karmāṇi phalapradānasamarthāni.",
        translation: "The diversity of happiness, pain, and physical species can be fully accounted for by the power of Karma (Adṛṣṭa / Apūrva) alone. Actions themselves yield fruits automatically through moral cosmic laws. Why assume an unnecessary external God?",
        logicalRole: "Pūrvapakṣa • Alternative Explanation Challenge",
        defectChecked: "Kalpanā-lāghava (Attempted simpler model of pure karma)",
        commentary: "The orthodox Mīmāṃsaka rejects theism, asserting that the universe is eternal, undergoing periodic changes governed purely by the self-executing force of Vedic ritual karma and moral residue."
      },
      {
        id: "isvara-5",
        type: "siddhanta",
        speaker: "Udayanācārya",
        school: "Nyāya",
        sanskrit: "कर्माचेतनं सत् चेतनेनाधिष्ठितं विना फलाय न कल्पते, अतोऽधिष्ठातृत्वेन परमात्मा सिद्धः।",
        transliterationText: "karmācetanaṃ sat cetanenādhiṣṭhitaṃ vinā phalāya n kalpate, ato'dhiṣṭhātṛtvena paramātmā siddhaḥ.",
        translation: "Karma is non-intelligent and unconscious (acetana). An unconscious force cannot organize itself, weigh moral actions, or distribute exact rewards and retributive births across diverse souls of its own accord. It requires an omniscient, conscious Superintendent to guide and distribute its fruits. Thus, Īśvara is established as the supreme moral architect.",
        logicalRole: "Siddhānta • Theological Nigamana",
        pramanaUsed: "Pratyakṣa & Anumāna (Moral necessity of conscious oversight)",
        commentary: "The final resolution of the Kusumāñjali: an unconscious material or moral law (like gravity or karma) cannot execute moral justice without a conscious executor. Just as an unconscious axe cannot chop wood without a conscious woodcutter, Karma cannot organize cosmic justice without the Supreme Intelligence of Īśvara."
      }
    ]
  }
];

interface DialecticalHistoryPathProps {
  chatMessages: ChatMessage[];
  opponentType: "buddhist" | "nyaya-expert";
  targetScript: string;
}

export default function DialecticalHistoryPath({
  chatMessages,
  opponentType,
  targetScript,
}: DialecticalHistoryPathProps) {
  const [selectedDebateType, setSelectedDebateType] = useState<"active" | "atman" | "sabda" | "isvara">("atman");
  const [selectedNode, setSelectedNode] = useState<PathNode | null>(null);
  const [flowOrientation, setFlowOrientation] = useState<"vertical" | "horizontal">("vertical");
  const [activeNodes, setActiveNodes] = useState<PathNode[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Generate nodes from active chat messages if selected
  useEffect(() => {
    if (selectedDebateType === "active") {
      // Filter out system welcome messages, or map them as root
      const validMessages = chatMessages.filter(msg => msg.id !== "sys-welcome" || msg.text.length > 5);
      
      if (validMessages.length === 0) {
        // Fallback or empty state
        setActiveNodes([]);
        setSelectedNode(null);
        return;
      }

      const generatedNodes: PathNode[] = validMessages.map((msg, index) => {
        const isUser = msg.sender === "user";
        const role = index === 0 
          ? "Siddhānta • Initial Thesis (Pratijñā)"
          : isUser 
          ? `Siddhānta • Refutation Response (Node ${index + 1})`
          : `Pūrvapakṣa • Opponent Challenge (Node ${index + 1})`;

        return {
          id: msg.id,
          type: isUser ? "siddhanta" : "purvapaksa",
          speaker: isUser ? "You (Siddhāntin)" : opponentType === "buddhist" ? "Ācārya Dignāga" : "Annambhaṭṭa",
          school: isUser ? "Orthodox Nyāya school" : opponentType === "buddhist" ? "Buddhist Svalakṣaṇa" : "Syncretic Tarkasaṃgraha",
          sanskrit: isUser ? "पक्ष-प्रमाण-समन्वयः।" : "पूर्वपक्ष-आक्षेप-स्थापनम्।", // Mock Sanskrit titles
          transliterationText: isUser ? "pakṣa-pramāṇa-samanvayaḥ." : "pūrvapakṣa-ākṣepa-sthāpanam.",
          translation: msg.text,
          logicalRole: role,
          pramanaUsed: isUser ? "Anumāna / Śabda / Upamāna" : undefined,
          defectChecked: !isUser ? "Hetvābhāsa check" : undefined,
          commentary: isUser 
            ? "Your dialectical formulation protecting the orthodox Nyāya thesis in the active Sabhā." 
            : "The opponent's logical counter-argument targeting your structural premise in real-time."
        };
      });

      setActiveNodes(generatedNodes);
      setSelectedNode(generatedNodes[0]);
    } else {
      const historical = HISTORICAL_DEBATES.find(d => d.id === selectedDebateType);
      if (historical) {
        setActiveNodes(historical.nodes);
        setSelectedNode(historical.nodes[0]);
      }
    }
  }, [selectedDebateType, chatMessages, opponentType]);

  const handleExportText = () => {
    const textLines: string[] = [];
    const title = selectedDebateType === "active" 
      ? `Active Sabhā Debate Flow - ${opponentType === "buddhist" ? "Dignāga" : "Annambhaṭṭa"}`
      : HISTORICAL_DEBATES.find(d => d.id === selectedDebateType)?.title || "";

    textLines.push(`===================================================`);
    textLines.push(`     TARKAVĪDYA • DIALECTICAL HISTORY MANUSCRIPT   `);
    textLines.push(`===================================================`);
    textLines.push(`Debate: ${title}`);
    textLines.push(`Date: ${new Date().toLocaleDateString()}`);
    textLines.push(`Script View: ${targetScript.toUpperCase()}`);
    textLines.push(`===================================================\n`);

    activeNodes.forEach((node, idx) => {
      textLines.push(`[NODE ${idx + 1}] - ${node.logicalRole.toUpperCase()}`);
      textLines.push(`Speaker: ${node.speaker} (${node.school})`);
      textLines.push(`Sanskrit: ${transliterate(node.sanskrit, targetScript)}`);
      textLines.push(`IAST: ${node.transliterationText}`);
      textLines.push(`English Translation: ${node.translation}`);
      if (node.pramanaUsed) textLines.push(`Valid Pramāṇa: ${node.pramanaUsed}`);
      if (node.defectChecked) textLines.push(`Defect Analyzed: ${node.defectChecked}`);
      textLines.push(`Academic Analysis: ${node.commentary}`);
      textLines.push(`---------------------------------------------------\n`);
    });

    const blob = new Blob([textLines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `tarkavidya_debate_${selectedDebateType}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6" id="dialectical-history-path-panel">
      
      {/* Header and explanation */}
      <div className="bg-[#FAF8F5] border-2 border-[#1A1A1A] p-5 sm:p-6 rounded-none space-y-3 relative overflow-hidden">
        <div className="absolute right-3 top-3 opacity-10">
          <GitBranch className="w-24 h-24 text-[#795548]" />
        </div>
        <div className="flex items-center gap-2.5">
          <GitBranch className="w-5 h-5 text-[#795548] animate-pulse" />
          <h3 className="text-base font-serif font-black text-[#3B2314] uppercase tracking-wide">
            Dialectical History Path • सर्वानुसन्धान-मण्डलम्
          </h3>
        </div>
        <p className="text-xs text-stone-700 leading-relaxed font-sans max-w-4xl">
          Sanskrit philosophical treatises proceed strictly through <strong>Śāstrārtha</strong> (debate). Any established conclusion (<em>Siddhānta</em>) can only survive by refuting all possible counter-theses (<em>Pūrvapakṣa</em>). Use this visual flowchart engine to trace the step-by-step logic, cognitive leaps, and arguments of live debate rounds or famous historical clashes.
        </p>
      </div>

      {/* Selectors and orientation toggles */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        
        {/* Debate Selection Tabs */}
        <div className="md:col-span-9 flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedDebateType("active")}
            className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded-none border-2 border-[#1A1A1A] cursor-pointer transition-all ${
              selectedDebateType === "active"
                ? "bg-[#795548] text-white shadow-none"
                : "bg-white text-[#1A1A1A] hover:bg-stone-50"
            }`}
          >
            💬 Live Arena Chat Flow ({chatMessages.filter(msg => msg.id !== "sys-welcome").length} nodes)
          </button>
          
          <button
            onClick={() => setSelectedDebateType("atman")}
            className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded-none border-2 border-[#1A1A1A] cursor-pointer transition-all ${
              selectedDebateType === "atman"
                ? "bg-[#795548] text-white shadow-none"
                : "bg-[#F5F2EA]/80 text-[#3B2314] hover:bg-stone-50"
            }`}
          >
            🛡️ 1. Dignāga vs Uddyotakara (Ātman)
          </button>

          <button
            onClick={() => setSelectedDebateType("sabda")}
            className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded-none border-2 border-[#1A1A1A] cursor-pointer transition-all ${
              selectedDebateType === "sabda"
                ? "bg-[#795548] text-white shadow-none"
                : "bg-[#F5F2EA]/80 text-[#3B2314] hover:bg-stone-50"
            }`}
          >
            🔔 2. Mīmāṃsā vs Nyāya (Śabda-Eternity)
          </button>

          <button
            onClick={() => setSelectedDebateType("isvara")}
            className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded-none border-2 border-[#1A1A1A] cursor-pointer transition-all ${
              selectedDebateType === "isvara"
                ? "bg-[#795548] text-white shadow-none"
                : "bg-[#F5F2EA]/80 text-[#3B2314] hover:bg-stone-50"
            }`}
          >
            🏛️ 3. Theistic Nyāya vs Sceptics (Īśvara)
          </button>
        </div>

        {/* Orientation Toggle */}
        <div className="md:col-span-3 flex justify-end gap-2">
          <button
            onClick={() => setFlowOrientation(flowOrientation === "vertical" ? "horizontal" : "vertical")}
            className="w-full md:w-auto px-3.5 py-2 bg-white border-2 border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-all text-xs font-bold rounded-none cursor-pointer flex items-center justify-center gap-1.5"
            title="Toggle Flowchart Layout direction"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Layout: {flowOrientation === "vertical" ? "Vertical" : "Horizontal"}</span>
          </button>
        </div>

      </div>

      {/* Main Flow Canvas and Detail Card */}
      {activeNodes.length === 0 ? (
        <div className="bg-[#FAF8F5] rounded-none border-2 border-dashed border-[#1A1A1A] p-16 text-center space-y-3">
          <Layers className="w-10 h-10 text-stone-400 mx-auto" />
          <h4 className="text-sm font-bold font-serif text-[#1A1A1A]">No active debate messages found in this round.</h4>
          <p className="text-xs text-stone-600 font-sans max-w-md mx-auto leading-relaxed">
            Head to the <strong>"Interactive Vāda assembly"</strong> sub-tab, post a thesis or counter-argument to Dignāga or Annambhaṭṭa, and return here to trace your dynamic logical flowchart!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          
          {/* Flowchart Section */}
          <div className="xl:col-span-7 bg-stone-100/60 border-2 border-[#1A1A1A] p-6 overflow-auto custom-scrollbar max-h-[700px]">
            
            <div className="mb-4 flex items-center justify-between">
              <span className="text-[10px] font-mono text-stone-550 uppercase tracking-widest font-black">
                {selectedDebateType === "active" ? "Active Sabhā Realtime Graph" : "Classic Dialectical Linear Flow"}
              </span>
              <span className="text-[9.5px] font-sans font-bold text-[#8C6239] bg-white border border-[#1A1A1A] px-2 py-0.5">
                Click any node to study its logical metrics
              </span>
            </div>

            {flowOrientation === "vertical" ? (
              /* Vertical Timeline Flow */
              <div className="relative pl-6 sm:pl-8 space-y-8 py-4">
                {/* Connector line */}
                <div className="absolute left-10 sm:left-12 top-4 bottom-4 w-1 bg-[#1A1A1A] z-0"></div>

                {activeNodes.map((node, idx) => {
                  const isSelected = selectedNode?.id === node.id;
                  const isPurvapaksa = node.type === "purvapaksa";
                  
                  return (
                    <motion.div
                      key={node.id}
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      onClick={() => setSelectedNode(node)}
                      className={`relative flex gap-4 items-start cursor-pointer select-none group`}
                    >
                      {/* Node circle/badge */}
                      <div className="relative z-10 shrink-0">
                        <div
                          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-[#1A1A1A] flex items-center justify-center text-xs font-black shadow-none transition-all ${
                            isSelected
                              ? "bg-[#795548] text-white scale-110"
                              : isPurvapaksa
                              ? "bg-[#F5EDD6] text-[#8C6239] group-hover:bg-[#8C6239] group-hover:text-white"
                              : "bg-white text-[#1A1A1A] group-hover:bg-[#1A1A1A] group-hover:text-white"
                          }`}
                        >
                          {idx + 1}
                        </div>
                      </div>

                      {/* Card Content */}
                      <div
                        className={`flex-1 p-4 border-2 transition-all ${
                          isSelected
                            ? "bg-white border-[#795548] ring-1 ring-[#795548] translate-x-1"
                            : "bg-white border-[#1A1A1A] hover:bg-stone-50"
                        }`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-1 border-b border-stone-200 pb-1.5 mb-2">
                          <span
                            className={`text-[9.5px] font-black uppercase tracking-wider font-sans px-1.5 py-0.5 border ${
                              isPurvapaksa
                                ? "bg-[#FAF1D6]/80 text-[#8C6239] border-[#8C6239]/30"
                                : "bg-stone-100 text-[#1A1A1A] border-stone-300"
                            }`}
                          >
                            {isPurvapaksa ? "Pūrvapakṣa (Objection)" : "Siddhānta (Thesis)"}
                          </span>
                          <span className="text-[10px] font-mono text-stone-500 font-bold">
                            {node.speaker}
                          </span>
                        </div>

                        {/* Sanskrit / Translit snippet */}
                        <p className={`font-serif text-[13px] font-black text-[#1A1A1A] leading-relaxed mb-1.5 ${getScriptFontClass(targetScript)}`}>
                          {transliterate(node.sanskrit, targetScript)}
                        </p>

                        <p className="text-xs text-stone-650 font-sans line-clamp-2 italic leading-relaxed">
                          "{node.translation}"
                        </p>

                        {/* Badges for active logic keys */}
                        <div className="flex flex-wrap gap-1.5 mt-2.5 pt-2 border-t border-stone-150">
                          <span className="text-[9px] font-mono font-bold text-stone-500">
                            Role: {node.logicalRole.split("•")[1] || node.logicalRole}
                          </span>
                          {node.pramanaUsed && (
                            <span className="text-[9px] font-sans font-bold text-emerald-800 bg-emerald-50 px-1.5 border border-emerald-200">
                              Pramāṇa: {node.pramanaUsed.split(" ")[0]}
                            </span>
                          )}
                          {node.defectChecked && (
                            <span className="text-[9px] font-sans font-bold text-red-800 bg-red-50 px-1.5 border border-red-200">
                              Analyzed: {node.defectChecked.split(" ")[0]}
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              /* Horizontal MIND MAP / FLOWCHART Layout */
              <div className="flex flex-nowrap gap-6 py-6 px-2 min-w-max select-none">
                {activeNodes.map((node, idx) => {
                  const isSelected = selectedNode?.id === node.id;
                  const isPurvapaksa = node.type === "purvapaksa";

                  return (
                    <div key={node.id} className="flex items-center gap-6">
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                        onClick={() => setSelectedNode(node)}
                        className={`w-72 p-4 border-2 cursor-pointer transition-all shrink-0 ${
                          isSelected
                            ? "bg-white border-[#795548] ring-1 ring-[#795548] scale-102"
                            : "bg-white border-[#1A1A1A] hover:bg-stone-50"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 border-b border-stone-200 pb-1.5 mb-2.5">
                          <div className="flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded-full border border-[#1A1A1A] bg-[#FAF8F5] flex items-center justify-center text-[10px] font-black text-stone-800">
                              {idx + 1}
                            </span>
                            <span
                              className={`text-[8.5px] font-black uppercase tracking-wider font-sans px-1.5 py-0.5 border ${
                                isPurvapaksa
                                  ? "bg-[#FAF1D6]/80 text-[#8C6239] border-[#8C6239]/30"
                                  : "bg-stone-100 text-[#1A1A1A] border-stone-300"
                              }`}
                            >
                              {isPurvapaksa ? "Pūrvapakṣa" : "Siddhānta"}
                            </span>
                          </div>
                          <span className="text-[9px] font-mono text-stone-500 font-bold truncate max-w-[100px]">
                            {node.speaker.split(" ")[0]}
                          </span>
                        </div>

                        <p className={`font-serif text-xs font-black text-[#1A1A1A] line-clamp-2 leading-relaxed mb-1.5 ${getScriptFontClass(targetScript)}`}>
                          {transliterate(node.sanskrit, targetScript)}
                        </p>

                        <p className="text-[11px] text-stone-600 font-sans line-clamp-3 italic leading-relaxed">
                          "{node.translation}"
                        </p>

                        <div className="text-[9px] font-mono font-bold text-stone-500 mt-2.5 pt-1.5 border-t border-stone-150">
                          {node.logicalRole.split("•")[1] || node.logicalRole}
                        </div>
                      </motion.div>

                      {/* Horizontal connecting arrow (except for the very last node) */}
                      {idx < activeNodes.length - 1 && (
                        <div className="flex flex-col items-center justify-center text-stone-700 font-bold animate-pulse">
                          <ArrowRight className="w-6 h-6 text-[#1A1A1A]" />
                          <span className="text-[9px] font-mono text-stone-500 mt-1 uppercase">Refutation</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

          </div>

          {/* Scholarly Detail Pane */}
          <div className="xl:col-span-5 bg-white border-2 border-[#1A1A1A] p-5 sm:p-6 space-y-6">
            
            {selectedNode ? (
              <div className="space-y-6">
                
                {/* Detail Header */}
                <div className="border-b-2 border-[#1A1A1A] pb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono text-stone-500 uppercase tracking-wider font-black">
                      Discourse Node Scholastic Analysis
                    </span>
                    <button
                      onClick={handleExportText}
                      className="text-[9px] font-mono font-bold flex items-center gap-1 text-[#8C6239] hover:text-[#795548] border border-[#8C6239]/20 px-2 py-0.5 bg-stone-50 cursor-pointer"
                    >
                      <Download className="w-2.5 h-2.5" />
                      <span>Export Flow</span>
                    </button>
                  </div>
                  <h4 className="text-base font-serif font-black text-[#3B2314] leading-tight">
                    {selectedNode.logicalRole}
                  </h4>
                </div>

                {/* Speaker info */}
                <div className="grid grid-cols-2 gap-4 bg-[#F5F2EA]/40 p-3.5 border border-[#1A1A1A] text-xs">
                  <div>
                    <span className="text-[9px] font-black text-stone-500 uppercase block tracking-wider font-sans">Active Proponent</span>
                    <strong className="text-stone-900 font-serif font-black">{selectedNode.speaker}</strong>
                  </div>
                  <div>
                    <span className="text-[9px] font-black text-stone-500 uppercase block tracking-wider font-sans">Adhered School</span>
                    <strong className="text-[#8C6239] font-sans font-extrabold">{selectedNode.school}</strong>
                  </div>
                </div>

                {/* Original Sanskrit text block */}
                <div className="space-y-2">
                  <span className="text-[10px] font-black text-[#795548] uppercase tracking-widest block font-sans">
                    Original Śāstrārtha Assertion (मूलसंस्कृतवचनम्)
                  </span>
                  <div className="bg-stone-50 border border-[#8C6239]/20 p-4 relative">
                    <p className={`font-serif font-black text-stone-900 text-base leading-relaxed ${getScriptFontClass(targetScript)}`}>
                      {transliterate(selectedNode.sanskrit, targetScript)}
                    </p>
                    <p className="text-[10px] font-mono italic text-stone-450 mt-2 select-all pr-1 border-t border-dashed border-stone-200 pt-2">
                      IAST: {selectedNode.transliterationText}
                    </p>
                  </div>
                </div>

                {/* Translation block */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black text-stone-500 uppercase tracking-widest block font-sans">
                    Universal Translation
                  </span>
                  <p className="text-xs sm:text-sm text-stone-850 leading-relaxed font-sans text-justify">
                    "{selectedNode.translation}"
                  </p>
                </div>

                {/* Epistemological Instruments badge */}
                {(selectedNode.pramanaUsed || selectedNode.defectChecked) && (
                  <div className="border-y border-stone-200 py-3.5 space-y-2.5">
                    {selectedNode.pramanaUsed && (
                      <div className="flex gap-2 items-start text-xs font-sans">
                        <Scale className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-stone-900 font-bold block">Valid Pramāṇa Employed:</strong>
                          <span className="text-stone-650 text-[11.5px]">{selectedNode.pramanaUsed}</span>
                        </div>
                      </div>
                    )}
                    {selectedNode.defectChecked && (
                      <div className="flex gap-2 items-start text-xs font-sans">
                        <Info className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-stone-900 font-bold block">Dialectical Challenge / Fallacy Analyzed:</strong>
                          <span className="text-stone-650 text-[11.5px]">{selectedNode.defectChecked}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Scholastic Commentary */}
                <div className="space-y-2">
                  <span className="text-[10px] font-black text-stone-500 uppercase tracking-widest block font-sans flex items-center gap-1">
                    <BookOpenCheck className="w-3.5 h-3.5 text-[#795548]" />
                    Academy Interpretative Commentary
                  </span>
                  <p className="text-xs text-stone-750 leading-relaxed text-justify font-sans bg-[#FAF8F5] p-3 border border-stone-200">
                    {selectedNode.commentary}
                  </p>
                </div>

              </div>
            ) : (
              <div className="py-24 text-center space-y-2">
                <Info className="w-8 h-8 text-stone-400 mx-auto" />
                <p className="text-xs font-serif text-[#1A1A1A] font-bold">
                  Select a step on the visualizer flow-chart to pull the complete linguistic and epistemological breakdown.
                </p>
              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
}

// Simple Helper to return appropriate font classes based on current script target.
function getScriptFontClass(script: string): string {
  if (script === "devanagari") return "font-sans font-bold";
  if (script === "bengali") return "font-sans";
  return "font-serif";
}
