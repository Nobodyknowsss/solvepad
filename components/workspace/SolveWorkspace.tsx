"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import Link from "next/link";
import { ArrowLeft, Check, Eraser } from "lucide-react";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { PreviewPanel } from "./PreviewPanel";
import { SymbolPalette } from "./SymbolPalette";

const DrawingCanvas = dynamic(() => import("./DrawingCanvas"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
      Loading canvas…
    </div>
  ),
});

const TOPIC_LABELS: Record<string, string> = {
  LINEAR_EQUATIONS: "Linear equations",
  FACTORING: "Factoring",
};

export function SolveWorkspace() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { resolvedTheme } = useTheme();

  const problem = searchParams.get("problem") ?? "";
  const topic = searchParams.get("topic") ?? "";
  const topicLabel = TOPIC_LABELS[topic] ?? "Your problem";

  const [api, setApi] = useState<ExcalidrawImperativeAPI | null>(null);
  const [checking, setChecking] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [previewSteps, setPreviewSteps] = useState<string[]>([]);

  const insertCount = useRef(0);

  function clearCanvas() {
    api?.updateScene({ elements: [] });
    setNotice(null);
  }

  async function insertSymbol(symbol: string) {
    if (!api) return;
    const { convertToExcalidrawElements, CaptureUpdateAction } = await import(
      "@excalidraw/excalidraw"
    );
    const appState = api.getAppState();
    const zoom = appState.zoom?.value ?? 1;
    // Drop the symbol at the centre of the visible canvas, cascading a little so
    // repeated inserts don't stack exactly on top of each other.
    const cascade = (insertCount.current = (insertCount.current + 1) % 8) * 14;
    const sceneX = appState.width / 2 / zoom - appState.scrollX + cascade;
    const sceneY = appState.height / 2 / zoom - appState.scrollY + cascade;
    const els = convertToExcalidrawElements([
      { type: "text", x: sceneX, y: sceneY, text: symbol, fontSize: 28 },
    ]);
    api.updateScene({
      elements: [...api.getSceneElements(), ...els],
      appState: { selectedElementIds: { [els[0].id]: true } },
      captureUpdate: CaptureUpdateAction.IMMEDIATELY,
    });
  }

  async function handleCheck() {
    setChecking(true);
    setNotice(null);
    try {
      const supabase = createClient();
      const { data } = await supabase.auth.getClaims();
      if (!data?.claims) {
        const next = `${pathname}?${searchParams.toString()}`;
        router.push(`/auth/sign-up?next=${encodeURIComponent(next)}`);
        return;
      }
      // Signed in → preview (read) the canvas first, then (later) verify.
      setPreviewOpen(true);
      setPreviewError(null);
      setPreviewLoading(true);
      // TEMP mock — replaced with canvas export + POST /api/preview in the backend step.
      await new Promise((r) => setTimeout(r, 800));
      setPreviewSteps(["2x + 3 = 7", "2x = 4", "x = 2"]);
      setPreviewLoading(false);
      setNotice("Here's what we read. Step-by-step verification is coming soon.");
    } finally {
      setChecking(false);
    }
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border px-6 py-3">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            {topicLabel}
          </p>
          <p className="truncate font-mono text-base text-foreground md:text-lg">
            {problem || "No problem selected"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/workspace">
              <ArrowLeft className="size-4" />
              New problem
            </Link>
          </Button>
          <Button variant="outline" size="sm" onClick={clearCanvas}>
            <Eraser className="size-4" />
            Clear
          </Button>
          <Button size="sm" onClick={handleCheck} disabled={checking}>
            <Check className="size-4" />
            Check my answer
          </Button>
        </div>
      </div>

      {notice && (
        <div className="border-b border-border bg-muted/50 px-6 py-2 text-sm text-muted-foreground">
          {notice}
        </div>
      )}

      <div className="flex min-h-0 flex-1">
        <div className="flex min-w-0 flex-1 flex-col">
          <SymbolPalette onInsert={insertSymbol} disabled={!api} />
          <div className="relative min-h-0 flex-1">
            <DrawingCanvas
              onApi={setApi}
              theme={resolvedTheme === "light" ? "light" : "dark"}
            />
          </div>
        </div>
        {previewOpen && (
          <PreviewPanel
            steps={previewSteps}
            loading={previewLoading}
            error={previewError}
            onClose={() => setPreviewOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
