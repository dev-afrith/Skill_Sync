"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Theme = "light" | "dark";

const ThemeContext = createContext<{
    theme: Theme;
    toggle: () => void;
}>({ theme: "light", toggle: () => { } });

export function useTheme() {
    return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState<Theme>("light");

    useEffect(() => {
        const saved = localStorage.getItem("skillsync-theme") as Theme | null;
        if (saved) setTheme(saved);
    }, []);

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("skillsync-theme", theme);
    }, [theme]);

    const toggle = () => setTheme(t => t === "dark" ? "light" : "dark");

    return (
        <ThemeContext.Provider value={{ theme, toggle }}>
            {children}
        </ThemeContext.Provider>
    );
}
