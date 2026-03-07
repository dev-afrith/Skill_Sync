// Admin-level data: faculty list, department stats, system info

export const FACULTY_MEMBERS = [
    { id: "f1", name: "Dr. Sarah Smith", email: "sarahsmith.faculty@skillsync.com", dept: "Computer Science", courses: ["Data Structures", "DBMS"], avatar: "S", avatarColor: "#6366f1", status: "Active" },
    { id: "f2", name: "Prof. Raj Kumar", email: "rajkumar.faculty@skillsync.com", dept: "Mathematics", courses: ["Discrete Math", "Linear Algebra"], avatar: "R", avatarColor: "#a855f7", status: "Active" },
    { id: "f3", name: "Dr. Priya Nair", email: "priyanair.faculty@skillsync.com", dept: "Computer Science", courses: ["Networks", "OS"], avatar: "P", avatarColor: "#10b981", status: "Active" },
    { id: "f4", name: "Prof. Anil Sharma", email: "anilsharma.faculty@skillsync.com", dept: "Electronics", courses: ["Digital Circuits", "Microprocessors"], avatar: "A", avatarColor: "#f59e0b", status: "Inactive" },
];

export const DEPARTMENTS = [
    { name: "Computer Science", students: 180, avgPerf: 71, retention: 91, atRisk: 12, color: "#6366f1" },
    { name: "Electronics", students: 120, avgPerf: 68, retention: 87, atRisk: 18, color: "#a855f7" },
    { name: "Mathematics", students: 95, avgPerf: 73, retention: 93, atRisk: 8, color: "#10b981" },
    { name: "Mechanical", students: 145, avgPerf: 64, retention: 83, atRisk: 24, color: "#f59e0b" },
];

export const RETENTION_TREND = [
    { sem: "Sem 1", rate: 97, dropout: 3 },
    { sem: "Sem 2", rate: 95, dropout: 5 },
    { sem: "Sem 3", rate: 91, dropout: 9 },
    { sem: "Sem 4", rate: 88, dropout: 12 },
    { sem: "Sem 5", rate: 87, dropout: 13 },
    { sem: "Sem 6", rate: 89, dropout: 11 },
];

export const CURRICULUM_RADAR = [
    { skill: "Programming", curriculum: 85, industry: 90 },
    { skill: "Data Science", curriculum: 55, industry: 88 },
    { skill: "Cloud", curriculum: 40, industry: 85 },
    { skill: "AI/ML", curriculum: 35, industry: 92 },
    { skill: "DevOps", curriculum: 30, industry: 78 },
    { skill: "Databases", curriculum: 80, industry: 82 },
    { skill: "Networking", curriculum: 70, industry: 75 },
];

export const SKILL_GAP_BAR = [
    { subject: "Programming", demand: 90, readiness: 85, gap: 5 },
    { subject: "Data Science", demand: 88, readiness: 55, gap: 33 },
    { subject: "Cloud Arch", demand: 85, readiness: 40, gap: 45 },
    { subject: "AI / ML", demand: 92, readiness: 35, gap: 57 },
    { subject: "DevOps", demand: 78, readiness: 30, gap: 48 },
    { subject: "Cybersec", demand: 80, readiness: 50, gap: 30 },
];

export const AI_RECOMMENDATIONS = [
    { type: "Add", text: "Add a dedicated Data Analytics module — improves industry alignment by 18%.", impact: "+18%" },
    { type: "Upgrade", text: "Upgrade Programming II syllabus to include TypeScript and modern frameworks.", impact: "+12%" },
    { type: "Add", text: "Introduce Cloud Computing (AWS/GCP) as a core elective in Year 3.", impact: "+15%" },
    { type: "Remove", text: "Remove Cobol fundamentals — industry relevance score: 2/10.", impact: "Saves 30hrs" },
    { type: "Add", text: "Add DevOps & CI/CD pipeline module — demand increased 45% (last 12 months).", impact: "+22%" },
];

export const SYSTEM_STATS = {
    totalActiveUsers: 312,
    serverHealth: 98.7,
    uptime: "99.9%",
    totalLogins24h: 147,
    apiResponseMs: 142,
    storageUsedPct: 43,
    errorRate: 0.3,
};

export const RECENT_LOGINS = [
    { name: "Dr. Sarah Smith", role: "FACULTY", time: "01:01 AM", status: "Success" },
    { name: "Admin User", role: "ADMIN", time: "12:58 AM", status: "Success" },
    { name: "Aarav Sharma", role: "STUDENT", time: "12:45 AM", status: "Success" },
    { name: "Unknown IP", role: "—", time: "12:40 AM", status: "Failed" },
    { name: "Priya Mehta", role: "STUDENT", time: "12:33 AM", status: "Success" },
    { name: "Prof. Raj Kumar", role: "FACULTY", time: "12:20 AM", status: "Success" },
];

export type FacultyMember = typeof FACULTY_MEMBERS[number];
