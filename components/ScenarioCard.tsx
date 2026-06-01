"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Code2, MessageSquare, ArrowRight, Trash2, Lock } from "lucide-react";
import { CATEGORY_META, DIFFICULTY_META } from "@/lib/scenarios";
import { deleteScenario } from "@/lib/firebase";
import type { Scenario } from "@/types";
import clsx from "clsx";

interface ScenarioCardProps {
  scenario: Scenario;
  onDelete?: () => void;
  showDelete?: boolean;
}

export default function ScenarioCard({
  scenario,
  onDelete,
  showDelete = false,
}: ScenarioCardProps) {
  const { user, signIn } = useAuth();
  const router = useRouter();
  const categoryMeta = CATEGORY_META[scenario.category];
  const difficultyMeta = DIFFICULTY_META[scenario.difficulty];

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;
    if (!confirm("Delete this scenario?")) return;
    await deleteScenario(scenario.id, user.uid);
    onDelete?.();
  }

  async function handleStart(e: React.MouseEvent) {
    e.preventDefault();
    if (!user) {
      await signIn();
      return;
    }
    router.push(`/interview/${scenario.id}`);
  }

  return (
    <div
      className={clsx(
        "glass-card group relative flex flex-col gap-4 p-5 cursor-pointer",
        "transition-all duration-300 hover:-translate-y-0.5",
      )}
      onClick={handleStart}
    >
      {/* Top row — category + difficulty badges */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={clsx("badge", categoryMeta.color)}>
            <span className="mr-1">{categoryMeta.icon}</span>
            {categoryMeta.label}
          </span>
          <span className={clsx("badge", difficultyMeta.color)}>
            {difficultyMeta.label}
          </span>
        </div>

        {/* Code / chat indicator */}
        <div className="text-text-muted">
          {scenario.hasCode ? (
            <Code2 size={15} className="text-accent/60" />
          ) : (
            <MessageSquare size={15} className="text-text-muted" />
          )}
        </div>
      </div>

      {/* Title & description */}
      <div className="flex-1">
        <h3 className="font-display font-semibold text-base text-text-primary mb-1.5 group-hover:text-accent transition-colors duration-200">
          {scenario.title}
        </h3>
        <p className="text-sm text-text-secondary leading-relaxed line-clamp-2">
          {scenario.description}
        </p>
      </div>

      {/* Tags */}
      {scenario.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {scenario.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-md bg-bg-hover text-text-muted border border-border-subtle"
            >
              {tag}
            </span>
          ))}
          {scenario.tags.length > 4 && (
            <span className="text-xs px-2 py-0.5 rounded-md bg-bg-hover text-text-muted border border-border-subtle">
              +{scenario.tags.length - 4}
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 border-t border-border-subtle">
        <div className="flex items-center gap-1.5 text-xs text-text-muted">
          {scenario.hasCode && (
            <>
              <Code2 size={11} />
              <span>{scenario.language}</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Delete button (custom scenarios only) */}
          {showDelete && user && (
            <button
              onClick={handleDelete}
              className="p-1.5 rounded-md text-text-muted hover:text-status-error hover:bg-status-error/10 transition-colors duration-150"
              title="Delete scenario"
            >
              <Trash2 size={13} />
            </button>
          )}

          {/* Start button */}
          <button
            onClick={handleStart}
            className={clsx(
              "flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all duration-200",
              user
                ? "bg-accent/15 text-accent border border-accent/25 hover:bg-accent hover:text-white"
                : "bg-bg-hover text-text-muted border border-border-subtle hover:border-border-strong",
            )}
          >
            {user ? (
              <>
                Start
                <ArrowRight size={12} />
              </>
            ) : (
              <>
                <Lock size={11} />
                Sign in
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
