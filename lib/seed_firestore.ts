import dotenv from "dotenv";
dotenv.config();
import { db } from "./lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import bcrypt from "bcryptjs";

const SUBJECTS = [
    "Numerical Methods",
    "Database Management System",
    "Embedded Systems",
    "Design and Analysis of Algorithm",
    "Software Engineering"
];

async function seedFirestoreUsers() {
    console.log("Seeding Firestore users...");
    const hashedPassword = await bcrypt.hash("password123", 10);

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

    for (const user of users) {
        await setDoc(doc(db, "users", user.id), {
            ...user,
            createdAt: serverTimestamp()
        });
        console.log(`Seeded: ${user.email}`);
    }

    console.log("Firestore seeding complete.");
}

seedFirestoreUsers().catch(console.error);
