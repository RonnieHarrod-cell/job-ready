"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import AuthModal from "@/components/AuthModal";
import { useAuth } from "@/contexts/AuthContext";
import { getUserSessions } from "@/lib/firebase";
import {
  getRankMeta,
  getNextRank,
  getXPProgress,
  getXPToNextRank,
  RANKS,
} from "@/lib/ranks";
import type { InterviewSession } from "@/types";
import {
  Loader2,
  Zap,
  Trophy,
  Target,
  Calendar,
  TrendingUp,
  Star,
  Lock,
} from "lucide-react";
import clsx from "clsx";

export default function ProfilePage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) setAuthModalOpen(true);
  }, [loading, user]);

  useEffect(() => {
    if (!user) return;
    getUserSessions(user.uid)
      .then(setSessions)
      .finally(() => setSessionsLoading(false));
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <Loader2 size={20} className="animate-spin text-accent" />
      </div>
    );
  }

  const xp = profile?.xp ?? 0;
  const rank = profile?.rank ?? "E";
  const rankMeta = getRankMeta(rank);
  const nextRank = getNextRank(rank);
  const progress = getXPProgress(xp, rank);
  const xpToNext = getXPToNextRank(xp, rank);
  const isMaxRank = rank === "SSS";

  // Stats
  const totalSessions = profile?.sessionsCompleted ?? 0;
  const recentSessions = sessions.slice(0, 5);
  const joinDate = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-GB", {
        month: "long",
        year: "numeric",
      })
    : "—";

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar />
      <AuthModal
        open={authModalOpen}
        onClose={() => {
          setAuthModalOpen(false);
          if (!user) router.push("/");
        }}
        message="Sign in to view your profile and rank."
      />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-16 space-y-6">
        {/* ── Hero card ──────────────────────────────────────────────────── */}
        <div
          className="glass-card p-6 sm:p-8 relative overflow-hidden"
          style={{ borderColor: rankMeta.glowColor }}
        >
          {/* Glow bg */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at top left, ${rankMeta.glowColor}, transparent 60%)`,
            }}
          />

          <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div
                className="w-20 h-20 rounded-2xl border-2 overflow-hidden"
                style={{ borderColor: rankMeta.glowColor }}
              >
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={profile?.displayName ?? "User"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-bg-tertiary flex items-center justify-center">
                    <span className="text-2xl font-bold text-text-muted">
                      {profile?.displayName?.[0] ?? "?"}
                    </span>
                  </div>
                )}
              </div>
              {/* Rank badge on avatar */}
              <div
                className={clsx(
                  "absolute -bottom-2 -right-2 w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs border-2 font-display",
                  rankMeta.color,
                  rankMeta.textColor,
                )}
                style={{ borderColor: rankMeta.glowColor }}
              >
                {rank}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1 flex-wrap">
                <h1 className="font-display text-2xl font-bold text-text-primary truncate">
                  {profile?.displayName ?? "Unknown"}
                </h1>
                <span
                  className={clsx(
                    "badge font-bold text-sm",
                    rankMeta.textColor,
                    rankMeta.borderColor,
                  )}
                  style={{ backgroundColor: `${rankMeta.glowColor}` }}
                >
                  {rankMeta.rank} — {rankMeta.description}
                </span>
              </div>
              <p className="text-text-muted text-sm mb-4">{user?.email}</p>

              {/* XP bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-secondary font-medium">
                    {xp.toLocaleString()} XP
                  </span>
                  {isMaxRank ? (
                    <span className="text-pink-400 font-bold">MAX RANK</span>
                  ) : (
                    <span className="text-text-muted">
                      {xpToNext} XP to {nextRank?.rank}
                    </span>
                  )}
                </div>
                <div className="h-2.5 bg-bg-tertiary rounded-full overflow-hidden border border-border-subtle">
                  <div
                    className={clsx(
                      "h-full rounded-full transition-all duration-1000",
                      rank === "SSS"
                        ? "bg-gradient-to-r from-yellow-400 via-pink-500 to-violet-500"
                        : rank === "S"
                          ? "bg-yellow-400"
                          : rank === "SS"
                            ? "bg-red-500"
                            : rank === "A"
                              ? "bg-orange-500"
                              : rank === "B"
                                ? "bg-violet-500"
                                : rank === "C"
                                  ? "bg-sky-500"
                                  : rank === "D"
                                    ? "bg-emerald-500"
                                    : "bg-zinc-500",
                    )}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-text-muted">
                  <span>{rankMeta.rank}</span>
                  {!isMaxRank && <span>{nextRank?.rank}</span>}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Stats row ──────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            {
              icon: Trophy,
              label: "Sessions",
              value: totalSessions,
              color: "text-amber-400",
            },
            {
              icon: Zap,
              label: "Total XP",
              value: xp.toLocaleString(),
              color: "text-accent",
            },
            {
              icon: Target,
              label: "Current Rank",
              value: rank,
              color: rankMeta.textColor,
            },
            {
              icon: Calendar,
              label: "Member since",
              value: joinDate,
              color: "text-text-secondary",
            },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="glass-card p-4 flex flex-col gap-2">
              <Icon size={15} className={color} />
              <p className="text-lg font-bold font-display text-text-primary leading-none">
                {value}
              </p>
              <p className="text-xs text-text-muted">{label}</p>
            </div>
          ))}
        </div>

        {/* ── Rank ladder ────────────────────────────────────────────────── */}
        <div className="glass-card p-6">
          <h2 className="font-display font-bold text-text-primary mb-5 flex items-center gap-2">
            <TrendingUp size={16} className="text-accent" />
            Rank Ladder
          </h2>
          <div className="space-y-2">
            {[...RANKS].reverse().map((r) => {
              const isCurrentRank = r.rank === rank;
              const isAchieved = xp >= r.minXP;
              const isLocked = !isAchieved;

              return (
                <div
                  key={r.rank}
                  className={clsx(
                    "flex items-center gap-4 px-4 py-3 rounded-xl border transition-all",
                    isCurrentRank
                      ? "border-opacity-60 bg-opacity-10"
                      : isAchieved
                        ? "border-border-subtle bg-bg-tertiary/50"
                        : "border-border-subtle bg-bg-primary opacity-50",
                  )}
                  style={
                    isCurrentRank
                      ? {
                          borderColor: r.glowColor,
                          backgroundColor: `${r.glowColor}15`,
                          boxShadow: `0 0 20px ${r.glowColor}20`,
                        }
                      : {}
                  }
                >
                  {/* Rank badge */}
                  <div
                    className={clsx(
                      "w-10 h-10 rounded-lg flex items-center justify-center font-black text-sm font-display border flex-shrink-0",
                      isLocked
                        ? "bg-bg-hover text-text-muted border-border-subtle"
                        : r.color,
                      isLocked ? "" : r.textColor,
                    )}
                    style={!isLocked ? { borderColor: r.glowColor } : {}}
                  >
                    {isLocked ? <Lock size={14} /> : r.rank}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={clsx(
                          "font-display font-bold text-sm",
                          isLocked ? "text-text-muted" : "text-text-primary",
                        )}
                      >
                        Rank {r.rank}
                      </span>
                      <span
                        className={clsx(
                          "text-xs",
                          isLocked ? "text-text-muted" : "text-text-secondary",
                        )}
                      >
                        — {r.description}
                      </span>
                      {isCurrentRank && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-accent/20 text-accent border border-accent/30 font-medium">
                          Current
                        </span>
                      )}
                    </div>
                    <p
                      className={clsx(
                        "text-xs mt-0.5",
                        isLocked ? "text-text-muted" : "text-text-muted",
                      )}
                    >
                      {r.maxXP === Infinity
                        ? `${r.minXP.toLocaleString()}+ XP`
                        : `${r.minXP.toLocaleString()} – ${r.maxXP.toLocaleString()} XP`}
                    </p>
                  </div>

                  {/* Star for achieved */}
                  {isAchieved && !isLocked && (
                    <Star
                      size={14}
                      className={r.textColor}
                      fill="currentColor"
                      style={{ filter: `drop-shadow(0 0 4px ${r.glowColor})` }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Recent sessions ────────────────────────────────────────────── */}
        <div className="glass-card p-6">
          <h2 className="font-display font-bold text-text-primary mb-5 flex items-center gap-2">
            <Trophy size={16} className="text-accent" />
            Recent Sessions
          </h2>

          {sessionsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 size={18} className="animate-spin text-accent" />
            </div>
          ) : recentSessions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-text-muted text-sm">
                No sessions yet. Start an interview to earn XP!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-bg-tertiary border border-border-subtle"
                >
                  <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Zap size={13} className="text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">
                      {session.scenarioId.replace(/-/g, " ")}
                    </p>
                    <p className="text-xs text-text-muted mt-0.5">
                      {new Date(session.startedAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                    {session.feedback && (
                      <p className="text-xs text-text-secondary mt-1.5 line-clamp-2 leading-relaxed">
                        {session.feedback}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
