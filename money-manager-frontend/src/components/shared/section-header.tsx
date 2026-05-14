import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

export function SectionHeader({ title, description, children, className }: SectionHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between", className)}>
      <div className="space-y-1.5">
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl text-foreground">{title}</h1>
        {description && (
          <p className="text-sm font-medium text-muted-foreground max-w-lg leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {children && <div className="flex items-center gap-3">{children}</div>}
    </div>
  );
}
