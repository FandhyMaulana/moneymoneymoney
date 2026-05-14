"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function RecurringCardSkeleton() {
  return (
    <Card className="p-6">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <Skeleton className="size-12 rounded-2xl" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="size-8 rounded-full" />
          </div>
        </div>

        <div className="flex items-end justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="space-y-2 text-right">
            <Skeleton className="h-3 w-24 ml-auto" />
            <Skeleton className="h-5 w-28 ml-auto" />
          </div>
        </div>
      </div>
    </Card>
  );
}

export function RecurringSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <RecurringCardSkeleton key={i} />
      ))}
    </div>
  );
}
