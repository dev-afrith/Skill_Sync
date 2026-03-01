"use client";

import { DEPARTMENTS } from "@/lib/adminData";
import {
    ResponsiveContainer, LineChart, Line, BarChart, Bar,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from "recharts";
import { TrendingUp, Users, BookOpen, Activity, ArrowUpRight, ArrowDownRight } from "lucide-react";

// Helper for theme variables
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

const TT = { contentStyle: { backgroundColor: V.surface, border: `1px solid ${V.border}`, borderRadius: "10px", color: V.text, fontSize: "0.83rem" } };
const CARD: React.CSSProperties = { background: V.card, border: `1px solid ${V.border}`, borderRadius: "18px", padding: "24px", transition: "all 0.3s" };

// Mock System Data
const PERFORMANCE_TREND = [
    { month: "Aug", perf: 72, att: 85 },
    { month: "Sep", perf: 74, att: 88 },
    { month: "Oct", perf: 75, att: 86 },
    { month: "Nov", perf: 78, att: 90 },
    { month: "Dec", perf: 81, att: 92 },
];

export default function AnalyticsPage() {
    // Sort departments for top/bottom
    const sortedDepts = [...DEPARTMENTS].sort((a, b) => b.avgPerf - a.avgPerf);
    const topDepts = sortedDepts.slice(0, 2);
    const bottomDepts = sortedDepts.slice(-2);

    return (
        <div style={{ maxWidth: "1300px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "28px" }}>
            {/* Header */}
            <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: V.accent, display: "inline-block" }} />
                    <span style={{ color: V.accent, fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Admin · Core Metrics</span>
                </div>
                <h1 style={{ fontSize: "1.9rem", fontWeight: 900, color: V.text, margin: 0 }}>
                    System-Wide {" "}
                    <span style={{ background: "linear-gradient(135deg,#6366f1,#a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Analytics</span>
                </h1>
                <p style={{ color: V.dim, marginTop: "6px", fontSize: "0.88rem" }}>Track overall academic performance, attendance trends, and department KPIs.</p>
            </div>

            {/* General KPIs */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "16px" }}>
                {[
                    { label: "Active Students", value: "3,482", trend: "+45 this month", color: "#10b981", icon: Users },
                    { label: "Overall System GPA", value: "7.8/10", trend: "+0.2 from last sem", color: "#6366f1", icon: Activity },
                    { label: "Avg Attendance", value: "88%", trend: "-2% from last week", color: "#f59e0b", icon: TrendingUp },
                    { label: "Course Completion", value: "64%", trend: "On schedule", color: "#a855f7", icon: BookOpen },
                ].map(c => (
                    <div key={c.label} style={{ ...CARD, display: "flex", alignItems: "center", gap: "16px", padding: "20px" }}>
                        <div style={{ width: 44, height: 44, borderRadius: "12px", background: `${c.color}15`, border: `1px solid ${c.color}30`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <c.icon size={22} color={c.color} />
                        </div>
                        <div>
                            <div style={{ fontSize: "1.6rem", fontWeight: 900, color: V.text, lineHeight: 1.2 }}>{c.value}</div>
                            <div style={{ fontSize: "0.78rem", color: V.dim, fontWeight: 600 }}>{c.label}</div>
                            <div style={{ fontSize: "0.7rem", color: V.muted, marginTop: "2px" }}>{c.trend}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                {/* Performance & Attendance trends */}
                <div style={CARD}>
                    <h3 style={{ fontWeight: 800, color: V.text, fontSize: "1rem", margin: "0 0 4px" }}>Performance & Attendance Trends</h3>
                    <p style={{ fontSize: "0.8rem", color: V.dim, margin: "0 0 24px" }}>System-wide monthly averages</p>
                    <ResponsiveContainer width="100%" height={280}>
                        <LineChart data={PERFORMANCE_TREND} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.2)" vertical={false} />
                            <XAxis dataKey="month" tick={{ fill: "gray", fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis domain={[40, 100]} tick={{ fill: "gray", fontSize: 11 }} axisLine={false} tickLine={false} />
                            <Tooltip {...TT} />
                            <Legend wrapperStyle={{ fontSize: "0.75rem", color: "gray", marginTop: "10px" }} />
                            <Line type="monotone" dataKey="perf" name="Avg Performance (%)" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: "#6366f1" }} />
                            <Line type="monotone" dataKey="att" name="Avg Attendance (%)" stroke="#f59e0b" strokeWidth={3} strokeDasharray="5 5" dot={{ r: 4, fill: "#f59e0b" }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Department comparison */}
                <div style={CARD}>
                    <h3 style={{ fontWeight: 800, color: V.text, fontSize: "1rem", margin: "0 0 4px" }}>Department-wise Comparison</h3>
                    <p style={{ fontSize: "0.8rem", color: V.dim, margin: "0 0 24px" }}>Average performance vs attendance per department</p>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={DEPARTMENTS} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.2)" vertical={false} />
                            <XAxis dataKey="name" tickFormatter={(val) => val.split(' ')[0]} tick={{ fill: "gray", fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis domain={[0, 100]} tick={{ fill: "gray", fontSize: 11 }} axisLine={false} tickLine={false} />
                            <Tooltip {...TT} />
                            <Legend wrapperStyle={{ fontSize: "0.75rem", color: "gray", marginTop: "10px" }} />
                            <Bar dataKey="avgPerf" name="Performance %" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={16} />
                            <Bar dataKey="retention" name="Attendance %" fill="#10b981" radius={[4, 4, 0, 0]} barSize={16} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Top / Bottom Departments */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <div style={CARD}>
                    <h3 style={{ fontWeight: 800, color: V.text, fontSize: "1rem", margin: "0 0 16px", display: "flex", alignItems: "center", gap: 8 }}>
                        <ArrowUpRight color="#10b981" size={20} /> Top Performing Departments
                    </h3>
                    {topDepts.map(d => (
                        <div key={d.name} style={{ padding: "12px", borderBottom: `1px solid ${V.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div>
                                <div style={{ color: V.text, fontWeight: 700, fontSize: "0.9rem" }}>{d.name}</div>
                                <div style={{ color: V.dim, fontSize: "0.75rem", marginTop: 2 }}>{d.students} Students</div>
                            </div>
                            <div style={{ textAlign: "right" }}>
                                <div style={{ color: "#10b981", fontWeight: 800, fontSize: "1.1rem" }}>{d.avgPerf}%</div>
                                <div style={{ color: V.dim, fontSize: "0.75rem" }}>Avg Score</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div style={CARD}>
                    <h3 style={{ fontWeight: 800, color: V.text, fontSize: "1rem", margin: "0 0 16px", display: "flex", alignItems: "center", gap: 8 }}>
                        <ArrowDownRight color="#ef4444" size={20} /> Bottom Performing Departments
                    </h3>
                    {bottomDepts.map(d => (
                        <div key={d.name} style={{ padding: "12px", borderBottom: `1px solid ${V.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div>
                                <div style={{ color: V.text, fontWeight: 700, fontSize: "0.9rem" }}>{d.name}</div>
                                <div style={{ color: V.dim, fontSize: "0.75rem", marginTop: 2 }}>{d.students} Students</div>
                            </div>
                            <div style={{ textAlign: "right" }}>
                                <div style={{ color: "#ef4444", fontWeight: 800, fontSize: "1.1rem" }}>{d.avgPerf}%</div>
                                <div style={{ color: V.dim, fontSize: "0.75rem" }}>Avg Score</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
