import { useEffect } from "react";

export default function useLockBodyScroll(locked) {
  useEffect(() => {
    if (!locked) return undefined;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [locked]);
}
