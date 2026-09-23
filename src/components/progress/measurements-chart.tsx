"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const MEASUREMENT_COLORS: Record<string, string> = {
  waist: "#f97316",
  chest: "#3b82f6",
  arms: "#a855f7",
  thighs: "#22c55e",
};

function MeasurementTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; dataKey: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-strong rounded-xl px-3 py-2 shadow-premium border border-border/60 text-sm">
      <p className="font-medium text-foreground mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-muted-foreground">
          {entry.dataKey}:{" "}
          <span className="font-medium text-foreground">
            {Number(entry.value).toFixed(1)} cm
          </span>
        </p>
      ))}
    </div>
  );
}

export default function MeasurementsChart({
  data,
}: {
  data: Array<{
    label: string;
    waist?: number | null;
    chest?: number | null;
    arms?: number | null;
    thighs?: number | null;
  }>;
}) {
  return (
    <div className="h-64" aria-hidden="true">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis
            dataKey="label"
            className="text-xs"
            tick={{ fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            interval={Math.max(Math.floor(data.length / 6), 0)}
          />
          <YAxis
            className="text-xs"
            tick={{ fontSize: 11 }}
            width={40}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) => v.toFixed(0)}
          />
          <Tooltip content={<MeasurementTooltip />} />
          <Legend
            iconType="circle"
            wrapperStyle={{ fontSize: "12px" }}
          />
          <Line
            type="monotone"
            dataKey="waist"
            stroke={MEASUREMENT_COLORS.waist}
            strokeWidth={2}
            dot={false}
            connectNulls={false}
          />
          <Line
            type="monotone"
            dataKey="chest"
            stroke={MEASUREMENT_COLORS.chest}
            strokeWidth={2}
            dot={false}
            connectNulls={false}
          />
          <Line
            type="monotone"
            dataKey="arms"
            stroke={MEASUREMENT_COLORS.arms}
            strokeWidth={2}
            dot={false}
            connectNulls={false}
          />
          <Line
            type="monotone"
            dataKey="thighs"
            stroke={MEASUREMENT_COLORS.thighs}
            strokeWidth={2}
            dot={false}
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
