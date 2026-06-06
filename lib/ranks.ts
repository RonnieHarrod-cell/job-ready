import type { Rank } from "@/types";

export interface RankMeta {
    rank: Rank;
    label: string;
    minXP: number;
    maxXP: number;
    color: string;
    textColor: string;
    borderColor: string;
    glowColor: string;
    description: string;
}

export const RANKS: RankMeta[] = [
  {
    rank: "E",
    label: "E",
    minXP: 0,
    maxXP: 99,
    color: "bg-zinc-700",
    textColor: "text-zinc-300",
    borderColor: "border-zinc-600",
    glowColor: "rgba(113,113,122,0.4)",
    description: "Beginner",
  },
  {
    rank: "D",
    label: "D",
    minXP: 100,
    maxXP: 299,
    color: "bg-emerald-700",
    textColor: "text-emerald-300",
    borderColor: "border-emerald-500",
    glowColor: "rgba(16,185,129,0.4)",
    description: "Novice",
  },
  {
    rank: "C",
    label: "C",
    minXP: 300,
    maxXP: 699,
    color: "bg-sky-700",
    textColor: "text-sky-300",
    borderColor: "border-sky-500",
    glowColor: "rgba(14,165,233,0.4)",
    description: "Apprentice",
  },
  {
    rank: "B",
    label: "B",
    minXP: 700,
    maxXP: 1499,
    color: "bg-violet-700",
    textColor: "text-violet-300",
    borderColor: "border-violet-500",
    glowColor: "rgba(139,92,246,0.4)",
    description: "Skilled",
  },
  {
    rank: "A",
    label: "A",
    minXP: 1500,
    maxXP: 2999,
    color: "bg-orange-600",
    textColor: "text-orange-300",
    borderColor: "border-orange-400",
    glowColor: "rgba(234,88,12,0.4)",
    description: "Expert",
  },
  {
    rank: "S",
    label: "S",
    minXP: 3000,
    maxXP: 5999,
    color: "bg-yellow-500",
    textColor: "text-yellow-900",
    borderColor: "border-yellow-400",
    glowColor: "rgba(234,179,8,0.5)",
    description: "Elite",
  },
  {
    rank: "SS",
    label: "SS",
    minXP: 6000,
    maxXP: 9999,
    color: "bg-red-600",
    textColor: "text-red-100",
    borderColor: "border-red-400",
    glowColor: "rgba(220,38,38,0.5)",
    description: "Master",
  },
  {
    rank: "SSS",
    label: "SSS",
    minXP: 10000,
    maxXP: Infinity,
    color: "bg-gradient-to-r from-yellow-400 via-pink-500 to-violet-500",
    textColor: "text-white",
    borderColor: "border-pink-400",
    glowColor: "rgba(236,72,153,0.6)",
    description: "Legendary",
  },
];

// helpers
export function getRankMeta(rank: Rank): RankMeta {
    return RANKS.find((r) => r.rank === rank) ?? RANKS[0];
}

export function getRankFromXP(xp: number): Rank {
    const rank = [...RANKS].reverse().find((r) => xp >= r.minXP);
    return rank?.rank ?? "E";
}

export function getNextRank(rank: Rank): RankMeta | null {
    const idx = RANKS.findIndex((r) => r.rank === rank);
    return idx < RANKS.length - 1 ? RANKS[idx + 1] : null;
}

export function getXPProgress(xp: number, rank: Rank): number {
    const meta = getRankMeta(rank);
    const next = getNextRank(rank);
    if (!next) return 100;
    const range = next.minXP - meta.minXP;
    const progress = xp - meta.minXP;
    return Math.min(100, Math.floor((progress / range) * 100));
}

export function getXPToNextRank(xp: number, rank: Rank): number {
    const next = getNextRank(rank);
    if (!next) return 0;
    return next.minXP - xp;
}

// XP awards
export const XP_REWARDS = {
    SESSION_COMPLETE: 50,
    HIGH_SCORE_BONUS: 25,
    CUSTOM_SCENARIO: 75,
    DAILY_BONUS: 20,
} as const;

export function calculateSessionXP(
    isCustomScenario: boolean,
    feedback: string,
    isFirstSessionToday: boolean
): { total: number; breakdown: { label: string; xp: number } [] } {
    const breakdown: { label: string; xp: number }[] = [];

    breakdown.push({ label: "Session completed", xp: XP_REWARDS.SESSION_COMPLETE });

    if (isCustomScenario) {
        breakdown.push({ label: "Custom scenario bonus", xp: XP_REWARDS.CUSTOM_SCENARIO });
    }

    // check if feedback mentions a high score (8/10+)
    if (/\b(8|9|10)\s*\/\s*10\b/.test(feedback)) {
        breakdown.push({ label: "High score bonus", xp: XP_REWARDS.HIGH_SCORE_BONUS });
    }

    if (isFirstSessionToday) {
        breakdown.push({ label: "Daily first session bonus", xp: XP_REWARDS.DAILY_BONUS });
    }

    const total = breakdown.reduce((sum, b) => sum + b.xp, 0);
    return { total, breakdown };
}
