"use client";

import { useState, useEffect } from "react";
import MaterialUpload from "@/components/MaterialUpload";
import { getMaterials, type Material } from "@/lib/materialsStore";
import { Upload, BookOpen, FileText, Clock, Users } from "lucide-react";

const extIcon: Record<string, string> = {
    PDF: "📄", DOC: "📝", DOCX: "📝", PPT: "📊", PPTX: "📊",
};

const V = {
    card: "var(--ds-card)",
    border: "var(--ds-border)",
    text: "var(--ds-text)",
    dim: "var(--ds-text-dim)",
    muted: "var(--ds-text-muted)",
    accent: "var(--ds-accent)",
    accentSoft: "var(--ds-accent-soft)",
    accentBorder: "var(--ds-accent-border)",
    hover: "var(--ds-hover)",
    surface: "var(--ds-surface)",
};
const FONT_H = "var(--font-display, 'Outfit', sans-serif)";

export default function MaterialsPage() {
    const [materials, setMaterials] = useState<Material[]>([]);

    // Load from the shared store on mount
    useEffect(() => {
        setMaterials(getMaterials());
    }, []);

    const handleUpload = (m: Material) => {
        setMaterials((prev) => [m, ...prev]);
    };

    return (
        <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", flexDirection: "column", gap: 32 }}>
            {/* Header */}
            <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: V.accent, boxShadow: `0 0 8px ${V.accent}`, display: "inline-block" }} />
                    <span style={{ color: V.accent, fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: FONT_H }}>
                        Study Material Management
                    </span>
                </div>
                <h1 style={{ fontFamily: FONT_H, fontSize: "1.9rem", fontWeight: 900, letterSpacing: "-0.03em", color: V.text, margin: 0 }}>
                    Upload Study Materials
                </h1>
                <p style={{ color: V.dim, marginTop: 6, fontSize: "0.9rem" }}>
                    Materials uploaded here automatically appear in the Student Dashboard under{" "}
                    <strong style={{ color: V.text }}>"Curriculum → Study Materials from Teacher"</strong>.
                </p>
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 20 }}>
                {[
                    { label: "Total Materials", value: materials.length, icon: BookOpen, color: V.accent },
                    { label: "This Week", value: materials.filter(m => m.uploadedAt.includes("Feb 2")).length, icon: Upload, color: "#10b981" },
                    { label: "Classes Covered", value: new Set(materials.map(m => m.assignedClass)).size, icon: Users, color: "#8b5cf6" },
                    { label: "Last Upload", value: materials[0] ? "Today" : "—", icon: Clock, color: "#f59e0b" },
                ].map((s) => (
                    <div key={s.label} style={{ background: V.card, border: `1px solid ${V.border}`, borderRadius: "16px", padding: "18px 20px", display: "flex", alignItems: "center", gap: 16 }}>
                        <div style={{ width: 44, height: 44, borderRadius: "12px", background: `${s.color}15`, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${s.color}30`, flexShrink: 0 }}>
                            <s.icon size={20} color={s.color} />
                        </div>
                        <div>
                            <div style={{ fontSize: "1.3rem", fontWeight: 800, color: V.text }}>{s.value}</div>
                            <div style={{ fontSize: "0.75rem", color: V.dim, fontWeight: 600 }}>{s.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24 }}>
                {/* Upload Form */}
                <div style={{ background: V.card, border: `1px solid ${V.border}`, borderRadius: "16px", padding: "28px" }}>
                    <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: V.text, marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px", fontFamily: FONT_H }}>
                        <Upload size={18} color={V.accent} /> Upload New Material
                    </h2>
                    <MaterialUpload onUploaded={handleUpload} />
                </div>

                {/* Uploaded Materials List */}
                <div style={{ background: V.card, border: `1px solid ${V.border}`, borderRadius: "16px", padding: "28px" }}>
                    <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: V.text, marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px", fontFamily: FONT_H }}>
                        <FileText size={18} color={V.accent} /> All Materials ({materials.length})
                    </h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        {materials.length === 0 ? (
                            <div style={{ textAlign: "center", padding: "30px", color: V.muted, fontSize: "0.9rem", background: V.hover, borderRadius: 12, border: `1px dashed ${V.border}` }}>
                                No materials uploaded yet.
                            </div>
                        ) : (
                            materials.map((m) => (
                                <div key={m.id} style={{
                                    display: "flex", alignItems: "center", gap: "16px",
                                    padding: "16px 20px", background: V.hover,
                                    border: `1px solid ${V.border}`, borderRadius: "12px",
                                    flexWrap: "wrap",
                                }}>
                                    <div style={{ fontSize: "1.8rem" }}>{extIcon[m.fileType] || "📁"}</div>
                                    <div style={{ flex: 1, minWidth: "180px" }}>
                                        <div style={{ fontWeight: 700, color: V.text, fontSize: "0.95rem" }}>{m.title}</div>
                                        {m.description && (
                                            <div style={{ fontSize: "0.8rem", color: V.dim, marginTop: "4px" }}>{m.description}</div>
                                        )}
                                        <div style={{ fontSize: "0.75rem", color: V.muted, marginTop: "6px" }}>{m.fileName}</div>
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "6px", alignItems: "flex-end" }}>
                                        <span style={{ background: V.accentSoft, color: V.accent, border: `1px solid ${V.accentBorder}`, padding: "3px 10px", borderRadius: "20px", fontSize: "0.72rem", fontWeight: 700 }}>
                                            {m.assignedClass}
                                        </span>
                                        <span style={{ fontSize: "0.72rem", color: V.dim, display: "flex", alignItems: "center", gap: "4px" }}>
                                            <Clock size={11} /> {m.uploadedAt}
                                        </span>
                                        {m.uploadedBy && (
                                            <span style={{ fontSize: "0.7rem", color: V.muted }}>by {m.uploadedBy}</span>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
