export type PreviewStep = { latex: string; expr: string };

export type PreviewResult = {
  steps: PreviewStep[];
};

export function isPreviewResult(v: unknown): v is PreviewResult {
  if (!v || typeof v !== "object") return false;
  const o = v as Record<string, unknown>;
  if (!Array.isArray(o.steps)) return false;
  return o.steps.every((s) => {
    if (!s || typeof s !== "object") return false;
    const st = s as Record<string, unknown>;
    return typeof st.latex === "string" && typeof st.expr === "string";
  });
}
