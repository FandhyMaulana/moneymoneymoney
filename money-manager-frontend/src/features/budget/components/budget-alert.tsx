"use client";

import { AlertCircle, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface BudgetAlertProps {
  message: string;
  type: 'warning' | 'exceeded';
}

export function BudgetAlert({ message, type }: BudgetAlertProps) {
  return (
    <div className={cn(
      "flex items-center gap-4 p-5 rounded-[var(--radius)] border-l-4 animate-in fade-in slide-in-from-top-4 duration-500 shadow-sm",
      type === 'warning' 
        ? "bg-amber-500/5 border-amber-500/50 text-amber-900 dark:text-amber-200" 
        : "bg-rose-500/5 border-rose-500/50 text-rose-900 dark:text-rose-200"
    )}>
      <div className={cn(
        "size-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm",
        type === 'warning' ? "bg-amber-500/10" : "bg-rose-500/10"
      )}>
        {type === 'warning' ? (
          <AlertTriangle className="size-5" />
        ) : (
          <AlertCircle className="size-5" />
        )}
      </div>
      <div className="flex-1">
        <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-0.5">
          {type === 'warning' ? 'Budget Warning' : 'Limit Exceeded'}
        </p>
        <p className="text-sm font-black tracking-tight leading-none">
          {message}
        </p>
      </div>
    </div>
  );
}
