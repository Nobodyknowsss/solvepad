"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { TOPICS, type TopicConfig } from "@/lib/topics";
import { TypingLoop } from "./TypingLoop";

const EXAMPLES = ["5x - 3 = 12", "x² + 6x + 9", "4(x+1) = 2x+10", "x² - 16"];

export function PracticePicker() {
  const router = useRouter();
  const [custom, setCustom] = useState("");

  function startTopic(topic: TopicConfig) {
    const params = new URLSearchParams({ topic: topic.id, problem: topic.example });
    router.push(`/workspace/solve?${params.toString()}`);
  }

  function startCustom() {
    const problem = custom.trim();
    if (!problem) return;
    const params = new URLSearchParams({ problem });
    router.push(`/workspace/solve?${params.toString()}`);
  }

  return (
    <div className="mt-10">
      <TypingLoop
        text="Solve for x:"
        className="block font-mono text-lg font-medium text-foreground md:text-xl"
      />
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {TOPICS.map((topic) => (
          <button
            key={topic.id}
            type="button"
            onClick={() => startTopic(topic)}
            className={cn(
              "group flex cursor-pointer flex-col rounded-xl border border-border bg-card p-5 text-left transition-colors",
              "hover:border-primary/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-semibold tracking-tight">{topic.title}</h3>
              {topic.recommended && (
                <span className="shrink-0 text-xs font-medium text-red-700 dark:text-red-400">
                  Recommended
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{topic.description}</p>
            <div className="mt-4 flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm">
              <span className="text-xs text-muted-foreground">EX</span>
              <span>{topic.example}</span>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
              <span>{topic.meta}</span>
              <ArrowRight className="size-4 opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
          </button>
        ))}
      </div>

      <div className="mt-10">
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Or type your own
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="mt-5 flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center">
          <label htmlFor="custom-problem" className="shrink-0 font-mono text-sm">
            Solve for x:
          </label>
          <Input
            id="custom-problem"
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") startCustom();
            }}
            placeholder="2(x - 4) + 5 = 17"
            className="font-mono"
          />
          <Button
            onClick={startCustom}
            disabled={!custom.trim()}
            className="shrink-0"
          >
            Start solving
            <ArrowRight className="size-4" />
          </Button>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">Examples:</span>
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => setCustom(ex)}
              className="cursor-pointer rounded-md border border-border bg-card px-2.5 py-1 font-mono text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}