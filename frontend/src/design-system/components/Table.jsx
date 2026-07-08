import cn from "../utils/cn";

export default function Table({ children, className, ...props }) {
  return (
    <div className={cn("ds-scrollbar w-full overflow-x-auto rounded-[var(--radius-xl)]", className)}>
      <table
        className="min-w-full border-separate border-spacing-0 text-left text-sm"
        {...props}
      >
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ children, className, ...props }) {
  return (
    <thead
      className={cn(
        "bg-white/6 text-xs uppercase tracking-[0.08em] text-soft-white-subtle",
        className,
      )}
      {...props}
    >
      {children}
    </thead>
  );
}

export function TableBody({ children, className, ...props }) {
  return (
    <tbody className={cn("divide-y divide-white/6", className)} {...props}>
      {children}
    </tbody>
  );
}

export function TableRow({ children, className, hover = true, ...props }) {
  return (
    <tr
      className={cn(
        "transition-colors duration-[var(--duration-fast)]",
        hover && "hover:bg-white/4",
        className,
      )}
      {...props}
    >
      {children}
    </tr>
  );
}

export function TableHead({ children, className, ...props }) {
  return (
    <th
      className={cn(
        "px-5 py-4 font-semibold first:rounded-tl-[var(--radius-xl)] last:rounded-tr-[var(--radius-xl)]",
        className,
      )}
      {...props}
    >
      {children}
    </th>
  );
}

export function TableCell({ children, className, ...props }) {
  return (
    <td className={cn("px-5 py-4 text-soft-white-muted", className)} {...props}>
      {children}
    </td>
  );
}

export function TableEmpty({ children, colSpan = 1, className, ...props }) {
  return (
    <tr {...props}>
      <td
        colSpan={colSpan}
        className={cn(
          "px-5 py-12 text-center text-sm text-soft-white-subtle",
          className,
        )}
      >
        {children}
      </td>
    </tr>
  );
}
