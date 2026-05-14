import { TransactionType } from "@/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ArrowUpCircle, ArrowDownCircle, ArrowRightLeft } from "lucide-react";

interface TransactionTypeBadgeProps {
  type: TransactionType;
  className?: string;
}

export function TransactionTypeBadge({ type, className }: TransactionTypeBadgeProps) {
  const config = {
    income: {
      label: "Income",
      icon: ArrowUpCircle,
      className: "bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20",
    },
    expense: {
      label: "Expense",
      icon: ArrowDownCircle,
      className: "bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20",
    },
    transfer: {
      label: "Transfer",
      icon: ArrowRightLeft,
      className: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20",
    },
  };

  const { label, icon: Icon, className: variantClassName } = config[type];

  return (
    <Badge variant="outline" className={cn("gap-1.5 font-medium", variantClassName, className)}>
      <Icon className="size-3.5" />
      {label}
    </Badge>
  );
}
