"use client";

import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard, BookOpen, TrendingUp, Target, LogOut, Bell, Search, Menu, X,
  GraduationCap, ChevronRight, Sun, Moon
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/ThemeProvider";
import "../dashboard/chrome.css";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();
  const { theme, toggle } = useTheme();

  const menu = [
    { name: "Overview", icon: LayoutDashboard, href: "/dashboard" },
    { name: "Performance", icon: TrendingUp, href: "/student/performance" },
    { name: "Skills Intelligence", icon: Target, href: "/dashboard/skills" },
    { name: "Curriculum", icon: BookOpen, href: "/dashboard/curriculum" },
  ];

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  const initials = session?.user?.name
    ? session.user.name.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase()
    : "U";

  return (
    <div className="ds-shell">
      <aside className={`ds-sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="ds-sidebar-inner">
          <div className="ds-sidebar-top">
            <Link href="/" className="ds-logo">
              <div className="ds-logo-mark">
                <GraduationCap size={18} />
              </div>
              {sidebarOpen && <span className="ds-logo-text">SkillSync</span>}
            </Link>
          </div>

          <nav className="ds-nav">
            {sidebarOpen && <span className="ds-nav-label">Navigation</span>}
            {menu.map((item) => (
              <Link
                key={item.name + item.href}
                href={item.href}
                className={`ds-nav-link ${isActive(item.href) ? "active" : ""}`}
              >
                <item.icon size={18} />
                {sidebarOpen && <span>{item.name}</span>}
                {sidebarOpen && isActive(item.href) && (
                  <ChevronRight size={14} className="ds-nav-arrow" />
                )}
              </Link>
            ))}
          </nav>

          <div className="ds-sidebar-bottom">
            <button onClick={() => signOut()} className="ds-nav-link ds-logout">
              <LogOut size={18} />
              {sidebarOpen && <span>Sign Out</span>}
            </button>
          </div>
        </div>
      </aside>

      <main className="ds-main">
        <header className="ds-header">
          <div className="ds-header-left">
            <button className="ds-icon-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <div className="ds-search">
              <Search size={16} />
              <input type="text" placeholder="Search..." />
            </div>
          </div>

          <div className="ds-header-right">
            <button className="ds-theme-btn" onClick={toggle} title="Toggle theme">
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button className="ds-icon-btn"><Bell size={18} /></button>
            <div className="ds-user">
              <div className="ds-user-avatar">{initials}</div>
              <div className="ds-user-info">
                <span className="ds-user-name">{session?.user?.name}</span>
                <span className="ds-user-role">Student</span>
              </div>
            </div>
          </div>
        </header>

        <div className="ds-page-content">
          {children}
        </div>
      </main>
    </div>
  );
}
