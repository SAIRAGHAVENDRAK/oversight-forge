import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import * as Icons from "lucide-react";
import { KPIMetric } from "@/types/audit";

interface KPICardProps {
  metric: KPIMetric;
}

export function KPICard({ metric }: KPICardProps) {
  const IconComponent = (Icons as any)[metric.icon] || Icons.Activity;

  const trendIcon = {
    up: <TrendingUp className="h-3 w-3 text-status-low" />,
    down: <TrendingDown className="h-3 w-3 text-status-high" />,
    stable: <Minus className="h-3 w-3 text-muted-foreground" />,
  };

  const colorMap: Record<string, string> = {
    critical: "text-status-critical",
    high: "text-status-high",
    medium: "text-status-medium",
    low: "text-status-low",
    info: "text-status-info",
  };

  return (
    <Card className="p-6 hover:shadow-md transition-all">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-1">{metric.label}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">{metric.value}</span>
            {metric.unit && <span className="text-sm text-muted-foreground">{metric.unit}</span>}
          </div>
          {metric.trend && (
            <div className="flex items-center gap-1 mt-2">
              {trendIcon[metric.trend]}
              <span className="text-xs text-muted-foreground">vs last period</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-muted ${colorMap[metric.color] || "text-primary"}`}>
          <IconComponent className="h-6 w-6" />
        </div>
      </div>
    </Card>
  );
}
