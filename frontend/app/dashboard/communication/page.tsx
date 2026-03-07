"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { Bell, Send, User, Search, CheckCircle2 } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, addDoc, query, orderBy, serverTimestamp } from "firebase/firestore";

interface MessageData {
    id: string;
    senderId: string;
    receiverId: string;
    text: string;
    timestamp: any;
    read: boolean;
}

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
    surface: "var(--ds-surface, #ffffff)",
    searchBg: "var(--ds-search-bg, #ffffff)",
};
const FONT_H = "var(--font-display, 'Outfit', sans-serif)";

export default function StudentCommunicationPage() {
    const { data: session } = useSession();
    const studentEmail = session?.user?.email;

    const [dbTeachers, setDbTeachers] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTeacher, setSelectedTeacher] = useState<any>(null);
    const [messageInput, setMessageInput] = useState("");
    const [messages, setMessages] = useState<any[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Get all teachers
    useEffect(() => {
        const unsub = onSnapshot(collection(db, "users"), (snap) => {
            const teachers = snap.docs.map(d => ({ id: d.id, ...d.data() })).filter((u: any) => u.role === "FACULTY");
            setDbTeachers(teachers);
        });
        return () => unsub();
    }, []);

    const MY_TEACHERS = dbTeachers; // Giving access to message any teacher for simplicity

    const filteredTeachers = MY_TEACHERS.filter(s =>
        (s.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.email || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Real-time messages listener
    useEffect(() => {
        if (!selectedTeacher || !studentEmail) {
            setMessages([]);
            return;
        }

        const q = query(
            collection(db, "messages"),
            orderBy("timestamp", "asc")
        );

        const unsub = onSnapshot(q, (snap) => {
            const allMsgs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as MessageData));
            const chatMsgs = allMsgs.filter((m: MessageData) =>
                (m.senderId === studentEmail && m.receiverId === selectedTeacher.email) ||
                (m.senderId === selectedTeacher.email && m.receiverId === studentEmail)
            );

            // Mark received messages as read
            const unreadIds = chatMsgs.filter((m: MessageData) => m.receiverId === studentEmail && !m.read).map((m: MessageData) => m.id);
            if (unreadIds.length > 0) {
                unreadIds.forEach(id => {
                    import("firebase/firestore").then(({ doc, updateDoc }) => {
                        updateDoc(doc(db, "messages", id), { read: true });
                    });
                });
            }

            setMessages(chatMsgs.map((m: MessageData) => ({
                id: m.id,
                text: m.text,
                sender: m.senderId === studentEmail ? "student" : "faculty",
                timestamp: m.timestamp ? new Date(m.timestamp.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now",
                read: m.read
            })));
        });

        return () => unsub();
    }, [selectedTeacher, studentEmail]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!messageInput.trim() || !selectedTeacher || !studentEmail) return;

        const text = messageInput.trim();
        setMessageInput(""); // Optimistic clear

        try {
            await addDoc(collection(db, "messages"), {
                senderId: studentEmail,
                receiverId: selectedTeacher.email,
                text: text,
                timestamp: serverTimestamp(),
                read: false,
            });
        } catch (error) {
            console.error("Error sending message:", error);
            alert("Failed to send message. Please try again.");
        }
    };

    return (
        <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", flexDirection: "column", gap: 32, height: "calc(100vh - 120px)" }}>
            <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: V.accent, boxShadow: `0 0 8px ${V.accent}`, display: "inline-block" }} />
                    <span style={{ color: V.accent, fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: FONT_H }}>
                        Student Dashboard — Communication
                    </span>
                </div>
                <h1 style={{ fontFamily: FONT_H, fontSize: "1.9rem", fontWeight: 900, letterSpacing: "-0.03em", color: V.text, margin: 0 }}>
                    Faculty Messages
                </h1>
                <p style={{ color: V.dim, marginTop: 6, fontSize: "0.9rem" }}>
                    Reach out to your professors and mentors for help and updates.
                </p>
            </div>

            <div style={{ display: "flex", flex: 1, gap: 20, minHeight: 0 }}>
                {/* Contacts List Sidebar */}
                <div style={{ width: 320, background: V.card, border: `1px solid ${V.border}`, borderRadius: "16px", display: "flex", flexDirection: "column", overflow: "hidden" }}>
                    <div style={{ padding: "20px", borderBottom: `1px solid ${V.border}` }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, background: V.searchBg, borderRadius: 10, padding: "0 14px", border: `1px solid ${V.border}` }}>
                            <Search size={15} color={V.muted} />
                            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search faculty..."
                                style={{ background: "none", border: "none", color: V.text, outline: "none", padding: "11px 0", width: "100%", fontSize: "0.88rem", fontFamily: "inherit" }} />
                        </div>
                    </div>
                    <div style={{ flex: 1, overflowY: "auto", padding: "10px" }} className="no-scrollbar">
                        {filteredTeachers.map((s, i) => (
                            <div
                                key={s.id}
                                onClick={() => setSelectedTeacher(s)}
                                style={{
                                    display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
                                    borderRadius: 12, cursor: "pointer", transition: "all 0.2s",
                                    background: selectedTeacher?.id === s.id ? V.accentSoft : "transparent",
                                    border: `1px solid ${selectedTeacher?.id === s.id ? V.accentBorder : "transparent"}`
                                }}
                                onMouseOver={(e) => { if (selectedTeacher?.id !== s.id) e.currentTarget.style.background = V.hover; }}
                                onMouseOut={(e) => { if (selectedTeacher?.id !== s.id) e.currentTarget.style.background = "transparent"; }}
                            >
                                <div style={{ width: 40, height: 40, borderRadius: "50%", background: V.accentSoft, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.9rem", color: V.accent, flexShrink: 0 }}>
                                    {s.name?.charAt(0) || "F"}
                                </div>
                                <div style={{ flex: 1, overflow: "hidden" }}>
                                    <div style={{ fontWeight: 700, color: selectedTeacher?.id === s.id ? V.accent : V.text, fontSize: "0.9rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.name || s.email}</div>
                                    <div style={{ fontSize: "0.75rem", color: V.dim }}>Faculty</div>
                                </div>
                            </div>
                        ))}
                        {filteredTeachers.length === 0 && (
                            <div style={{ padding: "20px", textAlign: "center", color: V.muted, fontSize: "0.85rem" }}>
                                No faculty found.
                            </div>
                        )}
                    </div>
                </div>

                {/* Chat Area */}
                <div style={{ flex: 1, background: V.card, border: `1px solid ${V.border}`, borderRadius: "16px", display: "flex", flexDirection: "column", overflow: "hidden" }}>
                    {selectedTeacher ? (
                        <>
                            {/* Chat Header */}
                            <div style={{ padding: "20px 24px", borderBottom: `1px solid ${V.border}`, display: "flex", alignItems: "center", gap: 16, background: V.surface }}>
                                <div style={{ width: 46, height: 46, borderRadius: "50%", background: V.accentSoft, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "1.1rem", color: V.accent }}>
                                    {selectedTeacher.name?.charAt(0) || "F"}
                                </div>
                                <div>
                                    <h2 style={{ margin: 0, fontFamily: FONT_H, fontSize: "1.1rem", fontWeight: 800, color: V.text }}>{selectedTeacher.name || selectedTeacher.email}</h2>
                                    <div style={{ fontSize: "0.8rem", color: V.dim, display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
                                        Faculty Member
                                    </div>
                                </div>
                            </div>

                            {/* Message List */}
                            <div style={{ flex: 1, overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: 20 }}>
                                {messages.map((msg) => {
                                    const isMe = msg.sender === "student";
                                    return (
                                        <div key={msg.id} style={{ display: "flex", flexDirection: "column", alignItems: isMe ? "flex-end" : "flex-start" }}>
                                            <div style={{
                                                maxWidth: "70%",
                                                padding: "12px 16px",
                                                borderRadius: "16px",
                                                borderBottomRightRadius: isMe ? "4px" : "16px",
                                                borderBottomLeftRadius: isMe ? "16px" : "4px",
                                                background: isMe ? V.accent : V.hover,
                                                color: isMe ? "#fff" : V.text,
                                                border: isMe ? "none" : `1px solid ${V.border}`,
                                                fontSize: "0.9rem",
                                                lineHeight: 1.5
                                            }}>
                                                {msg.text}
                                            </div>
                                            <div style={{ fontSize: "0.7rem", color: V.muted, marginTop: 6, display: "flex", alignItems: "center", gap: 4 }}>
                                                {msg.timestamp} {isMe && <CheckCircle2 size={10} color={V.accent} />}
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area */}
                            <div style={{ padding: "20px", borderTop: `1px solid ${V.border}`, background: V.surface }}>
                                <form onSubmit={handleSendMessage} style={{ display: "flex", gap: 12 }}>
                                    <input
                                        type="text"
                                        value={messageInput}
                                        onChange={(e) => setMessageInput(e.target.value)}
                                        placeholder="Type a message..."
                                        style={{
                                            flex: 1, background: V.hover, border: `1px solid ${V.border}`,
                                            borderRadius: "12px", padding: "0 16px", color: V.text,
                                            fontSize: "0.9rem", outline: "none", fontFamily: "inherit",
                                            transition: "border-color 0.2s"
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = V.accentBorder}
                                        onBlur={(e) => e.target.style.borderColor = V.border}
                                    />
                                    <button
                                        type="submit"
                                        disabled={!messageInput.trim()}
                                        style={{
                                            background: V.accent, color: "#fff", border: "none",
                                            borderRadius: "12px", width: 44, height: 44,
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            cursor: messageInput.trim() ? "pointer" : "not-allowed",
                                            opacity: messageInput.trim() ? 1 : 0.6,
                                            transition: "transform 0.1s"
                                        }}
                                        onMouseDown={(e) => { if (messageInput.trim()) e.currentTarget.style.transform = "scale(0.95)" }}
                                        onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}
                                        onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                                    >
                                        <Send size={18} style={{ marginLeft: 3 }} />
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: V.muted }}>
                            <div style={{ width: 80, height: 80, borderRadius: "50%", background: V.hover, border: `1px dashed ${V.border}`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                                <Bell size={32} opacity={0.5} />
                            </div>
                            <h3 style={{ margin: 0, color: V.dim, fontFamily: FONT_H, fontSize: "1.2rem", fontWeight: 800 }}>Select a mentor</h3>
                            <p style={{ marginTop: 6, fontSize: "0.9rem" }}>Choose a faculty member from the sidebar to ask questions.</p>
                        </div>
                    )}
                </div>
            </div>

            <style>{`.no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
        </div>
    );
}
