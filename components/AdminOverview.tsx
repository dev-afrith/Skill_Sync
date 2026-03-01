"use client";

import { useState, useEffect } from "react";
import {
    Users, GraduationCap, BookOpen, TrendingUp, Award, AlertTriangle,
    Activity, Server, Clock, Shield, BarChart2, Brain, ArrowUpRight
} from "lucide-react";
import {
    ResponsiveContainer, LineChart, Line, BarChart, Bar,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell
} from "recharts";
import { DEPARTMENTS, RETENTION_TREND, FACULTY_MEMBERS, SYSTEM_STATS, RECENT_LOGINS } from "@/lib/adminData";
import { STUDENTS } from "@/lib/mockData";
import Link from "next/link";

/* ── All colors use CSS vars from chrome.css for theme support ── */
const V = {
    accent: "var(--ds-accent)",
    bg: "var(--ds-bg, #0a0a0a)",
    card: "var(--ds-card, rgba(255,255,255,0.025))",
    surface: "var(--ds-surface, #ffffff)",
    border: "var(--ds-border, rgba(255,255,255,0.06))",
    text: "var(--ds-text, #fff)",
    dim: "var(--ds-text-dim, #6b6b6b)",
    muted: "var(--ds-text-muted, #3a3a3a)",
    accentSoft: "var(--ds-accent-soft)",
    accentBorder: "var(--ds-accent-border)",
    hover: "var(--ds-hover, rgba(255,255,255,0.04))",
};

const CARD: React.CSSProperties = {
    background: V.card, border: `1px solid ${V.border}`,
    borderRadius: "16px", padding: "24px", transition: "background 0.3s, border-color 0.3s",
};

const TT = {
    contentStyle: {
        backgroundColor: V.surface, border: `1px solid ${V.border}`,
        borderRadius: "10px", color: V.text, fontSize: "0.82rem",
        fontFamily: "var(--font-body, 'Space Grotesk', sans-serif)",
    },
};

const FONT_H = "var(--font-display, 'Outfit', sans-serif)";

const HIGH_RISK = STUDENTS.filter(s => s.risk === "High").length;
const MED_RISK = STUDENTS.filter(s => s.risk === "Medium").length;
const LOW_RISK = STUDENTS.filter(s => s.risk === "Low").length;
const RISK_PIE = [
    { name: "Low", value: LOW_RISK, color: "#10b981" },
    { name: "Medium", value: MED_RISK, color: "#f59e0b" },
    { name: "High", value: HIGH_RISK, color: "#ef4444" },
];
const DEPT_PERF = DEPARTMENTS.map(d => ({ dept: d.name.split(" ")[0], avg: d.avgPerf, retention: d.retention }));

