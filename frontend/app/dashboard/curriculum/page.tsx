"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { getMaterials, type Material } from "@/lib/materialsStore";
import {
    BookOpen, Search, Filter, Download,
    FileText, ExternalLink, GraduationCap,
    Clock, Users, Layers, Star
} from "lucide-react";

const extIcon: Record<string, string> = {
    PDF: "📄", DOC: "📝", DOCX: "📝", PPT: "📊", PPTX: "📊",
};

const extColor: Record<string, string> = {
    PDF: "#ef4444", DOC: "#3b82f6", DOCX: "#3b82f6", PPT: "#f59e0b", PPTX: "#f59e0b",
};

const SUBJECTS = ["All", "Data Structures", "DBMS", "Networks", "OS", "Mathematics", "Other"];

/* ── Theme-aware tokens ── */
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

const CARD: React.CSSProperties = {
    background: V.card, border: `1px solid ${V.border}`,
    borderRadius: "16px", padding: "24px",
    transition: "background 0.3s, border-color 0.3s",
};

export default function CurriculumPage() {
    const [materials, setMaterials] = useState<Material[]>([]);
    const [query, setQuery] = useState("");
    const [filter, setFilter] = useState("All");
    const [activeTab, setActiveTab] = useState<"materials" | "syllabus">("materials");

    useEffect(() => {
        setMaterials(getMaterials());
        const interval = setInterval(() => setMaterials(getMaterials()), 3000);
        return () => clearInterval(interval);
    }, []);

    const filtered = materials.filter((m) => {
        const matchesQuery =
            m.title.toLowerCase().includes(query.toLowerCase()) ||
            m.description?.toLowerCase().includes(query.toLowerCase()) ||
            m.fileName.toLowerCase().includes(query.toLowerCase());
        const matchesFilter =
            filter === "All" ||
            m.title.toLowerCase().includes(filter.toLowerCase()) ||
            m.description?.toLowerCase().includes(filter.toLowerCase());
        return matchesQuery && matchesFilter;
    });

    const { data: session } = useSession();
    const [completedTopics, setCompletedTopics] = useState<string[]>([]);

    useEffect(() => {
        if (session?.user?.email) {
            const saved = localStorage.getItem(`skillsync-student-topics-${session.user.email}`);
            if (saved) {
                try {
                    setCompletedTopics(JSON.parse(saved));
                } catch (e) { }
            }
        }
    }, [session]);

    const toggleTopic = (topicId: string) => {
        setCompletedTopics(prev => {
            const next = prev.includes(topicId) ? prev.filter(id => id !== topicId) : [...prev, topicId];
            if (session?.user?.email) {
                localStorage.setItem(`skillsync-student-topics-${session.user.email}`, JSON.stringify(next));
            }
            return next;
        });
    };

    const syllabusTopics = [
        { subject: "Data Structures", topics: ["Arrays & Linked Lists", "Stacks & Queues", "Trees & Graphs", "Hashing", "Sorting & Searching"] },
        { subject: "DBMS", topics: ["ER Models", "Normalization (1NF–BCNF)", "SQL & PL/SQL", "Transactions & ACID", "NoSQL Overview"] },
        { subject: "Computer Networks", topics: ["OSI & TCP/IP Model", "Data Link Layer", "Network Layer (IP)", "Transport Layer", "Application Protocols"] },
        { subject: "Operating Systems", topics: ["Process Management", "CPU Scheduling", "Memory Management", "File Systems", "Deadlock Handling"] },
        { subject: "Mathematics", topics: ["Discrete Math", "Linear Algebra", "Statistics & Probability", "Graph Theory", "Calculus Fundamentals"] },
    ].map(sub => {
        const completedCount = sub.topics.filter(t => completedTopics.includes(`${sub.subject}-${t}`)).length;
        const progress = Math.round((completedCount / sub.topics.length) * 100);
        return { ...sub, progress };
    });

    return (
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            {/* Header */}
            <div style={{ marginBottom: 32 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: V.accent, boxShadow: `0 0 10px ${V.accent}` }} />
                    <span style={{ color: V.accent, fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: FONT_H }}>
                        Student Learning Hub
                    </span>
                </div>
                <h1 style={{ fontFamily: FONT_H, fontSize: "2rem", fontWeight: 900, letterSpacing: "-0.03em", color: V.text }}>
                    Curriculum &{" "}
                    <span className="text-gradient">Study Materials</span>
                </h1>
                <p style={{ color: V.dim, marginTop: 8 }}>
                    Access all study materials shared by your teacher and track your syllabus progress.
                </p>
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 16, marginBottom: 28 }}>
                {[
                    { label: "Total Materials", value: materials.length, icon: BookOpen },
                    { label: "Subjects Covered", value: syllabusTopics.length, icon: Layers },
                    { label: "Uploaded by Teacher", value: materials.length, icon: GraduationCap },
                    { label: "Classes", value: new Set(materials.map(m => m.assignedClass)).size || 1, icon: Users },
                ].map((s) => (
                    <div key={s.label} style={{ ...CARD, display: "flex", alignItems: "center", gap: 14, padding: "18px 20px" }}>
                        <div style={{ width: 40, height: 40, borderRadius: 10, background: V.accentSoft, border: `1px solid ${V.accentBorder}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <s.icon size={20} color={V.accent} />
                        </div>
                        <div>
                            <div style={{ fontFamily: FONT_H, fontSize: "1.3rem", fontWeight: 900, color: V.text }}>{s.value}</div>
                            <div style={{ fontSize: "0.75rem", color: V.dim }}>{s.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
                {([
                    { key: "materials", label: "📚 Study Materials from Teacher" },
                    { key: "syllabus", label: "📋 Syllabus Progress" },
                ] as { key: "materials" | "syllabus"; label: string }[]).map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        style={{
                            padding: "10px 20px", borderRadius: 10,
                            border: `1px solid ${activeTab === tab.key ? V.accentBorder : V.border}`,
                            background: activeTab === tab.key ? V.accentSoft : V.hover,
                            color: activeTab === tab.key ? V.accent : V.dim,
                            fontWeight: 700, fontSize: "0.9rem", cursor: "pointer",
                            transition: "all 0.2s", fontFamily: FONT_H,
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* ───── STUDY MATERIALS TAB ───── */}
            {activeTab === "materials" && (
                <div style={CARD}>
                    {/* Banner */}
                    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", background: V.accentSoft, border: `1px solid ${V.accentBorder}`, borderRadius: 12, marginBottom: 24 }}>
                        <GraduationCap size={20} color={V.accent} />
                        <div>
                            <div style={{ fontWeight: 700, color: V.text, fontSize: "0.9rem" }}>Study Materials from Teacher</div>
                            <div style={{ fontSize: "0.8rem", color: V.dim }}>
                                Ms. Sarah Smith — CSE Year 2 — {materials.length} materials available
                            </div>
                        </div>
                        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, fontSize: "0.75rem", color: "#10b981", fontWeight: 700 }}>
                            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", display: "inline-block", animation: "pulse 2s infinite" }} />
                            Live
                        </div>
                    </div>

                    {/* Search + Filter */}
                    <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
                        <div style={{ flex: 1, minWidth: 200, display: "flex", alignItems: "center", gap: 10, background: V.searchBg, borderRadius: 10, padding: "0 14px", border: `1px solid ${V.border}`, transition: "border-color 0.2s, background 0.3s" }}>
                            <Search size={16} color={V.muted} />
                            <input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search materials..."
                                style={{ background: "none", border: "none", color: V.text, outline: "none", padding: "11px 0", width: "100%", fontSize: "0.9rem", fontFamily: "inherit" }}
                            />
                        </div>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                            {SUBJECTS.map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setFilter(s)}
                                    style={{
                                        padding: "9px 14px", borderRadius: 9,
                                        border: `1px solid ${filter === s ? V.accentBorder : V.border}`,
                                        background: filter === s ? V.accentSoft : V.hover,
                                        color: filter === s ? V.accent : V.dim,
                                        fontSize: "0.8rem", fontWeight: 600, cursor: "pointer",
                                        transition: "all 0.15s",
                                    }}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Materials Grid */}
                    {filtered.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "64px 0", color: V.muted }}>
                            <BookOpen size={48} color={V.border} style={{ marginBottom: 16 }} />
                            <p>No materials found.</p>
                        </div>
                    ) : (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 16 }}>
                            {filtered.map((m) => {
                                const color = extColor[m.fileType] || V.dim;
                                return (
                                    <div key={m.id} style={{
                                        padding: 20, background: V.hover,
                                        border: `1px solid ${V.border}`, borderRadius: 14,
                                        display: "flex", flexDirection: "column", gap: 12,
                                        transition: "border-color 0.2s, background 0.3s",
                                    }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                            <div style={{ fontSize: "2.2rem" }}>{extIcon[m.fileType] || "📁"}</div>
                                            <span style={{ background: `${color}20`, color, padding: "3px 9px", borderRadius: 6, fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.05em" }}>
                                                {m.fileType}
                                            </span>
                                        </div>
                                        <div>
                                            <h3 style={{ fontFamily: FONT_H, fontWeight: 700, color: V.text, fontSize: "0.95rem", margin: "0 0 6px" }}>{m.title}</h3>
                                            {m.description && (
                                                <p style={{ fontSize: "0.8rem", color: V.dim, margin: 0, lineHeight: 1.5 }}>{m.description}</p>
                                            )}
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.75rem", color: V.muted }}>
                                            <FileText size={12} /> {m.fileName}
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 8, borderTop: `1px solid ${V.border}` }}>
                                            <span style={{ fontSize: "0.72rem", color: V.muted, display: "flex", alignItems: "center", gap: 4 }}>
                                                <Clock size={11} /> {m.uploadedAt}
                                            </span>
                                            {m.uploadedBy && (
                                                <span style={{ fontSize: "0.72rem", color: V.muted }}>{m.uploadedBy}</span>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => {
                                                const content = `SkillSync Learning Material\n\nTitle: ${m.title}\nDescription: ${m.description || "No description"}\nType: ${m.fileType}\nUploaded By: ${m.uploadedBy || "System"}\nDate: ${m.uploadedAt}\n\n[Full content would be available in a live cloud environment]`;
                                                const blob = new Blob([content], { type: "text/plain" });
                                                const url = URL.createObjectURL(blob);
                                                const a = document.createElement("a");
                                                a.href = url;
                                                a.download = `${m.title.toLowerCase().replace(/\s+/g, '-')}.${m.fileType.toLowerCase() === 'pdf' ? 'pdf' : 'txt'}`;
                                                document.body.appendChild(a);
                                                a.click();
                                                document.body.removeChild(a);
                                                URL.revokeObjectURL(url);
                                            }}
                                            style={{
                                                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                                                padding: 10, background: V.accentSoft,
                                                border: `1px solid ${V.accentBorder}`,
                                                borderRadius: 10, color: V.accent,
                                                fontWeight: 700, fontSize: "0.85rem",
                                                cursor: "pointer", transition: "background 0.2s",
                                                width: "100%", marginTop: "auto",
                                            }}
                                        >
                                            <Download size={15} /> Download & View
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* ───── SYLLABUS PROGRESS TAB ───── */}
            {activeTab === "syllabus" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    {syllabusTopics.map((sub) => (
                        <div key={sub.subject} style={CARD}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
                                <h3 style={{ fontFamily: FONT_H, fontWeight: 800, color: V.text, fontSize: "1.05rem", margin: 0 }}>{sub.subject}</h3>
                                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                    <span style={{ fontSize: "0.85rem", fontWeight: 700, color: V.accent }}>{sub.progress}% complete</span>
                                    <div style={{ width: 120, height: 6, background: V.hover, borderRadius: 3, overflow: "hidden" }}>
                                        <div style={{ width: `${sub.progress}%`, height: "100%", background: "var(--ds-accent)", borderRadius: 3, transition: "width 1s ease" }} />
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                                {sub.topics.map((topic, i) => {
                                    const topicId = `${sub.subject}-${topic}`;
                                    const done = completedTopics.includes(topicId);
                                    return (
                                        <div key={topic}
                                            onClick={() => toggleTopic(topicId)}
                                            style={{
                                                cursor: "pointer",
                                                display: "flex", alignItems: "center", gap: 8,
                                                padding: "8px 14px",
                                                background: done ? V.accentSoft : V.hover,
                                                border: `1px solid ${done ? V.accentBorder : V.border}`,
                                                borderRadius: 8, fontSize: "0.85rem",
                                                color: done ? V.text : V.dim, fontWeight: done ? 600 : 400,
                                                transition: "all 0.2s",
                                            }}>
                                            {done
                                                ? <span style={{ fontSize: "0.7rem", color: V.accent }}>✓</span>
                                                : <span style={{ fontSize: "0.7rem", color: V.muted }}>○</span>
                                            }
                                            {topic}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.4; }
                }
            `}</style>
        </div>
    );
}
