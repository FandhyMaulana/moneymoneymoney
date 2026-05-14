"use client";

import { Card } from "@/components/ui/card";
import { CategorySpending } from "@/types/dashboard";
import { formatCurrency, formatPercentage } from "@/utils/format";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface CategoryBreakdownProps {
  categories: CategorySpending[];
  isLoading?: boolean;
}

export function CategoryBreakdown({ categories, isLoading }: CategoryBreakdownProps) {
  if (isLoading) {
    return (
      <Card className="p-6 space-y-6">
        <Skeleton className="h-6 w-48" />
        <div className="space-y-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-1.5 w-full rounded-full" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 h-full">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-lg font-bold tracking-tight">Spending Breakdown</h3>
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">This Month</span>
      </div>

      <div className="space-y-6">
        {categories.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center text-muted-foreground">
            <p className="text-sm font-medium">No spending data available</p>
          </div>
        ) : (
          categories.map((item, index) => (
            <div key={item.id} className="group">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "size-2.5 rounded-full transition-transform group-hover:scale-125 duration-300",
                    index === 0 ? "bg-primary shadow-[0_0_8px_rgba(124,58,237,0.4)]" : 
                    index === 1 ? "bg-primary/80" :
                    index === 2 ? "bg-primary/60" : "bg-primary/40"
                  )} />
                  <span className="text-sm font-bold tracking-tight">{item.name}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-sm font-black financial-data">{formatCurrency(item.amount)}</span>
                  <span className="text-[10px] font-bold text-muted-foreground financial-data">{formatPercentage(item.percentage)}</span>
                </div>
              </div>
              <div className="h-1.5 w-full bg-secondary/30 rounded-full overflow-hidden">
                <div 
                  className={cn(
                    "h-full transition-all duration-1000 ease-out",
                    index === 0 ? "bg-primary" : 
                    index === 1 ? "bg-primary/80" :
                    index === 2 ? "bg-primary/60" : "bg-primary/40"
                  )}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
