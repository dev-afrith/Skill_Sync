"use client";

import { Lightbulb } from "lucide-react";

export default function FacultyInsights() {
  const insights = [
    { title: "Engagement Trend", text: "Low participation detected in 'Assignment 4'. Consider a review session for 'Async Patterns'.", category: "Alert" },
    { title: "Skill Alignment", text: "Your class is 20% ahead of curriculum in 'Backend' but 15% behind in 'Unit Testing'.", category: "Insight" },
  ];

  return (
    <div style={{
      padding: "24px",
      marginTop: "24px",
      background: "rgba(23,23,26,0.7)",
      backdropFilter: "blur(12px)",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "16px",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
        <Lightbulb size={20} color="#f59e0b" />
        <h4 style={{ fontSize: "1.1rem", fontWeight: 700, color: "white", margin: 0 }}>
          AI Teaching Insights
        </h4>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        {insights.map((ins, i) => (
          <div key={i} style={{
            padding: "16px",
            background: "rgba(255,255,255,0.03)",
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.05)",
          }}>
            <div style={{
              display: "inline-block", fontSize: "0.65rem", fontWeight: 800,
              textTransform: "uppercase", background: "rgba(99,102,241,0.1)",
              color: "#6366f1", padding: "2px 8px", borderRadius: "4px", marginBottom: "12px",
            }}>
              {ins.category}
            </div>
            <h5 style={{ fontSize: "0.95rem", fontWeight: 600, color: "white", margin: "0 0 8px" }}>
              {ins.title}
            </h5>
            <p style={{ fontSize: "0.85rem", color: "#94a3b8", lineHeight: 1.5, margin: 0 }}>
              {ins.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
