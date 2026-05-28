import { genai } from "./client";
import { EXPLAIN_SYSTEM_PROMPT } from "./prompts";
import { ExplainResultSchema } from "./guards";

/**
 * Ask Gemini to explain to the student WHY their step doesn't follow from the
 * previous line. nerdamer has already judged the step wrong — Gemini only
 * explains. Returns a short, plain-text tutor note that hints at the fix
 * without revealing the corrected line. Server-only.
 */
export async function explainError(args: {
  problem: string;
  previousLine: string;
  wrongLine: string;
}): Promise<string> {
  const userPrompt =
    `Original problem: ${args.problem}\n` +
    `Previous line (correct): ${args.previousLine}\n` +
    `Student's next line (incorrect): ${args.wrongLine}\n\n` +
    `Explain to the student why their line doesn't follow from the previous line, and hint at the fix. Do not reveal the corrected line or the final answer.`;

  const res = await genai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [{ role: "user", parts: [{ text: userPrompt }] }],
    config: {
      systemInstruction: EXPLAIN_SYSTEM_PROMPT,
      responseMimeType: "application/json",
    },
  });

  const text = res.text;
  if (!text) throw new Error("Gemini returned an empty explanation");

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("Gemini explanation was not valid JSON");
  }

  const result = ExplainResultSchema.safeParse(parsed);
  if (!result.success) {
    throw new Error(`Gemini explanation had an unexpected shape: ${result.error.message}`);
  }
  return result.data.explanation;
}
