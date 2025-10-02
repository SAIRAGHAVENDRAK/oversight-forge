import { KPICard } from "@/components/dashboard/KPICard";
import { AlertCard } from "@/components/dashboard/AlertCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockKPIs, mockAlerts, mockFindings } from "@/data/mockData";
import { ArrowRight, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FindingCard } from "@/components/findings/FindingCard";

export default function Dashboard() {
  const navigate = useNavigate();
  const recentFindings = mockFindings.slice(0, 3);
  const activeAlerts = mockAlerts.filter(a => a.status === "active");

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Audit Dashboard</h1>
        <p className="text-muted-foreground">Real-time overview of audit activities and findings</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {mockKPIs.map((metric, index) => (
          <KPICard key={index} metric={metric} />
        ))}
      </div>

      {/* System Status */}
      <Card className="p-6 bg-status-low/10 border-status-low">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-status-low animate-pulse" />
          <p className="font-semibold text-status-low-foreground">All Systems Connected</p>
          <span className="text-sm text-muted-foreground ml-auto">Last updated: 2 minutes ago</span>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Findings */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-status-high" />
              Recent Findings
            </h2>
            <Button variant="ghost" onClick={() => navigate("/findings")}>
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-3">
            {recentFindings.map((finding) => (
              <FindingCard key={finding.id} finding={finding} />
            ))}
          </div>
        </div>

        {/* Live Alerts */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Live Alerts</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate("/alerts")}>
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-3">
            {activeAlerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
