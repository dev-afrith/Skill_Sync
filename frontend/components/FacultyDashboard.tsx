"use client";

import { useState, useEffect, useRef } from "react";
import {
    Users, AlertTriangle, TrendingUp, Award, BookOpen,
    Search, ChevronUp, ChevronDown, Download,
    BarChart2, Filter, FileText, Send, UploadCloud, MessageSquare, Plus, Clock
} from "lucide-react";

import { getMaterials, saveMaterial, type Material } from "@/lib/materialsStore";
import StudentDetailsModal from "./StudentDetailsModal";
import ClientCharts from "@/components/ClientCharts";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, where, doc, updateDoc } from "firebase/firestore";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from "recharts";

// ─── Types ───────────────────────────────────────────────────────────────────
type SortKey = "name" | "roll" | "performance" | "attendance" | "risk";

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
    surface: "var(--ds-surface, #111114)",
    searchBg: "var(--ds-search-bg, #1a1a1f)",
};
const FONT_H = "var(--font-display, 'Outfit', sans-serif)";

const RISK_CFG: Record<string, { color: string; bg: string }> = {
    Low: { color: "#10b981", bg: "rgba(16,185,129,0.12)" },
    Medium: { color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
    High: { color: "#ef4444", bg: "rgba(239,68,68,0.12)" },
};

const CLASSES = ["CSE-A (Year 2)", "CSE-B (Year 2)", "CSE-A (Year 3)"];

const CARD: React.CSSProperties = {
    background: V.card, border: `1px solid ${V.border}`,
    borderRadius: "16px", padding: "24px",
    transition: "background 0.3s, border-color 0.3s",
};

const TABS = [
    { id: "students", label: "Student Management", icon: Users },
    { id: "analytics", label: "Performance Analytics", icon: BarChart2 },
    { id: "assignments", label: "Assignments & Tests", icon: FileText },
    { id: "risk", label: "Risk Monitoring", icon: AlertTriangle },
    { id: "materials", label: "Upload Materials", icon: UploadCloud },
    { id: "comm", label: "Communication", icon: MessageSquare },
];

function SectionTitle({ icon: Icon, label, sub }: { icon: any; color?: string; label: string; sub?: string }) {
    return (
        <div style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: V.accentSoft, border: `1px solid ${V.accentBorder}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon size={18} color={V.accent} />
                </div>
                <h2 style={{ fontFamily: FONT_H, fontSize: "1.2rem", fontWeight: 800, color: V.text, margin: 0, letterSpacing: "-0.02em" }}>{label}</h2>
            </div>
            {sub && <p style={{ fontSize: "0.85rem", color: V.dim, marginTop: 6, marginLeft: 46 }}>{sub}</p>}
        </div>
    );
}

export default function FacultyDashboard({ teacherName, teacherEmail }: { teacherName: string; teacherEmail?: string }) {
    const [activeTab, setActiveTab] = useState(TABS[0].id);
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

    const MY_STUDENTS = dbStudents.map((s: any) => {
        const avg = s.subjects ? s.subjects.reduce((a: any, b: any) => a + (b.marks || 0), 0) / (Math.max(s.subjects.length, 1)) : (Math.random() * 40 + 50); // fallback mock for display
        const att = s.attendance ?? (Math.floor(Math.random() * 30 + 70));
        return {
            ...s,
            roll: s.registerNumber || s.roll || "REG000",
            performance: Math.round(avg),
            attendance: att,
            gpa: (avg / 10).toFixed(1),
            risk: (att < 75 || avg < 60) ? "High" : avg < 75 ? "Medium" : "Low",
            skillGaps: s.skillGaps || ["Problem Solving", "Advanced Queries"],
        };
    });

    const total = MY_STUDENTS.length;
    const atRisk = MY_STUDENTS.filter((s) => s.risk === "High").length;
    const medRisk = MY_STUDENTS.filter((s) => s.risk === "Medium").length;
    const avgPerf = total ? Math.round(MY_STUDENTS.reduce((a, b) => a + b.performance, 0) / total) : 0;
    const avgAtt = total ? Math.round(MY_STUDENTS.reduce((a, b) => a + b.attendance, 0) / total) : 0;

    const riskPie = [
        { name: "Low Risk", value: MY_STUDENTS.filter(s => s.risk === "Low").length, color: "#10b981" },
        { name: "Medium Risk", value: medRisk, color: "#f59e0b" },
        { name: "High Risk", value: atRisk, color: "#ef4444" },
    ];

    // Student Management Table State
    const [searchQuery, setSearchQuery] = useState("");
    const [riskFilter, setRiskFilter] = useState("All");
    const [sortKey, setSortKey] = useState<SortKey>("roll");
    const [sortAsc, setSortAsc] = useState(true);

    const filtered = MY_STUDENTS
        .filter(s =>
            (riskFilter === "All" || s.risk === riskFilter) &&
            (s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.roll.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        .sort((a, b) => {
            const av = a[sortKey] ?? "", bv = b[sortKey] ?? "";
            if (typeof av === "number" && typeof bv === "number")
                return sortAsc ? av - bv : bv - av;
            return sortAsc
                ? String(av).localeCompare(String(bv))
                : String(bv).localeCompare(String(av));
        });

    const toggleSort = (k: SortKey) => {
        if (sortKey === k) setSortAsc(!sortAsc);
        else { setSortKey(k); setSortAsc(true); }
    };

    const SortIcon = ({ k }: { k: SortKey }) =>
        sortKey === k
            ? (sortAsc ? <ChevronUp size={13} /> : <ChevronDown size={13} />)
            : <ChevronDown size={13} style={{ opacity: 0.25 }} />;

    const exportReport = () => {
        const rows = filtered.map(s => `${s.roll}\t${s.name}\t${s.performance}%\t${s.attendance}%\t${s.risk}`).join("\n");
        const blob = new Blob([`Faculty Report — ${teacherName}\n\nRoll\tName\tPerformance\tAttendance\tRisk\n${rows}`], { type: "text/plain" });
        const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(blob), download: "class-report.txt" });
        a.click();
    };

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [isViewOnly, setIsViewOnly] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<any>(null);

    const handleSaveStudentDetails = (data: any) => {
        if (selectedStudent) {
            alert(`Marks for ${selectedStudent.name} saved! (Currently simulated)`);
        }
    };

    const handleUpdateAttendance = async (student: any) => {
        const val = prompt(`Enter new attendance percentage for ${student.name} (0-100):`, student.attendance);
        if (val === null) return;
        const att = parseInt(val);
        if (isNaN(att) || att < 0 || att > 100) return alert("Please enter a valid percentage between 0 and 100.");

        try {
            const studentRef = doc(db, "users", student.id);
            await updateDoc(studentRef, { attendance: att });
            alert(`Attendance for ${student.name} updated successfully!`);
        } catch (e) {
            console.error(e);
        }
    };

    // Materials State
    const [materials, setMaterials] = useState<Material[]>([]);
    const [matTitle, setMatTitle] = useState("");
    const [matDesc, setMatDesc] = useState("");
    const [matClass, setMatClass] = useState(CLASSES[0]);
    const [matFile, setMatFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadOk, setUploadOk] = useState(false);
    const [uploadErr, setUploadErr] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => { setMaterials(getMaterials()); }, []);

    const handleFile = (f: File) => {
        const ok = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation"];
        if (!ok.includes(f.type)) { setUploadErr("Only PDF, DOC, DOCX, PPT, PPTX allowed."); return; }
        setUploadErr(""); setMatFile(f);
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!matTitle.trim() || !matFile) { setUploadErr("Title and file are required."); return; }
        setUploadErr(""); setUploading(true);
        await new Promise(r => setTimeout(r, 1000));
        const m: Material = {
            id: Date.now().toString(), title: matTitle, description: matDesc,
            assignedClass: matClass, fileName: matFile.name,
            fileType: matFile.name.split(".").pop()?.toUpperCase() || "FILE",
            uploadedAt: new Date().toLocaleString(), uploadedBy: teacherName,
        };
        saveMaterial(m);
        setMaterials(getMaterials());
        setMatTitle(""); setMatDesc(""); setMatFile(null); setMatClass(CLASSES[0]);
        setUploading(false); setUploadOk(true);
        setTimeout(() => setUploadOk(false), 3500);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    // Chat State
    const [chatMsg, setChatMsg] = useState("");

    return (
        <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", flexDirection: "column", gap: 32 }}>

            {/* ─── HEADER & STATS ─────────────────────────────────────────── */}
            <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: V.accent, display: "inline-block" }} />
                    <span style={{ color: V.accent, fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                        Faculty Control Panel
                    </span>
                </div>
                <h1 style={{ fontFamily: FONT_H, fontSize: "1.9rem", fontWeight: 900, color: V.text, margin: 0 }}>
                    Welcome, <span className="text-gradient">{teacherName}</span>
                </h1>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: 18 }}>
                {[
                    { label: "My Students", value: total, icon: Users },
                    { label: "High Risk", value: atRisk, icon: AlertTriangle, color: "#ef4444" },
                    { label: "Avg Performance", value: `${avgPerf}%`, icon: Award },
                    { label: "Avg Attendance", value: `${avgAtt}%`, icon: Clock },
                ].map(c => (
                    <div key={c.label} style={{ ...CARD, padding: "20px", display: "flex", alignItems: "center", gap: 16 }}>
                        <div style={{ width: 44, height: 44, borderRadius: 12, background: V.accentSoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <c.icon size={22} color={c.color || V.accent} />
                        </div>
                        <div>
                            <div style={{ fontFamily: FONT_H, fontSize: "1.5rem", fontWeight: 900, color: V.text, lineHeight: 1 }}>{c.value}</div>
                            <div style={{ fontSize: "0.75rem", color: V.dim, marginTop: 4, fontWeight: 600 }}>{c.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ─── NAVIGATION TABS ────────────────────────────────────────── */}
            <div style={{ display: "flex", gap: 8, borderBottom: `1px solid ${V.border}`, paddingBottom: 16, overflowX: "auto" }}>
                {TABS.map(tab => {
                    const active = activeTab === tab.id;
                    return (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                            style={{
                                display: "flex", alignItems: "center", gap: 8, padding: "10px 18px",
                                borderRadius: 10, cursor: "pointer", fontWeight: 700, fontSize: "0.85rem",
                                background: active ? V.accentSoft : "transparent",
                                color: active ? V.accent : V.dim,
                                border: `1px solid ${active ? V.accentBorder : "transparent"}`,
                                whiteSpace: "nowrap", transition: "all 0.2s"
                            }}>
                            <tab.icon size={16} /> {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* ─── TAB CONTENT ────────────────────────────────────────── */}

            {activeTab === "students" && (
                <div style={CARD}>
                    <SectionTitle icon={Users} label="Student Management" sub="View, edit marks, and update attendance for your assigned students." />

                    <div style={{ display: "flex", gap: 12, marginBottom: 18, flexWrap: "wrap" }}>
                        <div style={{ flex: 1, minWidth: 200, display: "flex", alignItems: "center", gap: 10, background: V.searchBg, borderRadius: 10, padding: "0 14px", border: `1px solid ${V.border}` }}>
                            <Search size={15} color={V.muted} />
                            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search by name or roll…"
                                style={{ background: "none", border: "none", color: V.text, outline: "none", padding: "11px 0", width: "100%", fontSize: "0.88rem" }} />
                        </div>
                        <button onClick={exportReport} style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 18px", borderRadius: 10, background: V.hover, border: `1px solid ${V.border}`, color: V.text, fontWeight: 700, fontSize: "0.82rem", cursor: "pointer" }}>
                            <Download size={14} /> Export
                        </button>
                    </div>

                    <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
                            <thead>
                                <tr style={{ borderBottom: `1px solid ${V.border}` }}>
                                    {[{ l: "Student", k: "name" }, { l: "Roll No", k: "roll" }, { l: "Performance", k: "performance" }, { l: "Attendance", k: "attendance" }, { l: "Risk", k: "risk" }, { l: "Actions", k: null }].map((col: any) => (
                                        <th key={col.l} onClick={() => col.k && toggleSort(col.k)} style={{ textAlign: "left", padding: "11px 14px", color: V.muted, fontWeight: 700, fontSize: "0.72rem", textTransform: "uppercase", cursor: col.k ? "pointer" : "default", whiteSpace: "nowrap" }}>
                                            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>{col.l}{col.k && <SortIcon k={col.k} />}</span>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((s, i) => {
                                    const rc = RISK_CFG[s.risk];
                                    return (
                                        <tr key={s.id} style={{ borderBottom: `1px solid ${V.border}`, background: i % 2 ? V.hover : "transparent" }}>
                                            <td style={{ padding: "12px 14px", fontWeight: 700, color: V.text }}>{s.name}</td>
                                            <td style={{ padding: "12px 14px", color: V.dim }}>{s.roll}</td>
                                            <td style={{ padding: "12px 14px", fontWeight: 700, color: s.performance >= 75 ? "#10b981" : s.performance >= 55 ? "#f59e0b" : "#ef4444" }}>{s.performance}%</td>
                                            <td style={{ padding: "12px 14px", fontWeight: 700, color: s.attendance >= 75 ? V.text : "#ef4444" }}>{s.attendance}%</td>
                                            <td style={{ padding: "12px 14px" }}><span style={{ background: rc.bg, color: rc.color, padding: "4px 10px", borderRadius: 20, fontSize: "0.7rem", fontWeight: 800 }}>{s.risk}</span></td>
                                            <td style={{ padding: "12px 14px", display: "flex", gap: "8px" }}>
                                                <button onClick={() => { setSelectedStudent(s); setIsViewOnly(true); setShowModal(true); }} style={{ background: V.hover, border: `1px solid ${V.border}`, color: V.text, padding: "6px 12px", borderRadius: 6, fontSize: "0.75rem", fontWeight: 800, cursor: "pointer" }}>View</button>
                                                <button onClick={() => { setSelectedStudent(s); setIsViewOnly(false); setShowModal(true); }} style={{ background: V.accentSoft, border: `1px solid ${V.accentBorder}`, color: V.accent, padding: "6px 12px", borderRadius: 6, fontSize: "0.75rem", fontWeight: 800, cursor: "pointer" }}>Edit Marks</button>
                                                <button onClick={() => handleUpdateAttendance(s)} style={{ background: "transparent", border: `1px solid ${V.border}`, color: V.dim, padding: "6px 12px", borderRadius: 6, fontSize: "0.75rem", fontWeight: 800, cursor: "pointer" }}>Att.</button>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {filtered.length === 0 && <tr><td colSpan={6} style={{ textAlign: "center", padding: 40, color: V.dim }}>No students found</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === "analytics" && (
                <div>
                    <SectionTitle icon={BarChart2} label="Performance Analytics" sub="Class performance trends and risk distribution." />
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                        <div style={CARD}>
                            <h3 style={{ fontSize: "1rem", color: V.text, marginBottom: 16 }}>Class Average Trend (Last 4 Assessments)</h3>
                            <div style={{ height: 260 }}>
                                <ClientCharts type="area" data={[{ name: "Quiz 1", score: 65, avg: 65 }, { name: "Midterm", score: 68, avg: 68 }, { name: "Quiz 2", score: 72, avg: 72 }, { name: "Final", score: 78, avg: 78 }]} dataKey="score" colors={["#6366f1", "#8b5cf6"]} />
                            </div>
                        </div>
                        <div style={CARD}>
                            <h3 style={{ fontSize: "1rem", color: V.text, marginBottom: 16 }}>Class Risk Distribution</h3>
                            <div style={{ height: 260, position: "relative" }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={riskPie} innerRadius={70} outerRadius={90} paddingAngle={5} dataKey="value">
                                            {riskPie.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                        </Pie>
                                        <RechartsTooltip contentStyle={{ backgroundColor: V.surface, border: `1px solid ${V.border}`, borderRadius: '8px' }} itemStyle={{ color: V.text }} />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === "assignments" && (
                <div style={CARD}>
                    <SectionTitle icon={FileText} label="Assignments & Tests" sub="Create new academic assessments and quickly enter marks." />
                    <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: 24 }}>
                        <button onClick={() => alert("Create New Assessment panel opening soon...")} style={{ padding: "12px 20px", background: V.accent, color: "#fff", border: "none", borderRadius: "10px", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
                            <Plus size={18} /> Create New Assessment
                        </button>
                    </div>
                    <div style={{ border: `1px solid ${V.border}`, borderRadius: 12, overflow: "hidden" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
                            <thead>
                                <tr style={{ background: V.hover, borderBottom: `1px solid ${V.border}`, textAlign: "left", color: V.dim, fontSize: "0.75rem", textTransform: "uppercase" }}>
                                    <th style={{ padding: "14px" }}>Assessment Name</th>
                                    <th style={{ padding: "14px" }}>Date Created</th>
                                    <th style={{ padding: "14px" }}>Status</th>
                                    <th style={{ padding: "14px", textAlign: "right" }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style={{ borderBottom: `1px solid ${V.border}` }}>
                                    <td style={{ padding: "14px", color: V.text, fontWeight: 700 }}>Midterm Exam</td>
                                    <td style={{ padding: "14px", color: V.dim }}>Oct 12, 2024</td>
                                    <td style={{ padding: "14px", color: "#10b981", fontWeight: 700 }}>Graded</td>
                                    <td style={{ padding: "14px", textAlign: "right" }}><button style={{ background: V.hover, border: `1px solid ${V.border}`, color: V.text, padding: "6px 12px", borderRadius: 6, fontSize: "0.75rem", cursor: "pointer" }}>Review</button></td>
                                </tr>
                                <tr>
                                    <td style={{ padding: "14px", color: V.text, fontWeight: 700 }}>Assignment 3</td>
                                    <td style={{ padding: "14px", color: V.dim }}>Nov 02, 2024</td>
                                    <td style={{ padding: "14px", color: "#f59e0b", fontWeight: 700 }}>Pending Marks</td>
                                    <td style={{ padding: "14px", textAlign: "right" }}><button style={{ background: V.accentSoft, border: `1px solid ${V.accentBorder}`, color: V.accent, padding: "6px 12px", borderRadius: 6, fontSize: "0.75rem", fontWeight: 700, cursor: "pointer" }}>Enter Marks</button></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === "risk" && (
                <div style={CARD}>
                    <SectionTitle icon={AlertTriangle} label="Risk Monitoring" sub="Identify and intervene with high-risk students in your class." />
                    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
                        {MY_STUDENTS.filter((s: any) => s.risk === "High" || s.risk === "Medium").length === 0 ? (
                            <p style={{ color: V.dim }}>No students currently at High or Medium risk.</p>
                        ) : (
                            MY_STUDENTS.filter((s: any) => s.risk === "High" || s.risk === "Medium").map((s: any) => (
                                <div key={s.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", border: `1px solid ${V.border}`, borderRadius: "12px", background: V.surface }}>
                                    <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                                        <div style={{ width: 40, height: 40, borderRadius: "50%", background: s.risk === "High" ? "rgba(239,68,68,0.2)" : "rgba(245,158,11,0.2)", color: s.risk === "High" ? "#ef4444" : "#f59e0b", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <AlertTriangle size={20} />
                                        </div>
                                        <div>
                                            <h4 style={{ margin: 0, color: V.text, fontSize: "1rem" }}>{s.name} <span style={{ color: V.dim, fontSize: "0.8rem", fontWeight: "normal" }}>({s.roll})</span></h4>
                                            <p style={{ margin: "4px 0 0 0", color: V.dim, fontSize: "0.8rem" }}>
                                                {s.attendance < 75 ? `Low Attendance (${s.attendance}%)` : `Poor Performance (${s.performance}%)`}
                                            </p>
                                        </div>
                                    </div>
                                    <button style={{ background: V.accentSoft, border: `1px solid ${V.accentBorder}`, color: V.accent, padding: "8px 16px", borderRadius: "8px", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer" }}>Log Intervention</button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {activeTab === "comm" && (
                <div style={CARD}>
                    <SectionTitle icon={MessageSquare} label="Communication" sub="Send announcements or messages to individual students." />
                    <div style={{ display: "flex", gap: "24px" }}>
                        <div style={{ flex: 1, border: `1px solid ${V.border}`, borderRadius: "12px", padding: "20px" }}>
                            <h3 style={{ margin: "0 0 16px", color: V.text, fontSize: "1rem" }}>Class Announcement</h3>
                            <textarea id="announcement-textarea" value={chatMsg} onChange={e => setChatMsg(e.target.value)} placeholder="Write announcement here..." style={{ width: "100%", height: "120px", background: V.searchBg, border: `1px solid ${V.border}`, borderRadius: "8px", padding: "12px", color: V.text, outline: "none", resize: "none", marginBottom: "16px", fontFamily: "inherit" }} />
                            <button onClick={() => {
                                const val = (document.getElementById('announcement-textarea') as HTMLTextAreaElement)?.value || chatMsg;
                                if (val.trim()) {
                                    alert("Announcement sent to all assigned students: " + val);
                                    setChatMsg("");
                                } else {
                                    alert("Please write a message first.");
                                }
                            }} style={{ background: V.accent, color: "#fff", border: "none", padding: "10px 20px", borderRadius: "8px", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
                                <Send size={16} /> Send to All Assigned Students
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === "materials" && (
                <div style={CARD}>
                    <SectionTitle icon={UploadCloud} label="Upload Materials" sub="Share lecture notes, syllabi, and study resources." />
                    <div style={{ display: "grid", gridTemplateColumns: "350px 1fr", gap: 32 }}>
                        <div>
                            <form onSubmit={handleUpload} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                                <div>
                                    <label style={{ display: "block", fontSize: "0.8rem", color: V.dim, marginBottom: 6, fontWeight: 700 }}>Material Title</label>
                                    <input value={matTitle} onChange={e => setMatTitle(e.target.value)} placeholder="e.g. Chapter 1 Notes" required style={{ width: "100%", padding: "10px 14px", background: V.searchBg, border: `1px solid ${V.border}`, borderRadius: 10, color: V.text, outline: "none" }} />
                                </div>
                                <div>
                                    <label style={{ display: "block", fontSize: "0.8rem", color: V.dim, marginBottom: 6, fontWeight: 700 }}>Description (Optional)</label>
                                    <textarea value={matDesc} onChange={e => setMatDesc(e.target.value)} placeholder="Brief overview of the material" rows={3} style={{ width: "100%", padding: "10px 14px", background: V.searchBg, border: `1px solid ${V.border}`, borderRadius: 10, color: V.text, outline: "none", resize: "vertical" }} />
                                </div>
                                <div style={{ border: `2px dashed ${matFile ? V.accentBorder : V.border}`, background: matFile ? V.accentSoft : "transparent", borderRadius: 12, padding: 24, textAlign: "center", transition: "all 0.2s" }}>
                                    <input type="file" id="matFile" ref={fileInputRef} onChange={e => e.target.files && handleFile(e.target.files[0])} style={{ display: "none" }} accept=".pdf,.doc,.docx,.ppt,.pptx" />
                                    <label htmlFor="matFile" style={{ cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                                        <div style={{ width: 48, height: 48, borderRadius: "50%", background: V.hover, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <UploadCloud size={24} color={matFile ? V.accent : V.dim} />
                                        </div>
                                        <div>
                                            {matFile ? <span style={{ color: V.accent, fontWeight: 700, fontSize: "0.85rem" }}>{matFile.name} ready</span> : <span style={{ color: V.text, fontWeight: 700, fontSize: "0.85rem" }}>Click to select file</span>}
                                            <p style={{ margin: "4px 0 0", fontSize: "0.75rem", color: V.dim }}>PDF, DOCX, PPTX (Max 10MB)</p>
                                        </div>
                                    </label>
                                </div>
                                {uploadErr && <div style={{ color: "#ef4444", fontSize: "0.8rem", fontWeight: 600 }}>{uploadErr}</div>}
                                {uploadOk && <div style={{ color: "#10b981", fontSize: "0.8rem", fontWeight: 600 }}>File uploaded successfully!</div>}
                                <button type="submit" disabled={uploading || !matFile} style={{ background: uploading ? V.muted : V.text, color: "#111", padding: "12px", borderRadius: 10, border: "none", fontWeight: 800, cursor: uploading ? "not-allowed" : "pointer", marginTop: 8 }}>
                                    {uploading ? "Uploading..." : "Upload Material"}
                                </button>
                            </form>
                        </div>
                        <div>
                            <h3 style={{ fontFamily: FONT_H, fontSize: "1rem", color: V.text, margin: "0 0 16px 0" }}>Recently Uploaded</h3>
                            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                {materials.length === 0 ? <div style={{ color: V.dim, fontSize: "0.9rem", padding: 24, textAlign: "center", background: V.hover, borderRadius: 12 }}>No materials uploaded yet.</div> : materials.map(m => (
                                    <div key={m.id} style={{ display: "flex", alignItems: "flex-start", gap: 16, padding: "16px", background: V.hover, border: `1px solid ${V.border}`, borderRadius: 12 }}>
                                        <div style={{ fontSize: "1.8rem" }}>{m.fileType === "PDF" ? "📄" : m.fileType.includes("DOC") ? "📝" : "📊"}</div>
                                        <div style={{ flex: 1 }}>
                                            <h4 style={{ margin: 0, color: V.text, fontSize: "0.9rem" }}>{m.title}</h4>
                                            {m.description && <p style={{ margin: "4px 0 0", color: V.dim, fontSize: "0.8rem" }}>{m.description}</p>}
                                            <div style={{ display: "flex", gap: 16, marginTop: 8, fontSize: "0.7rem", color: V.muted, fontWeight: 600 }}>
                                                <span>{m.fileName}</span>
                                                <span>•</span>
                                                <span>{m.uploadedAt}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style>{`@keyframes spin { to { transform: rotate(360deg); }}`}</style>

            {showModal && <StudentDetailsModal onClose={() => { setShowModal(false); setSelectedStudent(null); setIsViewOnly(false); }} onSave={handleSaveStudentDetails} readOnly={isViewOnly} studentName={selectedStudent?.name} studentEmail={selectedStudent?.email} />}
        </div>
    );
}
