"use client";

import { Card } from "@/components/ui/card";
import { CategorySpending } from "@/types/dashboard";
import { formatCurrency, formatPercent } from "@/utils/format";
import { cn } from "@/lib/utils";

interface CategoryBreakdownProps {
  categories: CategorySpending[];
  isLoading?: boolean;
}

export function CategoryBreakdown({ categories, isLoading }: CategoryBreakdownProps) {
  if (isLoading) {
    return (
      <Card className="p-6 space-y-6 animate-pulse">
        <div className="h-6 w-48 bg-muted rounded" />
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="size-8 bg-muted rounded" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-full bg-muted rounded" />
                <div className="h-2 w-full bg-muted rounded" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold tracking-tight">Spending Breakdown</h3>
        <span className="text-xs text-muted-foreground">Current Month</span>
      </div>

      <div className="space-y-6">
        {categories.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center text-muted-foreground">
            <p className="text-sm">No spending data available</p>
          </div>
        ) : (
          categories.map((item, index) => (
            <div key={item.id} className="group">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "size-2 rounded-full",
                    index === 0 ? "bg-primary" : 
                    index === 1 ? "bg-primary/80" :
                    index === 2 ? "bg-primary/60" : "bg-primary/40"
                  )} />
                  <span className="text-sm font-medium">{item.name}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-sm font-bold">{formatCurrency(item.amount)}</span>
                  <span className="text-[10px] text-muted-foreground">{formatPercent(item.percentage)}</span>
                </div>
              </div>
              <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
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
