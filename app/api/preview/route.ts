import { previewCanvas } from "@/lib/gemini/read-canvas";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const image = (body as { image?: unknown })?.image;
  if (typeof image !== "string" || image.length === 0) {
    return Response.json({ error: "Missing image." }, { status: 400 });
  }

  try {
    const result = await previewCanvas(image);
    return Response.json(result);
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
