export type Difficulty = "easy" | "medium" | "hard";

export type ProblemConfig = {
  id: string;
  difficulty: Difficulty;
  problem: string;
};

export const PROBLEMS: ProblemConfig[] = [
  { id: "easy-1", difficulty: "easy", problem: "x + 4 = 9" },
  { id: "easy-2", difficulty: "easy", problem: "2x = 14" },
  { id: "medium-1", difficulty: "medium", problem: "3x + 7 = 22" },
  { id: "medium-2", difficulty: "medium", problem: "5x - 3 = 12" },
  { id: "hard-1", difficulty: "hard", problem: "4(x + 1) = 2x + 10" },
  { id: "hard-2", difficulty: "hard", problem: "2(x - 4) + 5 = 17" },
];

export function problemById(id: string): ProblemConfig | undefined {
  return PROBLEMS.find((p) => p.id === id);
}