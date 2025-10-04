import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { mockFindings } from "@/data/mockData";
import { Calendar, Mail, TrendingDown, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface OwnerDetailsDrawerProps {
  open: boolean;
  onClose: () => void;
  ownerId: string | null;
  ownerName: string;
}

export function OwnerDetailsDrawer({ open, onClose, ownerId, ownerName }: OwnerDetailsDrawerProps) {
  const navigate = useNavigate();
  
  // Filter findings for selected owner
  const ownerFindings = mockFindings.filter(f => f.owner.id === ownerId);
  const openFindings = ownerFindings.filter(f => f.status === "open" || f.status === "overdue");
  const overdueFindings = ownerFindings.filter(f => f.status === "overdue");
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "bg-status-info";
      case "in_progress": return "bg-status-medium";
      case "resolved": return "bg-status-low";
      case "overdue": return "bg-status-high";
      default: return "bg-muted";
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "critical": return "bg-status-critical";
      case "high": return "bg-status-high";
      case "medium": return "bg-status-medium";
      case "low": return "bg-status-low";
      default: return "bg-muted";
    }
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-2xl">{ownerName}</SheetTitle>
          <SheetDescription>
            Owner accountability and performance details
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-muted">
              <p className="text-sm text-muted-foreground mb-1">Total</p>
              <p className="text-2xl font-bold">{ownerFindings.length}</p>
            </div>
            <div className="p-4 rounded-lg bg-status-info/10">
              <p className="text-sm text-muted-foreground mb-1">Open</p>
              <p className="text-2xl font-bold text-status-info">{openFindings.length}</p>
            </div>
            <div className="p-4 rounded-lg bg-status-high/10">
              <p className="text-sm text-muted-foreground mb-1">Overdue</p>
              <p className="text-2xl font-bold text-status-high">{overdueFindings.length}</p>
            </div>
          </div>

          <Separator />

          {/* Open & Overdue Findings */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Open & Overdue Findings</h3>
              <Button variant="outline" size="sm">
                <Mail className="h-4 w-4 mr-2" />
                Send Reminder
              </Button>
            </div>
            <div className="space-y-3">
              {openFindings.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No open or overdue findings
                </p>
              ) : (
                openFindings.map((finding) => (
                  <div 
                    key={finding.id} 
                    className="p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors cursor-pointer"
                    onClick={() => {
                      navigate(`/findings/${finding.id}`);
                      onClose();
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm">{finding.title}</h4>
                      <Badge className={getStatusColor(finding.status)}>
                        {finding.status.replace("_", " ").toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Due: {new Date(finding.targetCloseDate).toLocaleDateString()}
                      </div>
                      <Badge variant="outline" className={getRiskColor(finding.riskLevel)}>
                        {finding.riskLevel.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <Separator />

          {/* Activity Timeline */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 h-8 w-8 rounded-full bg-status-info/10 flex items-center justify-center">
                  <Mail className="h-4 w-4 text-status-info" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Reminder sent</p>
                  <p className="text-xs text-muted-foreground">2 days ago - 3 findings</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 h-8 w-8 rounded-full bg-status-low/10 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-status-low" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Finding closed</p>
                  <p className="text-xs text-muted-foreground">5 days ago - FND-2024-0123</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 h-8 w-8 rounded-full bg-status-medium/10 flex items-center justify-center">
                  <TrendingDown className="h-4 w-4 text-status-medium" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Status updated</p>
                  <p className="text-xs text-muted-foreground">1 week ago - 2 findings marked in progress</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
