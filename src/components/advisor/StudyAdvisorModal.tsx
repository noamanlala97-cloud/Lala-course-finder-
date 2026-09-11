import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Sparkles,
  Send,
  User,
  Bot,
  ShieldCheck,
  ExternalLink,
  BookOpen,
  ArrowRight
} from "lucide-react";
import Markdown from "react-markdown";
import { StudentProfile } from "../../types";

interface Message {
  role: "user" | "model";
  content: string;
}

interface StudyAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentProfile: StudentProfile;
  onSelectCourseByName?: (name: string) => void;
}

const SUGGESTED_PROMPTS = [
  "Which English-taught public universities accept my B.Pharm degree?",
  "Find programs with Summer intake that have €0 tuition fee.",
  "What are my chances for Heidelberg M.Sc. Molecular Biosciences?",
  "Why am I not eligible for RWTH Aachen Computer Science?",
  "Which pharmaceutical master's programs have the lowest language requirement?",
  "Explain what an APS certificate is and when I need it."
];

export const StudyAdvisorModal: React.FC<StudyAdvisorModalProps> = ({
  isOpen,
  onClose,
  studentProfile,
  onSelectCourseByName
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      content: `Hello! I am the **LALA AI Study Advisor** 🇩🇪.\n\nI have reviewed your academic profile with a **${studentProfile.degree}** (CGPA ${studentProfile.cgpa}/4.0, IELTS ${studentProfile.ielts || "7.0"}).\n\nHow can I guide your German university applications today? You can ask me about degree compatibility, ECTS conversions, summer intakes, or specific university requirements.`
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  if (!isOpen) return null;

  const handleSend = async (userText: string) => {
    if (!userText.trim() || loading) return;

    const newMsgs: Message[] = [...messages, { role: "user", content: userText }];
    setMessages(newMsgs);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/advisor/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          conversationHistory: newMsgs
        })
      });

      const data = await res.json();
      setMessages([
        ...newMsgs,
        {
          role: "model",
          content: data.reply || "I apologize, but I could not formulate a response. Please try again."
        }
      ]);
    } catch (err) {
      setMessages([
        ...newMsgs,
        {
          role: "model",
          content: "Sorry, I had trouble contacting the admissions advisor engine. Please try again."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[90vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 to-amber-500 p-0.5 shadow-sm">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-amber-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm text-white">LALA AI Study Advisor</h3>
                <span className="text-[10px] bg-red-600/30 text-red-300 border border-red-500/40 px-2 py-0.2 rounded font-bold uppercase">
                  Official Engine
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Grounded in actual German university regulations & student profile
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

        {/* Chat History */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs sm:text-sm">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {m.role === "model" && (
                <div className="w-8 h-8 rounded-xl bg-red-100 text-red-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`p-4 rounded-2xl max-w-xl space-y-2 leading-relaxed ${
                  m.role === "user"
                    ? "bg-red-600 text-white font-medium rounded-tr-none"
                    : "bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-none"
                }`}
              >
                {m.role === "user" ? (
                  <p>{m.content}</p>
                ) : (
                  <div className="markdown-body space-y-2">
                    <Markdown>{m.content}</Markdown>
                  </div>
                )}
              </div>

              {m.role === "user" && (
                <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-xl bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-600 flex items-center gap-2 text-xs">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                <span>Consulting Prüfungsordnung database...</span>
              </div>
            </div>
          )}
        </div>

        {/* Suggested Quick Prompts */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 overflow-x-auto">
          <span className="text-[11px] font-bold text-slate-400 block mb-1.5 uppercase tracking-wider">
            Suggested Questions:
          </span>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {SUGGESTED_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(prompt)}
                className="whitespace-nowrap px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about course eligibility, GPA conversions, ECTS credits, or deadlines..."
              className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500/30 text-slate-900"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-xl font-bold transition-colors cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400">
            <span>Powered by Gemini & official Prüfungsordnungen</span>
            <span>Final admission decisions determined by the respective university</span>
          </div>
        </div>
      </div>
    </div>
  );
};
