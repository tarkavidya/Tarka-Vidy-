import React, { useState } from "react";
import { Mail, Sparkles, FileText, Check, RefreshCw, ExternalLink } from "lucide-react";

interface FeedbackMaildeskProps {
  initialType?: "suggestion" | "correction";
  initialSourceText?: string;
  initialSelection?: string;
  isEmbed?: boolean;
}

export default function FeedbackMaildesk({
  initialType = "suggestion",
  initialSourceText = "General",
  initialSelection = "",
  isEmbed = false,
}: FeedbackMaildeskProps) {
  const [feedbackType, setFeedbackType] = useState<"suggestion" | "correction">(initialType);
  const [feedbackEmail, setFeedbackEmail] = useState("");
  const [feedbackContent, setFeedbackContent] = useState("");
  const [feedbackSelection, setFeedbackSelection] = useState(initialSelection);
  const [feedbackSourceText, setFeedbackSourceText] = useState(initialSourceText);
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
  const [feedbackSuccessMessage, setFeedbackSuccessMessage] = useState<string | null>(null);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);

  // Construct mailto parameters for direct fallback
  const mailSubject = `[Tarkavidya Editorial] ${feedbackType === "correction" ? `Correction: ${feedbackSourceText}` : "Platform Suggestion"}`;
  const mailBody = `Type: ${feedbackType.toUpperCase()}
Reporter Email: ${feedbackEmail || "Anonymous"}
Source Treatise: ${feedbackSourceText}
${feedbackType === "correction" ? `Typo/Faulty Selection: ${feedbackSelection}\n` : ""}
Message / Details:
------------------------------------------
${feedbackContent}
------------------------------------------
Sent from Tarka-Vidyā Platform`;

  const mailtoLink = `mailto:tarkavidya@gmail.com?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackContent.trim() || feedbackSubmitting) return;
    if (!navigator.onLine) {
      setFeedbackError("You are currently offline. Submission to the database is disabled, but you can still use the direct 'Send via Email App' options above or below to queue it in your local mail client!");
      return;
    }

    setFeedbackSubmitting(true);
    setFeedbackError(null);
    setFeedbackSuccessMessage(null);

    try {
      const res = await fetch("/api/submit-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: feedbackType,
          reporterEmail: feedbackEmail,
          content: feedbackContent,
          textSelection: feedbackType === "correction" ? feedbackSelection : undefined,
          sourceTextName: feedbackType === "correction" ? feedbackSourceText : undefined,
        }),
      });

      if (!res.ok) {
        let serverErrorMsg = "";
        try {
          const errData = await res.json();
          serverErrorMsg = errData.error || errData.message || "";
        } catch (_) {}
        throw new Error(serverErrorMsg || "Failed to transmit report.");
      }

      const data = await res.json();
      setFeedbackSuccessMessage(data.message || "Thank you! Your feedback has been registered.");
    } catch (err: any) {
      console.error(err);
      setFeedbackError(err.message || "An error occurred while dispatching feedback.");
    } finally {
      setFeedbackSubmitting(false);
    }
  };

  return (
    <div className={`bg-white border-2 border-[#1A1A1A] rounded-none p-5 sm:p-6 shadow-none max-w-3xl mx-auto animate-fade-in space-y-6 ${isEmbed ? "my-2" : ""}`}>
      <div className="border-b-2 border-[#1A1A1A] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-serif font-black text-[#3B2314] flex items-center gap-2">
            <Mail className="w-5 h-5 text-[#795548]" />
            Editorial Board Maildesk (tarkavidya@gmail.com)
          </h3>
          <p className="text-[11px] text-stone-600 font-sans mt-0.5">
            Submit scholastic corrections or platform suggestions directly to our research and editorial team.
          </p>
        </div>
        <a
          href={mailtoLink}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F5F2EA] hover:bg-[#795548] hover:text-white border border-[#1A1A1A] text-[10px] font-bold font-sans uppercase tracking-wider transition-all rounded-none"
        >
          <span>Open Email App</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {feedbackSuccessMessage ? (
        <div className="bg-[#FAF7EE] border-2 border-[#1A1A1A] p-6 text-center space-y-4">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto border-2 border-[#1A1A1A]">
            <Check className="w-6 h-6" />
          </div>
          <h4 className="text-base font-serif font-black text-[#3B2314]">Logged to Editorial Dashboard</h4>
          <p className="text-xs text-stone-700 leading-relaxed max-w-md mx-auto">
            Your report was successfully registered on our local secure platform. Because some mail servers block container dispatches, we highly recommend you also send the email directly using the button below to guarantee delivery to <span className="font-bold">tarkavidya@gmail.com</span>:
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-2">
            <a
              href={mailtoLink}
              className="px-5 py-2.5 bg-[#795548] hover:bg-[#1A1A1A] text-white text-xs font-black uppercase rounded-none border-2 border-[#1A1A1A] transition-all cursor-pointer inline-flex items-center gap-1.5"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Send via Local Mail Client</span>
            </a>
            <button
              onClick={() => {
                setFeedbackSuccessMessage(null);
                setFeedbackError(null);
                setFeedbackContent("");
              }}
              className="px-4 py-2.5 bg-white hover:bg-[#F5F2EA] text-[#1A1A1A] text-xs font-black uppercase rounded-none border-2 border-[#1A1A1A] transition-all cursor-pointer"
            >
              Write Another Report
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmitFeedback} className="space-y-4.5">
          {/* Report Type selector */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFeedbackType("suggestion")}
              className={`py-2.5 px-3 border-2 font-sans font-black text-xs uppercase tracking-wider text-center transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-2 ${
                feedbackType === "suggestion"
                  ? "bg-[#795548] text-white border-[#1A1A1A]"
                  : "bg-[#F5F2EA] text-stone-700 hover:bg-stone-100 border-[#1A1A1A]"
              }`}
            >
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>General Suggestion</span>
            </button>
            <button
              type="button"
              onClick={() => setFeedbackType("correction")}
              className={`py-2.5 px-3 border-2 font-sans font-black text-xs uppercase tracking-wider text-center transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-2 ${
                feedbackType === "correction"
                  ? "bg-[#795548] text-white border-[#1A1A1A]"
                  : "bg-[#F5F2EA] text-stone-700 hover:bg-stone-100 border-[#1A1A1A]"
              }`}
            >
              <FileText className="w-4 h-4 shrink-0" />
              <span>Sūtra Correction</span>
            </button>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#1A1A1A] font-sans block">
              Your Email Address (Optional, for scholarly replies)
            </label>
            <input
              type="email"
              value={feedbackEmail}
              onChange={(e) => setFeedbackEmail(e.target.value)}
              placeholder="e.g. scholar@tarkavidya.net"
              className="w-full bg-white text-[#1A1A1A] border-2 border-[#1A1A1A] rounded-none px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#795548]"
            />
          </div>

          {feedbackType === "correction" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 animate-fade-in">
              {/* Source Text / Grantha */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#1A1A1A] font-sans block">
                  Treatise & Verse Reference (Grantha)
                </label>
                <input
                  type="text"
                  value={feedbackSourceText}
                  onChange={(e) => setFeedbackSourceText(e.target.value)}
                  placeholder="e.g. Nyāya Sūtra 1.1.1, Tarkasaṃgraha..."
                  className="w-full bg-white text-[#1A1A1A] border-2 border-[#1A1A1A] rounded-none px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#795548]"
                />
              </div>

              {/* Faulty Text Selection */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#1A1A1A] font-sans block">
                  Faulty Characters / Incorrect Reading
                </label>
                <input
                  type="text"
                  value={feedbackSelection}
                  onChange={(e) => setFeedbackSelection(e.target.value)}
                  placeholder="e.g. 'अनुसण' instead of 'अनुष्ण'"
                  className="w-full bg-white text-[#1A1A1A] border-2 border-[#1A1A1A] rounded-none px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#795548]"
                />
              </div>
            </div>
          )}

          {/* Message Content */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#1A1A1A] font-sans block">
              {feedbackType === "suggestion" ? "Describe Your Suggestion / Request" : "Elaborate the Scholarly Correction"}
            </label>
            <textarea
              value={feedbackContent}
              onChange={(e) => setFeedbackContent(e.target.value)}
              placeholder={
                feedbackType === "suggestion"
                  ? "Describe features, enhancements, or translations you would love to see..."
                  : "Please write the correct reading or mention the classical manuscript source justifying this correction..."
              }
              required
              rows={4}
              className="w-full bg-white text-[#1A1A1A] border-2 border-[#1A1A1A] rounded-none p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#795548]"
            />
          </div>

          {feedbackError && (
            <p className="text-xs text-red-600 font-sans font-bold">{feedbackError}</p>
          )}

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              type="submit"
              disabled={feedbackSubmitting || !feedbackContent.trim()}
              className={`flex-1 flex items-center justify-center gap-2 text-white font-black py-2.5 px-4 rounded-none transition-all text-xs font-sans border-2 border-[#1A1A1A] cursor-pointer ${
                feedbackSubmitting || !feedbackContent.trim()
                  ? "bg-stone-100 text-stone-400 border-stone-200 pointer-events-none"
                  : "bg-[#795548] hover:bg-[#1A1A1A]"
              }`}
            >
              {feedbackSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Submitting to Dashboard...</span>
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4" />
                  <span>Submit to local Dashboard</span>
                </>
              )}
            </button>

            <a
              href={mailtoLink}
              className="flex-1 flex items-center justify-center gap-2 bg-[#F5F2EA] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white border-2 border-[#1A1A1A] py-2.5 px-4 rounded-none transition-all text-xs font-black font-sans text-center"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Send directly via Email App</span>
            </a>
          </div>
          <p className="text-[10px] text-stone-500 font-sans italic text-center">
            * Direct sending opens your email application pre-filled to guarantee arrival.
          </p>
        </form>
      )}
    </div>
  );
}
