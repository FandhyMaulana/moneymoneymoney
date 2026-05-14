"use client";

import { Card } from "@/components/ui/card";
import { formatCurrency, formatPercent } from "@/utils/format";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface SpendingInsightProps {
  categoryName: string;
  amount: number;
  percentage: number;
  totalExpense: number;
}

export function SpendingInsight({ categoryName, amount, percentage, totalExpense }: SpendingInsightProps) {
  return (
    <Card className="p-6 overflow-hidden relative group border-none bg-primary/5">
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold text-primary/60 uppercase tracking-wider">Top Spending Category</span>
        <h3 className="text-2xl font-bold text-primary">{categoryName}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          You spent <span className="font-semibold text-primary">{formatCurrency(amount)}</span> on {categoryName} this month, 
          which accounts for <span className="font-semibold text-primary">{formatPercent(percentage)}</span> of your total monthly expenses.
        </p>
      </div>
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <TrendingUp className="size-24 text-primary" />
      </div>
    </Card>
  );
}
