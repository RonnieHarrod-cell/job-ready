export interface ChangelogEntry {
  version: string;
  date: string;
  title: string;
  items: {
    type: "new" | "improved" | "fixed";
    text: string;
  }[];
}

// Add new entries at the TOP of this array.
// The modal shows whenever the latest version doesn't match
// what's stored in the user's localStorage.
export const CHANGELOG: ChangelogEntry[] = [
  {
    version: "1.4.0",
    date: "7th June 2026",
    title: "CV Powered Interviews",
    items: [
      {
        type: "new",
        text: "Upload your CV on your profile page",
      },
      {
        type: "new",
        text: "Our AI tailors interview questions to your background and experience",
      },
      {
        type: "new",
        text: "CV loaded indicator shown during interviews",
      },
      {
        type: "improved",
        text: "Profile page now shows a preview of your extracted CV text",
      },
    ],
  },
  {
    version: "1.3.0",
    date: "June 2026",
    title: "Leveling System",
    items: [
      {
        type: "new",
        text: "Anime-style rank system — earn XP and climb from E to SSS",
      },
      {
        type: "new",
        text: "XP toast notification after every completed session",
      },
      {
        type: "new",
        text: "Profile page with rank ladder, XP progress bar and session history",
      },
      {
        type: "new",
        text: "Daily first-session bonus and high score XP rewards",
      },
      { type: "improved", text: "Profile link added to navbar and dropdown" },
    ],
  },
  {
    version: "1.2.0",
    date: "June 2026",
    title: "Bug Reports & Issues",
    items: [
      {
        type: "new",
        text: "Bug report button in the navbar — report issues directly from any page",
      },
      {
        type: "new",
        text: "Developer-only /issues page to manage and resolve bug reports",
      },
      {
        type: "new",
        text: "Status management for bugs: open, in progress, resolved",
      },
    ],
  },
  {
    version: "1.1.0",
    date: "June 2026",
    title: "Public Scenario Library",
    items: [
      {
        type: "new",
        text: "Library tab on the dashboard — browse community-shared scenarios",
      },
      {
        type: "new",
        text: "Toggle any custom scenario public to share it with everyone",
      },
      {
        type: "improved",
        text: "Dashboard tab bar is now fully mobile responsive",
      },
    ],
  },
  {
    version: "1.0.0",
    date: "June 2026",
    title: "Initial Launch",
    items: [
      {
        type: "new",
        text: "9 preset interview scenarios across frontend, backend and design",
      },
      { type: "new", text: "Live Monaco code editor for developer interviews" },
      { type: "new", text: "Streaming AI interviewer powered by Groq" },
      {
        type: "new",
        text: "End-of-session feedback with score and improvement tips",
      },
      {
        type: "new",
        text: "Custom scenario builder with public/private toggle",
      },
      { type: "new", text: "Google sign-in with Firebase Auth" },
    ],
  },
];

export const LATEST_VERSION = CHANGELOG[0].version;
export const CHANGELOG_STORAGE_KEY = "jr_seen_version";
