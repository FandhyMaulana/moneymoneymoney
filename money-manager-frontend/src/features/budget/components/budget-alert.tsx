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
      "flex items-center gap-3 p-4 rounded-xl border animate-in fade-in slide-in-from-top-2 duration-300",
      type === 'warning' 
        ? "bg-amber-500/5 border-amber-500/20 text-amber-700" 
        : "bg-rose-500/5 border-rose-500/20 text-rose-700"
    )}>
      {type === 'warning' ? (
        <AlertTriangle className="h-5 w-5 shrink-0" />
      ) : (
        <AlertCircle className="h-5 w-5 shrink-0" />
      )}
      <p className="text-sm font-medium leading-relaxed">
        {message}
      </p>
    </div>
  );
}
