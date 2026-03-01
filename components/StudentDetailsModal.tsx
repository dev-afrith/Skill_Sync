"use client";

import { useState, useEffect } from "react";
import { X, Save } from "lucide-react";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";

const V = {
    bg: "rgba(10, 10, 10, 0.8)",
    card: "var(--ds-card, rgba(255,255,255,0.05))",
    border: "var(--ds-border, rgba(255,255,255,0.06))",
    text: "var(--ds-text, #fff)",
    dim: "var(--ds-text-dim, #6b6b6b)",
    accent: "var(--ds-accent)",
};

const SUBJECTS = ["Math", "Data Structures", "DBMS", "Networks", "OS"];

interface ModalProps {
    onClose: () => void;
    onSave: (data: any) => void;
    readOnly?: boolean;
    studentName?: string;
    studentEmail?: string;
}

export default function StudentDetailsModal({ onClose, onSave, readOnly = false, studentName, studentEmail }: ModalProps) {
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        marks: [0, 0, 0, 0, 0],
        attendance: 0,
        skillReadiness: 0,
        progress: 0,
        syllabusProgress: 0,
        skillGaps: [] as string[]
    });

    useEffect(() => {
        if (!studentEmail) return;
        const fetch = async () => {
            const docRef = doc(db, "users", studentEmail);
            const snap = await getDoc(docRef);
            if (snap.exists()) {
                const s = snap.data();
                setFormData({
                    marks: s.subjects?.map((sub: any) => sub.marks) || [0, 0, 0, 0, 0],
                    attendance: s.attendance || 0,
                    skillReadiness: 0, // Calculated or stored separately
                    progress: 0,
                    syllabusProgress: s.syllabusProgress || 0,
                    skillGaps: s.skillGaps || []
                });
            }
            setLoading(false);
        };
        fetch();
    }, [studentEmail]);

    const handleSave = async () => {
        if (!studentEmail) return;

        try {
            const docRef = doc(db, "students", studentEmail);
            const snap = await getDoc(docRef);
            const existingData = snap.exists() ? snap.data() : {};

            const updateData = {
                ...existingData,
                attendance: formData.attendance,
                subjects: SUBJECTS.map((name, i) => ({
                    name,
                    marks: formData.marks[i]
                })),
                syllabusProgress: formData.syllabusProgress,
                skillGaps: formData.skillGaps,
                userId: studentEmail,
                email: studentEmail,
                name: studentName || existingData.name || "Student",
            };

            await setDoc(docRef, updateData, { merge: true });
            onSave(formData);
            onClose();
        } catch (e) {
            console.error("Save failed:", e);
            alert("Failed to save changes. Please check permissions.");
        }
    };

    const handleMarkChange = (index: number, val: number) => {
        const newMarks = [...formData.marks];
        newMarks[index] = val;
        setFormData(prev => ({ ...prev, marks: newMarks }));
    };

    if (loading && studentEmail) return null; // Or skeleton

    return (
        <div style={{
            position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
            background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
        }}>
            <div style={{
                background: "#0a0a0a", border: `1px solid ${V.border}`, borderRadius: "16px",
                padding: "24px", width: "480px", maxWidth: "95%", color: V.text,
                display: "flex", flexDirection: "column", gap: "16px",
                boxShadow: "0 20px 40px rgba(0,0,0,0.4)", maxHeight: "90vh", overflowY: "auto"
            }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 700 }}>
                        {readOnly ? "View Student Details" : `Update Details: ${studentName}`}
                    </h3>
                    <button onClick={onClose} style={{ background: "transparent", border: "none", color: V.dim, cursor: "pointer" }}><X size={20} /></button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "8px" }}>
                    <div>
                        <label style={{ fontSize: "0.85rem", color: V.dim, fontWeight: 500 }}>Subject Marks (out of 100)</label>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginTop: "8px" }}>
                            {SUBJECTS.map((sub, i) => (
                                <div key={sub} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                                    <span style={{ fontSize: "0.82rem", fontWeight: 600 }}>{sub}</span>
                                    <input type="number" max="100" min="0"
                                        value={formData.marks[i] || ""}
                                        readOnly={readOnly}
                                        onChange={(e) => handleMarkChange(i, parseInt(e.target.value) || 0)}
                                        style={{ width: "60px", background: V.card, border: `1px solid ${V.border}`, color: V.text, padding: "6px", borderRadius: "6px", textAlign: "center" }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                        <div>
                            <label style={{ fontSize: "0.82rem", color: V.dim, fontWeight: 500 }}>Attendance %</label>
                            <input type="number" max="100" min="0" value={formData.attendance || ""} readOnly={readOnly} onChange={e => setFormData(prev => ({ ...prev, attendance: parseInt(e.target.value) || 0 }))}
                                style={{ width: "100%", background: V.card, border: `1px solid ${V.border}`, color: V.text, padding: "8px", borderRadius: "6px", marginTop: "4px", textAlign: "center" }} />
                        </div>
                        <div>
                            <label style={{ fontSize: "0.82rem", color: V.dim, fontWeight: 500 }}>Syllabus Progress %</label>
                            <input type="number" max="100" min="0" value={formData.syllabusProgress || ""} readOnly={readOnly} onChange={e => setFormData(prev => ({ ...prev, syllabusProgress: parseInt(e.target.value) || 0 }))}
                                style={{ width: "100%", background: V.card, border: `1px solid ${V.border}`, color: V.text, padding: "8px", borderRadius: "6px", marginTop: "4px", textAlign: "center" }} />
                        </div>
                    </div>

                    <div>
                        <label style={{ fontSize: "0.82rem", color: V.dim, fontWeight: 500 }}>Skill Gaps (comma separated)</label>
                        <input type="text"
                            value={formData.skillGaps.join(", ")}
                            readOnly={readOnly}
                            onChange={e => setFormData(prev => ({ ...prev, skillGaps: e.target.value.split(",").map(s => s.trim()).filter(Boolean) }))}
                            placeholder="e.g. Recursion, SQL Joins"
                            style={{ width: "100%", background: V.card, border: `1px solid ${V.border}`, color: V.text, padding: "8px", borderRadius: "6px", marginTop: "4px" }}
                        />
                    </div>
                </div>

                {!readOnly && (
                    <button onClick={handleSave} style={{
                        background: V.accent, color: "#111", border: "none", padding: "12px", borderRadius: "8px",
                        fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                        marginTop: "12px", cursor: "pointer", transition: "0.2s opacity", fontSize: "0.9rem"
                    }} onMouseOver={e => e.currentTarget.style.opacity = "0.9"} onMouseOut={e => e.currentTarget.style.opacity = "1"}>
                        <Save size={18} /> Save & Sync Real-time
                    </button>
                )}
            </div>
        </div>
    );
}
