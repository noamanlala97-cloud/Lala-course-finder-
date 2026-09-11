import React, { useState } from "react";
import {
  FileCheck,
  Clock,
  CheckCircle,
  AlertTriangle,
  Plus,
  Trash2,
  Calendar,
  Building,
  Edit2,
  ShieldCheck,
  Layers,
  ArrowRight
} from "lucide-react";
import { ApplicationTrackerItem, ApplicationStatus } from "../../types";

interface ApplicationTrackerViewProps {
  applications: ApplicationTrackerItem[];
  onUpdateStatus: (id: string, newStatus: ApplicationStatus) => void;
  onUpdateNotes: (id: string, notes: string) => void;
  onDeleteApplication: (id: string) => void;
}

const ALL_STATUSES: ApplicationStatus[] = [
  "Not Started",
  "Preparing Documents",
  "Ready to Apply",
  "Applied",
  "Under Review",
  "Interview",
  "Admission Received",
  "Rejected"
];

export const ApplicationTrackerView: React.FC<ApplicationTrackerViewProps> = ({
  applications,
  onUpdateStatus,
  onUpdateNotes,
  onDeleteApplication
}) => {
  // Document consistency check state
  const [passportName, setPassportName] = useState("PRIYA SHARMA");
  const [degreeName, setDegreeName] = useState("PRIYA SHARMA");
  const [transcriptName, setTranscriptName] = useState("PRIYA SHARMA");
  const [ieltsName, setIeltsName] = useState("PRIYA SHARMA");
  const [apsName, setApsName] = useState("PRIYA SHARMA");

  const [docResult, setDocResult] = useState<{
    status: string;
    message: string;
    mismatches?: string[];
    recommendation?: string;
  } | null>(null);

  const [isCheckingDocs, setIsCheckingDocs] = useState(false);

  const handleRunDocCheck = async () => {
    setIsCheckingDocs(true);
    try {
      const res = await fetch("/api/document-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          passportName,
          degreeName,
          transcriptName,
          ieltsName,
          apsName
        })
      });
      const data = await res.json();
      setDocResult(data);
    } catch (err) {
      setDocResult({
        status: "error",
        message: "Unable to run consistency check at this time."
      });
    } finally {
      setIsCheckingDocs(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-12">
      {/* Page Title */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-red-600">
          Admission Pipeline
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-0.5">
          Application Tracker & Document Verification 🇩🇪
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm mt-1">
          Monitor your university submissions from document preparation to admission letter release.
        </p>
      </div>

      {/* SECTION 1: ACTIVE APPLICATIONS PIPELINE */}
      <section className="space-y-6">
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
          Active University Applications ({applications.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {applications.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold text-red-600 uppercase">
                      {app.universityName}
                    </span>
                    <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                      {app.courseName}
                    </h3>
                  </div>
                  <button
                    onClick={() => onDeleteApplication(app.id)}
                    className="text-slate-400 hover:text-red-600 p-1"
                    title="Delete application"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Status selector */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-slate-500">Status:</span>
                  <select
                    value={app.status}
                    onChange={(e) => onUpdateStatus(app.id, e.target.value as ApplicationStatus)}
                    className="p-1.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 text-xs focus:ring-1 focus:ring-red-500"
                  >
                    {ALL_STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Submission Deadline: <strong>{app.deadline}</strong></span>
                </div>

                {/* Notes */}
                <div className="space-y-1 pt-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Applicant Notes</label>
                  <textarea
                    rows={2}
                    value={app.notes}
                    onChange={(e) => onUpdateNotes(app.id, e.target.value)}
                    placeholder="Add portal application ID, interview reminders, or LoR tracking notes..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>
              </div>

              {/* Timeline Milestones */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Application Log
                </span>
                <div className="space-y-1.5">
                  {app.timeline.map((t, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-600 mt-1.5 shrink-0"></span>
                      <div>
                        <span className="font-bold text-slate-800">{t.title}</span>{" "}
                        <span className="text-[11px] text-slate-400 font-mono">({t.date})</span>
                        <p className="text-[11px] text-slate-500">{t.note}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 2: DOCUMENT CONSISTENCY & NAME VERIFICATION CHECKER */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>German Embassy & uni-assist Compliance</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Document Consistency & Name Mismatch Checker
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed max-w-3xl">
            German universities and the German Visa Section strictly scrutinize spelling variations between your passport, degree certificate, transcripts, IELTS TRF, and APS certificate. Test your document credentials here.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-slate-700">1. Full Name on Passport (Gold Standard)</label>
            <input
              type="text"
              value={passportName}
              onChange={(e) => setPassportName(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono uppercase font-bold"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700">2. Name on Bachelor Degree Certificate</label>
            <input
              type="text"
              value={degreeName}
              onChange={(e) => setDegreeName(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono uppercase font-bold"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700">3. Name on Official University Transcript</label>
            <input
              type="text"
              value={transcriptName}
              onChange={(e) => setTranscriptName(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono uppercase font-bold"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700">4. Name on IELTS / TOEFL Test Report</label>
            <input
              type="text"
              value={ieltsName}
              onChange={(e) => setIeltsName(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono uppercase font-bold"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700">5. Name on APS India Certificate</label>
            <input
              type="text"
              value={apsName}
              onChange={(e) => setApsName(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono uppercase font-bold"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={handleRunDocCheck}
              disabled={isCheckingDocs}
              className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <FileCheck className="w-4 h-4" />
              <span>Verify Document Consistency</span>
            </button>
          </div>
        </div>

        {/* Verification Result Display */}
        {docResult && (
          <div
            className={`p-4 rounded-2xl border text-xs space-y-2 ${
              docResult.status === "consistent"
                ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                : "bg-amber-50 border-amber-200 text-amber-900"
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-sm">
              {docResult.status === "consistent" ? (
                <CheckCircle className="w-4 h-4 text-emerald-600" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-600" />
              )}
              <span>{docResult.message}</span>
            </div>

            {docResult.mismatches && (
              <ul className="list-disc pl-5 space-y-1 text-amber-800">
                {docResult.mismatches.map((m, idx) => (
                  <li key={idx}>{m}</li>
                ))}
              </ul>
            )}

            {docResult.recommendation && (
              <p className="text-[11px] text-slate-600 pt-1 border-t border-amber-200/60 leading-relaxed">
                <strong>Legal Recommendation:</strong> {docResult.recommendation}
              </p>
            )}
          </div>
        )}
      </section>
    </div>
  );
};
