"use client";

import { useEffect, useState } from "react";
import {
  CHANGELOG,
  LATEST_VERSION,
  CHANGELOG_STORAGE_KEY,
} from "@/lib/changelog";
import { X, Sparkles, Wrench, Zap, ChevronDown, ChevronUp } from "lucide-react";
import clsx from "clsx";

const TYPE_META = {
  new: {
    label: "New",
    icon: Sparkles,
    color: "text-accent bg-accent/10 border-accent/25",
  },
  improved: {
    label: "Improved",
    icon: Zap,
    color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/25",
  },
  fixed: {
    label: "Fixed",
    icon: Wrench,
    color: "text-amber-400 bg-amber-400/10 border-amber-400/25",
  },
};

export default function ChangelogModal() {
  const [open, setOpen] = useState(false);
  const [expandedVersions, setExpandedVersions] = useState<string[]>([]);

  useEffect(() => {
    const seen = localStorage.getItem(CHANGELOG_STORAGE_KEY);
    if (seen !== LATEST_VERSION) {
      setOpen(true);
      // Show latest entry expanded by default
      setExpandedVersions([CHANGELOG[0].version]);
    }
  }, []);

  function handleClose() {
    localStorage.setItem(CHANGELOG_STORAGE_KEY, LATEST_VERSION);
    setOpen(false);
  }

  function toggleVersion(version: string) {
    setExpandedVersions((prev) =>
      prev.includes(version)
        ? prev.filter((v) => v !== version)
        : [...prev, version],
    );
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg glass-card animate-slide-up flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <div className="w-5 h-5 rounded bg-accent flex items-center justify-center">
                <Zap size={11} className="text-white" />
              </div>
              <h2 className="font-display font-bold text-text-primary text-base">
                What's New
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-accent/20 text-accent border border-accent/30 font-medium">
                v{LATEST_VERSION}
              </span>
            </div>
            <p className="text-xs text-text-muted">
              JobReady has been updated — here's what changed
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* Changelog entries */}
        <div className="overflow-y-auto flex-1 px-6 py-4 space-y-3">
          {CHANGELOG.map((entry, idx) => {
            const isExpanded = expandedVersions.includes(entry.version);
            const isLatest = idx === 0;

            return (
              <div
                key={entry.version}
                className={clsx(
                  "rounded-xl border overflow-hidden transition-all",
                  isLatest
                    ? "border-accent/30 bg-accent/5"
                    : "border-border-subtle bg-bg-tertiary/50",
                )}
              >
                {/* Version header */}
                <button
                  onClick={() => toggleVersion(entry.version)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-bg-hover/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={clsx(
                          "text-xs font-bold px-2 py-0.5 rounded-full border",
                          isLatest
                            ? "bg-accent/20 text-accent border-accent/30"
                            : "bg-bg-hover text-text-muted border-border-subtle",
                        )}
                      >
                        v{entry.version}
                      </span>
                      {isLatest && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-400/15 text-emerald-400 border border-emerald-400/25 font-medium">
                          Latest
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-text-primary">
                        {entry.title}
                      </p>
                      <p className="text-xs text-text-muted">{entry.date}</p>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp size={14} className="text-text-muted shrink-0" />
                  ) : (
                    <ChevronDown
                      size={14}
                      className="text-text-muted shrink-0"
                    />
                  )}
                </button>

                {/* Items */}
                {isExpanded && (
                  <div className="px-4 pb-4 space-y-2 border-t border-border-subtle pt-3">
                    {entry.items.map((item, i) => {
                      const meta = TYPE_META[item.type];
                      const Icon = meta.icon;
                      return (
                        <div key={i} className="flex items-start gap-2.5">
                          <span
                            className={clsx(
                              "inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded border shrink-0 mt-0.5",
                              meta.color,
                            )}
                          >
                            <Icon size={9} />
                            {meta.label}
                          </span>
                          <p className="text-xs text-text-secondary leading-relaxed">
                            {item.text}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border-subtle shrink-0">
          <button onClick={handleClose} className="btn-accent w-full">
            Got it, let's go!
          </button>
        </div>
      </div>
    </div>
  );
}
