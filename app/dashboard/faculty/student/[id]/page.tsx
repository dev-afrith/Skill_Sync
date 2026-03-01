"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { STUDENTS } from "@/lib/mockData";
import StudentAnalytics from "@/components/StudentAnalytics";

export default function StudentPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const student = STUDENTS.find((s) => s.id === id);
    if (!student) notFound();

    return (
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
            <StudentAnalytics student={student} />
        </div>
    );
}
