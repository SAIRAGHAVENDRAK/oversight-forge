import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, TrendingUp, AlertTriangle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface ComparativeInsightsWidgetProps {
  appName: string;
}

export default function ComparativeInsightsWidget({ appName }: ComparativeInsightsWidgetProps) {
  // Mock comparative data
  const overlapData = [
    { name: "New Findings", value: 40, color: "hsl(var(--accent))" },
    { name: "Recurring", value: 30, color: "hsl(var(--status-medium))" },
    { name: "Resolved", value: 30, color: "hsl(var(--status-low))" },
  ];

  const readinessTrend = [
    { audit: "Q4 2022", score: 72 },
    { audit: "Q1 2023", score: 78 },
    { audit: "Q2 2023", score: 82 },
    { audit: "Q4 2023", score: 85 },
    { audit: "Q1 2024", score: 88 },
  ];

  return (
    <Card className="border-accent/50 bg-accent/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-accent" />
          AI-Powered Comparative Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Text Insights */}
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-4 w-4 text-status-medium mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold">3 recurring findings detected from previous audit (2023 Q4)</p>
              <p className="text-xs text-muted-foreground">
                Segregation of duties, approval logging, and password policy require immediate attention
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-4 w-4 text-status-high mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold">1 control from last audit has not been retested this time</p>
              <p className="text-xs text-muted-foreground">
                Data encryption controls (SC-28) were tested in Q4 2023 but are not included in current scope
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <TrendingUp className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold">Audit frequency pattern suggests quarterly cadence; current cycle delayed by 15 days</p>
              <p className="text-xs text-muted-foreground">
                Expected start date was Jan 1, 2024. Actual start date was Jan 15, 2024
              </p>
            </div>
          </div>
        </div>

        {/* Visualizations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
          {/* Findings Overlap */}
          <div>
            <h4 className="text-sm font-medium mb-3">Findings Overlap (Current vs Previous)</h4>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={overlapData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {overlapData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Readiness Trend */}
          <div>
            <h4 className="text-sm font-medium mb-3">Readiness Improvement Trend</h4>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={readinessTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="audit" fontSize={12} />
                <YAxis domain={[0, 100]} fontSize={12} />
                <Tooltip />
                <Bar dataKey="score" fill="hsl(var(--status-low))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
