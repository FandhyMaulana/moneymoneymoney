"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/format";
import { LucideIcon } from "lucide-react";

interface SummaryCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  isLoading?: boolean;
}

import { Skeleton } from "@/components/ui/skeleton";

export function SummaryCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  className,
  isLoading,
}: SummaryCardProps) {
  if (isLoading) {
    return (
      <Card className={cn("p-6 space-y-4", className)}>
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="size-10 rounded-xl" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-3 w-40" />
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn("p-6 group hover:shadow-lg transition-all duration-300", className)}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{title}</span>
        <div className="size-10 flex items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-300 shadow-sm shadow-primary/5">
          <Icon className="size-5" />
        </div>
      </div>
      
      <div className="space-y-1">
        <h3 className="text-3xl font-black tracking-tight financial-data">
          {formatCurrency(value)}
        </h3>
        
        {description && (
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-2">
            {trend && (
              <span className={cn(
                "font-bold",
                trend.isPositive ? "text-emerald-500" : "text-rose-500"
              )}>
                {trend.isPositive ? "+" : ""}{trend.value}%
              </span>
            )}
            <span className="opacity-70">{description}</span>
          </p>
        )}
      </div>
    </Card>
  );
}
