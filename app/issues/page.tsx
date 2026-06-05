"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { getBugReports, updateBugStatus } from "@/lib/firebase";
import type { BugReport } from "@/types";
import {
  Bug,
  Loader2,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import clsx from "clsx";

const STATUS_META: Record<
  BugReport["status"],
  { label: string; color: string; icon: React.ReactNode }
> = {
  open: {
    label: "Open",
    color: "text-status-error bg-status-error/10 border-status-error/25",
    icon: <AlertCircle size={12} />,
  },
  "in-progress": {
    label: "In Progress",
    color: "text-status-warning bg-status-warning/10 border-status-warning/25",
    icon: <Clock size={12} />,
  },
  resolved: {
    label: "Resolved",
    color: "text-status-success bg-status-success/10 border-status-success/25",
    icon: <CheckCircle2 size={12} />,
  },
};

export default function IssuesPage() {
  const { user, profile, loading } = useAuth();
  const [bugs, setBugs] = useState<BugReport[]>([]);
  const [bugsLoading, setBugsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<"all" | BugReport["status"]>(
    "all",
  );
  const [updating, setUpdating] = useState<string | null>(null);

  // Auth + role check
  if (!loading && (!user || profile?.role !== "developer")) {
    notFound();
  }

  useEffect(() => {
    if (!user || profile?.role !== "developer") return;
    fetchBugs();
  }, [user, profile]);

  async function fetchBugs() {
    setBugsLoading(true);
    const data = await getBugReports();
    setBugs(data);
    setBugsLoading(false);
  }

  async function handleStatusChange(
    bugId: string,
    status: BugReport["status"],
  ) {
    setUpdating(bugId);
    await updateBugStatus(bugId, status);
    setBugs((prev) => prev.map((b) => (b.id === bugId ? { ...b, status } : b)));
    setUpdating(null);
  }

  const filtered =
    statusFilter === "all"
      ? bugs
      : bugs.filter((b) => b.status === statusFilter);

  const counts = {
    all: bugs.length,
    open: bugs.filter((b) => b.status === "open").length,
    "in-progress": bugs.filter((b) => b.status === "in-progress").length,
    resolved: bugs.filter((b) => b.status === "resolved").length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <Loader2 size={20} className="animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-status-error text-sm font-medium mb-2">
              <Bug size={14} />
              Developer Only
            </div>
            <h1 className="font-display text-3xl font-bold text-text-primary mb-1">
              Bug Reports
            </h1>
            <p className="text-text-secondary text-sm">
              {counts.open} open · {counts["in-progress"]} in progress ·{" "}
              {counts.resolved} resolved
            </p>
          </div>
          <button
            onClick={fetchBugs}
            className="btn-ghost flex items-center gap-2"
          >
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>

        {/* Status filters */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          {(["all", "open", "in-progress", "resolved"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={clsx(
                "badge transition-all capitalize",
                statusFilter === s
                  ? s === "all"
                    ? "bg-accent/20 text-accent border-accent/30"
                    : STATUS_META[s as BugReport["status"]].color
                  : "bg-bg-hover text-text-muted border-border-subtle hover:border-border-default",
              )}
            >
              {s === "all" ? `All (${counts.all})` : `${s} (${counts[s]})`}
            </button>
          ))}
        </div>

        {/* Bug list */}
        {bugsLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={20} className="animate-spin text-accent" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-14 h-14 rounded-2xl bg-bg-tertiary border border-border-default flex items-center justify-center mb-4">
              <Bug size={22} className="text-text-muted" />
            </div>
            <h3 className="font-display font-semibold text-text-primary mb-2">
              No bugs found
            </h3>
            <p className="text-sm text-text-secondary">
              {statusFilter === "all"
                ? "No bug reports submitted yet."
                : `No ${statusFilter} bugs.`}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((bug) => (
              <div key={bug.id} className="glass-card p-5 space-y-3">
                {/* Top row */}
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display font-semibold text-text-primary text-sm mb-1 truncate">
                      {bug.title}
                    </h3>
                    <p className="text-xs text-text-muted">
                      {bug.createdByEmail} ·{" "}
                      {new Date(bug.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  {/* Status badge */}
                  <span
                    className={clsx(
                      "badge flex-shrink-0",
                      STATUS_META[bug.status].color,
                    )}
                  >
                    {STATUS_META[bug.status].icon}
                    {STATUS_META[bug.status].label}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
                  {bug.description}
                </p>

                {/* URL */}
                <a
                  href={bug.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-accent transition-colors"
                >
                  <ExternalLink size={11} />
                  <span className="truncate max-w-xs">{bug.url}</span>
                </a>

                {/* Status controls */}
                <div className="flex items-center gap-2 pt-1 border-t border-border-subtle flex-wrap">
                  <span className="text-xs text-text-muted mr-1">
                    Set status:
                  </span>
                  {(["open", "in-progress", "resolved"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => handleStatusChange(bug.id, s)}
                      disabled={bug.status === s || updating === bug.id}
                      className={clsx(
                        "badge transition-all capitalize",
                        bug.status === s
                          ? STATUS_META[s].color
                          : "bg-bg-hover text-text-muted border-border-subtle hover:border-border-default disabled:opacity-40",
                      )}
                    >
                      {updating === bug.id && bug.status !== s ? (
                        <Loader2 size={10} className="animate-spin" />
                      ) : (
                        STATUS_META[s].icon
                      )}
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
