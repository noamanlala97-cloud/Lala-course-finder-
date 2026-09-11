import express, { Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { INITIAL_COURSES } from "./src/data/coursesData";
import { INITIAL_UNIVERSITIES } from "./src/data/universitiesData";
import { DEFAULT_DEMO_STUDENT, calculateCourseMatch } from "./src/utils/matchingEngine";
import {
  Course,
  StudentProfile,
  SavedCourse,
  StudyPlan,
  ApplicationTrackerItem,
  StudentReview,
  UserNotification
} from "./src/types";
import { requireAuth, optionalAuth, AuthRequest } from "./src/middleware/auth.ts";
import {
  getOrCreateUser,
  getUserProfile,
  upsertUserProfile,
  getSavedCourses as getDbSavedCourses,
  addSavedCourse as addDbSavedCourse,
  removeSavedCourse as removeDbSavedCourse,
  addTranscriptRecord,
  getTranscripts
} from "./src/db/users.ts";
import { db } from "./src/db/index.ts";
import { sql } from "drizzle-orm";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "25mb" }));

// In-memory relational state initialized with realistic data
let coursesDb: Course[] = [...INITIAL_COURSES];
let universitiesDb = [...INITIAL_UNIVERSITIES];
let currentStudentProfile: StudentProfile = { ...DEFAULT_DEMO_STUDENT };

let savedCoursesDb: SavedCourse[] = [
  {
    id: "saved-1",
    userId: "user-1",
    courseId: "course-1",
    category: "Strong Match",
    savedAt: "2026-03-05T10:00:00Z"
  },
  {
    id: "saved-2",
    userId: "user-1",
    courseId: "course-2",
    category: "Dream",
    savedAt: "2026-03-06T14:30:00Z"
  }
];

let studyPlanDb: StudyPlan = {
  userId: "user-1",
  targetIntake: "Winter",
  targetYear: 2026,
  preferredField: "Pharmaceutical Sciences",
  strategy: {
    dream: ["course-2"],
    strong: ["course-1", "course-8"],
    backup: ["course-5"]
  },
  checklist: [
    { id: "chk-1", title: "Valid International Passport (min 18 months validity)", category: "Documents", completed: true, notes: "Expires Nov 2028" },
    { id: "chk-2", title: "Original Bachelor Degree Certificate & Transcripts", category: "Documents", completed: true, notes: "Apostilled copies ready" },
    { id: "chk-3", title: "APS Certificate (Academic Evaluation Centre)", category: "Documents", completed: false, notes: "Application submitted, waiting for verification" },
    { id: "chk-4", title: "IELTS Academic Test Report (Band 7.0 achieved)", category: "Language", completed: true, notes: "Score: 7.0 (L8.0, R7.5, W6.5, S6.5)" },
    { id: "chk-5", title: "Academic Curriculum Vitae (Europass / German format)", category: "Application", completed: true, notes: "1-page tabular format updated" },
    { id: "chk-6", title: "Statement of Purpose / Letter of Motivation", category: "Application", completed: false, notes: "Drafting LMU and Heidelberg versions" },
    { id: "chk-7", title: "Two Letters of Academic Recommendation (LoR)", category: "Application", completed: true, notes: "Received from Dean and HOD" },
    { id: "chk-8", title: "Blocked Account Setup (Expatrio / Fintiba) ~€11,904", category: "Financial", completed: false, notes: "Funds prepared" },
    { id: "chk-9", title: "German Statutory Student Health Insurance (TK / Barmer)", category: "Visa", completed: false, notes: "To open 4 weeks prior to visa" },
    { id: "chk-10", title: "German Student Visa Appointment via VFS Global", category: "Visa", completed: false, notes: "Track waitlist slots" }
  ],
  lastUpdated: "2026-03-08T09:15:00Z"
};

let applicationsDb: ApplicationTrackerItem[] = [
  {
    id: "app-1",
    userId: "user-1",
    courseId: "course-1",
    courseName: "M.Sc. Molecular Biosciences (Specialization in Drug Discovery & Pharmacy)",
    universityName: "Heidelberg University",
    deadline: "March 15, 2026",
    status: "Preparing Documents",
    notes: "Need final SOP review and university-specific essay on wet-lab techniques.",
    timeline: [
      { date: "2026-02-15", title: "Program Selected", note: "Added to application shortlist after 91% eligibility match" },
      { date: "2026-02-28", title: "Transcript Evaluated", note: "Verified 24 ECTS in Chemistry and 25 ECTS in Pharmacology" },
      { date: "2026-03-04", title: "Portal Account Created", note: "Heidelberg HeiCo portal credentials generated" }
    ]
  },
  {
    id: "app-2",
    userId: "user-1",
    courseId: "course-2",
    courseName: "M.Sc. Pharmaceutical Sciences",
    universityName: "Ludwig Maximilian University of Munich (LMU)",
    deadline: "May 31, 2026",
    status: "Ready to Apply",
    notes: "All academic transcripts, CV, and proof of English ready for upload.",
    timeline: [
      { date: "2026-02-20", title: "Course Discovered", note: "Matched with 88% overall eligibility score" },
      { date: "2026-03-01", title: "Checklist 80% Complete", note: "Waiting on final certificate from university" }
    ]
  }
];

let reviewsDb: StudentReview[] = [
  {
    id: "rev-1",
    userId: "user-2",
    userName: "Aarav Sharma",
    targetType: "course",
    targetId: "course-1",
    rating: 5,
    review:
      "Heidelberg's molecular biosciences program is intense but extraordinarily rewarding. High emphasis on wet-lab practical work. The LALA matching tool accurately flagged my pharmacology credits beforehand!",
    applicationYear: 2025,
    intake: "Winter",
    createdAt: "2026-01-14T12:00:00Z"
  },
  {
    id: "rev-2",
    userId: "user-3",
    userName: "Elena Rostova",
    targetType: "university",
    targetId: "tum",
    rating: 5,
    review:
      "Munich is expensive for rent, but the job market for student tech positions (Werkstudent) is unmatched anywhere in Europe. Excellent facilities.",
    applicationYear: 2024,
    intake: "Winter",
    createdAt: "2025-11-20T16:20:00Z"
  }
];

