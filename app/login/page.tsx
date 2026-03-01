"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GraduationCap, Mail, Lock, ArrowRight, Loader2, User, BookOpen, Shield, ChevronDown } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showDemoDropdown, setShowDemoDropdown] = useState(false);
  const router = useRouter();

  const handleDemoSelect = (role: string) => {
    switch (role) {
      case "ADMIN":
        setEmail("admin.admin@skillsync.com");
        break;
      case "FACULTY":
        setEmail("faculty.faculty@skillsync.com");
        break;
      case "STUDENT":
        setEmail("student.student@skillsync.com");
        break;
    }
    setPassword("password123");
    setShowDemoDropdown(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
        setLoading(false);
      } else {
        const res = await fetch("/api/auth/session");
        const session = await res.json();
        const role = session?.user?.role;

        if (role === "ADMIN") {
          router.push("/dashboard/admin");
        } else {
          router.push("/dashboard");
        }
      }
    } catch (err) {
      setError("An unexpected error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-grid-bg" aria-hidden="true" />
      <div className="login-glow" aria-hidden="true" />

      <Link href="/" className="login-back">
        <GraduationCap size={16} />
        SkillSync
      </Link>

      <div className="login-card">
        <div className="login-header">
          <div className="login-logo-mark">
            <GraduationCap size={28} />
          </div>
          <h1>Welcome back</h1>
          <p>Sign in to your SkillSync account</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="login-error">{error}</div>}

          <div className="login-field">
            <label>
              <Mail size={14} />
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="login-field">
            <label>
              <Lock size={14} />
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="login-submit"
            disabled={loading}
          >
            {loading ? (
              <Loader2 size={18} className="spin" />
            ) : (
              <>
                Sign In <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="demo-dropdown-container">
          <button
            type="button"
            className="demo-dropdown-toggle"
            onClick={() => setShowDemoDropdown(!showDemoDropdown)}
          >
            Fill Demo Credentials <ChevronDown size={14} style={{ transform: showDemoDropdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
          </button>

          {showDemoDropdown && (
            <div className="demo-dropdown-menu">
              <button type="button" onClick={() => handleDemoSelect('ADMIN')} className="demo-option border-b">
                <Shield size={14} className="text-blue-500" />
                <div>
                  <div className="demo-role">Admin Account</div>
                  <div className="demo-email">admin.admin@skillsync.com</div>
                </div>
              </button>
              <button type="button" onClick={() => handleDemoSelect('FACULTY')} className="demo-option border-b">
                <BookOpen size={14} className="text-emerald-500" />
                <div>
                  <div className="demo-role">Faculty Account</div>
                  <div className="demo-email">faculty.faculty@skillsync.com</div>
                </div>
              </button>
              <button type="button" onClick={() => handleDemoSelect('STUDENT')} className="demo-option">
                <User size={14} className="text-amber-500" />
                <div>
                  <div className="demo-role">Student Account</div>
                  <div className="demo-email">student.student@skillsync.com</div>
                </div>
              </button>
            </div>
          )}
        </div>

      </div>

      <style jsx>{`
                .login-page {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: var(--color-ink, #0a0a0a);
                    padding: 24px;
                    position: relative;
                    overflow: hidden;
                    font-family: var(--font-body, 'Space Grotesk', sans-serif);
                }

                .login-grid-bg {
                    position: absolute;
                    inset: 0;
                    background-image:
                        linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
                    background-size: 64px 64px;
                    pointer-events: none;
                }

                .login-glow {
                    position: absolute;
                    top: -200px;
                    right: -200px;
                    width: 600px;
                    height: 600px;
                    background: radial-gradient(50% 50% at 50% 50%,
                        rgba(59, 130, 246, 0.08) 0%,
                        transparent 70%);
                    border-radius: 50%;
                    pointer-events: none;
                }

                .login-back {
                    position: absolute;
                    top: 28px;
                    left: 32px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-family: var(--font-display, 'Outfit', sans-serif);
                    font-weight: 800;
                    font-size: 1rem;
                    color: #fff;
                    text-decoration: none;
                    letter-spacing: -0.03em;
                    transition: opacity 0.2s;
                }

                .login-back:hover { opacity: 0.7; }

                .login-back :global(svg) { color: #3b82f6; }

                .login-card {
                    width: 100%;
                    max-width: 420px;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 20px;
                    padding: 40px;
                    position: relative;
                    z-index: 2;
                }

                .login-header {
                    text-align: center;
                    margin-bottom: 24px;
                }

                .login-logo-mark {
                    width: 56px;
                    height: 56px;
                    background: #0a0a0a;
                    border: 1.5px solid rgba(255, 255, 255, 0.1);
                    border-radius: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 20px;
                }

                .login-logo-mark :global(svg) { color: #3b82f6; }

                .login-header h1 {
                    font-family: var(--font-display, 'Outfit', sans-serif);
                    font-size: 1.75rem;
                    font-weight: 900;
                    letter-spacing: -0.04em;
                    color: #fff;
                    margin-bottom: 6px;
                }


                    display: flex;
                    flex-direction: column;
                    gap: 18px;
                }

                .login-error {
                    background: rgba(239, 68, 68, 0.08);
                    border: 1px solid rgba(239, 68, 68, 0.2);
                    color: #f87171;
                    padding: 12px 14px;
                    border-radius: 10px;
                    font-size: 0.83rem;
                    font-weight: 500;
                }

                .login-field label {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 0.78rem;
                    font-weight: 600;
                    color: #6b6b6b;
                    margin-bottom: 7px;
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                }

                .login-field input {
                    width: 100%;
                    background: rgba(255, 255, 255, 0.04);
                    border: 1.5px solid rgba(255, 255, 255, 0.08);
                    border-radius: 10px;
                    padding: 13px 16px;
                    color: #fff;
                    font-size: 0.95rem;
                    outline: none;
                    transition: border-color 0.2s, box-shadow 0.2s;
                }

                .login-field input::placeholder {
                    color: rgba(255, 255, 255, 0.2);
                }

                .login-field input:focus {
                    border-color: #3b82f6;
                    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
                }

                .login-submit {
                    width: 100%;
                    margin-top: 6px;
                    background: #3b82f6;
                    color: #ffffff;
                    border: none;
                    border-radius: 10px;
                    padding: 14px;
                    font-family: var(--font-display, 'Outfit', sans-serif);
                    font-size: 0.95rem;
                    font-weight: 800;
                    letter-spacing: -0.02em;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    cursor: pointer;
                    transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
                }

                .login-submit:hover {
                    background: #2563eb;
                    color: #ffffff;
                    box-shadow: 0 0 0 2px #3b82f6;
                    transform: translateY(-1px);
                }

                .login-submit:active {
                    transform: translateY(0);
                }

                .login-submit:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                    transform: none;
                }
                
                .demo-dropdown-container {
                    margin-top: 24px;
                    position: relative;
                }
                
                .demo-dropdown-toggle {
                    width: 100%;
                    background: rgba(255,255,255,0.03);
                    border: 1px dashed rgba(255,255,255,0.1);
                    color: #9ca3af;
                    padding: 12px;
                    border-radius: 10px;
                    font-size: 0.85rem;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .demo-dropdown-toggle:hover {
                    background: rgba(255,255,255,0.06);
                    color: #fff;
                }
                
                .demo-dropdown-menu {
                    position: absolute;
                    top: calc(100% + 8px);
                    left: 0;
                    right: 0;
                    background: #111;
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 10px;
                    overflow: hidden;
                    z-index: 10;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.5);
                }
                
                .demo-option {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px 16px;
                    background: transparent;
                    border: none;
                    text-align: left;
                    cursor: pointer;
                    transition: background 0.2s;
                }
                
                .demo-option:hover {
                    background: rgba(255,255,255,0.05);
                }
                
                .demo-option.border-b {
                    border-bottom: 1px solid rgba(255,255,255,0.05);
                }
                
                .demo-role {
                    font-size: 0.8rem;
                    font-weight: 700;
                    color: #fff;
                }
                
                .demo-email {
                    font-size: 0.7rem;
                    color: #6b6b6b;
                    font-family: monospace;
                    margin-top: 2px;
                }
                
                .text-blue-500 { color: #3b82f6; }
                .text-emerald-500 { color: #10b981; }
                .text-amber-500 { color: #f59e0b; }

                .spin {
                    animation: spinner 0.8s linear infinite;
                }

                @keyframes spinner {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
    </div>
  );
}
