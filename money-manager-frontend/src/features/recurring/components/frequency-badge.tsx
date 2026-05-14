"use client";

import { cn } from "@/lib/utils";
import { RecurringFrequency } from "@/types/recurring";
import { RefreshCw, CalendarDays, CalendarRange, CalendarDays as CalendarYear } from "lucide-react";

interface FrequencyBadgeProps {
  frequency: RecurringFrequency;
  className?: string;
}

export function FrequencyBadge({ frequency, className }: FrequencyBadgeProps) {
  const config = {
    daily: { label: "Every day", icon: RefreshCw },
    weekly: { label: "Every week", icon: CalendarDays },
    monthly: { label: "Every month", icon: CalendarRange },
    yearly: { label: "Every year", icon: CalendarYear },
  };

  const { label, icon: Icon } = config[frequency];

  return (
    <div className={cn(
      "inline-flex items-center gap-1.5 text-xs text-muted-foreground",
      className
    )}>
      <Icon className="size-3.5" />
      <span>{label}</span>
    </div>
  );
}
