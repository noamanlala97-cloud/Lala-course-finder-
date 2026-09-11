import React, { useState } from "react";
import {
  MapPin,
  Building,
  GraduationCap,
  Coins,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Search,
  CheckCircle,
  Home,
  Bus,
  Briefcase
} from "lucide-react";
import { University, Course } from "../../types";

interface UniversityExplorerPageProps {
  universities: University[];
  courses: Course[];
  onSelectCourse: (course: Course) => void;
  onFilterCoursesByUniversity: (uniId: string) => void;
}

export const UniversityExplorerPage: React.FC<UniversityExplorerPageProps> = ({
  universities,
  courses,
  onSelectCourse,
  onFilterCoursesByUniversity
}) => {
  const [selectedState, setSelectedState] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUni, setSelectedUni] = useState<University>(universities[0]);

  const states = [
    "All",
    "Baden-Württemberg",
    "Bavaria",
    "North Rhine-Westphalia",
    "Berlin",
    "Saxony"
  ];

  const filteredUnis = universities.filter((u) => {
    const matchState = selectedState === "All" || u.state.toLowerCase() === selectedState.toLowerCase();
    const matchSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchState && matchSearch;
  });

  const uniCourses = courses.filter((c) => c.universityId === selectedUni.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-10">
      {/* Page Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold border border-red-200">
          <MapPin className="w-3.5 h-3.5 text-red-600" />
          <span>Higher Education Across 16 Federal States</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Germany University & City Explorer 🇩🇪
        </h1>
        <p className="text-slate-600 text-sm sm:text-base max-w-3xl leading-relaxed">
          Discover prestigious public research institutions across Germany, examine city living expenses, student environments, and explore verified courses.
        </p>
      </div>

      {/* Controls: Search & State Filter Pills */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by university name or city (e.g. Heidelberg, Munich, Aachen)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-1 focus:ring-red-500 text-slate-900"
          />
        </div>

        {/* State filter buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {states.map((st) => (
            <button
              key={st}
              onClick={() => setSelectedState(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                selectedState === st
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Split View: List on left + Interactive Deep Dive on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* University Selector Cards */}
        <div className="lg:col-span-5 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block px-1">
            Universities ({filteredUnis.length})
          </span>

          <div className="space-y-3">
            {filteredUnis.map((uni) => {
              const isSelected = uni.id === selectedUni.id;
              return (
                <div
                  key={uni.id}
                  onClick={() => setSelectedUni(uni)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex gap-4 items-center ${
                    isSelected
                      ? "bg-red-50/50 border-red-500 shadow-sm"
                      : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs"
                  }`}
                >
                  <img
                    src={uni.image}
                    alt={uni.name}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-red-600 uppercase">
                        {uni.city}, {uni.state}
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
                        {uni.type}
                      </span>
                    </div>
                    <h3 className="font-extrabold text-sm text-slate-900 truncate mt-0.5">
                      {uni.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Rank #{uni.rankingGerman} in Germany • ~€{uni.costOfLivingEur}/mo
                    </p>
                  </div>
                  <ArrowRight
                    className={`w-4 h-4 shrink-0 transition-transform ${
                      isSelected ? "text-red-600 translate-x-1" : "text-slate-300"
                    }`}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Deep Dive Profile for Selected University */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm space-y-6">
          {/* Banner Image */}
          <div className="h-64 w-full relative">
            <img
              src={selectedUni.image}
              alt={selectedUni.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-red-600">
                  {selectedUni.type} University
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-white/20 backdrop-blur-md">
                  Rank #{selectedUni.rankingGerman} in Germany
                </span>
              </div>
              <h2 className="text-2xl font-black text-white">{selectedUni.name}</h2>
              <div className="flex items-center gap-1.5 text-xs text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-red-400" />
                <span>{selectedUni.city}, State of {selectedUni.state}, Germany</span>
              </div>
            </div>
          </div>

          {/* Details Body */}
          <div className="p-6 space-y-6">
            {/* Overview */}
            <div className="space-y-2">
              <h4 className="font-extrabold text-sm text-slate-900">University Overview</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {selectedUni.overview}
              </p>
            </div>

            {/* City Living & Expenses Grid */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
              <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <Coins className="w-4 h-4 text-amber-600" />
                <span>Living Expenses & Student Environment in {selectedUni.city}</span>
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-white border border-slate-200">
                  <span className="text-slate-400 block font-bold">Estimated Cost</span>
                  <span className="font-black text-slate-900 text-sm">
                    ~€{selectedUni.costOfLivingEur}/month
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-white border border-slate-200">
                  <span className="text-slate-400 block font-bold">Tuition Policy</span>
                  <span className="font-bold text-emerald-700 text-xs">
                    {selectedUni.tuitionPolicy || (selectedUni.type === "Public" ? "€0 Tuition (Public)" : "Tuition applies")}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-white border border-slate-200">
                  <span className="text-slate-400 block font-bold">Campus Type</span>
                  <span className="font-bold text-slate-800 text-xs">
                    {selectedUni.studentEnvironment}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-white border border-slate-200">
                  <span className="text-slate-400 block font-bold">Official Site</span>
                  <a
                    href={selectedUni.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-red-600 hover:underline flex items-center gap-1 text-xs"
                  >
                    <span>Visit Portal</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Student perks */}
              <div className="pt-2 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
                <div className="flex items-start gap-2">
                  <Bus className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Semester Ticket:</strong> Public transit within city and region usually included in semester fee.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Briefcase className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Student Employment:</strong> 140 full days or 280 half days work permit for international students.
                  </span>
                </div>
              </div>
            </div>

            {/* Courses Offered at this University */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-sm text-slate-900">
                  Available Programs at {selectedUni.name} ({uniCourses.length})
                </h4>
                <button
                  onClick={() => onFilterCoursesByUniversity(selectedUni.id)}
                  className="text-xs text-red-600 font-bold hover:underline cursor-pointer"
                >
                  View in Course Search
                </button>
              </div>

              <div className="space-y-2">
                {uniCourses.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => onSelectCourse(c)}
                    className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <div className="space-y-0.5">
                      <h5 className="font-extrabold text-xs sm:text-sm text-slate-900 hover:text-red-600">
                        {c.name}
                      </h5>
                      <span className="text-[11px] text-slate-500">
                        {c.degree} • {c.language} • {c.tuitionFee}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
