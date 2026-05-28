"use client";

import { Eye, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import MathRender from "./MathRender";

export function PreviewPanel({
  steps,
  loading,
  error,
  onClose,
}: {
  steps: string[];
  loading: boolean;
  error: string | null;
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
            {steps.map((latex, i) => (
              <li
                key={i}
                className="flex items-center gap-3 rounded-md border border-border bg-background px-3 py-2"
              >
                <span className="select-none text-xs font-medium text-muted-foreground">
                  {i + 1}
                </span>
                <div className="min-w-0 overflow-x-auto">
                  <MathRender latex={latex} />
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
    </aside>
  );
}
