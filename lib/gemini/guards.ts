export type PreviewResult = {
  steps: Array<{ latex: string }>;
};

export function isPreviewResult(v: unknown): v is PreviewResult {
  if (!v || typeof v !== "object") return false;
  const o = v as Record<string, unknown>;
  if (!Array.isArray(o.steps)) return false;
  return o.steps.every((s) => {
    if (!s || typeof s !== "object") return false;
    return typeof (s as Record<string, unknown>).latex === "string";
  });
}
