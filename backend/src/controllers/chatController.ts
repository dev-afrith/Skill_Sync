import { Request, Response } from 'express';
import { GoogleGenerativeAI } from "@google/generative-ai";

export const chat = async (req: Request, res: Response) => {
    try {
        const { message, studentData } = req.body;

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ reply: "API Key Configuration Error" });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY.trim());
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        let contextPrompt = "";
        if (studentData && studentData.name) {
            contextPrompt = `
                The user is a student with the following profile:
                - Name: ${studentData.name}
                - Attendance: ${studentData.attendance}%
                - Subjects & Marks: ${JSON.stringify(studentData.subjects)}
                - Skills: ${JSON.stringify(studentData.skills)}
                - Test History: ${JSON.stringify(studentData.testHistory)}
            `;
        } else {
            contextPrompt = `The user is a Faculty member or Admin overseeing the SkillSync platform. Provide general assistance regarding platform features or academic management.`;
        }

        const prompt = `
            You are SkillSync AI, a smart academic assistant.
            ${contextPrompt}

            Guidelines:
            1. Be professional and helpful.
            2. If it's a student, offer encouragement and specific study tips based on their data.
            3. If it's faculty/admin, focus on platform utility and high-level insights.
            4. Keep responses concise and formatted for a chat bubble.

            User Question: "${message}"
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ reply: text });
    } catch (error: any) {
        console.error("Chat Error:", error);
        res.status(500).json({ reply: "I'm sorry, I encountered an error processing your request." });
    }
};
