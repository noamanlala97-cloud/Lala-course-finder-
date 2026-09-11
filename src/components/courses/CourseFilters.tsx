import React from "react";
import { Filter, X, RotateCcw, Check } from "lucide-react";
import { ALL_FIELDS } from "../../data/coursesData";

export interface FilterState {
  search: string;
  field: string;
  degree: string;
  type: string;
  language: string;
  intake: string;
  tuition: string;
  state: string;
  sort: string;
}

interface CourseFiltersProps {
  filters: FilterState;
  onChange: (newFilters: FilterState) => void;
  onReset: () => void;
  totalResults: number;
}

const GERMAN_STATES = [
  "All",
  "Bavaria",
  "Baden-Württemberg",
  "Berlin",
  "North Rhine-Westphalia",
  "Saxony",
  "Hesse",
  "Lower Saxony",
  "Hamburg"
];

export const CourseFilters: React.FC<CourseFiltersProps> = ({
  filters,
  onChange,
  onReset,
  totalResults
}) => {
  const updateField = (key: keyof FilterState, value: string) => {
    onChange({
      ...filters,
      [key]: value
    });
  };

  const hasActiveFilters =
    filters.field !== "All" ||
    filters.degree !== "All" ||
    filters.type !== "All" ||
    filters.language !== "All" ||
    filters.intake !== "All" ||
    filters.tuition !== "All" ||
    filters.state !== "All" ||
    filters.search !== "";

  return (
    <aside className="bg-white rounded-2xl border border-slate-200 p-5 space-y-6">
      {/* Header & Reset */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-700" />
          <span className="font-extrabold text-sm text-slate-900">Filters</span>
          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">
            {totalResults}
          </span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="text-xs text-red-600 hover:text-red-700 font-bold flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Degree Level */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Degree
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {["All", "Master's", "Bachelor's"].map((deg) => (
            <button
              key={deg}
              type="button"
              onClick={() => updateField("degree", deg)}
              className={`py-1.5 px-2 text-xs rounded-lg font-medium border text-center transition-all cursor-pointer ${
                filters.degree === deg
                  ? "bg-slate-900 text-white border-slate-900 font-bold"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
            >
              {deg}
            </button>
          ))}
        </div>
      </div>

      {/* Study Field */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Field of Study
        </label>
        <select
          value={filters.field}
          onChange={(e) => updateField("field", e.target.value)}
          className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-red-500"
        >
          <option value="All">All Disciplines & Fields</option>
          {ALL_FIELDS.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>

      {/* Language of Instruction */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Language
        </label>
        <div className="space-y-1">
          {["All", "English", "English + German", "German"].map((lang) => (
            <label
              key={lang}
              onClick={() => updateField("language", lang)}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs cursor-pointer transition-all border ${
                filters.language === lang
                  ? "bg-red-50 text-red-700 border-red-200 font-bold"
                  : "hover:bg-slate-50 text-slate-700 border-transparent"
              }`}
            >
              <span>{lang === "All" ? "Any Language" : lang}</span>
              {filters.language === lang && <Check className="w-3.5 h-3.5 text-red-600" />}
            </label>
          ))}
        </div>
      </div>

      {/* University Type (Public vs Private) */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
          University Type
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {["All", "Public", "Private"].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => updateField("type", type)}
              className={`py-1.5 px-2 text-xs rounded-lg font-medium border text-center transition-all cursor-pointer ${
                filters.type === type
                  ? "bg-slate-900 text-white border-slate-900 font-bold"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Intake Season */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Intake
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {["All", "Winter", "Summer"].map((intake) => (
            <button
              key={intake}
              type="button"
              onClick={() => updateField("intake", intake)}
              className={`py-1.5 px-2 text-xs rounded-lg font-medium border text-center transition-all cursor-pointer ${
                filters.intake === intake
                  ? "bg-slate-900 text-white border-slate-900 font-bold"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
            >
              {intake}
            </button>
          ))}
        </div>
      </div>

      {/* Tuition Filter */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Tuition Fees
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {["All", "No tuition", "Low tuition"].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => updateField("tuition", t)}
              className={`py-1.5 px-2 text-xs rounded-lg font-medium border text-center transition-all cursor-pointer ${
                filters.tuition === t
                  ? "bg-emerald-700 text-white border-emerald-700 font-bold"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
            >
              {t === "All" ? "Any Tuition" : t}
            </button>
          ))}
        </div>
      </div>

      {/* German State */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Federal State (Bundesland)
        </label>
        <select
          value={filters.state}
          onChange={(e) => updateField("state", e.target.value)}
          className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-red-500"
        >
          {GERMAN_STATES.map((st) => (
            <option key={st} value={st}>
              {st === "All" ? "All of Germany (16 States)" : st}
            </option>
          ))}
        </select>
      </div>
    </aside>
  );
};
