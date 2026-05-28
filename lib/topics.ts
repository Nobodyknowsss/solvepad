export type TopicId = "LINEAR_EQUATIONS" | "FACTORING";

export type TopicConfig = {
  id: TopicId;
  title: string;
  description: string;
  example: string;
  meta: string;
  recommended?: boolean;
};

export const TOPICS: TopicConfig[] = [
  {
    id: "LINEAR_EQUATIONS",
    title: "Linear equations",
    description: "Solve for one variable",
    example: "3x + 7 = 22",
    meta: "Lvl 2 · Two-step",
    recommended: true,
  },
  {
    id: "FACTORING",
    title: "Factoring",
    description: "Quadratics & differences of squares",
    example: "x² - 5x + 6",
    meta: "Lvl 1 · Easy",
  },
];

export function topicById(id: string): TopicConfig | undefined {
  return TOPICS.find((t) => t.id === id);
}
