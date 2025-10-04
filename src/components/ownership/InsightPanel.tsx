import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, AlertTriangle, Lightbulb, TrendingUp, Mail } from "lucide-react";

interface Insight {
  type: "performer" | "attention" | "action";
  title: string;
  description: string;
  severity?: "high" | "medium" | "low";
  actionable?: boolean;
}

interface InsightPanelProps {
  topPerformers: Array<{ name: string; score: number }>;
  needsAttention: Array<{ name: string; overdueRate: number }>;
  suggestedActions: Array<{ action: string; priority: "high" | "medium" | "low" }>;
}

export function InsightPanel({ topPerformers, needsAttention, suggestedActions }: InsightPanelProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-status-high";
      case "medium": return "bg-status-medium";
      case "low": return "bg-status-info";
      default: return "bg-muted";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Top Performers */}
      <Card className="border-status-low">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Trophy className="h-5 w-5 text-status-low" />
            Top Performers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topPerformers.map((performer, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-3 rounded-lg bg-status-low/10 border border-status-low/20 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-status-low text-white flex items-center justify-center font-bold text-sm">
                    #{index + 1}
                  </div>
                  <span className="font-medium">{performer.name}</span>
                </div>
                <Badge className="bg-status-low">{performer.score}%</Badge>
              </div>
            ))}
            {topPerformers.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No top performers identified yet
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Needs Attention */}
      <Card className="border-status-high">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-status-high" />
            Needs Attention
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {needsAttention.map((item, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-3 rounded-lg bg-status-high/10 border border-status-high/20 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.overdueRate}% overdue rate
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  <Mail className="h-3 w-3 mr-1" />
                  Remind
                </Button>
              </div>
            ))}
            {needsAttention.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                All teams performing well
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Suggested Actions */}
      <Card className="border-accent">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-accent" />
            Suggested Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {suggestedActions.map((action, index) => (
              <div 
                key={index} 
                className="p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start gap-2">
                  <Badge className={getPriorityColor(action.priority)}>
                    {action.priority.toUpperCase()}
                  </Badge>
                  <p className="text-sm flex-1">{action.action}</p>
                </div>
              </div>
            ))}
            {suggestedActions.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No immediate actions required
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
