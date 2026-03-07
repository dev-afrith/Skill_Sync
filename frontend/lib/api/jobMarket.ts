import { API_BASE_URL } from "../config";

export interface JobTrend {
    id: string;
    skillName: string;
    jobCount: number;
    averageSalary: number;
    demandLevel: string;
    lastUpdated: string;
}

export interface SkillGapAnalysis {
    missingSkills: string[];
    careerRecommendations: string;
    roadmap: string[];
}

export async function fetchJobTrends(): Promise<JobTrend[]> {
    try {
        const res = await fetch(`${API_BASE_URL}/job-market-trends`);
        if (!res.ok) throw new Error("Failed to fetch trends");
        return await res.json();
    } catch (error) {
        console.error("fetchJobTrends error:", error);
        return [];
    }
}

export async function fetchSkillGapAnalysis(skills: string[]): Promise<SkillGapAnalysis> {
    try {
        const res = await fetch(`${API_BASE_URL}/skill-gap-analysis`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ skills }),
        });
        if (!res.ok) throw new Error("Failed to fetch analysis");
        return await res.json();
    } catch (error) {
        console.error("fetchSkillGapAnalysis error:", error);
        return {
            missingSkills: [],
            careerRecommendations: "Unable to load AI analysis.",
            roadmap: ["Refresh the page to try again."],
        };
    }
}