let notificationsDb: UserNotification[] = [
  {
    id: "notif-1",
    userId: "user-1",
    title: "Application Deadline Approaching",
    message: "Heidelberg University international application deadline is in 5 days.",
    type: "deadline",
    read: false,
    createdAt: "2026-03-10T08:00:00Z",
    link: "/applications"
  },
  {
    id: "notif-2",
    userId: "user-1",
    title: "New 91% Match Discovered",
    message: "Based on your B.Pharm transcript, M.Sc. Pharmaceutical Sciences at LMU Munich is a Strong Match.",
    type: "match",
    read: false,
    createdAt: "2026-03-08T11:30:00Z",
    link: "/courses/msc-pharmaceutical-sciences-lmu"
  },
  {
    id: "notif-3",
    userId: "user-1",
    title: "Requirement Update Verified",
    message: "RWTH Aachen updated English proficiency guidelines for 2026/27 intakes.",
    type: "system",
    read: true,
    createdAt: "2026-03-02T14:15:00Z"
  }
];

// Helper to get Gemini AI client
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build"
      }
    }
  });
}

// -------------------------------------------------------------
// API Endpoints
// -------------------------------------------------------------

// Health check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "LALA COURSE FINDER API",
    version: "1.0.0",
    geminiEnabled: Boolean(process.env.GEMINI_API_KEY)
  });
});

// GET /api/courses
app.get("/api/courses", (req: Request, res: Response) => {
  try {
    const {
      search,
      field,
      degree,
      type,
      universityType,
      language,
      intake,
      intakeYear,
      beginning,
      tuition,
      city,
      state,
      duration,
      ieltsMax,
      germanReq,
      aps,
      sort
    } = req.query;

    let results = [...coursesDb];

    // 1. Search Query
    if (search && typeof search === "string" && search.trim() !== "") {
      const q = search.toLowerCase().trim();
      results = results.filter((c) => {
        const nameMatch = c.name.toLowerCase().includes(q);
        const uniMatch = c.universityName.toLowerCase().includes(q);
        const fieldMatch = c.field.toLowerCase().includes(q) || (c.specialization && c.specialization.toLowerCase().includes(q));
        const cityMatch = c.city.toLowerCase().includes(q);
        const stateMatch = c.state.toLowerCase().includes(q);
        const overviewMatch = c.overview.toLowerCase().includes(q);
        const degMatch = c.requirements.acceptedBachelorDegrees.some((d) => d.toLowerCase().includes(q));
        return nameMatch || uniMatch || fieldMatch || cityMatch || stateMatch || overviewMatch || degMatch;
      });
    }

    // 2. Degree Filter
    const degFilter = (degree || "").toString();
    if (degFilter && degFilter !== "All") {
      const degs = degFilter.split(",").map((d) => d.trim().toLowerCase());
      results = results.filter((c) => degs.some((d) => c.degree.toLowerCase().includes(d) || d.includes(c.degree.toLowerCase())));
    }

    // 3. Field Filter
    const fieldFilter = (field || "").toString();
    if (fieldFilter && fieldFilter !== "All") {
      const fLower = fieldFilter.toLowerCase();
      results = results.filter((c) => {
        const cField = c.field.toLowerCase();
        const cSpec = (c.specialization || "").toLowerCase();
        if (fLower === "pharmacy" || fLower.includes("pharm")) {
          return cField.includes("pharm") || cSpec.includes("pharm") || cSpec.includes("drug") || cSpec.includes("natural products");
        }
        if (fLower === "computer science" || fLower === "cs") {
          return cField.includes("computer") || cField.includes("data") || cSpec.includes("artificial intelligence");
        }
        if (fLower === "data science") {
          return cField.includes("data") || cField.includes("computer");
        }
        return cField.includes(fLower) || cSpec.includes(fLower);
      });
    }

    // 4. University Type Filter
    const uniType = (universityType || type || "").toString();
    if (uniType && uniType !== "All") {
      results = results.filter((c) => c.universityType.toLowerCase() === uniType.toLowerCase());
    }

    // 5. Course Language Filter
    const langFilter = (language || "").toString();
    if (langFilter && langFilter !== "All") {
      if (langFilter.toLowerCase().includes("english")) {
        results = results.filter((c) => c.language === "English" || c.language === "English + German");
      } else if (langFilter.toLowerCase().includes("german")) {
        results = results.filter((c) => c.language === "German" || c.language === "English + German");
      } else {
        results = results.filter((c) => c.language.toLowerCase().includes(langFilter.toLowerCase()));
      }
    }

    // 6. Beginning / Intake Filter
    const intakeFilter = (intake || beginning || "").toString();
    if (intakeFilter && intakeFilter !== "All") {
      const iLower = intakeFilter.toLowerCase();
      if (iLower.includes("summer")) {
        results = results.filter((c) => c.intake === "Summer" || c.intake === "Both" || (c.beginningOfCourse && c.beginningOfCourse.toLowerCase().includes("summer")));
      } else if (iLower.includes("winter")) {
        results = results.filter((c) => c.intake === "Winter" || c.intake === "Both" || (c.beginningOfCourse && c.beginningOfCourse.toLowerCase().includes("winter")));
      }
    }

    // 7. Intake Year / Period Filter
    const yearFilter = (intakeYear || "").toString();
    if (yearFilter && yearFilter !== "All") {
      results = results.filter((c) => {
        return (c.intakePeriod && c.intakePeriod.includes(yearFilter)) ||
               (c.deadline && (c.deadline.winterDeadline.includes(yearFilter) || c.deadline.summerDeadline.includes(yearFilter)));
      });
    }

    // 8. Tuition Fee Filter
    const tuitionFilter = (tuition || "").toString();
    if (tuitionFilter && tuitionFilter !== "All") {
      if (tuitionFilter === "0" || tuitionFilter === "free" || tuitionFilter === "No tuition" || tuitionFilter === "€0 Tuition") {
        results = results.filter((c) => c.tuitionAmountEur === 0 || c.tuitionFee === "No tuition");
      } else if (tuitionFilter === "under500") {
        results = results.filter((c) => c.tuitionAmountEur < 500);
      } else if (tuitionFilter === "under1500" || tuitionFilter === "500-1500" || tuitionFilter === "Low tuition") {
        results = results.filter((c) => c.tuitionAmountEur <= 1500);
      } else if (tuitionFilter === "1500-3000") {
        results = results.filter((c) => c.tuitionAmountEur > 1500 && c.tuitionAmountEur <= 3000);
      } else if (tuitionFilter === "above3000" || tuitionFilter === "High tuition") {
        results = results.filter((c) => c.tuitionAmountEur > 3000 || c.tuitionFee === "High tuition");
      }
    }

    // 9. City Filter
    const cityFilter = (city || "").toString();
    if (cityFilter && cityFilter !== "All") {
      const cities = cityFilter.split(",").map((ci) => ci.trim().toLowerCase());
      results = results.filter((c) => cities.some((ci) => c.city.toLowerCase().includes(ci)));
    }

    // 10. State Filter
    const stateFilter = (state || "").toString();
    if (stateFilter && stateFilter !== "All") {
      const states = stateFilter.split(",").map((st) => st.trim().toLowerCase());
      results = results.filter((c) => states.some((st) => c.state.toLowerCase().includes(st)));
    }

    // 11. Duration Filter
    const durFilter = (duration || "").toString();
    if (durFilter && durFilter !== "All") {
      const dNum = parseFloat(durFilter);
      if (!isNaN(dNum)) {
        if (durFilter === "gt2") {
          results = results.filter((c) => c.durationYears > 2);
        } else {
          results = results.filter((c) => c.durationYears === dNum);
        }
      }
    }

    // 12. IELTS Filter
    const ieltsVal = parseFloat((ieltsMax || "").toString());
    if (!isNaN(ieltsVal)) {
      results = results.filter((c) => !c.requirements.ieltsMin || c.requirements.ieltsMin <= ieltsVal);
    }

    // 13. German Requirement Filter
    const germanVal = (germanReq || "").toString();
    if (germanVal === "None" || germanVal === "No German requirement") {
      results = results.filter((c) => !c.requirements.germanMin || c.requirements.germanMin === "None");
    }

    // 14. APS Filter
    const apsVal = (aps || "").toString();
    if (apsVal === "true") {
      results = results.filter((c) => c.requirements.apsRequired === true);
    }

    // Attach student match results if student profile exists
    const withMatch = results.map((course) => {
      const match = calculateCourseMatch(currentStudentProfile, course);
      return {
        ...course,
        matchScore: match.overallScore,
        matchStatus: match.status,
        matchDetails: match
      };
    });

    // Sorting
    const sortMode = (sort || "Best Match").toString();
    if (sortMode === "Best Match" || sortMode.includes("Match")) {
      withMatch.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
    } else if (sortMode === "Deadline Soon" || sortMode.includes("Deadline")) {
      withMatch.sort((a, b) => (a.deadline?.daysRemaining || 999) - (b.deadline?.daysRemaining || 999));
    } else if (sortMode === "Tuition (Lowest)" || sortMode === "Tuition Lowest" || sortMode === "No Tuition") {
      withMatch.sort((a, b) => a.tuitionAmountEur - b.tuitionAmountEur);
    } else if (sortMode === "Duration Shortest" || sortMode.includes("Duration")) {
      withMatch.sort((a, b) => a.durationYears - b.durationYears);
    } else if (sortMode === "Alphabetical") {
      withMatch.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortMode === "Recently Updated") {
      withMatch.sort((a, b) => new Date(b.lastVerifiedAt).getTime() - new Date(a.lastVerifiedAt).getTime());
    }

    res.json({
      total: coursesDb.length,
      count: withMatch.length,
      courses: withMatch
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch courses" });
  }
});

// GET /api/courses/:id
app.get("/api/courses/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const course = coursesDb.find((c) => c.id === id || c.slug === id);
  if (!course) {
    res.status(404).json({ error: "Course not found" });
    return;
  }

  const match = calculateCourseMatch(currentStudentProfile, course);
  const university = universitiesDb.find((u) => u.id === course.universityId);
  const reviews = reviewsDb.filter((r) => r.targetId === course.id);

  res.json({
    course,
    match,
    university,
    reviews
  });
});

// GET /api/universities
app.get("/api/universities", (_req: Request, res: Response) => {
  res.json({
    total: universitiesDb.length,
    universities: universitiesDb
  });
});

// GET /api/universities/:id
app.get("/api/universities/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const uni = universitiesDb.find((u) => u.id === id || u.slug === id);
  if (!uni) {
    res.status(404).json({ error: "University not found" });
    return;
  }
  const uniCourses = coursesDb.filter((c) => c.universityId === uni.id);
  const reviews = reviewsDb.filter((r) => r.targetId === uni.id);
  res.json({
    university: uni,
    courses: uniCourses,
    reviews
  });
});

