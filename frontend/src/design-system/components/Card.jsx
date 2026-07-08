import cn from "../utils/cn";

export default function Card({
  children,
  className,
  variant = "glass",
  padding = "lg",
  hover = false,
  ...props
}) {
  const paddingStyles = {
    none: "p-0",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
    xl: "p-10",
  };

  return (
    <div
      className={cn(
        "rounded-[var(--radius-xl)] transition-all duration-[var(--duration-normal)] ease-[var(--ease-out)]",
        variant === "glass" && "ds-glass",
        variant === "strong" && "ds-glass-strong",
        variant === "solid" &&
          "border border-white/8 bg-navy-900/90 shadow-[var(--shadow-md)]",
        paddingStyles[padding],
        hover &&
          "hover:-translate-y-0.5 hover:border-cyan-400/20 hover:shadow-[var(--shadow-glow-cyan)]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className, ...props }) {
  return (
    <div
      className={cn("mb-6 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({ children, className, ...props }) {
  return (
    <h3
      className={cn("ds-heading text-xl font-semibold sm:text-2xl", className)}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({ children, className, ...props }) {
  return (
    <p
      className={cn("max-w-2xl text-sm leading-relaxed text-soft-white-muted", className)}
      {...props}
    >
      {children}
    </p>
  );
}

export function CardContent({ children, className, ...props }) {
  return (
    <div className={cn("space-y-6", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className, ...props }) {
  return (
    <div
      className={cn(
        "mt-8 flex flex-col gap-3 border-t border-white/8 pt-6 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
