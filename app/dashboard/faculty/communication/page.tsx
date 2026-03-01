"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { Bell, Send, User, Search, CheckCircle2 } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, addDoc, query, orderBy, serverTimestamp, where } from "firebase/firestore";

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

export default function CommunicationPage() {
    const { data: session } = useSession();
    const teacherEmail = session?.user?.email;

    const [dbStudents, setDbStudents] = useState<any[]>([]);
    const [assignedIds, setAssignedIds] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStudent, setSelectedStudent] = useState<any>(null);
    const [messageInput, setMessageInput] = useState("");
    const [messages, setMessages] = useState<any[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!teacherEmail) return;

        const q = query(
            collection(db, "users"),
            where("role", "==", "STUDENT"),
            where("assignedFacultyIds", "array-contains", teacherEmail)
        );

        const unsub = onSnapshot(q, (snap) => {
            const students = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            setDbStudents(students);
        });

        return () => unsub();
    }, [teacherEmail]);

    const MY_STUDENTS = dbStudents;

    const filteredStudents = MY_STUDENTS.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.roll || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Real-time messages listener
    useEffect(() => {
        if (!selectedStudent || !teacherEmail) {
            setMessages([]);
            return;
        }

        // We want messages where (sender == teacher AND receiver == student) OR (sender == student AND receiver == teacher)
        // Since Firestore lacks an OR clause across multiple fields easily without composite indexes or client-side merging,
        // we can query both conditions independently or query all messages involving the teacher and filter locally.
        const q = query(
            collection(db, "messages"),
            orderBy("timestamp", "asc")
        );

        const unsub = onSnapshot(q, (snap) => {
            const allMsgs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as MessageData));
            const chatMsgs = allMsgs.filter((m: MessageData) =>
                (m.senderId === teacherEmail && m.receiverId === selectedStudent.email) ||
                (m.senderId === selectedStudent.email && m.receiverId === teacherEmail)
            );

            // Mark received messages as read
            const unreadIds = chatMsgs.filter((m: MessageData) => m.receiverId === teacherEmail && !m.read).map((m: MessageData) => m.id);
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
                sender: m.senderId === teacherEmail ? "faculty" : "student",
                timestamp: m.timestamp ? new Date(m.timestamp.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now",
                read: m.read
            })));
        });

        return () => unsub();
    }, [selectedStudent, teacherEmail]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!messageInput.trim() || !selectedStudent || !teacherEmail) return;

        const text = messageInput.trim();
        setMessageInput(""); // Optimistic clear

        try {
            await addDoc(collection(db, "messages"), {
                senderId: teacherEmail,
                receiverId: selectedStudent.email,
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
                        Faculty Dashboard — Communication
                    </span>
                </div>
                <h1 style={{ fontFamily: FONT_H, fontSize: "1.9rem", fontWeight: 900, letterSpacing: "-0.03em", color: V.text, margin: 0 }}>
                    Direct Messaging
                </h1>
                <p style={{ color: V.dim, marginTop: 6, fontSize: "0.9rem" }}>
                    Communicate directly with your assigned students for quick guidance and updates.
                </p>
            </div>

            <div style={{ display: "flex", flex: 1, gap: 20, minHeight: 0 }}>
                {/* Contacts List Sidebar */}
                <div style={{ width: 320, background: V.card, border: `1px solid ${V.border}`, borderRadius: "16px", display: "flex", flexDirection: "column", overflow: "hidden" }}>
                    <div style={{ padding: "20px", borderBottom: `1px solid ${V.border}` }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, background: V.searchBg, borderRadius: 10, padding: "0 14px", border: `1px solid ${V.border}` }}>
                            <Search size={15} color={V.muted} />
                            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search students..."
                                style={{ background: "none", border: "none", color: V.text, outline: "none", padding: "11px 0", width: "100%", fontSize: "0.88rem", fontFamily: "inherit" }} />
                        </div>
                    </div>
                    <div style={{ flex: 1, overflowY: "auto", padding: "10px" }} className="no-scrollbar">
                        {filteredStudents.map((s, i) => (
                            <div
                                key={s.id}
                                onClick={() => setSelectedStudent(s)}
                                style={{
                                    display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
                                    borderRadius: 12, cursor: "pointer", transition: "all 0.2s",
                                    background: selectedStudent?.id === s.id ? V.accentSoft : "transparent",
                                    border: `1px solid ${selectedStudent?.id === s.id ? V.accentBorder : "transparent"}`
                                }}
                                onMouseOver={(e) => { if (selectedStudent?.id !== s.id) e.currentTarget.style.background = V.hover; }}
                                onMouseOut={(e) => { if (selectedStudent?.id !== s.id) e.currentTarget.style.background = "transparent"; }}
                            >
                                <div style={{ width: 40, height: 40, borderRadius: "50%", background: s.avatarColor || V.accentSoft, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.9rem", color: V.accent, flexShrink: 0 }}>
                                    {s.avatar || s.name?.charAt(0)}
                                </div>
                                <div style={{ flex: 1, overflow: "hidden" }}>
                                    <div style={{ fontWeight: 700, color: selectedStudent?.id === s.id ? V.accent : V.text, fontSize: "0.9rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.name}</div>
                                    <div style={{ fontSize: "0.75rem", color: V.dim }}>{s.registerNumber || s.roll || "REG000"}</div>
                                </div>
                            </div>
                        ))}
                        {filteredStudents.length === 0 && (
                            <div style={{ padding: "20px", textAlign: "center", color: V.muted, fontSize: "0.85rem" }}>
                                No students found.
                            </div>
                        )}
                    </div>
                </div>

                {/* Chat Area */}
                <div style={{ flex: 1, background: V.card, border: `1px solid ${V.border}`, borderRadius: "16px", display: "flex", flexDirection: "column", overflow: "hidden" }}>
                    {selectedStudent ? (
                        <>
                            {/* Chat Header */}
                            <div style={{ padding: "20px 24px", borderBottom: `1px solid ${V.border}`, display: "flex", alignItems: "center", gap: 16, background: V.surface }}>
                                <div style={{ width: 46, height: 46, borderRadius: "50%", background: selectedStudent.avatarColor || V.accentSoft, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "1.1rem", color: V.accent }}>
                                    {selectedStudent.avatar || selectedStudent.name?.charAt(0)}
                                </div>
                                <div>
                                    <h2 style={{ margin: 0, fontFamily: FONT_H, fontSize: "1.1rem", fontWeight: 800, color: V.text }}>{selectedStudent.name}</h2>
                                    <div style={{ fontSize: "0.8rem", color: V.dim, display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
                                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981" }} /> Online
                                    </div>
                                </div>
                            </div>

                            {/* Message List */}
                            <div style={{ flex: 1, overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: 20 }}>
                                {messages.map((msg) => {
                                    const isMe = msg.sender === "faculty";
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
                            <h3 style={{ margin: 0, color: V.dim, fontFamily: FONT_H, fontSize: "1.2rem", fontWeight: 800 }}>Select a student</h3>
                            <p style={{ marginTop: 6, fontSize: "0.9rem" }}>Choose a student from the sidebar to start messaging.</p>
                        </div>
                    )}
                </div>
            </div>

            <style>{`.no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
        </div>
    );
}
