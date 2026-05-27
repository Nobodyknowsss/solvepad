import { Suspense } from "react";
import { SolveWorkspace } from "@/components/workspace/SolveWorkspace";

export default function SolvePage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
          Loading…
        </div>
      }
    >
      <SolveWorkspace />
    </Suspense>
  );
}
