import { initializeApp } from "firebase/app";
import { getFirestore, doc, writeBatch } from "firebase/firestore";
import bcrypt from "bcryptjs";

const firebaseConfig = {
    apiKey: "AIzaSyAU2haKp6T6Ij_9zN-RUdkhVIUuU0hV7eM",
    authDomain: "skillsync-932d8.firebaseapp.com",
    projectId: "skillsync-932d8",
    storageBucket: "skillsync-932d8.firebasestorage.app",
    messagingSenderId: "201549244922",
    appId: "1:201549244922:web:2d68911b3a3b7d8bef9c43"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const USERS_MOCK = [
    { name: "Admin User", email: "admin.admin@skillsync.com", role: "ADMIN" },
    { name: "Dr. Sarah Smith", email: "sarahsmith.faculty@skillsync.com", role: "FACULTY" },
    { name: "Prof. Raj Kumar", email: "rajkumar.faculty@skillsync.com", role: "FACULTY" },
    { name: "Aarav Sharma", email: "aaravsharma.student@skillsync.com", role: "STUDENT" },
    { name: "Priya Mehta", email: "priyamehta.student@skillsync.com", role: "STUDENT" },
    { name: "Rohan Das", email: "rohandas.student@skillsync.com", role: "STUDENT" },
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
        skills: [{ name: "React.js", level: 80 }],
        testHistory: [{ exam: "Midterm", score: 85, date: "2024-02-15" }],
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
        skills: [{ name: "Python", level: 70 }],
        testHistory: [{ exam: "Midterm", score: 60, date: "2024-02-15" }],
        roll: "CSE002",
        avatar: "PM",
        avatarColor: "#10b981"
    }
];

const run = async () => {
    try {
        console.log("Starting migration (Hardcoded)...");
        const batch = writeBatch(db);
        const password = await bcrypt.hash("password123", 10);

        USERS_MOCK.forEach(user => {
            console.log(`Adding user: ${user.email}`);
            const ref = doc(db, "users", user.email);
            batch.set(ref, { ...user, id: user.email, password });
        });

        STUDENTS_MOCK.forEach(s => {
            console.log(`Adding student: ${s.email}`);
            const ref = doc(db, "students", s.email);
            batch.set(ref, { ...s, userId: s.email });
        });

        await batch.commit();
        console.log("Migration Successful!");
    } catch (e: any) {
        console.error("Migration Failed:", e.message || e);
    }
};

run().then(() => process.exit(0));
