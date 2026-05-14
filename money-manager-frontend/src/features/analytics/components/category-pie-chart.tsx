"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { CategorySpending } from "@/types/analytics";
import { formatCurrency, formatPercentage } from "@/utils/format";

interface CategoryPieChartProps {
  data: CategorySpending[];
}

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--primary) / 0.8)",
  "hsl(var(--primary) / 0.6)",
  "hsl(var(--primary) / 0.4)",
  "hsl(var(--primary) / 0.2)",
];

export function CategoryPieChart({ data }: CategoryPieChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-3">
        <div className="size-12 rounded-2xl bg-muted/50 flex items-center justify-center">
          <PieChart className="size-6 opacity-20" />
        </div>
        <p className="text-sm font-medium">No spending data available</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="45%"
          innerRadius={70}
          outerRadius={100}
          paddingAngle={8}
          dataKey="amount"
          nameKey="name"
          animationDuration={1500}
        >
          {data.map((_, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={COLORS[index % COLORS.length]} 
              stroke="transparent"
              className="outline-none"
            />
          ))}
        </Pie>
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const item = payload[0].payload as CategorySpending;
              return (
                <div className="rounded-2xl border bg-background/90 p-4 shadow-2xl backdrop-blur-xl ring-1 ring-white/10 min-w-[160px]">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="size-2.5 rounded-full" style={{ backgroundColor: payload[0].payload.fill }} />
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      {item.name}
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-lg font-black financial-data leading-none">
                      {formatCurrency(item.amount)}
                    </p>
                    <p className="text-[10px] font-bold text-primary financial-data">
                      {formatPercentage(item.percentage)} of total
                    </p>
                  </div>
                </div>
              );
            }
            return null;
          }}
        />
        <Legend 
          verticalAlign="bottom" 
          align="center"
          iconType="circle"
          iconSize={8}
          formatter={(value, entry: any) => (
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">
              {value} <span className="text-primary/70 ml-1">({formatPercentage(entry.payload.percentage)})</span>
            </span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
