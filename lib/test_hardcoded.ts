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

const test = async () => {
    try {
        console.log("Testing with hardcoded config...");
        const q = collection(db, "users");
        console.log("Collection ref created.");
        const snap = await getDocs(q);
        console.log(`Success! Found ${snap.size} users.`);
    } catch (e: any) {
        console.error("Test failed:", e.message || e);
    }
};

test().then(() => process.exit(0));
