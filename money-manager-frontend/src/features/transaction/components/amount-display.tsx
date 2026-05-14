import { TransactionType } from "@/types";
import { formatCurrency } from "@/utils/format";
import { cn } from "@/lib/utils";

interface AmountDisplayProps {
  amount: number;
  type: TransactionType;
  className?: string;
  showSign?: boolean;
}

export function AmountDisplay({ amount, type, className, showSign = true }: AmountDisplayProps) {
  const isNegative = type === "expense";
  const isPositive = type === "income";
  
  return (
    <span className={cn(
      "font-semibold tabular-nums",
      isPositive && "text-green-500",
      isNegative && "text-red-500",
      type === "transfer" && "text-blue-500",
      className
    )}>
      {showSign && isPositive && "+"}
      {showSign && isNegative && "-"}
      {formatCurrency(amount)}
    </span>
  );
}
