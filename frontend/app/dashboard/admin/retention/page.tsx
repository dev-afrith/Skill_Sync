"use client";

import { RETENTION_TREND, DEPARTMENTS } from "@/lib/adminData";
import { STUDENTS } from "@/lib/mockData";
import {
    ResponsiveContainer, LineChart, Line, BarChart, Bar,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell
} from "recharts";
import { AlertTriangle, Brain, Users, Search, AlertOctagon, Activity } from "lucide-react";
import { useState } from "react";

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

const AI_INSIGHTS = [
    { tag: "Alert", color: "#ef4444", text: "Retention decreased by 4% in Semester 3 — highest single-semester drop observed." },
    { tag: "Risk", color: "#f59e0b", text: "Mechanical Engineering department shows the highest at-risk rate (24 students flagged)." },
    { tag: "Action", color: "#10b981", text: "Automated intervention email sequence recommended for 87 high-risk students." },
];

const HIGH_RISK_STUDENTS = [
    { name: "Rahul Sharma", roll: "REG2024CS01", dept: "CSE", risk: "Attendance (62%) & Marks (45%)", probability: "89%" },
    { name: "Priya Singh", roll: "REG2024ME12", dept: "MECH", risk: "Consecutive Failed Subjects", probability: "82%" },
    { name: "Amit Kumar", roll: "REG2024EC05", dept: "ECE", risk: "Low Attendance (55%)", probability: "78%" },
];

const RISK_PIE = [
    { name: "Low Risk", value: 3482 - 250 - 87, color: "#10b981" },
    { name: "Medium Risk", value: 250, color: "#f59e0b" },
    { name: "High Risk", value: 87, color: "#ef4444" },
];

