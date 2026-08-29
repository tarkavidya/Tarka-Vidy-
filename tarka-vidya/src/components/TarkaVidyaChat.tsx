import React, { useState, useRef, useEffect } from "react";
import { Sparkles, Send, RefreshCw, BookOpen, AlertCircle } from "lucide-react";
// 1. Import the official Google Generative AI SDK
import { GoogleGenerativeAI } from "@google/generative-ai";
// 2. Import the React Markdown renderer to parse rich text
import ReactMarkdown from "react-markdown";
async function generateWithRetry(model: any, prompt: string, retries = 3) {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await model.generateContent(prompt);
    } catch (error: any) {
      const is503 = error?.message?.includes("503");

      if (!is503 || attempt === retries - 1) {
        throw error;
      }

      const delay = 1000 * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}
interface ChatMessage {
  id: string;
  sender: "user" | "tutor";
  text: string;
  timestamp: string;
}

// 3. Initialize the Gemini API client using your Vite deployment variable
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export default function SutradharaChat() {
  const [aiChatInput, setAiChatInput] = useState("");
  const [aiChatMessages, setAiChatMessages] = useState<ChatMessage[]>([
    {
      id: "ai-welcome",
      sender: "tutor",
      text: "Pranāms, fellow scholar! I am Tarka Vidyā AI (तर्कविद्या), your AI academic companion in classical Indian Logic and Epistemology (Pramāṇa-śāstra).\n\nYou may ask me any questions regarding the Nyāya five-part syllogism, Vaiśeṣika padārthas (categories), Buddhist logical theories (Apoha, Kṣaṇikavāda), Navya-Nyāya relational concepts, or any other topics in the Indian logical tradition. How can I assist your philosophical inquiry today?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }
  ]);
  const [aiChatLoading, setAiChatLoading] = useState(false);
  const [aiChatError, setAiChatError] = useState<string | null>(null);
  const aiChatEndRef = useRef<HTMLDivElement | null>(null);

  // Scroll to bottom of chat
  useEffect(() => {
    aiChatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [aiChatMessages]);

  const handleSendAiChatMessage = async () => {
    if (!aiChatInput.trim() || aiChatLoading) return;
    
    // Safety check for missing API Key configuration in Vercel
    if (!apiKey) {
      setAiChatError("Gemini API Key is missing. Please configure VITE_GEMINI_API_KEY in your deployment environment variables.");
      return;
    }

    if (!navigator.onLine) {
      setAiChatError("You are currently offline. AI-powered scholastic tutoring requires an internet connection. Please reconnect and try again.");
      return;
    }

    const userMsg: ChatMessage = {
      id: `usr-ai-${Date.now()}`,
      sender: "user",
      text: aiChatInput,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const newHistory = [...aiChatMessages, userMsg];
    setAiChatMessages(newHistory);
    const currentInput = aiChatInput;
    setAiChatInput("");
    setAiChatLoading(true);
    setAiChatError(null);

    try {
      // 4. Set up the active Gemini 3.5 Model with custom behavioral instructions
      const model = genAI.getGenerativeModel({
        model: "gemini-3.5-flash",
        systemInstruction: "You are Tarka Vidyā AI (तर्कविद्या), a profound academic scholar and tutor in classical Indian Logic and Epistemology (Pramāṇa-śāstra). Provide insightful responses grounded securely in classical treatises such as Nyāya-Vaiśeṣika debate structures, pramāṇas, Buddhist logical theories (Apoha, Kṣaṇikavāda), and Navya-Nyāya relational concepts. Maintain a respectful, scholastic, and encouraging tone.",
      });

      // 5. Map your message history array to the role format required by Gemini
      const geminiHistory = aiChatMessages
        .filter(msg => msg.id !== "ai-welcome")
        .map(msg => ({
          role: msg.sender === "user" ? "user" as const : "model" as const,
          parts: [{ text: msg.text }],
        }));

      // 6. Initialize the stateful conversational multi-turn chat session
      const chatSession = model.startChat({
        history: geminiHistory,
      });

      // 7. Direct execution to the Google cloud servers
      const result = await chatSession.sendMessage(currentInput);
      const responseText = result.response.text();

      const assistantMsg: ChatMessage = {
        id: `ast-${Date.now()}`,
        sender: "tutor",
        text: responseText || "I have meditated on your question but cannot formulate a response. Pray reframe your inquiry.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      
      setAiChatMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error("Gemini Execution Error:", err);
      setAiChatError(err.message || "The logic assembly was disrupted. Connection to Tarka Vidyā AI failed.");
    } finally {
      setAiChatLoading(false);
    }
  };

  const handlePresetSelect = (preset: string) => {
    setAiChatInput(preset);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in px-2 sm:px-4" id="tarka-vidya-chat-container">
      {/* Header Banner */}
      <div className="bg-white border-2 border-[#1A1A1A] p-6 shadow-none flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-serif font-black text-[#3B2314] flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-[#795548] animate-pulse" />
            Tarka Vidyā AI Assistant (तर्कविद्या)
          </h2>
          <p className="text-xs text-stone-600 leading-relaxed font-sans max-w-xl">
            A state-of-the-art scholarly logic engine trained in Nyāya-Vaiśeṣika debate structures, pramāṇas, and Indian philosophical disputations. Enter questions or select standard topics below.
          </p>
        </div>
        <div className="bg-[#F5F2EA] border border-[#1A1A1A] p-3 text-[10px] font-mono uppercase tracking-widest text-stone-650 shrink-0 self-stretch flex flex-col justify-center">
          <span className="font-bold block text-stone-800">Role: Śāstrārtha-Tutor</span>
          <span className="text-stone-500 mt-1">Grounding: Classical Treatises</span>
        </div>
      </div>

      {/* Preset Topics Carousel */}
      <div className="bg-[#F5F2EA] border-2 border-[#1A1A1A] p-4">
        <h3 className="text-[10px] font-black uppercase tracking-wider text-stone-700 font-sans mb-3 flex items-center gap-1">
          <BookOpen className="w-3.5 h-3.5" />
          Select an Epistemological Topic to Inquire:
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
          <button
            onClick={() => handlePresetSelect("What is Vyāpti (universal concomitance) in Nyāya logic? Describe its types.")}
            className="text-left p-2.5 bg-white hover:bg-[#795548] hover:text-white text-[#1A1A1A] border border-[#1A1A1A] transition-all cursor-pointer rounded-none text-xs font-bold font-sans flex flex-col justify-between"
          >
            <span>Inquire Vyāpti</span>
            <span className="text-[9px] opacity-75 font-normal mt-1 block">Concomitance relation</span>
          </button>
          <button
            onClick={() => handlePresetSelect("Explain the Nyāya five-part syllogism (Pañcāvayava) using the classic hill and fire example.")}
            className="text-left p-2.5 bg-white hover:bg-[#795548] hover:text-white text-[#1A1A1A] border border-[#1A1A1A] transition-all cursor-pointer rounded-none text-xs font-bold font-sans flex flex-col justify-between"
          >
            <span>Syllogism Structure</span>
            <span className="text-[9px] opacity-75 font-normal mt-1 block">Avayavas in debate</span>
          </button>
          <button
            onClick={() => handlePresetSelect("What are the 5 types of logical fallacies (Hetvābhāsa) recognized by Gautama's Nyāya Sūtra?")}
            className="text-left p-2.5 bg-white hover:bg-[#795548] hover:text-white text-[#1A1A1A] border border-[#1A1A1A] transition-all cursor-pointer rounded-none text-xs font-bold font-sans flex flex-col justify-between"
          >
            <span>Hetvābhāsa Fallacies</span>
            <span className="text-[9px] opacity-75 font-normal mt-1 block">Identifying defects</span>
          </button>
          <button
            onClick={() => handlePresetSelect("Compare Dignāga's theory of perception with Vātsyāyana's commentary on Nyāya Sūtras.")}
            className="text-left p-2.5 bg-white hover:bg-[#795548] hover:text-white text-[#1A1A1A] border border-[#1A1A1A] transition-all cursor-pointer rounded-none text-xs font-bold font-sans flex flex-col justify-between"
          >
            <span>Buddhist vs Nyāya</span>
            <span className="text-[9px] opacity-75 font-normal mt-1 block">Pratyakṣa debate</span>
          </button>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="flex flex-col h-[520px] border-2 border-[#1A1A1A] rounded-none bg-white shadow-none overflow-hidden">
        {/* Messages box */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-[#FAF8F5] custom-scrollbar">
          {aiChatMessages.map((msg) => {
            const isUser = msg.sender === "user";
            return (
              <div
                key={msg.id}
                className={`flex flex-col max-w-[85%] ${isUser ? "ml-auto items-end" : "mr-auto items-start"}`}
              >
                <div className="flex items-center gap-1.5 mb-1.5 px-1">
                  <span className={`text-[10px] font-black uppercase tracking-wider font-sans ${isUser ? "text-[#795548]" : "text-stone-600"}`}>
                    {isUser ? "Siddhāntin (You)" : "Tarka Vidyā AI (AI Scholar)"}
                  </span>
                  <span className="text-[9px] text-stone-400 font-sans">{msg.timestamp}</span>
                </div>

                {/* Modified Text Bubble mapping targeting deep CSS Markdown Nodes */}
                <div
                  className={`p-4 border-2 border-[#1A1A1A] text-sm leading-relaxed font-sans rounded-none transition-all ${
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

          {aiChatLoading && (
            <div className="flex items-center gap-2.5 bg-[#F3EBE0] border-2 border-[#1A1A1A] text-stone-700 rounded-none p-3.5 self-start max-w-[60%]">
              <RefreshCw className="w-4 h-4 animate-spin text-[#795548]" />
              <span className="text-xs font-sans italic font-medium">Tarka Vidyā AI is consulting classical pramāṇa treatises...</span>
            </div>
          )}

          {aiChatError && (
            <div className="p-4 bg-red-55/90 border-2 border-red-550 text-red-950 rounded-none text-xs font-sans self-center text-center flex items-center gap-2 max-w-md mx-auto">
              <AlertCircle className="w-5 h-5 text-red-700 shrink-0" />
              <span>{aiChatError}</span>
            </div>
          )}

          <div ref={aiChatEndRef} />
        </div>

        {/* Input area */}
        <div className="p-4 bg-white border-t-2 border-[#1A1A1A] flex gap-3">
          <input
            type="text"
            placeholder="Ask Tarka Vidyā AI about Pramāṇa-śāstra, Vyāpti, Hetvābhāsa..."
            value={aiChatInput}
            onChange={(e) => setAiChatInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSendAiChatMessage();
            }}
            disabled={aiChatLoading}
            className="flex-1 bg-white text-[#1A1A1A] border-2 border-[#1A1A1A] rounded-none px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#795548] placeholder-stone-400"
          />
          <button
            onClick={handleSendAiChatMessage}
            disabled={aiChatLoading || !aiChatInput.trim()}
            className={`px-5 py-3 text-xs font-black rounded-none text-white font-sans flex items-center gap-2 transition-all border-2 border-[#1A1A1A] cursor-pointer ${
              aiChatLoading || !aiChatInput.trim()
                ? "bg-stone-100 text-stone-400 border-stone-200 pointer-events-none"
                : "bg-[#795548] hover:bg-[#1A1A1A]"
            }`}
          >
            <span>Ask Scholar</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
