"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, onSnapshot, collection, query, getDocs, where } from "firebase/firestore";
import { calculateAIInsights, StudentData } from "@/lib/aiEngine";

export const useStudentData = (email: string | null | undefined) => {
    const [data, setData] = useState<StudentData | null>(null);
    const [loading, setLoading] = useState(true);
    const [insights, setInsights] = useState<any>(null);
    const [allStudents, setAllStudents] = useState<StudentData[]>([]);

    useEffect(() => {
        if (!email) return;

        // 1. Fetch all students once for percentile calculation (could be optimized)
        const fetchAll = async () => {
            const q = query(collection(db, "users"), where("role", "==", "STUDENT"));
            const snap = await getDocs(q);
            const students = snap.docs.map(d => ({ id: d.id, ...d.data() } as StudentData));
            setAllStudents(students);
        };
        fetchAll();

        // 2. Real-time listener for current student
        const unsub = onSnapshot(doc(db, "users", email), (doc) => {
            if (doc.exists() && doc.data().role === "STUDENT") {
                const studentData = { id: doc.id, ...doc.data() } as StudentData;
                setData(studentData);
            }
            setLoading(false);
        });

        return () => unsub();
    }, [email]);

    useEffect(() => {
        if (data && allStudents.length > 0) {
            const result = calculateAIInsights(data, allStudents);
            setInsights(result);
        }
    }, [data, allStudents]);

    return { student: data, insights, loading };
};
