import Link from "next/link";
import {
  GraduationCap,
  ArrowRight,
  Zap,
  Target,
  BarChart3,
  Brain,
  TrendingUp,
  Shield,
  Play,
  Upload,
  Cpu,
  Rocket,
} from "lucide-react";
import "./landing.css";

export default function LandingPage() {
  return (
    <div className="landing-root">
      {/* ────────────────── NAVIGATION ────────────────── */}
      <nav className="nav" id="main-nav">
        <Link href="/" className="nav-logo">
          <div className="nav-logo-mark">
            <GraduationCap size={20} />
          </div>
          SkillSync
        </Link>

        <div className="nav-links">
          <a href="#features" className="nav-link">Features</a>
          <a href="#metrics" className="nav-link">Impact</a>
          <a href="#how" className="nav-link">How It Works</a>
          <a href="#proof" className="nav-link">Testimonials</a>
        </div>

        <div className="nav-cta">
          <Link href="/login" className="btn-ghost">Sign In</Link>
          <Link href="/register" className="btn-primary">
            Get Started <ArrowRight size={14} />
          </Link>
        </div>
      </nav>

      {/* ────────────────── HERO ────────────────── */}
      <section className="hero">
        {/* Decorative blobs */}
        <div className="hero-blob" aria-hidden="true" />
        <div className="hero-blob-2" aria-hidden="true" />

        {/* Text column — 7 of 12 */}
        <div className="hero-content animate-fade-up">
          <div className="hero-badge">
            <span className="badge-dot" />
            AI-Powered Education
          </div>

          <h1 className="hero-headline">
            Aligning Education With{" "}
            <span className="accent-highlight">Industry</span>
          </h1>

          <p className="hero-sub">
            Predict dropout risks, analyze skill gaps, and generate
            personalized career roadmaps — all powered by real-time
            job market intelligence.
          </p>

          <div className="hero-actions">
            <Link href="/register" className="btn-hero-primary">
              Launch Dashboard <ArrowRight size={18} />
            </Link>
            <button className="btn-hero-secondary">
              <Play size={16} /> Watch Demo
            </button>
          </div>

          {/* Stat row */}
          <div className="hero-stats">
            <div className="hero-stat animate-fade-up delay-2">
              <span className="hero-stat-value">12K+</span>
              <span className="hero-stat-label">Active Students</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat animate-fade-up delay-3">
              <span className="hero-stat-value">94%</span>
              <span className="hero-stat-label">Retention Rate</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat animate-fade-up delay-4">
              <span className="hero-stat-value">3.2x</span>
              <span className="hero-stat-label">Career Boost</span>
            </div>
          </div>
        </div>

        {/* Visual column — 5 of 12 */}
        <div className="hero-visual animate-fade-up delay-2">
          <div className="preview-card">
            {/* Floating badge */}
            <div className="preview-float-badge">
              <span className="badge-icon">🎯</span>
              Risk Score: Low
            </div>

            <div className="preview-header">
              <div className="preview-dots">
                <span className="preview-dot" />
                <span className="preview-dot" />
                <span className="preview-dot" />
              </div>
              <span className="preview-title">Dashboard</span>
            </div>

            <div className="preview-body">
              {/* Mini stat cards */}
              <div className="preview-stats-row">
                <div className="pstat">
                  <div className="pstat-label">GPA</div>
                  <div className="pstat-value accent">3.87</div>
                </div>
                <div className="pstat">
                  <div className="pstat-label">Skills</div>
                  <div className="pstat-value blue">24</div>
                </div>
                <div className="pstat">
                  <div className="pstat-label">At Risk</div>
                  <div className="pstat-value red">3</div>
                </div>
              </div>

              {/* Mini chart */}
              <div>
                <div className="preview-chart-label">Weekly Progress</div>
                <div className="preview-bars">
                  {[65, 80, 45, 90, 70, 85, 60, 95, 75, 88].map(
                    (h, i) => (
                      <div className="pbar" key={i} style={{ height: "100%" }}>
                        <div
                          className="pbar-fill"
                          style={{ height: `${h}%` }}
                        />
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────── TICKER / MARQUEE ────────────────── */}
      <div className="ticker" aria-hidden="true">
        <div className="ticker-inner">
          {[1, 2].map((set) => (
            <div key={set} style={{ display: "flex" }}>
              <span className="ticker-item">
                <strong>Predictive Analytics</strong> for dropout prevention
              </span>
              <span className="ticker-sep">◆</span>
              <span className="ticker-item">
                <strong>Skill Gap Analysis</strong> vs job market
              </span>
              <span className="ticker-sep">◆</span>
              <span className="ticker-item">
                <strong>AI Career Roadmaps</strong> personalized for each student
              </span>
              <span className="ticker-sep">◆</span>
              <span className="ticker-item">
                <strong>Real-Time Monitoring</strong> of student performance
              </span>
              <span className="ticker-sep">◆</span>
              <span className="ticker-item">
                <strong>Faculty Insights</strong> for smarter teaching
              </span>
              <span className="ticker-sep">◆</span>
            </div>
          ))}
        </div>
      </div>

      {/* ────────────────── FEATURES ────────────────── */}
      <section className="features" id="features">
        <div className="container">
          {/* Header — asymmetric 2-col */}
          <div className="features-header">
            <div className="features-heading-col">
              <div className="section-eyebrow">
                <span className="section-eyebrow-line" />
                Platform Capabilities
              </div>
              <h2 className="section-headline">
                Everything you need to transform education
              </h2>
            </div>
            <div className="features-desc-col">
              <p className="features-desc">
                From predictive analytics to personalized roadmaps,
                SkillSync equips institutions with the intelligence
                to close skill gaps and improve outcomes at scale.
              </p>
            </div>
          </div>

          {/* Asymmetric feature cards */}
          <div className="features-grid">
            {/* Card 1 — Wide */}
            <div className="feat-card feat-card--wide animate-fade-up">
              <div className="feat-card-number">01</div>
              <div
                className="feat-card-icon"
                style={{ background: "rgba(212,255,0,0.12)" }}
              >
                <Zap size={22} color="#0a0a0a" />
              </div>
              <h3 className="feat-card-title">Academic Intelligence</h3>
              <p className="feat-card-desc">
                Predictive models identify at-risk students before
                dropout patterns emerge. Intervene early, retain more.
              </p>
            </div>

            {/* Card 2 — Tall */}
            <div className="feat-card feat-card--tall animate-fade-up delay-1">
              <div className="feat-card-number">02</div>
              <div
                className="feat-card-icon"
                style={{ background: "rgba(0,87,255,0.08)" }}
              >
                <Target size={22} color="#0057ff" />
              </div>
              <h3 className="feat-card-title">Skill Gap Analyzer</h3>
              <p className="feat-card-desc">
                Compares student proficiency against live job market
                demands. Surfaces the exact skills students need to
                master for career readiness.
              </p>
            </div>

            {/* Card 3 — Slim */}
            <div className="feat-card feat-card--slim animate-fade-up delay-2">
              <div className="feat-card-number">03</div>
              <div
                className="feat-card-icon"
                style={{ background: "rgba(0,0,0,0.06)" }}
              >
                <Brain size={22} color="#0a0a0a" />
              </div>
              <h3 className="feat-card-title">AI Roadmaps</h3>
              <p className="feat-card-desc">
                Personalized learning paths tailored to career goals
                and current standing.
              </p>
            </div>

            {/* Card 4 — Wide */}
            <div className="feat-card feat-card--wide animate-fade-up delay-3">
              <div className="feat-card-number">04</div>
              <div
                className="feat-card-icon"
                style={{ background: "rgba(212,255,0,0.12)" }}
              >
                <BarChart3 size={22} color="#0a0a0a" />
              </div>
              <h3 className="feat-card-title">Performance Analytics</h3>
              <p className="feat-card-desc">
                Granular dashboards for faculty and admins. Track
                engagement, grades, and attendance in real-time.
              </p>
            </div>

            {/* Card 5 — Slim */}
            <div className="feat-card feat-card--slim animate-fade-up delay-4">
              <div className="feat-card-number">05</div>
              <div
                className="feat-card-icon"
                style={{ background: "rgba(0,87,255,0.08)" }}
              >
                <Shield size={22} color="#0057ff" />
              </div>
              <h3 className="feat-card-title">Role-Based Access</h3>
              <p className="feat-card-desc">
                Secure dashboards for students, faculty, and
                administrators.
              </p>
            </div>

            {/* Card 6 — Half */}
            <div className="feat-card feat-card--half animate-fade-up delay-3">
              <div className="feat-card-number">06</div>
              <div
                className="feat-card-icon"
                style={{ background: "rgba(0,0,0,0.06)" }}
              >
                <TrendingUp size={22} color="#0a0a0a" />
              </div>
              <h3 className="feat-card-title">Industry Alignment Engine</h3>
              <p className="feat-card-desc">
                Continuously maps curriculum to current hiring trends.
                Know exactly which courses need updating and why.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────── METRICS ────────────────── */}
      <section className="metrics" id="metrics">
        <div className="container">
          <div className="metrics-grid">
            <div className="metrics-text-col">
              <div className="section-eyebrow">
                <span className="section-eyebrow-line" />
                Proven Impact
              </div>
              <h2 className="metrics-headline">
                Numbers that speak for themselves
              </h2>
              <p className="metrics-sub">
                Institutions using SkillSync see measurable
                improvement across every metric that matters.
              </p>
            </div>

            <div className="metrics-numbers-col">
              <div className="metric-block animate-fade-up delay-1">
                <div className="metric-num">
                  94<span>%</span>
                </div>
                <div className="metric-desc">Student Retention Rate</div>
              </div>
              <div className="metric-block animate-fade-up delay-2">
                <div className="metric-num">
                  3.2<span>x</span>
                </div>
                <div className="metric-desc">Career Outcome Boost</div>
              </div>
              <div className="metric-block animate-fade-up delay-3">
                <div className="metric-num">
                  67<span>%</span>
                </div>
                <div className="metric-desc">Fewer Skill Gaps</div>
              </div>
              <div className="metric-block animate-fade-up delay-4">
                <div className="metric-num">
                  12<span>K+</span>
                </div>
                <div className="metric-desc">Active Learners</div>
              </div>
              <div className="metric-block animate-fade-up delay-5">
                <div className="metric-num">
                  48<span>h</span>
                </div>
                <div className="metric-desc">Avg. Intervention Time</div>
              </div>
              <div className="metric-block animate-fade-up delay-5">
                <div className="metric-num">
                  99<span>%</span>
                </div>
                <div className="metric-desc">Uptime Reliability</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────── HOW IT WORKS ────────────────── */}
      <section className="how" id="how">
        <div className="container">
          <div className="section-eyebrow">
            <span className="section-eyebrow-line" />
            How It Works
          </div>
          <h2 className="section-headline">Three steps to smarter education</h2>

          <div className="how-grid">
            <div className="how-step animate-fade-up delay-1">
              <span className="how-step-num">STEP 01</span>
              <div className="how-step-icon">
                <Upload size={24} color="#3b82f6" />
              </div>
              <h3 className="how-step-title">Connect Your Data</h3>
              <p className="how-step-desc">
                Import student records, course catalogs, and
                faculty data. Our onboarding takes minutes, not months.
              </p>
            </div>

            <div className="how-step animate-fade-up delay-2">
              <span className="how-step-num">STEP 02</span>
              <div className="how-step-icon">
                <Cpu size={24} color="#3b82f6" />
              </div>
              <h3 className="how-step-title">AI Analyzes Everything</h3>
              <p className="how-step-desc">
                Our models process performance data against live
                job market signals to surface actionable insights.
              </p>
            </div>

            <div className="how-step animate-fade-up delay-3">
              <span className="how-step-num">STEP 03</span>
              <div className="how-step-icon">
                <Rocket size={24} color="#3b82f6" />
              </div>
              <h3 className="how-step-title">Act on Insights</h3>
              <p className="how-step-desc">
                Intervene with at-risk students, update curriculum,
                and deliver personalized learning paths — all from
                one dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────── TESTIMONIALS ────────────────── */}
      <section className="proof" id="proof">
        <div className="container">
          <div className="proof-inner">
            <div className="proof-heading-col">
              <div className="section-eyebrow">
                <span className="section-eyebrow-line" />
                Testimonials
              </div>
              <h2 className="section-headline">
                Trusted by educators worldwide
              </h2>
            </div>

            <div className="proof-cards-col">
              <div className="proof-card animate-fade-up delay-1">
                <p className="proof-quote">
                  SkillSync cut our dropout rate by 38% in one semester.
                  The predictive models flagged students we would have
                  completely missed with traditional methods.
                </p>
                <div className="proof-author">
                  <div className="proof-avatar">DR</div>
                  <div className="proof-author-info">
                    <div className="author-name">Dr. Rebecca Okafor</div>
                    <div className="author-role">
                      Dean of Engineering, Westfield University
                    </div>
                  </div>
                </div>
              </div>

              <div className="proof-card animate-fade-up delay-2">
                <p className="proof-quote">
                  The skill gap analyzer alone justified our investment.
                  We restructured two entire programs based on the
                  insights, and placement rates soared.
                </p>
                <div className="proof-author">
                  <div className="proof-avatar">MK</div>
                  <div className="proof-author-info">
                    <div className="author-name">Prof. Michael Kessler</div>
                    <div className="author-role">
                      Head of Computer Science, Pacific Tech
                    </div>
                  </div>
                </div>
              </div>

              <div className="proof-card animate-fade-up delay-3">
                <p className="proof-quote">
                  As a student, the personalized roadmap gave me clarity
                  I never had. I knew exactly which skills to focus on
                  and landed my first internship within weeks.
                </p>
                <div className="proof-author">
                  <div className="proof-avatar">AL</div>
                  <div className="proof-author-info">
                    <div className="author-name">Amira Lopez</div>
                    <div className="author-role">
                      CS Senior, Pacific Tech
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────── CTA ────────────────── */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-inner">
            <div className="cta-text-col">
              <h2 className="cta-headline">
                Ready to build a <em>smarter</em> institution?
              </h2>
              <p className="cta-sub">
                Join forward-thinking universities already using
                SkillSync to close skill gaps, retain students, and
                align curriculum with the future of work.
              </p>
            </div>

            <div className="cta-action-col">
              <Link href="/login" className="btn-cta-primary">
                Start Free Trial <ArrowRight size={18} />
              </Link>
              <span className="cta-note">
                No credit card required · 14-day free trial
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────── FOOTER ────────────────── */}
      <footer className="footer">
        <div className="container">
          <div className="footer-inner">
            <div className="footer-logo">
              <div className="footer-logo-mark">
                <GraduationCap size={16} color="#3b82f6" />
              </div>
              SkillSync
            </div>

            <div className="footer-links">
              <a href="#features" className="footer-link">Features</a>
              <a href="#metrics" className="footer-link">Impact</a>
              <a href="#how" className="footer-link">How It Works</a>
              <a href="#proof" className="footer-link">Testimonials</a>
              <Link href="/login" className="footer-link">Sign In</Link>
            </div>

            <span className="footer-copy">
              &copy; 2026 SkillSync. All rights reserved.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
