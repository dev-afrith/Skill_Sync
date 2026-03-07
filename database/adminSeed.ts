import { db } from "./firebase";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
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

const subjects = [
    { id: "sub_nm", name: "Numerical Methods" },
    { id: "sub_dbms", name: "Database Management System" },
    { id: "sub_es", name: "Embedded Systems" },
    { id: "sub_daa", name: "Design and Analysis of Algorithm" },
    { id: "sub_se", name: "Software Engineering" },
];

const faculties = [
    { email: "dr.smith@skillsync.com", name: "Dr. Sarah Smith", role: "FACULTY", department: "Computer Science", subject: "Database Management System" },
    { email: "prof.rajkumar@skillsync.com", name: "Prof. Rajkumar", role: "FACULTY", department: "Computer Science", subject: "Design and Analysis of Algorithm" },
    { email: "dr.nair@skillsync.com", name: "Dr. Priya Nair", role: "FACULTY", department: "Electronics", subject: "Embedded Systems" },
    { email: "dr.sharma@skillsync.com", name: "Dr. Anil Sharma", role: "FACULTY", department: "Mathematics", subject: "Numerical Methods" },
    { email: "prof.williams@skillsync.com", name: "Prof. Williams", role: "FACULTY", department: "Information Technology", subject: "Software Engineering" },
];

const students = [
    { email: "aarav.s@skillsync.com", name: "Aarav Sharma", role: "STUDENT", department: "Computer Science", registerNumber: "REG001", assignedFacultyIds: ["dr.smith@skillsync.com", "prof.rajkumar@skillsync.com"] },
    { email: "priya.p@skillsync.com", name: "Priya Patel", role: "STUDENT", department: "Computer Science", registerNumber: "REG002", assignedFacultyIds: ["dr.smith@skillsync.com"] },
    { email: "rohan.v@skillsync.com", name: "Rohan Verma", role: "STUDENT", department: "Electronics", registerNumber: "REG003", assignedFacultyIds: ["dr.nair@skillsync.com"] },
    { email: "neha.g@skillsync.com", name: "Neha Gupta", role: "STUDENT", department: "Mathematics", registerNumber: "REG004", assignedFacultyIds: ["dr.sharma@skillsync.com"] },
    { email: "vikram.s@skillsync.com", name: "Vikram Singh", role: "STUDENT", department: "Information Technology", registerNumber: "REG005", assignedFacultyIds: ["prof.williams@skillsync.com"] },
];

const demoAccounts = [
    { email: "admin.admin@skillsync.com", name: "SkillSync Admin", role: "ADMIN", department: "Administration" },
    { email: "faculty.faculty@skillsync.com", name: "Demo Faculty", role: "FACULTY", department: "Computer Science", subject: "Numerical Methods" },
    { email: "student.student@skillsync.com", name: "Demo Student", role: "STUDENT", department: "Computer Science", registerNumber: "DEMO01", assignedFacultyIds: ["faculty.faculty@skillsync.com", "dr.smith@skillsync.com"] },
];

export const seedData = async () => {
    try {
        console.log("Checking environment...");
        if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
            throw new Error("Missing Firebase API Key. Check .env content.");
        }

        const hashedPassword = await bcrypt.hash("password123", 10);

        console.log("Seeding subjects...");
        for (const sub of subjects) {
            try {
                const subRef = doc(db, "subjects", sub.id);
                // Deep clone to strip undefined functions/prototypes just in case
                await setDoc(subRef, JSON.parse(JSON.stringify(sub)));
                console.log(`Successfully seeded subject ${sub.id}`);
            } catch (err: any) {
                console.error(`Failed to seed subject ${sub.id}:`, err.message);
            }
        }

        console.log("Seeding users...");
        const allUsers = [...faculties, ...students, ...demoAccounts];
        for (const user of allUsers) {
            try {
                const userRef = doc(db, "users", user.email);
                const rawData: any = {
                    id: user.email,
                    ...user,
                    password: hashedPassword,
                    // Do not JSON stringify the timestamp as it ruins the special FieldValue prototype
                    createdAt: serverTimestamp()
                };

                const data: any = {};
                // Safely copy properties one by one, ignoring undefined
                for (const key of Object.keys(rawData)) {
                    if (rawData[key] !== undefined) {
                        data[key] = rawData[key];
                    }
                }

                await setDoc(userRef, data);
                console.log(`Successfully seeded user ${user.email}`);
            } catch (err: any) {
                console.error(`Failed to seed user ${user.email} DATA:`, JSON.stringify(user));
                console.error(`ERROR MSG:`, err.message);
            }
        }

        console.log("Seeding complete!");
    } catch (error: any) {
        console.error("Seeding failed:", error.message || error);
        process.exit(1);
    }
};

seedData().then(() => process.exit(0)).catch((e) => {
    console.error(e);
    process.exit(1);
});
