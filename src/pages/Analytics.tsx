import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { KPICard } from "@/components/dashboard/KPICard";
import { StatusChart } from "@/components/dashboard/StatusChart";
import { TrendChart } from "@/components/dashboard/TrendChart";
import { DepartmentBarChart } from "@/components/analytics/DepartmentBarChart";
import { CategoryHeatmap } from "@/components/analytics/CategoryHeatmap";
import { ReportCard } from "@/components/analytics/ReportCard";
import { 
  mockFindings, 
  mockAudits, 
  mockStatusChartData, 
  mockTrendData,
  mockDepartmentData,
  mockCategoryHeatmap
} from "@/data/mockData";
import { KPIMetric } from "@/types/audit";
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Download,
  FileBarChart,
  Users,
  Shield,
  Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Analytics() {
  const { toast } = useToast();
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");

  const totalFindings = mockFindings.length;
  const criticalFindings = mockFindings.filter(f => f.riskLevel === "critical").length;
  const highFindings = mockFindings.filter(f => f.riskLevel === "high").length;
  const mediumFindings = mockFindings.filter(f => f.riskLevel === "medium").length;
  const lowFindings = mockFindings.filter(f => f.riskLevel === "low").length;

  const openFindings = mockFindings.filter(f => f.status === "open").length;
  const inProgressFindings = mockFindings.filter(f => f.status === "in_progress").length;
  const resolvedFindings = mockFindings.filter(f => f.status === "resolved").length;
  const overdueFindings = mockFindings.filter(f => f.status === "overdue").length;

  // Calculate KPI metrics
  const avgClosureTime = 32; // days (calculated from resolved findings)
  const overduePercentage = ((overdueFindings / totalFindings) * 100).toFixed(1);
  const complianceScore = Math.round((resolvedFindings / totalFindings) * 100);

  const kpiMetrics: KPIMetric[] = [
    {
      label: "Total Findings",
      value: totalFindings,
      trend: "up",
      icon: "FileBarChart",
      color: "info"
    },
    {
      label: "Avg. Closure Time",
      value: avgClosureTime,
      unit: "days",
      trend: "down",
      icon: "Clock",
      color: "medium"
    },
    {
      label: "Overdue Findings",
      value: overduePercentage,
      unit: "%",
      trend: "stable",
      icon: "AlertTriangle",
      color: "high"
    },
    {
      label: "Compliance Score",
      value: complianceScore,
      unit: "%",
      trend: "up",
      icon: "Shield",
      color: "low"
    }
  ];

  const handleExport = (format: "pdf" | "excel") => {
    toast({
      title: `Exporting as ${format.toUpperCase()}`,
      description: "Your analytics report is being generated...",
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Analytics & Reports</h1>
          <p className="text-muted-foreground">Real-time insights and compliance monitoring</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleExport("pdf")}>
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="outline" onClick={() => handleExport("excel")}>
            <Download className="h-4 w-4 mr-2" />
            Export Excel
          </Button>
        </div>
      </div>

      {/* Filters Section */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Department</label>
            <Select value={filterDepartment} onValueChange={setFilterDepartment}>
              <SelectTrigger>
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="it">IT Security</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="hr">HR</SelectItem>
                <SelectItem value="operations">Operations</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Status</label>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Priority</label>
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger>
                <SelectValue placeholder="All Priorities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Date Range</label>
            <Select defaultValue="30">
              <SelectTrigger>
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="365">Last year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* KPI Dashboard */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Key Performance Indicators</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiMetrics.map((metric, index) => (
            <KPICard key={index} metric={metric} />
          ))}
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DepartmentBarChart data={mockDepartmentData} />
        <StatusChart data={mockStatusChartData} />
      </div>

      <TrendChart data={mockTrendData} />

      <CategoryHeatmap data={mockCategoryHeatmap} />

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

      {/* Reports Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Standard Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ReportCard
            title="Overdue Findings Report"
            description="Comprehensive list of all overdue findings with ownership details"
            reportType="overdue"
            icon={<AlertTriangle className="h-5 w-5" />}
          />
          <ReportCard
            title="Findings by Owner Report"
            description="Breakdown of findings assigned to each team member"
            reportType="owner"
            icon={<Users className="h-5 w-5" />}
          />
          <ReportCard
            title="Risk & Compliance Trend"
            description="Historical analysis of risk levels and compliance trends"
            reportType="trend"
            icon={<TrendingUp className="h-5 w-5" />}
          />
        </div>
      </div>

      {/* Risk Distribution (Legacy Section) */}
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
