import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  description: string;
  icon: LucideIcon;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({ title, description, icon: Icon, action, className }: EmptyStateProps) {
  return (
    <div className={cn(
      "flex min-h-[400px] flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-500",
      className
    )}>
      <div className="size-20 rounded-3xl bg-accent/50 flex items-center justify-center mb-6">
        <Icon className="size-10 text-muted-foreground/50" />
      </div>
      <div className="space-y-2 mb-8">
        <h3 className="text-xl font-bold tracking-tight">{title}</h3>
        <p className="text-muted-foreground max-w-sm mx-auto leading-relaxed">
          {description}
        </p>
      </div>
      {action && (
        <Button 
          onClick={action.onClick} 
          className="rounded-xl h-11 px-8 shadow-lg shadow-primary/10 active:scale-95 transition-all"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}
