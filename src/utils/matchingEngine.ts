import { Course, CourseMatchResult, MatchStatus, RequirementComparisonItem, StudentProfile } from "../types";

export const DEFAULT_DEMO_STUDENT: StudentProfile = {
  id: "student-1",
  userId: "user-1",
  degree: "Bachelor of Pharmacy (B.Pharm)",
  university: "University of Mumbai / Delhi University",
  country: "India",
  graduationYear: 2024,
  cgpa: 3.5, // on 4.0 scale (equivalent to ~8.2/10 or German 1.8)
  percentage: 82,
  totalCredits: 195,
  ielts: 7.0,
  toefl: 96,
  germanLevel: "A1",
  workExperienceYears: 1,
  internships: "6-month formulation and analytical QA internship at Sun Pharma",
  researchExperience: "Undergraduate thesis on targeted nano-emulsion drug delivery",
  preferredField: "Pharmacy",
  preferredStates: ["Bavaria", "Baden-Württemberg", "North Rhine-Westphalia"],
  preferredIntake: "Winter",
  preferredUniversityType: "Public",
  subjects: [
    { id: "sub-1", name: "Pharmaceutical Chemistry I & II (Organic & Inorganic)", grade: "A", credits: 16, isLab: true, category: "Chemistry" },
    { id: "sub-2", name: "Medicinal Chemistry & Drug Synthesis", grade: "A", credits: 12, isLab: true, category: "Chemistry" },
    { id: "sub-3", name: "Pharmaceutics & Formulation Technology", grade: "A+", credits: 18, isLab: true, category: "Pharmaceutics" },
    { id: "sub-4", name: "Pharmacology & Toxicological Screening", grade: "A", credits: 16, isLab: true, category: "Pharmacology" },
    { id: "sub-5", name: "Pharmaceutical Analysis & Spectroscopy", grade: "A", credits: 12, isLab: true, category: "Analytical" },
    { id: "sub-6", name: "Biochemistry & Clinical Pathology", grade: "B+", credits: 10, isLab: true, category: "Biochemistry" },
    { id: "sub-7", name: "Microbiology & Biotechnology", grade: "A", credits: 10, isLab: true, category: "Biotechnology" },
    { id: "sub-8", name: "Biostatistics & Research Methodology", grade: "A", credits: 8, isLab: false, category: "Mathematics" },
    { id: "sub-9", name: "Human Anatomy & Physiology", grade: "A", credits: 10, isLab: true, category: "Biology" },
    { id: "sub-10", name: "Pharmacognosy & Phytochemistry", grade: "A", credits: 10, isLab: true, category: "Natural Products" }
  ]
};

/**
 * Calculates match scores between a student's profile and a course's admission requirements.
 * Implements hard rules + subject credits evaluation + language checks + GPA translation.
 */
