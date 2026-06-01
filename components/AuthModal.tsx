"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { X, Zap } from "lucide-react";
import clsx from "clsx";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  message?: string;
}

export default function AuthModal({
  open,
  onClose,
  message = "Sign in to start practising interviews and save your progress.",
}: AuthModalProps) {
  const { signIn, loading } = useAuth();
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on escape
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Lock body scroll
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  async function handleSignIn() {
    await signIn();
    onClose();
  }

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in" />

      {/* Modal */}
      <div className="relative w-full max-w-md glass-card p-8 animate-slide-up">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors"
        >
          <X size={16} />
        </button>

        {/* Logo mark */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center shadow-accent-md mb-4">
            <Zap size={26} className="text-white" />
          </div>
          <h2 className="font-display text-2xl font-bold text-text-primary mb-2">
            Welcome to JobReady
          </h2>
          <p className="text-sm text-text-secondary leading-relaxed max-w-xs">
            {message}
          </p>
        </div>

        {/* Sign in button */}
        <button
          onClick={handleSignIn}
          disabled={loading}
          className={clsx(
            "w-full flex items-center justify-center gap-3 px-5 py-3 rounded-xl",
            "bg-white text-gray-900 font-semibold text-sm",
            "hover:bg-gray-100 active:scale-95 transition-all duration-200",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "shadow-lg shadow-black/20",
          )}
        >
          {/* Google icon SVG */}
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
              fill="#4285F4"
            />
            <path
              d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
              fill="#34A853"
            />
            <path
              d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z"
              fill="#FBBC05"
            />
            <path
              d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-border-subtle" />
          <span className="text-xs text-text-muted">Free to use</span>
          <div className="flex-1 h-px bg-border-subtle" />
        </div>

        {/* Feature hints */}
        <ul className="space-y-2">
          {[
            "Practice with 9 preset interview scenarios",
            "Interactive code editor for dev roles",
            "AI feedback at the end of every session",
            "Create and save your own custom scenarios",
          ].map((feat) => (
            <li
              key={feat}
              className="flex items-center gap-2.5 text-xs text-text-secondary"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
              {feat}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
