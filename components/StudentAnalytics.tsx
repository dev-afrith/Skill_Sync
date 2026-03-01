"use client";

import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, Legend
} from "recharts";
import type { Student } from "@/lib/mockData";
import {
    AlertTriangle, Brain, Zap, BookOpen, TrendingUp,
    ArrowLeft, CheckCircle
} from "lucide-react";
import Link from "next/link";
import { useStudentData } from "@/lib/hooks/useStudentData";
import { useSession } from "next-auth/react";

const V = {
    card: "var(--ds-card, #ffffff)",
    border: "var(--ds-border, #e2e8f0)",
    text: "var(--ds-text, #020617)",
    dim: "var(--ds-text-dim, #334155)",
    muted: "var(--ds-text-muted, #475569)",
    accent: "var(--ds-accent)",
    accentSoft: "var(--ds-accent-soft)",
    accentBorder: "var(--ds-accent-border)",
    hover: "var(--ds-hover)",
    surface: "var(--ds-surface)",
};

const CARD: React.CSSProperties = {
    background: V.card,
    border: `1px solid ${V.border}`,
    borderRadius: "16px",
    padding: "24px",
};

const riskStyle: Record<string, { color: string; bg: string }> = {
    Low: { color: "#10b981", bg: "rgba(16,185,129,0.1)" },
    Medium: { color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
    High: { color: "#ef4444", bg: "rgba(239,68,68,0.1)" },
};

const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
        <div style={{ background: V.surface, border: `1px solid ${V.border}`, borderRadius: "10px", padding: "10px 14px" }}>
            <p style={{ color: V.dim, fontSize: "0.8rem", marginBottom: 4 }}>{label}</p>
            {payload.map((p: any) => (
                <p key={p.dataKey} style={{ color: p.color, fontWeight: 700, fontSize: "0.9rem" }}>
                    {p.name}: {p.value}{p.dataKey?.includes("score") || p.dataKey === "marks" ? "" : ""}
                </p>
            ))}
        </div>
    );
};

