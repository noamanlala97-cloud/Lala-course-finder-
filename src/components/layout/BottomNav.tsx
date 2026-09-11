import React from "react";
import { Home, Compass, Sparkles, Calendar, User } from "lucide-react";

interface BottomNavProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onNavigate }) => {
  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "courses", label: "Courses", icon: Compass },
    { id: "matcher", label: "AI Match", icon: Sparkles, isHighlight: true },
    { id: "study-plan", label: "Planner", icon: Calendar },
    { id: "dashboard", label: "Profile", icon: User }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200 px-2 py-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            activeTab === item.id ||
            (item.id === "matcher" && activeTab === "advisor") ||
            (item.id === "study-plan" && activeTab === "planner") ||
            (item.id === "dashboard" && activeTab === "profile");

          if (item.isHighlight) {
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="flex flex-col items-center justify-center -mt-4 group cursor-pointer"
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all transform group-hover:scale-105 active:scale-95 ${
                    isActive
                      ? "bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-blue-500/40 ring-4 ring-white"
                      : "bg-blue-600 text-white shadow-blue-500/25 ring-4 ring-white"
                  }`}
                >
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span
                  className={`text-[10px] mt-1 font-bold ${
                    isActive ? "text-blue-600 font-extrabold" : "text-slate-600"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
                isActive ? "text-blue-600 font-bold" : "text-slate-500 hover:text-slate-900 font-medium"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "stroke-[2.5px]" : "stroke-[1.8px]"}`} />
              <span className={`text-[10px] mt-0.5 ${isActive ? "font-bold text-blue-600" : "font-medium"}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
