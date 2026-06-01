import { streamInterview } from "@/lib/groq";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { messages, systemPrompt } = await req.json();

    if (!messages || !systemPrompt) {
      return new Response("Missing messages or systemPrompt", { status: 400 });
    }

    const stream = await streamInterview(messages, systemPrompt);

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
        "Cache-Control": "no-cache",
      },
    });
  } catch (err) {
    console.error("Interview API error:", err);
    return new Response("Internal server error", { status: 500 });
  }
}
