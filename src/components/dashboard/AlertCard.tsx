import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/types/audit";
import { AlertCircle, AlertTriangle, Info } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface AlertCardProps {
  alert: Alert;
}

export function AlertCard({ alert }: AlertCardProps) {
  const iconMap = {
    critical: <AlertTriangle className="h-4 w-4" />,
    high: <AlertTriangle className="h-4 w-4" />,
    medium: <AlertCircle className="h-4 w-4" />,
    low: <Info className="h-4 w-4" />,
  };

  const variantMap: Record<string, "destructive" | "default" | "secondary" | "outline"> = {
    critical: "destructive",
    high: "destructive",
    medium: "default",
    low: "secondary",
  };

  return (
    <Card className="p-4 hover:shadow-md transition-all">
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 ${
          alert.type === "critical" || alert.type === "high" 
            ? "text-status-high" 
            : alert.type === "medium" 
            ? "text-status-medium" 
            : "text-status-info"
        }`}>
          {iconMap[alert.type]}
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-semibold text-sm">{alert.title}</h4>
            <Badge variant={variantMap[alert.type]} className="shrink-0">
              {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{alert.description}</p>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{alert.affectedItems.length} item(s) affected</span>
            <span>{formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
