import { Course } from "../types";

export const INITIAL_COURSES: Course[] = [
  {
    id: "course-1",
    universityId: "heidelberg",
    universityName: "Heidelberg University",
    universityType: "Public",
    city: "Heidelberg",
    state: "Baden-Württemberg",
    name: "M.Sc. Molecular Biosciences (Specialization in Drug Discovery & Pharmacy)",
    slug: "msc-molecular-biosciences-heidelberg",
    degree: "Master's",
    field: "Pharmaceutical Sciences",
    language: "English",
    intake: "Winter",
    durationYears: 2,
    ectsCredits: 120,
    tuitionFee: "No tuition",
    tuitionAmountEur: 0,
    semesterContributionEur: 171,
    overview:
      "A flagship international research master's program offering in-depth education in molecular pharmacology, drug targets, pharmaceutical biotechnology, and cellular biology at Germany's premier life science campus.",
    programStructure: [
      "Semester 1: Advanced Molecular Biology & Pharmacology Fundamentals",
      "Semester 2: Drug Discovery Platforms, Assay Technologies & Lab Rotations",
      "Semester 3: Specialized Research Project & Translational Medicine",
      "Semester 4: Master's Thesis & Research Defense"
    ],
    careerOpportunities: [
      "Pharmaceutical R&D Scientist",
      "Biotech Project Lead",
      "Clinical Trials Specialist",
      "Regulatory Affairs Associate",
      "Doctoral Researcher / Ph.D."
    ],
    requirements: {
      minGpaGermanScale: 2.2,
      minCgpaEquivalent: 3.2,
      acceptedBachelorDegrees: [
        "B.Pharm",
        "Pharmacy",
        "Pharmaceutical Sciences",
        "Biotechnology",
        "Biochemistry",
        "Biology"
      ],
      requiredSubjectEcts: [
        { subject: "Chemistry (Organic, Inorganic, Analytical)", minEcts: 20, mandatory: true },
        { subject: "Pharmacology & Biochemistry", minEcts: 25, mandatory: true },
        { subject: "Laboratory Practical Work", minEcts: 15, mandatory: true },
        { subject: "Mathematics & Statistics", minEcts: 8, mandatory: false }
      ],
      totalMinEcts: 180,
      ieltsMin: 6.5,
      toeflMin: 90,
      germanMin: "None",
      mediumOfInstructionAccepted: false,
      apsRequired: true,
      greRequired: false,
      notes: "Applicants must provide proof of substantial wet-lab hands-on experience in their bachelor's transcript."
    },
    deadline: {
      winterDeadline: "March 15 (International) / July 15 (EU)",
      summerDeadline: "No summer intake",
      daysRemaining: 45,
      status: "Closing Soon"
    },
    officialSourceUrl: "https://www.uni-heidelberg.de/en/study/courses/molecular-biosciences-master",
    applicationUrl: "https://www.uni-heidelberg.de/en/study/management-studies/applying-and-enrolling",
    lastVerifiedAt: "2026-02-15",
    verificationStatus: "Verified"
  },
  {
    id: "course-2",
    universityId: "lmu",
    universityName: "Ludwig Maximilian University of Munich (LMU)",
    universityType: "Public",
    city: "Munich",
    state: "Bavaria",
    name: "M.Sc. Pharmaceutical Sciences",
    slug: "msc-pharmaceutical-sciences-lmu",
    degree: "Master's",
    field: "Pharmacy",
    language: "English",
    intake: "Winter",
    durationYears: 2,
    ectsCredits: 120,
    tuitionFee: "No tuition",
    tuitionAmountEur: 0,
    semesterContributionEur: 152,
    overview:
      "An elite English-taught master's focusing on drug discovery, drug formulation, biopharmaceutics, and targeted drug delivery systems taught by leading researchers in the Department of Pharmacy.",
    programStructure: [
      "Semester 1: Molecular Targets, Advanced Pharmaceutics, Pharmacokinetics",
      "Semester 2: Analytical Methods in Drug Development, Drug Delivery Nanotechnology",
      "Semester 3: Practical Focus Elective & Research Practicum",
      "Semester 4: Master's Research Thesis"
    ],
    careerOpportunities: [
      "Formulation Scientist",
      "Analytical Development Chemist",
      "Quality Assurance Manager",
      "Medical Science Liaison",
      "PhD in Pharmaceutical Technology"
    ],
    requirements: {
      minGpaGermanScale: 2.0,
      minCgpaEquivalent: 3.4,
      acceptedBachelorDegrees: [
        "B.Pharm",
        "Bachelor of Pharmacy",
        "Pharmaceutical Sciences",
        "Chemistry",
        "Biochemistry"
      ],
      requiredSubjectEcts: [
        { subject: "Pharmaceutical Chemistry", minEcts: 24, mandatory: true },
        { subject: "Pharmaceutics & Formulation", minEcts: 18, mandatory: true },
        { subject: "Pharmacology & Physiology", minEcts: 14, mandatory: true },
        { subject: "Analytical Chemistry", minEcts: 10, mandatory: true }
      ],
      totalMinEcts: 180,
      ieltsMin: 6.5,
      toeflMin: 88,
      germanMin: "None",
      mediumOfInstructionAccepted: true,
      apsRequired: true,
      greRequired: false,
      notes: "Strict requirement for pharmaceutical formulation and pharmacology credits."
    },
    deadline: {
      winterDeadline: "May 31",
      summerDeadline: "No summer intake",
      daysRemaining: 78,
      status: "Open"
    },
    officialSourceUrl: "https://www.cup.lmu.de/en/departments/pharmacy/master-pharmaceutical-sciences/",
    applicationUrl: "https://www.lmu.de/en/study/how-to-apply/",
    lastVerifiedAt: "2026-02-28",
    verificationStatus: "Verified"
  },
  {
    id: "course-3",
    universityId: "tum",
    universityName: "Technical University of Munich (TUM)",
    universityType: "Public",
    city: "Munich",
    state: "Bavaria",
    name: "M.Sc. Data Engineering and Analytics",
    slug: "msc-data-engineering-tum",
    degree: "Master's",
    field: "Data Science",
    language: "English",
    intake: "Both",
    durationYears: 2,
    ectsCredits: 120,
    tuitionFee: "No tuition",
    tuitionAmountEur: 0,
    semesterContributionEur: 102,
    overview:
      "TUM's prestigious program sits at the intersection of computer science, big data distributed systems, machine learning pipelines, and advanced analytical statistics.",
    programStructure: [
      "Semester 1: Distributed Data Systems, Machine Learning, Statistical Foundations",
      "Semester 2: Deep Learning, Cloud Computing, Database System Internals",
      "Semester 3: Interdisciplinary Project & Guided Research Seminar",
      "Semester 4: Master's Thesis"
    ],
    careerOpportunities: [
      "Big Data Engineer",
      "Machine Learning Infrastructure Engineer",
      "Senior Data Architect",
      "AI Solutions Architect",
      "Tech Lead"
    ],
    requirements: {
      minGpaGermanScale: 2.0,
      minCgpaEquivalent: 3.5,
      acceptedBachelorDegrees: [
        "Computer Science",
        "Informatics",
        "Data Science",
        "Software Engineering",
        "Mathematics"
      ],
      requiredSubjectEcts: [
        { subject: "Computer Science & Programming", minEcts: 30, mandatory: true },
        { subject: "Mathematics & Linear Algebra", minEcts: 25, mandatory: true },
        { subject: "Algorithms & Data Structures", minEcts: 15, mandatory: true },
        { subject: "Database Systems", minEcts: 10, mandatory: true }
      ],
      totalMinEcts: 180,
      ieltsMin: 6.5,
      toeflMin: 88,
      germanMin: "None",
      mediumOfInstructionAccepted: false,
      apsRequired: true,
      greRequired: "Mandatory for non-EU bachelor degrees (min Quantitative 164)",
      notes: "GRE Quantitative section required for applicants with non-EU Bachelor's degree."
    },
    deadline: {
      winterDeadline: "May 31",
      summerDeadline: "November 30",
      daysRemaining: 80,
      status: "Open"
    },
    officialSourceUrl: "https://www.cit.tum.de/en/cit/studies/degree-programs/master-data-engineering-and-analytics/",
    applicationUrl: "https://campus.tum.de",
    lastVerifiedAt: "2026-03-01",
    verificationStatus: "Verified"
  },
  {
    id: "course-4",
    universityId: "rwth",
    universityName: "RWTH Aachen University",
    universityType: "Public",
    city: "Aachen",
    state: "North Rhine-Westphalia",
    name: "M.Sc. Computer Science",
    slug: "msc-computer-science-rwth",
    degree: "Master's",
    field: "Computer Science",
    language: "English",
    intake: "Both",
    durationYears: 2,
    ectsCredits: 120,
    tuitionFee: "No tuition",
    tuitionAmountEur: 0,
    semesterContributionEur: 318,
    overview:
      "A globally top-ranked computer science program providing unmatched depth in theoretical computer science, software engineering, cyber-physical systems, and high-performance computing.",
    programStructure: [
      "Major specialization: Theoretical Foundations, Software Modeling, Distributed Systems",
      "Elective tracks: Artificial Intelligence, Security, Visual Computing",
      "Lab & Seminar module",
      "Comprehensive Master's Thesis"
    ],
    careerOpportunities: [
      "Senior Software Engineer",
      "Systems Architect",
      "AI / Robotics Engineer",
      "Cybersecurity Specialist",
      "Doctoral Researcher"
    ],
    requirements: {
      minGpaGermanScale: 2.3,
      minCgpaEquivalent: 3.1,
      acceptedBachelorDegrees: [
        "Computer Science",
        "Informatics",
        "Software Engineering"
      ],
      requiredSubjectEcts: [
        { subject: "Theoretical Computer Science & Formal Languages", minEcts: 28, mandatory: true },
        { subject: "Mathematics (Analysis, Linear Algebra, Discrete)", minEcts: 25, mandatory: true },
        { subject: "Software Engineering & Programming", minEcts: 35, mandatory: true },
        { subject: "Computer Architecture & Operating Systems", minEcts: 12, mandatory: true }
      ],
      totalMinEcts: 180,
      ieltsMin: 6.5,
      toeflMin: 90,
      germanMin: "None",
      mediumOfInstructionAccepted: true,
      apsRequired: true,
      greRequired: "Recommended (Quantitative 160+)",
      notes: "Strict adherence to theoretical computer science credits is enforced by the admissions committee."
    },
    deadline: {
      winterDeadline: "March 1 (Non-EU) / July 15 (EU)",
      summerDeadline: "September 1 (Non-EU) / January 15 (EU)",
      daysRemaining: 12,
      status: "Closing Soon"
    },
    officialSourceUrl: "https://www.rwth-aachen.de/go/id/bnow/?lidx=1",
    applicationUrl: "https://online.rwth-aachen.de",
    lastVerifiedAt: "2026-02-20",
    verificationStatus: "Verified"
  },
  {
    id: "course-5",
    universityId: "uni-freiburg",
    universityName: "University of Freiburg",
    universityType: "Public",
    city: "Freiburg",
    state: "Baden-Württemberg",
    name: "M.Sc. Pharmaceutical Sciences & Drug Research",
    slug: "msc-pharmaceutical-sciences-freiburg",
    degree: "Master's",
    field: "Pharmacy",
    language: "English + German",
    intake: "Winter",
    durationYears: 2,
    ectsCredits: 120,
    tuitionFee: "No tuition",
    tuitionAmountEur: 0,
    semesterContributionEur: 180,
    overview:
      "A collaborative interdisciplinary program combining chemistry, clinical pharmacy, natural product research, and medicinal toxicology at one of Germany's most venerable research universities.",
    programStructure: [
      "Semester 1: Medicinal Chemistry, Analytical Methods, Biopharmaceutics",
      "Semester 2: Drug Formulation, Clinical Pharmacy Research",
      "Semester 3: Experimental Lab Project & Elective Specialization",
      "Semester 4: Master's Thesis"
    ],
    careerOpportunities: [
      "Hospital & Clinical Pharmacist",
      "Drug Safety Associate",
      "Medicinal Chemist",
      "QC Lab Manager",
      "Academic Researcher"
    ],
    requirements: {
      minGpaGermanScale: 2.5,
      minCgpaEquivalent: 3.0,
      acceptedBachelorDegrees: [
        "B.Pharm",
        "Pharmacy",
        "Chemistry",
        "Life Sciences"
      ],
      requiredSubjectEcts: [
        { subject: "Chemistry & Bioanalysis", minEcts: 22, mandatory: true },
        { subject: "Pharmacy & Pharmacology", minEcts: 20, mandatory: true },
        { subject: "Biology & Human Anatomy", minEcts: 12, mandatory: true }
      ],
      totalMinEcts: 180,
      ieltsMin: 6.0,
      toeflMin: 80,
      germanMin: "B2 (Required for bilingual clinical modules)",
      mediumOfInstructionAccepted: false,
      apsRequired: true,
      greRequired: false,
      notes: "Requires at least B2 German certificate due to clinical pharmacy components."
    },
    deadline: {
      winterDeadline: "July 15",
      summerDeadline: "No summer intake",
      daysRemaining: 125,
      status: "Open"
    },
    officialSourceUrl: "https://uni-freiburg.de/en/study-programs/pharmaceutical-sciences-m-sc/",
    applicationUrl: "https://hisinone.uni-freiburg.de",
    lastVerifiedAt: "2026-01-25",
    verificationStatus: "Verified"
  },
  {
    id: "course-6",
    universityId: "tu-berlin",
    universityName: "Technical University of Berlin (TU Berlin)",
    universityType: "Public",
    city: "Berlin",
    state: "Berlin",
    name: "M.Sc. Biotechnology & Bioprocess Engineering",
    slug: "msc-biotechnology-tu-berlin",
    degree: "Master's",
    field: "Biotechnology",
    language: "English",
    intake: "Winter",
    durationYears: 2,
    ectsCredits: 120,
    tuitionFee: "No tuition",
    tuitionAmountEur: 0,
    semesterContributionEur: 310,
    overview:
      "Combines cutting-edge industrial biotechnology, synthetic biology, enzyme engineering, and bioreactor design in Germany's capital of innovation.",
    programStructure: [
      "Semester 1: Advanced Bioprocess Engineering, Molecular Cell Systems",
      "Semester 2: Downstream Processing, Metabolic Engineering, Industrial Biotechnology",
      "Semester 3: Pilot-scale Plant Operations & Research Project",
      "Semester 4: Master's Thesis"
    ],
    careerOpportunities: [
      "Bioprocess Engineer",
      "Fermentation Scientist",
      "Biopharmaceutical Production Lead",
      "CleanTech Consultant",
      "Synthetic Biology Researcher"
    ],
    requirements: {
      minGpaGermanScale: 2.3,
      minCgpaEquivalent: 3.1,
      acceptedBachelorDegrees: [
        "Biotechnology",
        "Bioprocess Engineering",
        "Chemical Engineering",
        "Pharmacy",
        "Biochemistry"
      ],
      requiredSubjectEcts: [
        { subject: "Biotechnology & Microbiology", minEcts: 25, mandatory: true },
        { subject: "Biochemical & Chemical Engineering", minEcts: 20, mandatory: true },
        { subject: "Mathematics & Thermodynamics", minEcts: 15, mandatory: true },
        { subject: "Biochemistry & Genetics", minEcts: 12, mandatory: true }
      ],
      totalMinEcts: 180,
      ieltsMin: 6.5,
      toeflMin: 87,
      germanMin: "None",
      mediumOfInstructionAccepted: true,
      apsRequired: true,
      greRequired: false,
      notes: "Engineering mathematics and thermodynamics backgrounds are evaluated closely."
    },
    deadline: {
      winterDeadline: "May 15 (Non-EU) / August 31 (EU)",
      summerDeadline: "No summer intake",
      daysRemaining: 65,
      status: "Open"
    },
    officialSourceUrl: "https://www.tu.berlin/en/go1635/biotech-master",
    applicationUrl: "https://www.uni-assist.de",
    lastVerifiedAt: "2026-02-18",
    verificationStatus: "Verified"
  },
  {
    id: "course-7",
    universityId: "kit",
    universityName: "Karlsruhe Institute of Technology (KIT)",
    universityType: "Public",
    city: "Karlsruhe",
    state: "Baden-Württemberg",
    name: "M.Sc. Mechanical Engineering (Specialization Automotive & Robotics)",
    slug: "msc-mechanical-engineering-kit",
    degree: "Master's",
    field: "Engineering",
    language: "English",
    intake: "Both",
    durationYears: 2,
    ectsCredits: 120,
    tuitionFee: "Low tuition",
    tuitionAmountEur: 1500, // Baden-Württemberg state tuition for non-EU students
    semesterContributionEur: 180,
    overview:
      "World-class engineering education with direct ties to Germany's automotive giants (Porsche, Daimler, Bosch), covering powertrain, autonomous driving, and advanced mechatronics.",
    programStructure: [
      "Advanced Dynamics, Mechanics of Materials, Fluid Dynamics",
      "Vehicle Dynamics & Autonomous Driving Systems",
      "Mechatronics Lab & Industrial Project",
      "Master's Thesis"
    ],
    careerOpportunities: [
      "Automotive Systems Engineer",
      "Robotics Control Specialist",
      "Powertrain R&D Specialist",
      "CAE / Simulation Engineer",
      "Engineering Consultant"
    ],
    requirements: {
      minGpaGermanScale: 2.1,
      minCgpaEquivalent: 3.3,
      acceptedBachelorDegrees: [
        "Mechanical Engineering",
        "Automotive Engineering",
        "Mechatronics"
      ],
      requiredSubjectEcts: [
        { subject: "Higher Mathematics & Linear Algebra", minEcts: 25, mandatory: true },
        { subject: "Engineering Mechanics (Statics, Dynamics)", minEcts: 24, mandatory: true },
        { subject: "Thermodynamics & Fluid Dynamics", minEcts: 18, mandatory: true },
        { subject: "Machine Elements & Design", minEcts: 15, mandatory: true }
      ],
      totalMinEcts: 180,
      ieltsMin: 6.5,
      toeflMin: 92,
      germanMin: "None",
      mediumOfInstructionAccepted: false,
      apsRequired: true,
      greRequired: false,
      notes: "Baden-Württemberg charges €1,500/semester tuition for non-EU students."
    },
    deadline: {
      winterDeadline: "July 15",
      summerDeadline: "January 15",
      daysRemaining: 125,
      status: "Open"
    },
    officialSourceUrl: "https://www.mach.kit.edu/english/master.php",
    applicationUrl: "https://movein-kit.ungerboeck.com",
    lastVerifiedAt: "2026-03-02",
    verificationStatus: "Verified"
  },
  {
    id: "course-8",
    universityId: "uni-bonn",
    universityName: "University of Bonn",
    universityType: "Public",
    city: "Bonn",
    state: "North Rhine-Westphalia",
    name: "M.Sc. Drug Research & Molecular Pharmacy",
    slug: "msc-drug-research-bonn",
    degree: "Master's",
    field: "Pharmacy",
    language: "English",
    intake: "Winter",
    durationYears: 2,
    ectsCredits: 120,
    tuitionFee: "No tuition",
    tuitionAmountEur: 0,
    semesterContributionEur: 320,
    overview:
      "Taught in cooperation with the Pharma-Center Bonn and DZNE (German Center for Neurodegenerative Diseases), focusing on neuropharmacology, molecular screening, and medicinal synthesis.",
    programStructure: [
      "Semester 1: Chemical Biology, Target Validation, Analytical Spectroscopy",
      "Semester 2: Drug Delivery Technologies, Pharmacology of the CNS",
      "Semester 3: Lab Research Rotations in Partner Institutes",
      "Semester 4: Master's Thesis"
    ],
    careerOpportunities: [
      "Senior Medicinal Chemist",
      "Neuropharmacology Researcher",
      "Drug Discovery Specialist",
      "Patent Attorney Trainee (Pharma)",
      "University Lecturer"
    ],
    requirements: {
      minGpaGermanScale: 2.3,
      minCgpaEquivalent: 3.1,
      acceptedBachelorDegrees: [
        "B.Pharm",
        "Pharmacy",
        "Pharmaceutical Chemistry",
        "Biochemistry",
        "Molecular Biology"
      ],
      requiredSubjectEcts: [
        { subject: "Chemistry (Organic & Bioinorganic)", minEcts: 22, mandatory: true },
        { subject: "Pharmacology & Cell Biology", minEcts: 18, mandatory: true },
        { subject: "Laboratory Techniques & Instrumentation", minEcts: 12, mandatory: true }
      ],
      totalMinEcts: 180,
      ieltsMin: 6.5,
      toeflMin: 85,
      germanMin: "None",
      mediumOfInstructionAccepted: true,
      apsRequired: true,
      greRequired: false,
      notes: "Accepts Medium of Instruction certificate from accredited universities."
    },
    deadline: {
      winterDeadline: "June 15",
      summerDeadline: "No summer intake",
      daysRemaining: 95,
      status: "Open"
    },
    officialSourceUrl: "https://www.uni-bonn.de/en/study-courses/drug-research-msc",
    applicationUrl: "https://my.uni-bonn.de",
    lastVerifiedAt: "2026-02-10",
    verificationStatus: "Verified"
  },
  {
    id: "course-9",
    universityId: "frankfurt-school",
    universityName: "Frankfurt School of Finance & Management",
    universityType: "Private",
    city: "Frankfurt",
    state: "Hesse",
    name: "Master in Management & Financial Analytics",
    slug: "master-in-management-frankfurt-school",
    degree: "Master's",
    field: "Business",
    language: "English",
    intake: "Winter",
    durationYears: 2,
    ectsCredits: 120,
    tuitionFee: "High tuition",
    tuitionAmountEur: 16500,
    semesterContributionEur: 0,
    overview:
      "A premier business master's program ranked in the FT Global Top 30, with a distinctive 3-day work model allowing students to work part-time in Frankfurt's banking district throughout their degree.",
    programStructure: [
      "Semester 1: Strategic Management, Financial Economics, Applied Data Analytics",
      "Semester 2: Corporate Finance, Digital Transformation, Elective Modules",
      "Semester 3: Global Study Abroad or Extended Industry Internship",
      "Semester 4: Master's Thesis"
    ],
    careerOpportunities: [
      "Investment Banking Analyst",
      "Management Consultant",
      "Corporate Strategy Lead",
      "Fintech Product Manager",
      "Private Equity Associate"
    ],
    requirements: {
      minGpaGermanScale: 2.5,
      minCgpaEquivalent: 3.0,
      acceptedBachelorDegrees: [
        "Business Administration",
        "Economics",
        "Management",
        "Engineering",
        "Sciences",
        "Any Quantitative Bachelor"
      ],
      requiredSubjectEcts: [
        { subject: "Quantitative Methods / Statistics", minEcts: 12, mandatory: true },
        { subject: "Economics / Business Fundamentals", minEcts: 15, mandatory: false }
      ],
      totalMinEcts: 180,
      ieltsMin: 7.0,
      toeflMin: 95,
      germanMin: "None",
      mediumOfInstructionAccepted: true,
      apsRequired: true,
      greRequired: "GMAT (min 600) or FS Admission Test",
      notes: "Fast-track admission available with GMAT > 640."
    },
    deadline: {
      winterDeadline: "June 30 (Early Bird March 31)",
      summerDeadline: "No summer intake",
      daysRemaining: 110,
      status: "Open"
    },
    officialSourceUrl: "https://www.frankfurt-school.de/en/home/programmes/master/management",
    applicationUrl: "https://application.frankfurt-school.de",
    lastVerifiedAt: "2026-01-30",
    verificationStatus: "Verified"
  },
  {
    id: "course-10",
    universityId: "tum",
    universityName: "Technical University of Munich (TUM)",
    universityType: "Public",
    city: "Munich",
    state: "Bavaria",
    name: "M.Sc. Biomedical Engineering and Medical Physics",
    slug: "msc-biomedical-engineering-tum",
    degree: "Master's",
    field: "Biotechnology",
    language: "English",
    intake: "Winter",
    durationYears: 2,
    ectsCredits: 120,
    tuitionFee: "No tuition",
    tuitionAmountEur: 0,
    semesterContributionEur: 102,
    overview:
      "Focuses on modern medical imaging, biomaterials, diagnostic biosensors, neuroprosthetics, and computational medicine in Munich's life science research corridor.",
    programStructure: [
      "Advanced Medical Imaging, Biosignals & Systems",
      "Biomaterials & Tissue Engineering",
      "Clinical Internship & Lab Practicum",
      "Master's Thesis"
    ],
    careerOpportunities: [
      "Medical Device Design Engineer",
      "Biomedical Imaging Specialist",
      "Regulatory Affairs Specialist (MDR)",
      "Clinical Applications Specialist",
      "R&D Scientist in MedTech"
    ],
    requirements: {
      minGpaGermanScale: 2.2,
      minCgpaEquivalent: 3.2,
      acceptedBachelorDegrees: [
        "Biomedical Engineering",
        "Physics",
        "Electrical Engineering",
        "Biotechnology",
        "Mechanical Engineering"
      ],
      requiredSubjectEcts: [
        { subject: "Higher Mathematics & Differential Equations", minEcts: 22, mandatory: true },
        { subject: "Physics & Electromagnetics", minEcts: 20, mandatory: true },
        { subject: "Biology & Physiology", minEcts: 10, mandatory: true },
        { subject: "Signals & Systems or Programming", minEcts: 12, mandatory: true }
      ],
      totalMinEcts: 180,
      ieltsMin: 6.5,
      toeflMin: 88,
      germanMin: "None",
      mediumOfInstructionAccepted: false,
      apsRequired: true,
      greRequired: "Mandatory for non-EU degrees",
      notes: "Rigorous evaluation of mathematical and physical foundations."
    },
    deadline: {
      winterDeadline: "May 31",
      summerDeadline: "No summer intake",
      daysRemaining: 80,
      status: "Open"
    },
    officialSourceUrl: "https://www.tum.de/en/studies/degree-programs/detail/biomedical-engineering-and-medical-physics-master-of-science-msc",
    applicationUrl: "https://campus.tum.de",
    lastVerifiedAt: "2026-02-25",
    verificationStatus: "Verified"
  },
  {
    id: "course-bayreuth-natural-products",
    universityId: "bayreuth",
    universityName: "University of Bayreuth",
    universityType: "Public",
    city: "Bayreuth",
    state: "Bavaria",
    country: "Germany",
    name: "M.Sc. Natural Products and Drug Chemistry",
    slug: "msc-natural-products-and-drug-chemistry-bayreuth",
    degree: "Master's",
    field: "Pharmacy",
    specialization: "Natural Products & Medicinal Chemistry",
    language: "English",
    intake: "Both",
    intakePeriod: "Summer 2027 & Winter 2026/27",
    beginningOfCourse: "Summer Semester (April) & Winter Semester (October)",
    durationYears: 2,
    studyMode: "Full-time",
    ectsCredits: 120,
    tuitionFee: "No tuition",
    tuitionAmountEur: 0,
    semesterContributionEur: 145,
    currency: "EUR",
    overview:
      "A flagship research-focused Master's program taught in English in Bavaria, dedicated to the discovery, isolation, structural elucidation, and synthesis of bio-active natural products, drug design, and pharmaceutical lead optimization.",
    programStructure: [
      "Semester 1: Bio-organic Synthesis, Advanced NMR & Mass Spectrometry, Natural Product Classes",
      "Semester 2: Drug Formulation, Pharmacological Assays, Biosynthesis & Biotechnology",
      "Semester 3: Specialized Lab Research Projects in Natural Drug Discovery",
      "Semester 4: Master's Thesis & Colloquium"
    ],
    careerOpportunities: [
      "Natural Products Chemist",
      "Pharmaceutical Research Scientist",
      "Drug Discovery Specialist",
      "Phytopharmaceutical QA/QC Lead",
      "Ph.D. Researcher in Medicinal Chemistry"
    ],
    requirements: {
      minGpaGermanScale: 2.5,
      minCgpaEquivalent: 3.0,
      acceptedBachelorDegrees: [
        "B.Pharm",
        "Bachelor of Pharmacy",
        "Pharmaceutical Sciences",
        "Chemistry",
        "Biochemistry",
        "Life Sciences"
      ],
      requiredSubjectEcts: [
        { subject: "Organic & Bio-organic Chemistry", minEcts: 25, mandatory: true },
        { subject: "Pharmacology & Natural Products", minEcts: 20, mandatory: true },
        { subject: "Analytical Spectroscopy & Chromatography", minEcts: 15, mandatory: true },
        { subject: "Laboratory Practical Work", minEcts: 15, mandatory: true }
      ],
      totalMinEcts: 180,
      ieltsMin: 6.5,
      toeflMin: 88,
      germanMin: "None",
      mediumOfInstructionAccepted: true,
      apsRequired: true,
      greRequired: false,
      notes: "Ideal match for B.Pharm and Chemistry graduates. Open for both Summer (April) and Winter (October) intakes."
    },
    deadline: {
      winterDeadline: "July 15",
      summerDeadline: "January 15 (Summer 2027)",
      daysRemaining: 175,
      status: "Open"
    },
    applicationStartDate: "November 1 (Summer) / May 1 (Winter)",
    applicationDeadline: "January 15 (Summer intake) / July 15 (Winter intake)",
    applicationMethod: "University CampusOnline Portal",
    officialSourceUrl: "https://www.uni-bayreuth.de/en/master/natural-products-and-drug-chemistry",
    applicationUrl: "https://campusonline.uni-bayreuth.de",
    lastVerifiedAt: "2026-03-01",
    verificationStatus: "Verified"
  },
  {
    id: "course-fau-medchem",
    universityId: "fau",
    universityName: "FAU Erlangen-Nürnberg",
    universityType: "Public",
    city: "Erlangen",
    state: "Bavaria",
    country: "Germany",
    name: "M.Sc. Medicinal Chemistry and Chemical Biology",
    slug: "msc-medicinal-chemistry-fau",
    degree: "Master's",
    field: "Pharmacy",
    specialization: "Medicinal Chemistry",
    language: "English",
    intake: "Both",
    intakePeriod: "Summer 2027 & Winter 2026/27",
    beginningOfCourse: "Summer Semester (April) & Winter Semester (October)",
    durationYears: 2,
    studyMode: "Full-time",
    ectsCredits: 120,
    tuitionFee: "No tuition",
    tuitionAmountEur: 0,
    semesterContributionEur: 72,
    currency: "EUR",
    overview:
      "Taught entirely in English within Bavaria's Medical Valley, focusing on molecular pharmacology, target identification, computational drug design, and bioorganic synthesis.",
    programStructure: [
      "Semester 1: Advanced Medicinal Chemistry, Receptor Pharmacology, Chemical Biology",
      "Semester 2: Computational Drug Design, High-Throughput Screening & Analytics",
      "Semester 3: Research Practicum & Industrial Internship",
      "Semester 4: Master's Thesis"
    ],
    careerOpportunities: [
      "Medicinal Chemist",
      "Target Validation Specialist",
      "Pharma R&D Associate",
      "Clinical Chemistry Scientist",
      "PhD Fellow"
    ],
    requirements: {
      minGpaGermanScale: 2.4,
      minCgpaEquivalent: 3.1,
      acceptedBachelorDegrees: [
        "B.Pharm",
        "Pharmacy",
        "Pharmaceutical Sciences",
        "Chemistry",
        "Molecular Medicine"
      ],
      requiredSubjectEcts: [
        { subject: "Medicinal & Organic Chemistry", minEcts: 24, mandatory: true },
        { subject: "Pharmacology & Toxicology", minEcts: 18, mandatory: true },
        { subject: "Analytical Chemistry", minEcts: 12, mandatory: true }
      ],
      totalMinEcts: 180,
      ieltsMin: 6.5,
      toeflMin: 85,
      germanMin: "None",
      mediumOfInstructionAccepted: true,
      apsRequired: true,
      greRequired: false,
      notes: "Accepts applications for both Summer (April) and Winter (October) semester starts."
    },
    deadline: {
      winterDeadline: "July 15",
      summerDeadline: "January 15",
      daysRemaining: 175,
      status: "Open"
    },
    applicationStartDate: "December 1 (Summer) / June 1 (Winter)",
    applicationDeadline: "January 15 (Summer) / July 15 (Winter)",
    applicationMethod: "FAU Campo Portal",
    officialSourceUrl: "https://www.chemistry.nat.fau.eu/studying/degree-programmes/msc-medicinal-chemistry/",
    applicationUrl: "https://www.campo.fau.de",
    lastVerifiedAt: "2026-02-27",
    verificationStatus: "Verified"
  },
  {
    id: "course-bsc-ai-thws",
    universityId: "thws",
    universityName: "Technical University of Applied Sciences Würzburg-Schweinfurt (THWS)",
    universityType: "Public",
    city: "Würzburg",
    state: "Bavaria",
    country: "Germany",
    name: "B.Sc. Applied Artificial Intelligence & Data Science",
    slug: "bsc-applied-artificial-intelligence-thws",
    degree: "Bachelor's",
    field: "Computer Science",
    specialization: "Artificial Intelligence",
    language: "English",
    intake: "Winter",
    intakePeriod: "Winter 2026/27",
    beginningOfCourse: "Winter Semester (October)",
    durationYears: 3.5,
    studyMode: "Full-time",
    ectsCredits: 210,
    tuitionFee: "No tuition",
    tuitionAmountEur: 0,
    semesterContributionEur: 154,
    currency: "EUR",
    overview:
      "A complete English-taught public Bachelor's degree in Bavaria covering software engineering, neural networks, machine learning pipelines, and cloud computing with an integrated practical internship semester.",
    programStructure: [
      "Years 1-2: Mathematics for AI, Python Programming, Algorithms, Data Modeling",
      "Year 3: Deep Learning, Computer Vision, Practical Industry Internship Semester",
      "Year 4: Electives, Applied AI Project, Bachelor's Thesis"
    ],
    careerOpportunities: [
      "Junior Machine Learning Engineer",
      "Data Analyst",
      "Software Developer",
      "AI Solutions Specialist"
    ],
    requirements: {
      minGpaGermanScale: 2.5,
      minCgpaEquivalent: 3.0,
      acceptedBachelorDegrees: [
        "High School Diploma",
        "Higher Secondary Certificate",
        "A-Levels",
        "IB Diploma",
        "Feststellungsprüfung (FSP)"
      ],
      requiredSubjectEcts: [
        { subject: "Mathematics / Advanced Calculus", minEcts: 10, mandatory: true }
      ],
      totalMinEcts: 0,
      ieltsMin: 6.0,
      toeflMin: 79,
      germanMin: "None (A2 recommended during studies)",
      mediumOfInstructionAccepted: true,
      apsRequired: true,
      greRequired: false,
      notes: "Direct university entrance qualification (HZB) or Studienkolleg required."
    },
    deadline: {
      winterDeadline: "July 15",
      summerDeadline: "No summer intake",
      daysRemaining: 125,
      status: "Open"
    },
    applicationStartDate: "May 1",
    applicationDeadline: "July 15",
    applicationMethod: "uni-assist VPD + THWS Portal",
    officialSourceUrl: "https://www.thws.de/en/study-at-thws/degree-programmes/bachelor/artificial-intelligence/",
    applicationUrl: "https://www.uni-assist.de",
    lastVerifiedAt: "2026-03-02",
    verificationStatus: "Verified"
  },
  {
    id: "course-bsc-cs-iu",
    universityId: "iu",
    universityName: "IU International University of Applied Sciences",
    universityType: "Private",
    city: "Berlin",
    state: "Berlin",
    country: "Germany",
    name: "B.Sc. Computer Science & Software Engineering",
    slug: "bsc-computer-science-iu",
    degree: "Bachelor's",
    field: "Computer Science",
    specialization: "Software Engineering",
    language: "English",
    intake: "Both",
    intakePeriod: "Summer 2027 & Winter 2026/27",
    beginningOfCourse: "Both (Rolling start & April/October)",
    durationYears: 3,
    studyMode: "Full-time",
    ectsCredits: 180,
    tuitionFee: "High tuition",
    tuitionAmountEur: 3800,
    semesterContributionEur: 0,
    currency: "EUR",
    overview:
      "A flexible accredited Bachelor's degree in Berlin focusing on agile software development, full-stack web applications, databases, and DevOps.",
    programStructure: [
      "Object-Oriented Programming, Data Structures, Web Development",
      "Database Systems, Software Quality Assurance, Cloud Engineering",
      "Elective specialization in Cyber Security or Cloud Computing",
      "Bachelor's Thesis"
    ],
    careerOpportunities: [
      "Junior Software Developer",
      "Web Engineer",
      "QA Automation Tester",
      "Cloud Operations Associate"
    ],
    requirements: {
      minGpaGermanScale: 3.0,
      minCgpaEquivalent: 2.5,
      acceptedBachelorDegrees: [
        "High School Diploma",
        "Secondary School Certificate"
      ],
      requiredSubjectEcts: [],
      totalMinEcts: 0,
      ieltsMin: 6.0,
      toeflMin: 80,
      germanMin: "None",
      mediumOfInstructionAccepted: true,
      apsRequired: true,
      greRequired: false,
      notes: "Flexible admissions criteria with rolling intake dates."
    },
    deadline: {
      winterDeadline: "September 15",
      summerDeadline: "March 15",
      daysRemaining: 190,
      status: "Open"
    },
    applicationStartDate: "Rolling",
    applicationDeadline: "September 15 (Winter) / March 15 (Summer)",
    applicationMethod: "IU Direct Online Portal",
    officialSourceUrl: "https://www.iu.org/en/bachelor/computer-science/",
    applicationUrl: "https://application.iu.org",
    lastVerifiedAt: "2026-02-15",
    verificationStatus: "Verified"
  },
  {
    id: "course-phd-life-sciences",
    universityId: "heidelberg",
    universityName: "Heidelberg University",
    universityType: "Public",
    city: "Heidelberg",
    state: "Baden-Württemberg",
    country: "Germany",
    name: "Ph.D. in Molecular Life Sciences and Drug Target Discovery",
    slug: "phd-molecular-life-sciences-heidelberg",
    degree: "PhD",
    field: "Pharmaceutical Sciences",
    specialization: "Drug Target Discovery",
    language: "English",
    intake: "Both",
    intakePeriod: "Continuous & Summer 2027 / Winter 2026",
    beginningOfCourse: "Both (Any month upon acceptance)",
    durationYears: 3,
    studyMode: "Full-time",
    ectsCredits: 180,
    tuitionFee: "No tuition",
    tuitionAmountEur: 0,
    semesterContributionEur: 171,
    currency: "EUR",
    overview:
      "A prestigious doctoral research program structured through the Hartmut Hoffmann-Berling International Graduate School of Molecular and Cellular Biology (HBIGS) with full research stipend.",
    programStructure: [
      "Independent experimental research under faculty supervision",
      "Advanced research colloquia and international conference presentations",
      "Teaching assistantship & scientific writing workshops",
      "Doctoral Dissertation & Disputation"
    ],
    careerOpportunities: [
      "Principal Investigator",
      "Head of Pharma R&D",
      "University Professor",
      "Senior Regulatory Scientist"
    ],
    requirements: {
      minGpaGermanScale: 1.8,
      minCgpaEquivalent: 3.5,
      acceptedBachelorDegrees: [
        "M.Sc. Pharmacy",
        "M.Sc. Biochemistry",
        "M.Sc. Molecular Biology",
        "M.Sc. Pharmaceutical Sciences"
      ],
      requiredSubjectEcts: [
        { subject: "Master's Thesis Research Project", minEcts: 30, mandatory: true }
      ],
      totalMinEcts: 300,
      ieltsMin: 7.0,
      toeflMin: 95,
      germanMin: "None",
      mediumOfInstructionAccepted: true,
      apsRequired: true,
      greRequired: false,
      notes: "Requires an accredited Master's degree (300 ECTS cumulative) and research proposal."
    },
    deadline: {
      winterDeadline: "June 15 (Main call)",
      summerDeadline: "December 15 (Main call)",
      daysRemaining: 150,
      status: "Open"
    },
    applicationStartDate: "Continuous / 2 Calls per year",
    applicationDeadline: "June 15 / December 15",
    applicationMethod: "HBIGS Graduate School Portal",
    officialSourceUrl: "https://www.hbigs.uni-heidelberg.de/",
    applicationUrl: "https://www.hbigs.uni-heidelberg.de/application",
    lastVerifiedAt: "2026-03-01",
    verificationStatus: "Verified"
  }
];

export const POPULAR_FIELDS = [
  "Pharmacy",
  "Pharmaceutical Sciences",
  "Biotechnology",
  "Computer Science",
  "Data Science",
  "Engineering",
  "Business",
  "Natural Sciences",
  "Chemistry",
  "Life Sciences"
];

export const ALL_FIELDS = POPULAR_FIELDS;
export const COURSES_DATA = INITIAL_COURSES;

