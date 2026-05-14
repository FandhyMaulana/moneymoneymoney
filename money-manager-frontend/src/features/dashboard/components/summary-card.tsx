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
      <Card className={cn("p-6 space-y-4 animate-pulse", className)}>
        <div className="flex items-center justify-between">
          <div className="h-4 w-24 bg-muted rounded" />
          <div className="size-10 bg-muted rounded-xl" />
        </div>
        <div className="space-y-2">
          <div className="h-8 w-32 bg-muted rounded" />
          <div className="h-3 w-40 bg-muted rounded" />
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn("p-6 group hover:shadow-lg transition-all duration-300", className)}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        <div className="size-10 flex items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-300">
          <Icon className="size-5" />
        </div>
      </div>
      
      <div className="space-y-1">
        <h3 className="text-2xl font-bold tracking-tight">
          {formatCurrency(value)}
        </h3>
        
        {description && (
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            {trend && (
              <span className={cn(
                "font-medium",
                trend.isPositive ? "text-green-500" : "text-red-500"
              )}>
                {trend.isPositive ? "+" : "-"}{trend.value}%
              </span>
            )}
            {description}
          </p>
        )}
      </div>
    </Card>
  );
}
