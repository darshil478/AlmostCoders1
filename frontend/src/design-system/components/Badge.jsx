import cn from "../utils/cn";

const variantStyles = {
  neutral: "bg-white/8 text-soft-white border-white/10",
  cyan: "bg-cyan-400/12 text-cyan-300 border-cyan-400/25",
  emerald: "bg-emerald-400/12 text-emerald-300 border-emerald-400/25",
  gold: "bg-gold-400/12 text-gold-300 border-gold-400/25",
  success: "bg-emerald-500/15 text-emerald-300 border-emerald-400/25",
  warning: "bg-warning-400/12 text-warning-400 border-warning-400/25",
  danger: "bg-danger-500/15 text-danger-400 border-danger-400/25",
};

const sizeStyles = {
  sm: "px-2.5 py-1 text-[11px]",
  md: "px-3 py-1.5 text-xs",
  lg: "px-3.5 py-2 text-sm",
};

export default function Badge({
  children,
  variant = "neutral",
  size = "md",
  dot = false,
  className,
  ...props
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border font-semibold tracking-wide",
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      {...props}
    >
      {dot ? (
        <span
          aria-hidden="true"
          className="h-1.5 w-1.5 rounded-full bg-current shadow-[0_0_8px_currentColor]"
        />
      ) : null}
      {children}
    </span>
  );
}
