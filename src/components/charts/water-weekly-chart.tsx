"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function WaterWeeklyChart({
  data,
}: {
  data: Array<{ date: string; ml: number }>;
}) {
  return (
    <ResponsiveContainer width="100%" height={160}>
      <BarChart data={data} accessibilityLayer>
        <XAxis dataKey="date" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} width={40} />
        <Tooltip
          contentStyle={{
            fontSize: 12,
            borderRadius: 8,
            border: "1px solid var(--color-border)",
          }}
          formatter={(value) => [`${Number(value)} ml`, "Water"]}
        />
        <Bar dataKey="ml" fill="#3b82f6" radius={[4, 4, 0, 0]} isAnimationActive={false} />
      </BarChart>
    </ResponsiveContainer>
  );
}