export function calculateCourseMatch(student: StudentProfile, course: Course): CourseMatchResult {
  const whyMatches: string[] = [];
  const potentialIssues: string[] = [];
  const comparisonTable: RequirementComparisonItem[] = [];

  // 1. Degree Match
  const studentDegLower = student.degree.toLowerCase();
  const acceptedDegrees = course.requirements.acceptedBachelorDegrees;
  const isDegreeAccepted = acceptedDegrees.some((deg) => {
    const dLower = deg.toLowerCase();
    return (
      studentDegLower.includes(dLower) ||
      dLower.includes(studentDegLower) ||
      (dLower.includes("pharm") && studentDegLower.includes("pharm")) ||
      (dLower.includes("computer") && studentDegLower.includes("computer")) ||
      (dLower.includes("bio") && studentDegLower.includes("bio")) ||
      (dLower.includes("engineer") && studentDegLower.includes("engineer"))
    );
  });

  let academicScore = 0;
  if (isDegreeAccepted) {
    academicScore = 95;
    whyMatches.push(`Relevant bachelor's degree in ${student.degree} directly recognized`);
    comparisonTable.push({
      requirement: "Relevant Bachelor's Degree",
      universityRequirement: acceptedDegrees.slice(0, 3).join(" / "),
      studentProfile: student.degree,
      status: "satisfied",
      explanation: `Your degree directly aligns with the recognized bachelor disciplines.`
    });
  } else {
    academicScore = 40;
    potentialIssues.push(`Bachelor's field (${student.degree}) is outside standard accepted degrees`);
    comparisonTable.push({
      requirement: "Relevant Bachelor's Degree",
      universityRequirement: acceptedDegrees.slice(0, 3).join(" / "),
      studentProfile: student.degree,
      status: "not_satisfied",
      explanation: `Program generally requires backgrounds in ${acceptedDegrees.slice(0, 2).join(", ")}.`
    });
  }

  // 2. GPA Match
  // Rough Bavarian formula: German Grade = 1 + 3 * ((MaxGrade - StudentGrade) / (MaxGrade - PassGrade))
  // On 4.0 scale: 3.5 -> ~1.7 German (excellent: 1.0 to 1.5 is very good, 1.6 to 2.5 is good)
  const reqGermanGpa = course.requirements.minGpaGermanScale || 2.5;
  const studentGermanGrade = Math.max(1.0, 1.0 + 3.0 * ((4.0 - Math.min(student.cgpa, 4.0)) / (4.0 - 2.0)));
  const gpaSatisfied = studentGermanGrade <= reqGermanGpa || student.cgpa >= (course.requirements.minCgpaEquivalent || 3.0);

  let gpaScore = 0;
  if (gpaSatisfied) {
    gpaScore = Math.min(100, Math.round(90 + (reqGermanGpa - studentGermanGrade) * 15));
    whyMatches.push(`CGPA (${student.cgpa}/4.0 ≈ ${studentGermanGrade.toFixed(2)} German scale) comfortably exceeds minimum cut-off`);
    comparisonTable.push({
      requirement: "Minimum GPA Cut-off",
      universityRequirement: `≤ ${reqGermanGpa.toFixed(1)} German scale (~${course.requirements.minCgpaEquivalent?.toFixed(1) || "3.0"}/4.0)`,
      studentProfile: `${student.cgpa}/4.0 (≈ ${studentGermanGrade.toFixed(2)} German grade)`,
      status: "satisfied",
      explanation: `Your academic average meets the published departmental requirement.`
    });
  } else {
    gpaScore = 55;
    potentialIssues.push(`GPA may be borderline for competitive ranking (University cut-off: ${reqGermanGpa} German scale)`);
    comparisonTable.push({
      requirement: "Minimum GPA Cut-off",
      universityRequirement: `≤ ${reqGermanGpa.toFixed(1)} German scale`,
      studentProfile: `${student.cgpa}/4.0 (≈ ${studentGermanGrade.toFixed(2)} German grade)`,
      status: "potential_gap",
      explanation: `GPA might be below target cutoff if applicant pool is strictly restricted (NC).`
    });
  }

  // 3. ECTS & Subject Credit Matching
  const requiredSubjects = course.requirements.requiredSubjectEcts || [];
  let satisfiedSubjectsCount = 0;
  let totalMandatory = 0;
  let accumulatedEctsScore = 100;

  for (const reqSub of requiredSubjects) {
    if (reqSub.mandatory) totalMandatory++;
    const keyword = reqSub.subject.toLowerCase();

    // Sum matching credits from student subjects
    let matchedCredits = 0;
    const matchingStudentSubs: string[] = [];

    for (const sub of student.subjects) {
      const subNameLower = sub.name.toLowerCase();
      const subCatLower = (sub.category || "").toLowerCase();

      const matched =
        (keyword.includes("chem") && (subNameLower.includes("chem") || subCatLower.includes("chem"))) ||
        (keyword.includes("pharm") && (subNameLower.includes("pharm") || subCatLower.includes("pharm"))) ||
        (keyword.includes("bio") && (subNameLower.includes("bio") || subCatLower.includes("bio"))) ||
        (keyword.includes("math") && (subNameLower.includes("math") || subNameLower.includes("stat") || subCatLower.includes("math"))) ||
        (keyword.includes("comp") && (subNameLower.includes("comp") || subNameLower.includes("inform") || subNameLower.includes("prog") || subCatLower.includes("comp"))) ||
        (keyword.includes("lab") && sub.isLab) ||
        (keyword.includes("mechanic") && subNameLower.includes("mechanic")) ||
        subNameLower.includes(keyword);

      if (matched) {
        matchedCredits += sub.credits;
        matchingStudentSubs.push(sub.name);
      }
    }

    if (matchedCredits >= reqSub.minEcts) {
      satisfiedSubjectsCount++;
      whyMatches.push(`Required coursework in ${reqSub.subject} satisfied (${matchedCredits} ECTS found vs ${reqSub.minEcts} required)`);
      comparisonTable.push({
        requirement: `${reqSub.subject} Coursework`,
        universityRequirement: `${reqSub.minEcts} ECTS minimum`,
        studentProfile: `${matchedCredits} ECTS identified`,
        status: "satisfied",
        explanation: `Sufficient academic credits identified across ${matchingStudentSubs.length} completed subjects.`
      });
    } else if (matchedCredits > 0) {
      accumulatedEctsScore -= 20;
      potentialIssues.push(`Potential ECTS gap in ${reqSub.subject}: ${matchedCredits} credits found vs ${reqSub.minEcts} required`);
      comparisonTable.push({
        requirement: `${reqSub.subject} Coursework`,
        universityRequirement: `${reqSub.minEcts} ECTS minimum`,
        studentProfile: `${matchedCredits} ECTS identified`,
        status: "potential_gap",
        explanation: `You have completed related coursework, but ECTS conversion requires official faculty verification.`
      });
    } else {
      if (reqSub.mandatory) {
        accumulatedEctsScore -= 35;
        potentialIssues.push(`Missing mandatory subject credits in: ${reqSub.subject} (${reqSub.minEcts} ECTS required)`);
      }
      comparisonTable.push({
        requirement: `${reqSub.subject} Coursework`,
        universityRequirement: `${reqSub.minEcts} ECTS minimum`,
        studentProfile: `0 ECTS identified`,
        status: "not_satisfied",
        explanation: `No corresponding subject credits were found in your submitted transcript.`
      });
    }
  }

  const ectsScore = Math.max(
    25,
    Math.min(100, requiredSubjects.length > 0 ? Math.round((satisfiedSubjectsCount / requiredSubjects.length) * 100) : 90)
  );

  // 4. Language Match
  let langScore = 90;
  const courseLang = course.language;
  const ieltsReq = course.requirements.ieltsMin || 6.5;
  const toeflReq = course.requirements.toeflMin || 85;

  if (courseLang === "English") {
    const studentIelts = student.ielts || 0;
    const studentToefl = student.toefl || 0;
    if (studentIelts >= ieltsReq || studentToefl >= toeflReq) {
      langScore = 100;
      whyMatches.push(`English proficiency requirement satisfied (IELTS ${studentIelts} / TOEFL ${studentToefl} vs minimum ${ieltsReq})`);
      comparisonTable.push({
        requirement: "English Language Proficiency",
        universityRequirement: `IELTS ${ieltsReq} or TOEFL iBT ${toeflReq}`,
        studentProfile: `IELTS ${studentIelts} / TOEFL ${studentToefl}`,
        status: "satisfied",
        explanation: `Your test scores fully meet the English proficiency requirement for admission.`
      });
    } else {
      langScore = 45;
      potentialIssues.push(`English test score below required cut-off (IELTS ${ieltsReq} / TOEFL ${toeflReq} required)`);
      comparisonTable.push({
        requirement: "English Language Proficiency",
        universityRequirement: `IELTS ${ieltsReq} or TOEFL iBT ${toeflReq}`,
        studentProfile: studentIelts ? `IELTS ${studentIelts}` : "Not submitted",
        status: "not_satisfied",
        explanation: `You must achieve at least IELTS ${ieltsReq} before the application deadline.`
      });
    }
  } else if (courseLang === "German" || courseLang === "English + German") {
    const germanReq = course.requirements.germanMin || "B2";
    if (student.germanLevel && (student.germanLevel === "B2" || student.germanLevel === "C1" || student.germanLevel === "C2")) {
      langScore = 95;
      whyMatches.push(`German proficiency meets ${germanReq} criteria`);
      comparisonTable.push({
        requirement: "German Language Proficiency",
        universityRequirement: `${germanReq} level certificate`,
        studentProfile: student.germanLevel,
        status: "satisfied",
        explanation: `Your German level is verified for the language of instruction.`
      });
    } else {
      langScore = 35;
      potentialIssues.push(`Program requires German proficiency (${germanReq}); student reported ${student.germanLevel || "None"}`);
      comparisonTable.push({
        requirement: "German Language Proficiency",
        universityRequirement: `${germanReq} level certificate`,
        studentProfile: student.germanLevel || "None",
        status: "not_satisfied",
        explanation: `This course requires official proof of German competence (${germanReq}).`
      });
    }
  }

  // 5. Total Requirements Match
  let requirementsScore = Math.round((academicScore * 0.35) + (ectsScore * 0.25) + (gpaScore * 0.2) + (langScore * 0.2));

  // APS requirement check
  if (course.requirements.apsRequired && student.country === "India") {
    comparisonTable.push({
      requirement: "APS India Certificate",
      universityRequirement: "Mandatory for Indian Bachelor applicants",
      studentProfile: "Required for student visa & enrollment",
      status: "potential_gap",
      explanation: "Academic Evaluation Centre (APS) verification is mandatory for German study visa approval."
    });
  }

  // Calculate Overall Weighted Score
  const overallScore = Math.min(
    99,
    Math.max(
      20,
      Math.round(
        academicScore * 0.35 +
        ectsScore * 0.30 +
        gpaScore * 0.20 +
        langScore * 0.15
      )
    )
  );

  let status: MatchStatus = "Low Match";
  if (overallScore >= 80) status = "Strong Match";
  else if (overallScore >= 66) status = "Possible Match";
  else if (overallScore >= 50) status = "Needs Verification";
  else status = "Low Match";

  return {
    courseId: course.id,
    course,
    overallScore,
    status,
    academicMatch: academicScore,
    ectsMatch: ectsScore,
    gpaMatch: gpaScore,
    languageMatch: langScore,
    requirementsMatch: requirementsScore,
    whyMatches,
    potentialIssues,
    comparisonTable
  };
}
