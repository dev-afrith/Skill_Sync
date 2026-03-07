"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { BarChart2, TrendingUp, AlertTriangle } from "lucide-react";
import {
    ResponsiveContainer, LineChart, Line, BarChart, Bar,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    PieChart, Pie, Cell
} from "recharts";

import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";

// ─── Theme-aware tokens ─────────────────────────────────────────────────────
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
    searchBg: "var(--ds-search-bg, #ffffff)",
};
const FONT_H = "var(--font-display, 'Outfit', sans-serif)";

const CLASS_TREND = [
    { week: "Week 1", avg: 63, high: 82, low: 41 },
    { week: "Week 2", avg: 65, high: 84, low: 43 },
    { week: "Week 3", avg: 67, high: 85, low: 40 },
    { week: "Week 4", avg: 69, high: 88, low: 42 },
    { week: "Week 5", avg: 70, high: 90, low: 41 },
    { week: "Week 6", avg: 70, high: 94, low: 41 },
];

const SUBJECT_AVG = [
    { subject: "Math", avg: 70, classTarget: 75 },
    { subject: "DS", avg: 68, classTarget: 75 },
    { subject: "DBMS", avg: 73, classTarget: 75 },
    { subject: "Networks", avg: 63, classTarget: 75 },
    { subject: "OS", avg: 68, classTarget: 75 },
];

const CARD: React.CSSProperties = {
    background: V.card, border: `1px solid ${V.border}`,
    borderRadius: "16px", padding: "24px",
    transition: "background 0.3s, border-color 0.3s",
};

const TT = {
    contentStyle: {
        backgroundColor: V.surface, border: `1px solid ${V.border}`,
        borderRadius: "10px", color: V.text, fontSize: "0.85rem",
        fontFamily: "var(--font-body, 'Space Grotesk', sans-serif)",
    },
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

export default function PerformanceAnalyticsPage() {
    const { data: session } = useSession();
    const teacherEmail = session?.user?.email;

    const [dbStudents, setDbStudents] = useState<any[]>([]);

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
                risk: (s.attendance < 75 || avg < 60) ? "High" : avg < 75 ? "Medium" : "Low",
            };
        });

    const atRisk = MY_STUDENTS.filter((s) => s.risk === "High").length;
    const medRisk = MY_STUDENTS.filter((s) => s.risk === "Medium").length;

    const riskPie = [
        { name: "Low Risk", value: MY_STUDENTS.filter(s => s.risk === "Low").length, color: "#10b981" },
        { name: "Medium Risk", value: medRisk, color: "#f59e0b" },
        { name: "High Risk", value: atRisk, color: "#ef4444" },
    ];

    return (
        <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", flexDirection: "column", gap: 32 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: V.accent, boxShadow: `0 0 8px ${V.accent}`, display: "inline-block" }} />
                <span style={{ color: V.accent, fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: FONT_H }}>
                    Performance Analytics
                </span>
            </div>
            <h1 style={{ fontFamily: FONT_H, fontSize: "1.9rem", fontWeight: 900, letterSpacing: "-0.03em", color: V.text, margin: 0, marginTop: "-20px" }}>
                Class Analytics Overview
            </h1>
            <p style={{ color: V.dim, marginTop: "-24px", fontSize: "0.9rem", marginBottom: 10 }}>
                Analyze trends, subject performance, and overall risk distribution across your assigned classes.
            </p>

            <SectionTitle icon={BarChart2} label="Class Performance Analytics" sub="AI-tracked weekly trends and subject distribution" />

            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 20 }}>
                {/* Line chart — Class trend */}
                <div style={CARD}>
                    <h3 style={{ fontFamily: FONT_H, margin: "0 0 4px", fontWeight: 800, color: V.text, fontSize: "0.95rem" }}>📈 Weekly Class Performance Trend</h3>
                    <p style={{ margin: "0 0 18px", fontSize: "0.78rem", color: V.dim }}>Average, highest and lowest student score per week</p>
                    <ResponsiveContainer width="100%" height={260}>
                        <LineChart data={CLASS_TREND} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                            <XAxis dataKey="week" tick={{ fill: V.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis domain={[30, 100]} tick={{ fill: V.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
                            <Tooltip {...TT} />
                            <Legend wrapperStyle={{ fontSize: "0.75rem", color: V.dim }} />
                            <Line type="monotone" dataKey="avg" name="Class Avg" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 3, fill: "#3b82f6" }} />
                            <Line type="monotone" dataKey="high" name="Top Score" stroke="#10b981" strokeWidth={1.5} strokeDasharray="5 3" dot={false} />
                            <Line type="monotone" dataKey="low" name="Bottom Score" stroke="#ef4444" strokeWidth={1.5} strokeDasharray="5 3" dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                    {/* Bar chart — Subject averages */}
                    <div style={CARD}>
                        <h3 style={{ fontFamily: FONT_H, margin: "0 0 4px", fontWeight: 800, color: V.text, fontSize: "0.95rem" }}>📊 Subject-wise Class Average</h3>
                        <p style={{ margin: "0 0 18px", fontSize: "0.78rem", color: V.dim }}>Average marks vs target (75%) per subject</p>
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={SUBJECT_AVG} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                                <XAxis dataKey="subject" tick={{ fill: V.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
                                <YAxis domain={[0, 100]} tick={{ fill: V.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
                                <Tooltip {...TT} />
                                <Legend wrapperStyle={{ fontSize: "0.75rem", color: V.dim }} />
                                <Bar dataKey="avg" name="Class Avg" fill="#3b82f6" radius={[5, 5, 0, 0]} barSize={20} />
                                <Bar dataKey="classTarget" name="Target" fill="#cbd5e1" radius={[5, 5, 0, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Pie chart — Risk distribution */}
                    <div style={CARD}>
                        <h3 style={{ fontFamily: FONT_H, margin: "0 0 4px", fontWeight: 800, color: V.text, fontSize: "0.95rem" }}>🎯 Risk Distribution</h3>
                        <p style={{ margin: "0 0 14px", fontSize: "0.78rem", color: V.dim }}>Student risk level breakdown</p>
                        <ResponsiveContainer width="100%" height={150}>
                            <PieChart>
                                <Pie data={riskPie} dataKey="value" cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3}>
                                    {riskPie.map((e, i) => <Cell key={i} fill={e.color} />)}
                                </Pie>
                                <Tooltip {...TT} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
                            {riskPie.map(r => (
                                <div key={r.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <span style={{ width: 10, height: 10, borderRadius: "50%", background: r.color, display: "inline-block" }} />
                                        <span style={{ fontSize: "0.8rem", color: V.dim }}>{r.name}</span>
                                    </div>
                                    <span style={{ fontWeight: 800, color: r.color, fontSize: "0.9rem" }}>{r.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
