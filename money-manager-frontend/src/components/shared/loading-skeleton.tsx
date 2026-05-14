"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useDelayedRender } from "@/hooks/use-delayed-render";
import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  className?: string;
  count?: number;
  type?: "default" | "card" | "list" | "chart";
}

export function LoadingSkeleton({ className, type = "default" }: LoadingSkeletonProps) {
  const show = useDelayedRender(200);

  if (!show) return null;

  return (
    <div className={cn("space-y-6 animate-in fade-in duration-500", className)}>
      {type === "default" && (
        <>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-10 w-[250px]" />
              <Skeleton className="h-4 w-[350px]" />
            </div>
            <Skeleton className="h-10 w-[120px]" />
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-[200px] rounded-[var(--radius)]" />
            <Skeleton className="h-[200px] rounded-[var(--radius)]" />
            <Skeleton className="h-[200px] rounded-[var(--radius)]" />
          </div>
          <Skeleton className="h-[400px] w-full rounded-[var(--radius)]" />
        </>
      )}

      {type === "card" && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[200px] rounded-[var(--radius)]" />
          ))}
        </div>
      )}

      {type === "list" && (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 border rounded-[var(--radius)]">
              <Skeleton className="size-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-[40%]" />
                <Skeleton className="h-3 w-[20%]" />
              </div>
              <Skeleton className="h-6 w-20" />
            </div>
          ))}
        </div>
      )}

      {type === "chart" && (
        <CardSkeleton />
      )}
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="rounded-[var(--radius)] border bg-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-8 w-24" />
      </div>
      <Skeleton className="h-[300px] w-full" />
    </div>
  );
}
