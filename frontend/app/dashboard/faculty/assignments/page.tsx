"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { BookOpen, Search, Save, Plus } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, doc, getDoc, updateDoc, query, where } from "firebase/firestore";

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

export default function AssignmentsPage() {
    const { data: session } = useSession();
    const teacherEmail = session?.user?.email;

    const [dbStudents, setDbStudents] = useState<any[]>([]);
    const [querySearch, setQuerySearch] = useState("");
    const [subjectName, setSubjectName] = useState("Math");
    const [marks, setMarks] = useState<Record<string, string>>({});
    const [saving, setSaving] = useState(false);

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

    const MY_STUDENTS = dbStudents;

    const filtered = MY_STUDENTS.filter(s =>
        s.name.toLowerCase().includes(querySearch.toLowerCase()) ||
        (s.registerNumber || s.roll || "").toLowerCase().includes(querySearch.toLowerCase())
    );

    const handleMarkChange = (studentId: string, val: string) => {
        setMarks(prev => ({ ...prev, [studentId]: val }));
    };

    const handleSaveMarks = async () => {
        if (!subjectName.trim()) {
            alert("Please enter a subject name.");
            return;
        }

        const toUpdate = Object.entries(marks).filter(([_, val]) => val !== "");
        if (toUpdate.length === 0) {
            alert("No marks entered.");
            return;
        }

        setSaving(true);
        try {
            for (const [studentId, val] of toUpdate) {
                const markVal = parseInt(val, 10);
                if (isNaN(markVal)) continue;

                // Find student by id
                const student = MY_STUDENTS.find(s => s.id === studentId);
                if (!student) continue;

                // Get fresh document copy
                const studentRef = doc(db, "users", student.email);
                const snap = await getDoc(studentRef);
                const currData = snap.data();
                if (!currData) continue;

                const currSubjects = Array.isArray(currData.subjects) ? [...currData.subjects] : [];

                // Update existing subject or add new
                const existingIndex = currSubjects.findIndex(s => s.name.toLowerCase() === subjectName.toLowerCase());
                if (existingIndex >= 0) {
                    currSubjects[existingIndex] = { ...currSubjects[existingIndex], marks: markVal };
                } else {
                    currSubjects.push({ name: subjectName, marks: markVal });
                }

                await updateDoc(studentRef, { subjects: currSubjects });
            }
            alert(`Successfully updated marks for ${toUpdate.length} students in ${subjectName}.`);
            setMarks({}); // Clear input fields after successful save
        } catch (e) {
            console.error(e);
            alert("An error occurred while saving marks.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", flexDirection: "column", gap: 32 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: V.accent, boxShadow: `0 0 8px ${V.accent}`, display: "inline-block" }} />
                <span style={{ color: V.accent, fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: FONT_H }}>
                    Faculty Dashboard — Assessment Hub
                </span>
            </div>
            <h1 style={{ fontFamily: FONT_H, fontSize: "1.9rem", fontWeight: 900, letterSpacing: "-0.03em", color: V.text, margin: 0, marginTop: "-20px" }}>
                Assignments & Tests
            </h1>
            <p style={{ color: V.dim, marginTop: "-24px", fontSize: "0.9rem", marginBottom: 10 }}>
                Filter students by class, set the subject, and rapidly input scores.
            </p>

            <div style={{ background: V.card, border: `1px solid ${V.border}`, borderRadius: "16px", padding: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 16 }}>
                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", flex: 1 }}>
                        <div style={{ minWidth: 200, display: "flex", alignItems: "center", gap: 10, background: V.searchBg, borderRadius: 10, padding: "0 14px", border: `1px solid ${V.border}` }}>
                            <Search size={15} color={V.muted} />
                            <input value={querySearch} onChange={e => setQuerySearch(e.target.value)} placeholder="Filter students..."
                                style={{ background: "none", border: "none", color: V.text, outline: "none", padding: "11px 0", width: "100%", fontSize: "0.88rem", fontFamily: "inherit" }} />
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, background: V.searchBg, borderRadius: 10, padding: "0 14px", border: `1px solid ${V.border}` }}>
                            <BookOpen size={15} color={V.muted} />
                            <input value={subjectName} onChange={e => setSubjectName(e.target.value)} placeholder="Subject Name"
                                style={{ background: "none", border: "none", color: V.text, outline: "none", padding: "11px 0", width: 140, fontSize: "0.88rem", fontFamily: "inherit", fontWeight: 700 }} />
                        </div>
                    </div>

                    <button onClick={handleSaveMarks} disabled={saving} style={{
                        display: "flex", alignItems: "center", gap: 8, padding: "11px 20px",
                        borderRadius: 10, background: V.accent, color: "#fff", border: "none",
                        fontWeight: 700, fontSize: "0.88rem", cursor: saving ? "not-allowed" : "pointer",
                        opacity: saving ? 0.7 : 1
                    }}>
                        {saving ? <span className="rotate-spinner" style={{ display: "inline-block", border: "2px solid #fff", borderTopColor: "transparent", borderRadius: "50%", width: 16, height: 16 }} /> : <Save size={16} />}
                        {saving ? "Saving..." : "Save All Marks"}
                    </button>
                    <style>{`.rotate-spinner { animation: spin 1s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>

                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
                        <thead>
                            <tr style={{ borderBottom: `1px solid ${V.border}` }}>
                                <th style={{ textAlign: "left", padding: "11px 14px", color: V.muted, fontWeight: 700, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.07em" }}>Student</th>
                                <th style={{ textAlign: "left", padding: "11px 14px", color: V.muted, fontWeight: 700, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.07em" }}>Roll No</th>
                                <th style={{ textAlign: "left", padding: "11px 14px", color: V.muted, fontWeight: 700, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.07em" }}>Score (0-100)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((s, i) => (
                                <tr key={s.id} style={{ borderBottom: `1px solid ${V.border}`, background: i % 2 ? V.hover : "transparent" }}>
                                    <td style={{ padding: "13px 14px", fontWeight: 700, color: V.text }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                            <div style={{ width: 30, height: 30, borderRadius: "50%", background: s.avatarColor || V.accentSoft, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.75rem", color: V.accent }}>{s.avatar || s.name?.charAt(0)}</div>
                                            {s.name}
                                        </div>
                                    </td>
                                    <td style={{ padding: "13px 14px", color: V.dim, fontWeight: 600 }}>{s.registerNumber || s.roll || "REG000"}</td>
                                    <td style={{ padding: "13px 14px" }}>
                                        <input
                                            type="number"
                                            min="0" max="100"
                                            value={marks[s.id] || ""}
                                            onChange={e => handleMarkChange(s.id, e.target.value)}
                                            placeholder="--"
                                            style={{
                                                width: 80, padding: "8px 12px", borderRadius: 8,
                                                background: V.hover, border: `1px solid ${V.border}`,
                                                color: V.text, fontWeight: 700, outline: "none",
                                                fontFamily: "inherit", fontSize: "0.88rem"
                                            }}
                                        />
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr><td colSpan={3} style={{ textAlign: "center", padding: 48, color: V.muted }}>No students found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
