import React, { useState } from "react";
import {
  BookOpen,
  ShieldCheck,
  Coins,
  FileCheck,
  GraduationCap,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Award,
  CheckCircle2,
  Calculator,
  Calendar,
  Clock,
  ArrowRight,
  Sparkles
} from "lucide-react";

export const ResourcesView: React.FC = () => {
  const [activeGuideTab, setActiveGuideTab] = useState<"pathway" | "finances" | "docs">("pathway");

  // Bavarian formula state
  const [nMax, setNMax] = useState<number>(10);
  const [nMin, setNMin] = useState<number>(4);
  const [nd, setNd] = useState<number>(8.7);

  // Formula: German Grade = 1 + 3 * (Nmax - Nd) / (Nmax - Nmin)
  const calculateGermanGrade = () => {
    if (nMax <= nMin) return "2.5";
    if (nd >= nMax) return "1.0";
    if (nd <= nMin) return "4.0";
    const grade = 1 + (3 * (nMax - nd)) / (nMax - nMin);
    return Math.max(1.0, Math.min(4.0, grade)).toFixed(1);
  };

  const germanGrade = calculateGermanGrade();
  const numGrade = parseFloat(germanGrade);
  let gradeInterpretation = "Sehr Gut (Very Good)";
  let gradeBadge = "bg-blue-50 text-blue-700 border-blue-200";
  if (numGrade > 1.5 && numGrade <= 2.5) {
    gradeInterpretation = "Gut (Good)";
    gradeBadge = "bg-emerald-50 text-emerald-700 border-emerald-200";
  } else if (numGrade > 2.5 && numGrade <= 3.5) {
    gradeInterpretation = "Befriedigend (Satisfactory)";
    gradeBadge = "bg-amber-50 text-amber-700 border-amber-200";
  } else if (numGrade > 3.5) {
    gradeInterpretation = "Ausreichend (Sufficient)";
    gradeBadge = "bg-rose-50 text-rose-700 border-rose-200";
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6 pb-24">
      {/* Top Pill & Title */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-white text-[11px] font-extrabold tracking-wider uppercase shadow-sm">
          <span>STUDY IN GERMANY WIKI</span>
          <span>🇩🇪</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
          International Student Guide
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
          Essential regulations, visa timelines, cost breakdowns, and step-by-step pathways to study tuition-free in Germany.
        </p>
      </div>

      {/* 3-Tab Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveGuideTab("pathway")}
          className={`py-2 px-4 rounded-xl transition-all cursor-pointer ${
            activeGuideTab === "pathway"
              ? "bg-slate-950 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-950 hover:bg-slate-100"
          }`}
        >
          General Pathway
        </button>
        <button
          onClick={() => setActiveGuideTab("finances")}
          className={`py-2 px-4 rounded-xl transition-all cursor-pointer ${
            activeGuideTab === "finances"
              ? "bg-slate-950 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-950 hover:bg-slate-100"
          }`}
        >
          Finances & Visa
        </button>
        <button
          onClick={() => setActiveGuideTab("docs")}
          className={`py-2 px-4 rounded-xl transition-all cursor-pointer ${
            activeGuideTab === "docs"
              ? "bg-slate-950 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-950 hover:bg-slate-100"
          }`}
        >
          Document Prep
        </button>
      </div>

      {/* 4 PROCESS CARDS (From Screenshot 6) */}
      <div className="space-y-4">
        {/* STEP 1 */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-4 sm:p-5 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 font-black text-xs flex items-center justify-center">
                1
              </div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-950">
                Step 1: Check Anabin Eligibility
              </h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-extrabold border border-blue-200 shrink-0">
              Mandatory First Step
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Verify whether your home bachelor's degree is classified as <strong className="text-slate-900">H+</strong> in the German Anabin database. An H+ status confirms your degree is recognized for direct master's entry without Studienkolleg.
          </p>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs space-y-1.5">
            <div className="flex items-center justify-between text-slate-700 font-semibold">
              <span className="text-emerald-700 flex items-center gap-1 font-bold">
                ✓ H+ Recognized (Direct Entry)
              </span>
              <span className="text-slate-500">kmk.anabin.de verified</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Equivalent to 3-4 Year German B.Sc. in allied scientific fields.
            </p>
          </div>

          <a
            href="https://anabin.kmk.org"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
          >
            <span>Check Your University on Anabin Database</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* STEP 2 */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-4 sm:p-5 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 font-black text-xs flex items-center justify-center">
                2
              </div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-950">
                Step 2: Obtain APS Certificate
              </h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 text-[10px] font-extrabold border border-red-200 shrink-0">
              Mandatory for Non-EU
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Applicants from <strong className="text-slate-900">India, China, and Vietnam</strong> must obtain an Akademische Prüfstelle (APS) certificate before applying for university admission or student visa.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Processing Time</span>
              <span className="font-bold text-slate-900 block mt-0.5">3–5 Weeks</span>
              <span className="text-[10px] text-slate-500">Digital Paperless</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Official Fee</span>
              <span className="font-bold text-slate-900 block mt-0.5">~€210</span>
              <span className="text-[10px] text-slate-500">₹18,000 INR</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Strategic Tip</span>
              <span className="font-bold text-blue-700 block mt-0.5">Apply Early</span>
              <span className="text-[10px] text-slate-500">After sem 7 marksheet</span>
            </div>
          </div>

          <a
            href="https://aps-india.de"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
          >
            <span>Official APS India Portal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* STEP 3 */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-4 sm:p-5 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 font-black text-xs flex items-center justify-center">
                3
              </div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-950">
                Step 3: Uni-Assist VPD vs. Direct Portal
              </h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-extrabold shrink-0">
              Application Route
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            German universities use either <strong className="text-slate-900">Uni-Assist</strong> (Vorprüfungsdokumentation - VPD) to verify non-EU credentials, or their own <strong className="text-slate-900">direct portals</strong> (e.g. CAMPUSonline, TUMonline).
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <strong className="text-slate-900 block font-bold">Uni-Assist VPD</strong>
              <p className="text-[11px] text-slate-500">
                €75 for first university, €30 for each subsequent application. Processing takes 4–6 weeks.
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-100 space-y-1">
              <strong className="text-blue-900 block font-bold">Direct University Portal</strong>
              <p className="text-[11px] text-blue-700">
                Often €0 application fee. Direct upload of certified PDF transcripts with immediate submission receipt.
              </p>
            </div>
          </div>
        </div>

        {/* STEP 4 */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-4 sm:p-5 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 font-black text-xs flex items-center justify-center">
                4
              </div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-950">
                Step 4: Blocked Account & Visa
              </h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-extrabold border border-emerald-200 shrink-0">
              Final Stage
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            To secure a German National Student Visa (Type D), you must prove financial resources via an approved <strong className="text-slate-900">Sperrkonto</strong> (Blocked Account).
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Monthly Amount</span>
              <span className="font-bold text-slate-900 block mt-0.5">€992 / mo</span>
              <span className="text-[10px] text-slate-500">Living allowance</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Annual Deposit</span>
              <span className="font-bold text-blue-700 block mt-0.5">€11,904</span>
              <span className="text-[10px] text-slate-500">2025/26 mandate</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Providers</span>
              <span className="font-bold text-slate-900 block mt-0.5">Expatrio, Fintiba</span>
              <span className="text-[10px] text-slate-500">Federal approved</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Health Insurance</span>
              <span className="font-bold text-slate-900 block mt-0.5">€125 / mo</span>
              <span className="text-[10px] text-slate-500">TK / Barmer</span>
            </div>
          </div>

          <a
            href="https://www.expatrio.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
          >
            <span>Open Blocked Account (Expatrio / Fintiba)</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* GERMAN GRADING SCALE CALCULATOR (Modified Bavarian Formula) */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-4 sm:p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-blue-600" />
          <div>
            <h3 className="font-extrabold text-sm sm:text-base text-slate-950">
              German Grading Scale Calculator
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Modified Bavarian Formula (Bayerische Formel)
            </p>
          </div>
        </div>

        {/* Formula Display Box */}
        <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-100 text-xs text-blue-950 font-mono text-center">
          German Grade = 1 + 3 × (Nmax - Nd) / (Nmax - Nmin)
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-semibold">
          <div>
            <label className="block text-slate-600 mb-1">Max Grade (Nmax)</label>
            <input
              type="number"
              value={nMax}
              onChange={(e) => setNMax(parseFloat(e.target.value) || 10)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
            />
          </div>
          <div>
            <label className="block text-slate-600 mb-1">Min Pass Grade (Nmin)</label>
            <input
              type="number"
              value={nMin}
              onChange={(e) => setNMin(parseFloat(e.target.value) || 4)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
            />
          </div>
          <div>
            <label className="block text-slate-600 mb-1">Your Grade / CGPA (Nd)</label>
            <input
              type="number"
              step="0.1"
              value={nd}
              onChange={(e) => setNd(parseFloat(e.target.value) || 8.7)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-blue-700"
            />
          </div>
        </div>

        {/* Result Card */}
        <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              CONVERTED GERMAN GRADE
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl sm:text-3xl font-black text-amber-400">
                {germanGrade}
              </span>
              <span className="text-xs font-bold text-slate-300">
                {gradeInterpretation}
              </span>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
            ✓ High Match Probability
          </span>
        </div>

        {/* Quick Reference Table */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] pt-1 border-t border-slate-100">
          <div className="p-2 rounded-xl bg-slate-50">
            <strong className="text-slate-900 block font-bold">1.0 – 1.5</strong>
            <span className="text-slate-500">Sehr Gut (Top 10%)</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-50">
            <strong className="text-slate-900 block font-bold">1.6 – 2.5</strong>
            <span className="text-slate-500">Gut (NC Standard)</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-50">
            <strong className="text-slate-900 block font-bold">2.6 – 3.5</strong>
            <span className="text-slate-500">Befriedigend</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-50">
            <strong className="text-slate-900 block font-bold">3.6 – 4.0</strong>
            <span className="text-slate-500">Ausreichend (Pass)</span>
          </div>
        </div>
      </div>

      {/* KEY APPLICATION DEADLINES FOR 2025/2026 */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-4 sm:p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          <h3 className="font-extrabold text-sm sm:text-base text-slate-950">
            Key Application Deadlines for 2025/2026
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-black text-slate-950 text-sm">Winter Semester 2025/26</span>
              <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white font-bold text-[10px]">
                Main Intake
              </span>
            </div>
            <p className="text-slate-600">Application Window: <strong>15 April – 15 July 2025</strong></p>
            <p className="text-[11px] text-blue-700 font-medium">
              Best time to apply: <strong>May – June</strong> (to receive admission in time for visa appointment)
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-black text-slate-950 text-sm">Summer Semester 2026</span>
              <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-bold text-[10px]">
                Spring Intake
              </span>
            </div>
            <p className="text-slate-600">Application Window: <strong>15 Nov 2025 – 15 Jan 2026</strong></p>
            <p className="text-[11px] text-slate-500 font-medium">
              Best time to apply: <strong>December</strong> (for classes beginning in April 2026)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
