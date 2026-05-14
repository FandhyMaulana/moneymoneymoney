"use client";

import { Card } from "@/components/ui/card";
import { BudgetDetail } from "@/types/budget";
import { formatCurrency, formatPercentage } from "@/utils/format";
import { BudgetProgress } from "./budget-progress";
import { cn } from "@/lib/utils";

interface BudgetCardProps {
  budget: BudgetDetail;
}

export function BudgetCard({ budget }: BudgetCardProps) {
  const isExceeded = budget.status === 'exceeded';
  const isWarning = budget.status === 'warning';

  return (
    <Card className="p-6 hover:shadow-xl transition-all duration-300 group border-none bg-accent/5 overflow-hidden relative">
      <div className={cn(
        "absolute top-0 left-0 w-1 h-full",
        budget.status === 'safe' && "bg-emerald-500",
        budget.status === 'warning' && "bg-amber-500",
        budget.status === 'exceeded' && "bg-rose-500",
      )} />
      
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="text-xl font-black tracking-tight text-primary leading-none">{budget.category_name}</h3>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Monthly Budget Cap
            </p>
          </div>
          <div className={cn(
            "text-xs font-black px-3 py-1 rounded-full financial-data shadow-sm",
            budget.status === 'safe' && "bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/20",
            budget.status === 'warning' && "bg-amber-500/10 text-amber-600 ring-1 ring-amber-500/20",
            budget.status === 'exceeded' && "bg-rose-500/10 text-rose-600 ring-1 ring-rose-500/20",
          )}>
            {formatPercentage(budget.percentage)}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-end mb-1">
            <span className="text-2xl font-black financial-data leading-none">{formatCurrency(budget.spent)}</span>
            <span className="text-xs font-bold text-muted-foreground">of {formatCurrency(budget.budget_limit)}</span>
          </div>
          <BudgetProgress percentage={budget.percentage} status={budget.status} />
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-muted-foreground/10">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Availability</span>
          <span className={cn(
            "text-sm font-black financial-data",
            isExceeded ? "text-rose-600" : "text-emerald-600"
          )}>
            {isExceeded ? "OVER BUDGET" : formatCurrency(budget.remaining)}
          </span>
        </div>
      </div>
    </Card>
  );
}
