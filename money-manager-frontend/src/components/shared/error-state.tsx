import { AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load the data. Please check your connection and try again.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div className={cn(
      "flex min-h-[400px] flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500",
      className
    )}>
      <div className="size-16 rounded-3xl bg-destructive/10 flex items-center justify-center mb-6">
        <AlertCircle className="size-8 text-destructive" />
      </div>
      <div className="space-y-2 mb-8">
        <h3 className="text-xl font-bold tracking-tight">{title}</h3>
        <p className="text-muted-foreground max-w-sm mx-auto leading-relaxed">
          {message}
        </p>
      </div>
      {onRetry && (
        <Button 
          onClick={onRetry} 
          className="rounded-xl h-11 px-8 shadow-lg shadow-primary/10 active:scale-95 transition-all"
        >
          <RefreshCcw className="mr-2 size-4" />
          Retry Connection
        </Button>
      )}
    </div>
  );
}
