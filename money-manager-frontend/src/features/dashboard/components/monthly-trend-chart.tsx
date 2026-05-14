"use client";

import { Card } from "@/components/ui/card";
import { 
  Area, 
  AreaChart, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis,
  CartesianGrid 
} from "recharts";
import { formatCurrency } from "@/utils/format";

interface MonthlyTrendChartProps {
  data: {
    name: string;
    income: number;
    expense: number;
  }[];
  isLoading?: boolean;
}

import { AnalyticsChartCard } from "@/features/analytics/components/analytics-chart-card";
import { Skeleton } from "@/components/ui/skeleton";

export function MonthlyTrendChart({ data, isLoading }: MonthlyTrendChartProps) {
  if (isLoading) {
    return (
      <Card className="p-6 h-[435px]">
        <div className="space-y-2 mb-8">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-3 w-32" />
        </div>
        <Skeleton className="h-[300px] w-full" />
      </Card>
    );
  }

  return (
    <AnalyticsChartCard
      title="Financial Trend"
      subtitle="Monthly income vs expenses"
      height="h-[300px]"
      rightElement={
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="size-2 rounded-full bg-primary" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Income</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="size-2 rounded-full bg-rose-500" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Expense</span>
          </div>
        </div>
      }
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis 
            dataKey="name" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
            dy={10}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-2xl border bg-background/90 p-4 shadow-2xl backdrop-blur-xl ring-1 ring-white/10">
                    <p className="text-[10px] font-bold text-muted-foreground mb-3 uppercase tracking-widest">
                      {payload[0].payload.name}
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-12">
                        <span className="text-xs font-medium text-muted-foreground">Income</span>
                        <span className="text-xs font-black text-primary financial-data">
                          {formatCurrency(payload[0].value as number)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-12">
                        <span className="text-xs font-medium text-muted-foreground">Expense</span>
                        <span className="text-xs font-black text-rose-500 financial-data">
                          {formatCurrency(payload[1].value as number)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Area
            type="monotone"
            dataKey="income"
            stroke="var(--primary)"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorIncome)"
          />
          <Area
            type="monotone"
            dataKey="expense"
            stroke="#ef4444"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorExpense)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </AnalyticsChartCard>
  );
}
