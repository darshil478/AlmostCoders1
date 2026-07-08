import { forwardRef, useId } from "react";
import cn from "../utils/cn";

const Input = forwardRef(function Input(
  {
    label,
    hint,
    error,
    leftIcon,
    rightIcon,
    className,
    inputClassName,
    containerClassName,
    id,
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <div className={cn("flex w-full flex-col gap-2", containerClassName)}>
      {label ? (
        <label htmlFor={inputId} className="ds-label">
          {label}
        </label>
      ) : null}

      <div className={cn("relative", className)}>
        {leftIcon ? (
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-soft-white-subtle">
            {leftIcon}
          </span>
        ) : null}

        <input
          ref={ref}
          id={inputId}
          aria-invalid={Boolean(error)}
          aria-describedby={[hintId, errorId].filter(Boolean).join(" ") || undefined}
          className={cn(
            "h-12 w-full rounded-[var(--radius-lg)] border border-white/10 bg-white/5 px-4 text-sm text-soft-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-xl transition-all duration-[var(--duration-normal)] placeholder:text-soft-white-subtle focus:border-cyan-400/50 focus:bg-white/7 focus:outline-none focus:ring-4 focus:ring-cyan-400/10 disabled:cursor-not-allowed disabled:opacity-50",
            leftIcon && "pl-11",
            rightIcon && "pr-11",
            error &&
              "border-danger-400/40 focus:border-danger-400/60 focus:ring-danger-400/10",
            inputClassName,
          )}
          {...props}
        />

        {rightIcon ? (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-soft-white-subtle">
            {rightIcon}
          </span>
        ) : null}
      </div>

      {hint && !error ? (
        <p id={hintId} className="text-xs text-soft-white-subtle">
          {hint}
        </p>
      ) : null}

      {error ? (
        <p id={errorId} className="text-xs text-danger-400">
          {error}
        </p>
      ) : null}
    </div>
  );
});

export default Input;

export const Textarea = forwardRef(function Textarea(
  {
    label,
    hint,
    error,
    className,
    containerClassName,
    id,
    rows = 4,
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <div className={cn("flex w-full flex-col gap-2", containerClassName)}>
      {label ? (
        <label htmlFor={inputId} className="ds-label">
          {label}
        </label>
      ) : null}

      <textarea
        ref={ref}
        id={inputId}
        rows={rows}
        aria-invalid={Boolean(error)}
        aria-describedby={[hintId, errorId].filter(Boolean).join(" ") || undefined}
        className={cn(
          "min-h-[120px] w-full rounded-[var(--radius-lg)] border border-white/10 bg-white/5 px-4 py-3 text-sm text-soft-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-xl transition-all duration-[var(--duration-normal)] placeholder:text-soft-white-subtle focus:border-cyan-400/50 focus:bg-white/7 focus:outline-none focus:ring-4 focus:ring-cyan-400/10 disabled:cursor-not-allowed disabled:opacity-50",
          error &&
            "border-danger-400/40 focus:border-danger-400/60 focus:ring-danger-400/10",
          className,
        )}
        {...props}
      />

      {hint && !error ? (
        <p id={hintId} className="text-xs text-soft-white-subtle">
          {hint}
        </p>
      ) : null}

      {error ? (
        <p id={errorId} className="text-xs text-danger-400">
          {error}
        </p>
      ) : null}
    </div>
  );
});
