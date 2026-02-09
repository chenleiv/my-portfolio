import { useEffect, useRef } from "react";

export function useScrollStickiness() {
  const historyRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef(true);
  const skipNextAutoScrollRef = useRef(false);

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    const el = historyRef.current;
    if (!el) return;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.scrollTo({ top: el.scrollHeight, behavior });
      });
    });
  };

  useEffect(() => {
    const el = historyRef.current;
    if (!el) return;

    const onScroll = () => {
      const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
      stickyRef.current = distance < 80;
    };

    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return {
    historyRef,
    stickyRef,
    skipNextAutoScrollRef,
    scrollToBottom,
  };
}
