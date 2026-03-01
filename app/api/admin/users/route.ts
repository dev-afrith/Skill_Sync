import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import bcrypt from "bcryptjs";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, setDoc, deleteDoc, serverTimestamp, getDoc, query, where } from "firebase/firestore";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any)?.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const snapshot = await getDocs(collection(db, "users"));
        const users = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                name: data.name,
                email: data.email,
                role: data.role,
                department: data.department,
                createdAt: data.createdAt,
            };
        });

        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any)?.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();

        // ─── DELETION Logic ───
        if (body.action === "delete") {
            const { email } = body.payload;
            if (!email) return NextResponse.json({ error: "Email required for deletion." }, { status: 400 });

            await deleteDoc(doc(db, "users", email));
            return NextResponse.json({ success: true, message: `Account ${email} deleted.` });
        }

        // ─── CREATION Logic ───
        const { payload } = body;
        const { name, email, role, department, registerNumber, subject } = payload;

        if (!email || !name) {
            return NextResponse.json({ error: "Name and email required." }, { status: 400 });
        }

        const cleanEmail = email.trim().toLowerCase();
        const userRef = doc(db, "users", cleanEmail);

        // Pre-validation: Check if email already exists
        const existingDoc = await getDoc(userRef);
        if (existingDoc.exists()) {
            return NextResponse.json({ error: "A user with this email already exists." }, { status: 400 });
        }

        const dataToSave: any = {
            id: cleanEmail,
            name,
            email: cleanEmail,
            role,
            department,
            createdAt: serverTimestamp()
        };

        if (role === "STUDENT") {
            if (!registerNumber) return NextResponse.json({ error: "Register number required for Student." }, { status: 400 });

            // Pre-validation: Ensure register number is unique globally among students
            const q = query(collection(db, "users"), where("registerNumber", "==", registerNumber));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                return NextResponse.json({ error: "A student with this register number already exists." }, { status: 400 });
            }

            dataToSave.registerNumber = registerNumber;
            dataToSave.assignedFacultyIds = [];
        }

        if (role === "FACULTY") {
            dataToSave.subject = subject;
        }

        const hashedPassword = await bcrypt.hash("password123", 10);
        dataToSave.password = hashedPassword;

        await setDoc(userRef, dataToSave);

        return NextResponse.json({ success: true, user: { ...dataToSave, password: "[HIDDEN]" } });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Failed to process request" }, { status: 500 });
    }
}
