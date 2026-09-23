import { Skeleton } from "@/components/ui/skeleton";
import { PulseLoader } from "@/components/brand/pulse-loader";

export default function AnalyticsLoading() {
  return (
    <div>
      <PulseLoader className="mb-4" size="sm" label="Loading analytics" />
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="space-y-2">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-4 w-56" />
        </div>
        <Skeleton className="h-8 w-32 rounded-xl" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-24 rounded-2xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-72 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
