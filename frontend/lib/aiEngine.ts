export interface StudentData {
    id: string;
    name: string;
    email: string;
    roll?: string;
    avatar?: string;
    avatarColor?: string;
    subjects: { name: string; marks: number }[];
    attendance: number;
    skills: { name: string; level: number }[];
    testHistory: { exam: string; score: number; date: string }[];
}

export const calculateAIInsights = (student: StudentData, allStudents: StudentData[]) => {
    const subjects = student.subjects || [];
    const skills = student.skills || [];
    const testHistory = student.testHistory || [];

    // 1. Calculate Average Marks
    const avgMarks = subjects.reduce((acc, s) => acc + s.marks, 0) / (subjects.length || 1);

    // 2. Identify Weak Subjects
    const weakSubjects = subjects.filter(s => s.marks < 60).map(s => s.name);

    // 3. Detect Trends (Declining?)
    const latestScores = testHistory.slice(-3).map(t => t.score);
    const isDeclining = latestScores.length >= 2 && latestScores[latestScores.length - 1] < latestScores[0];

    // 4. Calculate Risk Score & Level
    let riskScore = 0;
    if (avgMarks < 60) riskScore += 40;
    if (student.attendance < 75) riskScore += 30;
    if (isDeclining) riskScore += 20;
    if (weakSubjects.length > 2) riskScore += 10;

    const riskLevel = riskScore > 70 ? "High" : riskScore > 30 ? "Medium" : "Low";

    // 5. Skill Gaps (Simulated comparison with "Demand")
    const industryDemand: Record<string, number> = {
        "React.js": 85,
        "Node.js": 80,
        "Python": 90,
        "AI/ML": 95,
    };

    const skillGaps = skills.filter(s => {
        const demand = industryDemand[s.name] || 70;
        return s.level < demand - 20;
    }).map(s => s.name);

    // 6. Academic Standing (Percentile)
    const allAverages = allStudents.map(s => {
        const subs = s.subjects || [];
        return subs.reduce((acc, sub) => acc + sub.marks, 0) / (subs.length || 1);
    }).sort((a, b) => a - b);

    const rank = allAverages.findIndex(v => v >= avgMarks);
    const percentile = (rank / (allAverages.length || 1)) * 100;

    // 7. Calculate CGPA (on 10.0 scale)
    const cgpa = parseFloat((avgMarks / 10).toFixed(2));

    // 8. Generate Mark-Driven Recommendations
    const recommendations: string[] = [];
    if (weakSubjects.length > 0) {
        recommendations.push(`Priority: Intensive focus required on ${weakSubjects.join(", ")} where scores are below 60%.`);
    }
    if (isDeclining) {
        recommendations.push("Warning: Recent test scores show a downward trend. Recommended: Peer tutoring or faculty consultation.");
    }
    if (student.attendance < 75) {
        recommendations.push(`Critical: Attendance is at ${student.attendance}%. Minimum 75% required to avoid academic probation.`);
    }
    if (avgMarks > 85 && !isDeclining) {
        recommendations.push("Excellence: Consistent high performance. Recommended: Explore advanced specialization or research projects.");
    }
    if (skillGaps.length > 0) {
        recommendations.push(`Skill Gap: Real-time industry demand is high for ${skillGaps.slice(0, 2).join(" & ")}. Focus on practical projects.`);
    }

    return {
        avgMarks,
        cgpa,
        riskLevel,
        riskScore,
        weakSubjects,
        skillGaps,
        percentile,
        isDeclining,
        recommendations: recommendations.length > 0 ? recommendations : ["Maintain current study plan and track weekly progress."],
    };
};
