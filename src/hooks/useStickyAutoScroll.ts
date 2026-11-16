"use client";

import { useCallback, useEffect, useRef } from "react";

type Params = {
  historyRef: React.RefObject<HTMLDivElement | null>;
  // When any of these change, scrolls to the bottom if the view is already near it.
  deps: unknown[];
  threshold?: number;
};

export function useStickyAutoScroll({
  historyRef,
  deps,
  threshold = 80,
}: Params) {
  const stickyRef = useRef(true);

  const scrollToBottom = useCallback(
    (behavior: ScrollBehavior = "smooth") => {
      const el = historyRef.current;
      if (!el) return;

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.scrollTo({ top: el.scrollHeight, behavior });
        });
      });
    },
    [historyRef],
  );

  useEffect(() => {
    const el = historyRef.current;
    if (!el) return;

    const onScroll = () => {
      const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
      stickyRef.current = distance < threshold;
    };

    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [historyRef, threshold]);

  useEffect(() => {
    if (!stickyRef.current) return;

    scrollToBottom("smooth");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { scrollToBottom };
}
