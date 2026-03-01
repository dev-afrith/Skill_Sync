import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
    try {
        const { message, studentData } = await req.json();
        console.log("Chat Request received. Message:", message);
        console.log("Student Data present:", !!studentData);

        if (!process.env.GEMINI_API_KEY) {
            console.error("GEMINI_API_KEY is missing from environment variables!");
            return NextResponse.json({ reply: "API Key Configuration Error" }, { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY.trim());
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const key = process.env.GEMINI_API_KEY.trim();
        console.log(`API Key Length: ${key.length}, Start: ${key.substring(0, 5)}`);
        const fs = require('fs');
        fs.appendFileSync('chat_error.log', `\nKey Length: ${key.length}, Start: ${key.substring(0, 5)}\n`);

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

        console.log("Using Context Prompt Type:", studentData && studentData.name ? "Student" : "General");

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

        return NextResponse.json({ reply: text });
    } catch (error: any) {
        const errorMsg = `\n[${new Date().toISOString()}] Chat Error: ${error.message || error}\nStack: ${error.stack}\n`;
        try {
            const fs = require('fs');
            fs.appendFileSync('chat_error.log', errorMsg);
        } catch (fileErr) {
            console.error("Failed to write to log file:", fileErr);
        }

        console.error("Chat Error Detail:", error.message || error);
        return NextResponse.json({ reply: "I'm sorry, I encountered an error processing your request." }, { status: 500 });
    }
}
