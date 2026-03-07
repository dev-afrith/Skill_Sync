import { db } from "./firebase";
import { doc, writeBatch } from "firebase/firestore";
import bcrypt from "bcryptjs";
import * as fs from "fs";
import * as path from "path";

// Manually load .env
const envPath = path.resolve(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf-8");
    envContent.split("\n").forEach(line => {
        const [key, ...valueParts] = line.split("=");
        if (key && valueParts.length > 0) {
            const value = valueParts.join("=").trim().replace(/^["']|["']$/g, '');
            process.env[key.trim()] = value;
        }
    });
}

const USERS_MOCK = [
    { name: "Admin User", email: "admin.admin@skillsync.com", role: "ADMIN" },
    { name: "Dr. Sarah Smith", email: "sarahsmith.faculty@skillsync.com", role: "FACULTY" },
    { name: "Prof. Raj Kumar", email: "rajkumar.faculty@skillsync.com", role: "FACULTY" },
    { name: "Dr. Priya Nair", email: "priyanair.faculty@skillsync.com", role: "FACULTY" },
    { name: "Prof. Anil Sharma", email: "anilsharma.faculty@skillsync.com", role: "FACULTY" },
    { name: "Aarav Sharma", email: "aaravsharma.student@skillsync.com", role: "STUDENT" },
    { name: "Priya Mehta", email: "priyamehta.student@skillsync.com", role: "STUDENT" },
    { name: "Rohan Das", email: "rohandas.student@skillsync.com", role: "STUDENT" },
    { name: "Sneha Iyer", email: "snehaiyer.student@skillsync.com", role: "STUDENT" },
    { name: "Kiran Patel", email: "kiranpatel.student@skillsync.com", role: "STUDENT" },
    { name: "Divya Nair", email: "divyanair.student@skillsync.com", role: "STUDENT" },
    { name: "John Doe", email: "johndoe.student@skillsync.com", role: "STUDENT" },
];

const STUDENTS_MOCK = [
    {
        name: "Aarav Sharma",
        email: "aaravsharma.student@skillsync.com",
        attendance: 92,
        subjects: [
            { name: "Mathematics", marks: 91 },
            { name: "Data Structures", marks: 87 },
            { name: "DBMS", marks: 85 },
            { name: "Networks", marks: 90 },
            { name: "OS", marks: 78 },
        ],
        skills: [
            { name: "React.js", level: 80 },
            { name: "Node.js", level: 65 },
            { name: "Python", level: 40 },
        ],
        testHistory: [
            { exam: "Test 1", score: 78, date: "2024-01-10" },
            { exam: "Quiz 1", score: 82, date: "2024-01-20" },
            { exam: "Midterm", score: 85, date: "2024-02-15" },
            { exam: "Test 2", score: 88, date: "2024-03-01" },
        ],
        roll: "CSE001",
        avatar: "AS",
        avatarColor: "#4f46e5"
    },
    {
        name: "Priya Mehta",
        email: "priyamehta.student@skillsync.com",
        attendance: 78,
        subjects: [
            { name: "Mathematics", marks: 55 },
            { name: "Data Structures", marks: 60 },
            { name: "DBMS", marks: 72 },
            { name: "Networks", marks: 58 },
            { name: "OS", marks: 65 },
        ],
        skills: [
            { name: "React.js", level: 40 },
            { name: "Node.js", level: 30 },
            { name: "Python", level: 70 },
        ],
        testHistory: [
            { exam: "Test 1", score: 55, date: "2024-01-10" },
            { exam: "Quiz 1", score: 58, date: "2024-01-20" },
            { exam: "Midterm", score: 60, date: "2024-02-15" },
            { exam: "Test 2", score: 62, date: "2024-03-01" },
        ],
        roll: "CSE002",
        avatar: "PM",
        avatarColor: "#10b981"
    },
    {
        name: "Rohan Das",
        email: "rohandas.student@skillsync.com",
        attendance: 55,
        subjects: [
            { name: "Mathematics", marks: 38 },
            { name: "Data Structures", marks: 42 },
            { name: "DBMS", marks: 45 },
            { name: "Networks", marks: 40 },
            { name: "OS", marks: 38 },
        ],
        skills: [
            { name: "React.js", level: 20 },
            { name: "Node.js", level: 10 },
            { name: "Python", level: 15 },
        ],
        testHistory: [
            { exam: "Test 1", score: 45, date: "2024-01-10" },
            { exam: "Quiz 1", score: 43, date: "2024-01-20" },
            { exam: "Midterm", score: 40, date: "2024-02-15" },
            { exam: "Test 2", score: 38, date: "2024-03-01" },
        ],
        roll: "CSE003",
        avatar: "RD",
        avatarColor: "#ef4444"
    }
];

const removeUndefined = (obj: any) => {
    Object.keys(obj).forEach(key => {
        if (obj[key] === undefined) {
            console.warn(`Removing undefined field: ${key}`);
            delete obj[key];
        }
    });
    return obj;
};

export const migrateData = async () => {
    try {
        console.log("Checking environment...");
        if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
            throw new Error("Missing Firebase API Key. Check .env content.");
        }

        const batch = writeBatch(db);
        const hashedPassword = await bcrypt.hash("password123", 10);

        console.log("Seeding users...");
        USERS_MOCK.forEach((u) => {
            const userRef = doc(db, "users", u.email);
            const data = removeUndefined({
                id: u.email,
                email: u.email,
                name: u.name,
                role: u.role,
                password: hashedPassword,
            });
            batch.set(userRef, data);
        });

        console.log("Seeding students...");
        STUDENTS_MOCK.forEach((student) => {
            const studentRef = doc(db, "students", student.email);
            const data = removeUndefined({
                userId: student.email,
                name: student.name,
                email: student.email,
                attendance: student.attendance,
                subjects: student.subjects,
                skills: student.skills,
                testHistory: student.testHistory,
                roll: student.roll,
                avatar: student.avatar,
                avatarColor: student.avatarColor
            });
            batch.set(studentRef, data);
        });

        console.log("Committing to Firestore...");
        await batch.commit();
        console.log("Migration complete!");
    } catch (error: any) {
        console.error("Migration failed:", error.message || error);
        process.exit(1);
    }
};

migrateData().then(() => process.exit(0)).catch((e) => {
    console.error(e);
    process.exit(1);
});