export default function AdminOverview({ adminName }: { adminName: string }) {
    const [dbStudents, setDbStudents] = useState<any[]>([]);
    useEffect(() => {
        fetch("/api/students").then(res => res.json()).then(data => {
            if (Array.isArray(data)) setDbStudents(data);
        });
    }, []);

    const totalStudents = dbStudents.length;

    const cards = [
        { label: "Total Students", value: totalStudents, sub: "Institution-wide", icon: Users },
        { label: "Faculty Members", value: FACULTY_MEMBERS.length, sub: "Active staff", icon: GraduationCap },
        { label: "Active Courses", value: 24, sub: "Across all departments", icon: BookOpen },
        { label: "Avg Performance", value: "70.5%", sub: "Institution average", icon: BarChart2 },
        { label: "Avg Attendance", value: "88%", sub: "All departments", icon: TrendingUp },
        { label: "Retention Rate", value: "89%", sub: "Current semester", icon: Award },
    ];

    const links = [
        { label: "Retention Analytics", href: "/dashboard/admin/analytics", icon: TrendingUp },
        { label: "Curriculum Alignment", href: "/dashboard/admin/curriculum", icon: BarChart2 },
        { label: "Student Allocation", href: "/dashboard/admin/allocation", icon: Users },
        { label: "User Management", href: "/dashboard/admin/users", icon: Shield },
        { label: "System Monitoring", href: "/dashboard/admin/monitoring", icon: Server },
    ];

    return (
        <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", flexDirection: "column", gap: 28 }}>
            {/* Header */}
            <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: V.accent, boxShadow: `0 0 10px ${V.accent}`, display: "inline-block" }} />
                    <span style={{ color: V.accent, fontSize: "0.72rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", fontFamily: FONT_H }}>Admin Control Panel</span>
                </div>
                <h1 style={{ fontFamily: FONT_H, fontSize: "1.9rem", fontWeight: 900, color: V.text, margin: 0, letterSpacing: "-0.04em" }}>
                    Welcome, <span style={{ color: V.accent }}>{adminName}</span>
                </h1>
                <p style={{ color: V.dim, marginTop: 6, fontSize: "0.85rem" }}>Institution-wide overview · AI risk models active</p>
            </div>

            {/* Summary Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
                {cards.map(c => (
                    <div key={c.label} style={{ ...CARD, display: "flex", alignItems: "center", gap: 14, padding: "18px 20px" }}>
                        <div style={{ width: 40, height: 40, borderRadius: 10, background: V.accentSoft, border: `1px solid ${V.accentBorder}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <c.icon size={18} color={V.accent} />
                        </div>
                        <div>
                            <div style={{ fontFamily: FONT_H, fontSize: "1.4rem", fontWeight: 900, color: V.text, lineHeight: 1, letterSpacing: "-0.03em" }}>{c.value}</div>
                            <div style={{ fontSize: "0.75rem", color: V.dim, marginTop: 3, fontWeight: 600 }}>{c.label}</div>
                            <div style={{ fontSize: "0.65rem", color: V.muted, marginTop: 1 }}>{c.sub}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Links */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 10 }}>
                {links.map(q => (
                    <Link key={q.label} href={q.href} style={{ ...CARD, textDecoration: "none", display: "flex", alignItems: "center", gap: 12, cursor: "pointer", padding: "16px 18px" }}>
                        <div style={{ width: 34, height: 34, borderRadius: 9, background: V.accentSoft, border: `1px solid ${V.accentBorder}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <q.icon size={16} color={V.accent} />
                        </div>
                        <span style={{ fontWeight: 700, color: V.text, fontSize: "0.82rem", flex: 1 }}>{q.label}</span>
                        <ArrowUpRight size={14} color={V.muted} />
                    </Link>
                ))}
            </div>

            {/* Charts */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {/* Risk Donut */}
                <div style={CARD}>
                    <h3 style={{ fontFamily: FONT_H, fontWeight: 800, color: V.text, fontSize: "0.92rem", margin: "0 0 14px", letterSpacing: "-0.02em" }}>Risk Distribution</h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                            <Pie data={RISK_PIE} dataKey="value" cx="50%" cy="50%" innerRadius={55} outerRadius={82} paddingAngle={3}>
                                {RISK_PIE.map((e, i) => <Cell key={i} fill={e.color} />)}
                            </Pie>
                            <Tooltip {...TT} />
                        </PieChart>
                    </ResponsiveContainer>
                    {RISK_PIE.map(r => (
                        <div key={r.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <span style={{ width: 8, height: 8, borderRadius: "50%", background: r.color, display: "inline-block" }} />
                                <span style={{ fontSize: "0.78rem", color: V.dim }}>{r.name} Risk</span>
                            </div>
                            <span style={{ fontWeight: 800, color: r.color, fontSize: "0.85rem" }}>{r.value}</span>
                        </div>
                    ))}
                    <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${V.border}`, fontSize: "0.72rem", color: V.muted }}>
                        {HIGH_RISK} students need immediate intervention
                    </div>
                </div>

                {/* Department Performance Chart */}
                <div style={CARD}>
                    <h3 style={{ fontFamily: FONT_H, fontWeight: 800, color: V.text, fontSize: "0.92rem", margin: "0 0 4px", letterSpacing: "-0.02em" }}>Department Performance</h3>
                    <p style={{ fontSize: "0.72rem", color: V.muted, margin: "0 0 14px" }}>Average performance score by department</p>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={DEPT_PERF} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.15)" vertical={false} />
                            <XAxis dataKey="dept" tick={{ fill: "gray", fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis domain={[0, 100]} tick={{ fill: "gray", fontSize: 11 }} axisLine={false} tickLine={false} />
                            <Tooltip {...TT} />
                            <Legend wrapperStyle={{ fontSize: "0.75rem", color: "gray" }} />
                            <Bar dataKey="avg" name="Avg Performance" fill={V.accent} radius={[5, 5, 0, 0]} barSize={20} />
                            <Bar dataKey="retention" name="Retention %" fill="#10b981" radius={[5, 5, 0, 0]} barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Bottom Row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {/* At-risk */}
                <div style={CARD}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                        <div>
                            <h3 style={{ fontFamily: FONT_H, fontWeight: 800, color: V.text, fontSize: "0.92rem", margin: 0, display: "flex", alignItems: "center", gap: 8, letterSpacing: "-0.02em" }}>
                                <AlertTriangle size={15} color="#ef4444" /> At-Risk Students
                            </h3>
                            <p style={{ fontSize: "0.72rem", color: V.muted, marginTop: 4 }}>Flagged by AI dropout prediction</p>
                        </div>
                        <Link href="/dashboard/admin/allocation" style={{ fontSize: "0.75rem", color: V.accent, fontWeight: 700, textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
                            Manage <ArrowUpRight size={12} />
                        </Link>
                    </div>
                    {STUDENTS.filter(s => s.risk !== "Low").map(s => {
                        const rc = s.risk === "High" ? "#ef4444" : "#f59e0b";
                        return (
                            <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", background: `${rc}06`, border: `1px solid ${rc}15`, borderRadius: 12, marginBottom: 8 }}>
                                <div style={{ width: 30, height: 30, borderRadius: 8, background: s.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.78rem", flexShrink: 0, fontFamily: FONT_H }}>{s.avatar}</div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 700, color: V.text, fontSize: "0.85rem" }}>{s.name}</div>
                                    <div style={{ fontSize: "0.7rem", color: V.muted }}>Performance: {s.performance}% · Attendance: {s.attendance}%</div>
                                </div>
                                <span style={{ background: `${rc}12`, color: rc, padding: "3px 10px", borderRadius: 20, fontSize: "0.68rem", fontWeight: 800 }}>● {s.risk}</span>
                            </div>
                        );
                    })}
                </div>

                {/* System Status */}
                <div style={CARD}>
                    <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between" }}>
                        <div>
                            <h3 style={{ fontFamily: FONT_H, fontWeight: 800, color: V.text, fontSize: "0.92rem", margin: 0, display: "flex", alignItems: "center", gap: 8, letterSpacing: "-0.02em" }}>
                                <Activity size={15} color="#10b981" /> System Status
                            </h3>
                            <p style={{ fontSize: "0.72rem", color: V.muted, marginTop: 4 }}>Health: {SYSTEM_STATS.serverHealth}% · Uptime: {SYSTEM_STATS.uptime}</p>
                        </div>
                        <Link href="/dashboard/admin/monitoring" style={{ fontSize: "0.75rem", color: V.accent, fontWeight: 700, textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
                            Details <ArrowUpRight size={12} />
                        </Link>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
                        {[
                            { label: "Server Health", value: `${SYSTEM_STATS.serverHealth}%`, color: "#10b981" },
                            { label: "Active Users", value: SYSTEM_STATS.totalActiveUsers, color: V.accent },
                            { label: "API Response", value: `${SYSTEM_STATS.apiResponseMs}ms`, color: V.accent },
                            { label: "Error Rate", value: `${SYSTEM_STATS.errorRate}%`, color: "#f59e0b" },
                        ].map(m => (
                            <div key={m.label} style={{ padding: "10px 14px", background: V.hover, borderRadius: 10, border: `1px solid ${V.border}` }}>
                                <div style={{ fontFamily: FONT_H, fontSize: "1.05rem", fontWeight: 800, color: m.color }}>{m.value}</div>
                                <div style={{ fontSize: "0.65rem", color: V.muted, marginTop: 2, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700 }}>{m.label}</div>
                            </div>
                        ))}
                    </div>
                    <div>
                        <div style={{ fontSize: "0.65rem", fontWeight: 800, color: V.muted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                            <Clock size={10} /> Recent Login Activity
                        </div>
                        {RECENT_LOGINS.map((l, i) => (
                            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 0", borderBottom: `1px solid ${V.border}` }}>
                                <div>
                                    <span style={{ fontSize: "0.82rem", color: V.text, fontWeight: 600 }}>{l.name}</span>
                                    <span style={{ marginLeft: 8, fontSize: "0.68rem", color: V.muted }}>{l.role}</span>
                                </div>
                                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                    <span style={{ fontSize: "0.7rem", color: V.muted }}>{l.time}</span>
                                    <span style={{ fontSize: "0.65rem", fontWeight: 800, color: l.status === "Failed" ? "#ef4444" : "#10b981", background: l.status === "Failed" ? "rgba(239,68,68,0.08)" : "rgba(16,185,129,0.08)", padding: "2px 8px", borderRadius: 5 }}>{l.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
