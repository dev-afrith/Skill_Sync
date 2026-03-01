import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const { name, email, password, role } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
        }

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role || "STUDENT",
            },
        });

        return NextResponse.json({
            message: "User created successfully",
            user: { id: user.id, email: user.email, name: user.name, role: user.role }
        }, { status: 201 });
    } catch (error: any) {
        console.error("Registration error:", error);
        return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
    }
}
