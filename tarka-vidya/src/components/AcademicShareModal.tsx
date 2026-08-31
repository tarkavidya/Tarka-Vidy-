import React, { useState } from "react";
import { Copy, Check, Share2, Quote, ExternalLink, Sparkles, BookOpen, X as CloseIcon } from "lucide-react";

export interface AcademicSharePayload {
  title: string;
  sanskritText?: string;
  transliteration?: string;
  translation?: string;
  source?: string;
  chapterOrSection?: string;
  category?: "verse" | "comparative-insight" | "portal" | "dictionary";
  url?: string;
}

interface AcademicShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  payload: AcademicSharePayload | null;
  targetScript?: string;
}

export const WhatsAppIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0012.04 2zm.01 1.67c4.54 0 8.24 3.7 8.24 8.24 0 2.2-.86 4.27-2.42 5.82a8.17 8.17 0 01-5.82 2.42c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.18 8.18 0 01-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24zm4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.4-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.42-.14 0-.31-.02-.47-.02s-.42.06-.64.3c-.22.25-.85.83-.85 2.02s.87 2.34.99 2.5c.13.17 1.72 2.63 4.17 3.68.58.25 1.04.4 1.39.51.59.19 1.12.16 1.54.1.47-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.1-.23-.17-.48-.29z" />
  </svg>
);

export const FacebookIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

export const XTwitterIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export const LinkedInIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.6 1.6 0 0 0-1.6 1.6 1.6 1.6 0 0 0 1.6 1.6 1.6 1.6 0 0 0 1.6-1.6 1.6 1.6 0 0 0-1.6-1.6Z" />
  </svg>
);

