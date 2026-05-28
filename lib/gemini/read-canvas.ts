import { genai } from "./client";
import { READ_SYSTEM_PROMPT, READ_USER_PROMPT } from "./prompts";
import { PreviewResultSchema, type PreviewResult } from "./guards";

/**
 * Send a base64 PNG of the canvas to Gemini and get back the handwritten steps
 * as LaTeX. Read-only transcription — never grades. Server-only.
 */
export async function previewCanvas(pngBase64: string): Promise<PreviewResult> {
  const res = await genai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        role: "user",
        parts: [
          { text: READ_USER_PROMPT },
          { inlineData: { mimeType: "image/png", data: pngBase64 } },
        ],
      },
    ],
    config: {
      systemInstruction: READ_SYSTEM_PROMPT,
      responseMimeType: "application/json",
    },
  });

  const text = res.text;
  if (!text) throw new Error("Gemini returned an empty response");

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("Gemini did not return valid JSON");
  }

  const result = PreviewResultSchema.safeParse(parsed);
  if (!result.success) {
    throw new Error(`Gemini response had an unexpected shape: ${result.error.message}`);
  }
  return result.data;
}
