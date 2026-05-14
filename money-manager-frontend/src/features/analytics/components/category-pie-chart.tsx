"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { CategorySpending } from "@/types/analytics";
import { formatCurrency, formatPercent } from "@/utils/format";

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
      <div className="flex items-center justify-center h-full text-muted-foreground">
        No spending data for this period
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={5}
          dataKey="amount"
          nameKey="name"
          animationDuration={1000}
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="transparent" />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--background))",
            borderColor: "hsl(var(--border))",
            borderRadius: "var(--radius)",
            color: "hsl(var(--foreground))",
          }}
          itemStyle={{ color: "hsl(var(--foreground))" }}
          formatter={(value: any) => formatCurrency(Number(value))}
        />
        <Legend 
          verticalAlign="bottom" 
          height={36}
          formatter={(value, entry: any) => (
            <span className="text-xs font-medium text-muted-foreground ml-1">
              {value} ({formatPercent(entry.payload.percentage)})
            </span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
