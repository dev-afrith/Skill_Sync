"use client";

import { useState, useRef } from "react";
import { Upload, FileText, X, CheckCircle, Plus } from "lucide-react";
import { saveMaterial, type Material } from "@/lib/materialsStore";

const CLASSES = ["CSE-A (Year 2)", "CSE-B (Year 2)", "CSE-A (Year 3)", "All Classes"];

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

export default function MaterialUpload({ onUploaded }: { onUploaded?: (m: Material) => void }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [assignedClass, setAssignedClass] = useState(CLASSES[0]);
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const fileRef = useRef<HTMLInputElement>(null);

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (!f) return;
        const allowed = ["application/pdf", "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/vnd.ms-powerpoint",
            "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        ];
        if (!allowed.includes(f.type)) {
            setError("Only PDF, DOC, DOCX, PPT, PPTX files are allowed.");
            return;
        }
        setError("");
        setFile(f);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const f = e.dataTransfer.files[0];
        if (f) {
            const evt = { target: { files: [f] } } as unknown as React.ChangeEvent<HTMLInputElement>;
            handleFile(evt);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !file) { setError("Title and file are required."); return; }
        setError("");
        setUploading(true);
        await new Promise((r) => setTimeout(r, 1200));
        const material: Material = {
            id: Date.now().toString(),
            title,
            description,
            assignedClass,
            fileName: file.name,
            fileType: file.name.split(".").pop()?.toUpperCase() || "FILE",
            uploadedAt: new Date().toLocaleString(),
            uploadedBy: "Ms. Sarah Smith",
        };
        saveMaterial(material); // ← persist to localStorage for student view
        onUploaded?.(material);
        setUploading(false);
        setSuccess(true);
        setTitle(""); setDescription(""); setFile(null); setAssignedClass(CLASSES[0]);
        setTimeout(() => setSuccess(false), 3000);
    };

    const extIcon: Record<string, string> = {
        PDF: "📄", DOC: "📝", DOCX: "📝", PPT: "📊", PPTX: "📊",
    };

    return (
        <form onSubmit={handleSubmit}>
            {success && (
                <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px 18px", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: "12px", marginBottom: "20px", color: "#10b981", fontWeight: 600 }}>
                    <CheckCircle size={18} /> Material uploaded! It will appear in Student Dashboard under "Study Materials from Teacher".
                </div>
            )}
            {error && (
                <div style={{ padding: "12px 18px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "12px", marginBottom: "16px", color: "#f87171", fontSize: "0.85rem" }}>
                    {error}
                </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                {/* Left — fields */}
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <div>
                        <label style={{ fontSize: "0.8rem", fontWeight: 700, color: V.muted, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "8px" }}>
                            Title *
                        </label>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., Week 3 - Data Structures Notes"
                            style={{ width: "100%", background: V.surface, border: `1px solid ${V.border}`, borderRadius: "10px", padding: "12px 16px", color: V.text, fontSize: "0.9rem", outline: "none" }}
                        />
                    </div>

                    <div>
                        <label style={{ fontSize: "0.8rem", fontWeight: 700, color: V.muted, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "8px" }}>
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Brief description of this material..."
                            rows={4}
                            style={{ width: "100%", background: V.surface, border: `1px solid ${V.border}`, borderRadius: "10px", padding: "12px 16px", color: V.text, fontSize: "0.9rem", outline: "none", resize: "vertical", fontFamily: "inherit" }}
                        />
                    </div>

                    <div>
                        <label style={{ fontSize: "0.8rem", fontWeight: 700, color: V.muted, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "8px" }}>
                            Assign to Class
                        </label>
                        <select
                            value={assignedClass}
                            onChange={(e) => setAssignedClass(e.target.value)}
                            style={{ width: "100%", background: V.surface, border: `1px solid ${V.border}`, borderRadius: "10px", padding: "12px 16px", color: V.text, fontSize: "0.9rem", outline: "none" }}
                        >
                            {CLASSES.map((c) => <option key={c} value={c} style={{ background: V.surface }}>{c}</option>)}
                        </select>
                    </div>
                </div>

                {/* Right — dropzone */}
                <div>
                    <label style={{ fontSize: "0.8rem", fontWeight: 700, color: V.muted, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "8px" }}>
                        Upload File * (PDF, DOC, PPT)
                    </label>
                    <div
                        onDrop={handleDrop}
                        onDragOver={(e) => e.preventDefault()}
                        onClick={() => fileRef.current?.click()}
                        style={{
                            border: `2px dashed ${file ? "#10b981" : V.border}`,
                            borderRadius: "14px",
                            padding: "40px 20px",
                            textAlign: "center",
                            cursor: "pointer",
                            background: file ? "rgba(16,185,129,0.05)" : V.hover,
                            transition: "all 0.2s",
                            minHeight: "200px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "12px",
                        }}
                    >
                        {file ? (
                            <>
                                <div style={{ fontSize: "2rem" }}>{extIcon[file.name.split(".").pop()?.toUpperCase() || ""] || "📁"}</div>
                                <div style={{ fontWeight: 700, color: V.text, fontSize: "0.95rem" }}>{file.name}</div>
                                <div style={{ fontSize: "0.8rem", color: V.dim }}>{(file.size / 1024).toFixed(1)} KB</div>
                                <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                                    style={{ marginTop: "8px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171", padding: "6px 14px", borderRadius: "8px", cursor: "pointer", fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "6px" }}
                                >
                                    <X size={12} /> Remove
                                </button>
                            </>
                        ) : (
                            <>
                                <div style={{ width: 56, height: 56, borderRadius: "14px", background: V.accentSoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <Upload size={24} color={V.accent} />
                                </div>
                                <div>
                                    <p style={{ color: V.text, fontWeight: 700, marginBottom: "4px" }}>Drag & Drop or Click to Upload</p>
                                    <p style={{ color: V.dim, fontSize: "0.8rem" }}>Supports PDF, DOC, DOCX, PPT, PPTX</p>
                                </div>
                            </>
                        )}
                        <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.ppt,.pptx" onChange={handleFile} style={{ display: "none" }} />
                    </div>
                </div>
            </div>

            <button
                type="submit"
                disabled={uploading}
                style={{
                    marginTop: "28px",
                    padding: "14px 32px",
                    background: uploading ? V.accentSoft : V.accent,
                    border: "none",
                    borderRadius: "12px",
                    color: "white",
                    fontWeight: 700,
                    fontSize: "1rem",
                    cursor: uploading ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    transition: "opacity 0.2s",
                }}
            >
                {uploading ? (
                    <><span style={{ display: "inline-block", width: 18, height: 18, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.6s linear infinite" }} /> Uploading...</>
                ) : (
                    <><Plus size={18} /> Upload Material</>
                )}
            </button>
            <style>{`@keyframes spin { to { transform: rotate(360deg); }}`}</style>
        </form>
    );
}
