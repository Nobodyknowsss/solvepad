import { PracticePicker } from "@/components/workspace/PracticePicker";

export default function WorkspacePage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12 md:py-16">
      <p className="text-xs font-semibold uppercase tracking-widest text-red-700 dark:text-red-400">
        Practice
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
        Pick what to practice.
      </h1>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
        Choose a topic and we&apos;ll generate a problem at your level — or type
        your own. Then work it out by hand and we&apos;ll check each step.
      </p>

      <PracticePicker />
    </div>
  );
}