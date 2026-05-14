"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function AnalyticsSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2">
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-32 w-full rounded-2xl" />
      </div>
      
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6 h-[400px]">
          <div className="space-y-2 mb-8">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-full w-full rounded-xl" />
        </Card>
        <Card className="p-6 h-[400px]">
          <div className="space-y-2 mb-8">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-full w-full rounded-xl" />
        </Card>
      </div>
    </div>
  );
}
