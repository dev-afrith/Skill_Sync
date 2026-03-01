import dotenv from "dotenv";
dotenv.config();
import { db } from "./lib/firebase";
import { collection, getDocs } from "firebase/firestore";

async function checkUsers() {
    console.log("Checking Firestore 'users' collection...");
    const snapshot = await getDocs(collection(db, "users"));
    if (snapshot.empty) {
        console.log("No users found in Firestore!");
    } else {
        snapshot.docs.forEach(doc => {
            const data = doc.data();
            console.log(`User: ${data.email}, Role: ${data.role}, HasPassword: ${!!data.password}`);
        });
    }
}

checkUsers().catch(console.error);
