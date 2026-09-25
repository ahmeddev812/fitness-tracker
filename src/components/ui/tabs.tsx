"use client";

import type { ReactNode } from "react";

export interface TabItem {
  value: string;
  label: string;
  icon?: ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function Tabs({ tabs, value, onChange, className = "" }: TabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Section tabs"
      className={[
        "inline-flex w-full justify-between gap-1 rounded-2xl border border-border bg-card p-1 sm:w-auto sm:justify-start",
        className,
      ].join(" ")}
    >
      {tabs.map((tab) => {
        const active = tab.value === value;
        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.value)}
            className={[
              "flex h-10 min-w-0 flex-none items-center justify-center gap-2 rounded-xl px-3 text-sm font-medium transition-all sm:px-4",
              active
                ? "bg-primary text-primary-foreground shadow-soft"
                : "text-muted-foreground hover:bg-accent/10 hover:text-foreground",
            ].join(" ")}
          >
            {tab.icon && <span className="hidden shrink-0 sm:flex">{tab.icon}</span>}
            <span className="truncate">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
