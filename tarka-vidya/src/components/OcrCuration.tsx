/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { OcrCurationResponse, OcrCorrection } from "../types";
import { Sparkles, RefreshCw, Layers, CheckCircle2, AlertTriangle, FileText, Globe, Volume2, Pause, Play, Upload, X, FileUp, Mic, MicOff } from "lucide-react";

interface OcrCurationProps {
  initialText: string;
}

export default function OcrCuration({ initialText }: OcrCurationProps) {
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [curationResponse, setCurationResponse] = useState<OcrCurationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Manuscript File Upload states
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [manuscriptTranscribeSuccess, setManuscriptTranscribeSuccess] = useState(false);
  
  // Speech synthesis states
  const [playingText, setPlayingText] = useState<"original" | "curated" | "input" | null>(null);

  // Speech Recognition (Dictation) states
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [dictationLang, setDictationLang] = useState<"sa-IN" | "hi-IN">("sa-IN");

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
    }
  }, []);

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

  // Drag and Drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    if (!file) return;
    
    // Accept images and PDF
    if (!file.type.match("image.*") && file.type !== "application/pdf") {
      setError("Supported file types are images (PNG, JPEG, WebP) and PDF documents.");
      return;
    }
    
    setSelectedFile(file);
    setManuscriptTranscribeSuccess(false);
    setError(null);
    
    if (file.type.match("image.*")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    setManuscriptTranscribeSuccess(false);
  };

  const handleTranscribeManuscript = async () => {
    if (!selectedFile) return;
    if (!navigator.onLine) {
      setError("You are currently offline. AI-powered manuscript transcription requires an internet connection to reach our Gemini server-side models. Please reconnect and try again.");
      return;
    }
    setIsTranscribing(true);
    setError(null);
    setManuscriptTranscribeSuccess(false);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const base64withPrefix = reader.result as string;
          const commaIndex = base64withPrefix.indexOf(",");
          const fileDataBase64 = commaIndex !== -1 ? base64withPrefix.substring(commaIndex + 1) : base64withPrefix;
          
          const response = await fetch("/api/transcribe-manuscript", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              fileData: fileDataBase64,
              mimeType: selectedFile.type || "image/jpeg"
            })
          });
          
          if (!response.ok) {
            let serverErrorMsg = "";
            try {
              const errData = await response.json();
              serverErrorMsg = errData.error || errData.message || "";
            } catch (_) {}
            throw new Error(serverErrorMsg || "Sanskrit manuscript transcription request failed.");
          }
          const data = await response.json();
          setInputText(data.transcribedText || "");
          setManuscriptTranscribeSuccess(true);
        } catch (innerErr: any) {
          setError(innerErr.message || "Decoding error during manuscript processing.");
        } finally {
          setIsTranscribing(false);
        }
      };
      reader.readAsDataURL(selectedFile);
    } catch (e: any) {
      console.error(e);
      setError("Could not read manuscript file.");
      setIsTranscribing(false);
    }
  };

  const handleSpeak = (text: string, type: "original" | "curated" | "input") => {
    if ("speechSynthesis" in window) {
      if (playingText === type) {
        window.speechSynthesis.cancel();
        setPlayingText(null);
        return;
      }
      
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "hi-IN"; // Set to standard Sanskrit/Hindi locale for correct pronunciation of Devanagari text
      utterance.rate = 0.8; // Standard academic chanting pace
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

  const handleToggleListening = () => {
    if (!speechSupported) {
      setError("Speech recognition is not supported in this browser. Please use a browser like Chrome, Safari, or Microsoft Edge.");
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (isListening) {
      if (recognition) {
        recognition.stop();
      }
      setIsListening(false);
      return;
    }

    try {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = dictationLang;

      let finalTranscript = "";
      const baseText = inputText.trim() ? inputText + " " : "";

      rec.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      rec.onerror = (e: any) => {
        console.error("Speech recognition error", e);
        if (e.error === "not-allowed") {
          setError("Microphone permission denied. To enable dictation, please click the lock icon in your address bar and allow microphone permissions, or try opening this app in a new tab.");
        } else if (e.error === "no-speech") {
          // Keep active or stop gracefully
        } else {
          setError(`Voice recognition encountered an issue: ${e.error}`);
        }
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      rec.onresult = (event: any) => {
        let interimTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        
        const currentAddition = finalTranscript + interimTranscript;
        setInputText(baseText + currentAddition);
      };

      rec.start();
      setRecognition(rec);
    } catch (err: any) {
      console.error(err);
      setError("Failed to initialize standard speech engine.");
      setIsListening(false);
    }
  };

  // Prest lists for immediate curation
  const PRESETS = [
    {
      name: "Tarkasaṃgrahaḥ ontological list typos",
      text: "द्रव्यगुनकंमसामान्यविशेशसमवायाभावाः सप्तपदार्थाः । तत्र द्रव्यानी पृथिव्यापतेजोवाय्वाकाशकालदिगात्ममनांसि नवैव ॥",
    },
    {
      name: "Nyāya Sūtram opening OCR glitches",
      text: "प्रमानप्रमेयसंशयप्रयोजनदृश्तान्तसिद्धान्तावयवतर्कनिर्नयवादजल्पवितण्डाहेत्वाभासछलजातिनिग्रहस्थानानां तत्वज्ञानात् निश्रेयसाधिगमः ॥",
    },
    {
      name: "Vaiśeṣika Sūtram dharma typos",
      text: "अथातो धमीं व्याख्यस्यामः । यतोऽभ्युदयनीश्रेयससिद्धिः स धर्म् ॥",
    },
  ];

  const handleCuration = async (textToProcess: string) => {
    if (!textToProcess.trim()) return;
    if (!navigator.onLine) {
      setError("You are currently offline. AI-powered OCR corrections require an active internet connection to communicate with our server-side models. In the meantime, you can continue to use the offline library, search features, and interactive syllabus.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/curate-ocr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawText: textToProcess }),
      });
      if (!response.ok) {
        let serverErrorMsg = "";
        try {
          const errData = await response.json();
          serverErrorMsg = errData.error || errData.message || "";
        } catch (_) {}
        throw new Error(serverErrorMsg || "Failed to correct OCR. Please check if your server and API keys are functioning.");
      }
      const data: OcrCurationResponse = await response.json();
      setCurationResponse(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during manuscript curation.");
    } finally {
      setLoading(false);
    }
  };

  // Helper to highlight parts in original text based on corrections
  const renderHighlightedOriginal = () => {
    if (!curationResponse) return inputText;
    let text = curationResponse.rawText || "";
    
    // Sort corrections by length of original token desc to avoid partial replacement bugs
    const sortedCorrections = [...curationResponse.corrections].sort(
      (a, b) => b.original.length - a.original.length
    );

    // Simple textual highlighting
    return (
      <p className="font-serif leading-relaxed text-[#1A1A1A] text-lg whitespace-pre-wrap">
        {text.split(/(\s+)/).map((segment, index) => {
          const correction = sortedCorrections.find(
            (c) => segment.includes(c.original) || c.original.includes(segment)
          );
          if (correction && segment.trim()) {
            return (
              <span
                key={index}
                className="bg-[#795548]/10 text-red-900 border-b-2 border-red-500 px-1 rounded-none transition-colors group relative cursor-help"
                title={`Corrected to: ${correction.corrected}`}
              >
                {segment}
              </span>
            );
          }
          return <span key={index}>{segment}</span>;
        })}
      </p>
    );
  };

  // Helper to render corrected text with bracketed corrections e.g. [corrected from: X]
  const renderCorrectedText = () => {
    if (!curationResponse) return "";
    let text = curationResponse.correctedText || "";
    return (
      <div className="space-y-4">
        <p className="font-serif leading-relaxed text-[#1A1A1A] text-xl whitespace-pre-wrap bg-[#F2FAF4] p-5 border border-emerald-100/50 rounded-none border-2 border-[#1A1A1A]">
          {text}
        </p>
        <div className="text-xs text-stone-705 bg-[#F5F2EA] p-3 rounded-none border-2 border-[#1A1A1A] font-sans">
          <strong>Scholarly Notation Format (Bracketed Curation):</strong>
          <p className="mt-1">
            {text.split(/(\s+)/).map((segment, index) => {
              const correction = curationResponse.corrections.find(
                (c) => segment.includes(c.corrected) || c.corrected.includes(segment)
              );
              if (correction && segment.trim()) {
                return (
                  <span key={index} className="font-serif font-bold text-emerald-800">
                    {segment} <span className="text-[10px] text-stone-550 font-sans font-normal">[{correction.corrected} &larr; {correction.original}]</span>{" "}
                  </span>
                );
              }
              return <span key={index} className="font-serif">{segment} </span>;
            })}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8" id="ocr-curation-module">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Input panel */}
        <div className="lg:col-span-12 xl:col-span-5 space-y-5">
          <div className="bg-white border-2 border-[#1A1A1A] p-5 rounded-none shadow-none space-y-4">
            <h3 className="text-base font-serif font-bold text-[#3B2314] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#795548]" />
              Sodhanayogya: Manuscript Text Input
            </h3>
            
            {/* Presets */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-[#1A1A1A] uppercase tracking-widest block font-sans">
                Load Glitched Presets & OCR Scans
              </label>
              <div className="flex flex-col gap-2">
                {PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInputText(p.text);
                      setCurationResponse(null);
                      setError(null);
                    }}
                    className="text-left text-xs bg-[#F5F2EA] hover:bg-[#795548] hover:text-white text-[#1A1A1A] border-2 border-[#1A1A1A] p-2.5 rounded-none transition-all font-sans font-bold flex items-start gap-1.5 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 mt-0.5 text-[#1A1A1A] shrink-0" />
                    <span>{p.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Manuscript Drag-and-Drop / PDF Copy Uploader */}
            <div className="space-y-2 pt-2 border-t border-stone-250">
              <label className="text-[11px] font-black text-[#1A1A1A] uppercase tracking-widest block font-sans flex items-center justify-between">
                <span>Manuscript File / Handwritten Copy</span>
                <span className="text-[9px] text-[#795548] font-mono font-bold">PDF, PNG, JPEG, WebP</span>
              </label>
              
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-none p-4 text-center transition-all relative ${
                  dragActive
                    ? "border-[#795548] bg-[#795548]/5"
                    : "border-stone-300 bg-white hover:border-[#1A1A1A]"
                }`}
              >
                <input
                  type="file"
                  id="manuscript-file-input"
                  onChange={handleFileChange}
                  accept="image/*,application/pdf"
                  className="hidden"
                />
                
                {!selectedFile ? (
                  <label htmlFor="manuscript-file-input" className="cursor-pointer block space-y-2">
                    <div className="mx-auto w-10 h-10 bg-[#F5F2EA] flex items-center justify-center rounded-none border border-stone-200">
                      <FileUp className="w-5 h-5 text-[#795548]" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#1A1A1A]">
                        Drag & Drop manuscript facsimiles or click to select
                      </p>
                      <p className="text-[10px] text-stone-500 mt-0.5">
                        Supports images of palm-leaves, scriptures, or academic PDFs
                      </p>
                    </div>
                  </label>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between bg-[#F5F2EA] p-2.5 rounded-none border border-stone-300">
                      <div className="flex items-center gap-2 text-left min-w-0">
                        <FileText className="w-4 h-4 text-[#795548] shrink-0" />
                        <div className="truncate">
                          <p className="text-xs font-bold text-[#1A1A1A] truncate">{selectedFile.name}</p>
                          <p className="text-[9px] text-stone-500">
                            {(selectedFile.size / 1024).toFixed(1)} KB | {selectedFile.type || "Document"}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleRemoveFile}
                        className="text-stone-500 hover:text-red-600 p-1 rounded-none hover:bg-stone-200 cursor-pointer transition-all"
                        title="Remove file"
                        id="btn-remove-manuscript"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {filePreview && (
                      <div className="border border-stone-200 p-1 bg-[#1A1A1A]/5 rounded-none max-h-48 overflow-auto custom-scrollbar flex items-center justify-center">
                        <img
                          src={filePreview}
                          alt="Manuscript facsimile preview"
                          className="max-h-40 max-w-full object-contain filter contrast-110 sepia-[15%]"
                        />
                      </div>
                    )}

                    {!filePreview && selectedFile.type === "application/pdf" && (
                      <div className="border border-stone-250 py-3 bg-[#e8e4db] rounded-none flex flex-col items-center justify-center gap-1">
                        <div className="bg-white p-2 rounded-none border border-stone-300">
                          <FileText className="w-6 h-6 text-[#795548]" />
                        </div>
                        <span className="text-[10px] font-bold text-[#1A1A1A] uppercase tracking-wider">
                          Sanskrit PDF Manuscript Archive
                        </span>
                      </div>
                    )}

                    <button
                      onClick={handleTranscribeManuscript}
                      disabled={isTranscribing}
                      className={`w-full py-2 px-3 rounded-none text-xs font-bold font-sans border-2 flex items-center justify-center gap-2 cursor-pointer transition-all ${
                        isTranscribing
                          ? "bg-stone-200 hover:bg-stone-200 text-stone-500 border-stone-300 cursor-not-allowed"
                          : "bg-[#1A1A1A] text-white border-[#1A1A1A] hover:bg-[#795548] hover:border-[#795548]"
                      }`}
                    >
                      {isTranscribing ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Deciphering Epigraphy script...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-[#e8c07d]" />
                          <span>Extract & Transcribe Sanskrit text with AI</span>
                        </>
                      )}
                    </button>
                    
                    {manuscriptTranscribeSuccess && (
                      <p className="text-[10px] font-sans font-bold text-emerald-700 bg-emerald-50 py-1 px-2 border border-emerald-200">
                        ✓ Text extracted and loaded onto the transcription workbench below!
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Main user entry */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <label className="text-[11px] font-black text-[#1A1A1A] uppercase tracking-widest block font-sans">
                  Enter/Paste Sanskrit Material (Devanagari or IAST)
                </label>
                <div className="flex items-center gap-2 flex-wrap font-sans">
                  {/* Speech Language Config */}
                  {speechSupported && (
                    <select
                      value={dictationLang}
                      onChange={(e) => setDictationLang(e.target.value as any)}
                      className="text-[10px] uppercase font-black tracking-wider border px-1.5 py-0.5 rounded-none bg-white text-stone-700 border-stone-300 focus:outline-none focus:border-[#1A1A1A] cursor-pointer font-sans"
                    >
                      <option value="sa-IN">Sanskrit (sa-IN)</option>
                      <option value="hi-IN">Hindi (hi-IN)</option>
                    </select>
                  )}

                  {/* Dictation Trigger Button */}
                  <button
                    onClick={handleToggleListening}
                    className={`text-[10px] uppercase font-black tracking-wide border px-2.5 py-0.5 rounded-none flex items-center gap-1 cursor-pointer transition-all ${
                      isListening
                        ? "bg-red-600 text-white border-red-600 animate-pulse"
                        : "bg-[#F5F2EA] text-stone-600 border-stone-300 hover:border-[#1A1A1A] hover:bg-white"
                    }`}
                    title={isListening ? "Stop voice dictation" : "Dictate Sanskrit text using microphone"}
                  >
                    {isListening ? (
                      <>
                        <MicOff className="w-3.5 h-3.5 text-white" />
                        <span>Stop Dictation</span>
                      </>
                    ) : (
                      <>
                        <Mic className="w-3.5 h-3.5 text-[#795548]" />
                        <span>Dictate Input</span>
                      </>
                    )}
                  </button>

                  {inputText.trim() && (
                    <button
                      onClick={() => handleSpeak(inputText, "input")}
                      className={`text-[10px] uppercase font-black tracking-wide border px-2 py-0.5 rounded-none flex items-center gap-1 cursor-pointer transition-all ${
                        playingText === "input" ? "bg-[#1A1A1A] text-white border-[#1A1A1A]" : "bg-[#F5F2EA] text-stone-600 border-stone-300 hover:border-[#1A1A1A] hover:bg-white"
                      }`}
                      title="Listen to current input text"
                    >
                      {playingText === "input" ? (
                        <>
                          <Pause className="w-3 h-3 text-white" />
                          <span>Stop</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3 h-3 text-[#795548]" />
                          <span>Listen Input</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
              <div className="relative">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="द्रव्यगुनकंमसामान्यविशेशसमवायाभावाः..."
                  className={`w-full h-40 bg-white text-[#1A1A1A] border-2 rounded-none p-3 text-base font-serif focus:outline-none focus:ring-2 focus:ring-[#795548] transition-all ${
                    isListening ? "border-red-500 ring-2 ring-red-500/20" : "border-[#1A1A1A]"
                  }`}
                />
                {isListening && (
                  <div className="absolute bottom-3 right-3 bg-red-600 text-white text-[10px] uppercase font-black tracking-wider px-2 py-1 flex items-center gap-1.5 shadow-md font-sans">
                    <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                    <span>Microphone Active (Speaking Sanskrit)</span>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => handleCuration(inputText)}
              disabled={loading || !inputText.trim()}
              className={`w-full flex items-center justify-center gap-2 text-white font-black py-2.5 px-4 rounded-none transition-all text-xs font-sans border-2 border-[#1A1A1A] cursor-pointer ${
                loading || !inputText.trim()
                  ? "bg-stone-200 text-stone-500 border-stone-300 pointer-events-none"
                  : "bg-[#795548] hover:bg-[#1A1A1A]"
              }`}
            >
              {loading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Examining Phonics & Metre...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  Perform OCR Corrections & Curation
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="bg-[#F5F2EA] border-2 border-[#1A1A1A] p-4 rounded-none flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-red-900 font-sans">Scholastic Correction Fails</h4>
                <p className="text-xs text-red-700 mt-1 leading-relaxed font-sans">{error}</p>
              </div>
            </div>
          )}
        </div>

        {/* Results layout */}
        <div className="lg:col-span-12 xl:col-span-7 space-y-6">
          {curationResponse ? (
            <div className="space-y-6 bg-white border-2 border-[#1A1A1A] rounded-none p-6 shadow-none">
              <div className="flex items-center justify-between border-b-2 border-[#1A1A1A] pb-3">
                <h4 className="text-sm font-black text-[#1A1A1A] uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  Philological Contrast Output
                </h4>
                <span className="text-[10px] font-mono bg-[#1A1A1A] text-white px-2 py-0.5 rounded-none font-bold">
                  {curationResponse.corrections.length} correction(s) deployed
                </span>
              </div>

              {/* Side-by-Side Panel */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-red-500 uppercase tracking-widest block font-sans">
                      Original OCR (Errors highlighted)
                    </span>
                    <button
                      onClick={() => handleSpeak(curationResponse?.rawText || inputText, "original")}
                      className={`text-[10px] uppercase font-black tracking-wide border px-2 py-0.5 rounded-none flex items-center gap-1 cursor-pointer transition-all ${
                        playingText === "original" ? "bg-[#1A1A1A] text-white border-[#1A1A1A]" : "bg-white text-stone-600 border-stone-350 hover:border-[#1A1A1A] hover:bg-[#F5F2EA]"
                      }`}
                      title="Listen to original text"
                    >
                      {playingText === "original" ? (
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
                  <div className="bg-[#F5F2EA] border-2 border-[#1A1A1A] p-4 rounded-none min-h-[120px]">
                    {renderHighlightedOriginal()}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest block font-sans">
                      Curated Clean text
                    </span>
                    <button
                      onClick={() => handleSpeak(curationResponse?.correctedText || "", "curated")}
                      className={`text-[10px] uppercase font-black tracking-wide border px-2 py-0.5 rounded-none flex items-center gap-1 cursor-pointer transition-all ${
                        playingText === "curated" ? "bg-[#1A1A1A] text-white border-[#1A1A1A]" : "bg-white text-stone-600 border-stone-350 hover:border-[#1A1A1A] hover:bg-[#F5F2EA]"
                      }`}
                      title="Listen to curated text"
                    >
                      {playingText === "curated" ? (
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
                  <div className="bg-white border-2 border-[#1A1A1A] p-4 rounded-none min-h-[120px]">
                    {renderCorrectedText()}
                  </div>
                </div>
              </div>

              {/* Detailed Corrections Table */}
              {curationResponse.corrections.length > 0 && (
                <div className="border-t-2 border-[#1A1A1A] pt-5 space-y-3">
                  <h5 className="text-xs font-black text-[#1A1A1A] uppercase tracking-wide font-sans">
                    Detailed Scholastic Footnotes (सुधार-सूची)
                  </h5>
                  <div className="overflow-x-auto border-2 border-[#1A1A1A] rounded-none">
                    <table className="min-w-full divide-y divide-[#1A1A1A] text-left text-xs font-sans">
                      <thead className="bg-[#1A1A1A]">
                        <tr>
                          <th className="py-2.5 px-4 font-bold text-white border-r border-[#1A1A1A] uppercase">Original Typo</th>
                          <th className="py-2.5 px-4 font-bold text-[#795548] border-r border-[#1A1A1A] uppercase">Corrected Form</th>
                          <th className="py-2.5 px-4 font-bold text-white uppercase font-sans">Manuscript / Grammatical Justification</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1A1A1A] bg-white">
                        {curationResponse.corrections.map((corr, i) => (
                          <tr key={i} className="hover:bg-[#795548]/5 transition-colors">
                            <td className="py-2.5 px-4 font-serif text-red-650 text-sm italic border-r border-[#1A1A1A]">{corr.original}</td>
                            <td className="py-2.5 px-4 font-serif text-emerald-900 text-sm font-bold border-r border-[#1A1A1A]">{corr.corrected}</td>
                            <td className="py-2.5 px-4 text-stone-705 leading-relaxed font-sans">{corr.explanation}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-[#F5F2EA] rounded-none border-2 border-dashed border-[#1A1A1A] py-24 text-center animate-fade-in">
              <Globe className="w-8 h-8 text-[#795548] mx-auto animate-pulse" />
              <p className="text-sm font-serif text-[#1A1A1A] font-bold mt-3">
                Select a preset on the left or paste your own script, then trigger the Curation engine.
              </p>
              <p className="text-xs text-stone-550 mt-1 font-sans">
                The engine checks visual Sanskrit transcription shapes and corrects characters.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
