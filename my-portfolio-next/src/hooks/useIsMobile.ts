"use client";
import { useEffect, useState } from "react";

export function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(`(max-width: ${breakpoint}px)`);

    const update = () => setIsMobile(media.matches);
    update();

    // Modern browsers
    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", update);
      return () => media.removeEventListener("change", update);
    }

    // Old Safari fallback
    const legacy = media as MediaQueryList & {
      addListener?: (listener: (e: MediaQueryListEvent) => void) => void;
      removeListener?: (listener: (e: MediaQueryListEvent) => void) => void;
    };

    legacy.addListener?.(update);
    return () => legacy.removeListener?.(update);
  }, [breakpoint]);

  return isMobile;
}
