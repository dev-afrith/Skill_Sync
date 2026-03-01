"use client";

import { useState, useEffect } from "react";
import { User, Mail, Shield, BookOpen, GraduationCap, Building2, UserPlus, Save, Loader2, Plus, X } from "lucide-react";

const subjectsList = [
    "Numerical Methods",
    "Database Management System",
    "Embedded Systems",
    "Design and Analysis of Algorithm",
    "Software Engineering"
];

const departmentsList = [
    "Computer Science",
    "Information Technology",
    "Electronics",
    "Electrical Engineering",
    "Mechanical",
    "Mathematics"
];

export default function UserManagementPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState<"STUDENT" | "FACULTY">("STUDENT");
    const [registerNumber, setRegisterNumber] = useState("");
    const [department, setDepartment] = useState(departmentsList[0]);
    const [subject, setSubject] = useState(subjectsList[0]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [usersList, setUsersList] = useState<any[]>([]);

    const fetchUsersList = async () => {
        try {
            const res = await fetch("/api/admin/users");
            if (res.ok) {
                const data = await res.json();
                setUsersList(data);
            }
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        fetchUsersList();
    }, []);

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        if (!name || !email) {
            setError("Name and Email are mandatory.");
            setLoading(false);
            return;
        }

        try {
            const payload: any = { name, email, role, department };
            if (role === "STUDENT") {
                if (!registerNumber) throw new Error("Register number required");
                payload.registerNumber = registerNumber;
            } else {
                payload.subject = subject;
            }

            const res = await fetch("/api/admin/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "create", payload })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to create user");

            setSuccess(data.message || `Successfully created ${role.toLowerCase()} account for ${name}`);
            setName("");
            setEmail("");
            if (role === "STUDENT") setRegisterNumber("");

            fetchUsersList();
        } catch (err: any) {
            setError(err.message || "Failed to create user");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (emailToDelete: string) => {
        if (!confirm(`Are you sure you want to permanently delete ${emailToDelete}?`)) return;
        try {
            const res = await fetch("/api/admin/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "delete", payload: { email: emailToDelete } })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to delete from database");

            setSuccess(`Deleted user ${emailToDelete}`);
            await fetchUsersList();
        } catch (e: any) {
            setError(e.message || "Failed to delete user");
        }
    };

    return (
        <div className="ds-page-container fade-in">
            <header className="ds-page-header">
                <div>
                    <h1 className="ds-page-title">User Management</h1>
                    <p className="ds-page-subtitle">Provision official accounts for University Students and Faculty</p>
                </div>
            </header>

            {error && (
                <div style={{ background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", padding: "16px", borderRadius: "12px", marginBottom: "24px", border: "1px solid rgba(239, 68, 68, 0.2)", display: "flex", alignItems: "center", gap: "10px" }}>
                    <Shield size={18} />
                    {error}
                </div>
            )}

            {success && (
                <div style={{ background: "rgba(16, 185, 129, 0.1)", color: "#10b981", padding: "16px", borderRadius: "12px", marginBottom: "24px", border: "1px solid rgba(16, 185, 129, 0.2)", display: "flex", alignItems: "center", gap: "10px" }}>
                    <Shield size={18} />
                    {success}
                </div>
            )}

            <div className="admin-grid" style={{ display: "grid", gap: "24px", gridTemplateColumns: "1fr" }}>
                <div className="ds-card" style={{ maxWidth: "600px", background: "var(--ds-card, rgba(255,255,255,0.025))", border: "1px solid var(--ds-border, rgba(255,255,255,0.06))", padding: "24px", borderRadius: "16px" }}>
                    <div className="ds-card-header" style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
                        <div className="ds-card-icon" style={{ background: "var(--ds-accent-soft)", color: "var(--ds-accent)", width: "48px", height: "48px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <UserPlus size={24} />
                        </div>
                        <div>
                            <h2 className="ds-card-title" style={{ fontSize: "1.25rem", fontWeight: 800, margin: "0 0 4px 0", color: "var(--ds-text, #fff)" }}>Create New Account</h2>
                            <p className="ds-card-subtitle" style={{ color: "var(--ds-text-dim)", margin: 0, fontSize: "0.9rem" }}>Default password will be set to: password123</p>
                        </div>
                    </div>

                    <form onSubmit={handleCreateUser} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                        <div>
                            <label className="form-label" style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--ds-text-muted)", marginBottom: "8px", display: "block", textTransform: "uppercase", letterSpacing: "0.05em" }}>Account Type</label>
                            <div style={{ display: "flex", gap: "12px" }}>
                                <button type="button" onClick={() => setRole("STUDENT")} style={{ flex: 1, padding: "14px", borderRadius: "12px", border: role === "STUDENT" ? "2px solid var(--ds-accent)" : "2px solid var(--ds-border)", background: role === "STUDENT" ? "var(--ds-accent-soft)" : "transparent", color: role === "STUDENT" ? "var(--ds-accent)" : "var(--ds-text)", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", transition: "all 0.2s" }}>
                                    <GraduationCap size={18} /> Student
                                </button>
                                <button type="button" onClick={() => setRole("FACULTY")} style={{ flex: 1, padding: "14px", borderRadius: "12px", border: role === "FACULTY" ? "2px solid var(--ds-accent)" : "2px solid var(--ds-border)", background: role === "FACULTY" ? "var(--ds-accent-soft)" : "transparent", color: role === "FACULTY" ? "var(--ds-accent)" : "var(--ds-text)", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", transition: "all 0.2s" }}>
                                    <BookOpen size={18} /> Faculty
                                </button>
                            </div>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                            <div>
                                <label className="form-label" style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--ds-text-dim)", marginBottom: "8px", display: "block" }}>Full Name</label>
                                <div style={{ position: "relative" }}>
                                    <User size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--ds-text-muted)" }} />
                                    <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="e.g. John Doe" style={{ width: "100%", padding: "12px 14px 12px 40px", borderRadius: "10px", border: "1px solid var(--ds-border)", background: "var(--ds-search-bg)", color: "var(--ds-text)", fontSize: "0.95rem", outline: "none" }} />
                                </div>
                            </div>
                            <div>
                                <label className="form-label" style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--ds-text-dim)", marginBottom: "8px", display: "block" }}>Email Address</label>
                                <div style={{ position: "relative" }}>
                                    <Mail size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--ds-text-muted)" }} />
                                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="john@skillsync.edu" style={{ width: "100%", padding: "12px 14px 12px 40px", borderRadius: "10px", border: "1px solid var(--ds-border)", background: "var(--ds-search-bg)", color: "var(--ds-text)", fontSize: "0.95rem", outline: "none" }} />
                                </div>
                            </div>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                            <div>
                                <label className="form-label" style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--ds-text-dim)", marginBottom: "8px", display: "block" }}>Department</label>
                                <div style={{ position: "relative" }}>
                                    <Building2 size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--ds-text-muted)" }} />
                                    <select value={department} onChange={e => setDepartment(e.target.value)} style={{ width: "100%", padding: "12px 14px 12px 40px", borderRadius: "10px", border: "1px solid var(--ds-border)", background: "var(--ds-search-bg)", color: "var(--ds-text)", fontSize: "0.95rem", appearance: "none", outline: "none" }}>
                                        {departmentsList.map(dep => <option key={dep} value={dep}>{dep}</option>)}
                                    </select>
                                </div>
                            </div>

                            {role === "STUDENT" ? (
                                <div>
                                    <label className="form-label" style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--ds-text-dim)", marginBottom: "8px", display: "block" }}>Register Number</label>
                                    <input type="text" value={registerNumber} onChange={e => setRegisterNumber(e.target.value)} required placeholder="e.g. REG2024CS01" style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1px solid var(--ds-border)", background: "var(--ds-search-bg)", color: "var(--ds-text)", fontSize: "0.95rem", outline: "none" }} />
                                </div>
                            ) : (
                                <div>
                                    <label className="form-label" style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--ds-text-dim)", marginBottom: "8px", display: "block" }}>Designated Subject</label>
                                    <select value={subject} onChange={e => setSubject(e.target.value)} style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1px solid var(--ds-border)", background: "var(--ds-search-bg)", color: "var(--ds-text)", fontSize: "0.95rem", outline: "none" }}>
                                        {subjectsList.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                                    </select>
                                </div>
                            )}
                        </div>

                        <div style={{ marginTop: "12px" }}>
                            <button type="submit" disabled={loading} style={{ width: "100%", padding: "14px", background: "var(--ds-accent)", color: "white", borderRadius: "10px", border: "none", fontWeight: 700, fontSize: "0.95rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}>
                                {loading ? <Loader2 size={18} className="spin" /> : <><Save size={18} /> Provision {role.charAt(0) + role.slice(1).toLowerCase()} Account</>}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Students List Table */}
            <div className="ds-card" style={{ marginTop: "24px", background: "var(--ds-card, rgba(255,255,255,0.025))", border: "1px solid var(--ds-border, rgba(255,255,255,0.06))", padding: "24px", borderRadius: "16px" }}>
                <div className="ds-card-header" style={{ marginBottom: "20px" }}>
                    <h2 style={{ fontSize: "1.1rem", fontWeight: 800, margin: 0, color: "var(--ds-text)" }}>Manage Students</h2>
                    <p style={{ color: "var(--ds-text-dim)", margin: 0, fontSize: "0.85rem" }}>View and remove system access for students.</p>
                </div>

                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
                        <thead>
                            <tr style={{ borderBottom: "1px solid var(--ds-border)" }}>
                                <th style={{ textAlign: "left", padding: "12px 14px", color: "var(--ds-text-dim)", textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "0.05em" }}>Name</th>
                                <th style={{ textAlign: "left", padding: "12px 14px", color: "var(--ds-text-dim)", textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "0.05em" }}>Email</th>
                                <th style={{ textAlign: "left", padding: "12px 14px", color: "var(--ds-text-dim)", textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "0.05em" }}>Role</th>
                                <th style={{ textAlign: "left", padding: "12px 14px", color: "var(--ds-text-dim)", textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "0.05em" }}>Department</th>
                                <th style={{ textAlign: "right", padding: "12px 14px", color: "var(--ds-text-dim)", textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "0.05em" }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usersList.filter(u => u.role === "STUDENT").map((u, i) => (
                                <tr key={u.id || i} style={{ borderBottom: "1px solid var(--ds-border)", background: i % 2 === 0 ? "transparent" : "var(--ds-hover)" }}>
                                    <td style={{ padding: "14px", fontWeight: 700, color: "var(--ds-text)" }}>{u.name}</td>
                                    <td style={{ padding: "14px", color: "var(--ds-text-dim)" }}>{u.email}</td>
                                    <td style={{ padding: "14px" }}>
                                        <span style={{ background: "rgba(16,185,129,0.1)", color: "#10b981", padding: "4px 10px", borderRadius: "20px", fontSize: "0.7rem", fontWeight: 800 }}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td style={{ padding: "14px", color: "var(--ds-text-muted)", fontSize: "0.8rem" }}>{u.department}</td>
                                    <td style={{ padding: "14px", textAlign: "right" }}>
                                        <button onClick={() => handleDeleteUser(u.email)} style={{ background: "transparent", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)", padding: "6px 14px", borderRadius: "8px", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer", transition: "0.2s" }} onMouseOver={e => e.currentTarget.style.background = "rgba(239,68,68,0.1)"} onMouseOut={e => e.currentTarget.style.background = "transparent"}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {usersList.filter(u => u.role === "STUDENT").length === 0 && (
                                <tr>
                                    <td colSpan={5} style={{ textAlign: "center", padding: "30px", color: "var(--ds-text-muted)" }}>No students found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Faculty List Table */}
            <div className="ds-card" style={{ marginTop: "24px", background: "var(--ds-card, rgba(255,255,255,0.025))", border: "1px solid var(--ds-border, rgba(255,255,255,0.06))", padding: "24px", borderRadius: "16px" }}>
                <div className="ds-card-header" style={{ marginBottom: "20px" }}>
                    <h2 style={{ fontSize: "1.1rem", fontWeight: 800, margin: 0, color: "var(--ds-text)" }}>Manage Faculty</h2>
                    <p style={{ color: "var(--ds-text-dim)", margin: 0, fontSize: "0.85rem" }}>View and remove system access for faculty members.</p>
                </div>

                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
                        <thead>
                            <tr style={{ borderBottom: "1px solid var(--ds-border)" }}>
                                <th style={{ textAlign: "left", padding: "12px 14px", color: "var(--ds-text-dim)", textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "0.05em" }}>Name</th>
                                <th style={{ textAlign: "left", padding: "12px 14px", color: "var(--ds-text-dim)", textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "0.05em" }}>Email</th>
                                <th style={{ textAlign: "left", padding: "12px 14px", color: "var(--ds-text-dim)", textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "0.05em" }}>Role</th>
                                <th style={{ textAlign: "left", padding: "12px 14px", color: "var(--ds-text-dim)", textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "0.05em" }}>Department</th>
                                <th style={{ textAlign: "right", padding: "12px 14px", color: "var(--ds-text-dim)", textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "0.05em" }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usersList.filter(u => u.role === "FACULTY").map((u, i) => (
                                <tr key={u.id || i} style={{ borderBottom: "1px solid var(--ds-border)", background: i % 2 === 0 ? "transparent" : "var(--ds-hover)" }}>
                                    <td style={{ padding: "14px", fontWeight: 700, color: "var(--ds-text)" }}>{u.name}</td>
                                    <td style={{ padding: "14px", color: "var(--ds-text-dim)" }}>{u.email}</td>
                                    <td style={{ padding: "14px" }}>
                                        <span style={{ background: "var(--ds-accent-soft)", color: "var(--ds-accent)", padding: "4px 10px", borderRadius: "20px", fontSize: "0.7rem", fontWeight: 800 }}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td style={{ padding: "14px", color: "var(--ds-text-muted)", fontSize: "0.8rem" }}>{u.department}</td>
                                    <td style={{ padding: "14px", textAlign: "right" }}>
                                        <button onClick={() => handleDeleteUser(u.email)} style={{ background: "transparent", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)", padding: "6px 14px", borderRadius: "8px", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer", transition: "0.2s" }} onMouseOver={e => e.currentTarget.style.background = "rgba(239,68,68,0.1)"} onMouseOut={e => e.currentTarget.style.background = "transparent"}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {usersList.filter(u => u.role === "FACULTY").length === 0 && (
                                <tr>
                                    <td colSpan={5} style={{ textAlign: "center", padding: "30px", color: "var(--ds-text-muted)" }}>No faculty found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
