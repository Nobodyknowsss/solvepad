"use client";

import Link from "next/link";
import { ArrowRight, Check, CircleHelp, Equal, Sparkles } from "lucide-react";

const steps = [
  {
    label: "Subtract 4 from both sides",
    expression: "x + 4 − 4 = 9 − 4",
    state: "done",
  },
  { label: "Simplify both sides", expression: "x = 5", state: "current" },
];

export default function Page() {
  return (
    <main className="min-h-screen overflow-hidden bg-background text-[#f7f7f5]">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
        <Link
          href="/"
          className="flex items-center gap-3"
          aria-label="Solve home"
        >
          <span className="flex size-9 items-center justify-center rounded-xl bg-[#ff5c5c] font-mono text-lg font-bold text-[#160b0b]">
            ∑
          </span>
          <span className="font-mono text-sm font-bold tracking-tight">
            solve<span className="text-[#ff5c5c]">.</span>
          </span>
        </Link>
        <div className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <a
            href="#how-it-works"
            className="transition-colors hover:text-[#f7f7f5]"
          >
            How it works
          </a>
          <a
            href="#why-solve"
            className="transition-colors hover:text-[#f7f7f5]"
          >
            Why solve?
          </a>
        </div>
        <Link
          href="/workspace"
          className="group flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:border-[#ff5c5c] hover:text-[#ff5c5c]"
        >
          Open workspace{" "}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </nav>

      <section className="mx-auto grid max-w-7xl items-center gap-16 px-6 pb-24 pt-16 lg:grid-cols-[1fr_0.9fr] lg:px-10 lg:pb-32 lg:pt-24">
        <div className="max-w-2xl">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#ff5c5c]/30 bg-[#ff5c5c]/5 px-3 py-1.5 font-mono text-xs text-[#ff5c5c]">
            <Sparkles className="size-3.5" /> Learn by solving
          </div>
          <h1 className="text-balance font-mono text-5xl font-bold leading-[1.08] tracking-[-0.06em] text-[#f7f7f5] sm:text-6xl lg:text-7xl">
            Don&apos;t just find <span className="text-[#ff5c5c]">x.</span>
            <br />
            Understand it.
          </h1>
          <p className="mt-7 max-w-xl text-pretty text-lg leading-8 text-muted-foreground">
            Solve linear equations one step at a time. Get a hint when
            you&apos;re stuck, and instant feedback that shows exactly where
            your thinking went off track.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/workspace"
              className="group inline-flex items-center justify-center gap-3 rounded-lg bg-[#ff5c5c] px-6 py-3.5 font-mono text-sm font-bold text-[#ff5c5c]-foreground transition-transform hover:-translate-y-0.5"
            >
              Start solving{" "}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center rounded-lg border border-border px-6 py-3.5 font-mono text-sm font-medium text-muted-foreground transition-colors hover:border-foreground/30 hover:text-[#f7f7f5]"
            >
              See how it works
            </a>
          </div>
          <p className="mt-5 font-mono text-xs text-subtle"></p>
        </div>

        <div className="relative lg:pl-6">
          <div
            className="absolute -inset-8 -z-10 bg-[radial-gradient(ellipse_at_center,var(--glow),transparent_68%)]"
            aria-hidden="true"
          />
          <div className="rounded-2xl border border-border bg-card p-4 shadow-2xl shadow-black/30 sm:p-6">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-subtle">
                  Practice problem
                </p>
                <p className="mt-1 font-mono text-sm text-muted-foreground">
                  Linear equations · Easy
                </p>
              </div>
              <CircleHelp className="size-5 text-subtle" />
            </div>
            <div className="py-8 text-center sm:py-10">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-subtle">
                Solve for x
              </p>
              <p className="mt-4 font-mono text-3xl tracking-tight text-[#f7f7f5] sm:text-4xl">
                x + 4 <Equal className="mx-2 inline size-6 text-[#ff5c5c]" /> 9
              </p>
            </div>
            <div className="space-y-3 rounded-xl bg-surface p-4">
              {steps.map((step) => (
                <div key={step.label} className="flex gap-3">
                  <div
                    className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full ${step.state === "done" ? "bg-[#39d98a] text-[#071b12]" : "border border-[#ff5c5c] text-[#ff5c5c]"}`}
                  >
                    {step.state === "done" ? (
                      <Check className="size-3.5" />
                    ) : (
                      <span className="size-1.5 rounded-full bg-[#ff5c5c]" />
                    )}
                  </div>
                  <div>
                    <p className="font-mono text-xs text-muted-foreground">
                      {step.label}
                    </p>
                    <p className="mt-1 font-mono text-sm text-[#f7f7f5]">
                      {step.expression}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-3 rounded-xl border border-[#ff5c5c]/25 bg-[#ff5c5c]/5 p-4">
              <Sparkles className="size-4 shrink-0 text-[#ff5c5c]" />
              <p className="text-sm leading-6 text-muted-foreground">
                <span className="font-medium text-[#f7f7f5]">Nice work.</span>{" "}
                You kept the equation balanced. What should you do next?
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="border-y border-border bg-surface/40"
      >
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 sm:grid-cols-3 lg:px-10">
          <div>
            <span className="font-mono text-sm text-[#ff5c5c]">01</span>
            <h2 className="mt-3 font-mono text-lg font-bold">Work it out</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Enter each move instead of skipping to the answer.
            </p>
          </div>
          <div>
            <span className="font-mono text-sm text-[#ff5c5c]">02</span>
            <h2 className="mt-3 font-mono text-lg font-bold">Get the signal</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Know immediately if your step is correct.
            </p>
          </div>
          <div id="why-solve">
            <span className="font-mono text-sm text-[#ff5c5c]">03</span>
            <h2 className="mt-3 font-mono text-lg font-bold">
              Build the instinct
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Hints explain the why, so the next problem gets easier.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-6 py-20 sm:flex-row sm:items-center lg:px-10">
        <div>
          <p className="font-mono text-sm text-[#ff5c5c]">Ready when you are</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight">
            Make your next step count.
          </h2>
        </div>
        <Link
          href="/workspace"
          className="group inline-flex items-center gap-3 rounded-lg bg-foreground px-6 py-3.5 font-mono text-sm font-bold text-background transition-colors hover:bg-[#ff5c5c] hover:text-[#ff5c5c]-foreground"
        >
          Open workspace{" "}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </section>
    </main>
  );
}
