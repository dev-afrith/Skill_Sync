require('dotenv').config();
const { initializeApp, getApps, getApp } = require("firebase/app");
const { getFirestore, doc, setDoc, serverTimestamp } = require("firebase/firestore");
const bcrypt = require("bcryptjs");

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seedFirestoreUsers() {
    console.log("Seeding Firestore users...");
    const hashedPassword = await bcrypt.hash("password123", 10);

    const users = [
        {
            id: "admin.admin@skillsync.com",
            name: "Admin User",
            email: "admin.admin@skillsync.com",
            password: hashedPassword,
            role: "ADMIN"
        },
        {
            id: "sarahsmith.faculty@skillsync.com",
            name: "Dr. Sarah Smith",
            email: "sarahsmith.faculty@skillsync.com",
            password: hashedPassword,
            role: "FACULTY",
            subject: "Software Engineering",
            department: "Computer Science"
        },
        {
            id: "faculty.faculty@skillsync.com",
            name: "Faculty User",
            email: "faculty.faculty@skillsync.com",
            password: hashedPassword,
            role: "FACULTY"
        },
        {
            id: "aaravsharma.student@skillsync.com",
            name: "Aarav Sharma",
            email: "aaravsharma.student@skillsync.com",
            password: hashedPassword,
            role: "STUDENT",
            registerNumber: "REG2024CS01",
            department: "Computer Science",
            assignedFacultyIds: ["sarahsmith.faculty@skillsync.com"]
        },
        {
            id: "student.student@skillsync.com",
            name: "Student User",
            email: "student.student@skillsync.com",
            password: hashedPassword,
            role: "STUDENT"
        }
    ];

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
