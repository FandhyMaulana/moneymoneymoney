"use client";

import { cn } from "@/lib/utils";
import { Play, Pause } from "lucide-react";

interface RecurringStatusBadgeProps {
  isActive: boolean;
  className?: string;
}

export function RecurringStatusBadge({ isActive, className }: RecurringStatusBadgeProps) {
  return (
    <div className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium",
      isActive 
        ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" 
        : "bg-amber-500/10 text-amber-600 border border-amber-500/20",
      className
    )}>
      {isActive ? (
        <>
          <Play className="size-3 fill-current" />
          Active
        </>
      ) : (
        <>
          <Pause className="size-3 fill-current" />
          Paused
        </>
      )}
    </div>
  );
}
