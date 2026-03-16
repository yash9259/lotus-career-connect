export interface Job {
  id: string;
  position: string;
  location: string;
  salaryRange: string;
  experience: string;
  qualification: string;
  vacancy: number;
  gender: string;
  jobTime: string;
  responsibilities: string;
  status: "pending" | "approved" | "rejected";
  companyName: string;
  companyEmail: string;
  interviewContact: string;
  postedAt: string;
}

export interface Candidate {
  id: string;
  fullName: string;
  email: string;
  gender: string;
  dob: string;
  mobile: string;
  city: string;
  education: string;
  experience: string;
  currentDesignation: string;
  lastSalary: string;
  expectedSalary: string;
  jobInterests: string[];
  registeredAt: string;
}

export interface Application {
  id: string;
  candidateId: string;
  jobId: string;
  candidateName: string;
  position: string;
  appliedAt: string;
  status: "applied" | "shortlisted" | "rejected" | "interview";
}

export const mockJobs: Job[] = [
  {
    id: "1",
    position: "Full Stack Developer",
    location: "Mumbai",
    salaryRange: "₹8,00,000 – ₹14,00,000",
    experience: "3-5 years",
    qualification: "B.Tech / MCA",
    vacancy: 2,
    gender: "Any",
    jobTime: "Full Time",
    responsibilities: "Develop and maintain web applications using React and Node.js. Collaborate with cross-functional teams to define and implement new features. Ensure code quality through testing and reviews.",
    status: "approved",
    companyName: "TechServe Solutions",
    companyEmail: "hr@techserve.com",
    interviewContact: "Rajesh - 9876543210",
    postedAt: "2026-03-10",
  },
  {
    id: "2",
    position: "Accounts Manager",
    location: "Delhi",
    salaryRange: "₹5,00,000 – ₹8,00,000",
    experience: "2-4 years",
    qualification: "B.Com / M.Com / CA Inter",
    vacancy: 1,
    gender: "Any",
    jobTime: "Full Time",
    responsibilities: "Manage financial records, prepare balance sheets and P&L statements. Handle GST filing and compliance. Coordinate with auditors during annual audits.",
    status: "approved",
    companyName: "Krishna Enterprises",
    companyEmail: "accounts@krishnaent.com",
    interviewContact: "Meera - 9988776655",
    postedAt: "2026-03-12",
  },
  {
    id: "3",
    position: "Marketing Executive",
    location: "Pune",
    salaryRange: "₹4,00,000 – ₹6,00,000",
    experience: "1-3 years",
    qualification: "MBA Marketing",
    vacancy: 3,
    gender: "Any",
    jobTime: "Full Time",
    responsibilities: "Plan and execute marketing campaigns across digital channels. Manage social media presence and content calendar. Analyze campaign performance and optimize for ROI.",
    status: "approved",
    companyName: "GreenLeaf Marketing",
    companyEmail: "jobs@greenleaf.com",
    interviewContact: "Amit - 9123456789",
    postedAt: "2026-03-14",
  },
  {
    id: "4",
    position: "Customer Support Lead",
    location: "Bangalore",
    salaryRange: "₹3,50,000 – ₹5,50,000",
    experience: "2-3 years",
    qualification: "Any Graduate",
    vacancy: 2,
    gender: "Female",
    jobTime: "Shift Based",
    responsibilities: "Lead a team of support executives. Handle escalated customer issues. Develop training programs for new team members. Track and improve CSAT scores.",
    status: "approved",
    companyName: "ServiceFirst India",
    companyEmail: "hr@servicefirst.in",
    interviewContact: "Priya - 9876501234",
    postedAt: "2026-03-15",
  },
  {
    id: "5",
    position: "Graphic Designer",
    location: "Ahmedabad",
    salaryRange: "₹3,00,000 – ₹5,00,000",
    experience: "1-2 years",
    qualification: "B.Des / Diploma in Design",
    vacancy: 1,
    gender: "Any",
    jobTime: "Full Time",
    responsibilities: "Create visual assets for marketing campaigns. Design UI elements for web and mobile applications. Maintain brand consistency across all materials.",
    status: "pending",
    companyName: "DesignHub Studio",
    companyEmail: "info@designhub.co",
    interviewContact: "Kiran - 9012345678",
    postedAt: "2026-03-16",
  },
  {
    id: "6",
    position: "HR Executive",
    location: "Chennai",
    salaryRange: "₹4,00,000 – ₹6,00,000",
    experience: "2-4 years",
    qualification: "MBA HR",
    vacancy: 1,
    gender: "Any",
    jobTime: "Full Time",
    responsibilities: "Handle end-to-end recruitment. Manage employee onboarding and offboarding. Administer payroll and employee benefits.",
    status: "pending",
    companyName: "PeopleFirst Corp",
    companyEmail: "careers@peoplefirst.com",
    interviewContact: "Sunita - 9345678901",
    postedAt: "2026-03-16",
  },
];

export const mockCandidates: Candidate[] = [
  {
    id: "c1",
    fullName: "Arjun Sharma",
    email: "arjun@example.com",
    gender: "Male",
    dob: "1995-06-15",
    mobile: "9876543210",
    city: "Mumbai",
    education: "B.Tech Computer Science",
    experience: "4 years",
    currentDesignation: "Software Developer",
    lastSalary: "₹7,00,000",
    expectedSalary: "₹10,00,000",
    jobInterests: ["Technology", "Engineering"],
    registeredAt: "2026-03-01",
  },
  {
    id: "c2",
    fullName: "Radha Patel",
    email: "radha@example.com",
    gender: "Female",
    dob: "1998-02-20",
    mobile: "9123456789",
    city: "Delhi",
    education: "MBA Marketing",
    experience: "2 years",
    currentDesignation: "Marketing Associate",
    lastSalary: "₹4,50,000",
    expectedSalary: "₹6,00,000",
    jobInterests: ["Marketing", "Sales"],
    registeredAt: "2026-03-05",
  },
];

export const mockApplications: Application[] = [
  {
    id: "a1",
    candidateId: "c1",
    jobId: "1",
    candidateName: "Arjun Sharma",
    position: "Full Stack Developer",
    appliedAt: "2026-03-11",
    status: "shortlisted",
  },
  {
    id: "a2",
    candidateId: "c1",
    jobId: "3",
    candidateName: "Arjun Sharma",
    position: "Marketing Executive",
    appliedAt: "2026-03-14",
    status: "applied",
  },
];
