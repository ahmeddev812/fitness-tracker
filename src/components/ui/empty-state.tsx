"use client";

import type { ReactNode } from "react";
import { memo } from "react";
import { m } from "framer-motion";
import { Inbox } from "lucide-react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

function EmptyStateImpl({
  icon,
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <m.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={[
        "flex flex-col items-center justify-center py-12 px-6 text-center",
        className,
      ].join(" ")}
    >
      <div className="relative mb-4">
        <div className="absolute inset-0 gradient-primary rounded-2xl blur-lg opacity-30" />
        <div className="relative glass-strong rounded-2xl p-3.5">
          {icon || <Inbox className="h-6 w-6 text-muted-foreground" aria-hidden="true" />}
        </div>
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground max-w-sm mb-4">{description}</p>
      )}
      {action}
    </m.div>
  );
}

export const EmptyState = memo(EmptyStateImpl);
EmptyState.displayName = "EmptyState";
