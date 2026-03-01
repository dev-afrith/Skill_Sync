import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp, getDocs, collection, deleteDoc } from "firebase/firestore";
import bcrypt from "bcryptjs";

const SUBJECTS = [
    "Numerical Methods",
    "Database Management System",
    "Embedded Systems",
    "Design and Analysis of Algorithm",
    "Software Engineering"
];

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Very basic security check - only allow seeding if explicitly requested with a secret
        // In a real app, this should be protected by admin session + a strong secret
        if (body.secret !== "skillsync-seed-2024") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        console.log("Seeding Firestore users via API...");
        const hashedPassword = await bcrypt.hash("password123", 10);

        // Optional: clear existing users before seeding if requested
        if (body.clear) {
            const snapshot = await getDocs(collection(db, "users"));
            for (const document of snapshot.docs) {
                await deleteDoc(doc(db, "users", document.id));
            }
            console.log("Cleared existing users.");
        }

        const users: any[] = [
            {
                id: "admin.admin@skillsync.com",
                name: "Admin User",
                email: "admin.admin@skillsync.com",
                password: hashedPassword,
                role: "ADMIN"
            }
        ];

        // Seed Faculty (1 for each subject)
        SUBJECTS.forEach((subject, i) => {
            const id = `faculty${i + 1}.faculty@skillsync.com`;
            users.push({
                id,
                name: `Dr. Faculty ${i + 1}`,
                email: id,
                password: hashedPassword,
                role: "FACULTY",
                subject: subject,
                department: "Computer Science"
            });
        });

        // Seed Students
        for (let i = 1; i <= 10; i++) {
            const email = `student${i}.student@skillsync.com`;
            users.push({
                id: email,
                name: `Student ${i}`,
                email: email,
                password: hashedPassword,
                role: "STUDENT",
                registerNumber: `REG2024CS${i.toString().padStart(2, '0')}`,
                department: "Computer Science",
                assignedFacultyIds: [
                    `faculty${(i % 5) + 1}.faculty@skillsync.com` // Distribute randomly among 5 faculty
                ],
                attendance: Math.floor(Math.random() * (100 - 65 + 1)) + 65, // 65-100 random attendance
            });
        }

        // Add general demo accounts
        users.push({
            id: "faculty.faculty@skillsync.com",
            name: "Demo Faculty",
            email: "faculty.faculty@skillsync.com",
            password: hashedPassword,
            role: "FACULTY",
            subject: "Software Engineering",
            department: "Computer Science"
        });
        users.push({
            id: "student.student@skillsync.com",
            name: "Demo Student",
            email: "student.student@skillsync.com",
            password: hashedPassword,
            role: "STUDENT",
            registerNumber: "REG2024CS00",
            department: "Computer Science",
            assignedFacultyIds: ["faculty.faculty@skillsync.com"],
            attendance: 88
        });

        let count = 0;
        for (const user of users) {
            await setDoc(doc(db, "users", user.id), {
                ...user,
                createdAt: serverTimestamp()
            });
            count++;
        }

        return NextResponse.json({ success: true, message: `Successfully seeded ${count} users.` });
    } catch (error: any) {
        console.error("Seeding error:", error);
        return NextResponse.json({ error: error.message || "Failed to seed" }, { status: 500 });
    }
}
