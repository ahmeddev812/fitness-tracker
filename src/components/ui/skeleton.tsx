interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={[
        "relative overflow-hidden rounded-xl bg-muted/60",
        "before:absolute before:inset-0",
        "before:bg-gradient-to-r before:from-transparent before:via-foreground/5 before:to-transparent",
        "before:animate-shimmer",
        className,
      ].join(" ")}
      aria-hidden="true"
    />
  );
}
