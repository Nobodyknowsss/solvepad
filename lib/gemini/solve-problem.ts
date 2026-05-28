import { genai } from "./client";
import { SOLVE_SYSTEM_PROMPT } from "./prompts";
import { SolutionResultSchema, type SolutionResult } from "./guards";

/**
 * Ask Gemini for a full step-by-step solution to an algebra problem.
 * Each step includes a LaTeX line and a short pedagogical explanation of the
 * move that produced it. Server-only.
 */
export async function generateSolution(
  problem: string,
): Promise<SolutionResult> {
  const userPrompt = `Solve this problem step-by-step: ${problem}`;

  const res = await genai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [{ role: "user", parts: [{ text: userPrompt }] }],
    config: {
      systemInstruction: SOLVE_SYSTEM_PROMPT,
      responseMimeType: "application/json",
    },
  });

  const text = res.text;
  if (!text) throw new Error("Gemini returned an empty solution");

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("Gemini solution was not valid JSON");
  }

  const result = SolutionResultSchema.safeParse(parsed);
  if (!result.success) {
    throw new Error(
      `Gemini solution had an unexpected shape: ${result.error.message}`,
    );
  }
  return result.data;
}
