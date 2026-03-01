"use client";

import { CheckCircle, Circle, ArrowRight } from "lucide-react";

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
};
const FONT_H = "var(--font-display, 'Outfit', sans-serif)";

const RoadmapStep = ({ title, desc, status, difficulty, videoUrl }: any) => (
    <div style={{ display: "flex", gap: 24, position: "relative", paddingBottom: 32 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 4 }}>
            {status === "completed"
                ? <CheckCircle color="#10b981" fill="#10b98120" />
                : <Circle color={V.muted} />}
            <div style={{ flex: 1, width: 2, background: V.hover, marginTop: 8 }} />
        </div>
        <div style={{
            flex: 1, padding: 20,
            background: V.card, border: `1px solid ${V.border}`,
            borderRadius: 16, cursor: "pointer",
            transition: "border-color 0.2s, background 0.3s",
        }}>
            <div style={{
                display: "inline-block", fontSize: "0.7rem", fontWeight: 700,
                textTransform: "uppercase", padding: "4px 8px",
                background: V.accentSoft, color: V.accent,
                border: `1px solid ${V.accentBorder}`,
                borderRadius: 6, marginBottom: 12, fontFamily: FONT_H,
                letterSpacing: "0.06em",
            }}>
                {difficulty}
            </div>
            <h4 style={{ margin: "0 0 8px", fontFamily: FONT_H, fontWeight: 800, color: V.text, fontSize: "1rem" }}>{title}</h4>
            <p style={{ fontSize: "0.85rem", color: V.dim, margin: "0 0 16px", lineHeight: 1.5 }}>{desc}</p>
            <a
                href={videoUrl || "https://www.youtube.com/results?search_query=programming+tutorial"}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                    background: "none", border: "none", color: V.accent,
                    fontSize: "0.85rem", fontWeight: 600,
                    display: "flex", alignItems: "center", gap: 8,
                    cursor: "pointer", padding: 0, textDecoration: "none"
                }}
            >
                Continue Learning <ArrowRight size={14} />
            </a>
        </div>
    </div>
);

export default function SkillRoadmap() {
    const steps = [
        { title: "Advanced React Patterns", desc: "Master HOCs, Render Props, and Custom Hooks for enterprise apps.", status: "completed", difficulty: "Intermediate", videoUrl: "https://www.youtube.com/watch?v=bMknfKXIFA8" },
        { title: "Node.js Microservices", desc: "Building scalable backend architectures with RabbitMQ and Redis.", status: "current", difficulty: "Advanced", videoUrl: "https://www.youtube.com/watch?v=1NCxQNgG_PE" },
        { title: "System Design for AI", desc: "Scaling LLM inferencing and vector database integrations.", status: "pending", difficulty: "Expert", videoUrl: "https://www.youtube.com/watch?v=bA31KhaLZNo" },
        { title: "Cloud Native Deployment", desc: "Kubernetes orchestration and CI/CD automation with GitHub Actions.", status: "pending", difficulty: "Advanced", videoUrl: "https://www.youtube.com/watch?v=X48VuDVv0do" },
    ];

    return (
        <div style={{ marginTop: 40 }}>
            <h3 style={{ fontFamily: FONT_H, fontSize: "1.25rem", fontWeight: 800, color: V.text, marginBottom: 8, letterSpacing: "-0.02em" }}>
                AI-Generated Learning Roadmap
            </h3>
            <p style={{ color: V.dim, fontSize: "0.85rem", marginBottom: 32 }}>
                Personalized path based on your current gap in Cloud and AI categories.
            </p>
            <div>
                {steps.map((s, i) => <RoadmapStep key={i} {...s} />)}
            </div>
        </div>
    );
}
