"use client";

import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from "recharts";
import { formatCurrency } from "@/utils/format";

interface TrendData {
  name: string;
  income: number;
  expense: number;
  savings: number;
}

interface MonthlyTrendLineChartProps {
  data: TrendData[];
}

export function MonthlyTrendLineChart({ data }: MonthlyTrendLineChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
        <XAxis 
          dataKey="name" 
          axisLine={false}
          tickLine={false}
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 700 }}
          dy={10}
        />
        <YAxis 
          axisLine={false}
          tickLine={false}
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 700 }}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-2xl border bg-background/90 p-4 shadow-2xl backdrop-blur-xl ring-1 ring-white/10 min-w-[180px]">
                  <p className="text-[10px] font-bold text-muted-foreground mb-3 uppercase tracking-widest">
                    {payload[0].payload.name} Report
                  </p>
                  <div className="space-y-2">
                    {payload.map((entry: any) => (
                      <div key={entry.dataKey} className="flex items-center justify-between gap-8">
                        <div className="flex items-center gap-2">
                          <div className="size-2 rounded-full" style={{ backgroundColor: entry.color }} />
                          <span className="text-xs font-medium text-muted-foreground capitalize">{entry.name}</span>
                        </div>
                        <span className="text-xs font-black financial-data" style={{ color: entry.color }}>
                          {formatCurrency(entry.value as number)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }
            return null;
          }}
        />
        <Legend 
          verticalAlign="top" 
          align="right"
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ paddingBottom: '20px' }}
          formatter={(value) => (
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">
              {value}
            </span>
          )}
        />
        <Line
          type="monotone"
          dataKey="income"
          stroke="hsl(var(--primary))"
          strokeWidth={3}
          dot={false}
          activeDot={{ r: 6, strokeWidth: 0, fill: 'hsl(var(--primary))' }}
          name="income"
        />
        <Line
          type="monotone"
          dataKey="expense"
          stroke="#ef4444"
          strokeWidth={3}
          dot={false}
          activeDot={{ r: 6, strokeWidth: 0, fill: '#ef4444' }}
          name="expense"
        />
        <Line
          type="monotone"
          dataKey="savings"
          stroke="#10b981"
          strokeWidth={3}
          dot={false}
          activeDot={{ r: 6, strokeWidth: 0, fill: '#10b981' }}
          name="savings"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
