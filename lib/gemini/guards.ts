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

export const SolutionStepSchema = z.object({
  latex: z.string(),
  explanation: z.string(),
});

export const SolutionResultSchema = z.object({
  steps: z.array(SolutionStepSchema),
});

export type SolutionStep = z.infer<typeof SolutionStepSchema>;
export type SolutionResult = z.infer<typeof SolutionResultSchema>;
