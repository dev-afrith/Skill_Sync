// Shared in-memory + localStorage store for study materials
// Faculty writes here → Student reads from here

export type Material = {
    id: string;
    title: string;
    description: string;
    assignedClass: string;
    fileName: string;
    fileType: string;
    uploadedAt: string;
    uploadedBy?: string;
};

export const INITIAL_MATERIALS: Material[] = [
    {
        id: "mat-1",
        title: "Introduction to Data Structures",
        description: "Lecture 1 — Arrays, Linked Lists, Stacks, and Queues with visual diagrams.",
        assignedClass: "CSE-A (Year 2)",
        fileName: "lecture1-ds.pdf",
        fileType: "PDF",
        uploadedAt: "Feb 20, 2026, 10:00 AM",
        uploadedBy: "Ms. Sarah Smith",
    },
    {
        id: "mat-2",
        title: "DBMS Normalization Slides",
        description: "Complete guide to 1NF, 2NF, 3NF and BCNF with worked examples and practice problems.",
        assignedClass: "CSE-A (Year 2)",
        fileName: "dbms-normalization.pptx",
        fileType: "PPTX",
        uploadedAt: "Feb 19, 2026, 02:30 PM",
        uploadedBy: "Ms. Sarah Smith",
    },
    {
        id: "mat-3",
        title: "Computer Networks — OSI Model",
        description: "Layer-by-layer breakdown of the OSI model with protocol examples.",
        assignedClass: "CSE-A (Year 2)",
        fileName: "osi-model-notes.pdf",
        fileType: "PDF",
        uploadedAt: "Feb 18, 2026, 09:15 AM",
        uploadedBy: "Ms. Sarah Smith",
    },
    {
        id: "mat-4",
        title: "Operating Systems — Process Scheduling",
        description: "FCFS, SJF, Round Robin, and Priority scheduling algorithms with Gantt chart examples.",
        assignedClass: "CSE-A (Year 2)",
        fileName: "os-scheduling.docx",
        fileType: "DOCX",
        uploadedAt: "Feb 17, 2026, 11:00 AM",
        uploadedBy: "Ms. Sarah Smith",
    },
];

const STORAGE_KEY = "skill_materials";

export function getMaterials(): Material[] {
    if (typeof window === "undefined") return INITIAL_MATERIALS;
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const parsed: Material[] = JSON.parse(stored);
            // Merge: put initial ones that aren't already in stored
            const storedIds = new Set(parsed.map((m) => m.id));
            const merged = [
                ...parsed,
                ...INITIAL_MATERIALS.filter((m) => !storedIds.has(m.id)),
            ];
            return merged;
        }
    } catch { }
    return INITIAL_MATERIALS;
}

export function saveMaterial(m: Material): void {
    if (typeof window === "undefined") return;
    try {
        const current = getMaterials();
        const updated = [m, ...current.filter((c) => c.id !== m.id)];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch { }
}
