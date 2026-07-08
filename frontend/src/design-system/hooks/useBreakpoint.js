import { useEffect, useState } from "react";
import { breakpoints } from "../tokens/breakpoints";

function getBreakpointLabel(width) {
  if (width >= breakpoints["2xl"]) return "2xl";
  if (width >= breakpoints.xl) return "xl";
  if (width >= breakpoints.lg) return "lg";
  if (width >= breakpoints.md) return "md";
  if (width >= breakpoints.sm) return "sm";
  return "xs";
}

export default function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState(() =>
    typeof window === "undefined"
      ? "lg"
      : getBreakpointLabel(window.innerWidth),
  );

  useEffect(() => {
    const handleResize = () => {
      setBreakpoint(getBreakpointLabel(window.innerWidth));
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return {
    breakpoint,
    isXs: breakpoint === "xs",
    isSm: breakpoint === "sm",
    isMd: breakpoint === "md",
    isLg: breakpoint === "lg",
    isXl: breakpoint === "xl",
    is2xl: breakpoint === "2xl",
    isMobile:
      breakpoint === "xs" ||
      breakpoint === "sm" ||
      (breakpoints[breakpoint] ?? 0) < breakpoints.md,
    isTablet: breakpoint === "md",
    isDesktop:
      breakpoint === "lg" || breakpoint === "xl" || breakpoint === "2xl",
  };
}
