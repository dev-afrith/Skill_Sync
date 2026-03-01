"use client";

import { useState, useEffect } from "react";
import { User, Users, Plus, X, Search, GraduationCap, CheckCircle2 } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";

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

export default function StudentAllocationPage() {
    const [faculties, setFaculties] = useState<any[]>([]);
    const [students, setStudents] = useState<any[]>([]);

    const [selectedFaculty, setSelectedFaculty] = useState<any | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    // Load Faculties & Students
    useEffect(() => {
        // Fetch Faculty
        const qFaculty = query(collection(db, "users"), where("role", "==", "FACULTY"));
        const unsubFac = onSnapshot(qFaculty, (snap) => {
            const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setFaculties(list);
            if (list.length > 0 && !selectedFaculty) {
                setSelectedFaculty(list[0]);
            }
        });

        // Fetch Students
        const qStudents = query(collection(db, "users"), where("role", "==", "STUDENT"));
        const unsubStu = onSnapshot(qStudents, (snap) => {
            setStudents(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        return () => {
            unsubFac();
            unsubStu();
        };
    }, []);

    const toggleStudentAssignment = async (student: any) => {
        if (!selectedFaculty) return;

        const isAssigned = student.assignedFacultyIds?.includes(selectedFaculty.id);
        const studentRef = doc(db, "users", student.id);

        try {
            if (isAssigned) {
                await updateDoc(studentRef, {
                    assignedFacultyIds: arrayRemove(selectedFaculty.id)
                });
            } else {
                await updateDoc(studentRef, {
                    assignedFacultyIds: arrayUnion(selectedFaculty.id)
                });
            }
        } catch (error) {
            console.error("Failed to update allocation:", error);
            alert("Error updating assignment. Check console.");
        }
    };

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.registerNumber || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="ds-page-container fade-in">
            <header className="ds-page-header">
                <div>
                    <h1 className="ds-page-title" style={{ color: V.text }}>Student Allocation</h1>
                    <p className="ds-page-subtitle" style={{ color: V.dim }}>Assign students to specific faculty members in real-time</p>
                </div>
            </header>

            <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: "24px" }}>

                {/* Left: Faculty List */}
                <div className="ds-card" style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column", height: "calc(100vh - 180px)", background: V.card, border: `1px solid ${V.border}`, borderRadius: "18px" }}>
                    <div style={{ padding: "20px 24px", borderBottom: `1px solid ${V.border}`, background: V.surface }}>
                        <h3 style={{ fontSize: "1rem", fontWeight: 700, margin: 0, display: "flex", alignItems: "center", gap: "8px", color: V.text }}>
                            <Users size={18} color={V.accent} />
                            Faculty Roster ({faculties.length})
                        </h3>
                    </div>

                    <div style={{ overflowY: "auto", flex: 1, padding: "12px", background: V.card }}>
                        {faculties.map(faculty => (
                            <button
                                key={faculty.id}
                                onClick={() => setSelectedFaculty(faculty)}
                                style={{
                                    width: "100%", textAlign: "left", padding: "16px", borderRadius: "12px", border: "none",
                                    background: selectedFaculty?.id === faculty.id ? V.accentSoft : "transparent",
                                    marginBottom: "8px", cursor: "pointer", transition: "all 0.2s",
                                    display: "flex", alignItems: "center", gap: "12px"
                                }}
                            >
                                <div style={{
                                    width: "40px", height: "40px", borderRadius: "50%",
                                    background: selectedFaculty?.id === faculty.id ? V.accent : V.hover,
                                    color: selectedFaculty?.id === faculty.id ? "white" : V.text,
                                    display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.9rem"
                                }}>
                                    {faculty.name.substring(0, 2).toUpperCase()}
                                </div>
                                <div style={{ overflow: "hidden" }}>
                                    <div style={{ fontWeight: 600, color: V.text, fontSize: "0.95rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                        {faculty.name}
                                    </div>
                                    <div style={{ fontSize: "0.8rem", color: V.dim, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginTop: "2px" }}>
                                        {faculty.subject || faculty.department || "No Subject"}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right: Allocation Panel */}
                <div className="ds-card" style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 180px)", background: V.card, border: `1px solid ${V.border}`, borderRadius: "18px", padding: "24px" }}>
                    {selectedFaculty ? (
                        <>
                            <div style={{ marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                                <div>
                                    <h2 style={{ fontSize: "1.25rem", fontWeight: 800, margin: "0 0 4px 0", color: V.text }}>Managing: {selectedFaculty.name}</h2>
                                    <p style={{ color: V.dim, margin: 0, fontSize: "0.9rem" }}>Toggle the checkbox to assign or unassign students instantly.</p>
                                </div>
                                <div style={{ position: "relative", width: "260px" }}>
                                    <Search size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: V.muted }} />
                                    <input
                                        type="text"
                                        placeholder="Search student or ID..."
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                        style={{ width: "100%", padding: "10px 14px 10px 38px", borderRadius: "8px", border: `1px solid ${V.border}`, background: V.surface, color: V.text, fontSize: "0.9rem", outline: "none" }}
                                    />
                                </div>
                            </div>

                            <div style={{ flex: 1, overflowY: "auto", border: `1px solid ${V.border}`, borderRadius: "12px" }}>
                                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                    <thead style={{ background: V.surface, position: "sticky", top: 0, zIndex: 1 }}>
                                        <tr>
                                            <th style={{ padding: "16px", textAlign: "left", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em", color: V.muted, borderBottom: `1px solid ${V.border}` }}>Status</th>
                                            <th style={{ padding: "16px", textAlign: "left", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em", color: V.muted, borderBottom: `1px solid ${V.border}` }}>Student</th>
                                            <th style={{ padding: "16px", textAlign: "left", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em", color: V.muted, borderBottom: `1px solid ${V.border}` }}>Register No.</th>
                                            <th style={{ padding: "16px", textAlign: "left", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em", color: V.muted, borderBottom: `1px solid ${V.border}` }}>Department</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredStudents.length > 0 ? filteredStudents.map((student, i) => {
                                            const isAssigned = student.assignedFacultyIds?.includes(selectedFaculty.id);
                                            return (
                                                <tr key={student.id} style={{ borderBottom: `1px solid ${V.border}`, background: i % 2 === 0 ? "transparent" : V.hover, transition: "background 0.2s" }} className="hover-row">
                                                    <td style={{ padding: "16px", verticalAlign: "middle" }}>
                                                        <button
                                                            onClick={() => toggleStudentAssignment(student)}
                                                            style={{
                                                                width: "28px", height: "28px", borderRadius: "8px", border: "none", cursor: "pointer",
                                                                background: isAssigned ? V.accent : V.surface,
                                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                                transition: "all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
                                                                border: isAssigned ? "none" : `1px solid ${V.border}`
                                                            }}
                                                        >
                                                            {isAssigned ? <CheckCircle2 size={16} color="white" /> : <Plus size={16} color={V.muted} />}
                                                        </button>
                                                    </td>
                                                    <td style={{ padding: "16px", fontWeight: 600 }}>
                                                        <div style={{ display: "flex", alignItems: "center", gap: "12px", color: V.text }}>
                                                            <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: V.hover, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", color: V.dim, border: `1px solid ${V.border}` }}>
                                                                {student.name.substring(0, 2).toUpperCase()}
                                                            </div>
                                                            {student.name}
                                                        </div>
                                                    </td>
                                                    <td style={{ padding: "16px", color: V.dim, fontSize: "0.9rem", fontFamily: "monospace" }}>
                                                        {student.registerNumber || "N/A"}
                                                    </td>
                                                    <td style={{ padding: "16px", color: V.dim, fontSize: "0.9rem" }}>
                                                        {student.department}
                                                    </td>
                                                </tr>
                                            );
                                        }) : (
                                            <tr>
                                                <td colSpan={4} style={{ padding: "40px", textAlign: "center", color: V.muted }}>
                                                    <GraduationCap size={32} style={{ margin: "0 auto 12px", opacity: 0.5 }} />
                                                    No students found matching your search.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", color: V.muted, opacity: 0.7 }}>
                            <Users size={48} style={{ marginBottom: "16px" }} />
                            <h3 style={{ color: V.text, margin: "0 0 8px 0" }}>Select a Faculty Member</h3>
                            <p style={{ color: V.dim, margin: 0 }}>Choose a faculty from the roster to manage their student allocations.</p>
                        </div>
                    )}
                </div>

            </div>

            <style jsx>{`
                .hover-row:hover { background: var(--ds-hover) !important; }
            `}</style>
        </div>
    );
}
