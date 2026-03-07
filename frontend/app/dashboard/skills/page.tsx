"use client";

import { useState } from "react";
import SkillRoadmap from "@/components/SkillRoadmap";
import {
    Search,
    Filter,
    ExternalLink,
    Zap,
    Clock,
    Layers
} from "lucide-react";

import "./../styles.css";

export default function SkillsPage() {
    const allJobs = [
        { title: "JavaScript Developer", demand: "Very High", salary: "$120k - $150k", tags: ["Remote", "React/Node"] },
        { title: "Python AI Engineer", demand: "Emerging", salary: "$140k - $180k", tags: ["Hybrid", "TensorFlow"] },
        { title: "Java Backend Specialist", demand: "High", salary: "$110k - $140k", tags: ["On-site", "Spring Boot"] },
        { title: "C++ Systems Programmer", demand: "Steady", salary: "$130k - $160k", tags: ["Remote", "Performance"] },
        { title: "Machine Learning Researcher", demand: "Very High", salary: "$150k - $200k", tags: ["Remote", "Python/PyTorch"] },
        { title: "Full Stack Engineer", demand: "High", salary: "$115k - $145k", tags: ["Hybrid", "JS/Java"] },
    ];

    const [showAllJobs, setShowAllJobs] = useState(false);
    const displayedJobs = showAllJobs ? allJobs : allJobs.slice(0, 3);

    return (
        <div className="skills-page">
            <div className="page-header">
                <h1>AI Skill <span className="text-gradient">Intelligence</span></h1>
                <p>Real-time industry tracking and your alignment progress.</p>
            </div>

            <div className="skills-content-grid">
                <div className="left-column">
                    <SkillRoadmap />
                </div>

                <div className="right-column">
                    <div className="glass sidebar-section">
                        <h4 className="section-title" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <span style={{ display: "flex", alignItems: "center", gap: 8 }}><Zap size={18} /> Job Market Alerts</span>
                            <span style={{ fontSize: "0.7rem", color: "#10b981", background: "rgba(16,185,129,0.1)", padding: "2px 6px", borderRadius: 4, display: "flex", alignItems: "center", gap: 4 }}>
                                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", animation: "pulse 2s infinite" }} />
                                Live Analysis
                            </span>
                        </h4>
                        <div className="job-list">
                            {displayedJobs.map((job, i) => (
                                <div key={i} className="job-item">
                                    <div className="job-main">
                                        <h5>{job.title}</h5>
                                        <span className={`demand-badge ${job.demand.toLowerCase().replace(' ', '-')}`}>
                                            {job.demand}
                                        </span>
                                    </div>
                                    <div className="job-meta">
                                        <span>{job.salary}</span>
                                        <div className="job-tags">
                                            {job.tags.map(t => <span key={t}>{t}</span>)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button
                            className="view-all-btn"
                            onClick={() => setShowAllJobs(!showAllJobs)}
                        >
                            {showAllJobs ? "Show Less" : "Show All Demand Jobs"} <ExternalLink size={14} />
                        </button>
                    </div>

                    <div className="glass sidebar-section skill-comparison">
                        <h4 className="section-title"><Layers size={18} /> Skill Map Summary</h4>
                        <div className="skill-bars">
                            {[
                                { name: "JavaScript", val: 88 },
                                { name: "Python", val: 75 },
                                { name: "Java", val: 60 },
                                { name: "C++", val: 45 }
                            ].map(s => (
                                <div key={s.name} className="skill-row">
                                    <div className="skill-info">
                                        <span>{s.name}</span>
                                        <span>{s.val}%</span>
                                    </div>
                                    <div className="progress-bg"><div className="progress-fill" style={{ width: `${s.val}%` }}></div></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
