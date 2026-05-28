"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Phase = "type" | "pauseEnd" | "delete" | "pauseStart";

export function TypingLoop({
  text,
  typeSpeed = 90,
  deleteSpeed = 45,
  pauseAfter = 1600,
  pauseBetween = 500,
  className,
}: {
  text: string;
  typeSpeed?: number;
  deleteSpeed?: number;
  pauseAfter?: number;
  pauseBetween?: number;
  className?: string;
}) {
  const [shown, setShown] = useState("");
  const [phase, setPhase] = useState<Phase>("type");

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (phase === "type") {
      if (shown.length < text.length) {
        timer = setTimeout(
          () => setShown(text.slice(0, shown.length + 1)),
          typeSpeed,
        );
      } else {
        setPhase("pauseEnd");
      }
    } else if (phase === "pauseEnd") {
      timer = setTimeout(() => setPhase("delete"), pauseAfter);
    } else if (phase === "delete") {
      if (shown.length > 0) {
        timer = setTimeout(
          () => setShown(text.slice(0, shown.length - 1)),
          deleteSpeed,
        );
      } else {
        setPhase("pauseStart");
      }
    } else {
      timer = setTimeout(() => setPhase("type"), pauseBetween);
    }
    return () => clearTimeout(timer);
  }, [phase, shown, text, typeSpeed, deleteSpeed, pauseAfter, pauseBetween]);

  return (
    <span
      className={cn("inline-flex items-baseline", className)}
      aria-label={text}
    >
      <span aria-hidden="true">{shown}</span>
      <span
        aria-hidden="true"
        className="ml-0.5 inline-block w-[1px] animate-pulse self-stretch bg-current"
      />
    </span>
  );
}
