"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, X, Bot, User, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Chatbot({ studentContext }: { studentContext: any }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: "assistant", content: "Hi! I'm your SkillSync AI Assistant. How can I help you today?" }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { role: "user", content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: input,
                    studentData: studentContext
                }),
            });

            const data = await res.json();
            setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I'm having trouble connecting right now." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ position: "fixed", bottom: "30px", right: "30px", zIndex: 1000 }}>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        style={{
                            width: "380px",
                            height: "500px",
                            background: "rgba(10, 10, 20, 0.95)",
                            backdropFilter: "blur(12px)",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                            borderRadius: "20px",
                            display: "flex",
                            flexDirection: "column",
                            overflow: "hidden",
                            boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
                            marginBottom: "20px"
                        }}
                    >
                        {/* Header */}
                        <div style={{ padding: "16px 20px", background: "rgba(99, 102, 241, 0.1)", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #a855f7)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <Sparkles size={16} color="white" />
                                </div>
                                <div>
                                    <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "white" }}>SkillSync AI</div>
                                    <div style={{ fontSize: "0.7rem", color: "#10b981" }}>Online</div>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer" }}>
                                <X size={18} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }} className="no-scrollbar">
                            {messages.map((m, i) => (
                                <div key={i} style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: "80%" }}>
                                    <div style={{
                                        padding: "12px 16px",
                                        borderRadius: "15px",
                                        fontSize: "0.9rem",
                                        lineHeight: 1.5,
                                        background: m.role === "user" ? "#6366f1" : "rgba(255,255,255,0.05)",
                                        color: m.role === "user" ? "white" : "#cbd5e1",
                                        border: m.role === "user" ? "none" : "1px solid rgba(255,255,255,0.08)",
                                        borderBottomRightRadius: m.role === "user" ? "2px" : "15px",
                                        borderBottomLeftRadius: m.role === "assistant" ? "2px" : "15px",
                                    }}>
                                        {m.content}
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div style={{ alignSelf: "flex-start", padding: "12px 16px", borderRadius: "15px", background: "rgba(255,255,255,0.05)", color: "#64748b", fontSize: "0.8rem" }}>
                                    AI is thinking...
                                </div>
                            )}
                        </div>

                        {/* Input */}
                        <div style={{ padding: "20px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                            <div style={{ display: "flex", gap: "10px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "8px 12px" }}>
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                    placeholder="Ask SkillSync AI anything..."
                                    style={{ flex: 1, background: "none", border: "none", color: "white", fontSize: "0.9rem", outline: "none" }}
                                />
                                <button onClick={handleSend} style={{ background: "#6366f1", border: "none", borderRadius: "8px", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", color: "white", cursor: "pointer" }}>
                                    <Send size={16} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #6366f1, #a855f7)",
                    border: "none",
                    boxShadow: "0 10px 30px rgba(99, 102, 241, 0.4)",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                }}
            >
                {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
            </motion.button>
        </div>
    );
}
