"use client";

import katex from "katex";
import "katex/dist/katex.min.css";

export default function MathRender({ latex }: { latex: string }) {
  const html = katex.renderToString(latex, {
    throwOnError: false,
    displayMode: true,
  });

  return (
    <span
      className="text-foreground"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}