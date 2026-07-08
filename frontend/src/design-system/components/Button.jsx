import { forwardRef } from "react";
import cn from "../utils/cn";

const variantStyles = {
  primary:
    "bg-gradient-to-r from-cyan-500 to-emerald-500 text-navy-950 shadow-[var(--shadow-glow-cyan)] hover:brightness-110",
  secondary:
    "bg-white/8 text-soft-white border border-white/12 hover:bg-white/12 hover:border-cyan-400/30",
  ghost: "bg-transparent text-soft-white hover:bg-white/8",
  outline:
    "bg-transparent text-cyan-400 border border-cyan-400/40 hover:bg-cyan-400/10 hover:border-cyan-400/70",
  danger:
    "bg-danger-500/15 text-danger-400 border border-danger-400/30 hover:bg-danger-500/25",
  gold: "bg-gold-400/12 text-gold-300 border border-gold-400/30 hover:bg-gold-400/18",
};

const sizeStyles = {
  sm: "h-9 px-4 text-sm gap-2 rounded-[var(--radius-md)]",
  md: "h-11 px-5 text-sm gap-2.5 rounded-[var(--radius-lg)]",
  lg: "h-12 px-6 text-base gap-3 rounded-[var(--radius-xl)]",
  icon: "h-11 w-11 p-0 rounded-[var(--radius-lg)]",
};

const Button = forwardRef(function Button(
  {
    as: Component = "button",
    variant = "primary",
    size = "md",
    className,
    loading = false,
    disabled,
    leftIcon,
    rightIcon,
    children,
    ...props
  },
  ref,
) {
  const isDisabled = disabled || loading;

  return (
    <Component
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center font-semibold transition-all duration-[var(--duration-normal)] ease-[var(--ease-out)] disabled:cursor-not-allowed disabled:opacity-50",
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <span
          aria-hidden="true"
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"
        />
      ) : (
        leftIcon
      )}
      {children}
      {!loading && rightIcon}
    </Component>
  );
});

export default Button;
