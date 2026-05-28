import nerdamer from "nerdamer";
import "nerdamer/Algebra";
import "nerdamer/Solve";

import type { PreviewStep } from "@/lib/gemini/guards";

export type StepStatus = "ok" | "wrong" | "unknown";

export type Verdict = {
  /** Index into `steps` of the first line that doesn't follow; null = all good. */
  wrongStep: number | null;
  message: string | null;
  /** One status per step in `steps`. After a `wrong`, the rest are `unknown`. */
  stepStatus: StepStatus[];
};

/**
 * Deterministically check a handwritten solution. The LLM never decides
 * correctness — nerdamer does. Each line must be a valid transformation of the
 * line above it (with the original problem as the first line).
 */
export function verifySolution(problem: string, steps: PreviewStep[]): Verdict {
  const seq = [problem, ...steps.map((s) => s.expr)].map(normalizeMathInput);
  const stepStatus: StepStatus[] = new Array(steps.length).fill("unknown");

  for (let k = 0; k < seq.length - 1; k++) {
    // seq[k+1] is steps[k], so a bad pair flags step index k.
    const result = followsFrom(seq[k], seq[k + 1]);
    if (result === false) {
      stepStatus[k] = "wrong";
      // Everything after a wrong step stays "unknown" — we don't verify
      // further because the chain is already broken.
      return {
        wrongStep: k,
        message: "This line doesn't follow from the line above it.",
        stepStatus,
      };
    }
    stepStatus[k] = result === true ? "ok" : "unknown";
  }

  return { wrongStep: null, message: null, stepStatus };
}

/** true = valid step, false = invalid step, null = couldn't determine. */
function followsFrom(prev: string, curr: string): boolean | null {
  const prevIsEq = prev.includes("=");
  const currIsEq = curr.includes("=");
  try {
    if (prevIsEq && currIsEq) return sameSolutionSet(prev, curr);
    if (!prevIsEq && !currIsEq) return expressionsEqual(prev, curr);
    // An equation turning into an expression (or vice versa) is a real mistake.
    return false;
  } catch {
    return null;
  }
}

function expressionsEqual(a: string, b: string): boolean {
  return nerdamer(`(${a})-(${b})`).expand().text().trim() === "0";
}

function sameSolutionSet(a: string, b: string): boolean {
  const A = solveSet(a);
  const B = solveSet(b);
  return A.length === B.length && A.every((v, i) => v === B[i]);
}

function solveSet(equation: string): string[] {
  const raw = nerdamer.solve(equation, "x").toString();
  const inner = raw.replace(/^\[|\]$/g, "").trim();
  return inner === ""
    ? []
    : inner
        .split(",")
        .map((s) => s.trim())
        .sort();
}

const SUPERSCRIPTS: Record<string, string> = {
  "⁰": "0", "¹": "1", "²": "2", "³": "3", "⁴": "4",
  "⁵": "5", "⁶": "6", "⁷": "7", "⁸": "8", "⁹": "9",
};

/** Convert human/problem math into nerdamer-parseable syntax. */
export function normalizeMathInput(s: string): string {
  // Case-fold variables: 'X' and 'x' should be the same variable for a student
  // learning algebra. Sloppy handwriting / OCR shouldn't be flagged as wrong.
  // Safe for our topics — `sqrt(` is already lowercase, and Unicode digits are
  // unaffected by toLowerCase.
  let out = s.toLowerCase();
  // Unicode superscripts → ^digits (x² → x^2)
  out = out.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, (m) =>
    "^" + [...m].map((c) => SUPERSCRIPTS[c]).join(""),
  );
  // Unicode operators
  out = out.replace(/×/g, "*").replace(/÷/g, "/").replace(/−/g, "-");
  // Implicit multiplication: 3x → 3*x, 4( → 4*(, )( → )*(, )x → )*x
  out = out.replace(/(\d)\s*([a-zA-Z(])/g, "$1*$2");
  out = out.replace(/(\))\s*([a-zA-Z0-9(])/g, "$1*$2");
  return out;
}
