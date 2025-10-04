import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface DeptMetric {
  department: string;
  performanceScore: number;
  totalFindings: number;
  overdueRate: number;
  onTimeRate: number;
  ownerCount: number;
}

interface DeptHeatmapProps {
  data: DeptMetric[];
}

export function DeptHeatmap({ data }: DeptHeatmapProps) {
  const getHeatColor = (score: number) => {
    if (score >= 80) return "bg-status-low hover:bg-status-low/80";
    if (score >= 60) return "bg-status-info hover:bg-status-info/80";
    if (score >= 40) return "bg-status-medium hover:bg-status-medium/80";
    return "bg-status-high hover:bg-status-high/80";
  };

  const getTextColor = (score: number) => {
    return score >= 40 ? "text-white" : "text-foreground";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Department Accountability Heatmap</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((dept, index) => (
            <TooltipProvider key={dept.department}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div 
                    className={`p-6 rounded-lg transition-all cursor-pointer animate-scale-in ${getHeatColor(dept.performanceScore)}`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className={`space-y-3 ${getTextColor(dept.performanceScore)}`}>
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-sm">{dept.department}</h4>
                        <Badge 
                          variant="outline" 
                          className={`${getTextColor(dept.performanceScore)} border-current`}
                        >
                          {dept.performanceScore}%
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <p className="opacity-80">Findings</p>
                          <p className="font-bold text-lg">{dept.totalFindings}</p>
                        </div>
                        <div>
                          <p className="opacity-80">Owners</p>
                          <p className="font-bold text-lg">{dept.ownerCount}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="space-y-1 text-sm">
                    <p><strong>{dept.department}</strong></p>
                    <p>Performance Score: {dept.performanceScore}%</p>
                    <p>On-Time Rate: {dept.onTimeRate}%</p>
                    <p>Overdue Rate: {dept.overdueRate}%</p>
                    <p>Total Findings: {dept.totalFindings}</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
