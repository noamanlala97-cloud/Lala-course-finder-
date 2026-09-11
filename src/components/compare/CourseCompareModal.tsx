import React from "react";
import {
  X,
  Scale,
  Trash2,
  ExternalLink,
  Coins,
  CheckCircle,
  AlertTriangle,
  Clock,
  MapPin,
  Calendar,
  Sparkles
} from "lucide-react";
import { Course } from "../../types";

interface CourseCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  courses: Course[];
  onRemoveFromCompare: (courseId: string) => void;
  onViewCourse: (course: Course) => void;
}

export const CourseCompareModal: React.FC<CourseCompareModalProps> = ({
  isOpen,
  onClose,
  courses,
  onRemoveFromCompare,
  onViewCourse
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-6xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">Course Comparison Matrix</h3>
              <p className="text-[11px] text-slate-400">
                Comparing {courses.length} of 4 maximum German university programs
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
        <div className="overflow-y-auto p-6">
          {courses.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <Scale className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-700">No courses selected for comparison</p>
              <p className="text-xs text-slate-500">
                Click &ldquo;Compare&rdquo; on any course card in search results to add up to 4 programs.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                {/* Courses Top Row */}
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="p-4 bg-slate-50 font-bold text-slate-500 w-44 uppercase tracking-wider text-[10px]">
                      Parameter
                    </th>
                    {courses.map((c) => (
                      <th key={c.id} className="p-4 min-w-[220px] max-w-[260px] align-top bg-white">
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-1">
                            <span className="text-[10px] uppercase font-bold text-red-600">
                              {c.universityName}
                            </span>
                            <button
                              onClick={() => onRemoveFromCompare(c.id)}
                              className="text-slate-400 hover:text-red-600 p-0.5"
                              title="Remove from comparison"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <h4
                            onClick={() => onViewCourse(c)}
                            className="font-extrabold text-sm text-slate-900 line-clamp-2 hover:text-red-600 cursor-pointer leading-snug"
                          >
                            {c.name}
                          </h4>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {/* Your Match % */}
                  <tr className="bg-red-50/40">
                    <td className="p-3.5 font-bold text-slate-700">YOUR MATCH SCORE</td>
                    {courses.map((c) => (
                      <td key={c.id} className="p-3.5 font-black text-base text-red-600">
                        {c.matchScore || 88}%
                        <span className="text-[10px] block font-bold text-slate-500">
                          {c.matchStatus || "Strong Match"}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* University Type */}
                  <tr>
                    <td className="p-3.5 font-bold text-slate-500">University Type</td>
                    {courses.map((c) => (
                      <td key={c.id} className="p-3.5 font-semibold text-slate-800">
                        <span className="px-2 py-0.5 rounded bg-slate-100 font-bold text-[11px]">
                          {c.universityType}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Degree */}
                  <tr>
                    <td className="p-3.5 font-bold text-slate-500">Degree & Discipline</td>
                    {courses.map((c) => (
                      <td key={c.id} className="p-3.5 font-semibold text-slate-800">
                        {c.degree} ({c.field})
                      </td>
                    ))}
                  </tr>

                  {/* Location & Living Cost */}
                  <tr>
                    <td className="p-3.5 font-bold text-slate-500">City & Living Cost</td>
                    {courses.map((c) => (
                      <td key={c.id} className="p-3.5 text-slate-700">
                        <span className="font-bold block">{c.city}, {c.state}</span>
                        <span className="text-slate-500">~€{c.cityLivingInfo?.estimatedCostOfLivingEur || 950}/mo</span>
                      </td>
                    ))}
                  </tr>

                  {/* Language */}
                  <tr className="bg-slate-50/50">
                    <td className="p-3.5 font-bold text-slate-700">Instruction Language</td>
                    {courses.map((c) => (
                      <td key={c.id} className="p-3.5 font-extrabold text-slate-900">
                        {c.language}
                      </td>
                    ))}
                  </tr>

                  {/* Tuition Fee */}
                  <tr className="bg-emerald-50/30">
                    <td className="p-3.5 font-bold text-emerald-900">Tuition Fees</td>
                    {courses.map((c) => (
                      <td key={c.id} className="p-3.5 font-black text-emerald-700 text-sm">
                        {c.tuitionAmountEur === 0 ? "€0 (No Tuition)" : `€${c.tuitionAmountEur}/sem`}
                      </td>
                    ))}
                  </tr>

                  {/* Semester Contribution */}
                  <tr>
                    <td className="p-3.5 font-bold text-slate-500">Semester Contribution</td>
                    {courses.map((c) => (
                      <td key={c.id} className="p-3.5 text-slate-700 font-medium">
                        ~€{c.semesterContributionEur} / semester
                      </td>
                    ))}
                  </tr>

                  {/* Duration & Credits */}
                  <tr>
                    <td className="p-3.5 font-bold text-slate-500">Duration & ECTS</td>
                    {courses.map((c) => (
                      <td key={c.id} className="p-3.5 text-slate-800 font-medium">
                        {c.durationYears} Years ({c.ectsCredits} ECTS)
                      </td>
                    ))}
                  </tr>

                  {/* Intake Season */}
                  <tr>
                    <td className="p-3.5 font-bold text-slate-500">Intake Season</td>
                    {courses.map((c) => (
                      <td key={c.id} className="p-3.5 text-slate-800 font-bold">
                        {c.intake}
                      </td>
                    ))}
                  </tr>

                  {/* German GPA Cut-off */}
                  <tr className="bg-slate-50/50">
                    <td className="p-3.5 font-bold text-slate-700">Min. German GPA</td>
                    {courses.map((c) => (
                      <td key={c.id} className="p-3.5 font-extrabold text-slate-900">
                        ≤ {c.requirements.minGpaGermanScale || "2.5"} (German scale)
                      </td>
                    ))}
                  </tr>

                  {/* IELTS Requirement */}
                  <tr>
                    <td className="p-3.5 font-bold text-slate-500">Min. English (IELTS)</td>
                    {courses.map((c) => (
                      <td key={c.id} className="p-3.5 text-slate-800 font-bold">
                        {c.requirements.ieltsMin ? `IELTS ${c.requirements.ieltsMin}` : "Not required"}
                      </td>
                    ))}
                  </tr>

                  {/* Specific ECTS Requirements */}
                  <tr>
                    <td className="p-3.5 font-bold text-slate-500">Subject ECTS Gates</td>
                    {courses.map((c) => (
                      <td key={c.id} className="p-3.5 text-slate-700">
                        <ul className="space-y-1">
                          {c.requirements.requiredSubjectEcts.map((s, idx) => (
                            <li key={idx}>
                              <strong>{s.minEcts} ECTS:</strong> {s.subject}
                            </li>
                          ))}
                        </ul>
                      </td>
                    ))}
                  </tr>

                  {/* Next Deadline */}
                  <tr className="bg-amber-50/30">
                    <td className="p-3.5 font-bold text-amber-900">Application Deadline</td>
                    {courses.map((c) => (
                      <td key={c.id} className="p-3.5 font-extrabold text-red-600">
                        {c.deadline.winterDeadline}
                        <span className="block text-[10px] text-slate-500 font-normal">
                          {c.deadline.daysRemaining} days remaining
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Action row */}
                  <tr>
                    <td className="p-3.5 font-bold text-slate-500">Action</td>
                    {courses.map((c) => (
                      <td key={c.id} className="p-3.5">
                        <button
                          onClick={() => onViewCourse(c)}
                          className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                        >
                          View Details
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
