"use client";

import { CURRICULUM_RADAR, SKILL_GAP_BAR, AI_RECOMMENDATIONS } from "@/lib/adminData";
import {
    ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Legend,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip
} from "recharts";
import { Lightbulb, AlertTriangle, TrendingUp } from "lucide-react";

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

const TAG_COLOR: Record<string, string> = { Add: "#10b981", Upgrade: "#f59e0b", Remove: "#ef4444" };

export default function CurriculumPage() {
    const avgGap = Math.round(SKILL_GAP_BAR.reduce((a, b) => a + b.gap, 0) / SKILL_GAP_BAR.length);
    const highGap = SKILL_GAP_BAR.filter(s => s.gap > 40).length;

    return (
        <div style={{ maxWidth: "1300px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "28px" }}>
            {/* Header */}
            <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#a855f7", display: "inline-block" }} />
                    <span style={{ color: "#a855f7", fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Admin · Curriculum Intelligence</span>
                </div>
                <h1 style={{ fontSize: "1.9rem", fontWeight: 900, color: V.text, margin: 0 }}>
                    Curriculum vs{" "}
                    <span style={{ background: "linear-gradient(135deg,#a855f7,#6366f1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Industry Alignment</span>
                </h1>
                <p style={{ color: V.dim, marginTop: "6px", fontSize: "0.88rem" }}>AI-driven analysis comparing what we teach vs what the industry demands.</p>
            </div>

            {/* Summary */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "16px" }}>
                {[
                    { label: "Avg Skill Gap", value: `${avgGap}%`, color: "#ef4444", icon: AlertTriangle },
                    { label: "High-Gap Skills", value: `${highGap} Subjects`, color: "#f59e0b", icon: AlertTriangle },
                    { label: "Best Aligned", value: "Programming", color: "#10b981", icon: TrendingUp },
                    { label: "AI Recommendations", value: AI_RECOMMENDATIONS.length, color: "#a855f7", icon: Lightbulb },
                ].map(c => (
                    <div key={c.label} style={{ ...CARD, display: "flex", alignItems: "center", gap: "14px" }}>
                        <div style={{ width: 40, height: 40, borderRadius: "11px", background: `${c.color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <c.icon size={20} color={c.color} />
                        </div>
                        <div>
                            <div style={{ fontSize: "1.3rem", fontWeight: 900, color: c.color }}>{c.value}</div>
                            <div style={{ fontSize: "0.75rem", color: V.dim, marginTop: "2px" }}>{c.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                {/* Radar */}
                <div style={CARD}>
                    <h3 style={{ fontWeight: 800, color: V.text, fontSize: "0.95rem", margin: "0 0 4px" }}>🕸 Curriculum vs Industry Skills Radar</h3>
                    <p style={{ fontSize: "0.75rem", color: V.dim, margin: "0 0 16px" }}>Skill-by-skill comparison of current curriculum vs market demand</p>
                    <ResponsiveContainer width="100%" height={280}>
                        <RadarChart data={CURRICULUM_RADAR} cx="50%" cy="50%" outerRadius="75%">
                            <PolarGrid stroke="rgba(128,128,128,0.2)" />
                            <PolarAngleAxis dataKey="skill" tick={{ fill: "gray", fontSize: 11 }} />
                            <Radar name="Curriculum" dataKey="curriculum" stroke="#6366f1" fill="#6366f1" fillOpacity={0.25} strokeWidth={2} />
                            <Radar name="Industry" dataKey="industry" stroke="#a855f7" fill="#a855f7" fillOpacity={0.1} strokeWidth={2} />
                            <Legend wrapperStyle={{ fontSize: "0.75rem", color: "gray" }} />
                            <Tooltip {...TT} />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>

                {/* Skill gap bar */}
                <div style={CARD}>
                    <h3 style={{ fontWeight: 800, color: V.text, fontSize: "0.95rem", margin: "0 0 4px" }}>📊 Skill Demand vs Readiness</h3>
                    <p style={{ fontSize: "0.75rem", color: V.dim, margin: "0 0 16px" }}>Industry demand vs current student skill readiness per subject</p>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={SKILL_GAP_BAR} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.2)" vertical={false} />
                            <XAxis dataKey="subject" tick={{ fill: "gray", fontSize: 10 }} axisLine={false} tickLine={false} />
                            <YAxis domain={[0, 100]} tick={{ fill: "gray", fontSize: 11 }} axisLine={false} tickLine={false} />
                            <Tooltip {...TT} />
                            <Legend wrapperStyle={{ fontSize: "0.75rem", color: "gray" }} />
                            <Bar dataKey="demand" name="Industry Demand" fill="#a855f7" radius={[5, 5, 0, 0]} barSize={16} />
                            <Bar dataKey="readiness" name="Student Readiness" fill="#6366f1" radius={[5, 5, 0, 0]} barSize={16} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* AI Recommendations */}
            <div style={CARD}>
                <h3 style={{ fontWeight: 800, color: V.text, fontSize: "0.95rem", margin: "0 0 6px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <Lightbulb size={17} color="#f59e0b" /> AI Curriculum Recommendations
                </h3>
                <p style={{ fontSize: "0.8rem", color: V.dim, margin: "0 0 18px" }}>Auto-generated improvement plan based on industry trend analysis</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {AI_RECOMMENDATIONS.map((r, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "14px", padding: "14px 16px", background: `${TAG_COLOR[r.type]}08`, border: `1px solid ${TAG_COLOR[r.type]}20`, borderRadius: "12px" }}>
                            <span style={{ background: `${TAG_COLOR[r.type]}20`, color: TAG_COLOR[r.type], padding: "3px 10px", borderRadius: "6px", fontSize: "0.65rem", fontWeight: 800, whiteSpace: "nowrap", marginTop: "1px" }}>{r.type}</span>
                            <p style={{ flex: 1, fontSize: "0.85rem", color: V.dim, lineHeight: 1.55, margin: 0 }}>{r.text}</p>
                            <span style={{ background: `${TAG_COLOR[r.type]}15`, color: TAG_COLOR[r.type], padding: "4px 12px", borderRadius: "20px", fontSize: "0.78rem", fontWeight: 800, whiteSpace: "nowrap" }}>{r.impact}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Outdated subjects */}
            <div style={CARD}>
                <h3 style={{ fontWeight: 800, color: V.text, fontSize: "0.95rem", margin: "0 0 16px" }}>⚠ Subjects Flagged as Outdated / Low Industry Relevance</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "12px" }}>
                    {[
                        { name: "Cobol Programming", relevance: 2, status: "Obsolete" },
                        { name: "Assembly Language I", relevance: 15, status: "Outdated" },
                        { name: "Flash Development", relevance: 1, status: "Obsolete" },
                        { name: "Network Wiring Lab", relevance: 22, status: "Low Value" },
                    ].map(s => (
                        <div key={s.name} style={{ padding: "14px 16px", background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: "12px" }}>
                            <div style={{ fontWeight: 700, color: V.text, fontSize: "0.88rem", marginBottom: "8px" }}>{s.name}</div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div style={{ fontSize: "0.75rem", color: V.dim }}>Relevance: <span style={{ color: "#ef4444", fontWeight: 700 }}>{s.relevance}/100</span></div>
                                <span style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444", padding: "2px 8px", borderRadius: "5px", fontSize: "0.65rem", fontWeight: 800 }}>{s.status}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
