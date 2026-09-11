import React, { useState } from "react";
import {
  Bell,
  User,
  Search,
  Sparkles,
  Calendar,
  Layers,
  Scale,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  X
} from "lucide-react";
import { AppLogo } from "../common/AppLogo";
import { UserNotification } from "../../types";

interface NavbarProps {
  currentView?: string;
  activeTab?: string;
  onNavigate: (tab: string) => void;
  savedCount: number;
  compareCount: number;
  notifications?: UserNotification[];
  onOpenAdvisor?: () => void;
  onOpenCompare?: () => void;
  onOpenAdmin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView = "home",
  activeTab = currentView,
  onNavigate,
  savedCount,
  compareCount,
  notifications = [],
  onOpenAdvisor = () => {},
  onOpenCompare = () => {},
  onOpenAdmin = () => {}
}) => {
  const [notifOpen, setNotifOpen] = useState(false);

  const effectiveView = currentView || activeTab;

  const getSubTitle = () => {
    switch (effectiveView) {
      case "courses":
        return "Courses";
      case "matcher":
        return "Ai Match";
      case "study-plan":
      case "planner":
        return "Planner";
      case "dashboard":
      case "profile":
        return "Profile";
      case "universities":
        return "Universities";
      case "compare":
        return "Comparison";
      case "advisor":
        return "AI Advisor";
      default:
        return "Home";
    }
  };

  const defaultNotifications: UserNotification[] = [
    {
      id: "notif-1",
      userId: "user-1",
      title: "Deadline Alert: Bayreuth",
      message: "28 days left to submit for M.Sc. Natural Products & Drug Chemistry.",
      createdAt: "10m ago",
      type: "deadline",
      read: false
    },
    {
      id: "notif-2",
      userId: "user-1",
      title: "Prüfungsordnung Synced",
      message: "Updated curriculum data for Baden-Württemberg state universities.",
      createdAt: "2h ago",
      type: "match",
      read: false
    }
  ];

  const activeNotifs = notifications.length > 0 ? notifications : defaultNotifications;
  const unreadCount = activeNotifs.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Brand with Exact Screenshot Layout */}
        <button
          onClick={() => onNavigate("home")}
          className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
        >
          <AppLogo size={36} className="transition-transform group-hover:scale-105" />
          <div>
            <span className="font-extrabold text-[17px] sm:text-lg tracking-tight text-slate-950 block leading-tight">
              GERMAN COURSE FINDER
            </span>
            <span className="text-xs text-slate-500 font-medium block">
              Study in Germany 🇩🇪 • {getSubTitle()}
            </span>
          </div>
        </button>

        {/* Desktop Quick Nav */}
        <nav className="hidden md:flex items-center gap-1.5">
          <button
            onClick={() => onNavigate("home")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              effectiveView === "home"
                ? "bg-slate-100 text-blue-700"
                : "text-slate-600 hover:text-slate-950 hover:bg-slate-50"
            }`}
          >
            Home
          </button>
          <button
            onClick={() => onNavigate("courses")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              effectiveView === "courses"
                ? "bg-slate-100 text-blue-700"
                : "text-slate-600 hover:text-slate-950 hover:bg-slate-50"
            }`}
          >
            Courses
          </button>
          <button
            onClick={() => onNavigate("matcher")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer ${
              effectiveView === "matcher"
                ? "bg-blue-50 text-blue-700 border border-blue-200"
                : "text-blue-600 hover:bg-blue-50/60"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>AI Match</span>
          </button>
          <button
            onClick={() => onNavigate("study-plan")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              effectiveView === "study-plan"
                ? "bg-slate-100 text-blue-700"
                : "text-slate-600 hover:text-slate-950 hover:bg-slate-50"
            }`}
          >
            Planner
          </button>
          <button
            onClick={onOpenAdvisor}
            className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-950 hover:bg-slate-50 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
            <span>AI Advisor</span>
          </button>
          {compareCount > 0 && (
            <button
              onClick={onOpenCompare}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Compare ({compareCount})</span>
            </button>
          )}
        </nav>

        {/* Right Icons: Notification Bell & Profile Avatar */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="w-9 h-9 rounded-full flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors relative cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-slate-800" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
              )}
            </button>

            {/* Notification Dropdown */}
            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 px-1">
                  <span className="font-bold text-xs text-slate-900">Notifications</span>
                  <button
                    onClick={() => setNotifOpen(false)}
                    className="text-slate-400 hover:text-slate-600 text-xs"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                  {activeNotifs.map((n) => (
                    <div key={n.id} className="py-2.5 px-1 hover:bg-slate-50 rounded-lg transition-colors">
                      <p className="font-bold text-xs text-slate-900">{n.title}</p>
                      <p className="text-[11px] text-slate-500 leading-snug mt-0.5">{n.message}</p>
                      <span className="text-[10px] text-slate-400 mt-1 block">{n.createdAt}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile Circle Avatar Button */}
          <button
            onClick={() => onNavigate("dashboard")}
            className="w-9 h-9 rounded-full bg-slate-950 text-white flex items-center justify-center hover:ring-2 hover:ring-blue-500/40 transition-all cursor-pointer shadow-sm"
            aria-label="Student Profile"
            title="Student Profile"
          >
            <User className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </header>
  );
};
