"use client";

import { useMemo, memo, useState } from "react";
import { m } from "framer-motion";
import { useFitnessData } from "@/hooks/useFitnessData";
import {
  Dumbbell,
  Apple,
  Droplets,
  Scale,
  Trophy,
  Footprints,
} from "lucide-react";
import { formatDisplayDate } from "@/lib/dates";
import { Button } from "@/components/ui/button";

interface FeedItem {
  id: string;
  icon: typeof Dumbbell;
  color: string;
  bgColor: string;
  title: string;
  value: string;
  timestamp: string;
}

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return formatDisplayDate(dateStr.split("T")[0]);
}

function ActivityFeedImpl() {
  const { workouts, meals, water, weights, goals } = useFitnessData();
  const [expanded, setExpanded] = useState(false);

  const feedItems = useMemo(() => {
    const items: FeedItem[] = [];

    // Recent workouts
    workouts.slice(-5).reverse().forEach((w) => {
      items.push({
        id: `w-${w.id}`,
        icon: Dumbbell,
        color: "text-primary",
        bgColor: "bg-primary/10",
        title: `Logged ${w.name}`,
        value: `${w.exercises.length} exercises · ${w.durationMinutes || 0} min`,
        timestamp: w.createdAt,
      });
    });

    // Recent meals
    meals.slice(-5).reverse().forEach((m) => {
      items.push({
        id: `m-${m.id}`,
        icon: Apple,
        color: "text-success",
        bgColor: "bg-success/10",
        title: `Logged ${m.foodName}`,
        value: `${m.calories} kcal · ${m.mealType}`,
        timestamp: m.createdAt,
      });
    });

    // Recent water
    water.slice(-3).reverse().forEach((w) => {
      items.push({
        id: `wa-${w.id}`,
        icon: Droplets,
        color: "text-info",
        bgColor: "bg-info/10",
        title: `Added ${w.amountMl}ml water`,
        value: w.date,
        timestamp: w.createdAt,
      });
    });

    // Recent weights
    weights.slice(-3).reverse().forEach((w) => {
      items.push({
        id: `wt-${w.id}`,
        icon: Scale,
        color: "text-warning",
        bgColor: "bg-warning/10",
        title: `Weighed ${w.weightKg} kg`,
        value: w.notes || "Weight entry",
        timestamp: w.date,
      });
    });

    // Completed goals
    goals.filter((g) => g.status === "completed").slice(-2).reverse().forEach((g) => {
      items.push({
        id: `g-${g.id}`,
        icon: Trophy,
        color: "text-accent",
        bgColor: "bg-accent/10",
        title: `Completed: ${g.title || g.type}`,
        value: "Goal achieved!",
        timestamp: g.completedAt || g.createdAt,
      });
    });

    // Sort by timestamp, most recent first
    items.sort((a, b) => {
      const tA = new Date(a.timestamp).getTime();
      const tB = new Date(b.timestamp).getTime();
      return tB - tA;
    });

    return items.slice(0, 10);
  }, [workouts, meals, water, weights, goals]);

  if (feedItems.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="text-base font-semibold text-foreground">Recent Activity</h3>
        <div className="flex flex-col items-center py-8 text-center">
          <Footprints className="h-8 w-8 text-muted-foreground/40 mb-3" />
          <p className="text-sm text-muted-foreground">No activity yet</p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            Start logging to see your feed
          </p>
        </div>
      </div>
    );
  }

  const visibleItems = expanded ? feedItems : feedItems.slice(0, 5);

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-base font-semibold text-foreground">Recent Activity</h3>
        {feedItems.length > 5 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
          >
            {expanded ? "Show less" : `Show more (${feedItems.length - 5})`}
          </Button>
        )}
      </div>
      <div className="space-y-1">
        {visibleItems.map((item, i) => (
          <m.div
            key={item.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: i * 0.04 }}
            className="flex items-start gap-3 py-2.5 border-b border-border/40 last:border-0"
          >
            <div className={`rounded-lg p-1.5 ${item.bgColor} shrink-0`}>
              <item.icon className={`h-3.5 w-3.5 ${item.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {item.title}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {item.value}
              </p>
            </div>
            <span className="whitespace-nowrap text-xs text-muted-foreground">
              {timeAgo(item.timestamp)}
            </span>
          </m.div>
        ))}
      </div>
    </div>
  );
}

export const ActivityFeed = memo(ActivityFeedImpl);
ActivityFeed.displayName = "ActivityFeed";
