import type { ReactNode } from "react";

interface ChartCardProps {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function ChartCard({
  title,
  description,
  action,
  children,
  className = "",
}: ChartCardProps) {
  return (
    <div
      className={[
        "rounded-xl border border-border bg-card shadow-sm",
        className,
      ].join(" ")}
    >
      <div className="flex items-center justify-between p-6 pb-2">
        <div>
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          {description && (
            <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
          )}
        </div>
        {action}
      </div>
      <div className="p-6 pt-2">{children}</div>
    </div>
  );
}