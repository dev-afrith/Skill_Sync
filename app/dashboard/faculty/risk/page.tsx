"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { AlertTriangle, Brain } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import StudentDetailsModal from "@/components/StudentDetailsModal";

const V = {
    card: "var(--ds-card, rgba(255,255,255,0.025))",
    border: "var(--ds-border, rgba(255,255,255,0.06))",
    text: "var(--ds-text, #fff)",
    dim: "var(--ds-text-dim, #6b6b6b)",
    muted: "var(--ds-text-muted, #3a3a3a)",
    accent: "var(--ds-accent)",
    accentSoft: "var(--ds-accent-soft)",
    accentBorder: "var(--ds-accent-border)",
    hover: "var(--ds-hover, rgba(255,255,255,0.04))",
    surface: "var(--ds-surface, #ffffff)",
};
const FONT_H = "var(--font-display, 'Outfit', sans-serif)";

const RISK_CFG: Record<string, { color: string; bg: string }> = {
    Medium: { color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
    High: { color: "#ef4444", bg: "rgba(239,68,68,0.12)" },
};

function SectionTitle({ icon: Icon, label, sub }: { icon: any; color?: string; label: string; sub?: string }) {
    return (
        <div style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: V.accentSoft, border: `1px solid ${V.accentBorder}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon size={18} color={V.accent} />
                </div>
                <h2 style={{ fontFamily: FONT_H, fontSize: "1.1rem", fontWeight: 800, color: V.text, margin: 0, letterSpacing: "-0.02em" }}>{label}</h2>
            </div>
            {sub && <p style={{ fontSize: "0.82rem", color: V.dim, marginTop: 6, marginLeft: 46 }}>{sub}</p>}
        </div>
    );
}

export default function RiskMonitoringPage() {
    const { data: session } = useSession();
    const teacherEmail = session?.user?.email;

    const [dbStudents, setDbStudents] = useState<any[]>([]);

    const [showModal, setShowModal] = useState(false);
    const [isViewOnly, setIsViewOnly] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<any>(null);

    useEffect(() => {
        if (!teacherEmail) return;

        const q = query(
            collection(db, "users"),
            where("role", "==", "STUDENT"),
            where("assignedFacultyIds", "array-contains", teacherEmail)
        );

        const unsub = onSnapshot(q, (snap) => {
            const students = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            setDbStudents(students);
        });

        return () => unsub();
    }, [teacherEmail]);

    const MY_STUDENTS = dbStudents
        .map((s: any) => {
            const avg = s.subjects ? s.subjects.reduce((a: any, b: any) => a + (b.marks || 0), 0) / (s.subjects.length || 1) : 0;
            return {
                ...s,
                performance: Math.round(avg),
                risk: (s.attendance < 75 || avg < 60) ? "High" : avg < 75 ? "Medium" : "Low",
            };
        });

    const atRiskStudents = MY_STUDENTS.filter(s => s.risk === "High" || s.risk === "Medium");

    const handleSaveStudentDetails = (data: any) => {
        if (selectedStudent) {
            localStorage.setItem(`skillsync-student-data-${selectedStudent.email}`, JSON.stringify(data));
        }
    };

    return (
        <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", flexDirection: "column", gap: 32 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: V.accent, boxShadow: `0 0 8px ${V.accent}`, display: "inline-block" }} />
                <span style={{ color: V.accent, fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: FONT_H }}>
                    Faculty Dashboard — Intervention Tracking
                </span>
            </div>
            <h1 style={{ fontFamily: FONT_H, fontSize: "1.9rem", fontWeight: 900, letterSpacing: "-0.03em", color: V.text, margin: 0, marginTop: "-20px" }}>
                Risk Monitoring
            </h1>
            <p style={{ color: V.dim, marginTop: "-24px", fontSize: "0.9rem", marginBottom: 10 }}>
                Identify students who require immediate intervention based on AI-flagged risk factors.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                {/* At-risk alerts */}
                <div style={{ background: V.card, border: `1px solid ${V.border}`, borderRadius: "16px", padding: "24px" }}>
                    <SectionTitle icon={AlertTriangle} label="Immediate Action Required" sub="Students flagged by AI as high dropout risk" />

                    {atRiskStudents.length === 0 ? (
                        <div style={{ padding: "30px", textAlign: "center", color: V.muted, background: V.hover, borderRadius: 12, border: `1px dashed ${V.border}` }}>
                            <div style={{ fontSize: "2rem", marginBottom: 10 }}>🎉</div>
                            <h3 style={{ margin: 0, color: V.text, fontWeight: 700 }}>No At-Risk Students!</h3>
                            <p style={{ fontSize: "0.85rem", marginTop: 5 }}>All your assigned students are performing well above the threshold.</p>
                        </div>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            {atRiskStudents.map(s => {
                                const rc = RISK_CFG[s.risk];
                                return (
                                    <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", background: `${rc.color}08`, border: `1px solid ${rc.color}25`, borderRadius: 12, flexWrap: "wrap" }}>
                                        <div style={{ width: 34, height: 34, borderRadius: "50%", background: s.avatarColor || V.accentSoft, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, flexShrink: 0, color: V.accent }}>{s.avatar || s.name?.charAt(0)}</div>
                                        <div style={{ flex: 1 }}>
                                            <span
                                                onClick={() => { setSelectedStudent(s); setIsViewOnly(true); setShowModal(true); }}
                                                style={{ fontWeight: 700, color: V.text, cursor: "pointer", fontSize: "0.9rem" }}
                                            >
                                                {s.name}
                                            </span>
                                            <div style={{ fontSize: "0.75rem", color: V.dim }}>Performance: {s.performance}% · Attendance: {s.attendance}%</div>
                                        </div>
                                        <span style={{ background: rc.bg, color: rc.color, padding: "4px 11px", borderRadius: 20, fontSize: "0.72rem", fontWeight: 800 }}>● {s.risk}</span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* AI teaching insights */}
                <div style={{ background: V.card, border: `1px solid ${V.border}`, borderRadius: "16px", padding: "24px" }}>
                    <SectionTitle icon={Brain} label="AI Teaching Insights" sub="Auto-generated recommendations for your class" />
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {[
                            { tag: "Alert", text: "Networks subject average (63%) is below target. Consider a revision session on OSI Model & TCP/IP." },
                            { tag: "Insight", text: "3 of 6 students show upward performance trajectory — engagement strategies are working." },
                            { tag: "Action", text: "Rohan Das (CSE003) has declined 4% over 3 weeks. A one-on-one intervention is recommended." },
                            { tag: "Trend", text: "Attendance below 75% for 2 students — auto-alert sent to academic office." },
                        ].map((ins, i) => (
                            <div key={i} style={{ display: "flex", gap: 12, padding: "13px 15px", background: V.accentSoft, borderRadius: 10, border: `1px solid ${V.accentBorder}` }}>
                                <span style={{ background: V.accentBorder, color: V.accent, padding: "2px 8px", borderRadius: 5, fontSize: "0.65rem", fontWeight: 800, whiteSpace: "nowrap", alignSelf: "flex-start", marginTop: 2, fontFamily: FONT_H }}>{ins.tag}</span>
                                <p style={{ fontSize: "0.83rem", color: V.text, lineHeight: 1.55, margin: 0, opacity: 0.85 }}>{ins.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {showModal && <StudentDetailsModal onClose={() => { setShowModal(false); setSelectedStudent(null); setIsViewOnly(false); }} onSave={handleSaveStudentDetails} readOnly={isViewOnly} studentName={selectedStudent?.name} studentEmail={selectedStudent?.email} />}
        </div>
    );
}
