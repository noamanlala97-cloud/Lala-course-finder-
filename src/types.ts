export type DegreeType = "Bachelor's" | "Master's" | "PhD";
export type UniversityType = "Public" | "Private";
export type LanguageType = "English" | "German" | "English + German";
export type IntakeType = "Winter" | "Summer" | "Both";
export type VerificationStatus = "Verified" | "Needs Review" | "Outdated";
export type MatchStatus = "Strong Match" | "Possible Match" | "Needs Verification" | "Low Match";
export type ApplicationStatus =
  | "Not Started"
  | "Preparing Documents"
  | "Ready to Apply"
  | "Applied"
  | "Under Review"
  | "Interview"
  | "Admission Received"
  | "Rejected";

export interface SubjectItem {
  id: string;
  name: string;
  grade: string | number;
  credits: number;
  isLab?: boolean;
  category?: string;
}

export type SubjectCredit = SubjectItem;

export interface StudentProfile {
  id: string;
  userId: string;
  degree: string;
  university: string;
  country: string;
  graduationYear: number;
  cgpa: number; // e.g. 3.4 / 4.0 or 8.5 / 10
  percentage?: number;
  totalCredits: number;
  subjects: SubjectItem[];
  ielts?: number;
  toefl?: number;
  germanLevel?: string; // e.g. "None", "A1", "A2", "B1", "B2", "C1"
  workExperienceYears?: number;
  internships?: string;
  researchExperience?: string;
  preferredField?: string;
  preferredStates?: string[];
  preferredIntake?: IntakeType;
  preferredUniversityType?: "Public" | "Private" | "Any";
  updatedAt?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "admin";
  avatar?: string;
  createdAt: string;
}

export interface UniversityLocation {
  city: string;
  state: string;
  lat?: number;
  lng?: number;
}

export interface University {
  id: string;
  name: string;
  slug: string;
  type: UniversityType;
  city: string;
  state: string;
  rankingGerman?: number;
  rankingGlobal?: number;
  studentCount: number;
  intlStudentPercentage: number;
  overview: string;
  website: string;
  applicationPortal: string;
  image: string;
  costOfLivingEur: number;
  rentLevel: "Low" | "Medium" | "High" | "Very High";
  studentEnvironment: string;
  publicTransport: string;
  partTimeJobEnvironment: string;
  popularFields: string[];
  tuitionPolicy?: string;
}

export interface RequiredSubjectEcts {
  subject: string;
  minEcts: number;
  mandatory: boolean;
}

export interface CourseRequirements {
  minGpaGermanScale?: number; // e.g., 2.5 (lower is better in German scale: 1.0 is highest, 4.0 is passing)
  minCgpaEquivalent?: number; // approx 3.0 / 4.0
  acceptedBachelorDegrees: string[];
  requiredSubjectEcts: RequiredSubjectEcts[];
  totalMinEcts: number;
  ieltsMin?: number;
  toeflMin?: number;
  germanMin?: string;
  mediumOfInstructionAccepted: boolean;
  apsRequired: boolean;
  greRequired: boolean | string;
  notes: string;
}

export interface CourseDeadline {
  winterDeadline: string; // e.g., "July 15"
  summerDeadline: string; // e.g., "January 15"
  daysRemaining?: number;
  status: "Open" | "Closing Soon" | "Future" | "Closed";
}

export interface Course {
  id: string;
  universityId: string;
  universityName: string;
  universityType: UniversityType;
  city: string;
  state: string;
  country?: string;
  name: string;
  slug: string;
  degree: DegreeType;
  field: string;
  specialization?: string;
  language: LanguageType;
  intake: IntakeType;
  intakePeriod?: string;
  beginningOfCourse?: string;
  durationYears: number;
  studyMode?: string;
  ectsCredits: number;
  tuitionFee: "No tuition" | "Low tuition" | "High tuition";
  tuitionAmountEur: number;
  semesterContributionEur: number;
  currency?: string;
  overview: string;
  programStructure: string[];
  careerOpportunities: string[];
  requirements: CourseRequirements;
  deadline: CourseDeadline;
  applicationStartDate?: string;
  applicationDeadline?: string;
  applicationMethod?: string;
  officialSourceUrl: string;
  applicationUrl: string;
  lastVerifiedAt: string;
  verificationStatus: VerificationStatus;
  matchScore?: number;
  matchStatus?: MatchStatus;
  officialCourseWebsite?: string;
  officialApplicationWebsite?: string;
  cityLivingInfo?: {
    estimatedCostOfLivingEur?: number;
    monthlyRentEur?: number;
    semesterTicketCostEur?: number;
    healthInsuranceEur?: number;
    partTimeJobMarket?: string;
    studentLifeDescription?: string;
    rentLevel?: string;
    studentEnvironment?: string;
    publicTransport?: string;
  };
  modules?: Array<{
    name: string;
    credits: number;
    description?: string;
  }>;
}

export interface RequirementComparisonItem {
  requirement: string;
  universityRequirement: string;
  studentProfile: string;
  status: "satisfied" | "potential_gap" | "not_satisfied";
  explanation: string;
}

export interface CourseMatchResult {
  courseId: string;
  course: Course;
  overallScore: number;
  status: MatchStatus;
  academicMatch: number;
  ectsMatch: number;
  gpaMatch: number;
  languageMatch: number;
  requirementsMatch: number;
  whyMatches: string[];
  potentialIssues: string[];
  comparisonTable: RequirementComparisonItem[];
}

export interface SavedCourse {
  id: string;
  userId?: string;
  courseId: string;
  category: "Dream" | "Strong Match" | "Backup";
  savedAt: string;
  course?: Course;
}

export interface StudyPlanItem {
  id: string;
  title: string;
  category:
    | "Documents"
    | "Language"
    | "Application"
    | "Visa"
    | "Financial"
    | "Verification"
    | "Academic"
    | "Insurance"
    | "Embassy"
    | string;
  completed: boolean;
  notes?: string;
  dueDate?: string;
}

export type ChecklistItem = StudyPlanItem;

export interface StudyPlan {
  userId?: string;
  targetIntake: IntakeType;
  targetYear: number;
  preferredField?: string;
  strategy?: {
    dream: string[]; // courseIds
    strong: string[];
    backup: string[];
  };
  checklist: StudyPlanItem[];
  lastUpdated?: string;
}

export interface ApplicationTrackerItem {
  id: string;
  userId?: string;
  courseId: string;
  courseName: string;
  universityName: string;
  deadline: string;
  status: ApplicationStatus;
  notes: string;
  appliedDate?: string;
  timeline: Array<{
    date: string;
    title: string;
    note: string;
  }>;
}

export interface StudentReview {
  id: string;
  userId: string;
  userName: string;
  targetType: "university" | "course";
  targetId: string;
  rating: number;
  review: string;
  applicationYear: number;
  intake: string;
  createdAt: string;
}

export interface UserNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "deadline" | "match" | "system" | "saved";
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface TranscriptExtractionData {
  studentName?: string;
  degree?: string;
  university?: string;
  country?: string;
  graduationYear?: number;
  cgpa?: number;
  percentage?: number;
  totalCredits?: number;
  subjects: SubjectItem[];
  confidenceScore?: number;
  notes?: string;
}
