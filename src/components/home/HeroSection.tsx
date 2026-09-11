import React, { useState } from "react";
import { Search, Sparkles, ArrowRight, UploadCloud, FileText, Check } from "lucide-react";

interface HeroSectionProps {
  onSearch?: (query: string) => void;
  onNavigateMatcher?: () => void;
  onOpenAdvisor?: () => void;
  onSelectField?: (field: string) => void;
  onStartMatching?: () => void;
  onExploreCourses?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSearch,
  onNavigateMatcher,
  onOpenAdvisor,
  onSelectField,
  onStartMatching,
  onExploreCourses
}) => {
  const [searchInput, setSearchInput] = useState("");
  const [selectedChips, setSelectedChips] = useState<string[]>(["English Taught"]);

  const handleMatcherClick = () => {
    if (onStartMatching) onStartMatching();
    else if (onNavigateMatcher) onNavigateMatcher();
  };

  const handleExploreClick = (query?: string) => {
    if (onExploreCourses) onExploreCourses();
    else if (onSearch) onSearch(query || "");
  };

  const toggleChip = (chip: string) => {
    setSelectedChips((prev) =>
      prev.includes(chip) ? prev.filter((c) => c !== chip) : [...prev, chip]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleExploreClick(searchInput.trim());
  };

  return (
    <section className="bg-slate-50/50 pt-8 pb-4 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top official badge */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800 shadow-sm">
            <span>🇩🇪</span>
            <span>Official Database & AI Transcript Evaluation</span>
          </div>
        </div>

        {/* Display Heading & Subtitle */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-950 leading-tight">
            Find Your Perfect Course in Germany
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto font-normal leading-relaxed">
            Search thousands of German university programs, compare admission requirements, and discover courses matching your transcript.
          </p>
        </div>

        {/* Search Box with Filter Chips */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-3 sm:p-4 shadow-sm space-y-3">
          <form onSubmit={handleSubmit} className="relative">
            <div className="relative flex items-center">
              <Search className="w-5 h-5 text-blue-600 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="What do you want to study? (e.g., Pharmacy, CS, Data)"
                className="w-full pl-11 pr-4 py-3 bg-slate-50/80 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
              />
            </div>
          </form>

          {/* Quick chips & Blue Action Button */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => toggleChip("English Taught")}
                className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  selectedChips.includes("English Taught")
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {selectedChips.includes("English Taught") && <Check className="w-3.5 h-3.5" />}
                <span>English Taught</span>
              </button>

              <button
                type="button"
                onClick={() => toggleChip("Winter 2025/26")}
                className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  selectedChips.includes("Winter 2025/26")
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {selectedChips.includes("Winter 2025/26") && <Check className="w-3.5 h-3.5" />}
                <span>Winter 2025/26</span>
              </button>

              <button
                type="button"
                onClick={() => toggleChip("No Tuition")}
                className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  selectedChips.includes("No Tuition")
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {selectedChips.includes("No Tuition") && <Check className="w-3.5 h-3.5" />}
                <span>No Tuition</span>
              </button>
            </div>

            <button
              onClick={() => handleExploreClick(searchInput)}
              className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Search Courses</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Smart Evaluation Card (Matches Screenshot 3) */}
        <div className="bg-slate-950 text-white rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
          {/* Subtle blue ambient gradient */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                  <span>⚡</span> SMART EVALUATION
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Upload Transcript & Match
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                Instant 91% match analysis using your Bachelor ECTS credits against APS and Uni-Assist prerequisites.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-blue-300">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                <span>DAAD Curriculum Matched</span>
              </div>
            </div>

            <div className="sm:shrink-0">
              <button
                onClick={handleMatcherClick}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-white text-slate-950 font-extrabold text-xs sm:text-sm hover:bg-slate-100 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <span>Upload PDF</span>
                <FileText className="w-4 h-4 text-slate-800" />
              </button>
            </div>
          </div>
        </div>

        {/* Sub-banner link to AI Advisor */}
        <div className="text-center pt-1">
          <button
            onClick={onOpenAdvisor}
            className="text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            <span>Not sure what to study? Let AI Academic Advisor guide you</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 3 Stats Grid */}
        <div className="grid grid-cols-3 gap-3 pt-2">
          <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-3 sm:p-4 text-center">
            <span className="block text-lg sm:text-2xl font-black text-blue-700">1,240+</span>
            <span className="text-[11px] sm:text-xs font-medium text-slate-600">English Master's</span>
          </div>
          <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-3 sm:p-4 text-center">
            <span className="block text-lg sm:text-2xl font-black text-blue-700">100%</span>
            <span className="text-[11px] sm:text-xs font-medium text-slate-600">Free Public Uni Info</span>
          </div>
          <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-3 sm:p-4 text-center">
            <span className="block text-lg sm:text-2xl font-black text-blue-700">94%</span>
            <span className="text-[11px] sm:text-xs font-medium text-slate-600">AI Match Rate</span>
          </div>
        </div>
      </div>
    </section>
  );
};
