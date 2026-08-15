/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { DialecticalResponse, ChatMessage } from "../types";
import NyayaSyllogismD3 from "./NyayaSyllogismD3";
import DialecticalHistoryPath from "./DialecticalHistoryPath";
// 1. Import the official Google Generative AI SDK
import { GoogleGenerativeAI } from "@google/generative-ai";
// 2. Import the React Markdown renderer to parse rich text formatting codes
import ReactMarkdown from "react-markdown";
import {
  ShieldAlert,
  Send,
  MessageSquare,
  Users,
  Compass,
  CheckCircle,
  XCircle,
  HelpCircle,
  RefreshCw,
  GitPullRequest,
  GitBranch,
  Sparkles
} from "lucide-react";

interface VadaVidyaProps {
  targetScript?: string;
}

// 3. Initialize the Gemini API client using your Vite environment variable
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export default function VadaVidya({ targetScript = "gregorian" }: VadaVidyaProps) {
  const [activeSubTab, setActiveSubTab] = useState<"analyzer" | "debate" | "historyPath" | "visualizer" | "panchanayaSamanvaya">("analyzer");

  // State for Argument Analyzer
  const [argumentInput, setArgumentInput] = useState("");
  const [analysisResponse, setAnalysisResponse] = useState<DialecticalResponse | null>(null);
  const [analyzerLoading, setAnalyzerLoading] = useState(false);
  const [analyzerError, setAnalyzerError] = useState<string | null>(null);

  // State for Debate Arena
  const [opponentType, setOpponentType] = useState<"buddhist" | "nyaya-expert">("buddhist");
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);

  // State for Pañcanaya-Samanvaya
  const [samanvayaThesisA, setSamanvayaThesisA] = useState("");
  const [samanvayaThesisB, setSamanvayaThesisB] = useState("");
  const [samanvayaResult, setSamanvayaResult] = useState<any | null>(null);
  const [samanvayaLoading, setSamanvayaLoading] = useState(false);
  const [samanvayaError, setSamanvayaError] = useState<string | null>(null);

  const endOfChatRef = useRef<HTMLDivElement | null>(null);

  const SAMANVAYA_PRESETS = [
    {
      label: "Eternal Soul vs Momentary Aggregates",
      thesisA: "The Soul (Ātman) is an eternal, unchanging, and permanent substance that survives across lives.",
      thesisB: "The Self is a momentary stream of physical and mental aggregates (skandhas) in constant flux."
    },
    {
      label: "Pre-existing Effect vs New Creation",
      thesisA: "The effect pre-exists in its material cause (Satkāryavāda); a clay pot is just modified clay.",
      thesisB: "The effect is an entirely new substance with novel functions (Asatkāryavāda); the pot did not exist in the raw clay."
    },
    {
      label: "Absolute Monism vs Atomic Pluralism",
      thesisA: "All of reality is a single, undivided universal substance (Advaita); all distinctions are illusory.",
      thesisB: "Reality consists of infinitely distinct, pluralistic atoms and individual souls (Vaiśeṣika)."
    }
  ];

  // ========================================================
  // CORE FEATURE 1: PAÑCANAYA-SAMANVAYA JAIN SYNTHESIS ENGINE
  // ========================================================
  const handleSamanvayaSubmit = async () => {
    if (!samanvayaThesisA.trim() || !samanvayaThesisB.trim()) return;
    if (!apiKey) {
      setSamanvayaError("Gemini API Key is missing. Please configure VITE_GEMINI_API_KEY.");
      return;
    }
    setSamanvayaLoading(true);
    setSamanvayaError(null);
    setSamanvayaResult(null);

    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-3.5-flash",
        generationConfig: { responseMimeType: "application/json" },
        systemInstruction: "You are a master of Jaina Anekāntavāda (non-one-sidedness) dialectics. You evaluate two opposing philosophical assertions and reconcile them through five distinct standpoint angles (Nayas). You must return output exclusively in valid JSON format matching the requested schema layout."
      });

      const prompt = ` Analyze and synthesize the following two opposing views using the Jaina five Nayas:
      Assertion A: "${samanvayaThesisA}"
      Assertion B: "${samanvayaThesisB}"

      Return a JSON object matching this exact TypeScript structure:
      {
        "synthesisSummary": "A comprehensive paragraph combining and evaluating both viewpoints smoothly through Anekāntavāda guidelines.",
        "nayas": [
          { "name": "Naigama Naya (Universal-Particular View)", "sanskrit": "नैगमनयः", "description": "Relates to the overarching teleological end or common purpose.", "analysis": "Detailed synthesis text here..." },
          { "name": "Saṅgraha Naya (Class/Collective View)", "sanskrit": "संग्रहनयः", "description": "Focuses purely on universal unifying identity structures.", "analysis": "Detailed synthesis text here..." },
          { "name": "Vyavahāra Naya (Practical/Particular View)", "sanskrit": "व्यवहारनयः", "description": "Addresses everyday operational, pragmatic empirical distinctions.", "analysis": "Detailed synthesis text here..." },
          { "name": "Ṛjusūtra Naya (Straight/Momentary View)", "sanskrit": "ऋजुसूत्रनयः", "description": "Grabs the immediate snapshot frame of present reality independent of temporal history.", "analysis": "Detailed synthesis text here..." },
          { "name": "Śabda Naya (Verbal/Linguistic View)", "sanskrit": "शब्दनयः", "description": "Deals with semantic nuances, word designations, and relation rules.", "analysis": "Detailed synthesis text here..." }
        ]
      }`;

      const result = await model.generateContent(prompt);
      const parsedData = JSON.parse(result.response.text());
      setSamanvayaResult(parsedData);
    } catch (err: any) {
      console.error(err);
      setSamanvayaError(err.message || "Synthesis reconciliation assembly failed.");
    } finally {
      setSamanvayaLoading(false);
    }
  };

  // Preloaded arguments for fast analyzing
  const PRELOADED_ARGUMENTS = [
    {
      label: "Contradictory Fallacy (Sound is eternal as a product)",
      text: "Sound is eternal (nitya), because it is of the nature of an effect or product (kṛtakatva), like a clay pot.",
    },
    {
      label: "Bādhita/Annulled Fallacy (Fire is cold)",
      text: "Fire is cold (anuṣṇa), because it is a physical substance (dravyatvād), like water in a lake.",
    },
    {
      label: "Irregular Middle (Sound is eternal as knowable)",
      text: "Sound is eternal, because it is knowable, like the cosmic soul.",
    },
    {
      label: "Perfect Syllogism (Smoke-Fire on mountain)",
      text: "The mountain is on fire, because there is smoke on it. Wherever there is smoke, there is fire, as seen in a kitchen hearth. This mountain has smoke. Therefore, it is on fire.",
    }
  ];

  // Initialize Chat when Opponent type changes
  useEffect(() => {
    let welcomeText = "";
    if (opponentType === "buddhist") {
      welcomeText = "Greetings. I am Dignāga, a follower of the Great Teacher. I assert that all reality is momentary (kṣaṇika) and devoid of an eternal soul (anātman). By what valid means do you attempt to prove the existence of an unchanging Self or a creator God? Formulate your thesis and we shall enter the Sabhā.";
    } else {
      welcomeText = "Welcome, seeker. I am Annambhaṭṭa, compiler of the Tarkasaṃgraha. I stand ready to tutor you in traditional Nyāya logic and defend the existence of composite atoms, the eternal Soul, and the four valid instruments of knowledge. What logical claim shall we analyze first?";
    }
    setChatMessages([
      {
        id: "sys-welcome",
        sender: "opponent",
        text: welcomeText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  }, [opponentType]);

  // Scroll to bottom of chat
  useEffect(() => {
    endOfChatRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // ========================================================
  // CORE FEATURE 2: NYĀYA SYLLOGISM LOGIC ANALYSER / FALLACY DEBUNKER
  // ========================================================
  const handleAnalyzeArgument = async (argText: string) => {
    if (!argText.trim()) return;
    if (!apiKey) {
      setAnalyzerError("Gemini API Key is missing. Please configure VITE_GEMINI_API_KEY.");
      return;
    }
    if (!navigator.onLine) {
      setAnalyzerError("You are currently offline. AI-powered syllogism analysis requires an active internet connection.");
      return;
    }
    setAnalyzerLoading(true);
    setAnalyzerError(null);
    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-3.5-flash",
        generationConfig: { responseMimeType: "application/json" },
        systemInstruction: "You are an expert impartial Nyāya Logician and scholarly dialectical referee. You break down user arguments into traditional five-part structures (Pañcāvayava) and scan thoroughly for any of the 5 standard logical fallacies (Hetvābhāsa). You must output exclusively in valid JSON."
      });

      const prompt = `Analyze this argument sentence layout: "${argText}"
      
      Return a JSON object conforming exactly to this schema shape:
      {
        "validity": "perfect" or "defective",
        "scholarlyAnalysis": "Detailed linguistic and logical breakdown paragraph detailing if vyāpti or parāmarśa holds true.",
        "refutation": "A sharp, classic school specific one-line rebuttal phrase counter-stroke.",
        "fivePartSyllogism": [
          { "sanskritName": "Pratijñā", "name": "Proposition", "value": "extracted proposition text" },
          { "sanskritName": "Hetu", "name": "Reason", "value": "extracted reason statement" },
          { "sanskritName": "Udāharaṇa", "name": "Example", "value": "extracted universal example statement" },
          { "sanskritName": "Upanaya", "name": "Application", "value": "extracted application step" },
          { "sanskritName": "Nigamana", "name": "Conclusion", "value": "extracted conclusion output" }
        ],
        "fallacies": [
          { "detected": true/false, "sanskritName": "Savyabhicāra", "fallacyName": "Irregular Middle", "description": "The reason is not uniquely or invariably concomitant with the major term.", "explanation": "Why it is or isn't present in this specific text input..." },
          { "detected": true/false, "sanskritName": "Viruddha", "fallacyName": "Contradictory Reason", "description": "The reason actually disproves the proposition it seeks to establish.", "explanation": "Explanation text..." },
          { "detected": true/false, "sanskritName": "Satpratipakṣa", "fallacyName": "Counterbalanced Reason", "description": "An equal alternative reason exists that validly supports the opposite conclusion.", "explanation": "Explanation text..." },
          { "detected": true/false, "sanskritName": "Asiddha", "fallacyName": "Unproved Reason", "description": "The middle term/reason itself is unproven or non-existent in the subject.", "explanation": "Explanation text..." },
          { "detected": true/false, "sanskritName": "Bādhita", "fallacyName": "Annulled/Contradicted Middle", "description": "The truth of the proposition is directly disproved by another stronger instrument like sensory perception.", "explanation": "Explanation text..." }
        ]
      }`;

      const result = await model.generateContent(prompt);
      const parsedData: DialecticalResponse = JSON.parse(result.response.text());
      setAnalysisResponse(parsedData);
    } catch (err: any) {
      console.error(err);
      setAnalyzerError(err.message || "An unexpected error occurred during logic debugging analysis execution.");
    } finally {
      setAnalyzerLoading(false);
    }
  };

  // ========================================================
  // CORE FEATURE 3: SABHĀ DEBATE INTERACTIVE ASSEMBLY CHAT
  // ========================================================
  const handleSendChatMessage = async () => {
    if (!chatInput.trim() || chatLoading) return;
    if (!apiKey) {
      setChatError("Gemini API Key is missing. Please configure VITE_GEMINI_API_KEY.");
      return;
    }
    if (!navigator.onLine) {
      setChatError("You are currently offline. Engaging in the Sabhā assembly requires an active internet connection.");
      return;
    }
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: chatInput,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const newHistory = [...chatMessages, userMsg];
    setChatMessages(newHistory);
    const currentInput = chatInput;
    setChatInput("");
    setChatLoading(true);
    setChatError(null);

    try {
      // Configure target historical system prompt persona conditions
      const opponentInstruction = opponentType === "buddhist"
        ? "You are Dignāga, the legendary Buddhist logician and founder of Buddhist epistemology. Strongly defend the philosophical structures of Apoha, Kṣaṇikavāda (momentariness), and Anātman (the non-existence of an eternal soul). Challenge the user to establish any permanent soul or substance using valid pramāṇas. Maintain a brilliant, critical, but completely respectful philosophical disputation tone."
        : "You are Annambhaṭṭa, the revered compiler and scholar of the Nyāya-Vaiśeṣika classic manual, the Tarka-saṅgraha. Act as an unyielding defender of the real existence of composite atoms, the objective external world, the eternal individual Atman, and the four valid instruments of knowledge (pratyakṣa, anumāna, upamāna, śabda). Use clear syllogistic counters.";

      const model = genAI.getGenerativeModel({
        model: "gemini-3.5-flash",
        systemInstruction: opponentInstruction,
      });

      // Map chat messages cleanly into structured Gemini multi-turn format arrays
      const geminiHistory = chatMessages
        .filter(msg => msg.id !== "sys-welcome")
        .map(msg => ({
          role: msg.sender === "user" ? "user" as const : "model" as const,
          parts: [{ text: msg.text }],
        }));

      const chatSession = model.startChat({ history: geminiHistory });
      const result = await chatSession.sendMessage(currentInput);
      const responseText = result.response.text();

      const oppMsg: ChatMessage = {
        id: `opp-${Date.now()}`,
        sender: "opponent",
        text: responseText || "I have contemplated your entry but declined to refute it immediately. Restate your claim.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setChatMessages((prev) => [...prev, oppMsg]);
    } catch (err: any) {
      console.error(err);
      setChatError(err.message || "Connection in the debate assembly engine failed.");
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="space-y-6" id="vada-vidya-module">
      
      {/* Top Toggle Controls */}
      <div className="flex bg-[#F5F2EA] p-1 rounded-none border-2 border-[#1A1A1A] inline-flex mb-2 flex-wrap gap-1">
        <button
          onClick={() => setActiveSubTab("analyzer")}
          className={`flex items-center gap-2 px-4 py-2.5 hover:text-white hover:bg-[#795548] font-sans text-xs font-bold rounded-none transition-all cursor-pointer ${
            activeSubTab === "analyzer" ? "bg-[#795548] text-white border-none font-black" : "text-[#1A1A1A]"
          }`}
        >
          <GitPullRequest className="w-4 h-4" />
          Nyāya Syllogism Analyst
        </button>
        <button
          onClick={() => setActiveSubTab("debate")}
          className={`flex items-center gap-2 px-4 py-2.5 hover:text-white hover:bg-[#795548] font-sans text-xs font-bold rounded-none transition-all cursor-pointer ${
            activeSubTab === "debate" ? "bg-[#795548] text-white border-none font-black" : "text-[#1A1A1A]"
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          Interactive Vāda assembly
        </button>
        <button
          onClick={() => setActiveSubTab("historyPath")}
          className={`flex items-center gap-2 px-4 py-2.5 hover:text-white hover:bg-[#795548] font-sans text-xs font-bold rounded-none transition-all cursor-pointer ${
            activeSubTab === "historyPath" ? "bg-[#795548] text-white border-none font-black" : "text-[#1A1A1A]"
          }`}
        >
          <GitBranch className="w-4 h-4" />
          Dialectical History Path
        </button>
        <button
          onClick={() => setActiveSubTab("visualizer")}
          className={`flex items-center gap-2 px-4 py-2.5 hover:text-white hover:bg-[#795548] font-sans text-xs font-bold rounded-none transition-all cursor-pointer ${
            activeSubTab === "visualizer" ? "bg-[#795548] text-white border-none font-black" : "text-[#1A1A1A]"
          }`}
        >
          <Compass className="w-4 h-4" />
          Syllogism Flow Visualizer
        </button>
        <button
          onClick={() => setActiveSubTab("panchanayaSamanvaya")}
          className={`flex items-center gap-2 px-4 py-2.5 hover:text-white hover:bg-[#795548] font-sans text-xs font-bold rounded-none transition-all cursor-pointer ${
            activeSubTab === "panchanayaSamanvaya" ? "bg-[#795548] text-white border-none font-black" : "text-[#1A1A1A]"
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          Pañcanaya-Samanvaya (पञ्चनयसमन्वयः)
        </button>
      </div>

      {/* ---------------------------------------------------- */}
      {/* Sub-tab 1: Logic Analyzer */}
      {/* ---------------------------------------------------- */}
      {activeSubTab === "analyzer" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* User inputs sidebar */}
          <div className="lg:col-span-12 xl:col-span-5 space-y-5">
            <div className="bg-white border-2 border-[#1A1A1A] p-5 rounded-none shadow-none space-y-4">
              <h3 className="text-base font-serif font-black text-[#3B2314] flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#795548]" />
                Syllogistic Dialectic Workspace
              </h3>

              {/* Presets */}
              <div className="space-y-2">
                <label className="text-[11px] font-black text-[#1A1A1A] uppercase tracking-widest block font-sans">
                  Select Fallacious/Perfect claims
                </label>
                <div className="flex flex-col gap-2">
                  {PRELOADED_ARGUMENTS.map((arg, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setArgumentInput(arg.text);
                        setAnalysisResponse(null);
                        setAnalyzerError(null);
                      }}
                      className="text-left text-xs bg-[#F5F2EA] hover:bg-[#795548] hover:text-white text-[#1A1A1A] border-2 border-[#1A1A1A] p-2.5 rounded-none transition-all font-sans font-bold cursor-pointer flex items-start gap-1.5"
                    >
                      <span>{arg.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Input */}
              <div className="space-y-2">
                <label className="text-[11px] font-black text-[#1A1A1A] uppercase tracking-widest block font-sans">
                  Formulate Your Logic Syllogism
                </label>
                <textarea
                  value={argumentInput}
                  onChange={(e) => setArgumentInput(e.target.value)}
                  placeholder="Paste or write your structured claim here (e.g. Mountain has fire because of smoke...)"
                  className="w-full h-36 bg-white text-[#1A1A1A] font-serif border-2 border-[#1A1A1A] rounded-none p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#795548]"
                />
              </div>

              <button
                onClick={() => handleAnalyzeArgument(argumentInput)}
                disabled={analyzerLoading || !argumentInput.trim()}
                className={`w-full flex items-center justify-center gap-2 text-white font-black py-2.5 px-4 rounded-none transition-all text-xs font-sans border-2 border-[#1A1A1A] cursor-pointer ${
                  analyzerLoading || !argumentInput.trim()
                    ? "bg-stone-200 text-stone-500 border-stone-300 pointer-events-none"
                    : "bg-[#795548] hover:bg-[#1A1A1A]"
                }`}
              >
                {analyzerLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Reviewing Parāmāṛśa (Syntactic Relation)...
                  </>
                ) : (
                  <>
                    <ShieldAlert className="w-3.5 h-3.5" />
                    Debugger Logical Fallacies (Hetvābhāsa)
                  </>
                )}
              </button>
            </div>

            {analyzerError && (
              <div className="bg-[#F5F2EA] border-2 border-[#1A1A1A] p-4 rounded-none flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-red-900 font-sans">Epistemological Oversight</h4>
                  <p className="text-xs text-red-750 mt-1 leading-relaxed font-sans">{analyzerError}</p>
                </div>
              </div>
            )}
          </div>

          {/* Analysis output panel */}
          <div className="lg:col-span-12 xl:col-span-7">
            {analysisResponse ? (
              <div className="bg-white border-2 border-[#1A1A1A] rounded-none p-6 shadow-none space-y-6">
                
                {/* Header */}
                <div className="flex items-center justify-between border-b-2 border-[#1A1A1A] pb-3">
                  <h4 className="text-sm font-black text-[#1A1A1A] uppercase tracking-wider font-sans flex items-center gap-2">
                    <Compass className="w-4 h-4 text-[#795548]" />
                    Dialectical Post-Mortem
                  </h4>
                  <span
                    className={`text-[10px] uppercase font-black tracking-widest px-3 py-1 rounded-none border-2 border-[#1A1A1A] ${
                      analysisResponse.validity === "perfect"
                        ? "bg-emerald-100 text-emerald-900"
                        : "bg-red-100 text-red-900"
                    }`}
                  >
                    Arg: {analysisResponse.validity === "perfect" ? "Siddhānta (Perfect Proof)" : "Duṣṭa (Defective Reason)"}
                  </span>
                </div>

                {/* Scholarly Analysis paragraph */}
                <div className="space-y-2">
                  <span className="text-[10px] font-black text-stone-500 tracking-wider block font-sans uppercase">
                    Logician's Decisive Critique
                  </span>
                  <div className="text-sm text-stone-800 font-sans leading-relaxed whitespace-pre-wrap">
                    {analysisResponse.scholarlyAnalysis}
                  </div>
                </div>

                {/* Counter Stroke / Refutation */}
                <div className="bg-[#F5F2EA] border-2 border-[#1A1A1A] p-4 rounded-none space-y-1">
                  <span className="text-[10px] font-black text-[#795548] uppercase tracking-widest block font-sans">
                    Sabhā Counter-Refutation (प्रतिपक्षी-खण्डनम्)
                  </span>
                  <p className="text-xs text-stone-800 italic font-sans leading-relaxed">
                    "{analysisResponse.refutation}"
                  </p>
                </div>

                {/* Five-step Syllogism map */}
                {analysisResponse.fivePartSyllogism && analysisResponse.fivePartSyllogism.length > 0 && (
                  <div className="border-t-2 border-[#1A1A1A] pt-5 space-y-3">
                    <span className="text-[10px] font-black text-stone-500 tracking-wider uppercase block font-sans">
                      Recovered Nyāya 5-Part Sequence
                    </span>
                    <div className="space-y-3">
                      {analysisResponse.fivePartSyllogism.map((step, idx) => (
                        <div key={idx} className="flex gap-2.5 items-start pl-2.5 border-l-4 border-[#795548]">
                          <div className="shrink-0">
                            <span className="text-[10px] font-black text-[#1A1A1A] bg-[#F5F2EA] px-2 py-0.5 rounded-none border-2 border-[#1A1A1A]">
                              {step.sanskritName}
                            </span>
                          </div>
                          <div className="text-xs font-sans text-[#1A1A1A]">
                            <strong>{step.name}</strong> &mdash; "{step.value}"
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* The 5 standard Fallacies Matrix */}
                {analysisResponse.fallacies && (
                  <div className="border-t-2 border-[#1A1A1A] pt-5 space-y-3">
                    <span className="text-[10px] font-black text-stone-500 tracking-wider uppercase block font-sans">
                      Fallacies Assessment Matrix (हेत्वाभास-मर्यादा)
                    </span>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {analysisResponse.fallacies.map((fal, i) => (
                        <div
                          key={i}
                          className={`p-3.5 rounded-none border-2 border-[#1A1A1A] flex items-start gap-2.5 ${
                            fal.detected
                              ? "bg-red-50/50 text-red-950"
                              : "bg-[#F5F2EA]/20 text-stone-705"
                          }`}
                        >
                          {fal.detected ? (
                            <XCircle className="w-4 tracking-tighter h-4 text-red-600 shrink-0 mt-0.5" />
                          ) : (
                            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          )}
                          <div className="text-xs">
                            <div className="font-bold flex items-center gap-1 text-[#1A1A1A]">
                              <span className="font-serif font-black">{fal.sanskritName}</span>
                              <span className="font-sans font-medium text-[10px]">({fal.fallacyName})</span>
                            </div>
                            <p className="text-[10px] text-stone-550 italic mt-0.5 mb-1.5 font-sans">{fal.description}</p>
                            {fal.detected && (
                              <p className="text-[11px] text-red-950 bg-white p-2 rounded-none leading-relaxed border-2 border-red-200 font-sans mt-0.5">
                                {fal.explanation}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            ) : (
              <div className="bg-[#F5F2EA] rounded-none border-2 border-dashed border-[#1A1A1A] py-24 text-center">
                <GitPullRequest className="w-8 h-8 text-[#795548] mx-auto" />
                <p className="text-sm font-serif text-[#1A1A1A] font-bold mt-2">
                  Paste an argument or compile one from library templates, then trigger the debunker.
                </p>
                <p className="text-xs text-stone-550 mt-1 font-sans">
                  The Referee scans and breaks down statements into the 5 parameters of proper logic (hetu).
                </p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* Sub-tab 2: Mock Debate */}
      {/* ---------------------------------------------------- */}
      {activeSubTab === "debate" && (
        <div className="bg-white border-2 border-[#1A1A1A] rounded-none p-6 shadow-none space-y-6 animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-[#1A1A1A] pb-4">
            <div>
              <h3 className="text-base font-serif font-black text-[#3B2314] flex items-center gap-2">
                <Users className="w-5 h-5 text-[#795548]" />
                Sabhā Debate Council (शास्त्रार्थ-सभा)
              </h3>
              <p className="text-xs text-stone-550 font-sans mt-0.5">
                Engage in highly respectful intellectual dispute with masters of different traditions. Use classical terminology and formal proofs to challenge their assertions.
              </p>
            </div>

            {/* Select opponent */}
            <div className="flex items-center gap-2 bg-[#F5F2EA] p-1.5 rounded-none border-2 border-[#1A1A1A]">
              <span className="text-[10px] font-black text-[#1A1A1A] px-2 font-sans tracking-wider">SELECT OPPONENT:</span>
              <button
                onClick={() => setOpponentType("buddhist")}
                className={`px-3 py-1 text-xs font-black rounded-none border border-[#1A1A1A] transition-all cursor-pointer ${
                  opponentType === "buddhist"
                    ? "bg-[#795548] text-white"
                    : "text-stone-700 hover:text-stone-900 bg-white"
                }`}
              >
                Dignāga (Buddhist)
              </button>
              <button
                onClick={() => setOpponentType("nyaya-expert")}
                className={`px-3 py-1 text-xs font-black rounded-none border border-[#1A1A1A] transition-all cursor-pointer ${
                  opponentType === "nyaya-expert"
                    ? "bg-[#1A1A1A] text-white"
                    : "text-stone-700 hover:text-stone-900 bg-white"
                }`}
              >
                Annambhaṭṭa (Nyāya Expert)
              </button>
            </div>
          </div>

          {/* Interactive Chat Arena */}
          <div className="flex flex-col h-[500px] border-2 border-[#1A1A1A] rounded-none bg-[#F5F2EA]/10 overflow-hidden">
            
            {/* Thread of Message */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {chatMessages.map((msg) => {
                const isUser = msg.sender === "user";
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col max-w-[80%] ${isUser ? "ml-auto items-end" : "mr-auto items-start"}`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[10px] font-black text-stone-500 capitalize font-sans">
                        {isUser ? "You (Siddhāntin)" : opponentType === "buddhist" ? "Buddhist Logician (Dignāga)" : "Nyāya Tutor (Annambhaṭṭa)"}
                      </span>
                      <span className="text-[9px] text-stone-400 font-sans">{msg.timestamp}</span>
                    </div>

                    {/* Integrated ReactMarkdown container targeting child tags layout */}
                    <div
                      className={`p-3.5 border-2 border-[#1A1A1A] text-sm leading-relaxed font-sans rounded-none ${
                        isUser
                          ? "bg-[#795548] text-white shadow-none"
                          : "bg-white text-[#1A1A1A] shadow-none font-serif"
                      }`}
                    >
                      <ReactMarkdown
                        components={{
                          h1: ({ ...props }) => <h1 className="text-lg font-black my-3 block text-[#3B2314]" {...props} />,
                          h2: ({ ...props }) => <h2 className="text-md font-black my-2.5 block text-[#3B2314]" {...props} />,
                          h3: ({ ...props }) => <h3 className="text-base font-bold my-2 block text-[#3B2314]" {...props} />,
                          ul: ({ ...props }) => <ul className="list-disc pl-5 my-2 space-y-1.5" {...props} />,
                          ol: ({ ...props }) => <ol className="list-decimal pl-5 my-2 space-y-1.5" {...props} />,
                          li: ({ ...props }) => <li className="list-item" {...props} />,
                          strong: ({ ...props }) => <strong className={isUser ? "font-black underline decoration-stone-200" : "font-black text-[#795548]"} {...props} />,
                          p: ({ ...props }) => <p className="mb-2 last:mb-0 leading-relaxed" {...props} />,
                        }}
                      >
                        {msg.text}
                      </ReactMarkdown>
                    </div>
                  </div>
                );
              })}

              {chatLoading && (
                <div className="flex items-center gap-2 bg-[#F5F2EA] border-2 border-[#1A1A1A] text-stone-650 rounded-none p-3 self-start max-w-[55%]">
                  <RefreshCw className="w-4 h-4 animate-spin text-[#795548]" />
                  <span className="text-xs font-sans italic">Opponent is meditating on raw syllogistics...</span>
                </div>
              )}

              {chatError && (
                <div className="p-3 bg-red-100 border-2 border-red-400 text-red-950 rounded-none text-xs font-sans self-center text-center">
                  Error during assembly transmission: {chatError}
                </div>
              )}

              <div ref={endOfChatRef} />
            </div>

            {/* Input Bar */}
            <div className="p-3.5 bg-white border-t-2 border-[#1A1A1A] flex gap-3">
              <input
                type="text"
                placeholder="Declare your thesis according to pramāṇa rules..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSendChatMessage();
                }}
                disabled={chatLoading}
                className="flex-1 bg-white text-[#1A1A1A] border-2 border-[#1A1A1A] rounded-none px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#795548]"
              />
              <button
                onClick={handleSendChatMessage}
                disabled={chatLoading || !chatInput.trim()}
                className={`px-4 py-2 text-xs font-black rounded-none text-white font-sans flex items-center gap-1.5 transition-all border-2 border-[#1A1A1A] cursor-pointer ${
                  chatLoading || !chatInput.trim()
                    ? "bg-stone-200 text-stone-500 border-stone-300 pointer-events-none"
                    : "bg-[#795548] hover:bg-[#1A1A1A]"
                }`}
              >
                <span>Send Argument</span>
                <Send className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* Sub-tab 3: Dialectical History Path */}
      {/* ---------------------------------------------------- */}
      {activeSubTab === "historyPath" && (
        <DialecticalHistoryPath
          chatMessages={chatMessages}
          opponentType={opponentType}
          targetScript={targetScript}
        />
      )}

      {/* ---------------------------------------------------- */}
      {/* Sub-tab 4: Syllogism Flow Visualizer */}
      {/* ---------------------------------------------------- */}
      {activeSubTab === "visualizer" && (
        <NyayaSyllogismD3 />
      )}

      {/* ---------------------------------------------------- */}
      {/* Sub-tab 5: Pañcanaya-Samanvaya Synthesis */}
      {/* ---------------------------------------------------- */}
      {activeSubTab === "panchanayaSamanvaya" && (
        <div className="space-y-6" id="panchanaya-samanvaya-panel">
          <div className="bg-white border-2 border-[#1A1A1A] p-6 rounded-none shadow-none space-y-4">
            <div className="border-b-2 border-stone-100 pb-4">
              <h3 className="text-xl font-serif font-black text-[#3B2314] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-600" />
                Pañcanaya-Samanvaya (पञ्चनयसमन्वयः)
              </h3>
              <p className="text-xs text-stone-600 mt-1 font-sans leading-relaxed">
                The classical Jaina dialectic of non-one-sidedness (<strong>Anekāntavāda</strong>). Every philosophical position is a partial viewpoint (<em>Naya</em>). By synthesizing opposite claims through five standard standpoints, we transcend ideological conflicts and discover harmonious synthesis.
              </p>
            </div>

            {/* Presets Grid */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#1A1A1A] uppercase tracking-widest block font-sans">
                Select a Classical Philosophical Dispute
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {SAMANVAYA_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSamanvayaThesisA(preset.thesisA);
                      setSamanvayaThesisB(preset.thesisB);
                      setSamanvayaResult(null);
                      setSamanvayaError(null);
                    }}
                    className="text-left text-xs bg-[#F5F2EA] hover:bg-[#795548] hover:text-white text-[#1A1A1A] border-2 border-[#1A1A1A] p-3 rounded-none transition-all font-sans font-bold cursor-pointer"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Inputs Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-2">
                <label className="text-xs font-black text-[#795548] uppercase tracking-wider block font-sans">
                  Assertion A (e.g., Thesis/Substance View)
                </label>
                <textarea
                  value={samanvayaThesisA}
                  onChange={(e) => setSamanvayaThesisA(e.target.value)}
                  placeholder="Enter the first philosophical position..."
                  className="w-full h-24 bg-white text-[#1A1A1A] border-2 border-[#1A1A1A] p-3 rounded-none text-xs font-sans focus:outline-none focus:ring-2 focus:ring-[#795548] leading-relaxed resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-[#795548] uppercase tracking-wider block font-sans">
                  Assertion B (e.g., Antithesis/Modal View)
                </label>
                <textarea
                  value={samanvayaThesisB}
                  onChange={(e) => setSamanvayaThesisB(e.target.value)}
                  placeholder="Enter the opposing or complementary position..."
                  className="w-full h-24 bg-white text-[#1A1A1A] border-2 border-[#1A1A1A] p-3 rounded-none text-xs font-sans focus:outline-none focus:ring-2 focus:ring-[#795548] leading-relaxed resize-none"
                />
              </div>
            </div>

            {/* Action Button */}
            <div className="flex justify-center pt-2">
              <button
                onClick={handleSamanvayaSubmit}
                disabled={samanvayaLoading || !samanvayaThesisA.trim() || !samanvayaThesisB.trim()}
                className={`px-6 py-3 text-xs font-black rounded-none text-white font-sans flex items-center gap-2 transition-all border-2 border-[#1A1A1A] cursor-pointer ${
                  samanvayaLoading || !samanvayaThesisA.trim() || !samanvayaThesisB.trim()
                    ? "bg-stone-200 text-stone-500 border-stone-300 pointer-events-none"
                    : "bg-[#795548] hover:bg-[#1A1A1A]"
                }`}
              >
                {samanvayaLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Synthesizing Perspectives...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>SYNTHESIZE VIA PAÑCANAYA (पञ्चनयसमन्वयः)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {samanvayaError && (
            <div className="p-4 bg-red-100 border-2 border-red-400 text-red-950 rounded-none text-xs font-sans text-center">
              Reconciliation error: {samanvayaError}
            </div>
          )}

          {/* Results Layout */}
          {samanvayaResult && (
            <div className="space-y-6">
              {/* Summary Card */}
              <div className="bg-[#FAF8F5] border-2 border-[#1A1A1A] p-6 rounded-none space-y-3">
                <div className="flex items-center gap-2 border-b-2 border-[#1A1A1A] pb-2">
                  <div className="bg-[#795548] text-white text-[10px] font-black px-2 py-0.5 uppercase font-sans">
                    Anekāntika Synthesis
                  </div>
                  <h4 className="text-md font-serif font-black text-[#3B2314]">
                    Reconciliation Summary
                  </h4>
                </div>
                <p className="text-sm font-serif text-stone-800 leading-relaxed italic">
                  {samanvayaResult.synthesisSummary}
                </p>
              </div>

              {/* The Five Nayas Grid */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {samanvayaResult.nayas?.map((naya: any, idx: number) => {
                  return (
                    <div
                      key={idx}
                      className="bg-white border-2 border-[#1A1A1A] p-4 rounded-none hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="border-b border-stone-200 pb-2">
                          <span className="text-[10px] font-sans font-black text-stone-400 uppercase tracking-wider block">
                            Naya {idx + 1}
                          </span>
                          <h5 className="text-xs font-sans font-black text-[#1A1A1A] mt-0.5 leading-tight">
                            {naya.name?.split(" (")[0]}
                          </h5>
                          <span className="text-[11px] text-[#795548] font-serif font-bold block mt-0.5">
                            {naya.sanskrit}
                          </span>
                        </div>
                        <p className="text-[11px] font-sans text-stone-500 italic leading-snug">
                          {naya.description}
                        </p>
                        <p className="text-xs font-serif text-[#1A1A1A] leading-relaxed pt-1">
                          {naya.analysis}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
