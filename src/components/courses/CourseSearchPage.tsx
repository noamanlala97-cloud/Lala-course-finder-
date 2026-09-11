import React, { useState, useMemo } from "react";
import {
  Search,
  SlidersHorizontal,
  X,
  RotateCcw,
  Check,
  ChevronDown,
  Sparkles,
  AlertCircle,
  ArrowRight,
  Filter
} from "lucide-react";
import { Course } from "../../types";
import { CourseCard } from "./CourseCard";
import { calculateCourseMatch, DEFAULT_DEMO_STUDENT } from "../../utils/matchingEngine";

interface CourseSearchPageProps {
  courses: Course[];
  savedCourseIds?: string[];
  compareCourseIds?: string[];
  onViewCourse?: (course: Course) => void;
  onSelectCourse?: (course: Course) => void;
  onToggleSave?: (course: Course) => void;
  onToggleCompare?: (course: Course) => void;
  onOpenAdvisor?: () => void;
}

export const CourseSearchPage: React.FC<CourseSearchPageProps> = ({
  courses,
  savedCourseIds = [],
  compareCourseIds = [],
  onViewCourse,
  onSelectCourse,
  onToggleSave = () => {},
  onToggleCompare = () => {},
  onOpenAdvisor = () => {}
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDegree, setSelectedDegree] = useState<string>("All");
  const [selectedField, setSelectedField] = useState<string>("All");
  const [selectedUniType, setSelectedUniType] = useState<string>("All");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("All");
  const [selectedIntake, setSelectedIntake] = useState<string>("All");
  const [selectedIntakePeriod, setSelectedIntakePeriod] = useState<string>("All");
  const [selectedState, setSelectedState] = useState<string>("All");
  const [selectedTuition, setSelectedTuition] = useState<string>("All");
  const [selectedDuration, setSelectedDuration] = useState<string>("All");
  const [selectedIelts, setSelectedIelts] = useState<string>("All");
  const [noGermanOnly, setNoGermanOnly] = useState<boolean>(false);
  const [apsOnly, setApsOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState("Best Match");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);

  const handleView = onViewCourse || onSelectCourse || (() => {});

  // Reset all filters to default
  const resetAllFilters = () => {
    setSearchQuery("");
    setSelectedDegree("All");
    setSelectedField("All");
    setSelectedUniType("All");
    setSelectedLanguage("All");
    setSelectedIntake("All");
    setSelectedIntakePeriod("All");
    setSelectedState("All");
    setSelectedTuition("All");
    setSelectedDuration("All");
    setSelectedIelts("All");
    setNoGermanOnly(false);
    setApsOnly(false);
  };

  // Compile active filters list for pill tags
  const activeFilterPills = useMemo(() => {
    const pills: { key: string; label: string; clear: () => void }[] = [];
    if (selectedDegree !== "All") pills.push({ key: "degree", label: `Degree: ${selectedDegree}`, clear: () => setSelectedDegree("All") });
    if (selectedField !== "All") pills.push({ key: "field", label: `Field: ${selectedField}`, clear: () => setSelectedField("All") });
    if (selectedUniType !== "All") pills.push({ key: "type", label: `${selectedUniType} Uni`, clear: () => setSelectedUniType("All") });
    if (selectedLanguage !== "All") pills.push({ key: "lang", label: `${selectedLanguage} Taught`, clear: () => setSelectedLanguage("All") });
    if (selectedIntake !== "All") pills.push({ key: "intake", label: `${selectedIntake} Intake`, clear: () => setSelectedIntake("All") });
    if (selectedIntakePeriod !== "All") pills.push({ key: "period", label: selectedIntakePeriod, clear: () => setSelectedIntakePeriod("All") });
    if (selectedState !== "All") pills.push({ key: "state", label: selectedState, clear: () => setSelectedState("All") });
    if (selectedTuition !== "All") pills.push({ key: "tuition", label: selectedTuition, clear: () => setSelectedTuition("All") });
    if (selectedDuration !== "All") pills.push({ key: "duration", label: `${selectedDuration} Yrs`, clear: () => setSelectedDuration("All") });
    if (selectedIelts !== "All") pills.push({ key: "ielts", label: `IELTS ≤ ${selectedIelts}`, clear: () => setSelectedIelts("All") });
    if (noGermanOnly) pills.push({ key: "noGerman", label: "No German Required", clear: () => setNoGermanOnly(false) });
    if (apsOnly) pills.push({ key: "aps", label: "APS Required", clear: () => setApsOnly(false) });
    return pills;
  }, [
    selectedDegree,
    selectedField,
    selectedUniType,
    selectedLanguage,
    selectedIntake,
    selectedIntakePeriod,
    selectedState,
    selectedTuition,
    selectedDuration,
    selectedIelts,
    noGermanOnly,
    apsOnly
  ]);

  // Comprehensive multi-filter AND logic + search matching
  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      // 1. Search query: keyword, program name, uni name, city, state, field, specialization, overview, accepted degrees
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = c.name.toLowerCase().includes(q);
        const matchUni = c.universityName.toLowerCase().includes(q);
        const matchCity = c.city.toLowerCase().includes(q);
        const matchState = c.state.toLowerCase().includes(q);
        const matchField = c.field.toLowerCase().includes(q) || (c.specialization && c.specialization.toLowerCase().includes(q));
        const matchOverview = c.overview.toLowerCase().includes(q);
        const matchDeg = c.requirements.acceptedBachelorDegrees.some((deg) => deg.toLowerCase().includes(q));
        if (!matchName && !matchUni && !matchCity && !matchState && !matchField && !matchOverview && !matchDeg) {
          return false;
        }
      }

      // 2. Degree filter
      if (selectedDegree !== "All") {
        if (!c.degree.toLowerCase().includes(selectedDegree.toLowerCase()) && !selectedDegree.toLowerCase().includes(c.degree.toLowerCase())) {
          return false;
        }
      }

      // 3. Field filter
      if (selectedField !== "All") {
        const fLower = selectedField.toLowerCase();
        const cField = c.field.toLowerCase();
        const cSpec = (c.specialization || "").toLowerCase();
        const match =
          (fLower === "pharmacy" && (cField.includes("pharm") || cSpec.includes("drug") || cSpec.includes("natural product") || cSpec.includes("medicinal"))) ||
          (fLower === "computer science" && (cField.includes("computer") || cField.includes("data") || cSpec.includes("ai"))) ||
          (fLower === "data science" && (cField.includes("data") || cField.includes("computer"))) ||
          cField.includes(fLower) ||
          cSpec.includes(fLower);
        if (!match) return false;
      }

      // 4. University Type filter
      if (selectedUniType !== "All") {
        if (c.universityType.toLowerCase() !== selectedUniType.toLowerCase()) return false;
      }

      // 5. Course Language filter
      if (selectedLanguage !== "All") {
        if (selectedLanguage === "English") {
          if (c.language !== "English" && c.language !== "English + German") return false;
        } else if (selectedLanguage === "German") {
          if (c.language !== "German" && c.language !== "English + German") return false;
        } else if (c.language.toLowerCase() !== selectedLanguage.toLowerCase()) {
          return false;
        }
      }

      // 6. Beginning / Intake filter
      if (selectedIntake !== "All") {
        const iLower = selectedIntake.toLowerCase();
        if (iLower.includes("summer")) {
          if (c.intake !== "Summer" && c.intake !== "Both" && (!c.beginningOfCourse || !c.beginningOfCourse.toLowerCase().includes("summer"))) return false;
        } else if (iLower.includes("winter")) {
          if (c.intake !== "Winter" && c.intake !== "Both" && (!c.beginningOfCourse || !c.beginningOfCourse.toLowerCase().includes("winter"))) return false;
        }
      }

      // 7. Intake Period / Year filter
      if (selectedIntakePeriod !== "All") {
        const pLower = selectedIntakePeriod.toLowerCase();
        const matchPeriod = (c.intakePeriod && c.intakePeriod.toLowerCase().includes(pLower)) ||
                            (c.deadline.winterDeadline.toLowerCase().includes(pLower)) ||
                            (c.deadline.summerDeadline.toLowerCase().includes(pLower));
        if (!matchPeriod) return false;
      }

      // 8. State filter
      if (selectedState !== "All") {
        if (c.state.toLowerCase() !== selectedState.toLowerCase()) return false;
      }

      // 9. Tuition fee filter
      if (selectedTuition !== "All") {
        if (selectedTuition === "€0 Tuition" || selectedTuition === "No tuition") {
          if (c.tuitionAmountEur > 0 && c.tuitionFee !== "No tuition") return false;
        } else if (selectedTuition === "Under €500") {
          if (c.tuitionAmountEur >= 500) return false;
        } else if (selectedTuition === "€500–€1,500" || selectedTuition === "Low tuition") {
          if (c.tuitionAmountEur < 500 || c.tuitionAmountEur > 1500) return false;
        } else if (selectedTuition === "Above €1,500" || selectedTuition === "High tuition") {
          if (c.tuitionAmountEur <= 1500) return false;
        }
      }

      // 10. Duration filter
      if (selectedDuration !== "All") {
        if (selectedDuration === "gt2") {
          if (c.durationYears <= 2) return false;
        } else {
          const dVal = parseFloat(selectedDuration);
          if (!isNaN(dVal) && c.durationYears !== dVal) return false;
        }
      }

      // 11. IELTS filter
      if (selectedIelts !== "All") {
        const iVal = parseFloat(selectedIelts);
        if (!isNaN(iVal) && c.requirements.ieltsMin && c.requirements.ieltsMin > iVal) {
          return false;
        }
      }

      // 12. German proficiency filter
      if (noGermanOnly) {
        if (c.requirements.germanMin && c.requirements.germanMin !== "None") return false;
      }

      // 13. APS filter
      if (apsOnly) {
        if (!c.requirements.apsRequired) return false;
      }

      return true;
    });
  }, [
    courses,
    searchQuery,
    selectedDegree,
    selectedField,
    selectedUniType,
    selectedLanguage,
    selectedIntake,
    selectedIntakePeriod,
    selectedState,
    selectedTuition,
    selectedDuration,
    selectedIelts,
    noGermanOnly,
    apsOnly
  ]);

  // Sorted courses
  const sortedCourses = useMemo(() => {
    const list = [...filteredCourses];
    if (sortBy === "Best Match") {
      list.sort((a, b) => {
        const scoreA = a.matchScore ?? calculateCourseMatch(DEFAULT_DEMO_STUDENT, a).overallScore;
        const scoreB = b.matchScore ?? calculateCourseMatch(DEFAULT_DEMO_STUDENT, b).overallScore;
        return scoreB - scoreA;
      });
    } else if (sortBy === "Deadline Soon") {
      list.sort((a, b) => (a.deadline.daysRemaining || 999) - (b.deadline.daysRemaining || 999));
    } else if (sortBy === "Tuition (Lowest)") {
      list.sort((a, b) => a.tuitionAmountEur - b.tuitionAmountEur);
    } else if (sortBy === "Duration Shortest") {
      list.sort((a, b) => a.durationYears - b.durationYears);
    } else if (sortBy === "Alphabetical") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "Recently Updated") {
      list.sort((a, b) => new Date(b.lastVerifiedAt).getTime() - new Date(a.lastVerifiedAt).getTime());
    }
    return list;
  }, [filteredCourses, sortBy]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-4 pb-24">
      {/* Top Search & Filter Bar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by course, university, city, degree (e.g. Pharmacy, Bavaria, CS)"
            className="w-full pl-10 pr-9 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-0.5"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filters Button */}
        <button
          onClick={() => setIsFilterModalOpen(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer shrink-0"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Filters</span>
          {activeFilterPills.length > 0 && (
            <span className="w-5 h-5 rounded-full bg-white text-blue-700 text-[11px] flex items-center justify-center font-black ml-0.5">
              {activeFilterPills.length}
            </span>
          )}
        </button>
      </div>

      {/* Quick Filter Horizontal Scroll Chips Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        <button
          onClick={() => setSelectedField(selectedField === "Pharmacy" ? "All" : "Pharmacy")}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap border transition-all cursor-pointer ${
            selectedField === "Pharmacy"
              ? "bg-blue-600 text-white border-blue-600 shadow-2xs"
              : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
          }`}
        >
          💊 Pharmacy
        </button>
        <button
          onClick={() => setSelectedState(selectedState === "Bavaria" ? "All" : "Bavaria")}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap border transition-all cursor-pointer ${
            selectedState === "Bavaria"
              ? "bg-blue-600 text-white border-blue-600 shadow-2xs"
              : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
          }`}
        >
          🏰 Bavaria
        </button>
        <button
          onClick={() => setSelectedUniType(selectedUniType === "Public" ? "All" : "Public")}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap border transition-all cursor-pointer ${
            selectedUniType === "Public"
              ? "bg-blue-600 text-white border-blue-600 shadow-2xs"
              : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
          }`}
        >
          🏛 Public Uni
        </button>
        <button
          onClick={() => setSelectedLanguage(selectedLanguage === "English" ? "All" : "English")}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap border transition-all cursor-pointer ${
            selectedLanguage === "English"
              ? "bg-blue-600 text-white border-blue-600 shadow-2xs"
              : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
          }`}
        >
          🇬🇧 English Taught
        </button>
        <button
          onClick={() => setSelectedIntake(selectedIntake === "Summer" ? "All" : "Summer")}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap border transition-all cursor-pointer ${
            selectedIntake === "Summer"
              ? "bg-blue-600 text-white border-blue-600 shadow-2xs"
              : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
          }`}
        >
          ☀️ Summer Intake
        </button>
        <button
          onClick={() => setSelectedTuition(selectedTuition === "€0 Tuition" ? "All" : "€0 Tuition")}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap border transition-all cursor-pointer ${
            selectedTuition === "€0 Tuition"
              ? "bg-emerald-600 text-white border-emerald-600 shadow-2xs"
              : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
          }`}
        >
          €0 Tuition
        </button>
        <button
          onClick={() => setSelectedDegree(selectedDegree === "Master's" ? "All" : "Master's")}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap border transition-all cursor-pointer ${
            selectedDegree === "Master's"
              ? "bg-blue-600 text-white border-blue-600 shadow-2xs"
              : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
          }`}
        >
          🎓 Master's
        </button>
        <button
          onClick={() => setSelectedDegree(selectedDegree === "Bachelor's" ? "All" : "Bachelor's")}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap border transition-all cursor-pointer ${
            selectedDegree === "Bachelor's"
              ? "bg-blue-600 text-white border-blue-600 shadow-2xs"
              : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
          }`}
        >
          📘 Bachelor's
        </button>
      </div>

      {/* Active Filter Pills Bar */}
      {activeFilterPills.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {activeFilterPills.map((p) => (
            <button
              key={p.key}
              onClick={p.clear}
              className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 hover:bg-blue-100 transition-colors cursor-pointer"
            >
              <span>{p.label}</span>
              <X className="w-3.5 h-3.5 text-blue-600" />
            </button>
          ))}
          <button
            onClick={resetAllFilters}
            className="text-xs font-bold text-slate-400 hover:text-slate-700 ml-1 cursor-pointer flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear all</span>
          </button>
        </div>
      )}

      {/* Dynamic Count & Sort Row */}
      <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
        <div className="flex items-center gap-2 font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-slate-950 font-black text-sm">
            {sortedCourses.length} {sortedCourses.length === 1 ? "Program" : "Programs"} Found
          </span>
          <span className="text-slate-400 font-normal hidden sm:inline">• Verified German Catalog</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-slate-500 text-[11px] font-medium hidden sm:inline">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-bold text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer shadow-2xs"
          >
            <option value="Best Match">Best Match (Score ↓)</option>
            <option value="Deadline Soon">Deadline (Soonest)</option>
            <option value="Tuition (Lowest)">Tuition (Lowest)</option>
            <option value="Duration Shortest">Duration (Shortest)</option>
            <option value="Alphabetical">Alphabetical (A-Z)</option>
            <option value="Recently Updated">Recently Updated</option>
          </select>
        </div>
      </div>

      {/* Zero State / Empty Results */}
      {sortedCourses.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-8 sm:p-12 text-center space-y-4 my-6 shadow-2xs">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto text-2xl">
            <AlertCircle className="w-8 h-8 text-amber-500" />
          </div>
          <div className="space-y-1.5 max-w-md mx-auto">
            <h3 className="text-lg font-black text-slate-900">No courses match your current filters</h3>
            <p className="text-xs text-slate-500">
              Try removing one or more active filters or search terms to broaden your results.
            </p>
          </div>
          <button
            onClick={resetAllFilters}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm cursor-pointer transition-colors inline-flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear All Filters</span>
          </button>
        </div>
      ) : (
        /* Course Cards List */
        <div className="space-y-4">
          {sortedCourses.slice(0, visibleCount).map((course) => {
            const matchScore = course.matchScore ?? calculateCourseMatch(DEFAULT_DEMO_STUDENT, course).overallScore;
            return (
              <CourseCard
                key={course.id}
                course={course}
                matchScore={matchScore}
                isSaved={savedCourseIds.includes(course.id)}
                isCompared={compareCourseIds.includes(course.id)}
                onViewCourse={handleView}
                onToggleSave={onToggleSave}
                onToggleCompare={onToggleCompare}
              />
            );
          })}
        </div>
      )}

      {/* Pagination / Load More Button */}
      {sortedCourses.length > visibleCount && (
        <div className="text-center pt-3 space-y-2">
          <button
            onClick={() => setVisibleCount((prev) => Math.min(prev + 6, sortedCourses.length))}
            className="w-full py-3 bg-white border border-slate-200 hover:border-slate-300 rounded-2xl text-xs sm:text-sm font-bold text-slate-800 hover:text-blue-600 shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>🔄</span>
            <span>Load More Programs ({sortedCourses.length - visibleCount} remaining)</span>
          </button>
          <p className="text-[11px] text-slate-500 font-medium">
            Showing {visibleCount} of {sortedCourses.length} matching programs
          </p>
        </div>
      )}

      {/* Comprehensive Filter Modal Drawer */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full sm:max-w-xl rounded-t-3xl sm:rounded-3xl p-6 space-y-5 max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in slide-in-from-bottom-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-black text-slate-950">Filter Programs</h3>
              </div>
              <button
                onClick={() => setIsFilterModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-semibold divide-y divide-slate-100">
              {/* Degree Level */}
              <div className="pt-2">
                <label className="block text-slate-800 mb-2 font-black">Degree Level</label>
                <div className="flex flex-wrap gap-2">
                  {["All", "Master's", "Bachelor's", "PhD"].map((deg) => (
                    <button
                      key={deg}
                      onClick={() => setSelectedDegree(deg)}
                      className={`px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
                        selectedDegree === deg
                          ? "bg-blue-600 text-white border-blue-600 shadow-2xs"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300"
                      }`}
                    >
                      {deg}
                    </button>
                  ))}
                </div>
              </div>

              {/* Field of Study */}
              <div className="pt-3">
                <label className="block text-slate-800 mb-2 font-black">Field of Study</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    "All",
                    "Pharmacy",
                    "Computer Science",
                    "Data Science",
                    "Biotechnology",
                    "Engineering",
                    "Business",
                    "Natural Sciences"
                  ].map((field) => (
                    <button
                      key={field}
                      onClick={() => setSelectedField(field)}
                      className={`px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
                        selectedField === field
                          ? "bg-blue-600 text-white border-blue-600 shadow-2xs"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300"
                      }`}
                    >
                      {field}
                    </button>
                  ))}
                </div>
              </div>

              {/* Federal State */}
              <div className="pt-3">
                <label className="block text-slate-800 mb-2 font-black">Federal State</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    "All",
                    "Bavaria",
                    "Baden-Württemberg",
                    "Berlin",
                    "North Rhine-Westphalia",
                    "Hesse",
                    "Saxony",
                    "Hamburg"
                  ].map((st) => (
                    <button
                      key={st}
                      onClick={() => setSelectedState(st)}
                      className={`px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
                        selectedState === st
                          ? "bg-blue-600 text-white border-blue-600 shadow-2xs"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* University Type */}
              <div className="pt-3">
                <label className="block text-slate-800 mb-2 font-black">University Type</label>
                <div className="flex flex-wrap gap-2">
                  {["All", "Public", "Private"].map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedUniType(type)}
                      className={`px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
                        selectedUniType === type
                          ? "bg-blue-600 text-white border-blue-600 shadow-2xs"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Language of Instruction */}
              <div className="pt-3">
                <label className="block text-slate-800 mb-2 font-black">Language of Instruction</label>
                <div className="flex flex-wrap gap-2">
                  {["All", "English", "German", "English + German"].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setSelectedLanguage(lang)}
                      className={`px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
                        selectedLanguage === lang
                          ? "bg-blue-600 text-white border-blue-600 shadow-2xs"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300"
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              {/* Intake & Semester */}
              <div className="pt-3">
                <label className="block text-slate-800 mb-2 font-black">Beginning of Course / Intake</label>
                <div className="flex flex-wrap gap-2">
                  {["All", "Summer", "Winter", "Both"].map((intk) => (
                    <button
                      key={intk}
                      onClick={() => setSelectedIntake(intk)}
                      className={`px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
                        selectedIntake === intk
                          ? "bg-blue-600 text-white border-blue-600 shadow-2xs"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300"
                      }`}
                    >
                      {intk === "Summer" ? "☀️ Summer (April)" : intk === "Winter" ? "❄️ Winter (October)" : intk === "Both" ? "Both Semesters" : "All Intakes"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Intake Period Year */}
              <div className="pt-3">
                <label className="block text-slate-800 mb-2 font-black">Intake Period</label>
                <div className="flex flex-wrap gap-2">
                  {["All", "Summer 2027", "Winter 2026/27"].map((period) => (
                    <button
                      key={period}
                      onClick={() => setSelectedIntakePeriod(period)}
                      className={`px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
                        selectedIntakePeriod === period
                          ? "bg-blue-600 text-white border-blue-600 shadow-2xs"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300"
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tuition Fees */}
              <div className="pt-3">
                <label className="block text-slate-800 mb-2 font-black">Tuition Fee</label>
                <div className="flex flex-wrap gap-2">
                  {["All", "€0 Tuition", "Under €500", "€500–€1,500", "Above €1,500"].map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedTuition(t)}
                      className={`px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
                        selectedTuition === t
                          ? "bg-blue-600 text-white border-blue-600 shadow-2xs"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Requirements & APS */}
              <div className="pt-3 space-y-2">
                <label className="block text-slate-800 font-black">Admission Requirements</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setNoGermanOnly(!noGermanOnly)}
                    className={`px-3 py-1.5 rounded-xl border transition-colors cursor-pointer flex items-center gap-1.5 ${
                      noGermanOnly
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-2xs"
                        : "bg-slate-50 border-slate-200 text-slate-700"
                    }`}
                  >
                    {noGermanOnly && <Check className="w-3.5 h-3.5" />}
                    <span>No German Required</span>
                  </button>

                  <button
                    onClick={() => setApsOnly(!apsOnly)}
                    className={`px-3 py-1.5 rounded-xl border transition-colors cursor-pointer flex items-center gap-1.5 ${
                      apsOnly
                        ? "bg-blue-600 text-white border-blue-600 shadow-2xs"
                        : "bg-slate-50 border-slate-200 text-slate-700"
                    }`}
                  >
                    {apsOnly && <Check className="w-3.5 h-3.5" />}
                    <span>APS Required</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Bottom Controls */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={resetAllFilters}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All</span>
              </button>
              <button
                onClick={() => setIsFilterModalOpen(false)}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm cursor-pointer"
              >
                Show {filteredCourses.length} Programs
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