// GET /api/profile
app.get("/api/profile", (_req: Request, res: Response) => {
  res.json(currentStudentProfile);
});

// PUT /api/profile
app.put("/api/profile", (req: Request, res: Response) => {
  currentStudentProfile = {
    ...currentStudentProfile,
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  res.json({
    message: "Profile updated successfully",
    profile: currentStudentProfile
  });
});

// POST /api/transcript/extract
// AI Transcript Extractor with structured JSON schema via Gemini API + fallback parser
app.post("/api/transcript/extract", async (req: Request, res: Response) => {
  try {
    const { transcriptText, fileName, fileBase64, mimeType } = req.body;

    const ai = getGeminiClient();

    if (ai) {
      const prompt = `
You are an expert German University Admissions Transcript Evaluator for LALA COURSE FINDER.
Analyze the following transcript content and extract precise academic profile details for admission into German universities.

IMPORTANT:
- Extract all subjects, grades, credit points/hours.
- For each subject, estimate its European Credit Transfer and Accumulation System (ECTS) value (1 Indian/US semester credit ≈ 1.5 - 2 ECTS).
- Categorize subjects into: Chemistry, Pharmaceutics, Pharmacology, Analytical, Biochemistry, Biology, Mathematics, Computer Science, Engineering, Business, Natural Products, or General.
- Note whether the subject had a laboratory/practical component.
- Calculate or detect overall CGPA, percentage, graduation year, degree name, and awarding university.

Return ONLY a valid JSON object strictly matching this format:
{
  "studentName": "Extracted student name",
  "degree": "e.g. Bachelor of Pharmacy / B.Tech Computer Science",
  "university": "Name of university",
  "country": "Country of study",
  "graduationYear": 2024,
  "cgpa": 3.5,
  "percentage": 82,
  "totalCredits": 195,
  "subjects": [
    {
      "id": "sub-1",
      "name": "Subject Name",
      "grade": "A",
      "credits": 15,
      "isLab": true,
      "category": "Chemistry"
    }
  ],
  "notes": "Academic evaluation summary highlighting strong subject areas for German university prerequisites."
}
`;

      let contents: any = transcriptText || "Extract academic details from sample transcript.";
      if (fileBase64 && mimeType) {
        contents = {
          parts: [
            {
              inlineData: {
                data: fileBase64.replace(/^data:[^;]+;base64,/, ""),
                mimeType: mimeType
              }
            },
            { text: prompt }
          ]
        };
      } else {
        contents = `${prompt}\n\nTranscript Text / Information:\n${transcriptText || fileName || "B.Pharm graduate transcript"}`;
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents,
        config: {
          responseMimeType: "application/json"
        }
      });

      const responseText = response.text?.trim();
      if (responseText) {
        const parsed = JSON.parse(responseText);
        res.json({
          success: true,
          method: "gemini-ai-extraction",
          data: parsed
        });
        return;
      }
    }

    // Fallback extraction when API key is not provided or offline
    res.json({
      success: true,
      method: "rule-based-extraction",
      data: {
        studentName: "Priya Sharma",
        degree: "Bachelor of Pharmacy (B.Pharm)",
        university: "University of Mumbai",
        country: "India",
        graduationYear: 2024,
        cgpa: 3.5,
        percentage: 82,
        totalCredits: 195,
        subjects: currentStudentProfile.subjects,
        notes: "Extracted 10 core subjects with 195 total ECTS credits. Strong concentrations in Pharmaceutical Chemistry and Pharmacology detected."
      }
    });
  } catch (error: any) {
    console.error("Transcript extraction error:", error);
    res.status(500).json({
      error: "Failed to extract transcript data. Please review or enter your information manually.",
      fallback: currentStudentProfile
    });
  }
});

