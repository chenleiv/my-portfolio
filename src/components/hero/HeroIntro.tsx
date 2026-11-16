"use client";

import { useId, useState } from "react";

// The full intro is always in the page. On phones and touch screens CSS clamps
// it to three lines until Read more is pressed; screen readers read all of it
// either way. Elsewhere the button is hidden and the text is never clamped.
export function HeroIntro({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const id = useId();
  return (
    <>
      <p id={id} className="hero__intro" data-expanded={expanded}>
        {text}
      </p>
      <button
        type="button"
        className="hero__more"
        aria-expanded={expanded}
        aria-controls={id}
        onClick={() => setExpanded((v) => !v)}
      >
        {expanded ? "Show less" : "Read more"}
      </button>
    </>
  );
}
