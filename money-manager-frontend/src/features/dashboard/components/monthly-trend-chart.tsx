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

export function MonthlyTrendChart({ data, isLoading }: MonthlyTrendChartProps) {
  if (isLoading) {
    return (
      <Card className="p-6 h-[400px] animate-pulse">
        <div className="h-6 w-48 bg-muted rounded mb-8" />
        <div className="h-[300px] w-full bg-muted/50 rounded" />
      </Card>
    );
  }

  return (
    <Card className="p-6 h-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-lg font-semibold tracking-tight">Financial Trend</h3>
          <p className="text-xs text-muted-foreground">Monthly income vs expenses</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="size-2 rounded-full bg-primary" />
            <span className="text-[10px] font-medium text-muted-foreground">Income</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="size-2 rounded-full bg-red-500" />
            <span className="text-[10px] font-medium text-muted-foreground">Expense</span>
          </div>
        </div>
      </div>

      <div className="h-[300px] w-full">
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
                    <div className="rounded-lg border bg-background p-3 shadow-xl backdrop-blur-md">
                      <p className="text-[10px] font-bold text-muted-foreground mb-2 uppercase tracking-wider">
                        {payload[0].payload.name}
                      </p>
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-8">
                          <span className="text-xs text-muted-foreground">Income</span>
                          <span className="text-xs font-bold text-primary">
                            {formatCurrency(payload[0].value as number)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-8">
                          <span className="text-xs text-muted-foreground">Expense</span>
                          <span className="text-xs font-bold text-red-500">
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
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorIncome)"
            />
            <Area
              type="monotone"
              dataKey="expense"
              stroke="#ef4444"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorExpense)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
