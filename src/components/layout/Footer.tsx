import React from "react";
import { GraduationCap, ShieldCheck, Heart, ExternalLink, HelpCircle } from "lucide-react";

interface FooterProps {
  onSelectTab?: (tab: string) => void;
  onNavigate?: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab, onNavigate }) => {
  const handleNav = (tab: string) => {
    if (onNavigate) onNavigate(tab);
    else if (onSelectTab) onSelectTab(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-slate-950 text-slate-400 text-sm border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 via-amber-500 to-slate-800 p-0.5">
                <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-red-500" />
                </div>
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                LALA <span className="text-red-500">COURSE FINDER</span>
              </span>
            </div>

            <p className="text-slate-300 font-medium text-sm leading-relaxed max-w-md">
              “Find the right course. Match your profile. Study in Germany.”
            </p>

            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              The intelligent German admissions navigator. Upload your university transcript to instantly calculate academic ECTS compatibility, identify missing coursework prerequisites, and explore English-taught public programs with zero tuition.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Independent database verified against official university Prüfungsordnungen.</span>
            </div>
          </div>

          {/* Programs & Explorer */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Programs</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => handleNav("courses")}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  All Master's Programs
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav("courses")}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Tuition-Free Public Universities
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav("courses")}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  English-Taught Courses
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav("matcher")}
                  className="hover:text-red-400 text-red-400 font-semibold transition-colors cursor-pointer text-left"
                >
                  AI Transcript Matcher
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav("universities")}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Germany Universities Map
                </button>
              </li>
            </ul>
          </div>

          {/* Admission & Guides */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Admission Guides</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => handleNav("resources")}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  APS Certificate Guide
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav("resources")}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  ECTS Credit System Explained
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav("resources")}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  German GPA Formula (Bavarian)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav("resources")}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Blocked Account Requirements
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav("study-plan")}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Application Timeline Checklist
                </button>
              </li>
            </ul>
          </div>

          {/* Official Verification */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Admissions Accuracy</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every curriculum rule, minimum ECTS threshold, and language cut-off is audited against official university module handbooks.
            </p>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-[11px] text-slate-300">
              <span className="font-bold text-amber-400 block mb-1">Important Notice</span>
              German universities hold complete statutory autonomy over admissions. AI evaluation is an educational preparatory aid and does not constitute a legal guarantee of acceptance.
            </div>
          </div>
        </div>

        {/* Bottom micro-bar */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} LALA COURSE FINDER. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Built for students aspiring to study in Germany 🇩🇪</span>
            <button onClick={() => onSelectTab("resources")} className="hover:text-slate-300 cursor-pointer">
              Privacy & Data Policy
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
