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
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted) / 0.5)" />
        <XAxis 
          dataKey="name" 
          axisLine={false}
          tickLine={false}
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
          dy={10}
        />
        <YAxis 
          axisLine={false}
          tickLine={false}
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--background))",
            borderColor: "hsl(var(--border))",
            borderRadius: "var(--radius)",
            color: "hsl(var(--foreground))",
          }}
          formatter={(value: number) => formatCurrency(value)}
        />
        <Legend 
          verticalAlign="top" 
          align="right"
          height={36}
          iconType="circle"
        />
        <Line
          type="monotone"
          dataKey="income"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, strokeWidth: 0 }}
          name="Income"
        />
        <Line
          type="monotone"
          dataKey="expense"
          stroke="#ef4444"
          strokeWidth={2}
          dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, strokeWidth: 0 }}
          name="Expense"
        />
        <Line
          type="monotone"
          dataKey="savings"
          stroke="#10b981"
          strokeWidth={2}
          dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, strokeWidth: 0 }}
          name="Savings"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
