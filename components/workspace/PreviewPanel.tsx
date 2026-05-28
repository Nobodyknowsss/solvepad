"use client";

import { CheckCircle2, Eye, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import MathRender from "./MathRender";

const SUPERSCRIPTS: Record<string, string> = {
  "⁰": "0", "¹": "1", "²": "2", "³": "3", "⁴": "4",
  "⁵": "5", "⁶": "6", "⁷": "7", "⁸": "8", "⁹": "9",
};

/** Minimal client-side normalizer so KaTeX can render the problem string. */
function problemToLatex(s: string): string {
  return s.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, (m) =>
    "^{" + [...m].map((c) => SUPERSCRIPTS[c]).join("") + "}",
  );
}

type StepStatus = "ok" | "wrong" | "unknown";

export function PreviewPanel({
  problem,
  steps,
  loading,
  error,
  wrongStep,
  message,
  explanation,
  stepStatus,
  onClose,
}: {
  problem: string;
  steps: string[];
  loading: boolean;
  error: string | null;
  wrongStep: number | null;
  message: string | null;
  explanation: string | null;
  stepStatus: StepStatus[];
  onClose: () => void;
}) {
  return (
    <aside className="flex h-full w-80 shrink-0 flex-col border-l border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Eye className="size-4 text-primary" />
          <p className="text-sm font-medium text-foreground">Preview</p>
        </div>
        <Button variant="ghost" size="icon" className="size-7" onClick={onClose}>
          <X className="size-4" />
        </Button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        {problem && (
          <div className="mb-4 rounded-md border border-border bg-background px-3 py-2">
            <p className="mb-1 select-none text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
              Problem
            </p>
            <div className="min-w-0 overflow-x-auto">
              <MathRender latex={problemToLatex(problem)} />
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
            <Loader2 className="size-5 animate-spin" />
            Reading your handwriting…
          </div>
        ) : error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : steps.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Click “Check my answer” to see your work as clean math.
          </p>
        ) : (
          <ol className="flex flex-col gap-3">
            {steps.map((latex, i) => {
              const status: StepStatus = stepStatus[i] ?? "unknown";
              const isWrong = status === "wrong";
              const isOk = status === "ok";
              return (
                <li key={i} className="flex flex-col gap-1.5">
                  <div
                    className={cn(
                      "flex items-center gap-3 rounded-md border px-3 py-2",
                      isWrong && "border-destructive bg-destructive/10",
                      isOk &&
                        "border-emerald-500/60 bg-emerald-500/10 dark:border-emerald-400/60 dark:bg-emerald-400/10",
                      !isWrong && !isOk && "border-border bg-background",
                    )}
                  >
                    <span
                      className={cn(
                        "select-none text-xs font-medium",
                        isWrong && "text-destructive",
                        isOk &&
                          "text-emerald-600 dark:text-emerald-400",
                        !isWrong && !isOk && "text-muted-foreground",
                      )}
                    >
                      {i + 1}
                    </span>
                    <div className="min-w-0 overflow-x-auto">
                      <MathRender latex={latex} />
                    </div>
                  </div>
                  {isWrong && message && (
                    <p className="pl-3 text-xs font-medium text-destructive">
                      {message}
                    </p>
                  )}
                  {isWrong && explanation && (
                    <p className="pl-3 text-xs leading-relaxed text-muted-foreground">
                      {explanation}
                    </p>
                  )}
                </li>
              );
            })}
            {wrongStep === null && stepStatus.every((s) => s === "ok") && (
              <li className="flex items-center gap-2 pt-1 text-sm text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="size-4" />
                Every step checks out.
              </li>
            )}
          </ol>
        )}
      </div>
    </aside>
  );
}