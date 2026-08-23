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
 * correctness — nerdamer does. Each step is judged against the most recent
 * VERIFIED line (which starts as the problem itself). Scratch lines that
 * contain no variables (e.g. `3*4=12`, `3+4=7`) are tolerated as side-work and
 * marked `unknown` rather than `wrong` — students often jot these down as
 * side arithmetic without them being equivalent transformations of the problem.
 */
export function verifySolution(problem: string, steps: PreviewStep[]): Verdict {
  const seq = [problem, ...steps.map((s) => s.expr)].map(normalizeMathInput);
  const stepStatus: StepStatus[] = new Array(steps.length).fill("unknown");
  let lastOk = seq[0]; // start: the problem is implicitly the baseline

  for (let k = 0; k < steps.length; k++) {
    const stepLine = seq[k + 1];
    const result = followsFrom(lastOk, stepLine);
    if (result === true) {
      stepStatus[k] = "ok";
      lastOk = stepLine;
      continue;
    }
    if (result === null || isScratch(stepLine)) {
      // Couldn't determine OR pure side-work — don't penalize.
      stepStatus[k] = "unknown";
      continue;
    }
    // result === false and the line is non-scratch → genuine mistake.
    stepStatus[k] = "wrong";
    return {
      wrongStep: k,
      message: "This line doesn't follow from the line above it.",
      stepStatus,
    };
  }

  return { wrongStep: null, message: null, stepStatus };
}

/** A scratch line has no variable letters — just constants and operators. */
function isScratch(line: string): boolean {
  return !/[a-zA-Z]/.test(line);
}

/** true = valid step, false = invalid step, null = couldn't determine. */
function followsFrom(prev: string, curr: string): boolean | null {
  const prevIsEq = prev.includes("=");
  const currIsEq = curr.includes("=");
  try {
    if (prevIsEq && currIsEq) return sameSolutionSet(prev, curr);
    if (!prevIsEq && !currIsEq) return expressionsEqual(prev, curr);
    // Expression → equation: treat the equation as an assertion. Valid if
    // BOTH sides are expressions equivalent to `prev`.
    if (!prevIsEq && currIsEq) {
      const eq = splitEquation(curr);
      if (!eq) return false;
      return expressionsEqual(prev, eq.lhs) && expressionsEqual(prev, eq.rhs);
    }
    // Equation → expression is unusual; conservatively unknown so we don't
    // false-flag scratch arithmetic.
    return null;
  } catch {
    return null;
  }
}

function splitEquation(line: string): { lhs: string; rhs: string } | null {
  const idx = line.indexOf("=");
  if (idx < 0) return null;
  return {
    lhs: line.slice(0, idx).trim(),
    rhs: line.slice(idx + 1).trim(),
  };
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
