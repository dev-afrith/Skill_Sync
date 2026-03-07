import { Request, Response } from 'express';
import prisma from '../models/prisma';

export const getStudents = async (req: Request, res: Response) => {
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

        const mappedStudents = students.map(s => ({
            ...s,
            roll: `CSE${s.id.slice(-3).toUpperCase()}`,
            attendance: 0,
            performance: 0,
            risk: "Low",
            avatar: s.name ? s.name.charAt(0).toUpperCase() : "?",
            avatarColor: "#6366f1",
            skillGaps: [],
        }));

        res.json(mappedStudents);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch students" });
    }
};
