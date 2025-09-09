
import { cn } from "@/lib/utils";

interface AnalyticsCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon?: React.ReactNode;
  className?: string;
}

export function AnalyticsCard({ 
  title, 
  value, 
  change, 
  trend, 
  icon,
  className 
}: AnalyticsCardProps) {
  return (
    <div className={cn("rounded-lg border bg-card p-4", className)}>
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{title}</p>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>
      <div className="flex items-baseline gap-2 mt-1">
        <h3 className="text-2xl font-bold">{value}</h3>
        {change && (
          <p className={cn(
            "text-xs",
            trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-muted-foreground"
          )}>
            {change}
          </p>
        )}
      </div>
    </div>
  );
}
