import React, { useState } from "react";
import {
  CheckSquare,
  Square,
  Calendar,
  Clock,
  Trash2,
  Bookmark,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Plus,
  AlertCircle,
  TrendingUp,
  Award,
  ChevronRight
} from "lucide-react";
import { StudyPlan, Course, SavedCourse, ChecklistItem } from "../../types";

interface StudyPlanViewProps {
  studyPlan: StudyPlan;
  savedCourses: (SavedCourse & { course?: Course })[];
  allCourses: Course[];
  onUpdatePlan: (updatedPlan: Partial<StudyPlan>) => void;
  onRemoveSavedCourse: (courseId: string) => void;
  onViewCourse: (course: Course) => void;
  onOpenSopAssistant: (course: Course) => void;
}

export const StudyPlanView: React.FC<StudyPlanViewProps> = ({
  studyPlan,
  savedCourses,
  allCourses,
  onUpdatePlan,
  onRemoveSavedCourse,
  onViewCourse,
  onOpenSopAssistant
}) => {
  const [filterIntake, setFilterIntake] = useState<"All" | "Winter" | "Summer">("All");
  const [newChecklistText, setNewChecklistText] = useState("");

  const completedCount = studyPlan.checklist.filter((i) => i.completed).length;
  const progressPercent = Math.round((completedCount / studyPlan.checklist.length) * 100);

  const toggleChecklist = (id: string) => {
    const updated = studyPlan.checklist.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    onUpdatePlan({ checklist: updated });
  };

  const handleAddChecklistItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChecklistText.trim()) return;
    const newItem: ChecklistItem = {
      id: `chk-${Date.now()}`,
      title: newChecklistText.trim(),
      category: "Application",
      completed: false
    };
    onUpdatePlan({
      checklist: [...studyPlan.checklist, newItem]
    });
    setNewChecklistText("");
  };

  const dreamCourses = savedCourses.filter((s) => s.category === "Dream");
  const strongCourses = savedCourses.filter((s) => s.category === "Strong Match");
  const backupCourses = savedCourses.filter((s) => s.category === "Backup");

  // Deadlines list
  const deadlinesList = allCourses
    .filter((c) => {
      if (filterIntake === "All") return true;
      return c.intake === "Both" || c.intake === filterIntake;
    })
    .sort((a, b) => (a.deadline.daysRemaining || 999) - (b.deadline.daysRemaining || 999));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-red-600">
            Admissions Roadmap
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-0.5">
            My Germany Study Plan 🇩🇪
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm mt-1">
            Target Intake: <strong>{studyPlan.targetIntake} {studyPlan.targetYear}</strong> • Strategy: Dream, Strong & Backup Programs
          </p>
        </div>

        {/* Readiness Meter */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4 shrink-0">
          <div>
            <span className="text-[11px] font-bold text-slate-400 block uppercase">
              Application Readiness
            </span>
            <span className="text-xl font-black text-slate-900">{progressPercent}% Completed</span>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-slate-100 border-t-red-600 flex items-center justify-center font-bold text-xs text-slate-800">
            {completedCount}/{studyPlan.checklist.length}
          </div>
        </div>
      </div>

      {/* SECTION 1: COURSE APPLICATION STRATEGY (DREAM / STRONG / BACKUP) */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Shortlisted Programs by Strategy
            </h2>
            <p className="text-xs text-slate-500">
              Diversify your university portfolio across ambitious programs, strong statistical matches, and reliable backups.
            </p>
          </div>
          <span className="text-xs font-bold text-slate-500">{savedCourses.length} Programs Saved</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Dream Category */}
          <div className="bg-purple-50/50 rounded-3xl border border-purple-200/80 p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-purple-200">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span>
                <h3 className="font-extrabold text-sm text-purple-950">Dream Universities</h3>
              </div>
              <span className="text-xs font-extrabold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                {dreamCourses.length}
              </span>
            </div>

            {dreamCourses.length === 0 ? (
              <p className="text-xs text-purple-700/70 italic py-4 text-center">
                No dream courses saved yet. Save high-ranking competitive programs here.
              </p>
            ) : (
              <div className="space-y-3">
                {dreamCourses.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white p-3.5 rounded-2xl border border-purple-200/80 shadow-2xs space-y-2"
                  >
                    <div className="flex items-start justify-between gap-1">
                      <span className="text-[10px] uppercase font-bold text-slate-500">
                        {item.course?.universityName}
                      </span>
                      <button
                        onClick={() => onRemoveSavedCourse(item.courseId)}
                        className="text-slate-400 hover:text-red-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <h4
                      onClick={() => item.course && onViewCourse(item.course)}
                      className="font-bold text-xs text-slate-900 line-clamp-2 hover:text-red-600 cursor-pointer"
                    >
                      {item.course?.name}
                    </h4>
                    <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100">
                      <span className="text-emerald-700 font-bold">
                        {item.course?.tuitionAmountEur === 0 ? "€0 Tuition" : `€${item.course?.tuitionAmountEur}`}
                      </span>
                      <button
                        onClick={() => item.course && onOpenSopAssistant(item.course)}
                        className="text-purple-700 font-bold hover:underline"
                      >
                        Draft SOP
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Strong Match Category */}
          <div className="bg-emerald-50/50 rounded-3xl border border-emerald-200/80 p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-200">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                <h3 className="font-extrabold text-sm text-emerald-950">Strong Matches</h3>
              </div>
              <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                {strongCourses.length}
              </span>
            </div>

            {strongCourses.length === 0 ? (
              <p className="text-xs text-emerald-700/70 italic py-4 text-center">
                Save programs with &gt;80% match scores where coursework prerequisites are fully met.
              </p>
            ) : (
              <div className="space-y-3">
                {strongCourses.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white p-3.5 rounded-2xl border border-emerald-200/80 shadow-2xs space-y-2"
                  >
                    <div className="flex items-start justify-between gap-1">
                      <span className="text-[10px] uppercase font-bold text-slate-500">
                        {item.course?.universityName}
                      </span>
                      <button
                        onClick={() => onRemoveSavedCourse(item.courseId)}
                        className="text-slate-400 hover:text-red-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <h4
                      onClick={() => item.course && onViewCourse(item.course)}
                      className="font-bold text-xs text-slate-900 line-clamp-2 hover:text-red-600 cursor-pointer"
                    >
                      {item.course?.name}
                    </h4>
                    <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100">
                      <span className="text-emerald-700 font-bold">
                        {item.course?.tuitionAmountEur === 0 ? "€0 Tuition" : `€${item.course?.tuitionAmountEur}`}
                      </span>
                      <button
                        onClick={() => item.course && onOpenSopAssistant(item.course)}
                        className="text-emerald-700 font-bold hover:underline"
                      >
                        Draft SOP
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Backup Category */}
          <div className="bg-blue-50/50 rounded-3xl border border-blue-200/80 p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-blue-200">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                <h3 className="font-extrabold text-sm text-blue-950">Backup Options</h3>
              </div>
              <span className="text-xs font-extrabold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                {backupCourses.length}
              </span>
            </div>

            {backupCourses.length === 0 ? (
              <p className="text-xs text-blue-700/70 italic py-4 text-center">
                Save programs with open admission (zulassungsfrei) or more flexible ECTS thresholds.
              </p>
            ) : (
              <div className="space-y-3">
                {backupCourses.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white p-3.5 rounded-2xl border border-blue-200/80 shadow-2xs space-y-2"
                  >
                    <div className="flex items-start justify-between gap-1">
                      <span className="text-[10px] uppercase font-bold text-slate-500">
                        {item.course?.universityName}
                      </span>
                      <button
                        onClick={() => onRemoveSavedCourse(item.courseId)}
                        className="text-slate-400 hover:text-red-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <h4
                      onClick={() => item.course && onViewCourse(item.course)}
                      className="font-bold text-xs text-slate-900 line-clamp-2 hover:text-red-600 cursor-pointer"
                    >
                      {item.course?.name}
                    </h4>
                    <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100">
                      <span className="text-emerald-700 font-bold">
                        {item.course?.tuitionAmountEur === 0 ? "€0 Tuition" : `€${item.course?.tuitionAmountEur}`}
                      </span>
                      <button
                        onClick={() => item.course && onOpenSopAssistant(item.course)}
                        className="text-blue-700 font-bold hover:underline"
                      >
                        Draft SOP
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 2: GERMANY ADMISSION CHECKLIST */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Essential German Admissions Checklist
            </h2>
            <p className="text-xs text-slate-500">
              Mandatory milestones covering APS certification, blocked accounts, and university portals.
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            {completedCount} of {studyPlan.checklist.length} Steps Complete
          </span>
        </div>

        <div className="space-y-2.5">
          {studyPlan.checklist.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleChecklist(item.id)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                item.completed
                  ? "bg-slate-50/70 border-slate-200 text-slate-500"
                  : "bg-white border-slate-200 hover:border-slate-300 text-slate-900 shadow-2xs"
              }`}
            >
              <div className="flex items-center gap-3">
                {item.completed ? (
                  <CheckSquare className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <Square className="w-5 h-5 text-slate-400 shrink-0" />
                )}
                <div>
                  <span
                    className={`font-bold text-xs sm:text-sm ${
                      item.completed ? "line-through text-slate-400" : "text-slate-900"
                    }`}
                  >
                    {item.title}
                  </span>
                  {item.notes && (
                    <span className="text-[11px] text-slate-500 block">{item.notes}</span>
                  )}
                </div>
              </div>

              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 shrink-0">
                {item.category}
              </span>
            </div>
          ))}
        </div>

        {/* Add item form */}
        <form onSubmit={handleAddChecklistItem} className="flex gap-2 pt-2">
          <input
            type="text"
            placeholder="Add custom task or document requirement..."
            value={newChecklistText}
            onChange={(e) => setNewChecklistText(e.target.value)}
            className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-1 focus:ring-red-500"
          />
          <button
            type="submit"
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Item</span>
          </button>
        </form>
      </section>

      {/* SECTION 3: DEADLINE TRACKER */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-red-600">
              Admissions Countdown
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              German University Deadline Tracker
            </h2>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="font-bold text-slate-500">Filter Intake:</span>
            {(["All", "Winter", "Summer"] as const).map((i) => (
              <button
                key={i}
                onClick={() => setFilterIntake(i)}
                className={`px-3 py-1 rounded-lg font-bold border transition-colors cursor-pointer ${
                  filterIntake === i
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                }`}
              >
                {i}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Program & University</th>
                  <th className="py-3 px-4">Intake</th>
                  <th className="py-3 px-4">Application Deadline</th>
                  <th className="py-3 px-4">Countdown</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {deadlinesList.map((c) => {
                  const days = c.deadline.daysRemaining || 99;
                  let statusBadge = (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                      Open
                    </span>
                  );
                  if (days <= 30) {
                    statusBadge = (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-red-100 text-red-800">
                        Closing Soon
                      </span>
                    );
                  }
                  return (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900 block">{c.name}</span>
                        <span className="text-[11px] text-slate-500">{c.universityName}</span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-700">{c.intake}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{c.deadline.winterDeadline}</td>
                      <td className="py-3 px-4">
                        <span className="font-extrabold text-red-600">{days} days remaining</span>
                      </td>
                      <td className="py-3 px-4">{statusBadge}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => onViewCourse(c)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-bold text-[11px] cursor-pointer"
                        >
                          View Requirements
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};
