import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CategoryIssue {
  category: string;
  frequency: number;
  severity: "high" | "medium" | "low";
}

interface CategoryHeatmapProps {
  data: CategoryIssue[];
}

export function CategoryHeatmap({ data }: CategoryHeatmapProps) {
  const getIntensityClass = (frequency: number) => {
    if (frequency >= 10) return "bg-status-critical text-status-critical-foreground";
    if (frequency >= 5) return "bg-status-high text-status-high-foreground";
    if (frequency >= 3) return "bg-status-medium text-status-medium-foreground";
    return "bg-status-low text-status-low-foreground";
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "bg-status-high";
      case "medium": return "bg-status-medium";
      case "low": return "bg-status-low";
      default: return "bg-muted";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recurring Issues Heatmap</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.map((item, index) => (
            <div 
              key={index} 
              className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
            >
              <div className="flex-1">
                <p className="font-medium">{item.category}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className={getSeverityColor(item.severity)}>
                    {item.severity.toUpperCase()}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Occurred {item.frequency} times
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className={`px-4 py-2 rounded-lg font-bold ${getIntensityClass(item.frequency)}`}>
                  {item.frequency}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
