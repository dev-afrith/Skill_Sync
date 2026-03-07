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
  title: {
    default: "SkillSync",
    template: "%s | SkillSync",
  },
  description:
    "SkillSync is an AI-powered smart education platform that predicts dropout risks, analyzes skill gaps, and creates personalized career roadmaps aligned with real-world industry demands.",

  keywords: [
    "AI education platform",
    "student analytics",
    "skill gap analysis",
    "career roadmap",
    "Next.js education app",
    "smart learning system",
  ],

  authors: [{ name: "Muhammad Afrith" }],
  creator: "Muhammad Afrith",

  icons: {
    icon: "/logo.png",          // your new logo
    shortcut: "/logo.png",
    apple: "/logo.png",
  },

  openGraph: {
    title: "SkillSync — AI-Powered Smart Education Platform",
    description:
      "Transform education with AI-driven insights. Predict risks, analyze skills, and build personalized learning paths.",
    url: "https://your-domain.com", // update after deploy
    siteName: "SkillSync",
    images: [
      {
        url: "/logo.png", // can later replace with banner image
        width: 1200,
        height: 630,
        alt: "SkillSync Platform Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "SkillSync — Smart Education Platform",
    description:
      "AI-powered platform for student analytics, skill tracking, and career growth.",
    images: ["/logo.png"],
  },

  metadataBase: new URL("https://your-domain.com"), // change after deploy
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
