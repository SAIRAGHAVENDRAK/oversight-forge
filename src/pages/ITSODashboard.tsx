import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockAudits, mockFindings } from "@/data/mockData";
import { Brain, Download, FileText, Shield, Calendar, TrendingUp, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useNavigate } from "react-router-dom";

export default function ITSODashboard() {
  const navigate = useNavigate();
  const totalAudits = mockAudits.length;
  const soxAudits = mockAudits.filter(a => a.auditType.toLowerCase().includes("sox")).length;
  const controlsTested = mockAudits.reduce((sum, a) => sum + a.findingsCount, 0);
  const readinessScore = 85; // Calculated based on past performance

  // Mock audit history by application
  const auditHistory = [
    { app: "Payment Gateway", type: "SOX", scope: "Financial Controls", date: "2024-12-15", findings: 3, status: "completed", controls: 12 },
    { app: "User Management", type: "Security", scope: "Access Controls", date: "2024-11-20", findings: 5, status: "completed", controls: 18 },
    { app: "Data Warehouse", type: "Privacy", scope: "Data Protection", date: "2024-10-10", findings: 2, status: "completed", controls: 8 },
    { app: "API Gateway", type: "SOX", scope: "IT General Controls", date: "2024-09-15", findings: 4, status: "completed", controls: 15 },
    { app: "CRM System", type: "Compliance", scope: "Customer Data", date: "2024-08-05", findings: 1, status: "completed", controls: 10 },
  ];

  // Audit frequency data
  const auditFrequency = [
    { app: "Payment Gateway", count: 12 },
    { app: "User Management", count: 8 },
    { app: "Data Warehouse", count: 6 },
    { app: "API Gateway", count: 10 },
    { app: "CRM System", count: 5 },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">ITSO Application Dashboard</h1>
          <p className="text-muted-foreground">Historical audit data and readiness assessment for applications</p>
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
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Application Name" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Applications</SelectItem>
            <SelectItem value="payment">Payment Gateway</SelectItem>
            <SelectItem value="user">User Management</SelectItem>
            <SelectItem value="data">Data Warehouse</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Control Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Controls</SelectItem>
            <SelectItem value="access">Access Controls</SelectItem>
            <SelectItem value="financial">Financial Controls</SelectItem>
            <SelectItem value="data">Data Controls</SelectItem>
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
            <SelectItem value="privacy">Privacy</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="2024">
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2024">2024</SelectItem>
            <SelectItem value="2023">2023</SelectItem>
            <SelectItem value="2022">2022</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Audits Conducted</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAudits}</div>
            <p className="text-xs text-muted-foreground">Across all applications</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Recurring SOX Audits</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{soxAudits}</div>
            <p className="text-xs text-muted-foreground">Annual compliance audits</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Controls Tested</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{controlsTested}</div>
            <p className="text-xs text-muted-foreground">Total control points</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Readiness Score</CardTitle>
            <Target className="h-4 w-4 text-status-low" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-status-low">{readinessScore}%</div>
            <p className="text-xs text-muted-foreground">Audit preparedness</p>
          </CardContent>
        </Card>
      </div>

      {/* Audit Readiness Widget */}
      <Card className="border-accent/50 bg-accent/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-accent" />
            AI-Powered Audit Readiness Assessment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-status-low mt-2" />
            <div>
              <p className="text-sm font-semibold">Payment Gateway shows 85% readiness</p>
              <p className="text-xs text-muted-foreground">Based on 95% control closure rate and strong historical compliance</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-status-medium mt-2" />
            <div>
              <p className="text-sm font-semibold">User Management requires attention</p>
              <p className="text-xs text-muted-foreground">3 prior audit findings still open from last cycle — recommend review before next audit</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-accent mt-2" />
            <div>
              <p className="text-sm font-semibold">Next SOX cycle in 45 days</p>
              <p className="text-xs text-muted-foreground">Recommended preparation window opens in 2 weeks for optimal readiness</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Frequency Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Audit Frequency by Application</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={auditFrequency}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="app" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="hsl(var(--accent))" name="Audit Count" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Application Audit History Table */}
      <Card>
        <CardHeader>
          <CardTitle>Application Audit History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Audit Name</th>
                  <th className="text-left py-3 px-4 font-medium">Type</th>
                  <th className="text-left py-3 px-4 font-medium">Scope</th>
                  <th className="text-left py-3 px-4 font-medium">Date</th>
                  <th className="text-left py-3 px-4 font-medium">Findings</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-left py-3 px-4 font-medium">Controls Tested</th>
                </tr>
              </thead>
              <tbody>
                {auditHistory.map((audit, index) => (
                  <tr 
                    key={index} 
                    className="border-b hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/itso-dashboard/app/${audit.app.toLowerCase().replace(/\s+/g, '-')}`)}
                  >
                    <td className="py-3 px-4 font-semibold">{audit.app}</td>
                    <td className="py-3 px-4">
                      <Badge variant="outline">{audit.type}</Badge>
                    </td>
                    <td className="py-3 px-4">{audit.scope}</td>
                    <td className="py-3 px-4 text-sm">
                      {new Date(audit.date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={audit.findings > 3 ? "text-status-medium font-semibold" : ""}>
                        {audit.findings}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="default">{audit.status}</Badge>
                    </td>
                    <td className="py-3 px-4 text-center">{audit.controls}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Control Maturity Assessment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-status-low" />
            Control Maturity Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Access Controls</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-status-low" style={{ width: "92%" }} />
                </div>
                <span className="text-sm text-muted-foreground w-12">92%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Financial Controls</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-status-low" style={{ width: "88%" }} />
                </div>
                <span className="text-sm text-muted-foreground w-12">88%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Data Protection</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-status-medium" style={{ width: "75%" }} />
                </div>
                <span className="text-sm text-muted-foreground w-12">75%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Change Management</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-status-low" style={{ width: "90%" }} />
                </div>
                <span className="text-sm text-muted-foreground w-12">90%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
