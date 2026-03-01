import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
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

const diag = async () => {
    try {
        console.log("Diag: Checking users...");
        const q = collection(db, "users");
        const snap = await getDocs(q);
        console.log(`Diag: Found ${snap.size} users.`);
        snap.forEach(doc => {
            const d = doc.data();
            console.log(`User: ${doc.id} | Role: ${d.role} | Has Password: ${!!d.password}`);
        });

        console.log("Diag: Checking students...");
        const sq = collection(db, "students");
        const sSnap = await getDocs(sq);
        console.log(`Diag: Found ${sSnap.size} students.`);
    } catch (e) {
        console.error("Diag failed:", e);
    }
};

diag().then(() => process.exit(0));
