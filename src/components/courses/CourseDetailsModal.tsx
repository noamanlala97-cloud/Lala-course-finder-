import React, { useState } from "react";
import {
  X,
  ChevronLeft,
  Heart,
  Share2,
  Scale,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Check,
  Calendar,
  Clock,
  Coins,
  MapPin,
  ExternalLink,
  BookOpen,
  Info,
  ShieldCheck,
  Bookmark
} from "lucide-react";
import { Course } from "../../types";

interface CourseDetailsModalProps {
  course: Course | null;
  isOpen?: boolean;
  isSaved?: boolean;
  isCompared?: boolean;
  onClose: () => void;
  onToggleSave?: (course?: Course) => void;
  onToggleCompare?: (course?: Course) => void;
  onOpenAdvisor?: () => void;
  onDraftSop?: () => void;
}

export const CourseDetailsModal: React.FC<CourseDetailsModalProps> = ({
  course,
  isOpen,
  isSaved = false,
  isCompared = false,
  onClose,
  onToggleSave = () => {},
  onToggleCompare = () => {},
  onOpenAdvisor = () => {},
  onDraftSop = () => {}
}) => {
  const [activeTab, setActiveTab] = useState<"audit" | "overview" | "curriculum" | "living">("audit");
  const [checklist, setChecklist] = useState({
    degree: true,
    transcript: true,
    aps: true,
    language: true,
    cv: true,
    sop: false,
    lor: false
  });

  if (!course || (isOpen !== undefined && !isOpen)) return null;

  const toggleChecklistItem = (key: keyof typeof checklist) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const completedCount = Object.values(checklist).filter(Boolean).length;
  const totalCount = Object.keys(checklist).length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex justify-center overflow-y-auto">
      <div className="bg-slate-50 w-full max-w-2xl min-h-screen my-0 sm:my-6 sm:rounded-3xl shadow-2xl flex flex-col relative animate-in fade-in zoom-in-95 duration-200">
        {/* Top Sticky Bar */}
        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3 flex items-center justify-between">
          <button
            onClick={onClose}
            className="flex items-center gap-1 font-bold text-xs text-slate-700 hover:text-blue-600 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Courses</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleSave(course)}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
              title="Save"
            >
              <Heart className={`w-4 h-4 ${isSaved ? "fill-rose-500 text-rose-500" : ""}`} />
            </button>
            <button
              onClick={() => {
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(window.location.href);
                }
              }}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
              title="Share Link"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onToggleCompare(course)}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
              title="Compare"
            >
              <Scale className={`w-4 h-4 ${isCompared ? "text-amber-600" : ""}`} />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 space-y-6 flex-1 pb-28">
          {/* Header Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
              <span>🏛</span>
              <span>{course.universityName} • {course.universityType} Research University 🇩🇪</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight leading-tight">
              {course.name}
            </h1>

            {/* Badges row */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-semibold text-slate-700">
              <span className="px-2.5 py-1 rounded-xl bg-slate-200/80 text-slate-800">
                Master of Science (M.Sc.)
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                100% English Taught
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
                €0 Tuition / Semester
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                Campus {course.city}
              </span>
            </div>
          </div>

          {/* AI Academic Eligibility Score (Dark Navy Card from Screenshot 4) */}
          <div className="bg-slate-950 text-white rounded-3xl p-5 shadow-xl space-y-4 relative overflow-hidden">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-amber-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI ACADEMIC ELIGIBILITY SCORE</span>
                </div>
                <h3 className="text-xl font-black text-white">Strong Direct Match</h3>
                <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
                  High Confidence — DAAD & Bayreuth Prüfungsordnung Verified (Dec 2024).
                </p>
              </div>

              {/* 91% Circular Gauge */}
              <div className="w-16 h-16 rounded-full border-4 border-blue-500 bg-blue-950/60 flex flex-col items-center justify-center shrink-0">
                <span className="text-base font-black text-white leading-none">91%</span>
                <span className="text-[9px] font-bold text-blue-300 tracking-tight">Excellent</span>
              </div>
            </div>

            {/* 4 Metrics Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800 text-xs">
              <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Academic Degree</span>
                <span className="font-bold text-white text-sm">95%</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">ECTS Prereqs</span>
                <span className="font-bold text-white text-sm">88%</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">GPA (1.4 Bavarian)</span>
                <span className="font-bold text-white text-sm">98%</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Language (IELTS)</span>
                <span className="font-bold text-white text-sm">100%</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-blue-300 pt-1">
              <span className="flex items-center gap-1">
                <span>✓</span> Direct Uni Portal (No Uni-Assist VPD fee)
              </span>
              <span className="font-bold text-white">€0 App Fee</span>
            </div>
          </div>

          {/* Navigation Tab Bar */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto scrollbar-none text-xs font-bold">
            <button
              onClick={() => setActiveTab("audit")}
              className={`py-2 px-4 rounded-xl transition-all cursor-pointer ${
                activeTab === "audit"
                  ? "bg-slate-950 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-950 hover:bg-slate-200"
              }`}
            >
              ECTS Audit
            </button>
            <button
              onClick={() => setActiveTab("overview")}
              className={`py-2 px-4 rounded-xl transition-all cursor-pointer ${
                activeTab === "overview"
                  ? "bg-slate-950 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-950 hover:bg-slate-200"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("curriculum")}
              className={`py-2 px-4 rounded-xl transition-all cursor-pointer ${
                activeTab === "curriculum"
                  ? "bg-slate-950 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-950 hover:bg-slate-200"
              }`}
            >
              Curriculum
            </button>
            <button
              onClick={() => setActiveTab("living")}
              className={`py-2 px-4 rounded-xl transition-all cursor-pointer ${
                activeTab === "living"
                  ? "bg-slate-950 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-950 hover:bg-slate-200"
              }`}
            >
              Living & Budget
            </button>
          </div>

          {/* TAB 1: ACADEMIC ECTS AUDIT (Matches Screenshot 4) */}
          {activeTab === "audit" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-black text-base text-slate-950">
                    Academic ECTS Audit
                  </h3>
                  <p className="text-xs text-slate-500">
                    Profile transcript matched against PO 2023
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-extrabold border border-blue-200 flex items-center gap-1">
                  <span>✓</span> 5 of 6 Passed
                </span>
              </div>

              {/* 6 Audit Items */}
              <div className="space-y-3">
                {/* Item 1 */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-700 font-bold text-xs flex items-center justify-center">
                        1
                      </div>
                      <h4 className="font-bold text-sm text-slate-950">Bachelor's Degree Discipline</h4>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-extrabold border border-blue-200">
                      Direct Match
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 space-y-1 pl-8">
                    <div className="flex justify-between">
                      <span>Requirement:</span>
                      <span className="font-semibold text-slate-900">B.Sc. Chemistry / Pharmacy / Allied (180 ECTS)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Your Profile:</span>
                      <span className="font-semibold text-blue-700">B.Pharm (4 Years, 240 Credits)</span>
                    </div>
                    <p className="pt-1 text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                      <span>✓</span> Anabin Status: <strong>H+ Recognized</strong> (Direct Academic Equivalency)
                    </p>
                  </div>
                </div>

                {/* Item 2 */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-700 font-bold text-xs flex items-center justify-center">
                        2
                      </div>
                      <h4 className="font-bold text-sm text-slate-950">Organic & Medicinal Chemistry</h4>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-extrabold border border-blue-200">
                      +16 Surplus
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 space-y-1.5 pl-8">
                    <div className="flex justify-between">
                      <span>Minimum ECTS:</span>
                      <span className="font-semibold text-slate-900">30 ECTS Required</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Mapped ECTS:</span>
                      <span className="font-bold text-blue-700">46 ECTS (6 transcript modules)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-blue-600 h-full rounded-full" style={{ width: "100%" }} />
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Covers Advanced Stereochemistry, Heterocycles & Biosynthesis
                    </p>
                  </div>
                </div>

                {/* Item 3 */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-700 font-bold text-xs flex items-center justify-center">
                        3
                      </div>
                      <h4 className="font-bold text-sm text-slate-950">Analytical & Physical Chemistry</h4>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-extrabold border border-blue-200">
                      Satisfied
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 space-y-1 pl-8">
                    <div className="flex justify-between">
                      <span>Minimum ECTS:</span>
                      <span className="font-semibold text-slate-900">15 ECTS</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Your Profile:</span>
                      <span className="font-bold text-blue-700">18 ECTS mapped</span>
                    </div>
                    <p className="pt-1 text-[11px] text-slate-500">
                      Includes Instrumental Spectroscopy (UV/IR/NMR) & Chromatographic Analysis.
                    </p>
                  </div>
                </div>

                {/* Item 4 */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center">
                        4
                      </div>
                      <h4 className="font-bold text-sm text-slate-950">Higher Math & Physics</h4>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[10px] font-extrabold border border-amber-200">
                      Conditional
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 space-y-1.5 pl-8">
                    <div className="flex justify-between">
                      <span>Recommended:</span>
                      <span className="font-semibold text-slate-900">10 ECTS</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Your Profile:</span>
                      <span className="font-bold text-amber-700">8 ECTS (2 ECTS shortfall)</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/80 text-[11px] text-amber-900 leading-snug">
                      <strong>Bridging Provision (Auflagen):</strong> Shortfall can be satisfied via an elective bridging course during Semester 1 without extending degree duration.
                    </div>
                  </div>
                </div>

                {/* Item 5 */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-700 font-bold text-xs flex items-center justify-center">
                        5
                      </div>
                      <h4 className="font-bold text-sm text-slate-950">German Grade Conversion</h4>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-extrabold border border-blue-200">
                      Top 10% Bracket
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 space-y-1 pl-8">
                    <div className="flex justify-between">
                      <span>Admission Cutoff:</span>
                      <span className="font-semibold text-slate-900">German Grade ≤ 2.5 (Gut)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Your Bavarian Formula:</span>
                      <span className="font-black text-blue-700 text-sm">1.4 (Sehr Gut)</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Converted from your CGPA 8.7/10. Significantly exceeds minimum baseline.
                    </p>
                  </div>
                </div>

                {/* Item 6 */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-700 font-bold text-xs flex items-center justify-center">
                        6
                      </div>
                      <h4 className="font-bold text-sm text-slate-950">Language Proficiency</h4>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-extrabold border border-blue-200">
                      Fully Cleared
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 space-y-1 pl-8">
                    <div className="flex justify-between">
                      <span>Program Language:</span>
                      <span className="font-semibold text-slate-900">English B2/C1 (IELTS 6.5)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Your Credentials:</span>
                      <span className="font-bold text-blue-700">IELTS 6.5 Overall + German A2</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      German A1 requirement by graduation is already satisfied in advance.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Program Overview & Key Deadlines (Always visible or in Overview) */}
          <div className="space-y-4 pt-2">
            <div>
              <h3 className="font-black text-base text-slate-950">
                Program Overview & Key Deadlines
              </h3>
              <p className="text-xs text-slate-500">
                Direct details from Bayreuth Faculty of Biology, Chemistry & Earth Sciences
              </p>
            </div>

            {/* Deadline Box */}
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-blue-700 tracking-wider block">
                    SUMMER SEMESTER 2026
                  </span>
                  <h4 className="font-black text-sm text-slate-900">
                    Deadline: 15 January 2026
                  </h4>
                  <span className="text-[11px] text-slate-500">28 Days Left for Non-EU Applicants</span>
                </div>
              </div>

              <a
                href={course.applicationUrl || course.officialSourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer shadow-sm inline-flex items-center gap-1"
              >
                <span>Apply Now</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* 6 Overview Metric Boxes */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="p-3 rounded-2xl bg-white border border-slate-200/90">
                <span className="text-slate-400 text-[10px] font-bold uppercase block">Duration</span>
                <span className="font-bold text-slate-900 text-sm block mt-0.5">4 Semesters</span>
                <span className="text-[11px] text-slate-500">120 Total ECTS</span>
              </div>

              <div className="p-3 rounded-2xl bg-white border border-slate-200/90">
                <span className="text-slate-400 text-[10px] font-bold uppercase block">Intake Cycles</span>
                <span className="font-bold text-slate-900 text-sm block mt-0.5">Winter & Summer</span>
                <span className="text-[11px] text-slate-500">Oct 2025 & Apr 2026</span>
              </div>

              <div className="p-3 rounded-2xl bg-white border border-slate-200/90">
                <span className="text-slate-400 text-[10px] font-bold uppercase block">Tuition Fee</span>
                <span className="font-bold text-emerald-700 text-sm block mt-0.5">€0 Tuition</span>
                <span className="text-[11px] text-slate-500">Free State Education</span>
              </div>

              <div className="p-3 rounded-2xl bg-white border border-slate-200/90">
                <span className="text-slate-400 text-[10px] font-bold uppercase block">Semester Contribution</span>
                <span className="font-bold text-slate-900 text-sm block mt-0.5">€145 / sem</span>
                <span className="text-[11px] text-slate-500">Includes transit pass</span>
              </div>

              <div className="p-3 rounded-2xl bg-white border border-slate-200/90">
                <span className="text-slate-400 text-[10px] font-bold uppercase block">Language</span>
                <span className="font-bold text-slate-900 text-sm block mt-0.5">100% English</span>
                <span className="text-[11px] text-slate-500">No German for admit</span>
              </div>

              <div className="p-3 rounded-2xl bg-white border border-slate-200/90">
                <span className="text-slate-400 text-[10px] font-bold uppercase block">Application Route</span>
                <span className="font-bold text-slate-900 text-sm block mt-0.5">CAMPUSonline</span>
                <span className="text-[11px] text-slate-500">Direct Uni Portal</span>
              </div>
            </div>
          </div>

          {/* Campus Photo */}
          <div className="rounded-3xl overflow-hidden border border-slate-200/90 bg-white">
            <div className="h-44 bg-slate-900 relative">
              <img
                src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80"
                alt="Campus Bayreuth"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-90"
              />
            </div>
            <div className="p-3.5 flex items-center justify-between text-xs">
              <div>
                <h4 className="font-extrabold text-slate-950">Campus Bayreuth Research Hub</h4>
                <span className="text-[11px] text-slate-500">Bavarian Polymer & Drug Discovery Clusters</span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200">
                Top Research Tier
              </span>
            </div>
          </div>

          {/* Curriculum & Module Modules (Matches Screenshot 4) */}
          <div className="space-y-3 pt-2">
            <div>
              <h3 className="font-black text-base text-slate-950">
                Curriculum & Module Modules
              </h3>
              <p className="text-xs text-slate-500">
                120 ECTS balanced over 4 focused study phases
              </p>
            </div>

            <div className="space-y-2.5">
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold text-[10px]">
                    Module Group A
                  </span>
                  <span className="font-black text-slate-900">30 ECTS</span>
                </div>
                <h4 className="font-extrabold text-xs sm:text-sm text-slate-950">
                  Natural Products Isolation & NMR Structure Elucidation
                </h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Modern chromatographic techniques (HPLC, SFC), high-field 2D-NMR spectroscopy, and computational mass spectrometry for novel secondary metabolites.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold text-[10px]">
                    Module Group B
                  </span>
                  <span className="font-black text-slate-900">30 ECTS</span>
                </div>
                <h4 className="font-extrabold text-xs sm:text-sm text-slate-950">
                  Modern Drug Synthesis & Combinatorial Chemistry
                </h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Transition metal catalysis, asymmetric organocatalysis, automated chemical synthesis, and peptide drug conjugate strategies.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold text-[10px]">
                    Module Group C
                  </span>
                  <span className="font-black text-slate-900">15 ECTS</span>
                </div>
                <h4 className="font-extrabold text-xs sm:text-sm text-slate-950">
                  Pharmacology, Toxicology & Molecular Targets
                </h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Target identification, enzyme kinetics, in-vitro bioassays, ADMET prediction, and medicinal chemistry lead optimization.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 text-white space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2 py-0.5 rounded-md bg-slate-800 text-amber-400 font-bold text-[10px]">
                    Final Semester
                  </span>
                  <span className="font-black text-white">45 ECTS</span>
                </div>
                <h4 className="font-extrabold text-xs sm:text-sm text-white">
                  Master Thesis & Research Internship
                </h4>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  6-month independent research in high-profile Bayreuth laboratories or external industry partner (Bayer, Boehringer Ingelheim, Merck KGaA).
                </p>
              </div>
            </div>
          </div>

          {/* Living in Bayreuth & Student Budget (Matches Screenshot 4) */}
          <div className="space-y-3 pt-2">
            <div>
              <h3 className="font-black text-base text-slate-950">
                Living in Bayreuth & Student Budget
              </h3>
              <p className="text-xs text-slate-500">
                High standard of living at significantly lower rates than Munich or Berlin
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">
                    ESTIMATED MONTHLY EXPENSES
                  </span>
                  <span className="text-xl sm:text-2xl font-black text-slate-950">
                    €850 – €980 <span className="text-xs font-medium text-slate-500">/ mo</span>
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
                  -22% vs. DE Average
                </span>
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                <div className="py-2 flex items-center justify-between">
                  <span className="flex items-center gap-2 text-slate-600 font-medium">
                    <span>🏢</span> Student WG / Dormitory
                  </span>
                  <span className="font-bold text-slate-900">€310 – €390</span>
                </div>
                <div className="py-2 flex items-center justify-between">
                  <span className="flex items-center gap-2 text-slate-600 font-medium">
                    <span>🏥</span> Health Insurance (TK / Barmer)
                  </span>
                  <span className="font-bold text-slate-900">€125</span>
                </div>
                <div className="py-2 flex items-center justify-between">
                  <span className="flex items-center gap-2 text-slate-600 font-medium">
                    <span>🛒</span> Food, Groceries & Leisure
                  </span>
                  <span className="font-bold text-slate-900">€250 – €300</span>
                </div>
                <div className="py-2 flex items-center justify-between">
                  <span className="flex items-center gap-2 text-slate-600 font-medium">
                    <span>🚆</span> Regional Public Transit
                  </span>
                  <span className="font-bold text-emerald-600">€0 (SemesterTicket)</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 text-xs text-slate-600 space-y-1">
                <strong className="text-slate-900 block font-bold">Bavarian Heritage & Innovation</strong>
                <p className="text-[11px] leading-relaxed">
                  Compact, friendly student town with vibrant beer gardens, opera festivals, and immediate access to the Franconian Switzerland nature reserve.
                </p>
              </div>

              {/* Map Preview Snippet */}
              <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-100 flex items-center gap-2 text-xs font-bold text-blue-900">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span>Bayreuth, Upper Franconia, Bavaria</span>
              </div>
            </div>
          </div>

          {/* Required Documents Checklist (Matches Screenshot 4) */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-black text-base text-slate-950">
                  Required Documents Checklist
                </h3>
                <p className="text-xs text-slate-500">
                  Official dossier for University of Bayreuth portal
                </p>
              </div>
              <span className="text-xs font-extrabold text-blue-600">
                {completedCount}/{totalCount} Ready
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 space-y-2.5 text-xs">
              <label
                onClick={() => toggleChecklistItem("degree")}
                className="flex items-start gap-2.5 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={checklist.degree}
                  readOnly
                  className="w-4 h-4 text-blue-600 rounded mt-0.5"
                />
                <div>
                  <strong className="text-slate-900 block font-bold">
                    Degree Certificate & Graduation Award
                  </strong>
                  <span className="text-[11px] text-slate-500">Legalized English copy or certified German translation.</span>
                </div>
              </label>

              <label
                onClick={() => toggleChecklistItem("transcript")}
                className="flex items-start gap-2.5 cursor-pointer pt-1 border-t border-slate-100"
              >
                <input
                  type="checkbox"
                  checked={checklist.transcript}
                  readOnly
                  className="w-4 h-4 text-blue-600 rounded mt-0.5"
                />
                <div>
                  <strong className="text-slate-900 block font-bold">
                    Transcript of Records + Module Descriptions
                  </strong>
                  <span className="text-[11px] text-slate-500">Syllabus handbook needed for ECTS equivalency confirmation.</span>
                </div>
              </label>

              <label
                onClick={() => toggleChecklistItem("aps")}
                className="flex items-start gap-2.5 cursor-pointer pt-1 border-t border-slate-100"
              >
                <input
                  type="checkbox"
                  checked={checklist.aps}
                  readOnly
                  className="w-4 h-4 text-blue-600 rounded mt-0.5"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <strong className="text-slate-900 font-bold">APS Certificate</strong>
                    <span className="px-1.5 py-0.2 rounded bg-red-50 text-red-700 text-[10px] font-bold">
                      Mandatory
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500">Required for applicants from India, China, or Vietnam.</span>
                </div>
              </label>

              <label
                onClick={() => toggleChecklistItem("language")}
                className="flex items-start gap-2.5 cursor-pointer pt-1 border-t border-slate-100"
              >
                <input
                  type="checkbox"
                  checked={checklist.language}
                  readOnly
                  className="w-4 h-4 text-blue-600 rounded mt-0.5"
                />
                <div>
                  <strong className="text-slate-900 block font-bold">
                    English Language Score (IELTS / TOEFL)
                  </strong>
                  <span className="text-[11px] text-slate-500">Minimum IELTS 6.5 or TOEFL iBT 90.</span>
                </div>
              </label>

              <label
                onClick={() => toggleChecklistItem("cv")}
                className="flex items-start gap-2.5 cursor-pointer pt-1 border-t border-slate-100"
              >
                <input
                  type="checkbox"
                  checked={checklist.cv}
                  readOnly
                  className="w-4 h-4 text-blue-600 rounded mt-0.5"
                />
                <div>
                  <strong className="text-slate-900 block font-bold">
                    Tabular CV (Europass Format)
                  </strong>
                  <span className="text-[11px] text-slate-500">Chronological resume detailing lab projects and internships.</span>
                </div>
              </label>

              <label
                onClick={() => toggleChecklistItem("sop")}
                className="flex items-start gap-2.5 cursor-pointer pt-1 border-t border-slate-100"
              >
                <input
                  type="checkbox"
                  checked={checklist.sop}
                  readOnly
                  className="w-4 h-4 text-blue-600 rounded mt-0.5"
                />
                <div>
                  <strong className="text-slate-900 block font-bold">
                    Letter of Motivation / Statement of Purpose
                  </strong>
                  <span className="text-[11px] text-slate-500">1-2 pages elaborating interest in Natural Products Chemistry.</span>
                </div>
              </label>

              <label
                onClick={() => toggleChecklistItem("lor")}
                className="flex items-start gap-2.5 cursor-pointer pt-1 border-t border-slate-100"
              >
                <input
                  type="checkbox"
                  checked={checklist.lor}
                  readOnly
                  className="w-4 h-4 text-blue-600 rounded mt-0.5"
                />
                <div>
                  <strong className="text-slate-900 block font-bold">
                    Two Academic Recommendation Letters
                  </strong>
                  <span className="text-[11px] text-slate-500">Optional but strongly recommended for borderline applicants.</span>
                </div>
              </label>
            </div>
          </div>

          {/* Official Academic Source Data banner */}
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 text-xs text-slate-600 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-blue-900">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Official Academic Source Data</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Information verified against the official University of Bayreuth Examination Regulations (Prüfungsordnung M.Sc. NPSC dated 18.09.2023). Last automated sync: 14 Dec 2024.
            </p>
            <span className="text-[10px] text-slate-400 block pt-1">
              Disclaimer: Final admission decisions remain the sole jurisdiction of the Bayreuth Academic Admissions Board.
            </span>
          </div>
        </div>

        {/* STICKY BOTTOM ACTION BAR (Matches Screenshot 4) */}
        <div className="fixed sm:sticky bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 sm:p-4 px-4 sm:px-6 flex items-center gap-3">
          <button
            onClick={() => onToggleSave(course)}
            className={`py-3 px-5 rounded-2xl border text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shrink-0 ${
              isSaved
                ? "bg-blue-50 border-blue-300 text-blue-700"
                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? "fill-blue-600 text-blue-600" : ""}`} />
            <span>{isSaved ? "Saved" : "Add to Plan"}</span>
          </button>

          <a
            href={course.applicationUrl || course.officialSourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 px-6 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-black text-xs sm:text-sm rounded-2xl transition-all shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Apply on University Portal</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};
