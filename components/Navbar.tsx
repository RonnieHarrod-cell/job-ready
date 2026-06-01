"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  Plus,
  LogOut,
  User,
  ChevronDown,
  Menu,
  X,
  Zap,
} from "lucide-react";
import clsx from "clsx";

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/scenarios/create", label: "New Scenario", icon: Plus },
];

export default function Navbar() {
  const { user, profile, signIn, signOut, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // close dropdown on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  async function handleSignOut() {
    await signOut();
    setDropdownOpen(false);
    router.push("/");
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border-subtle bg-bg-primary/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0 group">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shadow-accent-sm group-hover:shadow-accent-md transition-shadow duration-300">
            <Zap size={16} className="text-white" />
          </div>
          <span className="font-display font-700 text-lg tracking-tight text-text-primary">
            Job<span className="gradient-text-accent">Ready</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {user &&
            NAV_LINKS.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={clsx(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  pathname === href
                    ? "bg-accent/15 text-accent border border-accent/20"
                    : "text-text-secondary hover:text-text-primary hover:bg-bg-hover",
                )}
              >
                <Icon size={15} />
                {label}
              </Link>
            ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {loading ? (
            <div className="w-8 h-8 rounded-full shimmer" />
          ) : user ? (
            <>
              {/* Avatar dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((v) => !v)}
                  className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full border border-border-default hover:border-border-strong bg-bg-tertiary hover:bg-bg-hover transition-all duration-200"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={profile?.displayName ?? "User"}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center">
                      <User size={14} className="text-accent" />
                    </div>
                  )}
                  <span className="hidden sm:block text-sm font-medium text-text-primary max-w-[120px] truncate">
                    {profile?.displayName ?? user.email?.split("@")[0]}
                  </span>
                  <ChevronDown
                    size={14}
                    className={clsx(
                      "text-text-muted transition-transform duration-200",
                      dropdownOpen && "rotate-180",
                    )}
                  />
                </button>

                {/* Dropdown */}
                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 glass-card py-1 animate-fade-in">
                    <div className="px-3 py-2 border-b border-border-subtle mb-1">
                      <p className="text-xs text-text-muted">Signed in as</p>
                      <p className="text-sm font-medium text-text-primary truncate">
                        {user.email}
                      </p>
                    </div>
                    <Link
                      href="/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors duration-150"
                    >
                      <LayoutDashboard size={14} />
                      Dashboard
                    </Link>
                    <Link
                      href="/scenarios/create"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors duration-150"
                    >
                      <Plus size={14} />
                      New Scenario
                    </Link>
                    <div className="border-t border-border-subtle mt-1 pt-1">
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-status-error hover:bg-status-error/10 transition-colors duration-150"
                      >
                        <LogOut size={14} />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <button onClick={signIn} className="btn-accent">
              Sign in with Google
            </button>
          )}

          {/* Mobile menu toggle */}
          {user && (
            <button
              className="md:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && user && (
        <div className="md:hidden border-t border-border-subtle bg-bg-secondary animate-fade-in">
          <nav className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-1">
            {NAV_LINKS.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={clsx(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                  pathname === href
                    ? "bg-accent/15 text-accent"
                    : "text-text-secondary hover:text-text-primary hover:bg-bg-hover",
                )}
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
