import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

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

const run = async () => {
    try {
        console.log("Diag: Checking users...");
        const uSnap = await getDocs(collection(db, "users"));
        console.log(`Diag: Found ${uSnap.size} users.`);
        uSnap.forEach(doc => {
            console.log(`User: ${doc.id} | Role: ${doc.data().role}`);
        });

        console.log("\nDiag: Checking students...");
        const sSnap = await getDocs(collection(db, "students"));
        console.log(`Diag: Found ${sSnap.size} students.`);
    } catch (e: any) {
        console.error("Diag Failed:", e.message || e);
    }
};

run().then(() => process.exit(0));
