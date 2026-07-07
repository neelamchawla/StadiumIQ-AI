import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  rows?: number;
  columns?: number;
  showHeader?: boolean;
}

const GRID_COLS: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
};

export function LoadingSkeleton({
  rows = 3,
  columns = 3,
  showHeader = true,
}: LoadingSkeletonProps) {
  const gridClass = GRID_COLS[columns] ?? GRID_COLS[3];
  return (
    <div
      className="space-y-6"
      role="status"
      aria-live="polite"
      aria-label="Loading content"
    >
      {showHeader && (
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>
      )}

      <div className={cn("grid gap-4", gridClass)}>
        {Array.from({ length: rows * columns }).map((_, index) => (
          <div key={index} className="space-y-3 rounded-xl border p-6">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ))}
      </div>

      <span className="sr-only">Loading...</span>
    </div>
  );
}
