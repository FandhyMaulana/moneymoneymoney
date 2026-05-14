"use client";

import { Card } from "@/components/ui/card";
import { CategorySpending } from "@/types/dashboard";
import { formatCurrency, formatPercentage } from "@/utils/format";
import { TrendingUp, PieChart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface TopExpenseCardProps {
  category: CategorySpending | null;
  isLoading?: boolean;
}

export function TopExpenseCard({ category, isLoading }: TopExpenseCardProps) {
  if (isLoading) {
    return (
      <Card className="p-6 h-full">
        <div className="flex items-center gap-2 mb-6">
          <Skeleton className="size-4" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex items-center gap-4 mb-6">
          <Skeleton className="size-14 rounded-2xl" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <div className="mt-auto space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-2 w-full rounded-full" />
          </div>
        </div>
      </Card>
    );
  }

  if (!category) {
    return (
      <Card className="p-6 h-full flex flex-col items-center justify-center text-center">
        <div className="size-16 rounded-3xl bg-accent/50 flex items-center justify-center mb-6">
          <PieChart className="size-8 text-muted-foreground/50" />
        </div>
        <div className="space-y-2">
          <h4 className="text-lg font-bold tracking-tight">No spending insights</h4>
          <p className="text-sm text-muted-foreground max-w-[200px] leading-relaxed">
            Start tracking expenses to see your top category.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 h-full relative overflow-hidden group hover:shadow-xl transition-all duration-500">
      <div className="absolute -right-4 -top-4 size-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
      
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="size-4 text-primary" />
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Top Spending</span>
        </div>

        <div className="flex items-center gap-4 mb-8">
          <div className="size-14 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20 ring-4 ring-primary/5">
            <span className="text-2xl font-black tracking-tighter">{category.name.charAt(0)}</span>
          </div>
          <div>
            <h3 className="text-xl font-black tracking-tight leading-none mb-1">{category.name}</h3>
            <p className="text-xs text-muted-foreground font-medium">Primary Expense Category</p>
          </div>
        </div>

        <div className="mt-auto space-y-5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground font-medium">Total Spent</span>
            <span className="font-black financial-data text-lg">{formatCurrency(category.amount)}</span>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground font-medium">Budget Share</span>
              <span className="font-black text-primary financial-data">{formatPercentage(category.percentage)}</span>
            </div>
            <div className="h-2 w-full bg-secondary/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(124,58,237,0.4)]"
                style={{ width: `${category.percentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
