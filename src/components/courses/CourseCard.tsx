import React from "react";
import {
  Heart,
  Scale,
  Clock,
  Calendar,
  Coins,
  ArrowRight,
  Check,
  AlertTriangle,
  Info,
  GraduationCap
} from "lucide-react";
import { Course } from "../../types";

interface CourseCardProps {
  course: Course;
  matchScore?: number;
  matchLabel?: "FIT" | "HIGH" | "MID" | "GAP";
  isSaved: boolean;
  isCompared: boolean;
  onViewCourse: (course: Course) => void;
  onToggleSave: (course: Course) => void;
  onToggleCompare: (course: Course) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  matchScore = 91,
  matchLabel = matchScore >= 90 ? "FIT" : matchScore >= 80 ? "HIGH" : matchScore >= 70 ? "MID" : "GAP",
  isSaved,
  isCompared,
  onViewCourse,
  onToggleSave,
  onToggleCompare
}) => {
  // Determine color scheme for circular match badge
  let circleBorder = "border-emerald-500 text-emerald-700";
  let circleBg = "bg-emerald-50/50";
  if (matchScore < 70) {
    circleBorder = "border-amber-500 text-amber-700";
    circleBg = "bg-amber-50/50";
  } else if (matchScore < 80) {
    circleBorder = "border-amber-500 text-amber-700";
    circleBg = "bg-amber-50/50";
  }

  // University tag line & crest styling
  const isTUM = course.id.includes("tum") || course.universityName.includes("München");
  const isBayreuth = course.id.includes("bayreuth") || course.universityName.includes("Bayreuth");

  const getSubTag = () => {
    if (isTUM) return `EXCELLENCE UNI 🏆 • ${course.city}, ${course.state}`;
    if (course.universityType === "Public") return `PUBLIC RESEARCH UNI • ${course.city}, ${course.state} 🇩🇪`;
    return `PRIVATE ACCREDITED UNI • ${course.city}, ${course.state}`;
  };

  const deadlineText = course.intake === "Summer" || course.intake === "Both"
    ? `Summer: ${course.deadline.summerDeadline} • Winter: ${course.deadline.winterDeadline}`
    : `Deadline: ${course.deadline.winterDeadline}`;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all p-4 sm:p-5 space-y-3.5">
      {/* Top row: University tag & Circular Match Badge */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          {/* University Crest / Emblem */}
          <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200/80 flex items-center justify-center shrink-0 text-slate-800 font-black text-xs">
            {course.universityName.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <span className="text-[11px] font-bold tracking-wider text-blue-700 uppercase block">
              {getSubTag()}
            </span>
            <h3
              onClick={() => onViewCourse(course)}
              className="text-base sm:text-lg font-extrabold text-slate-950 hover:text-blue-600 transition-colors cursor-pointer leading-tight"
            >
              {course.name}
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              {course.universityName}
            </p>
          </div>
        </div>

        {/* Circular Match Badge */}
        <div
          className={`w-12 h-12 rounded-full border-2 ${circleBorder} ${circleBg} flex flex-col items-center justify-center shrink-0 shadow-2xs`}
        >
          <span className="text-xs font-black leading-none">{matchScore}%</span>
          <span className="text-[9px] font-extrabold tracking-tighter leading-none mt-0.5">
            {matchLabel}
          </span>
        </div>
      </div>

      {/* 4 Feature Badges Grid */}
      <div className="grid grid-cols-2 gap-1.5 pt-1 text-xs text-slate-700 font-medium">
        <div className="flex items-center gap-1.5 py-1 px-2.5 rounded-xl bg-slate-50 border border-slate-100">
          <span>🇬🇧</span>
          <span className="truncate">{course.language}</span>
        </div>

        <div className="flex items-center gap-1.5 py-1 px-2.5 rounded-xl bg-slate-50 border border-slate-100">
          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{course.durationYears * 2} Semesters ({course.ectsCredits} ECTS)</span>
        </div>

        <div className="flex items-center gap-1.5 py-1 px-2.5 rounded-xl bg-slate-50 border border-slate-100">
          <Coins className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span className="truncate font-semibold text-slate-800">
            {course.tuitionAmountEur === 0 ? "€0 Tuition Fees" : `€${course.tuitionAmountEur.toLocaleString()}/Sem`}
          </span>
        </div>

        <div className="flex items-center gap-1.5 py-1 px-2.5 rounded-xl bg-slate-50 border border-slate-100">
          <Calendar className="w-3.5 h-3.5 text-blue-500 shrink-0" />
          <span className="truncate">
            {course.intake === "Both" ? "Winter & Summer" : `${course.intake} Intake`}
          </span>
        </div>
      </div>

      {/* Dynamic Status / Deadline Alert Box */}
      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 font-bold text-slate-800">
          <span className="text-blue-600">⏰</span>
          <span className="truncate">{deadlineText}</span>
        </div>
        <span className="text-[11px] text-slate-600 font-medium shrink-0 ml-2">
          Fee: €{course.semesterContributionEur || 0}/sem
        </span>
      </div>

      {/* Requirement Matching Pills */}
      <div className="flex flex-wrap items-center gap-1.5 pt-0.5 text-[11px] font-semibold text-slate-700">
        <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
          <Check className="w-3 h-3 text-emerald-600" />
          German GPA ≤ {course.requirements.minGpaGermanScale || 2.5}
        </span>
        <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
          <Check className="w-3 h-3 text-emerald-600" />
          IELTS {course.requirements.ieltsMin || 6.5}
        </span>
        <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 border border-blue-200">
          {course.degree}
        </span>
        {course.requirements.apsRequired && (
          <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
            APS Required
          </span>
        )}
      </div>

      {/* Bottom Action Row */}
      <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
        <button
          onClick={() => onViewCourse(course)}
          className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span>View Course Details</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={() => onToggleSave(course)}
          className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-colors cursor-pointer ${
            isSaved
              ? "bg-rose-50 border-rose-200 text-rose-600"
              : "border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800"
          }`}
          title={isSaved ? "Saved" : "Save Course"}
        >
          <Heart className={`w-4 h-4 ${isSaved ? "fill-rose-500 text-rose-500" : ""}`} />
        </button>

        <button
          onClick={() => onToggleCompare(course)}
          className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-colors cursor-pointer ${
            isCompared
              ? "bg-amber-50 border-amber-200 text-amber-700"
              : "border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800"
          }`}
          title={isCompared ? "In Comparison" : "Compare Course"}
        >
          <Scale className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
