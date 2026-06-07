"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { submitBugReport } from "@/lib/firebase";
import {
  LayoutDashboard,
  Plus,
  LogOut,
  User,
  ChevronDown,
  Menu,
  X,
  Bug,
  CheckCircle2,
  Loader2,
  UserCircle2,
} from "lucide-react";
import clsx from "clsx";

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/profile", label: "Profile", icon: UserCircle2 },
  { href: "/scenarios/create", label: "New Scenario", icon: Plus },
];

export default function Navbar() {
  const { user, profile, signIn, signOut, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [bugModalOpen, setBugModalOpen] = useState(false);
  const [bugTitle, setBugTitle] = useState("");
  const [bugDesc, setBugDesc] = useState("");
  const [bugSubmitting, setBugSubmitting] = useState(false);
  const [bugSuccess, setBugSuccess] = useState(false);

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

  async function handleBugSubmit() {
    if (!bugTitle.trim() || !bugDesc.trim() || !user) return;
    setBugSubmitting(true);
    await submitBugReport({
      title: bugTitle,
      description: bugDesc,
      url: window.location.href,
      createdBy: user.uid,
      createdByEmail: user.email ?? "",
    });
    setBugSubmitting(false);
    setBugSuccess(true);
    setBugTitle("");
    setBugDesc("");
    setTimeout(() => {
      setBugSuccess(false);
      setBugModalOpen(false);
    }, 2000);
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border-subtle bg-bg-primary/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <Image
              src="/logo-512.png"
              alt="JobReady logo"
              width={32}
              height={32}
              className="rounded-lg"
            />
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
                {/* Bug report button */}
                <button
                  onClick={() => setBugModalOpen(true)}
                  className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-hover border border-border-subtle transition-colors"
                  title="Report a bug"
                >
                  <Bug size={15} />
                </button>

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
                        href="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors duration-150"
                      >
                        <UserCircle2 size={14} />
                        Profile & Rank
                      </Link>
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
      {/* Bug report modal */}
      {bugModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.currentTarget === e.target) setBugModalOpen(false);
          }}
        >
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setBugModalOpen(false)}
          />
          <div className="relative w-full max-w-md glass-card p-6 animate-slide-up space-y-4 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-status-error/15 border border-status-error/25 flex items-center justify-center">
                  <Bug size={15} className="text-status-error" />
                </div>
                <h2 className="font-display font-semibold text-text-primary">
                  Report a bug
                </h2>
              </div>
              <button
                onClick={() => setBugModalOpen(false)}
                className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors"
              >
                <X size={15} />
              </button>
            </div>

            {bugSuccess ? (
              <div className="flex flex-col items-center justify-center py-6 text-center gap-3">
                <div className="w-10 h-10 rounded-full bg-status-success/15 border border-status-success/25 flex items-center justify-center">
                  <CheckCircle2 size={18} className="text-status-success" />
                </div>
                <p className="text-sm font-medium text-text-primary">
                  Bug reported, thanks!
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-text-secondary uppercase tracking-wide">
                    Title
                  </label>
                  <input
                    type="text"
                    placeholder="Short description of the issue"
                    value={bugTitle}
                    onChange={(e) => setBugTitle(e.target.value)}
                    className="input-dark"
                    maxLength={80}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-text-secondary uppercase tracking-wide">
                    Details
                  </label>
                  <textarea
                    placeholder="What happened? What did you expect to happen?"
                    value={bugDesc}
                    onChange={(e) => setBugDesc(e.target.value)}
                    className="textarea-dark"
                    rows={4}
                  />
                </div>
                <div className="flex gap-3 pt-1">
                  <button
                    onClick={() => setBugModalOpen(false)}
                    className="btn-ghost flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleBugSubmit}
                    disabled={
                      !bugTitle.trim() || !bugDesc.trim() || bugSubmitting
                    }
                    className="btn-accent flex-1 flex items-center justify-center gap-2"
                  >
                    {bugSubmitting ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Bug size={14} />
                    )}
                    {bugSubmitting ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
