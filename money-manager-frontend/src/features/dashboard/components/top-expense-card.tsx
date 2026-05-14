"use client";

import { Card } from "@/components/ui/card";
import { CategorySpending } from "@/types/dashboard";
import { formatCurrency, formatPercent } from "@/utils/format";
import { TrendingUp, PieChart } from "lucide-react";

interface TopExpenseCardProps {
  category: CategorySpending | null;
  isLoading?: boolean;
}

export function TopExpenseCard({ category, isLoading }: TopExpenseCardProps) {
  if (isLoading) {
    return (
      <Card className="p-6 h-full animate-pulse">
        <div className="h-4 w-32 bg-muted rounded mb-6" />
        <div className="flex items-center gap-4">
          <div className="size-12 bg-muted rounded-full" />
          <div className="space-y-2 flex-1">
            <div className="h-6 w-24 bg-muted rounded" />
            <div className="h-4 w-16 bg-muted rounded" />
          </div>
        </div>
      </Card>
    );
  }

  if (!category) {
    return (
      <Card className="p-6 h-full flex flex-col items-center justify-center text-center">
        <div className="size-12 rounded-full bg-accent flex items-center justify-center mb-4">
          <PieChart className="size-6 text-muted-foreground" />
        </div>
        <h4 className="text-sm font-medium">No expenses yet</h4>
        <p className="text-xs text-muted-foreground mt-1">
          Your top category will appear here
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6 h-full relative overflow-hidden group hover:shadow-xl transition-all duration-500">
      <div className="absolute -right-4 -top-4 size-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
      
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="size-4 text-primary" />
          <span className="text-sm font-medium text-muted-foreground">Top Spending</span>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="size-14 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
            <span className="text-xl font-bold">{category.name.charAt(0)}</span>
          </div>
          <div>
            <h3 className="text-xl font-bold tracking-tight">{category.name}</h3>
            <p className="text-sm text-muted-foreground">Main Expense</p>
          </div>
        </div>

        <div className="mt-auto space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total Spent</span>
            <span className="font-bold">{formatCurrency(category.amount)}</span>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Budget Share</span>
              <span className="font-medium text-primary">{formatPercent(category.percentage)}</span>
            </div>
            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-1000 ease-out"
                style={{ width: `${category.percentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
