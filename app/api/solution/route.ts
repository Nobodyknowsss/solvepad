import { z } from "zod";
import { generateSolution } from "@/lib/gemini/solve-problem";

const BodySchema = z.object({
  problem: z.string().min(1, "Missing problem."),
});

export async function POST(req: Request) {
  let rawBody: unknown;
  try {
    rawBody = await req.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = BodySchema.safeParse(rawBody);
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request body." },
      { status: 400 },
    );
  }
  const { problem } = parsed.data;

  try {
    const result = await generateSolution(problem);
    return Response.json({
      steps: result.steps.map((s) => s.latex),
      explanations: result.steps.map((s) => s.explanation),
    });
  } catch (err) {
    console.error("solution failed:", err);
    if (isRateLimit(err)) {
      return Response.json(
        { error: "Too many requests right now — try again in a moment." },
        { status: 429 },
      );
    }
    return Response.json(
      { error: "Could not generate a solution. Please try again." },
      { status: 502 },
    );
  }
}

function isRateLimit(err: unknown): boolean {
  const s = String((err as { message?: unknown })?.message ?? err);
  return s.includes("429") || s.includes("RESOURCE_EXHAUSTED");
}