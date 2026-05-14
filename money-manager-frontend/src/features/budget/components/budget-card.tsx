"use client";

import { Card } from "@/components/ui/card";
import { BudgetDetail } from "@/types/budget";
import { formatCurrency, formatPercent } from "@/utils/format";
import { BudgetProgress } from "./budget-progress";
import { cn } from "@/lib/utils";

interface BudgetCardProps {
  budget: BudgetDetail;
}

export function BudgetCard({ budget }: BudgetCardProps) {
  const isExceeded = budget.status === 'exceeded';
  const isWarning = budget.status === 'warning';

  return (
    <Card className="p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-primary">{budget.category_name}</h3>
            <p className="text-sm text-muted-foreground">
              {formatCurrency(budget.spent)} of {formatCurrency(budget.budget_limit)}
            </p>
          </div>
          <div className={cn(
            "text-sm font-medium px-2.5 py-0.5 rounded-full",
            budget.status === 'safe' && "bg-emerald-500/10 text-emerald-600",
            budget.status === 'warning' && "bg-amber-500/10 text-amber-600",
            budget.status === 'exceeded' && "bg-rose-500/10 text-rose-600",
          )}>
            {formatPercent(budget.percentage)}
          </div>
        </div>

        <BudgetProgress percentage={budget.percentage} status={budget.status} />

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Remaining</span>
          <span className={cn(
            "font-medium",
            isExceeded ? "text-rose-600" : "text-primary"
          )}>
            {isExceeded ? "Exceeded" : formatCurrency(budget.remaining)}
          </span>
        </div>
      </div>
    </Card>
  );
}
