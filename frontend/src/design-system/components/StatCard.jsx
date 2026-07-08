import cn from "../utils/cn";
import Card from "./Card";
import Badge from "./Badge";

const accentStyles = {
  cyan: "from-cyan-400/18 to-transparent border-cyan-400/20 shadow-[var(--shadow-glow-cyan)]",
  emerald:
    "from-emerald-400/18 to-transparent border-emerald-400/20 shadow-[var(--shadow-glow-emerald)]",
  gold: "from-gold-400/16 to-transparent border-gold-400/20 shadow-[var(--shadow-glow-gold)]",
  neutral: "from-white/8 to-transparent border-white/10",
};

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendLabel,
  accent = "cyan",
  badge,
  className,
  ...props
}) {
  const trendIsPositive = typeof trend === "number" ? trend >= 0 : null;

  return (
    <Card
      padding="lg"
      hover
      className={cn(
        "relative overflow-hidden border bg-gradient-to-br to-navy-900/40",
        accentStyles[accent],
        className,
      )}
      {...props}
    >
      <div className="absolute right-0 top-0 h-24 w-24 translate-x-6 -translate-y-6 rounded-full bg-white/5 blur-2xl" />

      <div className="relative flex items-start justify-between gap-4">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <p className="ds-label">{title}</p>
            {badge ? <Badge size="sm">{badge}</Badge> : null}
          </div>

          <div>
            <p className="ds-heading text-3xl font-semibold sm:text-4xl">{value}</p>
            {subtitle ? (
              <p className="mt-2 text-sm text-soft-white-muted">{subtitle}</p>
            ) : null}
          </div>

          {trend !== undefined || trendLabel ? (
            <div className="flex items-center gap-2 text-sm">
              {trend !== undefined ? (
                <Badge
                  variant={trendIsPositive ? "success" : "danger"}
                  size="sm"
                  dot
                >
                  {trendIsPositive ? "+" : ""}
                  {trend}%
                </Badge>
              ) : null}
              {trendLabel ? (
                <span className="text-soft-white-subtle">{trendLabel}</span>
              ) : null}
            </div>
          ) : null}
        </div>

        {icon ? (
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[var(--radius-lg)] border border-white/10 bg-white/6 text-xl text-cyan-300">
            {icon}
          </div>
        ) : null}
      </div>
    </Card>
  );
}
