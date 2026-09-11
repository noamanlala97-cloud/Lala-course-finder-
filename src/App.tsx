import React, { useState, useEffect } from "react";
import { Navbar } from "./components/layout/Navbar";
import { BottomNav } from "./components/layout/BottomNav";
import { Footer } from "./components/layout/Footer";
import { HeroSection } from "./components/home/HeroSection";
import { HomeFeatures } from "./components/home/HomeFeatures";
import { CourseSearchPage } from "./components/courses/CourseSearchPage";
import { CourseDetailsModal } from "./components/courses/CourseDetailsModal";
import { TranscriptMatcherPage } from "./components/matcher/TranscriptMatcherPage";
import { UniversityExplorerPage } from "./components/universities/UniversityExplorerPage";
import { CourseCompareModal } from "./components/compare/CourseCompareModal";
import { StudyPlanView } from "./components/studyplan/StudyPlanView";
import { ApplicationTrackerView } from "./components/applications/ApplicationTrackerView";
import { ResourcesView } from "./components/resources/ResourcesView";
import { UserDashboardPage } from "./components/dashboard/UserDashboardPage";
import { StudyAdvisorModal } from "./components/advisor/StudyAdvisorModal";
import { SopCvAssistantModal } from "./components/assistant/SopCvAssistantModal";

import {
  Course,
  University,
  StudentProfile,
  CourseMatchResult,
  SavedCourse,
  StudyPlan,
  ApplicationTrackerItem,
  ApplicationStatus
} from "./types";

import { COURSES_DATA } from "./data/coursesData";
import { UNIVERSITIES_DATA } from "./data/universitiesData";
import { DEFAULT_DEMO_STUDENT, calculateCourseMatch } from "./utils/matchingEngine";
import { Sparkles, MessageSquare } from "lucide-react";

