/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { TranslationResponse, SyllogismPart } from "../types";
import { BookOpen, RefreshCw, Sparkles, AlertCircle, Bookmark, Compass, GitCommit, Volume2, Pause, Play } from "lucide-react";

interface AnuvadaProps {
  initialText: string;
}

export default function Anuvada({ initialText }: AnuvadaProps) {
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<TranslationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Speech synthesis states
  const [playingText, setPlayingText] = useState<"original" | "translation" | "exegesis" | "input" | null>(null);

  useEffect(() => {
    if (initialText) {
      setInputText(initialText);
    }
  }, [initialText]);

  useEffect(() => {
    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleSpeak = (text: string, type: "original" | "translation" | "exegesis" | "input") => {
    if ("speechSynthesis" in window) {
      if (playingText === type) {
        window.speechSynthesis.cancel();
        setPlayingText(null);
        return;
      }
      
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      if (type === "translation" || type === "exegesis") {
        utterance.lang = "en-US";
        utterance.rate = 0.9;
      } else {
        utterance.lang = "hi-IN"; // optimal for Devanagari Sanskrit phonetic pronunciations
        utterance.rate = 0.8; // scholarly chanting pace
      }
      
      utterance.onend = () => {
        setPlayingText(null);
      };
      utterance.onerror = () => {
        setPlayingText(null);
      };
      
      window.speechSynthesis.speak(utterance);
      setPlayingText(type);
    } else {
      alert("TTS voice synthesis is not supported on this browser.");
    }
  };

  const PRESETS = [
    {
      name: "Tarkasaṃgrahaḥ opening (Real purpose)",
      text: "निधाय हृदि विश्वेशं विधाय गुरुवन्दनम् । बालानां सुखबोधाय क्रियते तर्कसङ्ग्रहः ॥",
    },
    {
      name: "Nyāya Sūtram 1.1.1 (Foundational 16 topics)",
      text: "प्रमाणप्रमेयसंशयप्रयोजनदृष्टान्तसिद्धान्तावयवतर्कनिर्णयवादजल्पवितण्डाहेत्वाभासच्छलजातिनिग्रहस्थानानां तत्त्वज्ञानान्निःश्रेयसाधिगमः ॥ १.१.१ ॥",
    },
    {
      name: "Classical Smoke-Fire Syllogism",
      text: "पर्वतो वह्निमान् धूमवत्त्वात् । यो यो धूमवान् स स वह्निमान् यथा महानसः । तथा चायम् । तस्मात्तथा ॥",
    }
  ];

  const handleTranslate = async (textToProcess: string) => {
    if (!textToProcess.trim()) return;
    if (!navigator.onLine) {
      setError("You are currently offline. AI-powered translation and exegesis require an active internet connection to reach our Gemini server-side models. Please reconnect and try again.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/translate-exegesis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ originalText: textToProcess }),
      });
      if (!res.ok) {
        let serverErrorMsg = "";
        try {
          const errData = await res.json();
          serverErrorMsg = errData.error || errData.message || "";
        } catch (_) {}
        throw new Error(serverErrorMsg || "Unable to contact translation daemon. Verify Node server and API credentials.");
      }
      const data: TranslationResponse = await res.json();
      setResponse(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during translation exegesis.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8" id="anuvada-module">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Input Section with ultra-classy manuscript style */}
        <div className="lg:col-span-12 xl:col-span-5 space-y-5">
          <div className="bg-white border-2 border-[#1A1A1A] p-5 rounded-none shadow-none space-y-4 manuscript-margin-line pl-6 md:pl-10 academic-blueprint-grid classy-transition">
            <h3 className="text-base font-serif font-black text-[#3B2314] flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#795548]" />
              Sūtra Input & Classical Presets
            </h3>

            {/* Presets Grid */}
            <div className="space-y-2 animate-fade-in">
              <label className="text-[11px] font-black text-[#1A1A1A] tracking-widest uppercase block">
                Select Aphorisms & Treatises
              </label>
              <div className="flex flex-col gap-2">
                {PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInputText(p.text);
                      setResponse(null);
                      setError(null);
                    }}
                    className="text-left text-xs bg-[#F5F2EA] hover:bg-[#795548] hover:text-white text-[#1A1A1A] border-2 border-[#1A1A1A] p-2.5 rounded-none font-bold transition-all font-sans flex items-start gap-1.5 cursor-pointer cool-3d-gently"
                  >
                    <Bookmark className="w-3.5 h-3.5 mt-0.5 text-[#1A1A1A] shrink-0" />
                    <span>{p.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Text Entry */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-black text-[#1A1A1A] tracking-widest uppercase block">
                  Type Sanskrit Sūtra / Commentary Block
                </label>
                {inputText.trim() && (
                  <button
                    onClick={() => handleSpeak(inputText, "input")}
                    className={`text-[10px] uppercase font-black tracking-wide border px-2 py-0.5 rounded-none flex items-center gap-1 cursor-pointer transition-all ${
                      playingText === "input" ? "bg-[#1A1A1A] text-white border-[#1A1A1A]" : "bg-[#F5F2EA] text-stone-600 border-stone-300 hover:border-[#1A1A1A] hover:bg-white"
                    }`}
                    title="Listen to current input Sanskrit"
                  >
                    {playingText === "input" ? (
                      <>
                        <Pause className="w-3 h-3 text-white" />
                        <span>Stop</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3 h-3 text-[#795548]" />
                        <span>Listen Sūtra</span>
                      </>
                    )}
                  </button>
                )}
              </div>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="यतोऽभ्युदयनिःश्रेयससिद्धिः स धर्मः..."
                className="w-full h-32 bg-white text-[#1A1A1A] border-2 border-[#1A1A1A] rounded-none p-3 text-base font-serif focus:outline-none focus:ring-2 focus:ring-[#795548]"
              />
            </div>

            <button
              onClick={() => handleTranslate(inputText)}
              disabled={loading || !inputText.trim()}
              className={`w-full flex items-center justify-center gap-2 text-white font-black py-2.5 px-4 rounded-none transition-all text-xs font-sans border-2 border-[#1A1A1A] cursor-pointer cool-3d-gently ${
                loading || !inputText.trim()
                  ? "bg-stone-200 text-stone-500 border-stone-300 pointer-events-none opacity-80"
                  : "bg-[#795548] hover:bg-[#1A1A1A]"
              }`}
            >
              {loading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Deconstructing Sanskrit Morphology...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  Apply Academic Translation & Exegesis
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="bg-[#F5F2EA] border-2 border-[#1A1A1A] p-4 rounded-none flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-650 mt-0.5 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-red-900 font-sans">Translation Failure</h4>
                <p className="text-xs text-red-700 mt-1 leading-relaxed font-sans">{error}</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Output Section */}
        <div className="lg:col-span-12 xl:col-span-7 space-y-6">
          {response ? (
            <div className="bg-white border-2 border-[#1A1A1A] rounded-none p-6 shadow-none space-y-6">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b-2 border-[#1A1A1A] pb-3 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#795548]" />
                  <h4 className="text-sm font-black text-[#1A1A1A] uppercase tracking-wider font-sans">
                    Precision Scholars Dissection
                  </h4>
                </div>
                <button
                  onClick={() => handleSpeak(inputText, "original")}
                  className={`text-[10px] uppercase font-black tracking-wide border px-3 py-1.5 rounded-none flex items-center gap-1.5 cursor-pointer transition-all ${
                    playingText === "original" ? "bg-[#1A1A1A] text-white border-[#1A1A1A]" : "bg-white text-stone-605 border-stone-300 hover:border-[#1A1A1A] hover:bg-[#F5F2EA]"
                  }`}
                  title="Listen to original Sanskrit recitation"
                >
                  {playingText === "original" ? (
                    <>
                      <Pause className="w-3.5 h-3.5 text-white" />
                      <span>Stop Chant</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-[#795548]" />
                      <span>Chant Original Sūtra</span>
                    </>
                  )}
                </button>
              </div>

              {/* Translation Display */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-stone-500 tracking-wider uppercase block font-sans">
                    English Academic Translation
                  </span>
                  <button
                    onClick={() => handleSpeak(response.translation, "translation")}
                    className={`text-[10px] uppercase font-black tracking-wide border px-2 py-0.5 rounded-none flex items-center gap-1 cursor-pointer transition-all ${
                      playingText === "translation" ? "bg-[#1A1A1A] text-white border-[#1A1A1A]" : "bg-white text-stone-606 border-stone-300 hover:border-[#1A1A1A] hover:bg-[#F5F2EA]"
                    }`}
                    title="Listen to translation"
                  >
                    {playingText === "translation" ? (
                      <>
                        <Pause className="w-3 h-3 text-white" />
                        <span>Stop</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3 h-3 text-[#795548]" />
                        <span>Listen</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-base text-[#1A1A1A] bg-[#F5F2EA] border-2 border-[#1A1A1A] p-4 rounded-none font-sans leading-relaxed italic font-bold">
                  "{response.translation}"
                </p>
              </div>

              {/* Philosophical Exegesis */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-[#795548] tracking-wider uppercase block font-sans">
                    Treatise Exegesis & Contextual Unpacking
                  </span>
                  <button
                    onClick={() => handleSpeak(response.exegesis, "exegesis")}
                    className={`text-[10px] uppercase font-black tracking-wide border px-2 py-0.5 rounded-none flex items-center gap-1 cursor-pointer transition-all ${
                      playingText === "exegesis" ? "bg-[#1A1A1A] text-white border-[#1A1A1A]" : "bg-white text-stone-606 border-stone-300 hover:border-[#1A1A1A] hover:bg-[#F5F2EA]"
                    }`}
                    title="Listen to exegesis commentary"
                  >
                    {playingText === "exegesis" ? (
                      <>
                        <Pause className="w-3 h-3 text-white" />
                        <span>Stop</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3 h-3 text-[#795548]" />
                        <span>Listen Commentary</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-sm text-stone-800 font-sans leading-relaxed whitespace-pre-wrap">
                  {response.exegesis}
                </p>
              </div>

              {/* Glossary of Technical Terms */}
              {response.terms && response.terms.length > 0 && (
                <div className="space-y-3 pt-2">
                  <span className="text-[10px] font-black text-stone-500 tracking-wider uppercase block font-sans">
                    Grammatical & Epistemological Glossary (पारिभाषिक-पदावली)
                  </span>
                  <div className="border-2 border-[#1A1A1A] rounded-none overflow-hidden bg-white">
                    <table className="min-w-full divide-y divide-[#1A1A1A] text-left text-xs font-sans">
                      <thead className="bg-[#1A1A1A]">
                        <tr>
                          <th className="py-2.5 px-4 font-bold text-white border-r border-[#1A1A1A] uppercase">Term</th>
                          <th className="py-2.5 px-4 font-bold text-[#795548] border-r border-[#1A1A1A] uppercase">IAST Transliteration</th>
                          <th className="py-2.5 px-4 font-bold text-white uppercase">Philosophical Concept</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1A1A1A]">
                        {response.terms.map((term, i) => (
                          <tr key={i} className="hover:bg-[#795548]/5 transition-colors">
                            <td className="py-2.5 px-4 font-serif text-[#795548] text-sm font-black border-r border-[#1A1A1A]">{term.term}</td>
                            <td className="py-2.5 px-4 font-mono text-[#1A1A1A] italic border-r border-[#1A1A1A]">{term.transliteration}</td>
                            <td className="py-2.5 px-4 text-stone-705 leading-relaxed">{term.definition}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* standard 5-part Nyāya structure visualization */}
              {response.syllogism && response.syllogism.length > 0 && (
                <div className="space-y-4 border-t-2 border-[#1A1A1A] pt-5">
                  <div>
                    <span className="text-[10px] font-black text-[#795548] tracking-wider uppercase block font-sans">
                      Discovered Syllogistic Pattern (पञ्चावयव-वाक्य)
                    </span>
                    <p className="text-xs text-stone-550 font-sans mt-1">
                      This text asserts a formal logical demonstration. Standardized below onto Gautama's five classic syllogistic elements:
                    </p>
                  </div>
                  
                  <div className="space-y-4 pt-1">
                    {response.syllogism.map((step, index) => (
                      <div
                        key={index}
                        className="flex flex-col md:flex-row items-start gap-4 bg-[#F5F2EA] hover:bg-[#795548]/5 border-2 border-[#1A1A1A] rounded-none p-4 transition-all"
                      >
                        <div className="md:w-1/4">
                          <span className="text-[10px] font-black text-[#795548] block text-nowrap select-none font-sans uppercase">
                            Step {index + 1}: {(step.name || "").split(" ")[0] || "Step"}
                          </span>
                          <span className="text-xs font-serif italic text-stone-800 block leading-tight font-bold">
                            {step.sanskritName}
                          </span>
                        </div>
                        <div className="md:w-3/4 space-y-1">
                           <p className="text-xs text-stone-705 leading-relaxed font-sans">{step.description}</p>
                           <p className="text-sm font-serif text-[#1A1A1A] border-l-4 border-[#795548] pl-2 mt-1.5 py-0.5 font-black italic bg-white p-2">
                            "{step.value}"
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-[#F5F2EA] rounded-none border-2 border-[#1A1A1A] py-24 text-center">
              <BookOpen className="w-8 h-8 text-[#795548] mx-auto animate-pulse" />
              <p className="text-sm font-serif text-[#1A1A1A] font-bold mt-3">
                Load a classical aphorism (sūtra) on the left layout to review its academic exegesis.
              </p>
              <p className="text-xs text-[#1A1A1A] mt-1 font-sans">
                The engine uncovers compound words (Sandhi), tracks semantic terms, and builds five-step syllogisms.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
