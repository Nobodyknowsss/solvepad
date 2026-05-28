import { z } from "zod";
import { previewCanvas } from "@/lib/gemini/read-canvas";
import { explainError } from "@/lib/gemini/explain-error";
import { verifySolution } from "@/lib/algebra/verify";

const BodySchema = z.object({
  image: z.string().min(1, "Missing image."),
  problem: z.string().optional(),
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
  const { image, problem } = parsed.data;

  try {
    const result = await previewCanvas(image);
    const steps = result.steps.map((s) => s.latex);

    let wrongStep: number | null = null;
    let message: string | null = null;
    let explanation: string | null = null;
    let stepStatus: ("ok" | "wrong" | "unknown")[] = [];

    if (
      typeof problem === "string" &&
      problem.trim() !== "" &&
      result.steps.length > 0
    ) {
      try {
        const verdict = verifySolution(problem, result.steps);
        wrongStep = verdict.wrongStep;
        message = verdict.message;
        stepStatus = verdict.stepStatus;
      } catch (verifyErr) {
        // Verification failing must not block showing the transcription.
        console.error("verify failed:", verifyErr);
      }

      if (wrongStep !== null) {
        const previousLine =
          wrongStep === 0 ? problem : result.steps[wrongStep - 1].latex;
        const wrongLine = result.steps[wrongStep].latex;
        try {
          explanation = await explainError({
            problem,
            previousLine,
            wrongLine,
          });
        } catch (explainErr) {
          // Explanation failing must not block the verdict.
          console.error("explain failed:", explainErr);
        }
      }
    }

    return Response.json({ steps, wrongStep, message, explanation, stepStatus });
  } catch (err) {
    console.error("preview failed:", err);
    if (isRateLimit(err)) {
      return Response.json(
        { error: "Too many requests right now — try again in a moment." },
        { status: 429 },
      );
    }
    return Response.json(
      { error: "Could not read your handwriting. Please try again." },
      { status: 502 },
    );
  }
}

function isRateLimit(err: unknown): boolean {
  const s = String((err as { message?: unknown })?.message ?? err);
  return s.includes("429") || s.includes("RESOURCE_EXHAUSTED");
}