"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import AuthModal from "@/components/AuthModal";
import ScenarioCard from "@/components/ScenarioCard";
import { useAuth } from "@/contexts/AuthContext";
import { createScenario } from "@/lib/firebase";
import type { Scenario } from "@/types";
import { CATEGORY_META, DIFFICULTY_META } from "@/lib/scenarios";
import {
  Sparkles,
  Code2,
  Loader2,
  Plus,
  X,
  ChevronRight,
  Eye,
  Info,
} from "lucide-react";
import clsx from "clsx";

const EMPTY: Omit<Scenario, "id"> = {
  title: "",
  description: "",
  category: "custom",
  difficulty: "junior",
  hasCode: false,
  language: "javascript",
  starterCode: "",
  systemPrompt: "",
  tags: [],
  isPublic: false,
};

const PROMPT_TIPS = [
  'Start with "You are a [role] interviewing a [level] candidate."',
  "Tell the AI what topics to focus on.",
  "Specify response length: 'Keep responses under 120 words.'",
  "Add a wrap-up instruction: 'After 8 exchanges, provide feedback.'",
];

const LANG_OPTIONS = [
  "javascript",
  "typescript",
  "python",
  "html",
  "css",
  "java",
  "go",
  "rust",
];

export default function CreateScenarioPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState<Omit<Scenario, "id">>(EMPTY);
  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (!authLoading && !user) setAuthModalOpen(true);
  }, [authLoading, user]);

  function update<K extends keyof typeof form>(key: K, val: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: val }));
    setError(null);
  }

  function addTag(e: React.KeyboardEvent<HTMLInputElement>) {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
      e.preventDefault();
      const tag = tagInput.trim().replace(/,$/, "");
      if (tag && !form.tags.includes(tag) && form.tags.length < 8) {
        update("tags", [...form.tags, tag]);
      }
      setTagInput("");
    }
  }

  function removeTag(tag: string) {
    update(
      "tags",
      form.tags.filter((t) => t !== tag),
    );
  }

  function validate(): string | null {
    if (!form.title.trim()) return "Please enter a title.";
    if (!form.description.trim()) return "Please enter a description.";
    if (!form.systemPrompt.trim()) return "Please enter a system prompt.";
    if (form.systemPrompt.trim().length < 50)
      return "System prompt should be at least 50 characters.";
    return null;
  }

  async function handleSave() {
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    if (!user) {
      setAuthModalOpen(true);
      return;
    }

    setSaving(true);
    try {
      const id = await createScenario(form, user.uid);
      router.push(`/interview/${id}`);
    } catch {
      setError("Failed to save scenario. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  const STEPS = ["Basics", "Prompt", "Code", "Preview"];

  const previewScenario: Scenario = { id: "preview", ...form };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <Loader2 size={20} className="animate-spin text-accent" />
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
        message="Sign in to create and save custom interview scenarios."
      />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-accent text-sm font-medium mb-3">
            <Sparkles size={14} />
            Custom Scenario
          </div>
          <h1 className="font-display text-3xl font-bold text-text-primary mb-2">
            Build your own interview
          </h1>
          <p className="text-text-secondary text-sm">
            Tailor the AI interviewer to any role, stack, or difficulty level.
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((step, i) => (
            <button
              key={step}
              onClick={() => setActiveStep(i)}
              className="flex items-center gap-2"
            >
              <div
                className={clsx(
                  "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                  activeStep === i
                    ? "bg-accent/20 text-accent border border-accent/30"
                    : i < activeStep
                      ? "bg-bg-hover text-text-secondary border border-border-subtle"
                      : "text-text-muted",
                )}
              >
                <span
                  className={clsx(
                    "w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold",
                    activeStep === i
                      ? "bg-accent text-white"
                      : i < activeStep
                        ? "bg-status-success text-white"
                        : "bg-bg-hover text-text-muted border border-border-subtle",
                  )}
                >
                  {i + 1}
                </span>
                {step}
              </div>
              {i < STEPS.length - 1 && (
                <ChevronRight size={12} className="text-text-muted" />
              )}
            </button>
          ))}
        </div>

        {/* ── Step 0: Basics ─────────────────────────────────────────────── */}
        {activeStep === 0 && (
          <div className="glass-card p-6 space-y-5 animate-fade-in">
            <h2 className="font-display font-semibold text-text-primary">
              Basic details
            </h2>

            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-text-secondary uppercase tracking-wide">
                Title *
              </label>
              <input
                type="text"
                placeholder="e.g. Senior iOS Engineer"
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                className="input-dark"
                maxLength={60}
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-text-secondary uppercase tracking-wide">
                Description *
              </label>
              <textarea
                placeholder="Brief overview of what this interview covers..."
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                className="textarea-dark"
                rows={3}
                maxLength={200}
              />
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-text-secondary uppercase tracking-wide">
                Category
              </label>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(CATEGORY_META) as Scenario["category"][]).map(
                  (cat) => (
                    <button
                      key={cat}
                      onClick={() => update("category", cat)}
                      className={clsx(
                        "badge transition-all",
                        form.category === cat
                          ? CATEGORY_META[cat].color
                          : "bg-bg-hover text-text-muted border-border-subtle",
                      )}
                    >
                      {CATEGORY_META[cat].icon} {CATEGORY_META[cat].label}
                    </button>
                  ),
                )}
              </div>
            </div>

            {/* Difficulty */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-text-secondary uppercase tracking-wide">
                Difficulty
              </label>
              <div className="flex gap-2">
                {(Object.keys(DIFFICULTY_META) as Scenario["difficulty"][]).map(
                  (diff) => (
                    <button
                      key={diff}
                      onClick={() => update("difficulty", diff)}
                      className={clsx(
                        "badge transition-all",
                        form.difficulty === diff
                          ? DIFFICULTY_META[diff].color
                          : "bg-bg-hover text-text-muted border-border-subtle",
                      )}
                    >
                      {DIFFICULTY_META[diff].label}
                    </button>
                  ),
                )}
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-text-secondary uppercase tracking-wide">
                Tags
                <span className="ml-1 text-text-muted normal-case">
                  (press Enter to add)
                </span>
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {form.tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-bg-hover border border-border-subtle text-text-secondary"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="text-text-muted hover:text-status-error transition-colors"
                    >
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                placeholder="e.g. Swift, iOS, UIKit"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={addTag}
                className="input-dark"
                disabled={form.tags.length >= 8}
              />
            </div>

            {/* Visibility */}
            <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-bg-tertiary border border-border-subtle">
              <div>
                <p className="text-sm font-medium text-text-primary">
                  Make public
                </p>
                <p className="text-xs text-text-muted">
                  Share with all Job Ready users
                </p>
              </div>
              <button
                onClick={() => update("isPublic", !form.isPublic)}
                className={clsx(
                  "w-10 h-5 rounded-full transition-colors duration-200 relative",
                  form.isPublic
                    ? "bg-accent"
                    : "bg-bg-hover border border-border-default",
                )}
              >
                <span
                  className={clsx(
                    "absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-200 shadow-sm",
                    form.isPublic ? "translate-x-5" : "translate-x-0.5",
                  )}
                />
              </button>
            </div>

            <button
              onClick={() => setActiveStep(1)}
              className="btn-accent w-full"
            >
              Next: Write the prompt →
            </button>
          </div>
        )}

        {/* ── Step 1: Prompt ─────────────────────────────────────────────── */}
        {activeStep === 1 && (
          <div className="space-y-4 animate-fade-in">
            <div className="glass-card p-6 space-y-4">
              <h2 className="font-display font-semibold text-text-primary">
                System prompt
              </h2>
              <p className="text-sm text-text-secondary">
                This tells the AI how to behave as an interviewer. Be specific
                about role, topics, tone, and length of responses.
              </p>
              <textarea
                placeholder="You are a senior iOS engineer interviewing a candidate for a mobile role at a startup. Ask about Swift, UIKit, SwiftUI, and Combine. Focus on practical experience. Keep responses under 120 words..."
                value={form.systemPrompt}
                onChange={(e) => update("systemPrompt", e.target.value)}
                className="textarea-dark font-mono text-xs"
                rows={10}
              />
              <p className="text-xs text-text-muted text-right">
                {form.systemPrompt.length} chars
              </p>
            </div>

            {/* Tips */}
            <div className="glass-card p-5 border-accent/15">
              <div className="flex items-center gap-2 mb-3 text-accent text-sm font-medium">
                <Info size={13} />
                Prompt tips
              </div>
              <ul className="space-y-2">
                {PROMPT_TIPS.map((tip) => (
                  <li
                    key={tip}
                    className="flex items-start gap-2 text-xs text-text-secondary"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setActiveStep(0)}
                className="btn-ghost flex-1"
              >
                ← Back
              </button>
              <button
                onClick={() => setActiveStep(2)}
                className="btn-accent flex-1"
              >
                Next: Code setup →
              </button>
            </div>
          </div>
        )}

        {/* ── Step 2: Code ───────────────────────────────────────────────── */}
        {activeStep === 2 && (
          <div className="glass-card p-6 space-y-5 animate-fade-in">
            <h2 className="font-display font-semibold text-text-primary">
              Code environment
            </h2>

            {/* Toggle */}
            <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-bg-tertiary border border-border-subtle">
              <div className="flex items-center gap-3">
                <Code2 size={16} className="text-accent" />
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    Include code editor
                  </p>
                  <p className="text-xs text-text-muted">
                    Add a live Monaco editor to the interview
                  </p>
                </div>
              </div>
              <button
                onClick={() => update("hasCode", !form.hasCode)}
                className={clsx(
                  "w-10 h-5 rounded-full transition-colors duration-200 relative",
                  form.hasCode
                    ? "bg-accent"
                    : "bg-bg-hover border border-border-default",
                )}
              >
                <span
                  className={clsx(
                    "absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-200 shadow-sm",
                    form.hasCode ? "translate-x-5" : "translate-x-0.5",
                  )}
                />
              </button>
            </div>

            {form.hasCode && (
              <>
                {/* Language */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-text-secondary uppercase tracking-wide">
                    Language
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {LANG_OPTIONS.map((lang) => (
                      <button
                        key={lang}
                        onClick={() => update("language", lang)}
                        className={clsx(
                          "badge font-mono transition-all",
                          form.language === lang
                            ? "bg-accent/20 text-accent border-accent/30"
                            : "bg-bg-hover text-text-muted border-border-subtle",
                        )}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Starter code */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-text-secondary uppercase tracking-wide">
                    Starter code
                    <span className="ml-1 text-text-muted normal-case">
                      (optional)
                    </span>
                  </label>
                  <textarea
                    placeholder={`// Write starter code here...\n// The candidate will see this when they open the interview.`}
                    value={form.starterCode ?? ""}
                    onChange={(e) => update("starterCode", e.target.value)}
                    className="textarea-dark font-mono text-xs"
                    rows={8}
                    spellCheck={false}
                  />
                </div>
              </>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setActiveStep(1)}
                className="btn-ghost flex-1"
              >
                ← Back
              </button>
              <button
                onClick={() => setActiveStep(3)}
                className="btn-accent flex-1"
              >
                Preview →
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: Preview ────────────────────────────────────────────── */}
        {activeStep === 3 && (
          <div className="space-y-5 animate-fade-in">
            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-4 text-sm font-medium text-text-secondary">
                <Eye size={14} />
                Card preview
              </div>
              <div className="max-w-sm">
                <ScenarioCard scenario={previewScenario} />
              </div>
            </div>

            {/* Summary */}
            <div className="glass-card p-5 space-y-3">
              <h3 className="text-sm font-medium text-text-primary">Summary</h3>
              {[
                { label: "Title", value: form.title || "—" },
                {
                  label: "Category",
                  value: CATEGORY_META[form.category].label,
                },
                {
                  label: "Difficulty",
                  value: DIFFICULTY_META[form.difficulty].label,
                },
                {
                  label: "Code editor",
                  value: form.hasCode ? `Yes (${form.language})` : "No",
                },
                {
                  label: "Tags",
                  value: form.tags.length ? form.tags.join(", ") : "—",
                },
                {
                  label: "Visibility",
                  value: form.isPublic ? "Public" : "Private",
                },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-text-muted">{label}</span>
                  <span className="text-text-primary font-medium">{value}</span>
                </div>
              ))}
            </div>

            {error && (
              <div className="px-4 py-3 rounded-lg bg-status-error/10 border border-status-error/25 text-status-error text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setActiveStep(2)}
                className="btn-ghost flex-1"
              >
                ← Back
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn-accent flex-1 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Plus size={14} />
                    Create & start interview
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
