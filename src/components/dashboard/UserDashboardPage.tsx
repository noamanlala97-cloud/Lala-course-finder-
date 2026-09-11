import React, { useState } from "react";
import {
  User,
  GraduationCap,
  Calendar,
  Bookmark,
  CheckCircle,
  FileCheck,
  Edit2,
  Save,
  Clock,
  Sparkles,
  ExternalLink,
  MapPin,
  TrendingUp,
  Award,
  Layers,
  ArrowRight
} from "lucide-react";
import { StudentProfile, Course, SavedCourse, StudyPlan, ApplicationTrackerItem } from "../../types";

interface UserDashboardPageProps {
  profile: StudentProfile;
  savedCourses: (SavedCourse & { course?: Course })[];
  studyPlan: StudyPlan;
  applications: ApplicationTrackerItem[];
  onUpdateProfile: (updated: StudentProfile) => void;
  onNavigateMatcher: () => void;
  onNavigateCourses: () => void;
  onViewCourse: (course: Course) => void;
  onOpenAdvisor: () => void;
}

export const UserDashboardPage: React.FC<UserDashboardPageProps> = ({
  profile,
  savedCourses,
  studyPlan,
  applications,
  onUpdateProfile,
  onNavigateMatcher,
  onNavigateCourses,
  onViewCourse,
  onOpenAdvisor
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<StudentProfile>({ ...profile });

  const handleSaveProfile = () => {
    onUpdateProfile(editedProfile);
    setIsEditing(false);
  };

  const completedChecklistCount = studyPlan.checklist.filter((i) => i.completed).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-10">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 to-slate-900 text-white flex items-center justify-center font-black text-2xl shadow-sm">
            {profile.degree ? profile.degree.charAt(0) : "P"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Priya Sharma
              </h1>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                Profile Verified
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {profile.degree} • {profile.university} ({profile.country})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isEditing ? (
            <button
              onClick={handleSaveProfile}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Academic Details</span>
            </button>
          )}

          <button
            onClick={onNavigateMatcher}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Re-match Transcript</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase">Saved Programs</span>
          <span className="text-2xl font-black text-slate-900 block">{savedCourses.length}</span>
          <span className="text-[11px] text-slate-500">Shortlisted for Germany</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase">Active Applications</span>
          <span className="text-2xl font-black text-slate-900 block">{applications.length}</span>
          <span className="text-[11px] text-slate-500">In application pipeline</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase">Milestones Done</span>
          <span className="text-2xl font-black text-slate-900 block">
            {completedChecklistCount}/{studyPlan.checklist.length}
          </span>
          <span className="text-[11px] text-emerald-600 font-semibold">
            {Math.round((completedChecklistCount / studyPlan.checklist.length) * 100)}% Complete
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase">Target Intake</span>
          <span className="text-xl font-black text-red-600 block">
            {studyPlan.targetIntake} {studyPlan.targetYear}
          </span>
          <span className="text-[11px] text-slate-500">Deadlines track active</span>
        </div>
      </div>

      {/* Split View: Profile Details + Saved Courses Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Academic Profile Summary (Editable) */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200 p-6 space-y-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-red-600" />
              <span>Academic Credentials & Scores</span>
            </h3>
            {isEditing && <span className="text-xs font-bold text-red-600">Editing Mode</span>}
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <span className="font-bold text-slate-500 block">Degree Discipline</span>
              {isEditing ? (
                <input
                  type="text"
                  value={editedProfile.degree}
                  onChange={(e) => setEditedProfile({ ...editedProfile, degree: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-medium"
                />
              ) : (
                <span className="font-extrabold text-slate-900 text-sm block">
                  {profile.degree}
                </span>
              )}
            </div>

            <div className="space-y-1">
              <span className="font-bold text-slate-500 block">Undergraduate University</span>
              {isEditing ? (
                <input
                  type="text"
                  value={editedProfile.university}
                  onChange={(e) => setEditedProfile({ ...editedProfile, university: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-medium"
                />
              ) : (
                <span className="font-extrabold text-slate-900 text-sm block">
                  {profile.university}
                </span>
              )}
            </div>

            <div className="space-y-1">
              <span className="font-bold text-slate-500 block">Cumulative GPA</span>
              {isEditing ? (
                <input
                  type="number"
                  step="0.01"
                  value={editedProfile.cgpa}
                  onChange={(e) => setEditedProfile({ ...editedProfile, cgpa: Number(e.target.value) })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold"
                />
              ) : (
                <span className="font-extrabold text-slate-900 text-sm block">
                  {profile.cgpa} / 4.0 ({profile.percentage}%)
                </span>
              )}
            </div>

            <div className="space-y-1">
              <span className="font-bold text-slate-500 block">Total Credits (ECTS Equiv.)</span>
              {isEditing ? (
                <input
                  type="number"
                  value={editedProfile.totalCredits}
                  onChange={(e) => setEditedProfile({ ...editedProfile, totalCredits: Number(e.target.value) })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold"
                />
              ) : (
                <span className="font-extrabold text-slate-900 text-sm block">
                  {profile.totalCredits} ECTS Credits
                </span>
              )}
            </div>

            <div className="space-y-1">
              <span className="font-bold text-slate-500 block">English (IELTS / TOEFL)</span>
              {isEditing ? (
                <input
                  type="number"
                  step="0.5"
                  value={editedProfile.ielts || 7.0}
                  onChange={(e) => setEditedProfile({ ...editedProfile, ielts: Number(e.target.value) })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold"
                />
              ) : (
                <span className="font-extrabold text-slate-900 text-sm block">
                  IELTS {profile.ielts} • TOEFL {profile.toefl}
                </span>
              )}
            </div>

            <div className="space-y-1">
              <span className="font-bold text-slate-500 block">German Language Proficiency</span>
              {isEditing ? (
                <select
                  value={editedProfile.germanLevel || "None"}
                  onChange={(e) => setEditedProfile({ ...editedProfile, germanLevel: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-medium"
                >
                  <option value="None">None</option>
                  <option value="A1">A1</option>
                  <option value="A2">A2</option>
                  <option value="B1">B1</option>
                  <option value="B2">B2</option>
                </select>
              ) : (
                <span className="font-extrabold text-slate-900 text-sm block">
                  {profile.germanLevel || "None"}
                </span>
              )}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-2">
            <span className="text-xs font-bold text-slate-800 block">Practical & Research Background</span>
            <p className="text-xs text-slate-600 leading-relaxed">
              <strong>Internship:</strong> {profile.internships}
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              <strong>Research:</strong> {profile.researchExperience}
            </p>
          </div>
        </div>

        {/* Right: Saved Courses & Pipeline Overview */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-red-600" />
                <span>Shortlisted Programs ({savedCourses.length})</span>
              </h3>
              <button
                onClick={onNavigateCourses}
                className="text-xs font-bold text-red-600 hover:underline cursor-pointer"
              >
                Search More Courses
              </button>
            </div>

            {savedCourses.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-6 text-center">
                No courses saved yet. Browse courses and click &ldquo;Save&rdquo; to populate your study plan.
              </p>
            ) : (
              <div className="space-y-2.5">
                {savedCourses.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => s.course && onViewCourse(s.course)}
                    className="p-3.5 rounded-2xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">
                          {s.course?.universityName}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-red-50 text-red-700 font-bold">
                          {s.category}
                        </span>
                      </div>
                      <h4 className="font-extrabold text-xs sm:text-sm text-slate-900">
                        {s.course?.name}
                      </h4>
                      <span className="text-[11px] text-slate-500">
                        {s.course?.language} • {s.course?.deadline.winterDeadline}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* AI Advisor Callout */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-3xl p-6 text-white border border-slate-800 space-y-3 shadow-md">
            <div className="flex items-center gap-2 text-amber-300 text-xs font-bold">
              <Sparkles className="w-4 h-4" />
              <span>Need Guidance On Your German Plan?</span>
            </div>
            <h4 className="text-base font-extrabold">Ask the LALA AI Study Advisor</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Verify your specific subject credits against Heidelberg, LMU Munich, or RWTH Aachen module prerequisites anytime.
            </p>
            <button
              onClick={onOpenAdvisor}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <span>Launch Advisor Session</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