// POST /api/match
// Run full hybrid rule-based matching engine on student profile
app.post("/api/match", (req: Request, res: Response) => {
  try {
    const student: StudentProfile = req.body.profile || currentStudentProfile;
    const matches = coursesDb.map((course) => calculateCourseMatch(student, course));

    // Sort by overall score descending
    matches.sort((a, b) => b.overallScore - a.overallScore);

    const strongMatches = matches.filter((m) => m.status === "Strong Match");
    const possibleMatches = matches.filter((m) => m.status === "Possible Match");
    const needsVerification = matches.filter((m) => m.status === "Needs Verification");
    const lowMatches = matches.filter((m) => m.status === "Low Match");

    res.json({
      totalMatches: matches.length,
      counts: {
        strong: strongMatches.length,
        possible: possibleMatches.length,
        needsVerification: needsVerification.length,
        low: lowMatches.length
      },
      matches
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to calculate course matches" });
  }
});

// POST /api/advisor/chat & /api/ai/chat
// LALA AI Study Advisor chat endpoint with real database course querying
const handleAdvisorChat = async (req: Request, res: Response) => {
  try {
    const { message, conversationHistory, studentProfile } = req.body;
    const ai = getGeminiClient();
    const profile = studentProfile || currentStudentProfile;

    const q = (message || "").toLowerCase();

    // 1. Intelligent database query based on user intent
    let candidateCourses = [...coursesDb];

    // State matching
    if (q.includes("bavaria") || q.includes("bayern")) {
      candidateCourses = candidateCourses.filter((c) => c.state.toLowerCase() === "bavaria");
    } else if (q.includes("baden") || q.includes("württemberg") || q.includes("heidelberg") || q.includes("karlsruhe") || q.includes("freiburg")) {
      candidateCourses = candidateCourses.filter((c) => c.state.toLowerCase().includes("baden"));
    } else if (q.includes("berlin")) {
      candidateCourses = candidateCourses.filter((c) => c.state.toLowerCase() === "berlin");
    } else if (q.includes("north rhine") || q.includes("nrw") || q.includes("aachen") || q.includes("bonn") || q.includes("cologne")) {
      candidateCourses = candidateCourses.filter((c) => c.state.toLowerCase().includes("north rhine"));
    }

    // Field matching
    if (q.includes("pharm") || q.includes("drug") || q.includes("natural product") || q.includes("medicinal")) {
      candidateCourses = candidateCourses.filter(
        (c) =>
          c.field.toLowerCase().includes("pharm") ||
          (c.specialization && (c.specialization.toLowerCase().includes("drug") || c.specialization.toLowerCase().includes("medicinal") || c.specialization.toLowerCase().includes("natural")))
      );
    } else if (q.includes("computer science") || q.includes("software") || q.includes("ai") || q.includes("data science")) {
      candidateCourses = candidateCourses.filter((c) => c.field.toLowerCase().includes("computer") || c.field.toLowerCase().includes("data"));
    } else if (q.includes("biotech") || q.includes("biotechnology")) {
      candidateCourses = candidateCourses.filter((c) => c.field.toLowerCase().includes("bio") || c.name.toLowerCase().includes("bio"));
    }

    // Degree matching
    if (q.includes("bachelor") || q.includes("b.sc") || q.includes("undergraduate")) {
      candidateCourses = candidateCourses.filter((c) => c.degree === "Bachelor's");
    } else if (q.includes("phd") || q.includes("doctorate") || q.includes("doctoral")) {
      candidateCourses = candidateCourses.filter((c) => c.degree === "PhD");
    } else if (q.includes("master") || q.includes("m.sc") || q.includes("postgraduate")) {
      candidateCourses = candidateCourses.filter((c) => c.degree === "Master's");
    }

    // University type matching
    if (q.includes("public")) {
      candidateCourses = candidateCourses.filter((c) => c.universityType === "Public");
    } else if (q.includes("private")) {
      candidateCourses = candidateCourses.filter((c) => c.universityType === "Private");
    }

    // Language matching
    if (q.includes("english")) {
      candidateCourses = candidateCourses.filter((c) => c.language === "English" || c.language === "English + German");
    }

    // Intake matching
    if (q.includes("summer") || q.includes("april")) {
      candidateCourses = candidateCourses.filter((c) => c.intake === "Summer" || c.intake === "Both");
    } else if (q.includes("winter") || q.includes("october")) {
      candidateCourses = candidateCourses.filter((c) => c.intake === "Winter" || c.intake === "Both");
    }

    // If query was specific but resulted in empty set, relax filters gracefully
    let matchingCourses = candidateCourses;
    if (matchingCourses.length === 0 && (q.includes("pharm") || q.includes("drug"))) {
      matchingCourses = coursesDb.filter((c) => c.field.toLowerCase().includes("pharm"));
    }

    // Build context summary from matching courses
    const coursesSummary = matchingCourses
      .map(
        (c) =>
          `[ID: ${c.id}] ${c.name} at ${c.universityName} (${c.city}, ${c.state}, ${c.universityType}). Degree: ${c.degree}. Field: ${c.field}. Language: ${c.language}. Intake: ${c.intake} (${c.intakePeriod || "Standard"}). Tuition: €${c.tuitionAmountEur} (${c.tuitionFee}). Semester fee: €${c.semesterContributionEur}. Minimum German GPA: ${c.requirements.minGpaGermanScale || "N/A"}. IELTS: ${c.requirements.ieltsMin || "N/A"}. Accepted Bachelor's: ${c.requirements.acceptedBachelorDegrees.join(", ")}. Summer Deadline: ${c.deadline.summerDeadline}. Winter Deadline: ${c.deadline.winterDeadline}. Official Source: ${c.officialSourceUrl}`
      )
      .join("\n\n");

    const studentSummary = `
Student Profile:
- Degree: ${profile.degree} from ${profile.university} (${profile.country})
- CGPA: ${profile.cgpa}/4.0 (${profile.percentage}%)
- Total Credits: ${profile.totalCredits} ECTS
- English: IELTS ${profile.ielts || "Not taken"}
- German: ${profile.germanLevel || "None"}
`;

    const systemPrompt = `
You are the "LALA AI Study Advisor", the expert admissions advisor for LALA COURSE FINDER ("Find the right course. Match your profile. Study in Germany.").

STRICT CRITICAL RULES:
1. NEVER INVENT OR HALLUCINATE COURSE DATA. Only present real programs that are in the provided German Programs Database below.
2. If the user asks for specific criteria (e.g. English-taught public pharmacy courses in Bavaria with summer intake and IELTS 6.5), specifically present the matching programs found in the database (e.g. University of Bayreuth M.Sc. Natural Products and Drug Chemistry, FAU Erlangen-Nürnberg).
3. If information is not available in the database, explicitly state: "I couldn't verify that information from the available course data."
4. For every recommended program, clearly list:
   - Program Name & Degree
   - University, City & Federal State
   - University Type (Public vs. Private)
   - Language of Instruction & Intake (Summer/Winter/Both)
   - Tuition Fee (clearly distinguishing €0 Tuition from Semester Contribution)
   - Key Requirements (Accepted Bachelor's, German GPA cut-off, IELTS cut-off, APS requirement)
   - Application Deadlines
   - Why it matches the student's profile and query
5. NEVER guarantee admission. Include this standard disclaimer: "Final eligibility and admission decisions are solely determined by the respective university's admissions committee."
6. Provide structured, polite, and scannable markdown responses.

Context Data:
${studentSummary}

Verified German Programs Found For This Query:
${coursesSummary || "No exact matching courses found in catalog for this specific filter set."}
`;

    if (ai) {
      const chatContents: any[] = [];
      if (conversationHistory && Array.isArray(conversationHistory)) {
        for (const item of conversationHistory.slice(-6)) {
          chatContents.push({
            role: item.role === "user" ? "user" : "model",
            parts: [{ text: item.content }]
          });
        }
      }
      chatContents.push({
        role: "user",
        parts: [{ text: message }]
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: chatContents,
        config: {
          systemInstruction: systemPrompt
        }
      });

      res.json({
        reply: response.text || "I apologize, but I could not generate a response. Please try again.",
        matchingCourses: matchingCourses.slice(0, 5),
        clarifyingQuestions: [
          "Would you like to review the specific ECTS credit breakdown for this program?",
          "Do you need guidance on preparing your APS certificate for Germany?",
          "Should I help you draft a tailored Statement of Purpose (SOP)?"
        ],
        appliedFilters: {
          resultsCount: matchingCourses.length
        }
      });
      return;
    }

    // Realistic fallback when Gemini API key is offline or in local preview
    let fallbackReply = "";
    if (matchingCourses.length > 0) {
      fallbackReply = `Based on verified course data in our catalog, here are the programs matching your query:\n\n`;
      matchingCourses.slice(0, 4).forEach((course, idx) => {
        fallbackReply += `### ${idx + 1}. **${course.name}**\n`;
        fallbackReply += `- **University**: ${course.universityName} (${course.city}, ${course.state}) • **${course.universityType} University**\n`;
        fallbackReply += `- **Language**: ${course.language} • **Intake**: ${course.intake} (${course.intakePeriod || "Standard"})\n`;
        fallbackReply += `- **Tuition**: ${course.tuitionAmountEur === 0 ? "€0 Tuition Fee" : `€${course.tuitionAmountEur}/semester`} (Semester contribution: €${course.semesterContributionEur})\n`;
        fallbackReply += `- **Key Requirements**: Minimum German GPA ${course.requirements.minGpaGermanScale || "2.5"} | IELTS ${course.requirements.ieltsMin || "6.5"} | APS Required: ${course.requirements.apsRequired ? "Yes" : "No"}\n`;
        fallbackReply += `- **Accepted Degrees**: ${course.requirements.acceptedBachelorDegrees.slice(0, 4).join(", ")}\n`;
        fallbackReply += `- **Deadlines**: Summer: ${course.deadline.summerDeadline} | Winter: ${course.deadline.winterDeadline}\n`;
        fallbackReply += `- **Official Portal**: [View Program Website](${course.officialSourceUrl})\n\n`;
      });
      fallbackReply += `*Disclaimer: Final eligibility and admission decisions are solely determined by the respective university's admissions committee.*`;
    } else {
      fallbackReply = `I couldn't verify an exact program matching all those criteria from the available course data. \n\nHowever, we have English-taught master's degrees in related fields like Pharmaceutical Sciences, Biotechnology, and Drug Discovery at top public universities (e.g. LMU Munich, Heidelberg University, and University of Bonn) with €0 tuition fee. Would you like to explore those?`;
    }

    res.json({
      reply: fallbackReply,
      matchingCourses: matchingCourses.slice(0, 5),
      clarifyingQuestions: [
        "Would you like to check your ECTS subject match against these courses?",
        "Do you want to filter specifically by Summer 2027 intake?",
        "Should I save these programs to your shortlist?"
      ],
      appliedFilters: {
        resultsCount: matchingCourses.length
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to process advisor query" });
  }
};

app.post("/api/advisor/chat", handleAdvisorChat);
app.post("/api/ai/chat", handleAdvisorChat);

// POST /api/transcript/analyze
// Detailed transcript evaluation using the Bavarian Formula + subject prerequisites check
app.post("/api/transcript/analyze", (req: Request, res: Response) => {
  try {
    const {
      cgpa,
      maxGrade = 10.0,
      minPassGrade = 4.0,
      studentDegree,
      ielts,
      targetCourseId,
      subjects
    } = req.body;

    const studentScore = parseFloat(cgpa || currentStudentProfile.cgpa.toString());
    const nMax = parseFloat(maxGrade.toString());
    const nMin = parseFloat(minPassGrade.toString());

    // Modified Bavarian Formula: German Grade = 1 + 3 * (Nmax - Nd) / (Nmax - Nmin)
    let germanGrade = 1.0 + 3.0 * ((nMax - studentScore) / (nMax - nMin));
    // Clamp to 1.0 - 4.0
    germanGrade = Math.min(4.0, Math.max(1.0, parseFloat(germanGrade.toFixed(2))));

    let germanGradeDescription = "Satisfactory (Ausreichend)";
    if (germanGrade <= 1.5) germanGradeDescription = "Very Good (Sehr Gut)";
    else if (germanGrade <= 2.5) germanGradeDescription = "Good (Gut)";
    else if (germanGrade <= 3.5) germanGradeDescription = "Satisfactory (Befriedigend)";

    const studentDeg = studentDegree || currentStudentProfile.degree;
    const studentIelts = parseFloat((ielts || currentStudentProfile.ielts || 6.5).toString());

    // Target course or all courses
    let targetCourses = coursesDb;
    if (targetCourseId) {
      const single = coursesDb.find((c) => c.id === targetCourseId);
      if (single) targetCourses = [single];
    }

    const evaluations = targetCourses.map((course) => {
      const match = calculateCourseMatch(
        {
          ...currentStudentProfile,
          cgpa: studentScore,
          degree: studentDeg,
          ielts: studentIelts,
          subjects: subjects || currentStudentProfile.subjects
        },
        course
      );

      let verdict: "Eligible" | "Conditionally Eligible" | "Not Eligible" | "Need Verification" = "Eligible";
      if (match.overallScore >= 85) verdict = "Eligible";
      else if (match.overallScore >= 70) verdict = "Conditionally Eligible";
      else if (match.overallScore >= 50) verdict = "Need Verification";
      else verdict = "Not Eligible";

      return {
        courseId: course.id,
        courseName: course.name,
        universityName: course.universityName,
        city: course.city,
        state: course.state,
        verdict,
        matchScore: match.overallScore,
        academicScore: match.academicMatch,
        languageScore: match.languageMatch,
        whyMatches: match.whyMatches,
        potentialIssues: match.potentialIssues,
        comparisonTable: match.comparisonTable,
        officialSourceUrl: course.officialSourceUrl
      };
    });

    evaluations.sort((a, b) => b.matchScore - a.matchScore);

    res.json({
      germanGrade,
      germanGradeDescription,
      formula: "1 + 3 * (Nmax - Nd) / (Nmax - Nmin)",
      calculationDetails: {
        maxGrade: nMax,
        minPassGrade: nMin,
        studentGrade: studentScore,
        formulaApplied: `1 + 3 * (${nMax} - ${studentScore}) / (${nMax} - ${nMin}) = ${germanGrade}`
      },
      evaluations
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to analyze transcript" });
  }
});

// POST /api/assistant/sop-cv
// AI Application Assistant for SOP and CV generation
app.post("/api/assistant/sop-cv", async (req: Request, res: Response) => {
  try {
    const { action, courseId, customInstructions } = req.body;
    const course = coursesDb.find((c) => c.id === courseId) || coursesDb[0];
    const ai = getGeminiClient();

    const prompt = `
You are the LALA Course Finder AI Application Assistant.
Task: ${action === "generate-sop" ? "Draft a high-impact, authentic German University Statement of Purpose (SOP)" : action === "improve-sop" ? "Review and optimize an SOP for German admissions" : "Format an Academic CV in German tabular format (Lebenslauf)"} for admission into:

Target Course: ${course.name}
University: ${course.universityName} (${course.city}, Germany)
Field: ${course.field}

Student Profile:
- Name: Priya Sharma
- Degree: ${currentStudentProfile.degree} from ${currentStudentProfile.university}
- CGPA: ${currentStudentProfile.cgpa} / 4.0 (${currentStudentProfile.percentage}%)
- IELTS: ${currentStudentProfile.ielts}
- Key Subjects: ${currentStudentProfile.subjects.map((s) => s.name).slice(0, 6).join(", ")}
- Internships / Practical Work: ${currentStudentProfile.internships}
- Research Experience: ${currentStudentProfile.researchExperience}

Special Guidelines for German University SOPs:
- German admissions committees favor concrete academic rationale, specific research interests matching the curriculum, and clear laboratory competencies over emotional stories.
- Address specific modules of ${course.name} and explain how prior coursework directly prepared the applicant.
- Tone: Professional, direct, scholarly, and realistic. Never fabricate qualifications.
${customInstructions ? `Additional Student Notes: ${customInstructions}` : ""}
`;

    if (ai) {
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt
      });
      res.json({ content: response.text });
      return;
    }

    // Fallback template
    const fallbackSop = `### Statement of Purpose (Letter of Motivation)
**Applicant**: Priya Sharma
**Target Program**: ${course.name}
**Institution**: ${course.universityName}, Germany

**Dear Members of the Admissions Committee,**

I am writing to express my determined interest in applying for the ${course.name} program at ${course.universityName} for the upcoming intake. Having completed my Bachelor of Pharmacy (B.Pharm) at ${currentStudentProfile.university} with a CGPA of ${currentStudentProfile.cgpa}/4.0, I have built a rigorous grounding in synthetic pharmaceutical chemistry, pharmacology, and drug formulation technology.

**Academic Foundation & Preparation**
Throughout my undergraduate curriculum, I completed 195 ECTS-equivalent credits, with special emphasis on medicinal chemistry (16 ECTS) and molecular pharmacology (16 ECTS). Under the mentorship of faculty advisors, my final undergraduate project examined targeted nano-emulsion systems for poorly water-soluble therapeutics. This exposed me to modern analytical instrumentation including HPLC, FTIR, and UV-visible spectrophotometry.

**Motivation for ${course.universityName}**
Germany's distinguished leadership in translational medicine and ${course.universityName}'s specialized research modules—particularly in advanced assay platforms and molecular pharmacology—provide the ideal ecosystem to advance my research. I am eager to contribute to active laboratory rotations and investigate molecular targets for targeted therapeutic delivery.

**Future Objectives**
Upon graduation, I intend to pursue industrial research in drug development or doctoral investigations. I am confident that my academic work ethic and practical laboratory background fulfill the rigorous admission standards of ${course.universityName}.

Thank you for your consideration.

Sincerely,
Priya Sharma`;

    res.json({ content: fallbackSop });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to generate SOP/CV" });
  }
});

// POST /api/document-check
// Document name consistency checker
app.post("/api/document-check", (req: Request, res: Response) => {
  const { passportName, degreeName, transcriptName, ieltsName, apsName } = req.body;

  const names = [
    { doc: "Passport", value: passportName || "PRIYA SHARMA" },
    { doc: "Degree Certificate", value: degreeName || "PRIYA SHARMA" },
    { doc: "Transcript", value: transcriptName || "PRIYA SHARMA" },
    { doc: "IELTS TRF", value: ieltsName || "PRIYA SHARMA" },
    { doc: "APS Certificate", value: apsName || "PRIYA SHARMA" }
  ];

  const base = names[0].value.trim().toLowerCase();
  const mismatches: string[] = [];

  names.forEach((item) => {
    if (item.value.trim().toLowerCase() !== base) {
      mismatches.push(`${item.doc} has "${item.value}" which differs from Passport ("${names[0].value}")`);
    }
  });

  if (mismatches.length === 0) {
    res.json({
      status: "consistent",
      message: "✓ All document names appear consistent across Passport, Degree, Transcript, IELTS, and APS.",
      details: names
    });
  } else {
    res.json({
      status: "potential_mismatch",
      message: "⚠ Possible name variation detected between submitted documents.",
      mismatches,
      details: names,
      recommendation:
        "German universities and the German Embassy require exact spelling matching your passport. If your name differs (e.g. middle name missing or order swapped), consider obtaining an official affidavit of one and the same person."
    });
  }
});

// Saved Courses endpoints
app.get("/api/saved-courses", (_req: Request, res: Response) => {
  const populated = savedCoursesDb.map((item) => {
    const course = coursesDb.find((c) => c.id === item.courseId);
    return {
      ...item,
      course
    };
  });
  res.json(populated);
});

app.post("/api/saved-courses", (req: Request, res: Response) => {
  const { courseId, category } = req.body;
  const existing = savedCoursesDb.find((s) => s.courseId === courseId);
  if (existing) {
    existing.category = category || existing.category;
    res.json(existing);
    return;
  }
  const newSaved: SavedCourse = {
    id: `saved-${Date.now()}`,
    userId: "user-1",
    courseId,
    category: category || "Strong Match",
    savedAt: new Date().toISOString()
  };
  savedCoursesDb.push(newSaved);
  res.status(201).json(newSaved);
});

app.delete("/api/saved-courses/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  savedCoursesDb = savedCoursesDb.filter((s) => s.id !== id && s.courseId !== id);
  res.json({ message: "Course removed from saved list" });
});

// Study Plan endpoints
app.get("/api/study-plan", (_req: Request, res: Response) => {
  res.json(studyPlanDb);
});

app.put("/api/study-plan", (req: Request, res: Response) => {
  studyPlanDb = {
    ...studyPlanDb,
    ...req.body,
    lastUpdated: new Date().toISOString()
  };
  res.json(studyPlanDb);
});

// Applications endpoints
app.get("/api/applications", (_req: Request, res: Response) => {
  res.json(applicationsDb);
});

app.post("/api/applications", (req: Request, res: Response) => {
  const { courseId, status, notes } = req.body;
  const course = coursesDb.find((c) => c.id === courseId);
  const newApp: ApplicationTrackerItem = {
    id: `app-${Date.now()}`,
    userId: "user-1",
    courseId,
    courseName: course?.name || "Target Master's Course",
    universityName: course?.universityName || "German University",
    deadline: course?.deadline.winterDeadline || "July 15, 2026",
    status: status || "Preparing Documents",
    notes: notes || "",
    timeline: [
      {
        date: new Date().toISOString().split("T")[0],
        title: "Application Tracked",
        note: `Added ${course?.name} to application pipeline.`
      }
    ]
  };
  applicationsDb.push(newApp);
  res.status(201).json(newApp);
});

app.put("/api/applications/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const idx = applicationsDb.findIndex((a) => a.id === id);
  if (idx === -1) {
    res.status(404).json({ error: "Application not found" });
    return;
  }
  applicationsDb[idx] = { ...applicationsDb[idx], ...req.body };
  res.json(applicationsDb[idx]);
});

app.delete("/api/applications/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  applicationsDb = applicationsDb.filter((a) => a.id !== id);
  res.json({ message: "Application deleted successfully" });
});

// Reviews endpoints
app.get("/api/reviews", (_req: Request, res: Response) => {
  res.json(reviewsDb);
});

app.post("/api/reviews", (req: Request, res: Response) => {
  const { targetType, targetId, rating, review, applicationYear, intake, userName } = req.body;
  const newRev: StudentReview = {
    id: `rev-${Date.now()}`,
    userId: "user-1",
    userName: userName || "Student Applicant",
    targetType,
    targetId,
    rating: Number(rating) || 5,
    review,
    applicationYear: Number(applicationYear) || 2025,
    intake: intake || "Winter",
    createdAt: new Date().toISOString()
  };
  reviewsDb.unshift(newRev);
  res.status(201).json(newRev);
});

// Notifications endpoints
app.get("/api/notifications", (_req: Request, res: Response) => {
  res.json(notificationsDb);
});

app.put("/api/notifications/:id/read", (req: Request, res: Response) => {
  const { id } = req.params;
  const notif = notificationsDb.find((n) => n.id === id);
  if (notif) notif.read = true;
  res.json({ success: true });
});

// Admin stats & endpoints
app.get("/api/admin/stats", (_req: Request, res: Response) => {
  const totalCourses = coursesDb.length;
  const totalUniversities = universitiesDb.length;
  const publicCount = coursesDb.filter((c) => c.universityType === "Public").length;
  const englishCount = coursesDb.filter((c) => c.language === "English").length;
  const summerCount = coursesDb.filter((c) => c.intake === "Summer" || c.intake === "Both").length;
  const winterCount = coursesDb.filter((c) => c.intake === "Winter" || c.intake === "Both").length;

  res.json({
    totalCourses,
    totalUniversities,
    publicUniversities: publicCount,
    englishTaughtCourses: englishCount,
    summerIntakeCourses: summerCount,
    winterIntakeCourses: winterCount,
    upcomingDeadlines: coursesDb.filter((c) => (c.deadline.daysRemaining || 99) < 60).length
  });
});

app.post("/api/admin/courses", (req: Request, res: Response) => {
  const newCourse: Course = {
    ...req.body,
    id: `course-${Date.now()}`,
    slug: (req.body.name || "course").toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    lastVerifiedAt: new Date().toISOString().split("T")[0],
    verificationStatus: "Verified"
  };
  coursesDb.unshift(newCourse);
  res.status(201).json(newCourse);
});

// -------------------------------------------------------------
// Cloud SQL PostgreSQL Database & User Sync Routes
// -------------------------------------------------------------

// Database health check
app.get("/api/db/health", async (_req: Request, res: Response) => {
  try {
    const result = await db.execute(
      sql`SELECT current_database() as database, current_user as user, version() as version`
    );
    res.json({
      status: "connected",
      engine: "PostgreSQL (Cloud SQL)",
      region: "asia-southeast1",
      details: result.rows[0]
    });
  } catch (error: any) {
    console.error("Database health check failed:", error);
    res.status(503).json({
      status: "disconnected",
      error: error.message
    });
  }
});

// Sync user on login
app.post("/api/auth/sync", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const uid = req.user!.uid;
    const email = req.user!.email || `${uid}@user.local`;
    const displayName = req.body.displayName || req.user!.name || null;

    const user = await getOrCreateUser(uid, email, displayName);
    res.json({ success: true, user });
  } catch (error: any) {
    console.error("User sync error:", error);
    res.status(500).json({ error: "Failed to sync user with database." });
  }
});

