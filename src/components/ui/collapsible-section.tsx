"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { m } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface CollapsibleSectionProps {
  title: string;
  icon?: React.ReactNode;
  defaultOpen?: boolean;
  danger?: boolean;
  delay?: number;
  action?: React.ReactNode;
  children: React.ReactNode;
}

export function CollapsibleSection({
  title,
  icon,
  defaultOpen = false,
  danger = false,
  delay = 0,
  action,
  children,
}: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <m.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <Card variant="elevated">
        <div className="flex items-center gap-3 px-6 py-4">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="flex min-h-11 flex-1 items-center gap-3 text-left"
          >
            {icon && (
              <span className={danger ? "text-destructive" : "text-muted-foreground"}>{icon}</span>
            )}
            <span
              className={`text-base font-semibold ${danger ? "text-destructive" : "text-foreground"}`}
            >
              {title}
            </span>
            <ChevronDown
              className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${open ? "" : "-rotate-90"}`}
              aria-hidden="true"
            />
          </button>
          {action && <div onClick={(e) => e.stopPropagation()}>{action}</div>}
        </div>
        {open && <div className="px-6 pb-6">{children}</div>}
      </Card>
    </m.div>
  );
}
