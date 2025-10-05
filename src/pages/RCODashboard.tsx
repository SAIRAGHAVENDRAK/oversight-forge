import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockAudits, mockFindings, mockTrendData } from "@/data/mockData";
import { Brain, Download, FileText, TrendingUp, Clock, AlertCircle, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function RCODashboard() {
  const currentQuarter = "Q1 2025";
  const quarterAudits = mockAudits.length;
  const overdueFindings = mockFindings.filter(f => f.status === "overdue").length;
  const avgCycleTime = 28; // days
  const openFindings = mockFindings.filter(f => f.status !== "closed").length;
  const closedFindings = mockFindings.filter(f => f.status === "closed").length;

  const findingsByMonth = [
    { month: "Oct", resolved: 12, unresolved: 8 },
    { month: "Nov", resolved: 15, unresolved: 6 },
    { month: "Dec", resolved: 18, unresolved: 4 },
    { month: "Jan", resolved: 14, unresolved: 9 },
  ];

  const detailedFindings = mockFindings.map(finding => ({
    ...finding,
    daysOpen: finding.status === "closed" ? 0 : 
      Math.floor((new Date().getTime() - new Date(finding.identifiedDate).getTime()) / (1000 * 60 * 60 * 24)),
    comments: finding.comments?.length || 0,
  }));

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">RCO Operations Dashboard</h1>
          <p className="text-muted-foreground">Operational tracking of audit throughput and risk exposure</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Export Excel
          </Button>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Audits ({currentQuarter})</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{quarterAudits}</div>
            <p className="text-xs text-muted-foreground">Current quarter activity</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Overdue Findings</CardTitle>
            <AlertCircle className="h-4 w-4 text-status-critical" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-status-critical">{overdueFindings}</div>
            <p className="text-xs text-muted-foreground">Require immediate action</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg. Cycle Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgCycleTime} days</div>
            <p className="text-xs text-status-low">↓ 12% from last quarter</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Open vs Closed</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openFindings}:{closedFindings}</div>
            <p className="text-xs text-muted-foreground">Current ratio</p>
          </CardContent>
        </Card>
      </div>

      {/* AI Insight Panel */}
      <Card className="border-accent/50 bg-accent/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-accent" />
            AI Risk Predictions & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-status-critical mt-0.5" />
            <div>
              <p className="text-sm font-semibold">3 audits nearing SLA breach</p>
              <p className="text-xs text-muted-foreground">Finance, HR, and Access Management teams — expected breach in 5-7 days</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <TrendingUp className="h-5 w-5 text-accent mt-0.5" />
            <div>
              <p className="text-sm font-semibold">Resolution velocity increasing</p>
              <p className="text-xs text-muted-foreground">Based on current trends, expect 22 findings to close this week</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-status-low mt-0.5" />
            <div>
              <p className="text-sm font-semibold">Control validation improving</p>
              <p className="text-xs text-muted-foreground">85% of controls tested pass on first review, up from 72% last quarter</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trend Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Audits per Quarter</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="closed" stroke="hsl(var(--status-low))" strokeWidth={2} />
                <Line type="monotone" dataKey="opened" stroke="hsl(var(--accent))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resolved vs Unresolved by Month</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={findingsByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="resolved" fill="hsl(var(--status-low))" />
                <Bar dataKey="unresolved" fill="hsl(var(--status-medium))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Findings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Findings Tracker</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Audit ID</th>
                  <th className="text-left py-3 px-4 font-medium">Finding</th>
                  <th className="text-left py-3 px-4 font-medium">Risk Category</th>
                  <th className="text-left py-3 px-4 font-medium">Severity</th>
                  <th className="text-left py-3 px-4 font-medium">Assigned To</th>
                  <th className="text-left py-3 px-4 font-medium">Days Open</th>
                  <th className="text-left py-3 px-4 font-medium">Comments</th>
                </tr>
              </thead>
              <tbody>
                {detailedFindings.slice(0, 10).map((finding) => (
                  <tr key={finding.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4 font-mono text-sm">{finding.auditId}</td>
                    <td className="py-3 px-4">
                      <div className="max-w-xs truncate">{finding.title}</div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline">{finding.category}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={
                        finding.riskLevel === "critical" ? "destructive" :
                        finding.riskLevel === "high" ? "default" : "secondary"
                      }>
                        {finding.riskLevel}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">{finding.owner.name}</td>
                    <td className="py-3 px-4">
                      <span className={finding.daysOpen > 30 ? "text-status-critical font-semibold" : ""}>
                        {finding.daysOpen}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">{finding.comments}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