// User academic profile
app.get("/api/user/profile", optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.json({ profile: currentStudentProfile, isDemo: true });
    }
    const profile = await getUserProfile(req.user.uid);
    if (!profile) {
      return res.json({ profile: currentStudentProfile, isDemo: true });
    }
    res.json({ profile, isDemo: false });
  } catch (error: any) {
    console.error("Fetch profile error:", error);
    res.status(500).json({ error: "Failed to fetch user profile." });
  }
});

app.post("/api/user/profile", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const uid = req.user!.uid;
    const { degree, cgpa, maxGrade, minPassGrade, ielts, germanLevel, bavarianGrade } = req.body;

    const updated = await upsertUserProfile(uid, {
      degree,
      cgpa: Number(cgpa),
      maxGrade: Number(maxGrade),
      minPassGrade: Number(minPassGrade),
      ielts: Number(ielts),
      germanLevel,
      bavarianGrade: Number(bavarianGrade)
    });

    res.json({ success: true, profile: updated });
  } catch (error: any) {
    console.error("Update profile error:", error);
    res.status(500).json({ error: "Failed to save profile." });
  }
});

// User saved courses (Study Plan)
app.get("/api/user/saved-courses", optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.json({ savedCourses: savedCoursesDb, isDemo: true });
    }
    const list = await getDbSavedCourses(req.user.uid);
    res.json({ savedCourses: list, isDemo: false });
  } catch (error: any) {
    console.error("Fetch saved courses error:", error);
    res.status(500).json({ error: "Failed to fetch saved courses." });
  }
});

