import React, { useState } from "react";
import {
  X,
  FileText,
  Sparkles,
  Copy,
  Check,
  Download,
  BookOpen,
  Send,
  Building
} from "lucide-react";
import Markdown from "react-markdown";
import { Course } from "../../types";

interface SopCvAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course;
}

export const SopCvAssistantModal: React.FC<SopCvAssistantModalProps> = ({
  isOpen,
  onClose,
  course
}) => {
  const [action, setAction] = useState<"generate-sop" | "cv">("generate-sop");
  const [customInstructions, setCustomInstructions] = useState("");
  const [generatedContent, setGeneratedContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/assistant/sop-cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          courseId: course.id,
          customInstructions
        })
      });
      const data = await res.json();
      setGeneratedContent(data.content || "");
    } catch (err) {
      setGeneratedContent("Error generating statement of purpose. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!generatedContent) return;
    navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-600/30 border border-red-500/40 flex items-center justify-center text-red-400">
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">
                AI Application Assistant: Statement of Purpose & Academic CV
              </h3>
              <p className="text-[11px] text-slate-400">
                Tailored for {course.name} at {course.universityName}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
                  Document Type
                </label>
                <div className="space-y-1.5">
                  <button
                    type="button"
                    onClick={() => setAction("generate-sop")}
                    className={`w-full p-2.5 rounded-xl text-xs font-bold text-left transition-all border ${
                      action === "generate-sop"
                        ? "bg-red-50 text-red-700 border-red-200 shadow-2xs"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    Statement of Purpose (SOP)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAction("cv")}
                    className={`w-full p-2.5 rounded-xl text-xs font-bold text-left transition-all border ${
                      action === "cv"
                        ? "bg-red-50 text-red-700 border-red-200 shadow-2xs"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    German Academic CV (Lebenslauf)
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
                  Specific Focus Points
                </label>
                <textarea
                  rows={4}
                  placeholder="e.g. Highlight my 6-month formulation internship, interest in targeted nano-carriers, and lab skills..."
                  value={customInstructions}
                  onChange={(e) => setCustomInstructions(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-1 focus:ring-red-500 focus:outline-none"
                />
              </div>

              <button
                onClick={handleGenerate}
                disabled={isLoading}
                className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{isLoading ? "Generating Content..." : "Generate with Gemini AI"}</span>
              </button>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500 leading-relaxed space-y-1">
                <span className="font-bold text-slate-700 block">German SOP Standard:</span>
                German professors prefer concise, module-grounded academic rationale over personal melodrama.
              </div>
            </div>

            {/* Output Preview */}
            <div className="md:col-span-2 bg-slate-50 rounded-2xl border border-slate-200 p-5 flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Document Preview
                </span>
                {generatedContent && (
                  <button
                    onClick={handleCopy}
                    className="text-xs font-bold text-slate-700 hover:text-red-600 flex items-center gap-1 cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "Copied!" : "Copy Text"}</span>
                  </button>
                )}
              </div>

              <div className="flex-1 overflow-y-auto max-h-[480px] bg-white p-4 rounded-xl border border-slate-200 text-xs sm:text-sm leading-relaxed text-slate-800 font-serif">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center h-48 space-y-3 text-slate-400">
                    <Sparkles className="w-8 h-8 animate-spin-slow text-red-500" />
                    <span className="text-xs font-medium">Crafting German admission statement...</span>
                  </div>
                ) : generatedContent ? (
                  <div className="markdown-body space-y-3 font-sans">
                    <Markdown>{generatedContent}</Markdown>
                  </div>
                ) : (
                  <div className="text-center py-16 text-slate-400 space-y-2">
                    <FileText className="w-8 h-8 mx-auto" />
                    <p className="text-xs">Click &ldquo;Generate with Gemini AI&rdquo; to draft an academic statement.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
