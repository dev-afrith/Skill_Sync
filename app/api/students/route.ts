import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const students = await prisma.user.findMany({
            where: { role: "STUDENT" },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
            }
        });

        // Map to match the expected structure in FacultyDashboard/mockData if needed
        // For now, let's just return them. 
        // We'll add default fields to match mockData's structure.
        const mappedStudents = students.map(s => ({
            ...s,
            roll: `CSE${s.id.slice(-3).toUpperCase()}`, // fallback roll
            attendance: 0,
            performance: 0,
            risk: "Low",
            avatar: s.name ? s.name.charAt(0).toUpperCase() : "?",
            avatarColor: "#6366f1",
            skillGaps: [],
        }));

        return NextResponse.json(mappedStudents);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 });
    }
}
