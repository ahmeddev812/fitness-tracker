import type { HTMLAttributes } from "react";

type CardVariant = "default" | "glass" | "elevated";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  hover?: boolean;
}

const variantStyles: Record<CardVariant, string> = {
  default: "bg-card text-card-foreground",
  glass: "glass-strong border-border/60 text-card-foreground",
  elevated: "bg-card text-card-foreground shadow-elevated",
};

export function Card({
  variant = "default",
  hover = false,
  className = "",
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={[
        "rounded-2xl border border-border transition-all duration-300",
        variantStyles[variant],
        hover && "hover-lift hover:border-primary/30",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className = "", children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={["flex flex-col space-y-1.5 p-6", className].join(" ")} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className = "", children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={["text-base font-semibold leading-none tracking-tight", className].join(" ")} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ className = "", children, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={["text-sm text-muted-foreground", className].join(" ")} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ className = "", children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={["p-6 pt-0", className].join(" ")} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className = "", children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={["flex items-center p-6 pt-0", className].join(" ")} {...props}>
      {children}
    </div>
  );
}
