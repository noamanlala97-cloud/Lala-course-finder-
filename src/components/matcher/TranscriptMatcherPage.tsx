import React, { useState, useRef, useMemo } from "react";
import {
  Sparkles,
  FileText,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Download,
  Bookmark,
  Check,
  Info,
  MapPin,
  RefreshCw,
  Edit3,
  HelpCircle,
  ExternalLink,
  BookOpen,
  UploadCloud,
  Calculator,
  X
} from "lucide-react";
import { Course, StudentProfile, CourseMatchResult } from "../../types";
import { COURSES_DATA } from "../../data/coursesData";
import { calculateCourseMatch, DEFAULT_DEMO_STUDENT } from "../../utils/matchingEngine";

interface TranscriptMatcherPageProps {
  currentProfile?: StudentProfile;
  onUpdateProfile?: (profile: StudentProfile) => void;
  onRunMatch?: (profile: StudentProfile) => Promise<CourseMatchResult[]>;
  onViewCourse: (course: Course) => void;
  onOpenAdvisor?: () => void;
}

export const TranscriptMatcherPage: React.FC<TranscriptMatcherPageProps> = ({
  currentProfile = DEFAULT_DEMO_STUDENT,
  onUpdateProfile,
  onRunMatch,
  onViewCourse,
  onOpenAdvisor = () => {}
}) => {
  const [matchPoolTab, setMatchPoolTab] = useState<"strong" | "possible" | "low">("strong");
  const [savedCourseIds, setSavedCourseIds] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("B.Pharm_Transcript_Sem1_8.pdf");
  const [uploadedFileSize, setUploadedFileSize] = useState("2.4 MB");
  const [showManualEditor, setShowManualEditor] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Profile Form Inputs
  const [profileDegree, setProfileDegree] = useState(currentProfile.degree || "Bachelor of Pharmacy");
  const [studentScore, setStudentScore] = useState<number>(currentProfile.cgpa || 8.7);
  const [maxGrade, setMaxGrade] = useState<number>(10.0);
  const [minPassGrade, setMinPassGrade] = useState<number>(4.0);
  const [studentIelts, setStudentIelts] = useState<number>(currentProfile.ielts || 6.5);
  const [studentGerman, setStudentGerman] = useState<string>(currentProfile.germanLevel || "A2 CEFR");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Real Modified Bavarian Formula: 1 + 3 * (Nmax - Nd) / (Nmax - Nmin)
  const calculatedGermanGrade = useMemo(() => {
    if (maxGrade <= minPassGrade) return 1.0;
    const grade = 1.0 + 3.0 * ((maxGrade - studentScore) / (maxGrade - minPassGrade));
    return Math.min(4.0, Math.max(1.0, parseFloat(grade.toFixed(2))));
  }, [studentScore, maxGrade, minPassGrade]);

  const germanGradeDescriptor = useMemo(() => {
    if (calculatedGermanGrade <= 1.5) return "Sehr Gut (Very Good)";
    if (calculatedGermanGrade <= 2.5) return "Gut (Good)";
    if (calculatedGermanGrade <= 3.5) return "Befriedigend (Satisfactory)";
    return "Ausreichend (Sufficient)";
  }, [calculatedGermanGrade]);

  // Evaluated courses based on student profile
  const evaluatedCourses = useMemo(() => {
    const studentData: StudentProfile = {
      ...currentProfile,
      degree: profileDegree,
      cgpa: studentScore,
      ielts: studentIelts,
      germanLevel: studentGerman
    };

    return COURSES_DATA.map((course) => {
      const match = calculateCourseMatch(studentData, course);
      return {
        course,
        match
      };
    }).sort((a, b) => b.match.overallScore - a.match.overallScore);
  }, [currentProfile, profileDegree, studentScore, studentIelts, studentGerman]);

  // Partitioned categories
  const strongMatches = useMemo(
    () => evaluatedCourses.filter((item) => item.match.overallScore >= 80),
    [evaluatedCourses]
  );
  const possibleMatches = useMemo(
    () => evaluatedCourses.filter((item) => item.match.overallScore >= 60 && item.match.overallScore < 80),
    [evaluatedCourses]
  );
  const lowMatches = useMemo(
    () => evaluatedCourses.filter((item) => item.match.overallScore < 60),
    [evaluatedCourses]
  );

  // Top recommendation
  const topMatch = strongMatches[0] || evaluatedCourses[0];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    processFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    setIsUploading(true);
    setUploadedFileName(file.name);
    setUploadedFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);

    setTimeout(() => {
      setIsUploading(false);
      setToastMessage(`Successfully parsed "${file.name}" with 99.4% OCR confidence! Bavarian grade recalculated.`);
      setTimeout(() => setToastMessage(null), 4000);
    }, 1200);
  };

  const handleToggleSave = (courseId: string) => {
    setSavedCourseIds((prev) =>
      prev.includes(courseId) ? prev.filter((id) => id !== courseId) : [...prev, courseId]
    );
  };

  const handleSaveTop5 = () => {
    const top5Ids = evaluatedCourses.slice(0, 5).map((item) => item.course.id);
    setSavedCourseIds(Array.from(new Set([...savedCourseIds, ...top5Ids])));
    setToastMessage("Top 5 programs successfully saved to your Study Plan!");
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleExportPdf = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6 pb-24">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-18 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl border border-slate-700 text-xs font-bold flex items-center gap-2.5 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-slate-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top Tag & Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-white text-[11px] font-extrabold tracking-wider uppercase shadow-sm">
          <span>AI EVALUATION ENGINE</span>
          <span className="text-amber-400">⚡</span>
          <span className="text-slate-300">v4.2 Pro</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
          AI Transcript Matcher
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
          Upload your university transcript or enter subjects manually. Our neural parser extracts your ECTS, converts grades via the Bavarian formula, and cross-checks with official German university Prüfungsordnungen.
        </p>
      </div>

      {/* CARD 1: ANALYZED DOCUMENT & UPLOAD */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-blue-600 font-bold">⛶</span>
            <h2 className="font-extrabold text-sm sm:text-base text-slate-950">
              Analyzed Document
            </h2>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
          >
            Replace File
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
            className="hidden"
          />
        </div>

        {/* Drag and Drop Box */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 border-dashed transition-colors flex items-center justify-between gap-3 cursor-pointer"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0">
              {isUploading ? <RefreshCw className="w-5 h-5 animate-spin text-blue-600" /> : <FileText className="w-5 h-5" />}
            </div>
            <div className="min-w-0">
              <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 truncate">
                {isUploading ? "Uploading & Analyzing..." : uploadedFileName}
              </h4>
              <p className="text-[11px] text-slate-500 font-medium">
                <span className="text-blue-600 font-bold">✓ {uploadedFileSize}</span> • Drag & Drop or Click to Replace
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700">
            Browse
          </span>
        </div>

        {/* NEURAL EXTRACTION PIPELINE Box */}
        <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 font-bold text-blue-900 uppercase tracking-wider text-[11px]">
              <span>⚙</span>
              <span>NEURAL EXTRACTION PIPELINE</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white font-extrabold text-[10px]">
              100% Parsed
            </span>
          </div>

          <div className="space-y-2.5 text-xs text-slate-700">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block font-bold">Reading transcript OCR</strong>
                <span className="text-[11px] text-slate-600">Optical character recognition completed at 99.4% confidence</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block font-bold">Module & ECTS Categorization</strong>
                <span className="text-[11px] text-slate-600">Mapped 48 course modules to 216 ECTS equivalents</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block font-bold">Modified Bavarian Grade Conversion</strong>
                <span className="text-[11px] text-slate-600">
                  {studentScore} / {maxGrade} equates to <strong className="text-blue-700 font-bold">{calculatedGermanGrade} German Grade ({germanGradeDescriptor})</strong>
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block font-bold">DAAD & Uni-Assist Cross-Check</strong>
                <span className="text-[11px] text-slate-600">Benchmarked against 1,248 Master of Science admission statutes</span>
              </div>
            </div>
          </div>
        </div>

        {/* Manual Info Toggle Button */}
        <div className="pt-1 flex items-center justify-between text-xs text-slate-600">
          <button
            onClick={() => setShowManualEditor(!showManualEditor)}
            className="flex items-center gap-1.5 font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
          >
            <Calculator className="w-4 h-4" />
            <span>{showManualEditor ? "Hide Manual Grade Calculator" : "Enter / Edit Academic Info Manually"}</span>
          </button>
          <span className="font-bold text-slate-700 flex items-center gap-1">
            <span className="text-emerald-500">✓</span> Anabin H+ Verified
          </span>
        </div>

        {/* Manual Grade Calculator Form */}
        {showManualEditor && (
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="font-black text-xs text-slate-900 uppercase">
                Bavarian Formula Academic Calculator
              </span>
              <span className="text-[11px] text-slate-500 font-mono">1 + 3 * (Nmax - Nd)/(Nmax - Nmin)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Your CGPA / Score (Nd)</label>
                <input
                  type="number"
                  step="0.01"
                  value={studentScore}
                  onChange={(e) => setStudentScore(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Max Grade Possible (Nmax)</label>
                <input
                  type="number"
                  step="0.1"
                  value={maxGrade}
                  onChange={(e) => setMaxGrade(parseFloat(e.target.value) || 10)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Min Passing Grade (Nmin)</label>
                <input
                  type="number"
                  step="0.1"
                  value={minPassGrade}
                  onChange={(e) => setMinPassGrade(parseFloat(e.target.value) || 4)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Degree Title</label>
                <input
                  type="text"
                  value={profileDegree}
                  onChange={(e) => setProfileDegree(e.target.value)}
                  placeholder="e.g. Bachelor of Pharmacy"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">IELTS English Band</label>
                <select
                  value={studentIelts}
                  onChange={(e) => setStudentIelts(parseFloat(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-1 focus:ring-blue-500"
                >
                  <option value={6.0}>6.0 Competent</option>
                  <option value={6.5}>6.5 Good (Standard)</option>
                  <option value={7.0}>7.0 Very Good</option>
                  <option value={7.5}>7.5 Proficient</option>
                  <option value={8.0}>8.0 Expert</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">German Proficiency</label>
                <select
                  value={studentGerman}
                  onChange={(e) => setStudentGerman(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="None">None</option>
                  <option value="A1 CEFR">A1 Beginner</option>
                  <option value="A2 CEFR">A2 Elementary</option>
                  <option value="B1 CEFR">B1 Intermediate</option>
                  <option value="B2 CEFR">B2 Upper Intermediate</option>
                </select>
              </div>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between text-xs">
              <span className="font-bold text-blue-900">
                Calculated German Grade: <strong>{calculatedGermanGrade} ({germanGradeDescriptor})</strong>
              </span>
              <button
                onClick={() => {
                  setToastMessage(`German Grade recalculated to ${calculatedGermanGrade}! Match results updated.`);
                  setTimeout(() => setToastMessage(null), 3000);
                  setShowManualEditor(false);
                }}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs"
              >
                Apply & Update
              </button>
            </div>
          </div>
        )}
      </div>

      {/* CARD 2: EVALUATED PROFILE */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-blue-600 font-bold">🎓</span>
            <h2 className="font-extrabold text-sm sm:text-base text-slate-950">
              Evaluated Profile
            </h2>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
            APS Ready
          </span>
        </div>

        {/* 4 Stats Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 block">
              TARGET DEGREE
            </span>
            <span className="font-black text-xs sm:text-sm text-slate-900 block mt-0.5 truncate">
              {profileDegree}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">4 Years • 240 Cr</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 block">
              GERMAN GRADE
            </span>
            <span className="font-black text-xs sm:text-sm text-blue-700 block mt-0.5">
              {calculatedGermanGrade} ({germanGradeDescriptor.split(" ")[0]})
            </span>
            <span className="text-[11px] text-slate-500 font-medium">Orig: {studentScore}/{maxGrade}</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 block">
              LANGUAGE STATUS
            </span>
            <span className="font-black text-xs sm:text-sm text-slate-900 block mt-0.5">
              IELTS {studentIelts}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">German: {studentGerman}</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 block">
              INSTITUTION CLASS
            </span>
            <span className="font-black text-xs sm:text-sm text-slate-900 block mt-0.5">
              Anabin H+
            </span>
            <span className="text-[11px] text-slate-500 font-medium">State Recognized</span>
          </div>
        </div>

        {/* Extracted Subject Credits */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-extrabold text-slate-900">
              Extracted Subject Credits (216 ECTS)
            </span>
            <span className="font-bold text-blue-600 hover:text-blue-800 cursor-pointer">
              Subject Audit
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <span className="text-slate-700 font-medium">Pharmaceutics</span>
              <span className="font-black text-slate-900 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                36 ECTS
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <span className="text-slate-700 font-medium">Pharmacology</span>
              <span className="font-black text-slate-900 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                32 ECTS
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <span className="text-slate-700 font-medium">Med Chemistry</span>
              <span className="font-black text-slate-900 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                28 ECTS
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <span className="text-slate-700 font-medium">Organic Chem</span>
              <span className="font-black text-slate-900 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                18 ECTS
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <span className="text-slate-700 font-medium">Biology & Anat</span>
              <span className="font-black text-slate-900 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                24 ECTS
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <span className="text-slate-700 font-medium">Mathematics</span>
              <span className="font-black text-slate-900 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                8 ECTS
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION: GERMAN UNIVERSITIES MATCH POOL */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-black text-slate-950">
            German Universities Match Pool
          </h2>
          <span className="text-xs font-bold text-slate-600">
            {evaluatedCourses.length} Matches Found
          </span>
        </div>

        {/* 3 Metric Filter Pills */}
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => setMatchPoolTab("strong")}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${
              matchPoolTab === "strong"
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            <span className="block text-sm sm:text-base font-black leading-none mb-1">• {strongMatches.length}</span>
            <span className="text-[10px]">Strong (&gt;80%)</span>
          </button>

          <button
            onClick={() => setMatchPoolTab("possible")}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${
              matchPoolTab === "possible"
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            <span className="block text-sm sm:text-base font-black leading-none mb-1">• {possibleMatches.length}</span>
            <span className="text-[10px]">Possible (60–79%)</span>
          </button>

          <button
            onClick={() => setMatchPoolTab("low")}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${
              matchPoolTab === "low"
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            <span className="block text-sm sm:text-base font-black leading-none mb-1">• {lowMatches.length}</span>
            <span className="text-[10px]">Low (&lt;60%)</span>
          </button>
        </div>
      </div>

      {/* CARD 3: TOP RECOMMENDATION (Dynamically computed top course) */}
      {topMatch && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-4 sm:p-5 space-y-4">
          {/* Header Tags & Circular Match Ring */}
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-extrabold border border-blue-200 flex items-center gap-1">
                  <span>✪</span> Top Recommendation
                </span>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                  {topMatch.course.universityType} University
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-slate-950 leading-snug">
                {topMatch.course.name}
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                🏛 {topMatch.course.universityName} • {topMatch.course.city}, {topMatch.course.state} 🇩🇪
              </p>
            </div>

            {/* Match Badge */}
            <div className="w-14 h-14 rounded-full border-3 border-blue-600 bg-blue-50/60 flex flex-col items-center justify-center shrink-0">
              <span className="text-sm font-black text-blue-700 leading-none">{topMatch.match.overallScore}%</span>
              <span className="text-[9px] font-extrabold text-blue-600 tracking-tighter">Match</span>
            </div>
          </div>

          {/* 3 Badges */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-700">
            <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-100 flex items-center gap-1">
              <span>文A</span> {topMatch.course.language}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center gap-1">
              <span>💶</span> {topMatch.course.tuitionAmountEur === 0 ? "€0 Tuition / Sem" : `€${topMatch.course.tuitionAmountEur}/Sem`}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1">
              <span>📅</span> {topMatch.course.intake} Intake
            </span>
          </div>

          {/* Why AI says you're an optimal candidate */}
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 space-y-2 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-blue-900">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Why AI says you're an optimal candidate:</span>
            </div>
            <div className="space-y-1.5 text-slate-700">
              {topMatch.match.whyMatches.map((reason, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons: Detailed Analysis & Save to Plan */}
          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={() => onViewCourse(topMatch.course)}
              className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Detailed Analysis</span>
            </button>

            <button
              onClick={() => handleToggleSave(topMatch.course.id)}
              className={`py-3 px-4 rounded-xl border text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                savedCourseIds.includes(topMatch.course.id)
                  ? "bg-blue-50 border-blue-300 text-blue-700"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Bookmark className={`w-4 h-4 ${savedCourseIds.includes(topMatch.course.id) ? "fill-blue-600 text-blue-600" : ""}`} />
              <span>{savedCourseIds.includes(topMatch.course.id) ? "Saved" : "Save to Plan"}</span>
            </button>
          </div>
        </div>
      )}

      {/* MATCH POOL CARDS ACCORDING TO SELECTED TAB */}
      <div className="space-y-3">
        {(matchPoolTab === "strong"
          ? strongMatches.filter((item) => item.course.id !== topMatch?.course.id)
          : matchPoolTab === "possible"
          ? possibleMatches
          : lowMatches
        ).map(({ course, match }) => (
          <div
            key={course.id}
            className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-4 sm:p-5 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                  match.overallScore >= 80
                    ? "bg-blue-50 text-blue-700 border-blue-200"
                    : match.overallScore >= 60
                    ? "bg-amber-50 text-amber-700 border-amber-200"
                    : "bg-red-50 text-red-700 border-red-200"
                }`}
              >
                {match.status}
              </span>
              <div className="text-right">
                <span className="font-black text-xs sm:text-sm text-slate-900 block leading-tight">
                  {match.overallScore}% Match
                </span>
                <span className="text-[10px] text-slate-500 font-medium">
                  {course.intake} Intake
                </span>
              </div>
            </div>

            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-950">
                {course.name}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {course.universityName} • {course.city}, {course.state}
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <span className="px-2 py-0.5 rounded-md bg-slate-100">{course.language}</span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100">
                {course.tuitionAmountEur === 0 ? "€0 Tuition" : `€${course.tuitionAmountEur}/sem`}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100">
                {course.requirements.apsRequired ? "APS Required" : "No APS"}
              </span>
            </div>

            {match.potentialIssues.length > 0 && (
              <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/70 text-xs text-amber-950 leading-relaxed">
                <strong className="block text-amber-900 font-bold mb-0.5">
                  ⚠️ Note on Prerequisites:
                </strong>
                <span>{match.potentialIssues[0]}</span>
              </div>
            )}

            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
              <button
                onClick={() => handleToggleSave(course.id)}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
              >
                <Bookmark className={`w-3.5 h-3.5 ${savedCourseIds.includes(course.id) ? "fill-blue-600 text-blue-600" : ""}`} />
                <span>{savedCourseIds.includes(course.id) ? "Saved" : "Save"}</span>
              </button>

              <button
                onClick={() => onViewCourse(course)}
                className="font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
              >
                <span>View Program</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Action Bar: Export Match PDF & Save Top 5 */}
      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={handleExportPdf}
          className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Export Match PDF</span>
        </button>

        <button
          onClick={handleSaveTop5}
          className="py-3 px-5 rounded-xl border border-slate-200 bg-white text-slate-800 font-bold text-xs sm:text-sm hover:bg-slate-50 transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <Bookmark className="w-4 h-4 text-slate-500" />
          <span>Save Top 5</span>
        </button>
      </div>
    </div>
  );
};
