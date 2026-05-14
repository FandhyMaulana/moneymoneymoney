"use client";

import { Card } from "@/components/ui/card";
import { formatCurrency, formatPercentage } from "@/utils/format";
import { PiggyBank } from "lucide-react";
import { cn } from "@/lib/utils";

interface SavingsSummaryProps {
  income: number;
  expense: number;
  savings: number;
}

export function SavingsSummary({ income, expense, savings }: SavingsSummaryProps) {
  const savingsRate = income > 0 ? (savings / income) * 100 : 0;
  const isPositive = savings >= 0;

  return (
    <Card className="p-8 overflow-hidden relative group border-none bg-emerald-500/5 shadow-inner">
      <div className="flex flex-col gap-3 relative z-10">
        <div className="flex items-center gap-2">
          <PiggyBank className="size-4 text-emerald-600" />
          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest opacity-70">Monthly Savings Efficiency</span>
        </div>
        <h3 className={cn(
          "text-4xl font-black tracking-tighter financial-data",
          isPositive ? "text-emerald-600" : "text-rose-600"
        )}>
          {formatCurrency(savings)}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
          Your savings efficiency this month is <span className="font-black text-emerald-600 financial-data">{formatPercentage(savingsRate)}</span>. 
          {isPositive 
            ? " Excellent financial discipline! You're building wealth effectively." 
            : " You've utilized your reserves this month. Consider reviewing your variable expenses."}
        </p>
      </div>
      <div className="absolute -bottom-6 -right-6 p-4 opacity-5 group-hover:opacity-10 transition-opacity duration-700 active:scale-95">
        <PiggyBank className="size-48 text-emerald-600" />
      </div>
    </Card>
  );
}
