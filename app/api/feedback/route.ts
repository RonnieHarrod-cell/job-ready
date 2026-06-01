import { generateFeedback } from "@/lib/groq";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { messages, scenarioTitle } = await req.json();

    if (!messages || !scenarioTitle) {
      return Response.json(
        { error: "Missing messages or scenarioTitle" },
        { status: 400 },
      );
    }

    const feedback = await generateFeedback(messages, scenarioTitle);
    return Response.json({ feedback });
  } catch (err) {
    console.error("Feedback API error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
