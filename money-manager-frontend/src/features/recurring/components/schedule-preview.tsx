"use client";

import { RecurringFrequency } from "@/types/recurring";
import { formatDate } from "@/utils/format";
import { Info } from "lucide-react";

interface SchedulePreviewProps {
  frequency: RecurringFrequency;
  startDate: string;
}

export function SchedulePreview({ frequency, startDate }: SchedulePreviewProps) {
  if (!startDate) return null;

  const getNextDate = (start: string, freq: RecurringFrequency) => {
    const d = new Date(start);
    if (isNaN(d.getTime())) return null;

    switch (freq) {
      case "daily": d.setDate(d.getDate() + 1); break;
      case "weekly": d.setDate(d.getDate() + 7); break;
      case "monthly": d.setMonth(d.getMonth() + 1); break;
      case "yearly": d.setFullYear(d.getFullYear() + 1); break;
    }
    return d;
  };

  const nextDate = getNextDate(startDate, frequency);

  return (
    <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/10">
      <Info className="size-5 text-primary shrink-0 mt-0.5" />
      <div className="space-y-1">
        <p className="text-sm font-medium text-primary">Automation Schedule</p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          This transaction will start on <span className="font-semibold text-foreground">{formatDate(startDate)}</span> and 
          repeat <span className="font-semibold text-foreground">{frequency}</span>. 
          {nextDate && (
            <> The first automated execution will occur on <span className="font-semibold text-foreground">{formatDate(nextDate)}</span>.</>
          )}
        </p>
      </div>
    </div>
  );
}
