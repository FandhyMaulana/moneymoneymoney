import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CardWrapperProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  headerAction?: React.ReactNode;
}

export function CardWrapper({
  title,
  description,
  children,
  footer,
  className,
  headerAction,
}: CardWrapperProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      {(title || description || headerAction) && (
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="space-y-1">
            {title && <CardTitle className="text-lg font-semibold">{title}</CardTitle>}
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          {headerAction}
        </CardHeader>
      )}
      <CardContent>{children}</CardContent>
      {footer && <CardFooter className="bg-muted/50 py-3">{footer}</CardFooter>}
    </Card>
  );
}
