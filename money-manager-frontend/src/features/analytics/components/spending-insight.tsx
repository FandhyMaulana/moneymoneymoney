"use client";

import { Card } from "@/components/ui/card";
import { formatCurrency, formatPercentage } from "@/utils/format";
import { TrendingUp } from "lucide-react";

interface SpendingInsightProps {
  categoryName: string;
  amount: number;
  percentage: number;
  totalExpense: number;
}

export function SpendingInsight({ categoryName, amount, percentage }: SpendingInsightProps) {
  return (
    <Card className="p-8 overflow-hidden relative group border-none bg-primary/5 shadow-inner">
      <div className="flex flex-col gap-3 relative z-10">
        <div className="flex items-center gap-2">
          <TrendingUp className="size-4 text-primary" />
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest opacity-70">Top Expenditure Analysis</span>
        </div>
        <h3 className="text-4xl font-black tracking-tighter text-primary">{categoryName}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
          You allocated <span className="font-black text-primary financial-data">{formatCurrency(amount)}</span> to {categoryName} this month, 
          representing <span className="font-black text-primary financial-data">{formatPercentage(percentage)}</span> of your total monthly outflow.
        </p>
      </div>
      <div className="absolute -bottom-6 -right-6 p-4 opacity-5 group-hover:opacity-10 transition-opacity duration-700 active:scale-95">
        <TrendingUp className="size-48 text-primary" />
      </div>
    </Card>
  );
}
