import { GoogleGenerativeAI } from "@google/generative-ai";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function generateSkillGapAnalysis(studentSkills: string[]) {
    try {
        const marketTrends = await prisma.jobMarketTrend.findMany({
            orderBy: { jobCount: "desc" },
            take: 10,
        });

        const marketSkills = marketTrends.map((t) => t.skillName);

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
      As an AI Career Advisor, analyze the following student skills and current job market trends.
      
      Student Skills:
      ${studentSkills.join(", ")}
      
      Market Demanded Skills (Trending):
      ${marketSkills.join(", ")}
      
      Based on this, provide:
      1. Missing High-Demand Skills: A list of skills the student should learn next.
      2. Career Recommendations: Potential roles the student is close to or should aim for.
      3. Learning Roadmap: A step-by-step guide (Step 1, Step 2, Step 3) to bridge the gap.
      
      Format the response as a JSON object with keys: "missingSkills", "careerRecommendations", and "roadmap" (as an array of strings).
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        // Clean up JSON if necessary (sometimes AI includes markdown blocks)
        text = text.replace(/```json|```/g, "").trim();

        return JSON.parse(text);
    } catch (error) {
        console.error("AI Skill Gap Analysis Error:", error);
        return {
            error: "Failed to generate recommendations",
            missingSkills: [],
            careerRecommendations: "Unable to provide recommendations at this time.",
            roadmap: ["Please try again later."]
        };
    }
}
