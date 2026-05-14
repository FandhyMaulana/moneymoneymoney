"use client";

import { cn } from "@/lib/utils";

interface BudgetProgressProps {
  percentage: number;
  status: 'safe' | 'warning' | 'exceeded';
  className?: string;
}

export function BudgetProgress({ percentage, status, className }: BudgetProgressProps) {
  // Clamp percentage for display
  const displayPercentage = Math.min(Math.max(percentage, 0), 100);

  const statusColors = {
    safe: "bg-emerald-500",
    warning: "bg-amber-500",
    exceeded: "bg-rose-500",
  };

  return (
    <div className={cn("w-full h-2 bg-secondary rounded-full overflow-hidden", className)}>
      <div
        className={cn(
          "h-full transition-all duration-500 ease-in-out rounded-full",
          statusColors[status]
        )}
        style={{ width: `${displayPercentage}%` }}
      />
    </div>
  );
}