export default function AcademicShareModal({
  isOpen,
  onClose,
  payload,
}: AcademicShareModalProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCitation, setCopiedCitation] = useState(false);

  if (!isOpen || !payload) return null;

  const currentUrl = typeof window !== "undefined" ? window.location.href : "https://tarkavidya.in";
  const shareUrl = payload.url || currentUrl;

  // Formatted excerpt for sharing
  const composeShareText = () => {
    let parts: string[] = [];
    parts.push(`📖 ${payload.title}`);
    if (payload.chapterOrSection) {
      parts.push(`[${payload.chapterOrSection}]`);
    }
    if (payload.sanskritText) {
      parts.push(`\nSanskrit: ${payload.sanskritText}`);
    }
    if (payload.transliteration) {
      parts.push(`IAST: ${payload.transliteration}`);
    }
    if (payload.translation) {
      parts.push(`\nTranslation: "${payload.translation}"`);
    }
    if (payload.source) {
      parts.push(`\nSource: ${payload.source}`);
    }
    parts.push(`\nExplore Nyāya-Vaiśeṣika Epistemology on Tarka-Vidyā:`);
    return parts.join("\n");
  };

  const shareText = composeShareText();

  // Full academic citation string
  const academicCitation = [
    payload.source ? `${payload.source}.` : "Tarka-Vidyā Scholastic Repository.",
    payload.title,
    payload.chapterOrSection ? `(${payload.chapterOrSection})` : "",
    payload.sanskritText ? `\n"${payload.sanskritText}"` : "",
    payload.translation ? `\nTr: "${payload.translation}"` : "",
    `\nAccessed via Tarka-Vidyā: ${shareUrl}`,
  ].filter(Boolean).join(" ");

  // WhatsApp share
  const handleWhatsApp = () => {
    const waText = `${shareText}\n${shareUrl}`;
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(waText)}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");
  };

  // X / Twitter share
  const handleXTwitter = () => {
    const tweetText = `Tarka-Vidyā (तर्कविद्या) — Digital Nyāya & Vaiśeṣika Episteme Archive\n॥ ॐ कणादगौतमादिभ्यस्तर्कविद्यासम्प्रदायकर्तृभ्यो वंशऋषिभ्यो नमो महद्भ्यो नमो गुरुभ्यः ॥\n\nScholarly digital archive for Indian epistemology, classical logic: https://www.tarkavidya.com/ \n\n#Nyaya #IndianPhilosophy`;
    const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
    window.open(xUrl, "_blank", "noopener,noreferrer");
  };

  // LinkedIn share
  const handleLinkedIn = () => {
    const targetShareUrl = shareUrl || "https://www.tarkavidya.com/";
    const liUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(targetShareUrl)}`;
    window.open(liUrl, "_blank", "noopener,noreferrer");
  };

  // Facebook share
  const handleFacebook = () => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
    window.open(fbUrl, "_blank", "noopener,noreferrer");
  };

  // Copy Deep Link
  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = shareUrl;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // Copy Full Scholastic Citation
  const handleCopyCitation = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(academicCitation);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = academicCitation;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopiedCitation(true);
      setTimeout(() => setCopiedCitation(false), 2500);
    } catch {
      setCopiedCitation(true);
      setTimeout(() => setCopiedCitation(false), 2000);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-[#1A1A1A]/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in font-sans"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-[#ECE0D1] border-4 border-[#1A1A1A] max-w-xl w-full rounded-none shadow-2xl overflow-hidden animate-scale-up">
        
        {/* Header */}
        <div className="bg-[#1A1A1A] px-5 py-3.5 border-b-2 border-[#1A1A1A] flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-[#C25E3E]" />
            <h3 className="text-white font-serif font-black text-sm uppercase tracking-wider">
              Share Scholastic Insight / शास्त्रसङ्ग्रह-साझेदारी
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-stone-300 hover:text-white bg-transparent hover:bg-stone-800 p-1 transition-all cursor-pointer rounded-none"
            title="Close modal"
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar bg-[#ECE0D1]">
          
          {/* Item Preview Card */}
          <div className="bg-white border-2 border-[#8C6239]/30 p-4 space-y-2.5 rounded-none shadow-xs text-left">
            <div className="flex items-center justify-between gap-2 border-b border-stone-200 pb-1.5">
              <span className="text-[10px] font-mono font-black uppercase text-[#8C6239] tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3 h-3 text-[#8C6239]" />
                {payload.category === "comparative-insight" 
                  ? "Comparative Insight / प्रमाण-तुलना" 
                  : payload.category === "dictionary"
                  ? "Nyāya Lexicon / परिभाषा"
                  : "Sanskrit Verse / सूत्रम्"}
              </span>
              {payload.chapterOrSection && (
                <span className="text-[9px] font-sans font-bold bg-[#F5F2EA] px-2 py-0.5 text-stone-600 border border-stone-300">
                  {payload.chapterOrSection}
                </span>
              )}
            </div>

            <h4 className="font-serif text-base font-black text-[#1A1A1A] leading-tight">
              {payload.title}
            </h4>

            {payload.sanskritText && (
              <div className="bg-[#FFFDF9] border border-[#8C6239]/20 p-3 text-center my-1">
                <p className="font-serif text-base sm:text-lg font-bold text-stone-900 leading-relaxed">
                  {payload.sanskritText}
                </p>
                {payload.transliteration && (
                  <p className="font-mono text-[10px] text-stone-500 italic mt-1 font-medium">
                    {payload.transliteration}
                  </p>
                )}
              </div>
            )}

            {payload.translation && (
              <div className="border-l-2 border-[#8C6239] pl-3 py-0.5 text-xs text-stone-700 leading-relaxed italic">
                "{payload.translation}"
              </div>
            )}

            {payload.source && (
              <div className="text-[9.5px] text-stone-500 font-mono pt-1">
                Source: <span className="font-bold text-stone-700">{payload.source}</span>
              </div>
            )}
          </div>

          {/* Social Share Grid */}
          <div className="space-y-2 text-left">
            <span className="text-[10px] font-black uppercase text-stone-600 tracking-wider block">
              Direct Social & Messaging Platforms
            </span>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {/* WhatsApp */}
              <button
                onClick={handleWhatsApp}
                className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white py-2.5 px-2.5 flex items-center justify-center gap-1.5 font-bold text-xs tracking-wider uppercase border-2 border-[#128C7E] transition-all cursor-pointer shadow-xs active:scale-98"
                title="Share on WhatsApp"
              >
                <WhatsAppIcon className="w-4 h-4 shrink-0" />
                <span>WhatsApp</span>
              </button>

              {/* X / Twitter */}
              <button
                onClick={handleXTwitter}
                className="w-full bg-[#000000] hover:bg-stone-900 text-white py-2.5 px-2.5 flex items-center justify-center gap-1.5 font-bold text-xs tracking-wider uppercase border-2 border-stone-800 transition-all cursor-pointer shadow-xs active:scale-98"
                title="Share on X (Twitter)"
              >
                <XTwitterIcon className="w-3.5 h-3.5 shrink-0" />
                <span>X / Twitter</span>
              </button>

              {/* LinkedIn */}
              <button
                onClick={handleLinkedIn}
                className="w-full bg-[#0A66C2] hover:bg-[#004182] text-white py-2.5 px-2.5 flex items-center justify-center gap-1.5 font-bold text-xs tracking-wider uppercase border-2 border-[#004182] transition-all cursor-pointer shadow-xs active:scale-98"
                title="Share on LinkedIn"
              >
                <LinkedInIcon className="w-4 h-4 shrink-0" />
                <span>LinkedIn</span>
              </button>

              {/* Facebook */}
              <button
                onClick={handleFacebook}
                className="w-full bg-[#1877F2] hover:bg-[#166fe5] text-white py-2.5 px-2.5 flex items-center justify-center gap-1.5 font-bold text-xs tracking-wider uppercase border-2 border-[#0e5a9e] transition-all cursor-pointer shadow-xs active:scale-98"
                title="Share on Facebook"
              >
                <FacebookIcon className="w-4 h-4 shrink-0" />
                <span>Facebook</span>
              </button>
            </div>
          </div>

          {/* Direct Copy Actions */}
          <div className="space-y-2 text-left pt-1">
            <span className="text-[10px] font-black uppercase text-stone-600 tracking-wider block">
              Link & Scholastic Citation
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Copy Direct Deep Link */}
              <button
                onClick={handleCopyLink}
                className={`w-full py-2.5 px-3 flex items-center justify-center gap-2 font-bold text-xs tracking-wider uppercase border-2 transition-all cursor-pointer shadow-sm ${
                  copiedLink
                    ? "bg-[#2E7D32] text-white border-[#1B5E20]"
                    : "bg-white hover:bg-stone-100 text-[#1A1A1A] border-[#1A1A1A]"
                }`}
              >
                {copiedLink ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-[#8C6239]" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>

              {/* Copy Scholarly Citation */}
              <button
                onClick={handleCopyCitation}
                className={`w-full py-2.5 px-3 flex items-center justify-center gap-2 font-bold text-xs tracking-wider uppercase border-2 transition-all cursor-pointer shadow-sm ${
                  copiedCitation
                    ? "bg-[#2E7D32] text-white border-[#1B5E20]"
                    : "bg-[#8C6239] hover:bg-[#704d2c] text-white border-[#3B2314]"
                }`}
              >
                {copiedCitation ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>Citation Copied!</span>
                  </>
                ) : (
                  <>
                    <Quote className="w-4 h-4 text-[#ECE0D1]" />
                    <span>Copy Citation</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick link display box */}
          <div className="bg-[#FAF8F5] border border-stone-300 p-2.5 text-left flex items-center justify-between gap-2 text-[10px] font-mono text-stone-600">
            <span className="truncate max-w-[85%]">{shareUrl}</span>
            <ExternalLink className="w-3.5 h-3.5 text-stone-400 shrink-0" />
          </div>

        </div>

        {/* Footer */}
        <div className="bg-[#1A1A1A] px-5 py-3 border-t-2 border-[#1A1A1A] flex items-center justify-between text-stone-300 text-[10px]">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#C25E3E]" />
            Tarka-Vidyā Scholastic Logic Project
          </span>
          <button
            onClick={onClose}
            className="text-stone-300 hover:text-white uppercase font-bold tracking-wider px-2 py-1 bg-stone-800 hover:bg-stone-700 transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
