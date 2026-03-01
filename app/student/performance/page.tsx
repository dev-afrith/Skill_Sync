"use client";

import { useSession } from "next-auth/react";
import {
    TrendingUp, Award, Clock, BookOpen, AlertTriangle, Brain, ChevronRight, Target
} from "lucide-react";
import {
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, LineChart, Line
} from "recharts";
import { STUDENTS } from "@/lib/mockData";
import { useState, useEffect } from "react";

/* ── Theme-aware tokens ── */
const V = {
    card: "var(--ds-card, rgba(255,255,255,0.025))",
    border: "var(--ds-border, rgba(255,255,255,0.06))",
    text: "var(--ds-text, #fff)",
    dim: "var(--ds-text-dim, #6b6b6b)",
    muted: "var(--ds-text-muted, #3a3a3a)",
    accent: "var(--ds-accent, #d4ff00)",
    accentSoft: "var(--ds-accent-soft, rgba(212,255,0,0.06))",
    accentBorder: "var(--ds-accent-border, rgba(212,255,0,0.12))",
    surface: "var(--ds-surface, #111)",
    hover: "var(--ds-hover, rgba(255,255,255,0.04))",
};
const FONT_H = "var(--font-display, 'Outfit', sans-serif)";

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

export default function StudentPerformancePage() {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(true);
    const [studentData, setStudentData] = useState<any>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            const userEmail = session?.user?.email;
            const found = STUDENTS.find(s => s.email === userEmail) || STUDENTS[0];
            setStudentData(found);
            setLoading(false);
        }, 800);
        return () => clearTimeout(timer);
    }, [session]);

    if (loading) {
        return (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "60vh", gap: 20 }}>
                <div style={{
                    width: 40, height: 40, border: `3px solid ${V.hover}`,
                    borderTop: `3px solid ${V.accent}`,
                    borderRadius: "50%", animation: "spin 1s linear infinite",
                }} />
                <p style={{ color: V.dim }}>Analyzing your academic trajectory...</p>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    if (!studentData) return <div>Error loading performance data.</div>;

    const subjectData = studentData.subjects.map((s: any) => ({ name: s.name, score: s.marks, full: s.total }));
    const historyData = [
        { name: "Test 1", score: 65, avg: 70 },
        { name: "Quiz 1", score: 82, avg: 72 },
        { name: "Midterm", score: 78, avg: 74 },
        { name: "Test 2", score: 85, avg: 75 },
        { name: "Quiz 2", score: 90, avg: 73 },
    ];

    return (
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Header */}
            <div>
                <h1 style={{ fontFamily: FONT_H, fontSize: "2rem", fontWeight: 900, marginBottom: 8, color: V.text, letterSpacing: "-0.04em" }}>
                    Performance <span className="text-gradient">Analytics</span>
                </h1>
                <p style={{ color: V.dim }}>Comprehensive breakdown of your academic standing and AI-driven growth metrics.</p>
            </div>

            {/* Top Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
                <div style={CARD}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                            <p style={{ color: V.dim, fontSize: "0.85rem", fontWeight: 600, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: FONT_H }}> OVERALL PERFORMANCE</p>
                            <h2 style={{ fontFamily: FONT_H, fontSize: "2.5rem", fontWeight: 900, margin: 0, color: V.text }}>{studentData.performance}%</h2>
                        </div>
                        <div style={{ background: V.accentSoft, border: `1px solid ${V.accentBorder}`, padding: 10, borderRadius: 12 }}>
                            <TrendingUp size={24} color={V.accent} />
                        </div>
                    </div>
                    <div style={{ marginTop: 16, height: 6, background: V.hover, borderRadius: 3, overflow: "hidden" }}>
                        <div style={{ width: `${studentData.performance}%`, height: "100%", background: V.accent, borderRadius: 3 }} />
                    </div>
                    <p style={{ color: "#10b981", fontSize: "0.8rem", marginTop: 12, fontWeight: 700 }}>+4.2% from last month</p>
                </div>

                <div style={CARD}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                            <p style={{ color: V.dim, fontSize: "0.85rem", fontWeight: 600, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: FONT_H }}>ATTENDANCE RATE</p>
                            <h2 style={{ fontFamily: FONT_H, fontSize: "2.5rem", fontWeight: 900, margin: 0, color: V.text }}>{studentData.attendance}%</h2>
                        </div>
                        <div style={{ background: "rgba(16, 185, 129, 0.08)", border: "1px solid rgba(16, 185, 129, 0.15)", padding: 10, borderRadius: 12 }}>
                            <Clock size={24} color="#10b981" />
                        </div>
                    </div>
                    <div style={{ marginTop: 16, display: "flex", gap: 4 }}>
                        {Array.from({ length: 12 }).map((_, i) => (
                            <div key={i} style={{ flex: 1, height: 18, background: i < 10 ? "#10b981" : V.hover, borderRadius: 3 }} />
                        ))}
                    </div>
                    <p style={{ color: V.dim, fontSize: "0.8rem", marginTop: 12 }}>Target: 85% • Status: <span style={{ color: "#10b981" }}>Healthy</span></p>
                </div>

                <div style={CARD}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                            <p style={{ color: V.dim, fontSize: "0.85rem", fontWeight: 600, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: FONT_H }}>ACADEMIC STANDING</p>
                            <h2 style={{ fontFamily: FONT_H, fontSize: "2.5rem", fontWeight: 900, margin: 0, color: V.text }}>Top 15%</h2>
                        </div>
                        <div style={{ background: "rgba(245, 158, 11, 0.08)", border: "1px solid rgba(245, 158, 11, 0.15)", padding: 10, borderRadius: 12 }}>
                            <Award size={24} color="#f59e0b" />
                        </div>
                    </div>
                    <p style={{ color: V.dim, fontSize: "0.85rem", marginTop: 12, lineHeight: 1.5 }}>
                        You are performing better than 85% of your cohort in CSE Year 2.
                    </p>
                </div>
            </div>

            {/* Charts */}
            <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 24 }}>
                <div style={CARD}>
                    <div style={{ marginBottom: 20 }}>
                        <h3 style={{ fontFamily: FONT_H, fontSize: "1.1rem", fontWeight: 800, margin: 0, display: "flex", alignItems: "center", gap: 8, color: V.text, letterSpacing: "-0.02em" }}>
                            <BookOpen size={18} color={V.accent} /> Subject-wise Performance
                        </h3>
                        <p style={{ color: V.muted, fontSize: "0.85rem", marginTop: 4 }}>Internal marks distribution across current semester modules</p>
                    </div>
                    <div style={{ height: 300, width: "100%" }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={subjectData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: V.muted, fontSize: 12 }} />
                                <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: V.muted, fontSize: 12 }} />
                                <Tooltip {...TT} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                                <Bar dataKey="score" radius={[6, 6, 0, 0]} barSize={40}>
                                    {subjectData.map((_: any, index: number) => (
                                        <Cell key={index} fill="#d4ff00" />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div style={CARD}>
                    <div style={{ marginBottom: 20 }}>
                        <h3 style={{ fontFamily: FONT_H, fontSize: "1.1rem", fontWeight: 800, margin: 0, display: "flex", alignItems: "center", gap: 8, color: V.text, letterSpacing: "-0.02em" }}>
                            <TrendingUp size={18} color={V.accent} /> Test Marks Trend
                        </h3>
                        <p style={{ color: V.muted, fontSize: "0.85rem", marginTop: 4 }}>Consistent improvement against class average</p>
                    </div>
                    <div style={{ height: 300, width: "100%" }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={historyData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: V.muted, fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: V.muted, fontSize: 12 }} />
                                <Tooltip {...TT} />
                                <Line type="monotone" dataKey="score" stroke="#d4ff00" strokeWidth={2.5} dot={{ r: 5, fill: "#d4ff00", strokeWidth: 2, stroke: "#0a0a0a" }} activeDot={{ r: 8 }} />
                                <Line type="monotone" dataKey="avg" stroke="rgba(255,255,255,0.15)" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Bottom Row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 24 }}>
                {/* Weak Subjects */}
                <div style={CARD}>
                    <h3 style={{ fontFamily: FONT_H, fontSize: "1.1rem", fontWeight: 800, marginBottom: 16, display: "flex", alignItems: "center", gap: 8, color: V.text, letterSpacing: "-0.02em" }}>
                        <AlertTriangle size={18} color="#ef4444" /> Areas for Improvement
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {studentData.weakSubjects.length > 0 ? (
                            studentData.weakSubjects.map((subject: string) => (
                                <div key={subject} style={{ background: "rgba(239, 68, 68, 0.04)", border: "1px solid rgba(239, 68, 68, 0.1)", borderRadius: 12, padding: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <div>
                                        <h4 style={{ margin: 0, fontWeight: 700, color: V.text }}>{subject}</h4>
                                        <p style={{ margin: "4px 0 0", fontSize: "0.75rem", color: V.dim }}>Current: {studentData.subjects.find((s: any) => s.name === subject)?.marks}% • Class Avg: 72%</p>
                                    </div>
                                    <button onClick={() => alert("Alert sent to faculty successfully!")} style={{ padding: "6px 12px", background: "#ef4444", border: "none", borderRadius: 8, color: "white", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer" }}>
                                        Get Help
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div style={{ textAlign: "center", padding: 32, color: "#10b981" }}>
                                <CheckCircleIcon />
                                <p>No weak subjects identified. Keep up the great work!</p>
                            </div>
                        )}
                        <div style={{ marginTop: 12, padding: 16, background: V.accentSoft, border: `1px solid ${V.accentBorder}`, borderRadius: 12 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                                <Target size={16} color={V.accent} />
                                <span style={{ fontSize: "0.85rem", fontWeight: 700, color: V.text }}>Skill Gap Detected</span>
                            </div>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                                {studentData.skillGaps.map((skill: string) => (
                                    <span key={skill} style={{ background: V.accentSoft, border: `1px solid ${V.accentBorder}`, color: V.accent, padding: "4px 10px", borderRadius: 6, fontSize: "0.75rem", fontWeight: 700 }}>
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* AI Recommendations */}
                <div style={CARD}>
                    <h3 style={{ fontFamily: FONT_H, fontSize: "1.1rem", fontWeight: 800, marginBottom: 16, display: "flex", alignItems: "center", gap: 8, color: V.text, letterSpacing: "-0.02em" }}>
                        <Brain size={18} color={V.accent} /> AI Recommendations
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {studentData.suggestions.map((suggestion: string, i: number) => (
                            <div key={i} style={{ display: "flex", gap: 12, padding: 16, background: V.accentSoft, borderRadius: 12, border: `1px solid ${V.accentBorder}` }}>
                                <div style={{ color: V.accent, fontWeight: 800, fontSize: "0.85rem", fontFamily: FONT_H }}>0{i + 1}</div>
                                <div style={{ flex: 1 }}>
                                    <p style={{ margin: 0, fontSize: "0.9rem", lineHeight: 1.5, color: V.text }}>{suggestion}</p>
                                </div>
                                <ChevronRight size={18} color={V.muted} style={{ alignSelf: "center" }} />
                            </div>
                        ))}
                    </div>
                    <button style={{
                        width: "100%", marginTop: 20, padding: 14,
                        background: V.accentSoft, border: `1px solid ${V.accentBorder}`,
                        borderRadius: 12, color: V.accent,
                        fontWeight: 700, cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                        fontFamily: FONT_H, fontSize: "0.9rem",
                        transition: "background 0.2s",
                    }}>
                        Generate Detailed Learning Plan <ArrowRightIcon />
                    </button>
                </div>
            </div>
        </div>
    );
}

function CheckCircleIcon() {
    return (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 12 }}>
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
    );
}

function ArrowRightIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
    );
}