export default function StudentAnalytics({ student: initialStudent }: { student?: any }) {
    const { data: session } = useSession();
    const { student, insights, loading } = useStudentData(initialStudent?.email || session?.user?.email);

    if (loading) return <div className="skeleton-analytics" style={{ color: V.text }}>Loading real-time insights...</div>;
    if (!student) return <div style={{ color: V.text }}>No real-time data found. Please run migration.</div>;

    const rc = riskStyle[insights.riskLevel];
    const classAvg = [72, 70, 75, 73, 68];

    const marksData = student.subjects.map((s: any) => ({
        subject: s.name.split(" ")[0],
        marks: s.marks,
        classAvg: classAvg[Math.floor(Math.random() * classAvg.length)],
        weak: s.marks < 60,
    }));

    const trendData = student.testHistory.map((t: any) => ({
        week: t.exam,
        score: t.score,
        classAvg: 70,
    }));

    return (
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            {/* Back */}
            <Link href="/dashboard/faculty" style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: V.dim, textDecoration: "none", fontSize: "0.9rem", marginBottom: "24px" }}>
                <ArrowLeft size={16} /> Back to Class Overview
            </Link>

            {/* Header */}
            <div style={{ ...CARD, display: "flex", alignItems: "center", gap: "24px", marginBottom: "24px", flexWrap: "wrap" }}>
                <div style={{ width: 72, height: 72, borderRadius: "50%", background: student.avatarColor || V.accentSoft, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: student.avatarColor ? "#000" : V.accent, fontSize: "1.8rem", flexShrink: 0 }}>
                    {student.avatar}
                </div>
                <div style={{ flex: 1 }}>
                    <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: V.text, margin: 0 }}>{student.name}</h1>
                    <div style={{ display: "flex", gap: "16px", marginTop: "8px", flexWrap: "wrap" }}>
                        <span style={{ color: V.dim, fontSize: "0.9rem" }}>Roll: <strong style={{ color: V.text }}>{student.roll}</strong></span>
                        <span style={{ color: V.dim, fontSize: "0.9rem" }}>Email: <strong style={{ color: V.text }}>{student.email}</strong></span>
                    </div>
                </div>
                <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                    {[
                        { label: "Attendance", value: `${student.attendance}%`, color: student.attendance >= 75 ? "#10b981" : "#ef4444" },
                        { label: "Performance", value: `${Math.round(insights.avgMarks)}%`, color: insights.avgMarks >= 75 ? "#10b981" : insights.avgMarks >= 55 ? "#f59e0b" : "#ef4444" },
                    ].map((m) => (
                        <div key={m.label} style={{ textAlign: "center", padding: "12px 20px", background: V.surface, borderRadius: "12px", border: `1px solid ${V.border}` }}>
                            <div style={{ fontSize: "1.5rem", fontWeight: 800, color: m.color }}>{m.value}</div>
                            <div style={{ fontSize: "0.75rem", color: V.dim, marginTop: "4px" }}>{m.label}</div>
                        </div>
                    ))}
                    <div style={{ textAlign: "center", padding: "12px 20px", background: rc.bg, borderRadius: "12px", border: `1px solid ${rc.color}30` }}>
                        <div style={{ fontSize: "1.1rem", fontWeight: 800, color: rc.color }}>{insights.riskLevel} Risk</div>
                        <div style={{ fontSize: "0.75rem", color: V.dim, marginTop: "4px" }}>AI Risk: {insights.riskScore}%</div>
                    </div>
                </div>
            </div>

            {/* Charts Row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
                {/* Bar Chart — Subject Marks */}
                <div style={CARD}>
                    <h3 style={{ margin: "0 0 6px", fontWeight: 700, color: V.text, fontSize: "1.05rem", display: "flex", alignItems: "center", gap: "8px" }}>
                        <BookOpen size={18} color={V.accent} /> Subject-wise Marks
                    </h3>
                    <p style={{ color: V.muted, fontSize: "0.8rem", marginBottom: "20px" }}>Highlights weak subjects in red</p>
                    <ResponsiveContainer width="100%" height={240}>
                        <BarChart data={marksData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.2)" vertical={false} />
                            <XAxis dataKey="subject" tick={{ fill: "gray", fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis domain={[0, 100]} tick={{ fill: "gray", fontSize: 11 }} axisLine={false} tickLine={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="marks" radius={[6, 6, 0, 0]} name="Marks">
                                {marksData.map((entry, index) => (
                                    <rect key={`bar-${index}`} fill={entry.weak ? "#ef4444" : V.accent} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                    <div style={{ display: "flex", gap: "16px", marginTop: "12px", fontSize: "0.75rem" }}>
                        <span style={{ color: V.accent }}>■ Good</span>
                        <span style={{ color: "#ef4444" }}>■ Weak (below 60)</span>
                    </div>
                </div>

                {/* Line Chart — Performance Trend */}
                <div style={CARD}>
                    <h3 style={{ margin: "0 0 6px", fontWeight: 700, color: V.text, fontSize: "1.05rem", display: "flex", alignItems: "center", gap: "8px" }}>
                        <TrendingUp size={18} color="#a855f7" /> Performance Trend
                    </h3>
                    <p style={{ color: V.muted, fontSize: "0.8rem", marginBottom: "20px" }}>Weekly scores vs class average</p>
                    <ResponsiveContainer width="100%" height={240}>
                        <LineChart data={trendData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.2)" vertical={false} />
                            <XAxis dataKey="week" tick={{ fill: "gray", fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis domain={[0, 100]} tick={{ fill: "gray", fontSize: 11 }} axisLine={false} tickLine={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend wrapperStyle={{ fontSize: "0.8rem", color: "gray" }} />
                            <Line type="monotone" dataKey="score" name="Student" stroke={V.accent} strokeWidth={2.5} dot={{ fill: V.accent, r: 4 }} activeDot={{ r: 6 }} />
                            <Line type="monotone" dataKey="classAvg" name="Class Avg" stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="5 5" dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Subjects detail table */}
            <div style={{ ...CARD, marginBottom: "24px" }}>
                <h3 style={{ margin: "0 0 20px", fontWeight: 700, color: V.text, fontSize: "1.05rem" }}>Detailed Subject Marks</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: "12px" }}>
                    {student.subjects.map((sub: any) => {
                        const weak = sub.marks < 60;
                        const pct = (sub.marks / 100) * 100;
                        return (
                            <div key={sub.name} style={{ padding: "16px", background: weak ? "rgba(239,68,68,0.05)" : V.hover, border: `1px solid ${weak ? "rgba(239,68,68,0.2)" : "transparent"}`, borderRadius: "12px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                                    <span style={{ fontSize: "0.85rem", fontWeight: 600, color: weak ? "#ef4444" : V.text }}>{sub.name}</span>
                                    {weak && <AlertTriangle size={14} color="#ef4444" />}
                                </div>
                                <div style={{ fontSize: "1.4rem", fontWeight: 800, color: weak ? "#ef4444" : "#10b981" }}>
                                    {sub.marks}<span style={{ fontSize: "0.85rem", color: V.muted, fontWeight: 500 }}>/100</span>
                                </div>
                                <div style={{ height: 4, background: V.border, borderRadius: 2, marginTop: 10, overflow: "hidden" }}>
                                    <div style={{ width: `${pct}%`, height: "100%", background: weak ? "#ef4444" : "#10b981", borderRadius: 2 }} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Bottom Row: Skill Gaps + AI Suggestions */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                {/* Weak subjects + Skill Gaps */}
                <div style={CARD}>
                    <h3 style={{ margin: "0 0 16px", fontWeight: 700, color: V.text, fontSize: "1.05rem", display: "flex", gap: "8px", alignItems: "center" }}>
                        <AlertTriangle size={18} color="#ef4444" /> Weak Areas & Skill Gaps
                    </h3>
                    {insights.weakSubjects.length > 0 && (
                        <>
                            <p style={{ color: V.dim, fontSize: "0.8rem", marginBottom: "10px" }}>Weak Subjects</p>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "20px" }}>
                                {insights.weakSubjects.map((ws: string) => (
                                    <span key={ws} style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444", padding: "4px 12px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: 700 }}>
                                        {ws}
                                    </span>
                                ))}
                            </div>
                        </>
                    )}
                    {insights.weakSubjects.length === 0 && (
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px", color: "#10b981" }}>
                            <CheckCircle size={16} /> No weak subjects — excellent performance!
                        </div>
                    )}
                    <p style={{ color: V.dim, fontSize: "0.8rem", marginBottom: "10px" }}>Identified Skill Gaps</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                        {insights.skillGaps.map((sg: string) => (
                            <span key={sg} style={{ background: V.accentSoft, color: V.accent, padding: "4px 12px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: 600 }}>
                                {sg}
                            </span>
                        ))}
                    </div>
                </div>

                {/* AI Suggestions */}
                <div style={CARD}>
                    <h3 style={{ margin: "0 0 16px", fontWeight: 700, color: V.text, fontSize: "1.05rem", display: "flex", gap: "8px", alignItems: "center" }}>
                        <Brain size={18} color="#a855f7" /> AI Improvement Suggestions
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        {[
                            insights.riskLevel === "High" ? "Immediate attention to weak subjects required." : "Maintain current trajectory.",
                            insights.skillGaps.length > 0 ? `Focus on closing gaps in: ${insights.skillGaps.join(", ")}` : "Skills are well-aligned with industry.",
                            "Review latest test feedback to identify conceptual gaps."
                        ].map((sug, i) => (
                            <div key={i} style={{ display: "flex", gap: "12px", padding: "12px", background: "rgba(168,85,247,0.05)", borderRadius: "10px", border: "1px solid rgba(168,85,247,0.1)" }}>
                                <div style={{ width: 24, height: 24, flexShrink: 0, borderRadius: "50%", background: "rgba(168,85,247,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 800, color: "#a855f7" }}>
                                    {i + 1}
                                </div>
                                <p style={{ fontSize: "0.85rem", color: V.dim, lineHeight: 1.5, margin: 0 }}>{sug}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
