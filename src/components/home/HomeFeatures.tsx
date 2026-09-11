import React from "react";
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  FileCheck,
  Scale,
  Calendar,
  Layers,
  ArrowRight,
  Clock,
  MapPin,
  ExternalLink,
  GraduationCap,
  FileSpreadsheet,
  Radar
} from "lucide-react";
import { Course, University } from "../../types";
import { COURSES_DATA } from "../../data/coursesData";
import { UNIVERSITIES_DATA } from "../../data/universitiesData";

interface HomeFeaturesProps {
  courses?: Course[];
  universities?: University[];
  onSelectCourse?: (course: Course) => void;
  onSelectUniversity?: (uni: University) => void;
  onNavigateCourses?: (field?: string) => void;
  onNavigateMatcher?: () => void;
  onNavigateCompare?: () => void;
  onNavigatePlan?: () => void;
  onNavigate?: (tab: string) => void;
  onOpenAdvisor?: () => void;
}

export const HomeFeatures: React.FC<HomeFeaturesProps> = ({
  courses = COURSES_DATA,
  universities = UNIVERSITIES_DATA,
  onSelectCourse = () => {},
  onSelectUniversity = () => {},
  onNavigateCourses,
  onNavigateMatcher,
  onNavigateCompare,
  onNavigatePlan,
  onNavigate,
  onOpenAdvisor = () => {}
}) => {
  const handleNavCourses = (field?: string) => {
    if (onNavigateCourses) onNavigateCourses(field);
    else if (onNavigate) onNavigate("courses");
  };

  const handleNavMatcher = () => {
    if (onNavigateMatcher) onNavigateMatcher();
    else if (onNavigate) onNavigate("matcher");
  };

  const handleNavPlan = () => {
    if (onNavigatePlan) onNavigatePlan();
    else if (onNavigate) onNavigate("study-plan");
  };

  const popularFields = [
    {
      name: "Pharmacy & Drug Chemistry",
      sub: "Biopharma, Regulatory Affairs",
      courses: 84,
      icon: "💊",
      color: "bg-blue-50 text-blue-700 border-blue-100"
    },
    {
      name: "Computer Science & AI",
      sub: "Software, Machine Learning",
      courses: 210,
      icon: "💻",
      color: "bg-indigo-50 text-indigo-700 border-indigo-100"
    },
    {
      name: "Biotechnology & Life Sciences",
      sub: "Genomics, Molecular Biology",
      courses: 115,
      icon: "🧬",
      color: "bg-emerald-50 text-emerald-700 border-emerald-100"
    },
    {
      name: "Mechanical & Automotive Eng",
      sub: "Robotics, Powertrain Systems",
      courses: 160,
      icon: "⚙️",
      color: "bg-amber-50 text-amber-700 border-amber-100"
    },
    {
      name: "Data Science & Business Analytics",
      sub: "Big Data, Decision Systems",
      courses: 95,
      icon: "📈",
      color: "bg-purple-50 text-purple-700 border-purple-100"
    }
  ];

  const topUnis = [
    {
      id: "tum",
      name: "Technical University of Munich",
      city: "Munich, Bavaria",
      type: "Public",
      badge: "TU9 Excellence",
      tuition: "€0 Tuition",
      programsCount: 148,
      image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "bayreuth",
      name: "University of Bayreuth",
      city: "Bayreuth, Bavaria",
      type: "Public",
      badge: "High Research Output",
      tuition: "€0 Tuition",
      programsCount: 52,
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "rwth",
      name: "RWTH Aachen University",
      city: "Aachen, NRW",
      type: "Public",
      badge: "TU9 Excellence",
      tuition: "€0 Tuition",
      programsCount: 96,
      image: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "heidelberg",
      name: "Heidelberg University",
      city: "Heidelberg, Baden-Württ.",
      type: "Public",
      badge: "Oldest University",
      tuition: "Public",
      programsCount: 74,
      image: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=800&q=80"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-12 pb-24">
      {/* SECTION 1: SEARCH UNIVERSITIES SMARTER */}
      <section className="space-y-4">
        <div>
          <div className="flex items-center gap-1.5">
            <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
              Search Universities Smarter
            </h2>
            <ShieldCheck className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Built specifically for international applicants
          </p>
        </div>

        <div className="space-y-3">
          {/* Feature 1 */}
          <div
            onClick={handleNavMatcher}
            className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:border-blue-300 hover:shadow-md transition-all cursor-pointer flex items-start gap-3.5 group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </div>
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm sm:text-base text-slate-950">
                  AI Transcript Matching
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200">
                  Top Feature
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Parses credit weightings (ECTS) and syllabus tags to verify your direct eligibility for specialized master's.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div
            onClick={handleNavMatcher}
            className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:border-blue-300 hover:shadow-md transition-all cursor-pointer flex items-start gap-3.5 group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
              <FileSpreadsheet className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </div>
            <div className="space-y-1 flex-1">
              <h3 className="font-extrabold text-sm sm:text-base text-slate-950">
                Eligibility & ECTS Analysis
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Identifies credit shortfalls before you apply so you avoid non-refundable Uni-Assist evaluation rejections.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div
            onClick={() => handleNavCourses()}
            className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:border-blue-300 hover:shadow-md transition-all cursor-pointer flex items-start gap-3.5 group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
              <Scale className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </div>
            <div className="space-y-1 flex-1">
              <h3 className="font-extrabold text-sm sm:text-base text-slate-950">
                University Comparison Matrix
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Side-by-side comparison for semester ticket costs, living expenses in each German state, and lab reputation.
              </p>
            </div>
          </div>

          {/* Feature 4 */}
          <div
            onClick={handleNavPlan}
            className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:border-blue-300 hover:shadow-md transition-all cursor-pointer flex items-start gap-3.5 group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
              <Radar className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </div>
            <div className="space-y-1 flex-1">
              <h3 className="font-extrabold text-sm sm:text-base text-slate-950">
                Real-time Deadline Radar
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Never miss non-EU visa document windows with live syncing for Winter and Summer application intakes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: HOW IT WORKS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
            How It Works
          </h2>
          <span className="text-xs font-bold text-blue-600">4 Simple Steps</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 space-y-2">
            <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
              1
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-slate-950">Create Profile</h4>
            <p className="text-[11px] text-slate-500 leading-snug">
              Set language level & target state.
            </p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 space-y-2">
            <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
              2
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-slate-950">Upload PDF</h4>
            <p className="text-[11px] text-slate-500 leading-snug">
              Provide official degree transcript.
            </p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 space-y-2">
            <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
              3
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-slate-950">ECTS Match</h4>
            <p className="text-[11px] text-slate-500 leading-snug">
              Instant PO cross-verification.
            </p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 space-y-2">
            <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
              4
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-slate-950">Apply & Fly</h4>
            <p className="text-[11px] text-slate-500 leading-snug">
              Direct uni portal or VPD.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3: POPULAR STUDY FIELDS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
            Popular Study Fields
          </h2>
          <button
            onClick={() => handleNavCourses()}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
          >
            View all
          </button>
        </div>

        <div className="space-y-2.5">
          {popularFields.map((field) => (
            <div
              key={field.name}
              onClick={() => handleNavCourses(field.name.split(" ")[0])}
              className="p-3.5 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer flex items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-lg">
                  {field.icon}
                </div>
                <div>
                  <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                    {field.name}
                  </h3>
                  <p className="text-[11px] text-slate-500">{field.sub}</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-[11px] font-extrabold border border-blue-100">
                {field.courses} courses
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4: TOP GERMAN UNIVERSITIES */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
              Top German Universities
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Globally recognized public institutions
            </p>
          </div>
          <button
            onClick={() => {
              if (onNavigate) onNavigate("universities");
              else handleNavCourses();
            }}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
          >
            See all
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {topUnis.map((uni) => (
            <div
              key={uni.id}
              onClick={() => handleNavCourses()}
              className="rounded-3xl border border-slate-200/80 overflow-hidden bg-white shadow-sm hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="relative h-44 overflow-hidden bg-slate-900">
                <img
                  src={uni.image}
                  alt={uni.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="px-2.5 py-1 rounded-full bg-blue-600/90 backdrop-blur-md text-white text-[10px] font-bold">
                    {uni.badge}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold">
                    {uni.tuition}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="font-extrabold text-base text-white leading-snug">
                    {uni.name}
                  </h3>
                </div>
              </div>

              <div className="p-3.5 flex items-center justify-between text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{uni.city} • {uni.type}</span>
                </div>
                <span className="font-bold text-blue-600 flex items-center gap-1">
                  {uni.programsCount} Programs <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 5: UPCOMING DEADLINES RADAR */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
              Upcoming Deadlines Radar
            </h2>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-red-50 text-red-700 text-[10px] font-bold border border-red-200">
            Urgent
          </span>
        </div>

        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">University of Bayreuth</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[10px] font-bold border border-amber-200">
                28 Days Left
              </span>
            </div>
            <h3 className="font-extrabold text-sm sm:text-base text-slate-950">
              M.Sc. Natural Products Chemistry
            </h3>
            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
              <span className="text-slate-500">Deadline: <strong className="text-slate-800">15 Jan 2025</strong></span>
              <span className="font-bold text-emerald-600">Open Now</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">TU Munich (TUM)</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[10px] font-bold border border-amber-200">
                34 Days Left
              </span>
            </div>
            <h3 className="font-extrabold text-sm sm:text-base text-slate-950">
              M.Sc. Data Engineering and Analytics
            </h3>
            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
              <span className="text-slate-500">Deadline: <strong className="text-slate-800">31 Jan 2025</strong></span>
              <span className="font-bold text-blue-600">VPD Required</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: VERIFIED ACADEMIC GUIDANCE BANNER */}
      <div className="p-5 sm:p-6 rounded-3xl bg-blue-50/70 border border-blue-200/70 space-y-4">
        <div className="flex items-start gap-2.5">
          <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="font-extrabold text-sm sm:text-base text-slate-950">
              Verified Academic Guidance
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Admission decisions are made exclusively by German universities. LALA COURSE FINDER provides informational matching, verified ECTS curriculum cross-referencing, and official DAAD / Uni-Assist guidance standards.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-bold text-blue-800">
          <span className="px-3 py-1 rounded-xl bg-white border border-blue-200 flex items-center gap-1.5 shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
            Uni-Assist Standards
          </span>
          <span className="px-3 py-1 rounded-xl bg-white border border-blue-200 flex items-center gap-1.5 shadow-2xs">
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            DAAD Framework
          </span>
          <span className="px-3 py-1 rounded-xl bg-white border border-blue-200 flex items-center gap-1.5 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            APS Compliance
          </span>
        </div>
      </div>
    </div>
  );
};
