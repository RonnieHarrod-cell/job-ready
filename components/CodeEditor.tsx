"use client";

import { useState, useRef } from "react";
import Editor, { type OnMount } from "@monaco-editor/react";
import { Copy, RotateCcw, Check, Code2 } from "lucide-react";
import clsx from "clsx";
import type { Scenario } from "@/types";

interface CodeEditorProps {
  scenario: Scenario;
  onChange?: (value: string) => void;
}

const MONACO_THEME = {
  base: "vs-dark" as const,
  inherit: true,
  rules: [
    { token: "comment", foreground: "5A5972", fontStyle: "italic" },
    { token: "keyword", foreground: "6C63FF" },
    { token: "string", foreground: "10B981" },
    { token: "number", foreground: "F59E0B" },
    { token: "type", foreground: "a78bfa" },
    { token: "function", foreground: "60a5fa" },
  ],
  colors: {
    "editor.background": "#0A0A0F",
    "editor.foreground": "#F0EFF8",
    "editorLineNumber.foreground": "#2A2A3D",
    "editorLineNumber.activeForeground": "#5A5972",
    "editor.lineHighlightBackground": "#16161F",
    "editor.selectionBackground": "#6C63FF30",
    "editor.inactiveSelectionBackground": "#6C63FF15",
    "editorCursor.foreground": "#6C63FF",
    "editorIndentGuide.background": "#1E1E2E",
    "editorIndentGuide.activeBackground": "#2A2A3D",
    "scrollbar.shadow": "#00000000",
    "scrollbarSlider.background": "#2A2A3D80",
    "scrollbarSlider.hoverBackground": "#3A3A5580",
    "scrollbarSlider.activeBackground": "#6C63FF80",
    "editor.findMatchBackground": "#6C63FF40",
    "editorWidget.background": "#111118",
    "editorWidget.border": "#1E1E2E",
    "input.background": "#16161F",
    "input.border": "#2A2A3D",
  },
};

const LANGUAGE_MAP: Record<string, string> = {
  javascript: "javascript",
  typescript: "typescript",
  python: "python",
  html: "html",
  css: "css",
};

export default function CodeEditor({ scenario, onChange }: CodeEditorProps) {
  const [code, setCode] = useState(scenario.starterCode ?? "");
  const [copied, setCopied] = useState(false);
  const editorRef = useRef<any>(null);

  const language =
    LANGUAGE_MAP[scenario.language ?? "javascript"] ?? "javascript";

  const handleMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // Register custom theme
    monaco.editor.defineTheme("job-ready-dark", MONACO_THEME);
    monaco.editor.setTheme("job-ready-dark");

    // Editor options
    editor.updateOptions({
      fontSize: 13,
      fontFamily: "var(--font-geist-mono), 'Menlo', 'Monaco', monospace",
      fontLigatures: true,
      lineHeight: 22,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      renderLineHighlight: "line",
      cursorBlinking: "smooth",
      cursorSmoothCaretAnimation: "on",
      smoothScrolling: true,
      padding: { top: 16, bottom: 16 },
      tabSize: 2,
      wordWrap: "on",
      automaticLayout: true,
      suggestOnTriggerCharacters: true,
      quickSuggestions: true,
      folding: true,
      bracketPairColorization: { enabled: true },
    });
  };

  function handleChange(val: string | undefined) {
    const v = val ?? "";
    setCode(v);
    onChange?.(v);
  }

  async function copyCode() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function resetCode() {
    const starter = scenario.starterCode ?? "";
    setCode(starter);
    onChange?.(starter);
    editorRef.current?.setValue(starter);
  }

  return (
    <div className="flex flex-col h-full bg-bg-primary rounded-xl overflow-hidden border border-border-subtle">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border-subtle bg-bg-secondary shrink-0">
        <div className="flex items-center gap-2.5">
          {/* Traffic lights */}
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
            <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
            <div className="w-3 h-3 rounded-full bg-[#28C840]" />
          </div>
          <div className="w-px h-4 bg-border-subtle" />
          <div className="flex items-center gap-1.5 text-xs text-text-muted">
            <Code2 size={12} />
            <span className="font-mono">{language}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={resetCode}
            title="Reset to starter code"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors"
          >
            <RotateCcw size={12} />
            Reset
          </button>
          <button
            onClick={copyCode}
            title="Copy code"
            className={clsx(
              "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs transition-colors",
              copied
                ? "text-status-success"
                : "text-text-muted hover:text-text-primary hover:bg-bg-hover",
            )}
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 min-h-0">
        <Editor
          height="100%"
          language={language}
          value={code}
          onChange={handleChange}
          onMount={handleMount}
          loading={
            <div className="flex items-center justify-center h-full bg-bg-primary">
              <div className="flex items-center gap-2 text-text-muted text-sm">
                <div className="w-4 h-4 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
                Loading editor...
              </div>
            </div>
          }
          options={{
            theme: "job-ready-dark",
          }}
        />
      </div>
    </div>
  );
}
