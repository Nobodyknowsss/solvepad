import { GoogleGenAI } from "@google/genai";

// Server-only. GEMINI_API_KEY must never be imported into a "use client" file
// or logged. The single AI provider for the whole app.
export const genai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const MAX_TRANSIENT_RETRIES = 2;

export async function generateContentWithRetry<T>(
  generate: () => Promise<T>,
): Promise<T> {
  for (let attempt = 0; ; attempt += 1) {
    try {
      return await generate();
    } catch (err) {
      if (!isTransientError(err) || attempt >= MAX_TRANSIENT_RETRIES) {
        throw err;
      }
      await new Promise((resolve) => setTimeout(resolve, 500 * 2 ** attempt));
    }
  }
}

function isTransientError(err: unknown): boolean {
  const details = err as { status?: unknown; message?: unknown };
  const status = Number(details?.status);
  const message = String(details?.message ?? err);
  return (
    status === 503 ||
    message.includes("503") ||
    message.includes("UNAVAILABLE")
  );
}
