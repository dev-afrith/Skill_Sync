"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, redirect } from "next/navigation";
import DashboardStats from "@/components/DashboardStats";
import ClientCharts from "@/components/ClientCharts";
import FacultyDashboard from "@/components/FacultyDashboard";
import { useStudentData } from "@/lib/hooks/useStudentData";
import { Sparkles } from "lucide-react";
import "./styles.css";

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    const role = (session?.user as any)?.role || "STUDENT";
    const name = session?.user?.name || "User";
    const email = session?.user?.email || "";

    if (status === "loading") {
        return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#6366f1", fontWeight: 700 }}>Loading Dashboard...</div>;
    }

    if (!session) return null;

    // ── Admin → dedicated admin dashboard
    if (role === "ADMIN") {
        redirect("/dashboard/admin");
        return null;
    }

    // ── Faculty → Full Faculty Dashboard
    if (role === "FACULTY") {
        return (
            <div className="dashboard-content">
                <FacultyDashboard teacherName={name} teacherEmail={email} />
            </div>
        );
    }

    // ── Student → Personal Dashboard
    const { student, insights, loading: studentLoading } = useStudentData(email);

    // Dynamic charts based on real-time data
    const performanceData = student?.testHistory?.map((t: any, i: number) => ({
        name: `Test ${i + 1}`,
        score: t.score,
        avg: insights?.avgMarks || 75
    })) || [
            { name: "Week 1", score: 65, avg: 72 },
            { name: "Week 2", score: 68, avg: 73 },
            { name: "Week 3", score: 75, avg: 72 },
            { name: "Week 4", score: 82, avg: 75 },
        ];

    const skillGapData = student?.skills?.map((s: any) => ({
        subject: s.name,
        student: s.level,
        industry: 85 // Mock industry expectation
    })) || [
            { subject: "React", student: 85, industry: 90 },
            { subject: "Node.js", student: 70, industry: 85 },
            { subject: "SQL", student: 90, industry: 80 },
        ];

    const techTrends = [
        { name: "Generative AI & LLMs", pct: 95, label: "+45%" },
        { name: "Cloud Native Security", pct: 80, label: "+22%" },
        { name: "Full-Stack Efficiency", pct: 75, label: "+18%" },
        { name: "Edge Computing", pct: 65, label: "+15%" },
    ];

    if (studentLoading) {
        return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#6366f1", fontWeight: 700 }}>Loading AI Profile...</div>;
    }

    return (
        <div className="dashboard-content">
            <div className="welcome-section">
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--ds-accent)", boxShadow: "0 0 8px var(--ds-accent)" }} />
                    <span style={{ color: "var(--ds-accent)", fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em" }}>SkillSync AI Engine Active</span>
                </div>
                <h1>
                    Welcome back,{" "}
                    <span className="text-gradient">{session.user?.name}</span>
                </h1>
                <p>Academic performance and real-time skill alignment are automatically synced from faculty records.</p>
            </div>

            <DashboardStats role="STUDENT" />

            <div className="charts-grid">
                {/* AI recommendations based on marks */}
                <div className="glass chart-container full" style={{ padding: "24px", background: "var(--ds-accent-soft)", border: "1px solid var(--ds-accent-border)" }}>
                    <div className="chart-header" style={{ marginBottom: "16px" }}>
                        <h3 style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--ds-accent)" }}>
                            <Sparkles size={20} /> Real-time AI Learning Recommendations
                        </h3>
                        <p>Personalized insights generated from your recent marks and skill levels</p>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "12px" }}>
                        {insights?.recommendations?.map((rec: string, i: number) => (
                            <div key={i} style={{ padding: "14px 16px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "12px", display: "flex", gap: "12px" }}>
                                <div style={{ minWidth: "6px", height: "100%", background: rec.startsWith("Critical") ? "var(--ds-danger)" : rec.startsWith("Warning") ? "#f59e0b" : "var(--ds-accent)", borderRadius: "10px" }} />
                                <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.9)", lineHeight: "1.5", margin: 0 }}>{rec}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="glass chart-container full">
                    <div className="chart-header">
                        <h3>My Performance Trend</h3>
                        <p>AI-predicted trajectory based on current engagement logs</p>
                    </div>
                    <div style={{ height: "300px", width: "100%" }}>
                        <ClientCharts type="area" data={performanceData} dataKey="score" dataKey2="avg" colors={["#3b82f6", "#60a5fa"]} />
                    </div>
                </div>

                <div className="glass chart-container">
                    <div className="chart-header">
                        <h3>Skill Gap Analyzer</h3>
                        <p>Your current proficiency vs Real-time Industry demand</p>
                    </div>
                    <div style={{ height: "300px", width: "100%" }}>
                        <ClientCharts type="bar" data={skillGapData} dataKey="student" dataKey2="industry" colors={["#3b82f6", "#cbd5e1"]} />
                    </div>
                </div>

                <div className="glass chart-container">
                    <div className="chart-header">
                        <h3>Emerging Technology Trends</h3>
                        <p>Job market demands for the next 6 months</p>
                    </div>
                    <div className="tech-trends">
                        {techTrends.map((t) => (
                            <div key={t.name} className="trend-item">
                                <span className="trend-name">{t.name}</span>
                                <div className="trend-bar">
                                    <div className="fill" style={{ width: `${t.pct}%` }} />
                                </div>
                                <span className="trend-val">{t.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
