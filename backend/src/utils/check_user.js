const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const { initializeApp } = require('firebase/app');
const { getFirestore, getDoc, doc } = require('firebase/firestore');

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function checkUser(email) {
    const userSnap = await getDoc(doc(db, 'users', email));
    if (userSnap.exists()) {
        console.log(`User ${email}:`, userSnap.data());
    } else {
        console.log(`User ${email} does not exist`);
    }
}

async function main() {
    await checkUser('aaravsharma.student@skillsync.com');
    await checkUser('admin.admin@skillsync.com');
}

main().catch(console.error);
