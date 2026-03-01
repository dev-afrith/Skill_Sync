import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any)?.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const resolvedParams = await params;
        const id = resolvedParams.id;
        await prisma.user.delete({ where: { id } });

        return NextResponse.json({ message: "User deleted" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
    }
}
