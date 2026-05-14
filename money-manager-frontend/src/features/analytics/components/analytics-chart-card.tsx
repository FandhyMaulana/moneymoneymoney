"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface AnalyticsChartCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  rightElement?: ReactNode;
}

export function AnalyticsChartCard({
  title,
  subtitle,
  children,
  className,
  rightElement,
}: AnalyticsChartCardProps) {
  return (
    <Card className={cn("p-6 flex flex-col gap-6", className)}>
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-primary leading-none tracking-tight">
            {title}
          </h3>
          {subtitle && (
            <p className="text-sm text-muted-foreground">
              {subtitle}
            </p>
          )}
        </div>
        {rightElement}
      </div>
      <div className="flex-1 min-h-[300px] w-full">
        {children}
      </div>
    </Card>
  );
}
