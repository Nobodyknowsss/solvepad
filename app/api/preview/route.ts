import { previewCanvas } from "@/lib/gemini/read-canvas";
import { verifySolution } from "@/lib/algebra/verify";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const image = (body as { image?: unknown })?.image;
  const problem = (body as { problem?: unknown })?.problem;
  if (typeof image !== "string" || image.length === 0) {
    return Response.json({ error: "Missing image." }, { status: 400 });
  }

  try {
    const result = await previewCanvas(image);
    const steps = result.steps.map((s) => s.latex);

    let wrongStep: number | null = null;
    let message: string | null = null;
    if (
      typeof problem === "string" &&
      problem.trim() !== "" &&
      result.steps.length > 0
    ) {
      try {
        const verdict = verifySolution(problem, result.steps);
        wrongStep = verdict.wrongStep;
        message = verdict.message;
      } catch (verifyErr) {
        // Verification failing must not block showing the transcription.
        console.error("verify failed:", verifyErr);
      }
    }

    return Response.json({ steps, wrongStep, message });
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
