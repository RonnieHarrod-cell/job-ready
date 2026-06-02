"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import ChatInterface from "@/components/ChatInterface";
import CodeEditor from "@/components/CodeEditor";
import AuthModal from "@/components/AuthModal";
import { useAuth } from "@/contexts/AuthContext";
import { getScenarioById } from "@/lib/scenarios";
import { getDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Scenario } from "@/types";
import {
  ChevronLeft,
  Code2,
  MessageSquare,
  Loader2,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { CATEGORY_META, DIFFICULTY_META } from "@/lib/scenarios";
import clsx from "clsx";

interface PageProps {
  params: Promise<{ scenarioId: string }>;
}

export default function InterviewPage({ params }: PageProps) {
  const { scenarioId } = use(params);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [scenarioLoading, setScenarioLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [code, setCode] = useState<string>("");
  const [codeVisible, setCodeVisible] = useState(true);
  const [mobileTab, setMobileTab] = useState<"chat" | "code">("chat");

  // Load scenario — check presets first, then Firestore for custom
  useEffect(() => {
    async function load() {
      setScenarioLoading(true);
      const preset = getScenarioById(scenarioId);
      if (preset) {
        setScenario(preset);
        setCode(preset.starterCode ?? "");
        setScenarioLoading(false);
        return;
      }
      // Try Firestore (custom scenario)
      try {
        const snap = await getDoc(doc(db, "scenarios", scenarioId));
        if (snap.exists()) {
          const s = { id: snap.id, ...snap.data() } as Scenario;
          setScenario(s);
          setCode(s.starterCode ?? "");
        } else {
          router.replace("/dashboard");
        }
      } catch {
        router.replace("/dashboard");
      } finally {
        setScenarioLoading(false);
      }
    }
    load();
  }, [scenarioId, router]);

  // Auth gate
  useEffect(() => {
    if (!authLoading && !user) setAuthModalOpen(true);
  }, [authLoading, user]);

  // Auto-hide code panel for non-code scenarios
  useEffect(() => {
    if (scenario && !scenario.hasCode) setCodeVisible(false);
  }, [scenario]);

  if (authLoading || scenarioLoading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="flex items-center gap-3 text-text-muted">
          <Loader2 size={20} className="animate-spin text-accent" />
          <span className="text-sm">Loading interview...</span>
        </div>
      </div>
    );
  }

  if (!scenario) return null;

  const categoryMeta = CATEGORY_META[scenario.category];
  const difficultyMeta = DIFFICULTY_META[scenario.difficulty];

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col">
      <Navbar />
      <AuthModal
        open={authModalOpen}
        onClose={() => {
          setAuthModalOpen(false);
          if (!user) router.push("/");
        }}
        message="Sign in to start your interview session."
      />

      {/* Sub-header */}
      <div className="border-b border-border-subtle bg-bg-secondary pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          {/* Left — back + title */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => router.back()}
              className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors shrink-0"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-display font-semibold text-sm text-text-primary truncate">
                  {scenario.title}
                </h1>
                <span className={clsx("badge text-xs", categoryMeta.color)}>
                  {categoryMeta.icon} {categoryMeta.label}
                </span>
                <span className={clsx("badge text-xs", difficultyMeta.color)}>
                  {difficultyMeta.label}
                </span>
              </div>
            </div>
          </div>

          {/* Right — desktop panel toggle */}
          <div className="hidden md:flex items-center gap-2">
            {scenario.hasCode && (
              <button
                onClick={() => setCodeVisible((v) => !v)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-bg-hover border border-border-subtle transition-all"
              >
                {codeVisible ? (
                  <>
                    <PanelLeftClose size={13} />
                    Hide editor
                  </>
                ) : (
                  <>
                    <PanelLeftOpen size={13} />
                    Show editor
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile tab switcher */}
      {scenario.hasCode && (
        <div className="md:hidden flex border-b border-border-subtle bg-bg-secondary shrink-0">
          {(["chat", "code"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setMobileTab(tab)}
              className={clsx(
                "flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors border-b-2",
                mobileTab === tab
                  ? "text-accent border-accent"
                  : "text-text-muted border-transparent hover:text-text-secondary",
              )}
            >
              {tab === "chat" ? (
                <>
                  <MessageSquare size={14} />
                  Interview
                </>
              ) : (
                <>
                  <Code2 size={14} />
                  Code Editor
                </>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* ── Desktop layout ── */}
        <div className="hidden md:flex flex-1 min-h-0 gap-0">
          {/* Code editor panel */}
          {scenario.hasCode && codeVisible && (
            <div
              className={clsx(
                "flex flex-col border-r border-border-subtle transition-all duration-300",
                codeVisible ? "w-[55%]" : "w-0 overflow-hidden",
              )}
              style={{ height: "calc(100vh - 7.5rem)" }}
            >
              <CodeEditor scenario={scenario} onChange={setCode} />
            </div>
          )}

          {/* Chat panel */}
          <div
            className={clsx(
              "flex flex-col relative",
              scenario.hasCode && codeVisible
                ? "flex-1"
                : "w-full max-w-2xl mx-auto",
            )}
            style={{ height: "calc(100vh - 7.5rem)" }}
          >
            {user && (
              <ChatInterface
                key={scenario.id}
                scenario={scenario}
                code={code}
              />
            )}
          </div>
        </div>

        {/* ── Mobile layout ── */}
        <div
          className="md:hidden flex-1 flex flex-col min-h-0"
          style={{ height: "calc(100vh - 9rem)" }}
        >
          {mobileTab === "chat"
            ? user && (
                <ChatInterface
                  key={`${scenario.id}-mobile`}
                  scenario={scenario}
                  code={code}
                />
              )
            : scenario.hasCode && (
                <CodeEditor scenario={scenario} onChange={setCode} />
              )}
        </div>
      </div>
    </div>
  );
}
