import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/authOptions";
import { STUDENTS } from "@/lib/mockData";
import StudentTable from "@/components/StudentTable";
import "../styles.css";

export default async function FacultyPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    const role = (session.user as any)?.role;
    if (role === "STUDENT") redirect("/dashboard");

    return (
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
            {/* Page Header */}
            <div style={{ marginBottom: 32 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                    <div style={{
                        width: 10, height: 10, borderRadius: "50%",
                        background: "var(--ds-accent)",
                        boxShadow: "0 0 10px var(--ds-accent)",
                    }} />
                    <span style={{
                        color: "var(--ds-accent)",
                        fontSize: "0.85rem", fontWeight: 700,
                        textTransform: "uppercase", letterSpacing: "0.08em",
                        fontFamily: "var(--font-display, 'Outfit', sans-serif)",
                    }}>
                        Faculty View — AI Class Intelligence
                    </span>
                </div>
                <h1 style={{
                    fontFamily: "var(--font-display, 'Outfit', sans-serif)",
                    fontSize: "2rem", fontWeight: 900, letterSpacing: "-0.03em",
                    color: "var(--ds-text, #fff)",
                }}>
                    Class Overview — <span className="text-gradient">CSE Year 2</span>
                </h1>
                <p style={{ color: "var(--ds-text-dim, #6b6b6b)", marginTop: 8, fontSize: "0.95rem" }}>
                    Welcome, <strong style={{ color: "var(--ds-text, #fff)" }}>{session.user?.name}</strong> — AI risk analysis updated today at 00:07 IST
                </p>
            </div>

            {/* Student Table */}
            <div style={{
                background: "var(--ds-card, rgba(255,255,255,0.025))",
                border: "1px solid var(--ds-border, rgba(255,255,255,0.06))",
                borderRadius: 20, padding: 28,
            }}>
                <StudentTable students={STUDENTS} />
            </div>
        </div>
    );
}
