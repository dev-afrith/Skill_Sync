"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GraduationCap, Mail, Lock, User, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Something went wrong");
                setLoading(false);
            } else {
                setSuccess(true);
                setTimeout(() => {
                    router.push("/login");
                }, 2000);
            }
        } catch (err) {
            setError("Failed to connect to server");
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="login-page">
                <div className="login-grid-bg" aria-hidden="true" />
                <div className="login-card" style={{ textAlign: "center" }}>
                    <div className="success-icon">
                        <CheckCircle2 size={48} color="#3b82f6" />
                    </div>
                    <h1 style={{ color: "white", marginBottom: "8px" }}>Account Created!</h1>
                    <p style={{ color: "#6b6b6b" }}>Redirecting you to sign in...</p>
                </div>
                <style jsx>{`
                    .login-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #0a0a0a; position: relative; overflow: hidden; }
                    .login-grid-bg { position: absolute; inset: 0; background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px); background-size: 64px 64px; }
                    .login-card { background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 20px; padding: 40px; position: relative; z-index: 2; width: 100%; max-width: 420px; }
                    .success-icon { margin-bottom: 24px; animation: scaleUp 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
                    @keyframes scaleUp { from { transform: scale(0); } to { transform: scale(1); } }
                `}</style>
            </div>
        );
    }

    return (
        <div className="login-page">
            <div className="login-grid-bg" aria-hidden="true" />
            <div className="login-glow" aria-hidden="true" />
            <div className="login-card" style={{ textAlign: "center" }}>
                <div className="login-logo-mark">
                    <CheckCircle2 size={24} color="#6b6b6b" />
                </div>
                <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "1.5rem", fontWeight: 900, color: "white", marginBottom: "12px" }}>Registration Disabled</h1>
                <p style={{ color: "#6b6b6b", fontSize: "0.9rem", lineHeight: 1.5, marginBottom: "24px" }}>
                    SkillSync accounts are managed by the university administration. Please contact your administrator to receive your login credentials.
                </p>
                <Link href="/login" style={{
                    display: "inline-block", background: "#3b82f6", color: "white", padding: "12px 24px", borderRadius: "8px",
                    fontWeight: 700, textDecoration: "none", fontSize: "0.9rem"
                }}>
                    Return to Login
                </Link>
            </div>
            <style jsx>{`
                .login-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #0a0a0a; position: relative; overflow: hidden; font-family: 'Space Grotesk', sans-serif; }
                .login-grid-bg { position: absolute; inset: 0; background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px); background-size: 64px 64px; pointer-events: none; }
                .login-glow { position: absolute; top: -200px; right: -200px; width: 600px; height: 600px; background: radial-gradient(50% 50% at 50% 50%, rgba(59, 130, 246, 0.08) 0%, transparent 70%); border-radius: 50%; pointer-events: none; }
                .login-card { width: 100%; max-width: 420px; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 20px; padding: 40px; position: relative; z-index: 2; }
                .login-logo-mark { width: 48px; height: 48px; background: #0a0a0a; border: 1.5px solid rgba(255, 255, 255, 0.1); border-radius: 12px; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; }
            `}</style>
        </div>
    );
}
