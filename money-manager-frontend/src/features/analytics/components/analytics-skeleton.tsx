"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function AnalyticsSkeleton() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid gap-6 md:grid-cols-2">
        <Skeleton className="h-40 w-full rounded-[var(--radius)]" />
        <Skeleton className="h-40 w-full rounded-[var(--radius)]" />
      </div>
      
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[var(--radius)] border bg-card p-6 h-[435px]">
          <div className="space-y-2 mb-8">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-3 w-64" />
          </div>
          <Skeleton className="h-[300px] w-full" />
        </div>
        <div className="rounded-[var(--radius)] border bg-card p-6 h-[435px]">
          <div className="space-y-2 mb-8">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-3 w-64" />
          </div>
          <Skeleton className="h-[300px] w-full" />
        </div>
      </div>
    </div>
  );
}