export default function App() {
  // Navigation State
  const [currentView, setCurrentView] = useState<string>("home");

  // Core Data State
  const [courses, setCourses] = useState<Course[]>(COURSES_DATA);
  const [universities, setUniversities] = useState<University[]>(UNIVERSITIES_DATA);
  const [studentProfile, setStudentProfile] = useState<StudentProfile>(DEFAULT_DEMO_STUDENT);

  // Saved Courses State
  const [savedCourses, setSavedCourses] = useState<SavedCourse[]>([
    {
      id: "saved-1",
      courseId: "course-pharm-freiburg",
      category: "Dream",
      savedAt: "2026-03-01"
    },
    {
      id: "saved-2",
      courseId: "course-molbio-heidelberg",
      category: "Strong Match",
      savedAt: "2026-03-02"
    },
    {
      id: "saved-3",
      courseId: "course-drugdisc-bonn",
      category: "Backup",
      savedAt: "2026-03-03"
    }
  ]);

  // Comparison State (up to 4)
  const [compareIds, setCompareIds] = useState<string[]>([
    "course-pharm-freiburg",
    "course-molbio-heidelberg"
  ]);

  // Study Plan State
  const [studyPlan, setStudyPlan] = useState<StudyPlan>({
    targetIntake: "Winter",
    targetYear: 2026,
    checklist: [
      {
        id: "chk-aps",
        title: "APS Certificate (India)",
        category: "Verification",
        completed: true,
        notes: "Digital certificate issued"
      },
      {
        id: "chk-ielts",
        title: "IELTS Academic (Score 7.5)",
        category: "Language",
        completed: true,
        notes: "Valid through 2027"
      },
      {
        id: "chk-transcript",
        title: "Official Degree Transcripts & Syllabus Copy",
        category: "Academic",
        completed: true,
        notes: "Sealed university transcripts ready"
      },
      {
        id: "chk-uniassist",
        title: "uni-assist VPD (Vorprüfungsdokumentation) Submission",
        category: "Application",
        completed: false,
        notes: "Required for Freiburg & Bonn"
      },
      {
        id: "chk-sop",
        title: "Course-Specific Statements of Purpose (SOP)",
        category: "Documents",
        completed: false,
        notes: "Tailored to faculty research focus"
      },
      {
        id: "chk-lor",
        title: "Letters of Recommendation (2 Academic)",
        category: "Documents",
        completed: true,
        notes: "Signed by Department Head"
      },
      {
        id: "chk-blocked",
        title: "Blocked Account (€11,904)",
        category: "Financial",
        completed: false,
        notes: "Open with Expatrio or Fintiba"
      },
      {
        id: "chk-insurance",
        title: "Statutory German Student Health Insurance",
        category: "Insurance",
        completed: false,
        notes: "TK or Barmer"
      },
      {
        id: "chk-visa",
        title: "German National Student Visa Appointment",
        category: "Embassy",
        completed: false,
        notes: "VFS Global / German Embassy waitlist"
      }
    ]
  });

  // Applications Tracker State
  const [applications, setApplications] = useState<ApplicationTrackerItem[]>([
    {
      id: "app-1",
      courseId: "course-pharm-freiburg",
      courseName: "M.Sc. Pharmaceutical Sciences",
      universityName: "University of Freiburg",
      deadline: "15.07.2026",
      status: "Preparing Documents",
      notes: "Awaiting final notarized syllabus translation for Organic Chemistry.",
      timeline: [
        { date: "15.02.2026", title: "Course Shortlisted", note: "Match score 91%" },
        { date: "28.02.2026", title: "APS Verified", note: "Uploaded to uni-assist" }
      ]
    },
    {
      id: "app-2",
      courseId: "course-molbio-heidelberg",
      courseName: "M.Sc. Molecular Biosciences",
      universityName: "Heidelberg University",
      deadline: "15.03.2026",
      status: "Ready to Apply",
      notes: "SOP finished. Need to finalize online portal submission.",
      timeline: [
        { date: "20.01.2026", title: "Account Created", note: "HeiCo portal registered" }
      ]
    }
  ]);

  // Modals State
  const [selectedCourseForModal, setSelectedCourseForModal] = useState<Course | null>(null);
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [sopModalCourse, setSopModalCourse] = useState<Course | null>(null);

  // Sync with backend API on mount
  useEffect(() => {
    async function loadBackendData() {
      try {
        const [cRes, uRes, pRes] = await Promise.all([
          fetch("/api/courses").then((r) => (r.ok ? r.json() : null)),
          fetch("/api/universities").then((r) => (r.ok ? r.json() : null)),
          fetch("/api/profile").then((r) => (r.ok ? r.json() : null))
        ]);
        if (cRes && cRes.courses) setCourses(cRes.courses);
        if (uRes && uRes.universities) setUniversities(uRes.universities);
        if (pRes && pRes.profile) setStudentProfile(pRes.profile);
      } catch (e) {
        console.warn("Backend API sync fallback to bundled data:", e);
      }
    }
    loadBackendData();
  }, []);

  // Matching Action
  const handleRunMatch = async (profile: StudentProfile): Promise<CourseMatchResult[]> => {
    try {
      const res = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile })
      });
      if (res.ok) {
        const data = await res.json();
        return data.matches;
      }
    } catch (e) {
      console.warn("API match call failed, calculating locally:", e);
    }
    // Local calculation fallback
    return courses.map((course) => calculateCourseMatch(studentProfile, course));
  };

  // Toggle Save Course
  const handleToggleSaveCourse = (courseOrId: Course | string) => {
    const courseId = typeof courseOrId === "string" ? courseOrId : courseOrId.id;
    setSavedCourses((prev) => {
      const existing = prev.find((s) => s.courseId === courseId);
      if (existing) {
        return prev.filter((s) => s.courseId !== courseId);
      } else {
        const foundCourse = typeof courseOrId !== "string" ? courseOrId : courses.find((c) => c.id === courseId);
        return [
          ...prev,
          {
            id: `saved-${Date.now()}`,
            courseId,
            category: "Strong Match",
            savedAt: new Date().toISOString().split("T")[0],
            course: foundCourse
          }
        ];
      }
    });
  };

  // Toggle Compare Course
  const handleToggleCompareCourse = (courseOrId: Course | string) => {
    const courseId = typeof courseOrId === "string" ? courseOrId : courseOrId.id;
    setCompareIds((prev) => {
      if (prev.includes(courseId)) {
        return prev.filter((id) => id !== courseId);
      } else {
        if (prev.length >= 4) {
          return prev;
        }
        return [...prev, courseId];
      }
    });
  };

  // Update Profile
  const handleUpdateProfile = async (updated: StudentProfile) => {
    setStudentProfile(updated);
    try {
      await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated)
      });
    } catch (err) {
      console.error("Failed to persist profile to server:", err);
    }
  };

  // Saved Courses enriched with Course objects
  const enrichedSavedCourses = savedCourses.map((s) => ({
    ...s,
    course: courses.find((c) => c.id === s.courseId)
  }));

  // Courses selected for comparison
  const compareCourses = courses.filter((c) => compareIds.includes(c.id));

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-red-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={setCurrentView}
        savedCount={savedCourses.length}
        compareCount={compareIds.length}
        onOpenCompare={() => setIsCompareModalOpen(true)}
      />

      {/* Main Content Areas */}
      <main className="flex-1">
        {/* VIEW 1: HOME */}
        {currentView === "home" && (
          <div>
            <HeroSection
              onStartMatching={() => setCurrentView("matcher")}
              onExploreCourses={() => setCurrentView("courses")}
            />
            <HomeFeatures
              onNavigate={setCurrentView}
              onOpenAdvisor={() => setIsAdvisorOpen(true)}
            />
          </div>
        )}

        {/* VIEW 2: COURSE SEARCH & CATALOG */}
        {currentView === "courses" && (
          <CourseSearchPage
            courses={courses}
            savedCourseIds={savedCourses.map((s) => s.courseId)}
            compareCourseIds={compareIds}
            onSelectCourse={setSelectedCourseForModal}
            onToggleSave={handleToggleSaveCourse}
            onToggleCompare={handleToggleCompareCourse}
            onOpenAdvisor={() => setIsAdvisorOpen(true)}
          />
        )}

        {/* VIEW 3: TRANSCRIPT MATCHER & ELIGIBILITY */}
        {currentView === "matcher" && (
          <TranscriptMatcherPage
            currentProfile={studentProfile}
            onUpdateProfile={handleUpdateProfile}
            onRunMatch={handleRunMatch}
            onViewCourse={setSelectedCourseForModal}
          />
        )}

        {/* VIEW 4: UNIVERSITY & CITY EXPLORER */}
        {currentView === "universities" && (
          <UniversityExplorerPage
            universities={universities}
            courses={courses}
            onSelectCourse={setSelectedCourseForModal}
            onFilterCoursesByUniversity={() => setCurrentView("courses")}
          />
        )}

        {/* VIEW 5: STUDY PLAN & DEADLINES */}
        {currentView === "study-plan" && (
          <StudyPlanView
            studyPlan={studyPlan}
            savedCourses={enrichedSavedCourses}
            allCourses={courses}
            onUpdatePlan={(updated) => setStudyPlan({ ...studyPlan, ...updated })}
            onRemoveSavedCourse={handleToggleSaveCourse}
            onViewCourse={setSelectedCourseForModal}
            onOpenSopAssistant={setSopModalCourse}
          />
        )}

        {/* VIEW 6: APPLICATION TRACKER & CONSISTENCY */}
        {currentView === "applications" && (
          <ApplicationTrackerView
            applications={applications}
            onUpdateStatus={(id, status) => {
              setApplications(
                applications.map((a) => (a.id === id ? { ...a, status } : a))
              );
            }}
            onUpdateNotes={(id, notes) => {
              setApplications(
                applications.map((a) => (a.id === id ? { ...a, notes } : a))
              );
            }}
            onDeleteApplication={(id) => {
              setApplications(applications.filter((a) => a.id !== id));
            }}
          />
        )}

        {/* VIEW 7: GUIDES & RESOURCES */}
        {currentView === "resources" && <ResourcesView />}

        {/* VIEW 8: USER DASHBOARD */}
        {currentView === "dashboard" && (
          <UserDashboardPage
            profile={studentProfile}
            savedCourses={enrichedSavedCourses}
            studyPlan={studyPlan}
            applications={applications}
            onUpdateProfile={handleUpdateProfile}
            onNavigateMatcher={() => setCurrentView("matcher")}
            onNavigateCourses={() => setCurrentView("courses")}
            onViewCourse={setSelectedCourseForModal}
            onOpenAdvisor={() => setIsAdvisorOpen(true)}
          />
        )}
      </main>

      {/* Persistent Floating AI Study Advisor Button */}
      <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40">
        <button
          onClick={() => setIsAdvisorOpen(true)}
          className="px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-2xl shadow-xl shadow-blue-600/30 flex items-center gap-2.5 font-extrabold text-xs sm:text-sm cursor-pointer transition-all hover:scale-105 active:scale-95 border border-white/20"
        >
          <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          </div>
          <span>LALA AI Advisor</span>
        </button>
      </div>

      {/* Mobile Bottom Navigation (Visible on mobile/tablet) */}
      <div className="sm:hidden">
        <BottomNav activeTab={currentView} onNavigate={setCurrentView} />
      </div>

      {/* MODALS */}
      {/* Course Details Modal */}
      <CourseDetailsModal
        course={selectedCourseForModal}
        isOpen={!!selectedCourseForModal}
        onClose={() => setSelectedCourseForModal(null)}
        isSaved={selectedCourseForModal ? savedCourses.some((s) => s.courseId === selectedCourseForModal.id) : false}
        onToggleSave={() => selectedCourseForModal && handleToggleSaveCourse(selectedCourseForModal.id)}
        onOpenAdvisor={() => {
          setSelectedCourseForModal(null);
          setIsAdvisorOpen(true);
        }}
        onDraftSop={() => {
          if (selectedCourseForModal) {
            const course = selectedCourseForModal;
            setSelectedCourseForModal(null);
            setSopModalCourse(course);
          }
        }}
      />

      {/* Compare Modal */}
      <CourseCompareModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        courses={compareCourses}
        onRemoveFromCompare={handleToggleCompareCourse}
        onViewCourse={(c) => {
          setIsCompareModalOpen(false);
          setSelectedCourseForModal(c);
        }}
      />

      {/* AI Study Advisor Modal */}
      <StudyAdvisorModal
        isOpen={isAdvisorOpen}
        onClose={() => setIsAdvisorOpen(false)}
        studentProfile={studentProfile}
      />

      {/* AI SOP & CV Assistant Modal */}
      {sopModalCourse && (
        <SopCvAssistantModal
          isOpen={!!sopModalCourse}
          onClose={() => setSopModalCourse(null)}
          course={sopModalCourse}
        />
      )}

      {/* Footer */}
      <Footer onNavigate={setCurrentView} />
    </div>
  );
}
