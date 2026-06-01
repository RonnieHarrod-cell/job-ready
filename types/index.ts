export type ScenarioCategory = "frontend" | "backend" | "designer" | "custom";

export interface Scenario {
    id: string;
    title: string;
    description: string;
    category: ScenarioCategory;
    difficulty: "junior" | "mid" | "senior";
    hasCode: boolean;
    language?: string;
    starterCode?: string;
    systemPrompt: string;
    tags: string[];
    createdBy?: string; // uid - only present on custom scenarios
    createdAt?: number;
    isPublic?: boolean;
}

export interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: number;
    codeSnapshot?: string; // code editor state at time of message
}

export interface InterviewSession {
    id: string;
    scenarioId: string;
    userId: string;
    messages: Message[];
    startedAt: number;
    endedAt?: number;
    feedback?: string;
    score?: number;
}

export interface UserProfile {
    uid: string;
    email: string;
    displayName: string;
    photoURL?: string;
    createdAt: number;
    sessionsCompleted: number;
    customScenarios: string[]; // scenario ids
}
