"use client";

import { useCallback, useEffect, useRef } from "react";

type Params = {
  historyRef: React.RefObject<HTMLDivElement | null>;
  deps: unknown[]; // pass [history] from parent
  skipRef?: React.MutableRefObject<boolean>;
  threshold?: number;
};

export function useStickyAutoScroll({
  historyRef,
  deps,
  skipRef,
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
    if (skipRef?.current) {
      skipRef.current = false;
      return;
    }
    if (!stickyRef.current) return;

    scrollToBottom("smooth");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { scrollToBottom, stickyRef };
}
