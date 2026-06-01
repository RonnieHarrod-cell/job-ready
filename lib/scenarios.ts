import type { Scenario } from "@/types";

export const PRESET_SCENARIOS: Scenario[] = [
  // ─── Frontend / Web Dev ───────────────────────────────────────────────────
  {
    id: "frontend-react-junior",
    title: "React Developer",
    description:
      "Build and explain React components. Covers hooks, state management, and component design.",
    category: "frontend",
    difficulty: "junior",
    hasCode: true,
    language: "javascript",
    tags: ["React", "Hooks", "JSX", "State"],
    systemPrompt: `You are a senior frontend engineer conducting a React developer interview. 
Your role is to ask clear, practical questions about React concepts one at a time.
Start by introducing yourself briefly and asking a warm-up question about their React experience.
When the candidate writes code, review it and give constructive feedback before moving on.
Focus on: hooks (useState, useEffect, useCallback), component design, props, lifting state, and basic performance.
Keep responses concise — under 120 words unless reviewing code. Be encouraging but honest.
After 6-8 exchanges, offer to wrap up and summarise their performance.`,
    starterCode: `// React Interview Sandbox
// The interviewer will ask you to write components here.
// You can use modern React with hooks.

import React, { useState, useEffect } from 'react';

function App() {
  // Start coding here...
  
  return (
    <div>
      <h1>Hello, Interview!</h1>
    </div>
  );
}

export default App;`,
  },
  {
    id: "frontend-react-senior",
    title: "Senior React Engineer",
    description:
      "Advanced React patterns, performance optimisation, and architecture decisions.",
    category: "frontend",
    difficulty: "senior",
    hasCode: true,
    language: "javascript",
    tags: ["React", "Performance", "Architecture", "Patterns"],
    systemPrompt: `You are a staff engineer interviewing a senior React candidate.
Ask challenging questions about advanced patterns: render optimisation, custom hooks, context vs state management libraries, code splitting, and testing strategy.
Expect the candidate to justify architectural decisions, not just write code.
Challenge vague answers with follow-up questions. Be direct and technical.
When they write code, look for clean abstractions, edge case handling, and performance awareness.
Keep responses under 150 words. After 8-10 exchanges offer to wrap up with feedback.`,
    starterCode: `// Senior React Engineer — Architecture Challenge
// Write production-quality code with proper abstractions.

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';

// The interviewer may ask you to implement:
// - Custom hooks
// - Performance optimisations  
// - Complex state machines
// - Context providers

function App() {
  return <div>Ready for the challenge.</div>;
}

export default App;`,
  },
  {
    id: "frontend-css-junior",
    title: "Frontend UI Developer",
    description:
      "CSS, layout, responsive design, and browser fundamentals for junior roles.",
    category: "frontend",
    difficulty: "junior",
    hasCode: true,
    language: "html",
    tags: ["CSS", "HTML", "Flexbox", "Grid", "Responsive"],
    systemPrompt: `You are a senior frontend developer interviewing a junior UI developer.
Focus on HTML semantics, CSS layout (flexbox, grid), responsive design, and accessibility basics.
Ask them to style components or fix layout problems in the code editor.
Be patient and guide them if they get stuck — this is a junior role.
Keep responses under 100 words. After 6-8 exchanges wrap up with encouragement and feedback.`,
    starterCode: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>UI Challenge</title>
  <style>
    /* Write your CSS here */
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: sans-serif; padding: 2rem; }
  </style>
</head>
<body>
  <!-- Write your HTML here -->
  <h1>UI Interview Sandbox</h1>
</body>
</html>`,
  },

  // ─── Backend Dev ──────────────────────────────────────────────────────────
  {
    id: "backend-node-junior",
    title: "Node.js Developer",
    description:
      "REST APIs, async patterns, middleware, and basic database queries.",
    category: "backend",
    difficulty: "junior",
    hasCode: true,
    language: "javascript",
    tags: ["Node.js", "Express", "REST", "Async", "APIs"],
    systemPrompt: `You are a backend engineering lead interviewing a junior Node.js developer.
Ask about REST API design, async/await, error handling, and Express middleware.
Have them write endpoint handlers or utility functions in the code editor.
Focus on: async patterns, proper error handling, HTTP status codes, and basic security awareness.
Keep responses under 120 words. Be practical — ask real-world scenarios, not trivia.
After 6-8 exchanges, wrap up with feedback on their backend thinking.`,
    starterCode: `// Node.js / Express Interview Sandbox
const express = require('express');
const app = express();
app.use(express.json());

// The interviewer will ask you to implement routes and middleware.
// Example structure:

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Write your solutions below:


app.listen(3000, () => console.log('Server running on port 3000'));`,
  },
  {
    id: "backend-node-senior",
    title: "Senior Backend Engineer",
    description:
      "System design, scalability, database optimisation, and production architecture.",
    category: "backend",
    difficulty: "senior",
    hasCode: true,
    language: "javascript",
    tags: ["System Design", "Scalability", "Databases", "Architecture"],
    systemPrompt: `You are a principal engineer interviewing a senior backend candidate.
Ask about system design, database optimisation (indexing, query planning), caching strategies, message queues, and microservices trade-offs.
Expect strong opinions backed by reasoning. Challenge them on scaling decisions.
When they write code, look for production readiness: error handling, logging, idempotency.
Keep responses under 150 words. Be rigorous — this is a senior role.
After 8-10 exchanges offer to wrap up with detailed technical feedback.`,
    starterCode: `// Senior Backend Engineer — System Design + Code
// Focus on production-quality, scalable solutions.

// The interviewer may ask you to implement:
// - Rate limiting middleware
// - Database connection pooling
// - Caching layers
// - Queue consumers
// - Auth middleware

const express = require('express');
const app = express();
app.use(express.json());

// Your production-grade implementation:


module.exports = app;`,
  },
  {
    id: "backend-python-junior",
    title: "Python Developer",
    description:
      "Python fundamentals, data structures, and scripting for backend roles.",
    category: "backend",
    difficulty: "junior",
    hasCode: true,
    language: "python",
    tags: ["Python", "Data Structures", "OOP", "APIs"],
    systemPrompt: `You are a backend engineer interviewing a junior Python developer.
Ask about Python fundamentals: list comprehensions, decorators basics, OOP, and working with APIs using requests.
Have them write Python functions or classes in the editor.
Focus on clean, readable Python — not clever one-liners. Check for proper error handling.
Keep responses under 120 words. Be encouraging for junior-level mistakes.
After 6-8 exchanges wrap up with honest but kind feedback.`,
    starterCode: `# Python Interview Sandbox
# The interviewer will ask you to write functions and classes here.

# Example: write a function to process a list of users
def process_users(users: list[dict]) -> list[dict]:
    """
    Takes a list of user dicts and returns processed results.
    """
    pass


# Write your solutions below:
`,
  },

  // ─── Designer ─────────────────────────────────────────────────────────────
  {
    id: "designer-ux-junior",
    title: "UX Designer",
    description:
      "User research, wireframing process, usability principles, and design thinking.",
    category: "designer",
    difficulty: "junior",
    hasCode: false,
    tags: ["UX", "Research", "Wireframing", "Usability", "Design Thinking"],
    systemPrompt: `You are a design lead interviewing a junior UX designer.
Ask about their design process, how they conduct user research, how they handle feedback, and how they balance user needs with business goals.
Present realistic scenarios: "Our checkout drop-off rate is 40%, how would you approach this?"
Do NOT ask them to write code — this is a conversation-only interview.
Ask follow-up questions to dig deeper. Look for structured thinking and empathy.
Keep responses under 120 words. After 6-8 exchanges, wrap up with feedback on their UX thinking.`,
    starterCode: undefined,
  },
  {
    id: "designer-ux-senior",
    title: "Senior UX / Product Designer",
    description:
      "Design strategy, cross-functional collaboration, and leading design systems.",
    category: "designer",
    difficulty: "senior",
    hasCode: false,
    tags: ["Product Design", "Design Systems", "Strategy", "Leadership"],
    systemPrompt: `You are a VP of Design interviewing a senior product designer.
Ask about design leadership, how they build and maintain design systems, how they influence product roadmap decisions, and how they mentor junior designers.
Present ambiguous, strategic scenarios that require trade-off thinking.
Challenge their reasoning. Look for strong opinions grounded in user data and business context.
Keep responses under 150 words. Be direct — this is a leadership role.
After 8-10 exchanges wrap up with strategic-level feedback.`,
    starterCode: undefined,
  },
  {
    id: "designer-ui-junior",
    title: "UI / Visual Designer",
    description:
      "Visual design principles, typography, colour theory, and component design.",
    category: "designer",
    difficulty: "junior",
    hasCode: false,
    tags: ["UI Design", "Typography", "Colour", "Components", "Figma"],
    systemPrompt: `You are a senior UI designer interviewing a junior visual designer.
Ask about their visual design process, typography choices, colour theory, accessibility (contrast ratios), and their experience with design tools like Figma.
Present practical scenarios: "How would you design a dark mode for this app?" or "How do you choose a type scale?"
Keep responses under 100 words. Be encouraging and visual-thinking focused.
After 6-8 exchanges wrap up with constructive feedback on their visual sensibility.`,
    starterCode: undefined,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getScenarioById(id: string): Scenario | undefined {
  return PRESET_SCENARIOS.find((s) => s.id === id);
}

export function getScenariosByCategory(
  category: Scenario["category"],
): Scenario[] {
  return PRESET_SCENARIOS.filter((s) => s.category === category);
}

export const CATEGORY_META: Record<
  Scenario["category"],
  { label: string; color: string; icon: string; description: string }
> = {
  frontend: {
    label: "Frontend",
    color: "text-violet-400 bg-violet-400/10 border-violet-400/20",
    icon: "🖥️",
    description: "React, CSS, HTML, browser APIs",
  },
  backend: {
    label: "Backend",
    color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    icon: "⚙️",
    description: "Node.js, Python, databases, APIs",
  },
  designer: {
    label: "Designer",
    color: "text-pink-400 bg-pink-400/10 border-pink-400/20",
    icon: "🎨",
    description: "UX, UI, product design",
  },
  custom: {
    label: "Custom",
    color: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    icon: "✨",
    description: "Your own scenarios",
  },
};

export const DIFFICULTY_META: Record<
  Scenario["difficulty"],
  { label: string; color: string }
> = {
  junior: {
    label: "Junior",
    color: "text-sky-400 bg-sky-400/10 border-sky-400/20",
  },
  mid: {
    label: "Mid-level",
    color: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  },
  senior: {
    label: "Senior",
    color: "text-rose-400 bg-rose-400/10 border-rose-400/20",
  },
};