export default function RetentionReportsPage() {
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <div style={{ maxWidth: "1300px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "28px" }}>
            {/* Header */}
            <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ef4444", display: "inline-block" }} />
                    <span style={{ color: "#ef4444", fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Admin · Risk Intelligence</span>
                </div>
                <h1 style={{ fontSize: "1.9rem", fontWeight: 900, color: V.text, margin: 0 }}>
                    Retention & {" "}
                    <span style={{ background: "linear-gradient(135deg,#ef4444,#f59e0b)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Dropout Analysis</span>
                </h1>
                <p style={{ color: V.dim, marginTop: "6px", fontSize: "0.88rem" }}>AI-powered dropout prediction, risk distribution, and intervention triggers.</p>
            </div>

            {/* AI Insights & Intervention Triggers */}
            <div style={CARD}>
                <div style={{ display: "flex", justifyItems: "stretch", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
                    <div style={{ flex: "1 1 auto", minWidth: 300 }}>
                        <h3 style={{ fontWeight: 800, color: V.text, fontSize: "1rem", margin: "0 0 16px", display: "flex", alignItems: "center", gap: "8px" }}>
                            <Brain size={20} color="#a855f7" /> AI Intervention Recommendations
                        </h3>
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "100%" }}>
                            {AI_INSIGHTS.map((ins, i) => (
                                <div key={i} style={{ padding: "12px 16px", background: `${ins.color}08`, border: `1px solid ${ins.color}20`, borderRadius: "10px", display: "flex", gap: "12px", alignItems: "center" }}>
                                    <span style={{ background: `${ins.color}20`, color: ins.color, padding: "2px 8px", borderRadius: "6px", fontSize: "0.7rem", fontWeight: 800 }}>{ins.tag}</span>
                                    <p style={{ fontSize: "0.85rem", color: V.dim, margin: 0 }}>{ins.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "12px", padding: "20px", width: "320px", flexShrink: 0 }}>
                        <h4 style={{ color: V.text, fontSize: "0.95rem", margin: "0 0 12px", display: "flex", alignItems: "center", gap: 8 }}><AlertOctagon size={16} color="#ef4444" /> Trigger Actions</h4>
                        <p style={{ color: V.muted, fontSize: "0.8rem", margin: "0 0 16px" }}>Take immediate action on the 87 identified high-risk students.</p>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            <button style={{ background: "#ef4444", color: "white", border: "none", padding: "10px", borderRadius: "8px", fontWeight: 700, cursor: "pointer", fontSize: "0.85rem", width: "100%" }}>Send Warning Emails</button>
                            <button style={{ background: V.hover, color: V.text, border: `1px solid ${V.border}`, padding: "10px", borderRadius: "8px", fontWeight: 700, cursor: "pointer", fontSize: "0.85rem", width: "100%" }}>Notify Faculty & HODs</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                {/* Dropout % by Semester */}
                <div style={CARD}>
                    <h3 style={{ fontWeight: 800, color: V.text, fontSize: "0.95rem", margin: "0 0 4px" }}>Semester-wise Dropout Percentage</h3>
                    <p style={{ fontSize: "0.75rem", color: V.dim, margin: "0 0 18px" }}>Historical track record of student dropouts</p>
                    <ResponsiveContainer width="100%" height={240}>
                        <LineChart data={RETENTION_TREND} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.2)" vertical={false} />
                            <XAxis dataKey="sem" tick={{ fill: "gray", fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis domain={[0, 20]} tick={{ fill: "gray", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(val) => `${val}%`} />
                            <Tooltip {...TT} />
                            <Line type="monotone" dataKey="dropout" name="Dropout Rate" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, fill: "#ef4444" }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Risk Distribution */}
                <div style={CARD}>
                    <h3 style={{ fontWeight: 800, color: V.text, fontSize: "0.95rem", margin: "0 0 4px" }}>System Risk Distribution</h3>
                    <p style={{ fontSize: "0.75rem", color: V.dim, margin: "0 0 18px" }}>Total student population segmented by AI risk score</p>
                    <ResponsiveContainer width="100%" height={240}>
                        <PieChart>
                            <Pie data={RISK_PIE} innerRadius={60} outerRadius={85} paddingAngle={5} dataKey="value">
                                {RISK_PIE.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                            </Pie>
                            <Tooltip {...TT} />
                            <Legend wrapperStyle={{ fontSize: "0.75rem", color: "gray" }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* High-Risk Students List */}
            <div style={CARD}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 20 }}>
                    <div>
                        <h3 style={{ fontWeight: 800, color: V.text, fontSize: "1rem", margin: "0 0 4px", display: "flex", alignItems: "center", gap: 8 }}>
                            <AlertTriangle size={18} color="#ef4444" /> High-Risk Students List
                        </h3>
                        <p style={{ fontSize: "0.8rem", color: V.dim, margin: 0 }}>Showing top extreme-risk profiles requiring immediate attention.</p>
                    </div>
                </div>

                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
                        <thead>
                            <tr style={{ borderBottom: `1px solid ${V.border}` }}>
                                <th style={{ textAlign: "left", padding: "11px 14px", color: V.muted, fontWeight: 700, fontSize: "0.72rem", textTransform: "uppercase" }}>Student Name</th>
                                <th style={{ textAlign: "left", padding: "11px 14px", color: V.muted, fontWeight: 700, fontSize: "0.72rem", textTransform: "uppercase" }}>Roll No</th>
                                <th style={{ textAlign: "left", padding: "11px 14px", color: V.muted, fontWeight: 700, fontSize: "0.72rem", textTransform: "uppercase" }}>Department</th>
                                <th style={{ textAlign: "left", padding: "11px 14px", color: V.muted, fontWeight: 700, fontSize: "0.72rem", textTransform: "uppercase" }}>Primary Reason for Risk</th>
                                <th style={{ textAlign: "right", padding: "11px 14px", color: V.muted, fontWeight: 700, fontSize: "0.72rem", textTransform: "uppercase" }}>AI Dropout Probability</th>
                            </tr>
                        </thead>
                        <tbody>
                            {HIGH_RISK_STUDENTS.map((s, i) => (
                                <tr key={s.roll} style={{ borderBottom: `1px solid ${V.border}`, background: i % 2 ? V.hover : "transparent" }}>
                                    <td style={{ padding: "14px", fontWeight: 700, color: V.text }}>{s.name}</td>
                                    <td style={{ padding: "14px", color: V.dim }}>{s.roll}</td>
                                    <td style={{ padding: "14px", color: V.dim, fontWeight: 600 }}>{s.dept}</td>
                                    <td style={{ padding: "14px", color: "#ef4444", fontSize: "0.82rem", fontWeight: 600 }}>{s.risk}</td>
                                    <td style={{ padding: "14px", textAlign: "right", fontWeight: 800, color: "#ef4444", fontSize: "1rem" }}>{s.probability}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
