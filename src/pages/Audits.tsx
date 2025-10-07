import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { mockAudits } from "@/data/mockData";
import { Plus, Calendar, User, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { NewAuditDialog } from "@/components/audits/NewAuditDialog";
import { AuditFindingsDrawer } from "@/components/audits/AuditFindingsDrawer";
import { Audit } from "@/types/audit";

export default function Audits() {
  const [showNewAuditDialog, setShowNewAuditDialog] = useState(false);
  const [selectedAudit, setSelectedAudit] = useState<Audit | null>(null);
  const [showFindingsDrawer, setShowFindingsDrawer] = useState(false);

  const handleAuditClick = (audit: Audit) => {
    setSelectedAudit(audit);
    setShowFindingsDrawer(true);
  };
  const statusColorMap: Record<string, "default" | "secondary" | "outline"> = {
    planned: "outline",
    in_progress: "default",
    completed: "secondary",
    cancelled: "destructive" as any,
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Audits</h1>
          <p className="text-muted-foreground">Manage and track all audit engagements</p>
        </div>
        <Button className="bg-accent hover:bg-accent/90" onClick={() => setShowNewAuditDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Audit
        </Button>
      </div>

      {/* New Audit Dialog */}
      <NewAuditDialog open={showNewAuditDialog} onOpenChange={setShowNewAuditDialog} />

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground mb-1">Total Audits</p>
          <p className="text-2xl font-bold">{mockAudits.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground mb-1">In Progress</p>
          <p className="text-2xl font-bold text-status-info">
            {mockAudits.filter(a => a.status === "in_progress").length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground mb-1">Completed</p>
          <p className="text-2xl font-bold text-status-low">
            {mockAudits.filter(a => a.status === "completed").length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground mb-1">Total Findings</p>
          <p className="text-2xl font-bold">
            {mockAudits.reduce((sum, a) => sum + a.findingsCount, 0)}
          </p>
        </Card>
      </div>

      {/* Audit Findings Drawer */}
      <AuditFindingsDrawer 
        audit={selectedAudit} 
        open={showFindingsDrawer} 
        onOpenChange={setShowFindingsDrawer} 
      />

      {/* Audits List */}
      <div className="space-y-4">
        {mockAudits.map((audit) => (
          <Card 
            key={audit.id} 
            className="p-6 hover:shadow-lg transition-all cursor-pointer"
            onClick={() => handleAuditClick(audit)}
          >
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-mono text-muted-foreground">{audit.id}</span>
                    <Badge variant={statusColorMap[audit.status]}>
                      {audit.status.replace("_", " ").toUpperCase()}
                    </Badge>
                    <Badge variant="outline">{audit.auditType}</Badge>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{audit.title}</h3>
                  <p className="text-sm text-muted-foreground">{audit.description}</p>
                </div>
              </div>

              {/* Progress */}
              {audit.status === "in_progress" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{audit.completionPercentage}%</span>
                  </div>
                  <Progress value={audit.completionPercentage} className="h-2" />
                </div>
              )}

              {/* Findings Summary */}
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Findings:</span>
                  <span className="font-semibold">{audit.findingsCount}</span>
                </div>
                {audit.criticalCount > 0 && (
                  <Badge variant="destructive" className="bg-status-critical">
                    {audit.criticalCount} Critical
                  </Badge>
                )}
                {audit.highCount > 0 && (
                  <Badge className="bg-status-high text-status-high-foreground">
                    {audit.highCount} High
                  </Badge>
                )}
                {audit.mediumCount > 0 && (
                  <Badge className="bg-status-medium text-status-medium-foreground">
                    {audit.mediumCount} Medium
                  </Badge>
                )}
                {audit.lowCount > 0 && (
                  <Badge className="bg-status-low text-status-low-foreground">
                    {audit.lowCount} Low
                  </Badge>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center gap-6 pt-4 border-t border-border text-sm">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Lead:</span>
                  <span className="font-medium">{audit.leadAuditor.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {format(new Date(audit.startDate), "MMM dd")} - {format(new Date(audit.endDate), "MMM dd, yyyy")}
                  </span>
                </div>
                <div className="ml-auto">
                  <Badge variant="outline">{audit.department}</Badge>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
