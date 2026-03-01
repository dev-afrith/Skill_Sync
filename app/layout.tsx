import type { Metadata } from "next";
import { Outfit, Space_Grotesk } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const outfit = Outfit({
    subsets: ["latin"],
    variable: "--font-outfit",
    weight: ["300", "400", "500", "600", "700", "800", "900"],
    display: "swap",
});

const spaceGrotesk = Space_Grotesk({
    subsets: ["latin"],
    variable: "--font-space-grotesk",
    weight: ["300", "400", "500", "600", "700"],
    display: "swap",
});

export const metadata: Metadata = {
    title: "SkillSync — AI-Powered Smart Education Platform",
    description:
        "SkillSync aligns education with industry realities. Predict dropout risks, analyze skill gaps, and generate personalized career roadmaps using real-time job market data.",
    keywords: [
        "education platform",
        "AI learning",
        "skill gap analysis",
        "career roadmap",
        "smart education",
    ],
    authors: [{ name: "SkillSync" }],
    openGraph: {
        title: "SkillSync — AI-Powered Smart Education Platform",
        description:
            "The ultimate Smart Education Platform that predicts dropout risks, analyzes skill gaps, and generates personalized career roadmaps.",
        type: "website",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${outfit.variable} ${spaceGrotesk.variable}`}>
            <body>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
