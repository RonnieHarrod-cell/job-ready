import Link from "next/link";
import Navbar from "@/components/Navbar";
import ScenarioCard from "@/components/ScenarioCard";
import { PRESET_SCENARIOS, CATEGORY_META } from "@/lib/scenarios";
import {
  Zap,
  Code2,
  MessageSquare,
  BarChart3,
  Sparkles,
  ArrowRight,
  Star,
} from "lucide-react";

const FEATURES = [
  {
    icon: MessageSquare,
    title: "Realistic AI Interviews",
    description:
      "Conversational AI that adapts to your answers, asks follow-ups, and mimics real interview dynamics.",
    color: "text-violet-400",
    bg: "bg-violet-400/10",
    border: "border-violet-400/20",
  },
  {
    icon: Code2,
    title: "Live Code Environment",
    description:
      "Full Monaco editor with syntax highlighting for dev interviews. Write real code, get real feedback.",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/20",
  },
  {
    icon: BarChart3,
    title: "Instant Feedback",
    description:
      "Get a scored debrief after every session — strengths, areas to improve, and an overall assessment.",
    color: "text-sky-400",
    bg: "bg-sky-400/10",
    border: "border-sky-400/20",
  },
  {
    icon: Sparkles,
    title: "Custom Scenarios",
    description:
      "Build your own interview scenarios with custom prompts, difficulty levels, and starter code.",
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/20",
  },
];

const STATS = [
  { value: "9", label: "Preset scenarios" },
  { value: "3", label: "Role categories" },
  { value: "AI", label: "Powered feedback" },
  { value: "∞", label: "Custom scenarios" },
];

export default function LandingPage() {
  const featuredScenarios = PRESET_SCENARIOS.slice(0, 6);

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-24 px-4 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-grid opacity-100 pointer-events-none" />
        <div className="glow-orb w-[600px] h-[600px] bg-accent/8 -top-40 left-1/2 -translate-x-1/2" />
        <div className="glow-orb w-[300px] h-[300px] bg-violet-500/6 top-20 right-10" />

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/30 bg-accent/10 text-accent text-xs font-medium mb-8 animate-fade-in">
            <Zap size={11} />
            AI-powered interview practice
          </div>

          {/* Headline */}
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold text-text-primary leading-[1.05] tracking-tight mb-6 animate-slide-up">
            Ace your next
            <br />
            <span className="gradient-text-accent">interview</span>
          </h1>

          <p className="text-lg text-text-secondary max-w-xl mx-auto mb-10 leading-relaxed animate-slide-up text-balance">
            Practice with an AI interviewer that adapts to you. Frontend,
            backend, design — with a live code editor for dev roles.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-slide-up">
            <Link
              href="/dashboard"
              className="btn-accent flex items-center gap-2 text-base px-6 py-3"
            >
              Start practising free
              <ArrowRight size={16} />
            </Link>
            <a
              href="#scenarios"
              className="btn-ghost flex items-center gap-2 text-base px-6 py-3"
            >
              Browse scenarios
            </a>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-8 mt-16 pt-10 border-t border-border-subtle animate-fade-in">
            {STATS.map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="font-display text-3xl font-bold text-text-primary">
                  {value}
                </p>
                <p className="text-sm text-text-muted mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────────── */}
      <section className="py-24 px-4 border-t border-border-subtle">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-text-primary mb-4">
              Everything you need to{" "}
              <span className="gradient-text-accent">get hired</span>
            </h2>
            <p className="text-text-secondary max-w-lg mx-auto">
              Built for developers and designers who want realistic interview
              practice without the awkward scheduling.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map(
              ({ icon: Icon, title, description, color, bg, border }) => (
                <div
                  key={title}
                  className="glass-card p-5 flex flex-col gap-4 hover:-translate-y-0.5 transition-transform duration-300"
                >
                  <div
                    className={`w-10 h-10 rounded-xl ${bg} border ${border} flex items-center justify-center`}
                  >
                    <Icon size={18} className={color} />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-text-primary text-sm mb-1.5">
                      {title}
                    </h3>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      {description}
                    </p>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* ── Scenarios ────────────────────────────────────────────────────── */}
      <section
        id="scenarios"
        className="py-24 px-4 border-t border-border-subtle"
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-text-primary mb-3">
                Preset scenarios
              </h2>
              <p className="text-text-secondary max-w-md">
                Jump straight into a curated interview. More added regularly.
              </p>
            </div>

            {/* Category pills */}
            <div className="flex flex-wrap gap-2">
              {Object.entries(CATEGORY_META)
                .filter(([k]) => k !== "custom")
                .map(([key, meta]) => (
                  <span key={key} className={`badge ${meta.color}`}>
                    {meta.icon} {meta.label}
                  </span>
                ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredScenarios.map((scenario) => (
              <ScenarioCard key={scenario.id} scenario={scenario} />
            ))}
          </div>

          {PRESET_SCENARIOS.length > 6 && (
            <div className="text-center mt-8">
              <Link
                href="/dashboard"
                className="btn-ghost inline-flex items-center gap-2"
              >
                View all {PRESET_SCENARIOS.length} scenarios
                <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-24 px-4 border-t border-border-subtle">
        <div className="max-w-2xl mx-auto text-center relative">
          <div className="glow-orb w-[400px] h-[400px] bg-accent/6 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          <div className="relative">
            <div className="inline-flex items-center gap-1.5 mb-6 text-amber-400 text-sm">
              <Star size={14} className="fill-amber-400" />
              <span>Free to use. No credit card required.</span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-text-primary mb-5 leading-tight">
              Ready to get{" "}
              <span className="gradient-text-accent">job ready?</span>
            </h2>
            <p className="text-text-secondary mb-8 text-lg">
              Sign in with Google and start your first AI interview in under 30
              seconds.
            </p>
            <Link
              href="/dashboard"
              className="btn-accent inline-flex items-center gap-2 text-base px-8 py-3.5"
            >
              <Zap size={16} />
              Start for free
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-border-subtle py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-accent flex items-center justify-center">
              <Zap size={12} className="text-white" />
            </div>
            <span className="font-display font-semibold text-sm text-text-primary">
              Job<span className="gradient-text-accent">Ready</span>
            </span>
          </div>
          <p className="text-xs text-text-muted">
            Built with Next.js, Groq & Firebase. Practice makes perfect.
          </p>
        </div>
      </footer>
    </div>
  );
}
