import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockAudits, mockFindings } from "@/data/mockData";
import { Brain, Download, FileText, AlertTriangle, Users, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function CIODashboard() {
  const activeAudits = mockAudits.filter(a => a.status === "in_progress").length;
  const pendingFindings = mockFindings.filter(f => f.status === "open" || f.status === "in_progress").length;
  const auditOwners = new Set(mockAudits.map(a => a.leadAuditor.name)).size;
  const escalations = mockFindings.filter(f => f.status === "overdue" && f.riskLevel === "critical").length;

  const portfolioData = mockAudits.map(audit => {
    const auditFindings = mockFindings.filter(f => f.auditId === audit.id);
    const closedFindings = auditFindings.filter(f => f.status === "closed").length;
    const totalFindings = auditFindings.length;
    const progress = totalFindings > 0 ? Math.round((closedFindings / totalFindings) * 100) : 0;
    
    return {
      ...audit,
      progress,
      totalFindings,
      closedFindings,
    };
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">CIO Executive Dashboard</h1>
          <p className="text-muted-foreground">Strategic portfolio view with AI-driven insights</p>
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

      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Business Unit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Units</SelectItem>
            <SelectItem value="it">IT</SelectItem>
            <SelectItem value="finance">Finance</SelectItem>
            <SelectItem value="hr">HR</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Audit Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="sox">SOX</SelectItem>
            <SelectItem value="security">Security</SelectItem>
            <SelectItem value="compliance">Compliance</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Owner" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Owners</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Audits</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeAudits}</div>
            <p className="text-xs text-muted-foreground">Across all business units</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Findings</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingFindings}</div>
            <p className="text-xs text-muted-foreground">Requiring attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Audit Owners</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{auditOwners}</div>
            <p className="text-xs text-muted-foreground">Active contributors</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Escalations (30d)</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-status-critical">{escalations}</div>
            <p className="text-xs text-muted-foreground">Critical overdue items</p>
          </CardContent>
        </Card>
      </div>

      {/* AI-Powered Insights */}
      <Card className="border-accent/50 bg-accent/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-accent" />
            AI-Powered Executive Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-accent mt-2" />
            <p className="text-sm">
              <strong>50% of open findings</strong> are expected to close by next week based on current velocity and owner engagement.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-status-medium mt-2" />
            <p className="text-sm">
              <strong>Applications in the Payments domain</strong> show the slowest resolution trend with average closure time of 45 days.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-status-low mt-2" />
            <p className="text-sm">
              <strong>Risk Team performance</strong> is trending 20% above average with 85% on-time closure rate.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Portfolio View Table */}
      <Card>
        <CardHeader>
          <CardTitle>Audit Portfolio Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Audit ID</th>
                  <th className="text-left py-3 px-4 font-medium">Title</th>
                  <th className="text-left py-3 px-4 font-medium">Owner</th>
                  <th className="text-left py-3 px-4 font-medium">Progress</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-left py-3 px-4 font-medium">Expected Closure</th>
                </tr>
              </thead>
              <tbody>
                {portfolioData.map((audit) => (
                  <tr key={audit.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4 font-mono text-sm">{audit.id}</td>
                    <td className="py-3 px-4">{audit.title}</td>
                    <td className="py-3 px-4">{audit.leadAuditor.name}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-accent transition-all" 
                            style={{ width: `${audit.progress}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground">{audit.progress}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={
                        audit.status === "completed" ? "default" :
                        audit.status === "in_progress" ? "secondary" : "outline"
                      }>
                        {audit.status.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {new Date(audit.endDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Escalation Contact Section */}
      <Card>
        <CardHeader>
          <CardTitle>Escalation Contacts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-1">IT Security</h4>
              <p className="text-sm text-muted-foreground">security@company.com</p>
              <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-1">Finance & Compliance</h4>
              <p className="text-sm text-muted-foreground">compliance@company.com</p>
              <p className="text-sm text-muted-foreground">+1 (555) 234-5678</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-1">Risk Management</h4>
              <p className="text-sm text-muted-foreground">risk@company.com</p>
              <p className="text-sm text-muted-foreground">+1 (555) 345-6789</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
