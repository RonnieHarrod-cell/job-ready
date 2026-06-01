import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const GROQ_MODEL = "llama-3.1-8b-instant";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

// streaming chat (used in interview route)
export async function streamInterview(
  messages: ChatMessage[],
  systemPrompt: string,
): Promise<ReadableStream<Uint8Array>> {
  const stream = await groq.chat.completions.create({
    model: GROQ_MODEL,
    messages: [{ role: "system", content: systemPrompt }, ...messages],
    max_tokens: 512,
    temperature: 0.7,
    stream: true,
  });

  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content ?? "";
        if (text) controller.enqueue(encoder.encode(text));
      }
      controller.close();
    },
  });
}

export async function generateFeedback(
  transcript: ChatMessage[],
  scenarioTitle: string,
): Promise<string> {
  const completion = await groq.chat.completions.create({
    model: GROQ_MODEL,
    messages: [
      {
        role: "system",
        content: `You are an expert technical interviewer. Analyse the following interview transcript for a "${scenarioTitle}" interview and provide structured feedback. Include: overall score out of 10, key strengths (2-3 bullet points), areas to improve (2-3 bullet points), and a short summary paragraph. Be honest but encouraging.`,
      },
      {
        role: "user",
        content: `Transcript:\n\n${transcript
          .filter((m) => m.role !== "system")
          .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
          .join("\n\n")}`,
      },
    ],
    max_tokens: 600,
    temperature: 0.5,
    stream: false,
  });

  return (
    completion.choices[0]?.message?.content ?? "Unable to generate feedback."
  );
}