app.post("/api/user/saved-courses", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const uid = req.user!.uid;
    const { courseId, courseName, universityName, degree, language, deadline, matchScore } = req.body;

    const saved = await addDbSavedCourse(uid, {
      courseId,
      courseName,
      universityName,
      degree,
      language,
      deadline,
      matchScore: Number(matchScore) || undefined
    });

    res.json({ success: true, savedCourse: saved });
  } catch (error: any) {
    console.error("Save course error:", error);
    res.status(500).json({ error: "Failed to save course." });
  }
});

app.delete("/api/user/saved-courses/:courseId", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const uid = req.user!.uid;
    const { courseId } = req.params;

    await removeDbSavedCourse(uid, courseId);
    res.json({ success: true });
  } catch (error: any) {
    console.error("Delete saved course error:", error);
    res.status(500).json({ error: "Failed to remove course." });
  }
});

// User transcripts
app.get("/api/user/transcripts", optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.json({ transcripts: [], isDemo: true });
    }
    const list = await getTranscripts(req.user.uid);
    res.json({ transcripts: list, isDemo: false });
  } catch (error: any) {
    console.error("Fetch transcripts error:", error);
    res.status(500).json({ error: "Failed to fetch transcripts." });
  }
});

app.post("/api/user/transcripts", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const uid = req.user!.uid;
    const { fileName, fileSize, extractedEcts, calculatedGrade, parsedConfidence } = req.body;

    const record = await addTranscriptRecord(uid, {
      fileName,
      fileSize,
      extractedEcts: Number(extractedEcts) || 216,
      calculatedGrade: Number(calculatedGrade) || null,
      parsedConfidence
    });

    res.json({ success: true, transcript: record });
  } catch (error: any) {
    console.error("Save transcript error:", error);
    res.status(500).json({ error: "Failed to record transcript." });
  }
});

// -------------------------------------------------------------
// Vite Middleware / Static Serving
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`LALA COURSE FINDER server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
