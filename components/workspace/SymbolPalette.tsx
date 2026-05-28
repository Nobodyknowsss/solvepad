"use client";

import { Button } from "@/components/ui/button";

const SYMBOLS = [
  "1", "2", "3", "4", "5", "6", "7", "8", "9", "0",
  "+", "-", "×", "÷", "=", "x", "y",
];

export function SymbolPalette({
  onInsert,
  disabled,
}: {
  onInsert: (symbol: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-border bg-card px-4 py-2">
      <span className="mr-1 select-none text-xs text-muted-foreground">
        Insert:
      </span>
      {SYMBOLS.map((s) => (
        <Button
          key={s}
          variant="outline"
          size="sm"
          disabled={disabled}
          onClick={() => onInsert(s)}
          className="h-8 w-8 p-0 font-mono text-base"
        >
          {s}
        </Button>
      ))}
    </div>
  );
}