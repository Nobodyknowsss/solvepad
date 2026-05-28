import { z } from "zod";


export const PreviewStepSchema = z.object({
  latex: z.string(),
  expr: z.string(),
});

export const PreviewResultSchema = z.object({
  steps: z.array(PreviewStepSchema),
});

export type PreviewStep = z.infer<typeof PreviewStepSchema>;
export type PreviewResult = z.infer<typeof PreviewResultSchema>;

export const ExplainResultSchema = z.object({
  explanation: z.string(),
});

export type ExplainResult = z.infer<typeof ExplainResultSchema>;
