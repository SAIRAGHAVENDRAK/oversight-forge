import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { KPICard } from "@/components/dashboard/KPICard";
import { AccountabilityTable } from "@/components/ownership/AccountabilityTable";
import { OwnerBarChart } from "@/components/ownership/OwnerBarChart";
import { DeptHeatmap } from "@/components/ownership/DeptHeatmap";
import { InsightPanel } from "@/components/ownership/InsightPanel";
import { OwnerDetailsDrawer } from "@/components/ownership/OwnerDetailsDrawer";
import { 
  mockOwnerMetrics, 
  mockOwnerChartData, 
  mockDeptMetrics 
} from "@/data/mockData";
import { KPIMetric } from "@/types/audit";
import { Download, FileBarChart, Clock, TrendingUp, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Ownership() {
  const { toast } = useToast();
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedOwnerId, setSelectedOwnerId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Calculate aggregate KPIs
  const totalAssignedFindings = mockOwnerMetrics.reduce((sum, owner) => sum + owner.totalFindings, 0);
  const totalClosedFindings = mockOwnerMetrics.reduce((sum, owner) => sum + owner.closedFindings, 0);
  const totalOverdueFindings = mockOwnerMetrics.reduce((sum, owner) => sum + owner.overdueFindings, 0);
  const avgClosureTime = Math.round(
    mockOwnerMetrics.reduce((sum, owner) => sum + owner.avgClosureTime, 0) / mockOwnerMetrics.length
  );
  const avgOnTimeRate = Math.round(
    mockOwnerMetrics.reduce((sum, owner) => sum + owner.onTimeRate, 0) / mockOwnerMetrics.length
  );
  const escalationCount = mockOwnerMetrics.filter(owner => owner.overdueFindings > 3).length;

  const kpiMetrics: KPIMetric[] = [
    {
      label: "Total Assigned Findings",
      value: totalAssignedFindings,
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
      label: "On-Time Closure Rate",
      value: avgOnTimeRate,
      unit: "%",
      trend: "up",
      icon: "TrendingUp",
      color: "low"
    },
    {
      label: "Escalations",
      value: escalationCount,
      trend: "stable",
      icon: "AlertTriangle",
      color: "high"
    }
  ];

  // Insights data
  const topPerformers = mockOwnerMetrics
    .filter(owner => owner.performanceScore >= 80)
    .sort((a, b) => b.performanceScore - a.performanceScore)
    .slice(0, 3)
    .map(owner => ({ name: owner.name, score: owner.performanceScore }));

  const needsAttention = mockOwnerMetrics
    .filter(owner => (owner.overdueFindings / owner.totalFindings) * 100 > 15)
    .map(owner => ({ 
      name: owner.name, 
      overdueRate: Math.round((owner.overdueFindings / owner.totalFindings) * 100) 
    }));

  const suggestedActions = [
    {
      action: "Schedule review with IT Department - Overdue rate above 15%",
      priority: "high" as const
    },
    {
      action: "Send bulk reminder to owners with >3 overdue findings",
      priority: "high" as const
    },
    {
      action: "Recognize Legal team for 100% on-time closure rate",
      priority: "low" as const
    }
  ];

  const handleExport = (format: "pdf" | "excel") => {
    toast({
      title: `Exporting as ${format.toUpperCase()}`,
      description: "Your ownership report is being generated...",
    });
  };

  const handleSelectOwner = (ownerId: string) => {
    setSelectedOwnerId(ownerId);
    setDrawerOpen(true);
  };

  const selectedOwner = mockOwnerMetrics.find(owner => owner.ownerId === selectedOwnerId);

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Ownership & Accountability</h1>
          <p className="text-muted-foreground">Performance metrics and accountability tracking</p>
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
                <SelectItem value="internal_audit">Internal Audit</SelectItem>
                <SelectItem value="it">IT</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
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
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Performance</label>
            <Select defaultValue="all">
              <SelectTrigger>
                <SelectValue placeholder="All Performance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Performance</SelectItem>
                <SelectItem value="high">High (80%+)</SelectItem>
                <SelectItem value="medium">Medium (60-79%)</SelectItem>
                <SelectItem value="low">Low (&lt;60%)</SelectItem>
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

      {/* Summary KPIs */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Key Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiMetrics.map((metric, index) => (
            <KPICard key={index} metric={metric} />
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OwnerBarChart data={mockOwnerChartData} onSelectOwner={handleSelectOwner} />
        <DeptHeatmap data={mockDeptMetrics} />
      </div>

      {/* Leaderboard */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Accountability Leaderboard</h2>
        <AccountabilityTable data={mockOwnerMetrics} onSelectOwner={handleSelectOwner} />
      </div>

      {/* Insights */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Insights & Recommendations</h2>
        <InsightPanel
          topPerformers={topPerformers}
          needsAttention={needsAttention}
          suggestedActions={suggestedActions}
        />
      </div>

      {/* Owner Details Drawer */}
      <OwnerDetailsDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        ownerId={selectedOwnerId}
        ownerName={selectedOwner?.name || ""}
      />
    </div>
  );
}
