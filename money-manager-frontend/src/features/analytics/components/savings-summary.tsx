"use client";

import { Card } from "@/components/ui/card";
import { formatCurrency, formatPercent } from "@/utils/format";
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
    <Card className="p-6 overflow-hidden relative group border-none bg-emerald-500/5">
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold text-emerald-600/60 uppercase tracking-wider">Net Savings</span>
        <h3 className={cn(
          "text-2xl font-bold",
          isPositive ? "text-emerald-600" : "text-rose-600"
        )}>
          {formatCurrency(savings)}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Your savings rate this month is <span className="font-semibold text-emerald-600">{formatPercent(savingsRate)}</span>. 
          {isPositive 
            ? " Great job! You are living within your means." 
            : " You spent more than you earned this month."}
        </p>
      </div>
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <PiggyBank className="size-24 text-emerald-600" />
      </div>
    </Card>
  );
}
