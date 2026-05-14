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
    safe: "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]",
    warning: "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.3)]",
    exceeded: "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.3)]",
  };

  return (
    <div className={cn("w-full h-3 bg-secondary/30 rounded-full overflow-hidden p-[2px] ring-1 ring-inset ring-foreground/5", className)}>
      <div
        className={cn(
          "h-full transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] rounded-full",
          statusColors[status]
        )}
        style={{ width: `${displayPercentage}%` }}
      />
    </div>
  );
}
