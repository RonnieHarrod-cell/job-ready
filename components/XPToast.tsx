"use client";

import { useEffect, useState } from "react";
import { getRankMeta } from "@/lib/ranks";
import type { Rank } from "@/types";
import { Sparkles, TrendingUp, Star } from "lucide-react";
import clsx from "clsx";

interface XPToastProps {
  xpAwarded: number;
  breakdown: { label: string; xp: number }[];
  newRank: Rank;
  rankedUp: boolean;
  onClose: () => void;
}

export default function XPToast({
  xpAwarded,
  breakdown,
  newRank,
  rankedUp,
  onClose,
}: XPToastProps) {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const rankMeta = getRankMeta(newRank);

  useEffect(() => {
    // animate in
    const t1 = setTimeout(() => setVisible(true), 50);
    // auto close after 6s
    const t2 = setTimeout(() => handleClose(), 6000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  function handleClose() {
    setClosing(true);
    setTimeout(onClose, 400);
  }

  return (
    <div
      className={clsx(
        "fixed bottom-6 right-6 z-[200] w-80 glass-card overflow-hidden transition-all duration-400",
        visible && !closing
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-8",
      )}
      style={{ transitionProperty: "opacity, transform" }}
    >
      {/* Rank up banner */}
      {rankedUp && (
        <div
          className="px-4 py-2.5 flex items-center gap-2"
          style={{ background: rankMeta.glowColor }}
        >
          <Star size={14} className={rankMeta.textColor} fill="currentColor" />
          <span
            className={clsx(
              "text-xs font-bold uppercase tracking-widest",
              rankMeta.textColor,
            )}
          >
            Rank Up! → {newRank}
          </span>
          <span
            className={clsx(
              "ml-auto text-lg font-black font-display",
              rankMeta.textColor,
            )}
          >
            {newRank}
          </span>
        </div>
      )}

      <div className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-accent/20 border border-accent/30 flex items-center justify-center">
              <TrendingUp size={13} className="text-accent" />
            </div>
            <span className="text-sm font-semibold text-text-primary">
              +{xpAwarded} XP earned
            </span>
          </div>
          <button
            onClick={handleClose}
            className="text-xs text-text-muted hover:text-text-primary transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Breakdown */}
        <div className="space-y-1.5">
          {breakdown.map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                <Sparkles size={10} className="text-accent" />
                {item.label}
              </div>
              <span className="text-xs font-medium text-accent">
                +{item.xp}
              </span>
            </div>
          ))}
        </div>

        {/* Current rank */}
        <div className="flex items-center justify-between pt-2 border-t border-border-subtle">
          <span className="text-xs text-text-muted">Current rank</span>
          <span
            className={clsx(
              "text-xs font-bold px-2 py-0.5 rounded-full border",
              rankMeta.textColor,
              rankMeta.borderColor,
            )}
            style={{ backgroundColor: `${rankMeta.glowColor}` }}
          >
            {rankMeta.rank} — {rankMeta.description}
          </span>
        </div>
      </div>

      {/* Progress bar that drain as toast auto-closes */}
      <div className="h-0.5 bg-border-subtle">
        <div
          className="h-full bg-accent transition-all ease-linear"
          style={{
            width: visible && !closing ? "0%" : "100%",
            transitionDuration: visible && !closing ? "6000ms" : "400ms",
          }}
        />
      </div>
    </div>
  );
}
