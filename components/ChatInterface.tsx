"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type KeyboardEvent,
} from "react";
import { useAuth } from "@/contexts/AuthContext";
import { saveSession } from "@/lib/firebase";
import {
  Send,
  Loader2,
  StopCircle,
  RotateCcw,
  CheckCircle2,
  ChevronDown,
  Bot,
  User,
} from "lucide-react";
import type { Message, Scenario } from "@/types";
import clsx from "clsx";

interface ChatInterfaceProps {
  scenario: Scenario;
  code?: string; // current code editor value, injected into context
}

interface UIMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export default function ChatInterface({ scenario, code }: ChatInterfaceProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<UIMessage[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [sessionEnded, setSessionEnded] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom
  function scrollToBottom(smooth = true) {
    bottomRef.current?.scrollIntoView({ behavior: smooth ? "smooth" : "auto" });
  }

  // Show scroll-to-bottom button when not at bottom
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    function onScroll() {
      if (!el) return;
      setShowScrollBtn(el.scrollHeight - el.scrollTop - el.clientHeight > 100);
    }
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll on new messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 160) + "px";
    }
  }, [input]);

  // Kick off the interview with an opening message from the AI
  useEffect(() => {
    sendMessage(null); // null = no user input, just get opening message
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function sendMessage(userText: string | null) {
    if (streaming || sessionEnded) return;
    if (userText !== null && !userText.trim()) return;

    const newMessages: UIMessage[] = [...messages];

    if (userText) {
      const userMsg: UIMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: userText,
        timestamp: Date.now(),
      };
      newMessages.push(userMsg);
      setMessages(newMessages);
      setInput("");
    }

    // Build payload for the API
    const apiMessages = newMessages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    // Inject current code context if available
    let codeContext = "";
    if (code && scenario.hasCode) {
      codeContext = `\n\n[Candidate's current code]\n\`\`\`${scenario.language ?? ""}\n${code}\n\`\`\``;
    }

    setStreaming(true);
    abortRef.current = new AbortController();

    // Placeholder assistant message
    const assistantId = crypto.randomUUID();
    setMessages((prev) => [
      ...prev,
      {
        id: assistantId,
        role: "assistant",
        content: "",
        timestamp: Date.now(),
      },
    ]);

    try {
      const res = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: abortRef.current.signal,
        body: JSON.stringify({
          messages: apiMessages,
          systemPrompt: scenario.systemPrompt + codeContext,
        }),
      });

      if (!res.ok) throw new Error("Stream failed");

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          accumulated += decoder.decode(value, { stream: true });
          const current = accumulated;
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, content: current } : m,
            ),
          );
        }
      }
    } catch (err: any) {
      if (err.name !== "AbortError") {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, content: "Something went wrong. Please try again." }
              : m,
          ),
        );
      }
    } finally {
      setStreaming(false);
    }
  }

  function stopStreaming() {
    abortRef.current?.abort();
    setStreaming(false);
  }

  async function endSession() {
    if (!user || messages.length === 0) return;
    setSessionEnded(true);
    setFeedbackLoading(true);

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: messages.map((m) => ({ role: m.role, content: m.content })),
          scenarioTitle: scenario.title,
        }),
      });
      const data = await res.json();
      setFeedback(data.feedback);
    } catch {
      setFeedback("Unable to generate feedback at this time.");
    } finally {
      setFeedbackLoading(false);
    }

    try {
      const id = await saveSession({
        scenarioId: scenario.id,
        userId: user.uid,
        messages: messages.map((m) => ({ ...m, codeSnapshot: code })),
        startedAt: messages[0]?.timestamp ?? Date.now(),
        feedback: feedback ?? "",
      });
      setSessionId(id);
    } catch (err) {
      console.error("Failed to save session:", err);
    }
  }

  function resetSession() {
    setMessages([]);
    setInput("");
    setSessionEnded(false);
    setFeedback(null);
    setSessionId(null);
    setFeedbackLoading(false);
    sendMessage(null);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-4 relative"
      >
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="flex items-center gap-2 text-text-muted text-sm">
              <Loader2 size={14} className="animate-spin" />
              Starting interview...
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={clsx(
              "flex gap-3 animate-fade-in",
              msg.role === "user" ? "justify-end" : "justify-start",
            )}
          >
            {/* AI avatar */}
            {msg.role === "assistant" && (
              <div className="w-7 h-7 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Bot size={13} className="text-accent" />
              </div>
            )}

            <div
              className={clsx(
                "max-w-[85%] text-sm leading-relaxed",
                msg.role === "user" ? "chat-bubble-user" : "chat-bubble-ai",
              )}
            >
              {msg.content === "" && msg.role === "assistant" ? (
                <span className="inline-flex items-center gap-1 text-text-muted">
                  <Loader2 size={12} className="animate-spin" />
                  Thinking...
                </span>
              ) : (
                <p className="whitespace-pre-wrap">{msg.content}</p>
              )}
            </div>

            {/* User avatar */}
            {msg.role === "user" && (
              <div className="w-7 h-7 rounded-full bg-bg-hover border border-border-default flex items-center justify-center flex-shrink-0 mt-0.5">
                <User size={13} className="text-text-secondary" />
              </div>
            )}
          </div>
        ))}

        {/* Feedback panel */}
        {sessionEnded && (
          <div className="glass-card p-5 mt-4 animate-slide-up border-accent/20">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 size={16} className="text-status-success" />
              <h3 className="font-display font-semibold text-text-primary text-sm">
                Session Complete
              </h3>
            </div>
            {feedbackLoading ? (
              <div className="flex items-center gap-2 text-text-muted text-sm">
                <Loader2 size={14} className="animate-spin" />
                Generating your feedback...
              </div>
            ) : (
              <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
                {feedback}
              </p>
            )}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Scroll to bottom button */}
      {showScrollBtn && (
        <button
          onClick={() => scrollToBottom()}
          className="absolute bottom-24 right-6 p-2 rounded-full bg-bg-card border border-border-default shadow-lg text-text-muted hover:text-text-primary transition-all animate-fade-in"
        >
          <ChevronDown size={16} />
        </button>
      )}

      {/* Input area */}
      <div className="border-t border-border-subtle p-4 space-y-3">
        {!sessionEnded ? (
          <>
            <div className="flex gap-2 items-end">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your answer… (Enter to send, Shift+Enter for newline)"
                disabled={streaming || sessionEnded}
                rows={1}
                className="textarea-dark flex-1 min-h-[44px] max-h-[160px]"
              />
              {streaming ? (
                <button
                  onClick={stopStreaming}
                  className="p-3 rounded-lg bg-status-error/15 text-status-error border border-status-error/25 hover:bg-status-error/25 transition-colors flex-shrink-0"
                  title="Stop"
                >
                  <StopCircle size={18} />
                </button>
              ) : (
                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || sessionEnded}
                  className="p-3 rounded-lg bg-accent text-white hover:bg-accent-hover active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
                  title="Send"
                >
                  <Send size={18} />
                </button>
              )}
            </div>

            {/* End session */}
            <div className="flex justify-end">
              <button
                onClick={endSession}
                disabled={messages.length < 2 || streaming}
                className="text-xs text-text-muted hover:text-status-warning transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                End session & get feedback →
              </button>
            </div>
          </>
        ) : (
          <button
            onClick={resetSession}
            className="w-full flex items-center justify-center gap-2 btn-ghost"
          >
            <RotateCcw size={15} />
            Start new session
          </button>
        )}
      </div>
    </div>
  );
}
