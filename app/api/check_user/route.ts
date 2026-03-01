import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { getDoc, doc } from "firebase/firestore";
import bcrypt from "bcryptjs";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) return NextResponse.json({ error: "No email" });

    const userDoc = await getDoc(doc(db, "users", email));
    if (!userDoc.exists()) return NextResponse.json({ error: "Not found" });

    const user = userDoc.data();

    // Test the password logic exactly as authOptions does
    const isValid = await bcrypt.compare("password123", user.password);

    return NextResponse.json({
        id: userDoc.id,
        email: user.email,
        passwordHash: user.password,
        isValid,
        role: user.role
    });
}
