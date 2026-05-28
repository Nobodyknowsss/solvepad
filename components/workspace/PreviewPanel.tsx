"use client";

import { CheckCircle2, Eye, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import MathRender from "./MathRender";

export function PreviewPanel({
  steps,
  loading,
  error,
  wrongStep,
  message,
  onClose,
}: {
  steps: string[];
  loading: boolean;
  error: string | null;
  wrongStep: number | null;
  message: string | null;
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
        {loading ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
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
              const isWrong = i === wrongStep;
              return (
                <li key={i} className="flex flex-col gap-1.5">
                  <div
                    className={cn(
                      "flex items-center gap-3 rounded-md border px-3 py-2",
                      isWrong
                        ? "border-destructive bg-destructive/10"
                        : "border-border bg-background",
                    )}
                  >
                    <span
                      className={cn(
                        "select-none text-xs font-medium",
                        isWrong ? "text-destructive" : "text-muted-foreground",
                      )}
                    >
                      {i + 1}
                    </span>
                    <div className="min-w-0 overflow-x-auto">
                      <MathRender latex={latex} />
                    </div>
                  </div>
                  {isWrong && message && (
                    <p className="pl-3 text-xs text-destructive">{message}</p>
                  )}
                </li>
              );
            })}
            {wrongStep === null && (
              <li className="flex items-center gap-2 pt-1 text-sm text-muted-foreground">
                <CheckCircle2 className="size-4 text-foreground" />
                No errors found in your steps.
              </li>
            )}
          </ol>
        )}
      </div>
    </aside>
  );
}
