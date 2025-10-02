import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockFindings, mockAudits } from "@/data/mockData";
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from "lucide-react";

export default function Analytics() {
  const totalFindings = mockFindings.length;
  const criticalFindings = mockFindings.filter(f => f.riskLevel === "critical").length;
  const highFindings = mockFindings.filter(f => f.riskLevel === "high").length;
  const mediumFindings = mockFindings.filter(f => f.riskLevel === "medium").length;
  const lowFindings = mockFindings.filter(f => f.riskLevel === "low").length;

  const openFindings = mockFindings.filter(f => f.status === "open").length;
  const inProgressFindings = mockFindings.filter(f => f.status === "in_progress").length;
  const resolvedFindings = mockFindings.filter(f => f.status === "resolved").length;
  const overdueFindings = mockFindings.filter(f => f.status === "overdue").length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Analytics & Risk Heatmap</h1>
        <p className="text-muted-foreground">Organization-wide audit and risk insights</p>
      </div>

      {/* Risk Distribution */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Risk Level Distribution</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6 border-status-critical">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Critical</p>
                <p className="text-3xl font-bold text-status-critical">{criticalFindings}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-status-critical" />
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-status-critical h-2 rounded-full" 
                style={{ width: `${(criticalFindings / totalFindings) * 100}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {((criticalFindings / totalFindings) * 100).toFixed(1)}% of total
            </p>
          </Card>

          <Card className="p-6 border-status-high">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-sm text-muted-foreground mb-1">High</p>
                <p className="text-3xl font-bold text-status-high">{highFindings}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-status-high" />
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-status-high h-2 rounded-full" 
                style={{ width: `${(highFindings / totalFindings) * 100}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {((highFindings / totalFindings) * 100).toFixed(1)}% of total
            </p>
          </Card>

          <Card className="p-6 border-status-medium">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Medium</p>
                <p className="text-3xl font-bold text-status-medium">{mediumFindings}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-status-medium" />
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-status-medium h-2 rounded-full" 
                style={{ width: `${(mediumFindings / totalFindings) * 100}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {((mediumFindings / totalFindings) * 100).toFixed(1)}% of total
            </p>
          </Card>

          <Card className="p-6 border-status-low">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Low</p>
                <p className="text-3xl font-bold text-status-low">{lowFindings}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-status-low" />
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-status-low h-2 rounded-full" 
                style={{ width: `${(lowFindings / totalFindings) * 100}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {((lowFindings / totalFindings) * 100).toFixed(1)}% of total
            </p>
          </Card>
        </div>
      </div>

      {/* Status Overview */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Finding Status Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Open</p>
            <p className="text-2xl font-bold">{openFindings}</p>
            <Badge variant="outline" className="mt-2">Requires action</Badge>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-1">In Progress</p>
            <p className="text-2xl font-bold text-status-info">{inProgressFindings}</p>
            <Badge className="mt-2 bg-status-info">Active remediation</Badge>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Resolved</p>
            <p className="text-2xl font-bold text-status-low">{resolvedFindings}</p>
            <Badge className="mt-2 bg-status-low">Completed</Badge>
          </Card>
          <Card className="p-6 border-status-medium">
            <p className="text-sm text-muted-foreground mb-1">Overdue</p>
            <p className="text-2xl font-bold text-status-medium">{overdueFindings}</p>
            <Badge className="mt-2 bg-status-medium">Needs attention</Badge>
          </Card>
        </div>
      </div>

      {/* Department Heatmap */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Department Risk Heatmap</h2>
        <Card className="p-6">
          <div className="space-y-4">
            {mockAudits.map((audit) => (
              <div key={audit.id} className="flex items-center gap-4">
                <div className="flex-1">
                  <p className="font-medium">{audit.department}</p>
                  <p className="text-sm text-muted-foreground">{audit.title}</p>
                </div>
                <div className="flex gap-2">
                  {audit.criticalCount > 0 && (
                    <Badge className="bg-status-critical">{audit.criticalCount} Critical</Badge>
                  )}
                  {audit.highCount > 0 && (
                    <Badge className="bg-status-high">{audit.highCount} High</Badge>
                  )}
                  {audit.mediumCount > 0 && (
                    <Badge className="bg-status-medium">{audit.mediumCount} Medium</Badge>
                  )}
                  {audit.lowCount > 0 && (
                    <Badge className="bg-status-low">{audit.lowCount} Low</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Predictive Insights */}
      <Card className="p-6 bg-accent/10 border-accent">
        <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-accent" />
          Predictive Insights
        </h3>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-accent">•</span>
            <span>Based on current trends, {Math.round(overdueFindings * 1.3)} additional findings may become overdue this month</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent">•</span>
            <span>IT Security audits show 25% higher critical findings rate compared to organizational average</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent">•</span>
            <span>Average resolution time for high-risk findings: 45 days (Target: 30 days)</span>
          </li>
        </ul>
      </Card>
    </div>
  );
}
