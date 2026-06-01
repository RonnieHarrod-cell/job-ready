"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import ScenarioCard from "@/components/ScenarioCard";
import AuthModal from "@/components/AuthModal";
import { useAuth } from "@/contexts/AuthContext";
import { getUserScenarios } from "@/lib/firebase";
import { PRESET_SCENARIOS, CATEGORY_META } from "@/lib/scenarios";
import type { Scenario } from "@/types";
import {
  Plus,
  Loader2,
  LayoutGrid,
  Sparkles,
  Search,
  SlidersHorizontal,
  BookOpen,
} from "lucide-react";
import clsx from "clsx";

type CategoryFilter = "all" | Scenario["category"];
type DifficultyFilter = "all" | Scenario["difficulty"];

export default function DashboardPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [customScenarios, setCustomScenarios] = useState<Scenario[]>([]);
  const [customLoading, setCustomLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"preset" | "custom">("preset");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [difficultyFilter, setDifficultyFilter] =
    useState<DifficultyFilter>("all");
  const [search, setSearch] = useState("");

  // Redirect unauthenticated after load
  useEffect(() => {
    if (!loading && !user) setAuthModalOpen(true);
  }, [loading, user]);

  // Load custom scenarios
  useEffect(() => {
    if (!user) return;
    setCustomLoading(true);
    getUserScenarios(user.uid)
      .then(setCustomScenarios)
      .finally(() => setCustomLoading(false));
  }, [user]);

  function refreshCustom() {
    if (!user) return;
    getUserScenarios(user.uid).then(setCustomScenarios);
  }

  // Filter logic
  const filtered = (
    activeTab === "preset" ? PRESET_SCENARIOS : customScenarios
  ).filter((s) => {
    const matchCat = categoryFilter === "all" || s.category === categoryFilter;
    const matchDiff =
      difficultyFilter === "all" || s.difficulty === difficultyFilter;
    const matchSearch =
      !search ||
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase()) ||
      s.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchDiff && matchSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="flex items-center gap-3 text-text-muted">
          <Loader2 size={20} className="animate-spin text-accent" />
          <span className="text-sm">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar />
      <AuthModal
        open={authModalOpen}
        onClose={() => {
          setAuthModalOpen(false);
          if (!user) router.push("/");
        }}
        message="Sign in to access your dashboard and start practising."
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-text-primary mb-1">
              {user
                ? `Welcome back${profile?.displayName ? `, ${profile.displayName.split(" ")[0]}` : ""}`
                : "Dashboard"}
            </h1>
            <p className="text-text-secondary text-sm">
              {profile?.sessionsCompleted
                ? `${profile.sessionsCompleted} session${profile.sessionsCompleted !== 1 ? "s" : ""} completed`
                : "Pick a scenario and start practising"}
            </p>
          </div>
          {user && (
            <Link
              href="/scenarios/create"
              className="btn-accent flex items-center gap-2 self-start sm:self-auto"
            >
              <Plus size={15} />
              New scenario
            </Link>
          )}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 p-1 bg-bg-secondary rounded-xl border border-border-subtle w-fit mb-6">
          {[
            {
              key: "preset",
              label: "Preset",
              icon: BookOpen,
              count: PRESET_SCENARIOS.length,
            },
            {
              key: "custom",
              label: "My Scenarios",
              icon: Sparkles,
              count: customScenarios.length,
            },
          ].map(({ key, label, icon: Icon, count }) => (
            <button
              key={key}
              onClick={() => {
                if (key === "custom" && !user) {
                  setAuthModalOpen(true);
                  return;
                }
                setActiveTab(key as "preset" | "custom");
                setCategoryFilter("all");
                setDifficultyFilter("all");
                setSearch("");
              }}
              className={clsx(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                activeTab === key
                  ? "bg-bg-card text-text-primary border border-border-default shadow-sm"
                  : "text-text-secondary hover:text-text-primary",
              )}
            >
              <Icon size={14} />
              {label}
              <span
                className={clsx(
                  "text-xs px-1.5 py-0.5 rounded-full",
                  activeTab === key
                    ? "bg-accent/20 text-accent"
                    : "bg-bg-hover text-text-muted",
                )}
              >
                {count}
              </span>
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search scenarios..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-dark pl-9"
            />
          </div>

          {/* Category filter */}
          {activeTab === "preset" && (
            <div className="flex items-center gap-2 flex-wrap">
              <SlidersHorizontal size={14} className="text-text-muted" />
              {(["all", "frontend", "backend", "designer"] as const).map(
                (cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={clsx(
                      "badge transition-all duration-150",
                      categoryFilter === cat
                        ? cat === "all"
                          ? "bg-accent/20 text-accent border-accent/30"
                          : CATEGORY_META[cat as Scenario["category"]].color
                        : "bg-bg-hover text-text-muted border-border-subtle hover:border-border-default",
                    )}
                  >
                    {cat === "all"
                      ? "All"
                      : `${CATEGORY_META[cat as Scenario["category"]].icon} ${CATEGORY_META[cat as Scenario["category"]].label}`}
                  </button>
                ),
              )}
            </div>
          )}

          {/* Difficulty filter */}
          <div className="flex items-center gap-2">
            {(["all", "junior", "mid", "senior"] as const).map((diff) => (
              <button
                key={diff}
                onClick={() => setDifficultyFilter(diff)}
                className={clsx(
                  "badge transition-all duration-150 capitalize",
                  difficultyFilter === diff
                    ? "bg-accent/20 text-accent border-accent/30"
                    : "bg-bg-hover text-text-muted border-border-subtle hover:border-border-default",
                )}
              >
                {diff === "all" ? "Any level" : diff}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {activeTab === "custom" && !user ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-4">
              <Sparkles size={22} className="text-accent" />
            </div>
            <h3 className="font-display font-semibold text-text-primary mb-2">
              Sign in to see your scenarios
            </h3>
            <p className="text-sm text-text-secondary mb-5 max-w-xs">
              Create and save custom interview scenarios tailored to any role.
            </p>
            <button
              onClick={() => setAuthModalOpen(true)}
              className="btn-accent"
            >
              Sign in with Google
            </button>
          </div>
        ) : activeTab === "custom" && customLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={20} className="animate-spin text-accent" />
          </div>
        ) : activeTab === "custom" && customScenarios.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-14 h-14 rounded-2xl bg-bg-tertiary border border-border-default flex items-center justify-center mb-4">
              <Plus size={22} className="text-text-muted" />
            </div>
            <h3 className="font-display font-semibold text-text-primary mb-2">
              No custom scenarios yet
            </h3>
            <p className="text-sm text-text-secondary mb-5 max-w-xs">
              Create your first scenario tailored to the exact role you're
              applying for.
            </p>
            <Link
              href="/scenarios/create"
              className="btn-accent flex items-center gap-2"
            >
              <Plus size={15} />
              Create scenario
            </Link>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-14 h-14 rounded-2xl bg-bg-tertiary border border-border-default flex items-center justify-center mb-4">
              <Search size={22} className="text-text-muted" />
            </div>
            <h3 className="font-display font-semibold text-text-primary mb-2">
              No results found
            </h3>
            <p className="text-sm text-text-secondary">
              Try adjusting your filters or search query.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((scenario) => (
              <ScenarioCard
                key={scenario.id}
                scenario={scenario}
                showDelete={activeTab === "custom"}
                onDelete={refreshCustom}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
