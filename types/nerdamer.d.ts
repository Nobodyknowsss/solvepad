declare module "nerdamer" {
  interface Expression {
    text(format?: string): string;
    toString(): string;
    expand(): Expression;
    evaluate(): Expression;
    solveFor(variable: string): Expression[];
  }

  interface Nerdamer {
    (
      expr: string,
      subs?: Record<string, number | string>,
      options?: string | string[],
    ): Expression;
    solve(expr: string, variable: string): Expression;
    expand(expr: string): Expression;
  }

  const nerdamer: Nerdamer;
  export default nerdamer;
}

declare module "nerdamer/Algebra" {}
declare module "nerdamer/Solve" {}
declare module "nerdamer/Calculus" {}
